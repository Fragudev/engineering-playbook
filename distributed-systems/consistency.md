# Consistency

## Problem

[CAP theorem](cap-theorem.md) treats consistency as one binary — linearizable or not — which is
accurate for the specific trade-off CAP describes but hides that "consistency" actually names a
spectrum of guarantees, each with a different cost and a different set of anomalies it rules out.
Picking "strong consistency" or "eventual consistency" as a single system-wide label skips past the
real design question: which specific guarantee does *this* operation need, given that stronger
guarantees are more expensive the further they are from a single-node system's natural behavior.

## Key concepts

- **Linearizability (strong consistency)**: every operation appears to take effect atomically at
  some point between its start and end, and all clients see operations in the same real-time order —
  the strongest practical guarantee, behaving as if there were only one copy of the data, at the
  highest coordination cost.
- **Sequential consistency**: all clients see operations in the *same* order, but that order doesn't
  have to match real time — weaker than linearizability, still strong enough to reason about as "one
  agreed-upon history," cheaper because it doesn't need real-time coordination.
- **Causal consistency**: operations that are causally related (a reply to a comment) are seen by
  everyone in the same order; causally unrelated operations can be seen in different orders by
  different clients. Cheaper than sequential consistency because it only needs to track causal
  dependencies, not a single total order over everything.
- **Read-your-writes and monotonic reads**: two specific, narrower guarantees often bundled with
  eventual consistency to make it usable in practice — a client always sees its own prior writes, and
  a client's successive reads never move backward in time — neither requires full linearizability,
  but both rule out anomalies that would otherwise look like obvious bugs to an end user.

## Design

```mermaid
flowchart LR
    Linear["Linearizable<br/>(strongest, most expensive)"] --> Seq["Sequential"]
    Seq --> Causal["Causal"]
    Causal --> RYW["Read-your-writes /<br/>monotonic reads"]
    RYW --> Eventual["Eventual<br/>(weakest, cheapest)"]
```

This diagram answers: *is "eventual consistency" the only alternative to full linearizability, or
are there real options in between?* There's a genuine spectrum, and each step down trades away a
specific guarantee for a specific reduction in coordination cost — sequential consistency drops
real-time ordering but keeps one agreed history; causal consistency further drops ordering between
unrelated operations; read-your-writes keeps only the one guarantee that matters most for a single
user's own experience. Choosing "eventual" by default because "strong" sounds expensive skips past
several intermediate guarantees that might be exactly what a given operation needs at a fraction of
linearizability's cost.

## Trade-offs

- **Choosing the guarantee per operation, not per system.** A single system-wide consistency choice
  either over-pays for coordination on operations that didn't need it, or under-delivers on the
  operations that did. A bank balance check needs linearizability (acting on stale data has real
  financial cost); a social feed's like count is fine with eventual consistency (a momentarily stale
  count costs nothing); a comment thread often only needs causal consistency (a reply should never
  appear before the comment it replies to, but unrelated comments can arrive in any order). The
  signal, same as in [CAP theorem](cap-theorem.md): is a stale or reordered read safe to act on for
  *this specific* operation?
- **Read-your-writes as a cheap, high-value default.** Full linearizability is expensive; plain
  eventual consistency with no additional guarantee produces a specific, jarring anomaly (a user who
  just posted something and can't see it exists yet). Adding read-your-writes on top of otherwise
  eventual consistency — routing a client's own reads to a replica known to have their own write —
  closes that specific, high-visibility anomaly at a fraction of linearizability's cost, without
  requiring the rest of the system to coordinate any harder.

## Failure modes

- **Assuming "eventual consistency" rules out nothing.** Plain eventual consistency, with no
  additional guarantee layered on, permits a client to see its own writes disappear and reappear, see
  reads move backward in time, and see causally related events out of order — each of these looks
  like a distinct bug to a user, even though the system may be behaving exactly within its stated
  (very weak) contract.
- **Picking linearizability everywhere "to be safe."** Defaulting to the strongest guarantee for
  every operation pays its full coordination cost on operations that never needed it — a highly
  available system paying for consistency it doesn't actually need for most of its own traffic is a
  real, measurable cost with no corresponding benefit.
- **Conflating causal consistency with full ordering.** Code that assumes causally *unrelated*
  operations arrive in a specific order, when the system only promises order for causally *related*
  ones, will intermittently see a valid-but-unexpected interleaving that isn't a violation of the
  actual guarantee.

## Operational considerations

Document which consistency guarantee each read path actually provides, per endpoint or per query —
not as a single system-wide statement. A caller building against an endpoint needs to know whether
it's linearizable, causal, or plain eventual to write correct code against it, and "the system is
eventually consistent" as a blanket statement doesn't tell an integrator which specific anomalies
they need to defend against for their specific use case.

## Example

Routing a client's own reads to a replica known to reflect their own write — read-your-writes
without paying for full linearizability:

```java
if (session.hasRecentWrite()) {
    return primaryOrCaughtUpReplica.read(key); // guaranteed to reflect this client's own write
}
return anyReplica.read(key); // eventual is fine for reads unrelated to this client's own writes
```

## Interview questions

- Why is "eventual consistency" not the only alternative to full linearizability, and what sits
  between them?
- What specific anomaly does read-your-writes consistency rule out that plain eventual consistency
  allows?
- How would you decide which consistency guarantee a specific operation actually needs, rather than
  picking one for the whole system?
- What's the difference between causal consistency and sequential consistency, in terms of what each
  actually orders?

## Further experiments

Compare against [CAP theorem](cap-theorem.md) — CAP's binary consistency-or-not is the trade-off
that applies specifically during a network partition; this topic's spectrum describes the options
available even when the network is healthy, which is where PACELC's latency-vs-consistency half of
the trade-off lives.
