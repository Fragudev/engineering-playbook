# ADR-0002: Plain Markdown over a static site generator

## Context

The spec's goal is a "public, continuously evolving engineering knowledge base." That phrase could
justify a documentation site (mdBook, Docusaurus, MkDocs Material) with search, theming, and a
custom domain. `ai-engineering-lab` and `distributed-systems-playground` are applications with real
build pipelines; this repo has neither, so the question of what "build" even means here needs an
explicit answer before Phase 0 content starts.

## Decision

Plain Markdown, browsed directly on GitHub. No static site generator in the initial phases (0–5).
GitHub already renders Markdown and Mermaid diagrams natively, category `README.md` files serve as
the navigation layer, and cross-repo links are plain relative or permalink Markdown links.

## Alternatives considered

- **mdBook.** Rejected for now: adds a Rust toolchain dependency and a GitHub Pages deploy step for
  a benefit — search and a themed reading experience — that a reader who's here to evaluate
  architectural reasoning doesn't need. Revisit if the repo's size makes GitHub's native navigation
  genuinely insufficient (tracked as a future item in the roadmap, not committed work).
- **Docusaurus / MkDocs Material.** Rejected for the same reason, with a heavier dependency (Node or
  Python toolchain, a `package.json`/`requirements.txt` to keep patched) for a repo whose primary
  content is prose and diagrams, not versioned API docs or a docs portal with multiple audiences.
- **A single monolithic README or wiki.** Rejected: fails the same navigability argument as the
  flat-repo alternative in ADR-0001, and GitHub wikis aren't reviewable through pull requests.

## Trade-offs

Skipping a site generator means no full-text search and no custom theming — a reader relies on
GitHub's file tree and the category indexes. In exchange, there is zero build tooling to maintain,
zero deploy pipeline to keep green, and content can be reviewed as plain diffs. Given the stated
goal is demonstrating architectural reasoning, not building a docs product, correctness and
maintenance cost were weighted over presentation.

## Consequences

- CI (see `.github/workflows/lint.yml`) only needs to validate Markdown and internal links, not run
  a site build.
- If a future phase adds a generator, this ADR is superseded by a new one rather than edited —
  ADRs are a decision log, not living configuration.
