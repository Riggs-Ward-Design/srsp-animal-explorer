// Runtime settings, read from config.yml beside the executable.
//
// Every setting is a flat scalar someone at the installed kiosk can change
// without a rebuild, so keep the set small and legible to a non-developer.
//
// The file is parsed in the main process and handed over the preload bridge
// before any renderer code runs, so `get` is synchronous with no loading state:
//
//   const timeout = useConfig().get('timeToIdle', 60)

/** What a config.yml value is allowed to be. */
export type ConfigValue = string | number | boolean

export interface AppConfig {
  /**
   * A value from config.yml, or `fallback` if the file doesn't set it.
   *
   * The fallback is also the schema: its type is what the file's value has to
   * match. A mismatch warns and uses the fallback, so a bad line costs one
   * setting, not the whole file. Range is unchecked — a setting that would
   * break on a plausible-but-wrong number should clamp at the point of use.
   */
  get<T extends ConfigValue>(key: string, fallback: T): T
}

export function createAppConfig(raw: unknown): AppConfig {
  const values: Record<string, unknown> =
    raw && typeof raw === 'object' && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {}

  // Warned about once, not once per read: `get` is called from render, so a
  // redrawing component would bury the console in one repeated complaint.
  const warned = new Set<string>()

  function get<T extends ConfigValue>(key: string, fallback: T): T {
    if (!(key in values)) return fallback

    const value = values[key]

    // A key written with no value (`timeToIdle:`) parses to null: left blank,
    // which takes the default silently, like an absent key.
    if (value === null || value === undefined) return fallback

    const wrongType = typeof value !== typeof fallback
    const notANumber = typeof fallback === 'number' && Number.isNaN(value)

    if (wrongType || notANumber) {
      if (!warned.has(key)) {
        warned.add(key)
        console.warn(
          `[config] "${key}" should be a ${typeof fallback}, got ${JSON.stringify(value)} — using ${JSON.stringify(fallback)}.`
        )
      }
      return fallback
    }

    return value as T
  }

  return { get }
}

/**
 * The parsed config.yml, as delivered by the preload bridge. Absent wherever no
 * main process read the file, which runs on the defaults.
 */
function bridgedConfig(): unknown {
  if (typeof window === 'undefined') return undefined
  return window.kiosk?.appConfig
}

export const appConfig: AppConfig = createAppConfig(bridgedConfig())

/** The same `appConfig`, named for use in components. */
export function useConfig(): AppConfig {
  return appConfig
}
