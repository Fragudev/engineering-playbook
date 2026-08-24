# Messaging

Asynchronous communication between services: brokers, delivery guarantees, and what breaks when a
consumer fails mid-message.

| Topic | File | Status |
|---|---|---|
| Delivery semantics (at-most/at-least/exactly-once) | [`delivery-semantics.md`](delivery-semantics.md) | Done |
| Transactional outbox | [`outbox-pattern.md`](outbox-pattern.md) | Done |
| Consumer groups | [`consumer-groups.md`](consumer-groups.md) | Done |
| Kafka | [`kafka.md`](kafka.md) | Done |
| RabbitMQ | [`rabbitmq.md`](rabbitmq.md) | Done |
| Ordering | [`ordering.md`](ordering.md) | Done |
| Retries | [`retries.md`](retries.md) | Done |
| Dead-letter queues | [`dead-letter-queues.md`](dead-letter-queues.md) | Done |

Working Kafka/RabbitMQ examples with Testcontainers-backed tests live in
[`distributed-systems-playground`](https://github.com/Fragudev/distributed-systems-playground) —
the same order-processing scenario built on both brokers, compared in its
[ADR-0007](https://github.com/Fragudev/distributed-systems-playground/blob/f893b1568b28f1ecab1babdc35292dcdfb0f49b0/docs/adr/0007-kafka-vs-rabbitmq.md).
