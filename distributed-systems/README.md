# Distributed Systems

Core theory: what changes when a system stops being a single process, and what guarantees survive
that transition.

| Topic | File | Status |
|---|---|---|
| CAP theorem | [`cap-theorem.md`](cap-theorem.md) | Done |
| Replication | [`replication.md`](replication.md) | Done |
| Idempotency | [`idempotency.md`](idempotency.md) | Done |
| Leader election | [`leader-election.md`](leader-election.md) | Done |
| Scalability | — | Backlog |
| Availability | — | Backlog |
| Consistency | — | Backlog |
| Partitioning | — | Backlog |
| Distributed locks | — | Backlog |
| Messaging | — | Backlog (see [`messaging/`](../messaging/README.md)) |
| Event-driven architecture | — | Backlog |
| Eventual consistency | — | Backlog |

Working implementations of these patterns (Kafka/RabbitMQ, retries, DLQ, sagas) live in
`distributed-systems-playground` (pending — not yet created). Until it exists, topics here are
written as self-contained conceptual material with a `> Implementation: pending
distributed-systems-playground` note where relevant.
