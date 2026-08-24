# Engineering Playbook

[![lint](https://github.com/Fragudev/engineering-playbook/actions/workflows/lint.yml/badge.svg)](https://github.com/Fragudev/engineering-playbook/actions/workflows/lint.yml)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

A public, continuously evolving knowledge base covering software architecture, distributed
systems, and AI engineering — written as the reasoning of an experienced engineer preparing for
Staff/Principal-level responsibilities and interviews, not as tutorial content.

> **Status: Phase 5 complete — all planned phases done.** 39 topics across architecture, distributed
> systems, messaging, resilience, databases, observability, and AI engineering, plus two full
> system design exercises (URL shortener, notification system). Every topic has passed a quality
> pass against `CONTRIBUTING.md`'s checklist. See each category's `README.md` for what's still
> backlog beyond this initial scope.

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

Every push and PR runs `scripts/verify-content.js` in CI — the closest equivalent this repo has to
a unit/integration/e2e test suite, checking template conformance, index consistency, and that every
page is actually reachable from this README. See CONTRIBUTING's
["Automated checks"](CONTRIBUTING.md#automated-checks) section for what each layer covers.

## Roadmap

Phases 0–5 are complete: scaffolding → architecture + first system design exercise → distributed
systems / messaging / resilience → databases / observability → AI engineering → quality pass +
second system design exercise. Full phase breakdown lives in the working plan used to bootstrap
this repo, `03-engineering-playbook-PLAN.md`, kept outside this repository alongside the other two
portfolio specs.

Beyond this initial scope, each category's `README.md` lists remaining backlog topics (e.g.
sharding, CQRS, sagas, MCP, evaluation) — not committed to a phase, added opportunistically as the
sibling repos (`ai-engineering-lab`, `distributed-systems-playground`) grow and give this repo new
implementations to reference.

## License

Apache 2.0 — see [`LICENSE`](LICENSE).
