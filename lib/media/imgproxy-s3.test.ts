import { describe, it, expect, vi, afterEach } from 'vitest';
import { buildImgproxyUrl } from './imgproxy';

/**
 * Garage has no per-prefix anonymous read, so the media bucket stays private
 * and imgproxy reads it over the S3 API with credentials. That only works if
 * the loader hands imgproxy an `s3://` source instead of the public HTTP URL
 * Django stores.
 */

const IMGPROXY = 'http://imgproxy.example.com';
const GARAGE = 'http://garage.example.com';
const BUCKET = 'gemmaazuro-media';

/** imgproxy sources are URL-safe base64 of the source URL, no padding. */
function decodeSource(url: string): string {
  const seg = url.split('/').pop()!.replace(/\.\w+$/, '');
  return Buffer.from(seg.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
}

afterEach(() => vi.unstubAllEnvs());

describe('buildImgproxyUrl S3 rewriting', () => {
  it('rewrites our bucket URL to s3:// so imgproxy can use credentials', () => {
    vi.stubEnv('NEXT_PUBLIC_IMGPROXY_URL', IMGPROXY);
    vi.stubEnv('NEXT_PUBLIC_MEDIA_S3_BUCKET', BUCKET);

    const out = buildImgproxyUrl(`${GARAGE}/${BUCKET}/media/abc.jpg`, { width: 480 });
    expect(decodeSource(out)).toBe(`s3://${BUCKET}/media/abc.jpg`);
  });

  it('drops the query string, which would otherwise churn the cache key', () => {
    vi.stubEnv('NEXT_PUBLIC_IMGPROXY_URL', IMGPROXY);
    vi.stubEnv('NEXT_PUBLIC_MEDIA_S3_BUCKET', BUCKET);

    const out = buildImgproxyUrl(
      `${GARAGE}/${BUCKET}/media/abc.jpg?X-Amz-Signature=deadbeef`,
      { width: 480 },
    );
    expect(decodeSource(out)).toBe(`s3://${BUCKET}/media/abc.jpg`);
  });

  it('leaves third-party origins alone rather than inventing an s3 path', () => {
    vi.stubEnv('NEXT_PUBLIC_IMGPROXY_URL', IMGPROXY);
    vi.stubEnv('NEXT_PUBLIC_MEDIA_S3_BUCKET', BUCKET);

    const src = 'https://cdn.somewhere.com/other-bucket/pic.jpg';
    expect(decodeSource(buildImgproxyUrl(src, { width: 480 }))).toBe(src);
  });

  it('leaves sources untouched when no bucket is configured (local dev)', () => {
    vi.stubEnv('NEXT_PUBLIC_IMGPROXY_URL', IMGPROXY);
    vi.stubEnv('NEXT_PUBLIC_MEDIA_S3_BUCKET', '');

    const src = `${GARAGE}/${BUCKET}/media/abc.jpg`;
    expect(decodeSource(buildImgproxyUrl(src, { width: 480 }))).toBe(src);
  });

  it('still returns relative paths untouched', () => {
    vi.stubEnv('NEXT_PUBLIC_IMGPROXY_URL', IMGPROXY);
    vi.stubEnv('NEXT_PUBLIC_MEDIA_S3_BUCKET', BUCKET);

    expect(buildImgproxyUrl('/media/local.jpg', { width: 480 })).toBe('/media/local.jpg');
  });
});
