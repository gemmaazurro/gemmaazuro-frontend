// imgproxy URL builder.
//
// imgproxy runs UNSIGNED and is locked down with IMGPROXY_ALLOWED_SOURCES
// pointed at the MinIO bucket. Signing is not an option here: Next requires
// `images.loaderFile` to be a Client Component, so any HMAC key this module
// touched would ship to the browser and make the proxy more abusable, not less.
//
// Everything in this file is pure and secret-free, so it is safe to import from
// both server and client code.

/** Named size ladder. Defined once so no component invents its own width. */
export const IMAGE_VARIANTS = {
  thumb: 160, // PDP gallery thumbs, cart lines, mega-menu mini-cards
  small: 480, // ProductCard in grids, wishlist tiles
  medium: 960, // PDP main image, BrandStory slides
  large: 1920, // Hero, fullscreen / zoom
} as const;

export type ImageVariant = keyof typeof IMAGE_VARIANTS;

/**
 * WebP at q95 as specified. This is deliberately a single constant: q95 is well
 * past the point of visual return for photographic content (q80-85 is
 * indistinguishable at roughly half the bytes) and the `large` variant is heavy
 * enough to affect LCP on mobile networks. Dial here, measure, don't scatter.
 */
export const IMAGE_QUALITY = 95;
export const IMAGE_FORMAT = 'webp';

export interface ImgproxyOptions {
  width: number;
  height?: number;
  /** `fit` never crops; `fill` crops to the exact box. */
  resize?: 'fit' | 'fill';
  quality?: number;
  format?: string;
  /** Allow upscaling past the source. Off by default — the photos are the ceiling. */
  enlarge?: boolean;
}

export function getImgproxyUrl(): string | undefined {
  const value = process.env.NEXT_PUBLIC_IMGPROXY_URL;
  if (!value) return undefined;
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

/**
 * Bucket whose HTTP URLs get rewritten to `s3://` before imgproxy fetches them.
 *
 * Garage, unlike MinIO, has no per-prefix anonymous read -- its only public
 * path is a Host-routed web endpoint on a different port. Rather than expose
 * the bucket, imgproxy is given S3 credentials and asked for `s3://bucket/key`,
 * so nothing is ever world-readable. The credentials live on the imgproxy
 * container; nothing secret is needed here, which matters because this module
 * is imported by the Next image loader and therefore ships to the browser.
 *
 * Unset means "leave sources alone", which is what local dev wants.
 */
export function getMediaBucket(): string | undefined {
  return process.env.NEXT_PUBLIC_MEDIA_S3_BUCKET || undefined;
}

/**
 * Rewrite `https://<garage-host>/<bucket>/<key>` to `s3://<bucket>/<key>`.
 *
 * Deliberately narrow: only URLs whose first path segment is exactly our
 * bucket are touched, so a CDN, a third-party image, or a future different
 * origin all pass through untouched rather than becoming broken s3 URLs.
 */
function toS3Source(source: string): string {
  const bucket = getMediaBucket();
  if (!bucket) return source;

  let url: URL;
  try {
    url = new URL(source);
  } catch {
    return source;
  }

  const prefix = `/${bucket}/`;
  if (!url.pathname.startsWith(prefix)) return source;

  // Drop any query string: presigned parameters are meaningless once imgproxy
  // authenticates with its own credentials, and keeping them would change the
  // cache key on every render.
  return `s3://${bucket}/${url.pathname.slice(prefix.length)}`;
}

/** URL-safe base64 without padding, which is what imgproxy expects. */
function encodeSource(source: string): string {
  const base64 =
    typeof btoa === 'function'
      ? btoa(source)
      : Buffer.from(source, 'utf8').toString('base64');
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Build an imgproxy URL for a source image.
 *
 * Falls back to returning `source` untouched when NEXT_PUBLIC_IMGPROXY_URL is
 * unset — otherwise local dev (no imgproxy running) would emit `undefined/...`
 * and 404 every image.
 */
export function buildImgproxyUrl(source: string, options: ImgproxyOptions): string {
  const base = getImgproxyUrl();
  if (!base || !source) return source;

  // Relative paths have no origin for imgproxy to fetch; leave them alone.
  if (!/^https?:\/\//i.test(source)) return source;

  const {
    width,
    height = 0,
    resize = 'fit',
    quality = IMAGE_QUALITY,
    format = IMAGE_FORMAT,
    enlarge = false,
  } = options;

  const processing = [
    `rs:${resize}:${Math.round(width)}:${Math.round(height)}:${enlarge ? 1 : 0}`,
    `q:${quality}`,
  ].join('/');

  // "insecure" is the unsigned-mode signature placeholder.
  return `${base}/insecure/${processing}/${encodeSource(toS3Source(source))}.${format}`;
}

/** Convenience wrapper for the named ladder. */
export function variantUrl(
  source: string,
  variant: ImageVariant,
  options: Omit<ImgproxyOptions, 'width'> = {},
): string {
  return buildImgproxyUrl(source, { ...options, width: IMAGE_VARIANTS[variant] });
}
