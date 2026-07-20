import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  IMAGE_QUALITY,
  IMAGE_VARIANTS,
  buildImgproxyUrl,
  variantUrl,
} from './imgproxy';

const SOURCE = 'https://minio.example.com/gemmaazuro/items/images/abc.jpeg';

function withImgproxy(url: string | undefined) {
  vi.stubEnv('NEXT_PUBLIC_IMGPROXY_URL', url ?? '');
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('buildImgproxyUrl', () => {
  it('builds an unsigned imgproxy url with webp and the given width', () => {
    withImgproxy('https://img.example.com');
    const url = buildImgproxyUrl(SOURCE, { width: 480 });

    expect(url.startsWith('https://img.example.com/insecure/')).toBe(true);
    expect(url).toContain('rs:fit:480:0:0');
    expect(url).toContain(`q:${IMAGE_QUALITY}`);
    expect(url.endsWith('.webp')).toBe(true);
  });

  it('encodes the source as url-safe base64 without padding', () => {
    withImgproxy('https://img.example.com');
    const encoded = buildImgproxyUrl(SOURCE, { width: 100 })
      .split('/')
      .pop()!
      .replace('.webp', '');

    expect(encoded).not.toMatch(/[+/=]/);
    const restored = encoded.replace(/-/g, '+').replace(/_/g, '/');
    expect(Buffer.from(restored, 'base64').toString('utf8')).toBe(SOURCE);
  });

  it('never upscales unless explicitly asked', () => {
    withImgproxy('https://img.example.com');
    expect(buildImgproxyUrl(SOURCE, { width: 480 })).toContain(':0:0');
    expect(buildImgproxyUrl(SOURCE, { width: 480, enlarge: true })).toContain(':0:1');
  });

  it('supports fill for cropped boxes', () => {
    withImgproxy('https://img.example.com');
    const url = buildImgproxyUrl(SOURCE, { width: 400, height: 400, resize: 'fill' });
    expect(url).toContain('rs:fill:400:400:0');
  });

  // The local-dev guard: without this the app 404s every image.
  it('returns the source untouched when imgproxy is not configured', () => {
    withImgproxy(undefined);
    expect(buildImgproxyUrl(SOURCE, { width: 480 })).toBe(SOURCE);
  });

  it('returns relative paths untouched — imgproxy cannot fetch them', () => {
    withImgproxy('https://img.example.com');
    expect(buildImgproxyUrl('/media/items/a.jpeg', { width: 480 })).toBe(
      '/media/items/a.jpeg',
    );
  });

  it('handles an empty source without producing a broken url', () => {
    withImgproxy('https://img.example.com');
    expect(buildImgproxyUrl('', { width: 480 })).toBe('');
  });

  it('tolerates a trailing slash on the configured base url', () => {
    withImgproxy('https://img.example.com/');
    expect(buildImgproxyUrl(SOURCE, { width: 480 })).toContain(
      'https://img.example.com/insecure/',
    );
    expect(buildImgproxyUrl(SOURCE, { width: 480 })).not.toContain('//insecure');
  });
});

describe('variantUrl ladder', () => {
  it('exposes exactly the four named variants', () => {
    expect(Object.keys(IMAGE_VARIANTS)).toEqual(['thumb', 'small', 'medium', 'large']);
    expect(IMAGE_VARIANTS).toEqual({ thumb: 160, small: 480, medium: 960, large: 1920 });
  });

  it.each(['thumb', 'small', 'medium', 'large'] as const)(
    'builds the %s variant at its ladder width',
    (variant) => {
      withImgproxy('https://img.example.com');
      expect(variantUrl(SOURCE, variant)).toContain(
        `rs:fit:${IMAGE_VARIANTS[variant]}:0:0`,
      );
    },
  );
});
