# Messaging

Asynchronous communication between services: brokers, delivery guarantees, and what breaks when a
consumer fails mid-message.

| Topic | File | Status |
|---|---|---|
| Delivery semantics (at-most/at-least/exactly-once) | [`delivery-semantics.md`](delivery-semantics.md) | Done |
| Transactional outbox | [`outbox-pattern.md`](outbox-pattern.md) | Done |
| Consumer groups | [`consumer-groups.md`](consumer-groups.md) | Done |
| Kafka | — | Backlog |
| RabbitMQ | — | Backlog |
| Ordering | — | Backlog |
| Retries | — | Backlog |
| Dead-letter queues | — | Backlog |

Working Kafka/RabbitMQ examples with Testcontainers-backed tests live in
`distributed-systems-playground` (pending — not yet created).
