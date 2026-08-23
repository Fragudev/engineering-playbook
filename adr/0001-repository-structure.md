# ADR-0001: Repository structure and category layout

## Context

This repository is a knowledge base, not an application — there is no build to organize around, so
the directory structure has to do the job that packages and modules do in the other two portfolio
repos (`ai-engineering-lab`, `distributed-systems-playground`): make it obvious where a piece of
content belongs and where a reader should look for a given concept.

The spec (`03-engineering-playbook.md`) lists roughly 70 subtopics across 8 areas plus system
design exercises. Flattening all of that into one directory, or into deeply nested subfolders per
subtopic, both fail for different reasons: a flat directory becomes unnavigable past ~20 files, and
deep nesting forces a reader to guess a taxonomy before they can find anything.

## Decision

One top-level directory per main area from the spec (`architecture/`, `distributed-systems/`,
`databases/`, `messaging/`, `resilience/`, `observability/`, `ai-engineering/`, `system-design/`),
plus `adr/` for decisions about the repo itself and `templates/` for the three content templates.
Each area directory is flat — one Markdown file per topic, `kebab-case.md` — with a `README.md`
index listing every topic in that area and its status (`Planned — Phase N` or `Backlog`), so
unwritten scope is visible instead of silently absent.

No subfolders inside an area. If an area grows past ~15–20 files, that is itself a signal the area
should split — decided with a new ADR at that point, not pre-emptively here.

## Alternatives considered

- **Flat repo, no category folders.** Rejected: with ~70 target subtopics this becomes unusable
  almost immediately, and the spec's own "Main areas" section already provides a taxonomy that
  matches how a reader (or an interviewer) thinks about the space.
- **Nest by sub-theme** (e.g. `distributed-systems/consensus/leader-election.md`). Rejected for the
  initial structure: most areas don't have enough content yet to justify a second taxonomy level,
  and premature nesting creates directories with one file in them, which is worse than a flat list
  with a good index.
- **One directory per topic containing `README.md`** (Diátaxis-style). Rejected: adds a directory
  per topic for no benefit when a topic is a single file with no attached assets.

## Trade-offs

Flat-per-area is easy to navigate today and costs nothing to restructure later, but it means the
`README.md` index is load-bearing — if an index falls out of sync with the files present, the
category becomes as unnavigable as a flat repo would have been. Mitigated by making index upkeep
part of the definition of done for any new topic (see `CONTRIBUTING.md`).

## Consequences

- Adding a topic means: create `area/topic-name.md` from `templates/topic.md`, then update
  `area/README.md`'s status table in the same commit.
- CI's link-check (ADR-0002 area) can, in the future, verify every file in an area directory is
  referenced from that area's `README.md`, catching index drift mechanically instead of relying on
  review discipline alone.
