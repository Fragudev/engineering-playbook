# Contributing / Writing standards

This repo has one contributor today, but the checklist below is written as if a reviewer will
enforce it — because on a quality pass, that reviewer is the author revisiting their own draft.

## Before adding a topic

1. Start from the right template — `templates/topic.md`, `templates/adr.md`, or
   `templates/system-design.md`. Don't improvise new top-level sections; if a recurring section is
   genuinely missing, propose it via an ADR in `adr/`, not by editing one file.
2. File name is `kebab-case.md`, one topic per file, placed directly in its area directory (see
   [ADR-0001](adr/0001-repository-structure.md) — no subfolders per topic).
3. Update the area's `README.md` status table in the **same commit** that adds or changes the
   topic's status. An index that drifts from reality is worse than no index.

## Quality checklist (apply before marking a topic "done")

- [ ] **English**, throughout — prose, headings, code, commit message.
- [ ] Roughly 800–1200 words for a standard topic. If it's longer, ask whether it should split into
      two topics instead of justifying the length.
- [ ] Every trade-off names the concrete signal that tips the decision (throughput, team size,
      latency budget, blast radius — not "it depends").
- [ ] Every Mermaid diagram is followed by a paragraph stating the specific architectural question
      it answers. No diagram exists purely as decoration.
- [ ] No pros/cons list without a scenario attached — a bare "pro: scalable / con: complex" list is
      a rejection reason, not a passing draft.
- [ ] Opinions are stated in first person where a real judgment call was made ("I'd default to X
      unless Y"), not hedged into a neutral encyclopedia voice.
- [ ] Any reference to an implementation in `ai-engineering-lab` or `distributed-systems-playground`
      is a real, checked link (or an explicit `> Implementation: pending
      distributed-systems-playground` note if that repo doesn't exist yet) — never a guessed path.
- [ ] `## Example` sections, if present, hold illustrative snippets only (≤20 lines) — this repo
      does not host runnable applications.

## Cross-repo links

- While working from a local checkout with both repos present, use relative Markdown links.
- Once both repos are on GitHub, prefer a **permalink to a commit SHA**
  (`https://github.com/<org>/<repo>/blob/<sha>/path#L10-L20`) over a link to a branch, so the link
  doesn't silently start pointing at different content as the other repo evolves.
- Never leave a link pointing at a repo or path that doesn't exist yet — use the "pending" note
  pattern instead.

## ADRs

One decision per ADR, numbered sequentially in `adr/`, never edited to reverse a decision — a
changed decision gets a new ADR that supersedes the old one, so the history stays legible.

## Automated checks

This repo has no application code, so "tests" here means three things, run on every push and PR by
`.github/workflows/lint.yml`:

| Layer | What it checks | Tool |
|---|---|---|
| Unit — one file in isolation | Every topic/ADR/system-design file has all required sections from its template, in order; filenames follow the naming convention | `scripts/verify-content.js` |
| Integration — adjacent pieces together | Every content file is linked from its category's `README.md`; every internal relative link resolves to a real file; every external link resolves | `scripts/verify-content.js` + `markdown-link-check` |
| E2E — the reader's actual journey | Every "Done" file is reachable by following links starting from the root `README.md` — no page a reader could never navigate to | `scripts/verify-content.js` |

Run it locally before pushing (no install step — plain Node, no dependencies):

```bash
node scripts/verify-content.js
```

A failing check names the exact file and the exact problem (a missing section, an out-of-sync
index, a broken link, an unreachable page) — treat a red run here the same as a failing test suite
elsewhere: fix the content, don't work around the check.
