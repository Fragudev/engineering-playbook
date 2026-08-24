# AI Engineering

Building LLM-based systems with the same rigor as any other distributed system with an unusually
unreliable dependency.

| Topic | File | Status |
|---|---|---|
| RAG architecture | [`rag-architecture.md`](rag-architecture.md) | Done |
| Structured output and tool-calling reliability | [`structured-output-and-tool-calling-reliability.md`](structured-output-and-tool-calling-reliability.md) | Done |
| Prompt injection | [`prompt-injection.md`](prompt-injection.md) | Done |
| Agents / workflows | [`agents-and-workflows.md`](agents-and-workflows.md) | Done |
| MCP | [`mcp.md`](mcp.md) | Done |
| Evaluation | [`evaluation.md`](evaluation.md) | Done |
| LLM application architecture | [`llm-application-architecture.md`](llm-application-architecture.md) | Done |
| Embeddings | [`embeddings.md`](embeddings.md) | Done |
| Retrieval / reranking | [`retrieval-reranking.md`](retrieval-reranking.md) | Done |
| Hallucination mitigation | [`hallucination-mitigation.md`](hallucination-mitigation.md) | Done |
| AI security | [`ai-security.md`](ai-security.md) | Done |
| Cost/latency trade-offs | [`cost-latency-tradeoffs.md`](cost-latency-tradeoffs.md) | Done |

This category has the deepest cross-linking to a sibling repo: `ai-engineering-lab` already
implements hybrid RAG, schema-validated tool calling, MCP (client and server), an agentic workflow
engine, and a golden-dataset evaluation harness. Every topic here links to the relevant module,
ADR, or `docs/roadmap.md` section instead of re-explaining an architecture that already runs.
