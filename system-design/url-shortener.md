# System Design: URL Shortener

## 1. Requirements

Design a service that takes a long URL and returns a short one; visiting the short URL redirects to
the original. Used as a baseline exercise because its scope is small enough to go deep on every
section instead of staying superficial on all of them — the interesting parts are ID generation,
the read/write ratio, and cache design, not the surface feature.

## 2. Functional requirements

- Given a long URL, generate a short URL (`https://sho.rt/{code}`).
- Visiting `https://sho.rt/{code}` issues an HTTP redirect (301 or 302 — see §14) to the original URL.
- A user may optionally supply a custom alias.
- Links optionally expire after a configurable TTL.
- Basic click analytics (count, referrer, timestamp) — explicitly out of scope for the initial
  design; noted in §17.

## 3. Non-functional requirements

- **Read-heavy**: redirects vastly outnumber creations. Assumed ratio 100:1 (see §5).
- **Low redirect latency**: the redirect is on the critical path of someone else's page load or
  click; target p99 under 100 ms.
- **High availability for redirects** — an existing short link should resolve even if the creation
  path is degraded. Availability for creation matters less.
- **Uniqueness**: no two long URLs are silently assigned the same code (collisions are a
  correctness bug, not a performance concern).
- **Not required**: strong consistency on click analytics, exact global ordering of link creation.

## 4. Assumptions

Declared explicitly rather than invented as precise requirements, per the playbook's system design
template:

- 100M new short links created per month.
- Read:write ratio of 100:1 (a plausible range for link shorteners; some services see 1000:1 —
  100:1 is a deliberately conservative assumption that still makes the design read-optimized).
- Average long URL length: 100 bytes. Short code: 7 characters.
- Links are not deleted in bulk; expiration is per-link and lazy (checked at read time), not a
  background sweep, to avoid a write-heavy cleanup job on a read-optimized system.
- No requirement for the short code to be sequential or guessable — arguably a security plus (see §14).

## 5. Capacity estimation

- Writes: 100M / month ≈ 39 links/sec average. Assume peak is 5x average → ~195 writes/sec peak.
- Reads: 100:1 ratio → ~3,900 redirects/sec average, ~19,500/sec peak.
- Storage per link: ~100 bytes (long URL) + 7 bytes (code) + metadata (timestamps, owner, TTL) ≈
  150 bytes. At 100M/month, ~1.2B links over 10 years → ~180 GB of link data. Small enough that the
  entire dataset could theoretically fit in a large cache tier, which shapes the caching decision in
  §6.
- Code space: base62 (`[A-Za-z0-9]`) at 7 characters gives 62^7 ≈ 3.5 trillion codes — orders of
  magnitude more than the 1.2B needed over 10 years, so collision probability from the encoding
  space itself is not a practical concern; the concern is generation strategy (§6), not space size.

## 6. High-level architecture

```mermaid
flowchart LR
    Client -->|POST /links| API[API service]
    Client -->|GET /r/{code}| API
    API -->|write| DB[(Primary DB)]
    API -->|read, cache miss| DB
    API <-->|read/write, cache hit path| Cache[(Redis)]
    API -->|reserve ID range| IDGen[ID generator service]
```

This diagram answers: *where does the read-heavy assumption actually change the architecture?*
The redirect path (`GET /r/{code}`) checks cache first and only falls through to the primary DB on
a miss, while the creation path (`POST /links`) always writes through — reads and writes are
architecturally asymmetric on purpose, because the non-functional requirement (§3) only demands low
latency and high availability on one of them.

**ID generation** is the one component that needs its own box: a naive `hash(long_url)` risks
collisions on retry/duplicate submission, and a naive auto-increment primary key doesn't work once
the DB is sharded (§10). I use a **range-allocation counter**: each API instance reserves a block of
IDs (e.g., 10,000) from a small, highly-available counter service backed by a single row with an
atomic increment, then hands out IDs from its local block without a coordination round-trip per
request. IDs are base62-encoded into the 7-character code. This is the same idea as a Snowflake-style
generator but simpler, because global time-ordering isn't a requirement here (§4) — only uniqueness
and avoiding a network call per creation.

## 7. Data model

```text
links
  code          varchar(7)   primary key
  long_url      text         not null
  created_at    timestamptz  not null
  expires_at    timestamptz  null
  owner_id      bigint       null

id_ranges                      -- backs the range-allocation ID generator
  server_id     varchar        primary key
  next_free     bigint         not null
  range_size    bigint         not null default 10000
```

`code` is the primary key and the only field on the hot read path — every redirect is a
point lookup by primary key, which is exactly what both the cache and the DB's index are optimized
for.

## 8. API design

```text
POST /links
  body: { "long_url": "...", "custom_alias": "...", "ttl_seconds": ... }
  201: { "code": "aZ3kP9q", "short_url": "https://sho.rt/aZ3kP9q" }
  409: alias already taken (only relevant path with a uniqueness conflict — see §14)

GET /r/{code}
  301/302 -> long_url
  404: not found or expired
```

## 9. Communication model

Both endpoints are synchronous request/response — a redirect has no meaningful async form, and link
creation is fast enough (one ID range check, one insert) that making it asynchronous would add
complexity (a job, a poll/webhook for the result) with no latency benefit for the caller.

