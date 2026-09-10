// Writes the operator's config.yml beside the packaged executable.
//
// The portable build unpacks itself to %TEMP%, so anything bundled inside it is
// invisible to whoever installs the kiosk. This copy is the one they edit.

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { flattenConfig } from './flattenConfig.mjs'

const SOURCE = 'config.yml'
const OUT_DIR = 'dist'

if (!existsSync(SOURCE)) {
  console.warn(`[config] ${SOURCE} not found — nothing staged.`)
  process.exit(0)
}

const target = join(OUT_DIR, SOURCE)
writeFileSync(target, flattenConfig(readFileSync(SOURCE, 'utf8')), 'utf8')
console.log(`[config] staged ${target}`)
