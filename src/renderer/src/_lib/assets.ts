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

/** All URLs (for preloading). */
export const getAllFullUrls = () => Object.values(fullModules)
export const getAllThumbUrls = () => Object.values(thumbModules)

/** URL maps, keyed by relative glob path. */
export const imageUrls = fullModules
export const thumbUrls = thumbModules

export const findUrl = (map: Record<string, string>, name: string) => {
  return Object.entries(map).find(([k]) => k.includes(`/${kebabCase(name)}.`))?.[1]
}
