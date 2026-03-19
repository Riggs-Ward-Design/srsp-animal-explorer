/**
 * yamlUtility.ts
 *
 * One-off transforms for "srsp animal facts.yaml".
 * Run with: npm run yamlUtility
 *
 * Current transforms (applied in order):
 *   1. Move `settings:` to the last position in each animal's property list.
 *   2. Collapse multi-line `Fun Fact: >-` block scalars to a single line.
 */

import { readFileSync, writeFileSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

// ---------------------------------------------------------------------------
// Path resolution
// ---------------------------------------------------------------------------

const __dirname = dirname(fileURLToPath(import.meta.url))
const YAML_PATH = resolve(__dirname, '../_assets/srsp animal facts.yaml')

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function leadingSpaces(line: string): number {
  return line.match(/^( *)/)?.[1].length ?? 0
}

// ---------------------------------------------------------------------------
// Transform 1: move `settings:` to end of each animal's property list
//
// Each `- settings:` entry sits inside an animal's property list alongside
// `- Habitat:`, `- Diet:`, and `- Fun Fact:`.  This transform reorders the
// list so `settings:` always comes last, touching nothing else in the file.
//
// Algorithm (processes backwards so earlier line indices stay stable):
//   a. Find a `- settings:` line at indent N.
//   b. Collect the settings block: that line + all immediately-following lines
//      whose indent is strictly greater than N (i.e. `  - align: …`).
//   c. Splice the block out of the array.
//   d. Scan forward from the splice point while indent >= N (sibling items and
//      their multi-line continuations).  That's the insertion point.
//   e. Splice the settings block back in there.
// ---------------------------------------------------------------------------

function moveSettingsToEnd(content: string): string {
  const lines = content.split('\n')

  for (let i = lines.length - 1; i >= 0; i--) {
    const match = lines[i].match(/^( *)- settings:\s*$/)
    if (!match) continue

    const settingsIndent = match[1].length

    // Collect the full settings block (settings line + its indented children)
    let blockEnd = i + 1
    while (blockEnd < lines.length) {
      const line = lines[blockEnd]
      if (line.trim() !== '' && leadingSpaces(line) > settingsIndent) {
        blockEnd++
      } else {
        break
      }
    }

    // Remove settings block from its current position
    const settingsBlock = lines.splice(i, blockEnd - i)

    // Advance past all sibling lines (and their multi-line continuations) to
    // find where to re-insert.  A sibling or its content has indent >= settingsIndent.
    let insertPos = i
    while (insertPos < lines.length) {
      const line = lines[insertPos]
      if (line.trim() === '' || leadingSpaces(line) < settingsIndent) break
      insertPos++
    }

    // Re-insert settings block at the end of the sibling group
    lines.splice(insertPos, 0, ...settingsBlock)
  }

  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// Transform 2: collapse multi-line Fun Fact block scalars to a single line
//
// `- Fun Fact: >-` followed by indented continuation lines gets replaced with
// `- Fun Fact: <joined text>`.  The continuation lines are trimmed and joined
// with a single space, mirroring what the YAML `>-` fold would produce.
//
// Quoting: YAML plain scalars cannot contain `: ` (colon-space).  If the
// collapsed text contains that sequence it is wrapped in single quotes, with
// any internal single-quote characters doubled per the YAML spec (`'` → `''`).
// ---------------------------------------------------------------------------

function safeYamlScalar(s: string): string {
  // Single-quote if the string contains ': ' (YAML plain-scalar restriction)
  if (/: /.test(s)) {
    return "'" + s.replace(/'/g, "''") + "'"
  }
  return s
}

function collapseFunFacts(content: string): string {
  const lines = content.split('\n')
  const result: string[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const match = line.match(/^( *- Fun Fact: )>-\s*$/)

    if (!match) {
      result.push(line)
      i++
      continue
    }

    const prefix = match[1] // e.g. "            - Fun Fact: "
    const indent = leadingSpaces(line)

    // Collect all indented continuation lines that belong to this block scalar
    i++
    const parts: string[] = []
    while (i < lines.length && lines[i].trim() !== '' && leadingSpaces(lines[i]) > indent) {
      parts.push(lines[i].trim())
      i++
    }

    result.push(prefix + safeYamlScalar(parts.join(' ')))
  }

  return result.join('\n')
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const raw = readFileSync(YAML_PATH, 'utf8')
const result = collapseFunFacts(moveSettingsToEnd(raw))
writeFileSync(YAML_PATH, result, 'utf8')
console.log('✓  srsp animal facts.yaml updated.')
