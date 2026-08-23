# Engineering Playbook

[![lint](https://github.com/Fragudev/engineering-playbook/actions/workflows/lint.yml/badge.svg)](https://github.com/Fragudev/engineering-playbook/actions/workflows/lint.yml)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

A public, continuously evolving knowledge base covering software architecture, distributed
systems, and AI engineering — written as the reasoning of an experienced engineer preparing for
Staff/Principal-level responsibilities and interviews, not as tutorial content.

> **Status: Phase 4 complete.** Architecture (3), distributed systems (4), messaging (3),
> resilience (3), databases (3), observability (2), AI engineering (3), and the URL shortener
> system design exercise are done. See each category's `README.md` for what's planned and in what
> phase.

---

## Why this exists

Most architecture write-ups either copy a standard interview answer or list pros and cons with no
attached decision. This repo is an attempt to do neither: every trade-off names the concrete signal
that would tip it, every diagram exists to answer a specific architectural question, and every
opinion is defensible rather than hedged.

It is the reasoning layer of a three-repo portfolio. The other two repos build things; this one
explains why they were built that way.

## How this repo relates to the other two

| Repo | Role |
|---|---|
| [`ai-engineering-lab`](https://github.com/Fragudev/ai-engineering-lab) | Production-oriented AI engineering implementation (RAG, tool calling, MCP, agentic workflows) |
| `distributed-systems-playground` | Distributed-systems implementations and failure-mode experiments (not yet created) |
| `engineering-playbook` (this repo) | Concepts, decisions, and interview-oriented reasoning |

This repo does not duplicate runnable code from the other two. Where a topic has a working
implementation elsewhere, the topic links to it instead of re-describing it — see
[ADR-0001](adr/0001-repository-structure.md) and the "Implementation" notes inside each category's
`README.md`.

## Navigation

| Area | Scope |
|---|---|
| [`architecture/`](architecture/README.md) | Modular monoliths, microservices, coupling/cohesion, hexagonal architecture |
| [`distributed-systems/`](distributed-systems/README.md) | CAP, replication, idempotency, leader election, consistency |
| [`databases/`](databases/README.md) | Isolation levels, locking strategies, indexing, sharding |
| [`messaging/`](messaging/README.md) | Delivery semantics, outbox, consumer groups, Kafka/RabbitMQ |
| [`resilience/`](resilience/README.md) | Circuit breakers, backpressure, timeouts and retries |
| [`observability/`](observability/README.md) | Correlation IDs, SLOs/SLIs, logs/metrics/traces |
| [`ai-engineering/`](ai-engineering/README.md) | RAG, structured output, tool calling, prompt injection, AI security |
| [`system-design/`](system-design/README.md) | Full worked design exercises (URL shortener, notification system, ...) |
| [`adr/`](adr/README.md) | Decisions about this repository's own structure and tooling |
| [`templates/`](templates/) | The three content templates every topic, ADR, and system design exercise follows |

## Writing standards

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the full checklist (language, length, trade-off
rigor, diagram rules). In short: English, concise, opinionated where justified, every diagram
answers a stated question, every trade-off names a deciding signal.

## Roadmap

Phase 0 (this state) → Architecture + first system design exercise → Distributed systems /
messaging / resilience → Databases / observability → AI engineering → polish + second system
design exercise. Full phase breakdown lives in the working plan used to bootstrap this repo,
`03-engineering-playbook-PLAN.md`, kept outside this repository alongside the other two portfolio
specs.

## License

Apache 2.0 — see [`LICENSE`](LICENSE).
