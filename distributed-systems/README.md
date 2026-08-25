# Distributed Systems

Core theory: what changes when a system stops being a single process, and what guarantees survive
that transition.

| Topic | File | Status |
|---|---|---|
| CAP theorem | [`cap-theorem.md`](cap-theorem.md) | Done |
| Replication | [`replication.md`](replication.md) | Done |
| Idempotency | [`idempotency.md`](idempotency.md) | Done |
| Leader election | [`leader-election.md`](leader-election.md) | Done |
| Scalability | [`scalability.md`](scalability.md) | Done |
| Availability | [`availability.md`](availability.md) | Done |
| Consistency | [`consistency.md`](consistency.md) | Done |
| Partitioning | [`partitioning.md`](partitioning.md) | Done |
| Distributed locks | [`distributed-locks.md`](distributed-locks.md) | Done |
| Event-driven architecture | [`event-driven-architecture.md`](event-driven-architecture.md) | Done |
| Eventual consistency | [`eventual-consistency.md`](eventual-consistency.md) | Done |
| Messaging | — | Covered in [`messaging/`](../messaging/README.md) |

Working implementations of these patterns (Kafka/RabbitMQ, retries, DLQ, sagas) live in
[`distributed-systems-playground`](https://github.com/Fragudev/distributed-systems-playground),
which builds the same order-processing domain across choreographed sagas, both brokers, and a
resilience example — cited directly from the topics above where it grounds them.
