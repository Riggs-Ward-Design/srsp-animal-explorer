/**
 * Which monitor the kiosk opens on. The `display` setting is an index into the
 * display list as the OS reports it — the order the Windows display settings
 * pane numbers them in, minus one. Unset, or -1, leaves the window wherever
 * Electron would have put it, the only behaviour that is correct on a machine
 * whose display layout nobody has looked at.
 */

/** The subset of Electron's Display that placement needs. */
export interface DisplayBounds {
  x: number
  y: number
  width: number
  height: number
}

export interface WindowSize {
  width: number
  height: number
}

/** `display` values meaning "leave the window where it would have gone". */
export const NO_DISPLAY_OVERRIDE = -1

/**
 * The index of the display named by a raw `display` value, or `null` to leave
 * placement alone. An index past the end of the list is what an operator gets
 * after unplugging a monitor, so it warns and falls back like every other bad
 * value here — the kiosk has to keep booting.
 */
export function displayIndex(value: unknown, count: number): number | null {
  if (value === null || value === undefined) return null

  if (typeof value !== 'number' || !Number.isInteger(value)) {
    console.warn(
      `[config] "display" should be a whole number, got ${JSON.stringify(value)} — ignoring.`
    )
    return null
  }

  if (value === NO_DISPLAY_OVERRIDE) return null

  if (value < 0 || value >= count) {
    console.warn(
      `[config] display ${value} does not exist (${count} attached) — using the default display.`
    )
    return null
  }

  return value
}

/**
 * Where to put a window so it lands on `bounds`. A sized window is centred, and
 * clamped to the origin on a display too small to hold it, so it can never open
 * with its titlebar off the top of the screen and become undraggable.
 */
export function windowPosition(bounds: DisplayBounds, size?: WindowSize): { x: number; y: number } {
  if (!size) return { x: bounds.x, y: bounds.y }
  return {
    x: bounds.x + Math.max(0, Math.round((bounds.width - size.width) / 2)),
    y: bounds.y + Math.max(0, Math.round((bounds.height - size.height) / 2))
  }
}
