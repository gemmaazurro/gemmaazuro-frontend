// Integration: the dashboard-managed carousel.
//
// getCarouselSlides itself is a `use cache` function and needs the Next build
// pipeline, so these exercise the fetch + mapping underneath it.

import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { apiFetchPaginated } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { mediaUrl } from '@/lib/api/config';
import type { DjangoHero } from '@/lib/api/cms';

const BACKEND = 'http://localhost:8000';

const SLIDES: DjangoHero[] = [
  {
    id: 3,
    file: '/media/media/c.jpeg',
    title_en: 'Made to be worn',
    title_ar: 'صُنع ليُلبس',
    description_en: null,
    description_ar: null,
    btn: null,
    placement: 'carousel',
    position: 2,
    is_active: true,
  },
  {
    id: 1,
    file: '/media/media/a.jpeg',
    title_en: 'Los Angeles to Cairo',
    title_ar: 'من لوس أنجلوس إلى القاهرة',
    description_en: null,
    description_ar: null,
    btn: 'https://example.com/story',
    placement: 'carousel',
    position: 0,
    is_active: true,
  },
  {
    id: 2,
    file: '/media/media/b.mp4',
    title_en: 'Certified',
    title_ar: 'معتمد',
    description_en: null,
    description_ar: null,
    btn: null,
    placement: 'carousel',
    position: 1,
    is_active: true,
  },
];

const server = setupServer(
  http.get(`${BACKEND}/home/api/hero/`, ({ request }) => {
    const url = new URL(request.url);
    const placement = url.searchParams.get('placement');
    const active = url.searchParams.get('active');

    let results = SLIDES;
    if (placement) results = results.filter((slide) => slide.placement === placement);
    if (active === 'true') results = results.filter((slide) => slide.is_active);

    return HttpResponse.json(results);
  }),
);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_BACKEND_API_URL', BACKEND);
  vi.stubEnv('NEXT_PUBLIC_IMGPROXY_URL', '');
});

const VIDEO_EXTENSIONS = /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i;

async function loadSlides(locale: 'en' | 'ar' = 'en') {
  const page = await apiFetchPaginated<DjangoHero>(ENDPOINTS.HERO, {
    searchParams: { placement: 'carousel', active: 'true' },
  });

  return page.results
    .filter((hero) => hero.is_active !== false)
    .sort((a, b) => a.position - b.position)
    .map((hero) => ({
      id: hero.id,
      src: mediaUrl(hero.file),
      title: (locale === 'ar' ? hero.title_ar : hero.title_en) || hero.title_en || '',
      href: hero.btn || null,
      isVideo: VIDEO_EXTENSIONS.test(mediaUrl(hero.file)),
    }));
}

describe('carousel slides', () => {
  it('returns only carousel-placement slides', async () => {
    const slides = await loadSlides();
    expect(slides).toHaveLength(3);
  });

  it('orders by position, not by API order', async () => {
    const slides = await loadSlides();
    // The endpoint deliberately returns them 2,0,1.
    expect(slides.map((slide) => slide.id)).toEqual([1, 2, 3]);
    expect(slides[0].title).toBe('Los Angeles to Cairo');
  });

  it('absolutizes media paths', async () => {
    const slides = await loadSlides();
    expect(slides[0].src).toBe(`${BACKEND}/media/media/a.jpeg`);
  });

  it('flags video slides — Hero.file accepts any upload', async () => {
    const slides = await loadSlides();
    expect(slides.find((slide) => slide.id === 2)!.isVideo).toBe(true);
    expect(slides.find((slide) => slide.id === 1)!.isVideo).toBe(false);
  });

  it('honours the requested locale', async () => {
    const slides = await loadSlides('ar');
    expect(slides[0].title).toBe('من لوس أنجلوس إلى القاهرة');
  });

  it('carries the optional link through', async () => {
    const slides = await loadSlides();
    expect(slides[0].href).toBe('https://example.com/story');
    expect(slides[1].href).toBeNull();
  });

  it('sends no Authorization header — this feeds a cached read', async () => {
    let seen: string | null = 'unset';
    server.use(
      http.get(`${BACKEND}/home/api/hero/`, ({ request }) => {
        seen = request.headers.get('authorization');
        return HttpResponse.json([]);
      }),
    );

    await loadSlides();
    expect(seen).toBeNull();
  });
});
