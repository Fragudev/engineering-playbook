# Outbox pattern

## Problem

A common flow is: write a row to the database, then publish an event about that write to a broker.
These are two separate operations against two different systems with no shared transaction — a
crash (or just a network blip) between them leaves the database updated but the event never
published, or the reverse if the event is published first. Either order has a window where the two
systems permanently disagree. This is the **dual-write problem**, and it can't be fixed by
reordering the two calls — only by making them not be two independent operations in the first
place.

## Key concepts

- **Outbox table**: a table in the *same* database as the business data, written to in the *same*
  transaction as the business write. It holds the event to be published, not yet sent anywhere.
- **Relay**: a separate process that reads unpublished rows from the outbox, publishes them to the
  broker, and marks them sent (or deletes them). It runs asynchronously, decoupled from the
  request that created the outbox row.
- **Change Data Capture (CDC)**: an alternative relay mechanism that tails the database's write-ahead
  log (e.g., via Debezium) instead of polling the outbox table, publishing a broker event for every
  row inserted into it.

## Design

```mermaid
sequenceDiagram
    participant API
    participant DB as Database (business table + outbox table)
    participant Relay
    participant Broker
    API->>DB: BEGIN; INSERT order; INSERT outbox row; COMMIT
    Note over DB: Both writes succeed or both roll back — atomic
    Relay->>DB: Poll unpublished outbox rows
    Relay->>Broker: Publish event
    Relay->>DB: Mark row published
```

This diagram answers: *what actually closes the gap that a naive dual-write leaves open?* The
business write and the outbox write are the same database transaction, so there is no window where
one happened and the other didn't — a crash before commit loses both, a crash after commit has both.
The publish step is moved entirely out of the request path and into the relay, which is free to
retry indefinitely without affecting the caller, because from the caller's perspective the write
already fully succeeded once the transaction committed.

## Trade-offs

- **Polling relay vs CDC.** A polling relay (a scheduled query for unpublished rows) is simple to
  build and reason about, at the cost of publish latency bounded by the poll interval and added read
  load on the business database. CDC tails the write-ahead log directly, giving near-real-time
  publish latency with minimal query load, at the cost of an additional infrastructure dependency
  (Debezium or equivalent) and its own operational surface (connector lag, log retention
  requirements on the database).
- **Outbox table retention.** Rows can be deleted immediately after publish (keeps the table small,
  but loses an audit trail) or retained with a `published_at` timestamp and cleaned up on a longer
  schedule (keeps an audit trail, at the cost of the table growing until the cleanup job runs).

## Failure modes

- **Relay crashes after publishing but before marking the row sent.** The row is picked up again on
  the next poll and published a second time. This is not a bug to "fix" by trying to make the mark-
  sent step atomic with the publish (that reintroduces the original dual-write problem one level
  down) — it's an accepted at-least-once delivery guarantee, which is exactly why every consumer of
  outbox-published events needs to be [idempotent](../distributed-systems/idempotency.md). The
  outbox pattern solves the producer's half of reliable delivery; it deliberately doesn't try to
  solve the consumer's half.
- **Treating the outbox table as a queue the application reads directly.** The outbox exists to
  survive the gap between commit and publish, not to replace the broker — a service that queries the
  outbox table directly instead of consuming from the broker has quietly turned it into a bespoke,
  worse message queue with no consumer group semantics.

## Operational considerations

Outbox table growth and relay lag both need monitoring: an unpublished-row count that trends upward
means the relay is falling behind or stuck, and it's the earliest signal of an approaching
inconsistency window, well before an operator would otherwise notice a downstream service missing
events.

## Example

Atomic business write and outbox write in one transaction:

```sql
BEGIN;
INSERT INTO orders (id, customer_id, total) VALUES ($1, $2, $3);
INSERT INTO outbox (id, event_type, payload, published_at)
  VALUES (gen_random_uuid(), 'OrderCreated', $4, NULL);
COMMIT;
-- Both rows exist, or neither does. The relay picks up rows
-- where published_at IS NULL.
```

## Interview questions

- Why can't the dual-write problem be solved by just publishing the event first, then writing to
  the database?
- What guarantee does the outbox pattern actually provide, and what guarantee does it explicitly
  not provide?
- What's the operational trade-off between a polling relay and a CDC-based one?
- Why does the outbox pattern require the consumer to be idempotent even though the producer side is
  now "fixed"?

## Further experiments

`distributed-systems-playground`'s `outbox` example implements the polling relay for real:
[its README](https://github.com/Fragudev/distributed-systems-playground/blob/f893b1568b28f1ecab1babdc35292dcdfb0f49b0/examples/outbox/README.md)
proves the naive dual-write's exact failure mode (`NaiveDualWriteFailureTest` — the order commits,
the event is gone, with no outbox row to recover it), then proves the fix survives a relay dying
mid-batch (`OutboxFailureTest`). [ADR-0003](https://github.com/Fragudev/distributed-systems-playground/blob/f893b1568b28f1ecab1babdc35292dcdfb0f49b0/docs/adr/0003-transactional-outbox.md)
covers CDC and 2PC as alternatives considered and rejected for this example, not built alongside the
polling relay for a side-by-side comparison.
