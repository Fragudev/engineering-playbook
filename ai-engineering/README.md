# AI Engineering

Building LLM-based systems with the same rigor as any other distributed system with an unusually
unreliable dependency.

| Topic | File | Status |
|---|---|---|
| RAG architecture | [`rag-architecture.md`](rag-architecture.md) | Done |
| Structured output and tool-calling reliability | [`structured-output-and-tool-calling-reliability.md`](structured-output-and-tool-calling-reliability.md) | Done |
| Prompt injection | [`prompt-injection.md`](prompt-injection.md) | Done |
| LLM application architecture | — | Backlog |
| Embeddings | — | Backlog |
| Retrieval / reranking | — | Backlog |
| Agents / workflows | — | Backlog |
| MCP | — | Backlog |
| Evaluation | — | Backlog |
| Hallucination mitigation | — | Backlog |
| AI security | — | Backlog |
| Cost/latency trade-offs | — | Backlog |

This category has the deepest cross-linking to a sibling repo: `ai-engineering-lab` already
implements hybrid RAG, schema-validated tool calling, MCP (client and server), an agentic workflow
engine, and a golden-dataset evaluation harness. Every topic here links to the relevant module,
ADR, or `docs/roadmap.md` section instead of re-explaining an architecture that already runs.
