#!/usr/bin/env node
'use strict';

/**
 * Content verification for a documentation-only repo, structured as the closest equivalent
 * to a unit/integration/e2e test pyramid this repo has:
 *
 *   - "Unit"        each topic/ADR/system-design file, checked in isolation against its
 *                    template's required section headers and filename convention.
 *   - "Integration"  adjacent pieces checked together: every content file is linked from its
 *                    category README, and every internal relative link resolves to a real file.
 *   - "E2E"          a simulated reader's journey: BFS from the root README following only
 *                    links found in the content itself, asserting every "Done" file is
 *                    actually reachable — no orphaned page a reader could never navigate to.
 *
 * No dependencies — plain Node so it runs identically locally and in CI with no install step.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const CATEGORY_DIRS = [
  'architecture',
  'distributed-systems',
  'databases',
  'messaging',
  'resilience',
  'observability',
  'ai-engineering',
];

let failures = 0;

function fail(message) {
  console.error(`FAIL: ${message}`);
  failures++;
}

function readFile(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

function listMarkdownFiles(dirRel) {
  return fs
    .readdirSync(path.join(ROOT, dirRel))
    .filter((f) => f.endsWith('.md') && f !== 'README.md');
}

function extractH2Headers(text) {
  return text
    .split('\n')
    .filter((line) => line.startsWith('## '))
    .map((line) => line.trim());
}

function extractMarkdownLinks(text) {
  const linkRe = /\]\(([^)]+)\)/g;
  const links = [];
  let m;
  while ((m = linkRe.exec(text))) links.push(m[1]);
  return links;
}

// GitHub's heading-anchor slug: lowercase, drop anything that isn't a letter/number/space/hyphen
// (so backticks, periods and slashes vanish), then spaces to hyphens. Mirrors how a `#anchor`
// link is actually resolved when the rendered page is viewed on GitHub.
function headingSlugs(text) {
  return new Set(
    text
      .split('\n')
      .filter((line) => /^#{1,6} /.test(line))
      .map((line) =>
        line
          .replace(/^#{1,6} /, '')
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9 -]/g, '')
          .replace(/ /g, '-')
      )
  );
}

// Asserts `expected` headers appear in `actual` headers, in the same relative order
// (a subsequence check — allows extra headers, never allows a missing or reordered one).
function assertHeaderSubsequence(actual, expected, label) {
  let i = 0;
  for (const header of expected) {
    const idx = actual.indexOf(header, i);
    if (idx === -1) {
      fail(`${label}: missing or out-of-order section "${header}"`);
      return;
    }
    i = idx + 1;
  }
}

// --- "Unit": template conformance -------------------------------------------------------

function checkTemplateConformance() {
  const topicHeaders = extractH2Headers(readFile('templates/topic.md'));
  const adrHeaders = extractH2Headers(readFile('templates/adr.md'));
  const sdHeaders = extractH2Headers(readFile('templates/system-design.md'));

  for (const dir of CATEGORY_DIRS) {
    for (const file of listMarkdownFiles(dir)) {
      if (!/^[a-z0-9]+(-[a-z0-9]+)*\.md$/.test(file)) {
        fail(`${dir}/${file}: filename is not kebab-case (see ADR-0001 naming convention)`);
      }
      const text = readFile(path.join(dir, file));
      assertHeaderSubsequence(extractH2Headers(text), topicHeaders, `${dir}/${file}`);
    }
  }

  for (const file of listMarkdownFiles('adr')) {
    if (!/^\d{4}-[a-z0-9-]+\.md$/.test(file)) {
      fail(`adr/${file}: filename must match NNNN-kebab-case-title.md`);
    }
    const text = readFile(path.join('adr', file));
    assertHeaderSubsequence(extractH2Headers(text), adrHeaders, `adr/${file}`);
  }

  for (const file of listMarkdownFiles('system-design')) {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*\.md$/.test(file)) {
      fail(`system-design/${file}: filename is not kebab-case`);
    }
    const text = readFile(path.join('system-design', file));
    assertHeaderSubsequence(extractH2Headers(text), sdHeaders, `system-design/${file}`);
  }
}

// --- "Integration": index completeness + internal link resolution ------------------------

function checkIndexCompleteness() {
  const dirsWithIndex = [...CATEGORY_DIRS, 'adr', 'system-design'];
  for (const dir of dirsWithIndex) {
    const readme = readFile(path.join(dir, 'README.md'));
    const linkedFiles = new Set(
      extractMarkdownLinks(readme)
        .filter((l) => !l.startsWith('http') && !l.startsWith('#'))
        .map((l) => l.split('#')[0])
        .map((l) => path.basename(l))
    );
    for (const file of listMarkdownFiles(dir)) {
      if (!linkedFiles.has(file)) {
        fail(`${dir}/README.md does not link to ${dir}/${file} (index out of sync)`);
      }
    }
  }
}

function walkAllMarkdownFiles() {
  const out = [];
  function walk(dirRel) {
    for (const entry of fs.readdirSync(path.join(ROOT, dirRel), { withFileTypes: true })) {
      if (entry.name === '.git' || entry.name === 'node_modules') continue;
      const relPath = path.join(dirRel, entry.name);
      if (entry.isDirectory()) walk(relPath);
      else if (entry.name.endsWith('.md')) out.push(relPath);
    }
  }
  walk('.');
  return out;
}

function checkInternalLinksResolve() {
  const slugCache = new Map();
  const slugsFor = (relPath) => {
    if (!slugCache.has(relPath)) slugCache.set(relPath, headingSlugs(readFile(relPath)));
    return slugCache.get(relPath);
  };

  for (const file of walkAllMarkdownFiles()) {
    const text = readFile(file);
    for (const link of extractMarkdownLinks(text)) {
      if (link.startsWith('http')) continue;

      const [pathPart, anchor] = link.split('#');

      // A pure "#anchor" link points at a heading in this same file.
      if (!pathPart) {
        if (anchor && !slugsFor(file).has(anchor)) {
          fail(`${file}: link "${link}" points at no heading in this file`);
        }
        continue;
      }

      const resolved = path.normalize(path.join(path.dirname(file), pathPart));
      if (!fs.existsSync(path.join(ROOT, resolved))) {
        fail(`${file}: broken internal link "${link}" (resolved to ${resolved})`);
        continue;
      }
      // The file exists — if the link also names an anchor, that heading has to exist too.
      // A link to a real file with a stale "#section" lands the reader at the top of the page
      // with no error, which is exactly the kind of silent drift this suite exists to catch.
      if (anchor && resolved.endsWith('.md') && !slugsFor(resolved).has(anchor)) {
        fail(`${file}: link "${link}" resolves to ${resolved} but it has no heading "#${anchor}"`);
      }
    }
  }
}

// --- "E2E": reachability from the root README, simulating a reader's navigation ----------

function checkReachabilityFromRoot() {
  const visited = new Set();
  const queue = ['README.md'];
  while (queue.length > 0) {
    const current = queue.shift();
    if (visited.has(current)) continue;
    visited.add(current);
    const text = readFile(current);
    for (const link of extractMarkdownLinks(text)) {
      if (link.startsWith('http') || link.startsWith('#') || !link.endsWith('.md')) continue;
      const resolved = path.normalize(path.join(path.dirname(current), link.split('#')[0]));
      if (!visited.has(resolved) && fs.existsSync(path.join(ROOT, resolved))) {
        queue.push(resolved);
      }
    }
  }

  const dirsWithIndex = [...CATEGORY_DIRS, 'adr', 'system-design'];
  for (const dir of dirsWithIndex) {
    for (const file of listMarkdownFiles(dir)) {
      const relPath = path.join(dir, file);
      if (!visited.has(relPath)) {
        fail(`${relPath} is not reachable from README.md by following links (orphaned page)`);
      }
    }
  }
}

// -------------------------------------------------------------------------------------------

checkTemplateConformance();
checkIndexCompleteness();
checkInternalLinksResolve();
checkReachabilityFromRoot();

if (failures > 0) {
  console.error(`\n${failures} check(s) failed.`);
  process.exit(1);
} else {
  console.log('All content checks passed (template conformance, index completeness, internal links, root reachability).');
}
