# ADR-0003: A cross-reference status for topics that belong to another category

## Context

[ADR-0001](0001-repository-structure.md) made each area's `README.md` index load-bearing and named
the status vocabulary it should use: `Planned — Phase N` or `Backlog`, so unwritten scope stays
visible instead of silently absent. In practice a third value, `Done`, was added as topics shipped —
the obvious completion state, uncontroversial enough that it never needed a decision recorded.

Completing the initial scope surfaced a case ADR-0001's vocabulary genuinely doesn't cover. Some
topics legitimately appear in more than one category's scope list while only warranting one file:

- `databases/`'s scope names **Replication**, but the substance — sync vs async, quorum, replication
  lag, read-your-writes, failover data loss — is inseparable from the distributed-systems reasoning
  already written in [`distributed-systems/replication.md`](../distributed-systems/replication.md).
- `distributed-systems/`'s scope names **Messaging**, which is an entire sibling category
  ([`messaging/`](../messaging/README.md)), not a topic.

Neither is `Done` (no file exists in that directory), and neither is `Backlog` (nothing is missing —
the reader is fully served, just from elsewhere). Marking them `Backlog` is the worse error: it
advertises unwritten scope that is in fact written, precisely the drift ADR-0001's index discipline
exists to prevent.

Both rows were improvised independently — `distributed-systems/`'s Messaging row as
`Backlog (see ...)`, `databases/`'s Replication row as a differently-worded variant. Two
improvisations of one idea is the recurring-convention signal `CONTRIBUTING.md` names as the trigger
for an ADR rather than another one-off edit.

## Decision

Extend the index status vocabulary with a **cross-reference status**: a row whose File cell is `—`
and whose Status cell reads `Covered in` followed by a relative Markdown link to the file that
covers it, used when a topic within an area's stated scope is fully covered by a file in another
area. The two live examples are the Replication row in `databases/README.md` and the Messaging row
in `distributed-systems/README.md`.

The rule for choosing it: the topic is genuinely written somewhere in this repository, and writing a
second file in this area would duplicate rather than complement it. If the other category's file
only partially covers this area's angle, that is a real, separate topic and gets its own file —
cross-reference is for a topic with one home, not for a topic with an under-written second half.

`Done` is also recorded here as an accepted part of the vocabulary, retroactively — it has been in
use since the first topic shipped without ever being written down.

The full vocabulary is therefore: `Done`, `Backlog`, `Planned — Phase N`, and the cross-reference
status described above.

## Alternatives considered

### Duplicate the topic into both categories

Rejected: two files covering the same trade-offs drift apart the moment one is revised, and a reader
who finds the weaker copy has no signal the better one exists. This is the same reasoning ADR-0001
used to keep one file per topic rather than one directory per topic.

### Leave the row as `Backlog` and let the reader discover the other file

Rejected as actively misleading. `Backlog` is a claim that scope is unwritten; using it for written
scope inverts the index's only job. It would also survive indefinitely, since nothing would ever
prompt someone to "complete" a topic that is already complete elsewhere.

### Drop the row from the index entirely

Rejected: the topic is genuinely part of that area's scope, and a reader scanning `databases/` for
replication should find a pointer, not an absence — ADR-0001's "visible instead of silently absent"
principle, applied to written scope that lives elsewhere.

### Introduce a `See also` column instead of a status value

Rejected as more structure than the problem warrants — two rows across the whole repository do not
justify widening every category's table by a column empty in 64 of 66 rows.

## Trade-offs

- **The cross-reference target is a hand-maintained link.** `scripts/verify-content.js` fails CI on a
  renamed target, but nothing verifies the target still actually covers the topic the row claims.
  That stays editorial, as the "does this index describe reality" judgment always has been.
- **It is a judgment call, not a mechanical rule.** "Would a second file duplicate or complement?"
  has no automated test; the rule above bounds it, but a borderline topic could reasonably go either
  way.

## Consequences

- Two existing rows are now covered by a recorded decision instead of being improvisations:
  `databases/` Replication, and `distributed-systems/` Messaging — the latter reworded from
  `Backlog (see ...)` to the cross-reference form, since nothing about it was ever actually backlog.
- A future contributor adding a topic that already exists in another category has a documented
  option other than duplicating it or silently omitting it.
- ADR-0001's status vocabulary is superseded on this specific point only; its structural decisions
  (one directory per area, flat, one file per topic, index in the same commit) are untouched.
