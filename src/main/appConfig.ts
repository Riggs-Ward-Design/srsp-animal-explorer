// Reads config.yml — the operator-editable settings file — in the main process.
// It sits beside the executable rather than in the build, so someone at the
// installed kiosk can change a value in Notepad and restart.
//
// Every failure below degrades to the built-in defaults plus a warning: a typo
// in a settings file must never leave a kiosk unable to boot.
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { load } from 'js-yaml'

const CONFIG_FILE = 'config.yml'

/**
 * Where config.yml is expected to be: beside the .exe when packaged, in the
 * project root in dev. A portable build unpacks itself to %TEMP% and runs from
 * there, so PORTABLE_EXECUTABLE_DIR names the directory the operator sees.
 */
export function configPath(isDev: boolean, exePath: string, cwd: string): string {
  if (isDev) return join(cwd, CONFIG_FILE)
  return join(process.env.PORTABLE_EXECUTABLE_DIR ?? dirname(exePath), CONFIG_FILE)
}

/**
 * Parse the file's text into a plain key/value object. `null` means no file,
 * which is a legitimate way to run. Anything unparseable discards the whole
 * file: a file that fails to parse gives no trustworthy signal about which of
 * its keys survived.
 */
export function parseAppConfig(text: string | null): Record<string, unknown> {
  if (text === null) return {}

  let parsed: unknown
  try {
    parsed = load(text)
  } catch (err) {
    console.warn(`[config] ${CONFIG_FILE} is not valid YAML — using defaults:`, err)
    return {}
  }

  // An empty or all-whitespace file parses to undefined: everything default.
  if (parsed === null || parsed === undefined) return {}

  if (typeof parsed !== 'object' || Array.isArray(parsed)) {
    console.warn(`[config] ${CONFIG_FILE} should be a list of "key: value" lines — using defaults.`)
    return {}
  }

  return parsed as Record<string, unknown>
}

/**
 * The two sides a setting can be given: the value that ships and the value a
 * dev session runs on. A single value means both.
 *
 * Only the authored file is written this way — the copy staged beside a
 * packaged executable is flattened to its build values first. Resolving here
 * as well keeps the authored file directly runnable.
 */
const VARIANT_KEYS = ['build', 'dev'] as const

/** Whether a parsed value is a `build:`/`dev:` pair rather than a plain value. */
function isVariantPair(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false
  return VARIANT_KEYS.some((key) => key in value)
}

/**
 * Collapse every `build:`/`dev:` pair to the side this run wants. A pair
 * missing that side falls back to the side it has. A mapping that names
 * neither is a typo: dropped with a warning, leaving the built-in default.
 */
export function resolveVariants(
  raw: Record<string, unknown>,
  isDev: boolean
): Record<string, unknown> {
  const wanted = isDev ? 'dev' : 'build'
  const other = isDev ? 'build' : 'dev'
  const resolved: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(raw)) {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      resolved[key] = value
      continue
    }

    if (!isVariantPair(value)) {
      console.warn(
        `[config] "${key}" should be a value, or a "build:"/"dev:" pair — using the default.`
      )
      continue
    }

    const pair = value as Record<string, unknown>
    resolved[key] = pair[wanted] ?? pair[other]
  }

  return resolved
}

/** Read and parse config.yml, or fall back to an empty config. */
export function loadAppConfig(
  isDev: boolean,
  exePath: string,
  cwd: string
): Record<string, unknown> {
  const file = configPath(isDev, exePath, cwd)

  let text: string | null
  try {
    text = readFileSync(file, 'utf8')
  } catch {
    // Absent, unreadable, locked by an editor — all the same answer.
    text = null
  }

  const config = resolveVariants(parseAppConfig(text), isDev)
  if (isDev) console.log(`[config] ${file}:`, config)
  return config
}
