# Databases

Storage engines, transaction semantics, and the trade-offs that show up once data outgrows a single
table on a single machine.

| Topic | File | Status |
|---|---|---|
| Isolation levels | [`isolation-levels.md`](isolation-levels.md) | Done |
| Optimistic vs pessimistic locking | [`optimistic-vs-pessimistic-locking.md`](optimistic-vs-pessimistic-locking.md) | Done |
| Indexing trade-offs | [`indexing-trade-offs.md`](indexing-trade-offs.md) | Done |
| Relational vs NoSQL | [`relational-vs-nosql.md`](relational-vs-nosql.md) | Done |
| Transactions | [`transactions.md`](transactions.md) | Done |
| Replication | — | Covered in [`distributed-systems/replication.md`](../distributed-systems/replication.md) |
| Sharding | [`sharding.md`](sharding.md) | Done |
| Read/write models (CQRS) | [`cqrs.md`](cqrs.md) | Done |
| Caching | [`caching.md`](caching.md) | Done |

`ai-engineering-lab` uses PostgreSQL with pgvector under real transactional and concurrency
constraints (ingestion pipeline, hybrid retrieval) — referenced as a case study where relevant.
