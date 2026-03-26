// file: src/_lib/assets.ts

// Full-resolution images (for open/detail view)
import { kebabCase } from 'change-case'

const fullModules = import.meta.glob('../_assets/content-images/*.{png,jpg,jpeg,webp,gif}', {
  eager: true,
  import: 'default'
}) as Record<string, string>

// 220×140 thumbnails (for closed/button view)
const thumbModules = import.meta.glob('../_assets/content-thumbnails/*.{png,jpg,jpeg,webp,gif}', {
  eager: true,
  import: 'default'
}) as Record<string, string>

/** URL maps, keyed by relative glob path. */
export const imageUrls = fullModules
export const thumbUrls = thumbModules

export const findUrl = (map: Record<string, string>, name: string) => {
  return Object.entries(map).find(([k]) => k.includes(`/${kebabCase(name)}.`))?.[1]
}

export function logMissingOrUnusedImages(names: string[]): void {
  const missingBoth: string[] = []
  const missingFull: string[] = []
  const missingThumb: string[] = []

  const usedFullKeys = new Set<string>()
  const usedThumbKeys = new Set<string>()

  for (const name of names) {
    const kebab = kebabCase(name)
    const fullEntry = Object.keys(fullModules).find((k) => k.includes(`/${kebab}.`))
    const thumbEntry = Object.keys(thumbModules).find((k) => k.includes(`/${kebab}.`))

    if (fullEntry) usedFullKeys.add(fullEntry)
    if (thumbEntry) usedThumbKeys.add(thumbEntry)

    if (!fullEntry && !thumbEntry) missingBoth.push(name)
    else if (!fullEntry) missingFull.push(name)
    else if (!thumbEntry) missingThumb.push(name)
  }

  const unusedFullKeys = Object.keys(fullModules).filter((k) => !usedFullKeys.has(k))
  const unusedThumbKeys = Object.keys(thumbModules).filter((k) => !usedThumbKeys.has(k))

  const unusedFullSet = new Set(
    unusedFullKeys.map((k) => k.replace(/^.*\//, '').replace(/\.[^.]+$/, ''))
  )
  const unusedThumbSet = new Set(
    unusedThumbKeys.map((k) => k.replace(/^.*\//, '').replace(/\.[^.]+$/, ''))
  )

  const unusedBoth = [...unusedFullSet].filter((f) => unusedThumbSet.has(f))
  const unusedBothSet = new Set(unusedBoth)
  const unusedFullOnly = unusedFullKeys.filter(
    (k) => !unusedBothSet.has(k.replace(/^.*\//, '').replace(/\.[^.]+$/, ''))
  )
  const unusedThumbOnly = unusedThumbKeys.filter(
    (k) => !unusedBothSet.has(k.replace(/^.*\//, '').replace(/\.[^.]+$/, ''))
  )

  if (missingBoth.length) console.warn('[assets] Missing full image AND thumbnail:', missingBoth)
  if (missingFull.length) console.warn('[assets] Missing full image only:', missingFull)
  if (missingThumb.length) console.warn('[assets] Missing thumbnail only:', missingThumb)
  if (unusedBoth.length) console.warn('[assets] Unused full image AND thumbnail:', unusedBoth)
  if (unusedFullOnly.length) console.warn('[assets] Unused full images only:', unusedFullOnly)
  if (unusedThumbOnly.length) console.warn('[assets] Unused thumbnails only:', unusedThumbOnly)
  if (
    !missingBoth.length &&
    !missingFull.length &&
    !missingThumb.length &&
    !unusedBoth.length &&
    !unusedFullOnly.length &&
    !unusedThumbOnly.length
  )
    console.log('[assets] All images accounted for.')
}
