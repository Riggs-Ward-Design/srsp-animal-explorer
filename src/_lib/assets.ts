const modules = import.meta.glob(
    "../_assets/content-images/*.{png,jpg,jpeg,webp,gif}",
    { eager: true, import: "default" }
) as Record<string, string>;

const cache = new Map<string, ImageBitmap>();

export const preloadAllBitmaps = async (
    onProgress?: (loaded: number, total: number, lastUrl?: string) => void
) => {
    const urls = Object.values(modules);
    const total = urls.length;
    let loaded = 0;

    for (const url of urls) {
        if (!cache.has(url)) {
            try {
                const res = await fetch(url);
                const blob = await res.blob();
                const bmp = await createImageBitmap(blob);
                cache.set(url, bmp);
            } catch {
                // ignore
            }
        }

        loaded++;
        onProgress?.(loaded, total, url);
    }
};


export const getBitmap = (url: string) => cache.get(url);
export const imageUrls = modules;
