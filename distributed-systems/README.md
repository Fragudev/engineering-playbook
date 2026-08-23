# Distributed Systems

Core theory: what changes when a system stops being a single process, and what guarantees survive
that transition.

| Topic | File | Status |
|---|---|---|
| CAP theorem | `cap-theorem.md` | Planned — Phase 2 |
| Replication | `replication.md` | Planned — Phase 2 |
| Idempotency | `idempotency.md` | Planned — Phase 2 |
| Leader election | `leader-election.md` | Planned — Phase 2 |
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
