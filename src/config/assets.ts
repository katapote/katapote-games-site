import type { ImageMetadata } from 'astro';

// Every image under src/assets/games/ is available by its relative path.
const files = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/games/**/*.{png,jpg,jpeg,webp,avif}',
  { eager: true },
);

export function gameImage(path: string | undefined): ImageMetadata | undefined {
  if (!path) return undefined;
  return files[`../assets/games/${path}`]?.default;
}
