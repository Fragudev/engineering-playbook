# Databases

Storage engines, transaction semantics, and the trade-offs that show up once data outgrows a single
table on a single machine.

| Topic | File | Status |
|---|---|---|
| Isolation levels | `isolation-levels.md` | Planned — Phase 3 |
| Optimistic vs pessimistic locking | `optimistic-vs-pessimistic-locking.md` | Planned — Phase 3 |
| Indexing trade-offs | `indexing-trade-offs.md` | Planned — Phase 3 |
| Relational vs NoSQL | — | Backlog |
| Transactions | — | Backlog |
| Replication | — | Backlog |
| Sharding | — | Backlog |
| Read/write models (CQRS) | — | Backlog |
| Caching | — | Backlog |

`ai-engineering-lab` uses PostgreSQL with pgvector under real transactional and concurrency
constraints (ingestion pipeline, hybrid retrieval) — referenced as a case study where relevant.