## 10. Scaling strategy

- **Redirect path**: stateless API instances behind a load balancer, scaled horizontally on request
  rate. The cache tier (Redis, or a CDN edge cache for the redirect response itself) absorbs the
  vast majority of the 19,500/sec peak read load — with the whole dataset small enough to mostly fit
  in cache (§5), cache hit rate should be very high, and DB read load stays low even at peak.
- **Creation path**: the ID range allocator is the one component that could become a bottleneck if
  every request round-tripped to it — solved by handing out ranges (§6), not individual IDs, so at
  195 writes/sec peak the range service sees a request only once per 10,000 creations.
- **Database**: sharded by `code` prefix once a single primary can no longer hold the write or read
  volume — because lookups are always by exact `code`, prefix-based sharding routes every request to
  exactly one shard with no fan-out, unlike sharding by `owner_id` or `created_at`, which would
  require a scatter-gather for the code-lookup path that the system is optimized around.

## 11. Consistency model

Strong consistency between a write and the next read of the *same* code is required — a client that
just created a link and immediately visits it must not get a 404. This is satisfied by writing
through the cache (or invalidating it) on creation, not by relying on eventual cache propagation.
Beyond that single-key guarantee, there's no cross-link consistency requirement — two different
links being created concurrently have no ordering constraint on each other.

## 12. Failure handling

- **Cache down**: redirect path falls back to the DB directly. Latency degrades (§3's 100 ms target
  is at risk) but availability doesn't — this is exactly why the non-functional requirement was
  "high availability for redirects," not "low latency at any cost."
- **ID range allocator down**: API instances that already hold an unexhausted local range keep
  serving creates; only an instance that has exhausted its range and needs a new one is blocked.
  Given ranges of 10,000 and 195 writes/sec peak, a single instance's range lasts minutes even at
  peak load, giving real headroom to recover the allocator before creation actually stalls.
- **DB primary down**: creation path fails (acceptable per §3); redirect path continues serving from
  cache and read replicas.

## 13. Observability

- Cache hit ratio on the redirect path — the single most important number, since it's the whole
  reason redirect latency stays low; a sustained drop is the earliest signal of a capacity or
  eviction problem before p99 latency itself moves.
- Redirect p50/p99 latency, split by cache hit vs miss, to distinguish "cache is fine but slow" from
  "cache hit rate dropped."
- ID range allocator: time since last successful range allocation per instance, to catch it drifting
  toward exhaustion before a create request actually fails.
- Correlation ID on every request (see [`observability/correlation-ids.md`](../observability/README.md))
  to trace a specific redirect or creation across cache, DB, and load balancer logs.

## 14. Security

- **Non-sequential codes as a side effect, not a security control**: base62-encoded IDs from a
  range allocator are not trivially enumerable in order across ranges handed to different
  instances, which incidentally makes scraping all links harder — but this is not relied upon as an
  access control; links containing sensitive destinations need actual authorization, not obscurity.
- **Open redirect risk**: the service is, by design, a URL that redirects anywhere — it will be used
  to disguise phishing links behind a trusted-looking domain. Mitigation: a malicious-URL check
  (blocklist/reputation API) at creation time, and defaulting to `302` rather than `301` for
  redirects so that a link later found to be malicious can be disabled without every browser and
  CDN having permanently cached the old redirect target.
- **Rate limiting on creation** (see [`resilience/`](../resilience/README.md)) to prevent the
  creation endpoint being used to enumerate the ID range or exhaust storage.

## 15. Cost considerations

Storage is cheap at this scale (§5: ~180 GB over 10 years) and is not the cost driver. The dominant
cost is the cache tier sized to hold most of the working set in memory at the 19,500/sec peak read
rate — sizing that tier correctly is a bigger lever on both cost and latency than anything on the
write path, which is why §10's scaling strategy treats reads and writes asymmetrically.

## 16. Alternatives

- **Hash-based codes** (`base62(md5(long_url))[:7]`) instead of a counter: avoids a dependency on an
  ID generator, but requires handling truncated-hash collisions (two different URLs, same 7-char
  prefix) with a retry-with-salt loop, and produces a *deterministic* code for a *duplicate*
  submission of the same URL — which sounds convenient until two different users expect two
  different (possibly later independently expiring) links for the same URL and get one.
- **Single global auto-increment counter** instead of range allocation: simpler, but every creation
  becomes a round trip to one component, and it doesn't shard — rejected once creation throughput or
  multi-region deployment is a real requirement, though it would be a reasonable simplification for
  a much smaller system.

## 17. Evolution path

- Add click analytics as an asynchronous pipeline (redirect emits an event, a separate consumer
  aggregates) rather than a synchronous write on the hot redirect path — keeping the redirect's
  latency profile from §3 intact as the feature is added.
- Multi-region: the range allocator would need a per-region range space (partition the ID space by
  region prefix) to avoid a cross-region round trip on every range refill.
- Custom-domain support (`go.company.com/{code}`) mostly changes the lookup key rather than the
  core design — the redirect path's asymmetric read/write architecture is unaffected.
