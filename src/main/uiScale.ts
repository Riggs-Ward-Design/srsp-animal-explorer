/**
 * UI scaling for the kiosk shell.
 *
 * The UI is authored against one base resolution; at runtime the window's zoom
 * factor rescales it to whatever panel it lands on, so a half-size development
 * window is a faithful miniature rather than a different layout.
 *
 * No Electron imports: pure arithmetic.
 */

/** The resolution the UI is authored against. */
export const baseResolution = { x: 3840, y: 2160 }

/** Fraction of `baseResolution` a windowed session opens at. */
export const windowedScale = 0.5

/** Chromium's floor for a usable zoom factor. */
export const MIN_ZOOM_FACTOR = 0.01

/** Default size for a windowed session, derived from the base resolution. */
export function windowedSize(scale: number = windowedScale): {
  width: number
  height: number
} {
  return {
    width: Math.round(baseResolution.x * scale),
    height: Math.round(baseResolution.y * scale)
  }
}

/**
 * The zoom factor that scales the base-resolution UI to a window of `size` CSS
 * pixels along one axis. A degenerate size — which occurs transiently while a
 * window is minimized — is clamped, since Chromium rejects a factor of 0.
 */
function zoomFactorFor(size: number, base: number): number {
  if (!Number.isFinite(size) || size <= 0) return MIN_ZOOM_FACTOR
  if (!Number.isFinite(base) || base <= 0) return MIN_ZOOM_FACTOR
  return Math.max(size / base, MIN_ZOOM_FACTOR)
}

/**
 * The zoom factor that fits the base-resolution UI inside a content area
 * without distorting it. Off the base aspect ratio it's the smaller of the two
 * axes' factors, leaving spare room along the other.
 */
export function fitZoomFactor(
  contentWidth: number,
  contentHeight: number,
  base: { x: number; y: number } = baseResolution
): number {
  return Math.min(zoomFactorFor(contentWidth, base.x), zoomFactorFor(contentHeight, base.y))
}
