// Collapses the authored config.yml's build/dev pairs down to what ships.

import { parseDocument, isMap } from 'yaml'

/**
 * Header for the shipped file, replacing the authored one.
 *
 * The authored header explains the build/dev format, which is exactly the thing
 * flattening removes. Written without a leading `#`; the YAML writer adds them.
 */
const SHIPPED_HEADER = [
  ' Settings for this installation. Edit a value and restart the app.',
  '',
  ' Every setting has a built-in default, so a line can be deleted, or left',
  ' blank, to get the default back.'
].join('\n')

/**
 * Collapse every `build:`/`dev:` pair in the authored config to its build value.
 *
 * Edited as a document rather than parsed and re-emitted, so the comments that
 * explain each setting survive — they're the only documentation an operator
 * standing at the machine has.
 *
 * A pair with no `build:` falls back to its `dev:` value, matching how the same
 * pair resolves at runtime.
 */
function flattenConfig(text) {
  const doc = parseDocument(text)
  if (!isMap(doc.contents)) return text

  doc.commentBefore = SHIPPED_HEADER

  for (const pair of doc.contents.items) {
    if (!isMap(pair.value)) continue

    const side = ['build', 'dev']
      .map((key) => pair.value.items.find((item) => item.key?.value === key))
      .find(Boolean)

    if (!side) continue

    // Keep the setting's own comment, drop whatever sat on the build/dev lines:
    // those explain a choice that no longer exists in the flattened file.
    const comment = pair.value.commentBefore ?? null
    pair.value = side.value
    if (pair.value) pair.value.comment = null
    if (comment !== null) pair.key.commentBefore = comment
  }

  return doc.toString()
}

export { flattenConfig }
