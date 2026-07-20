// CMS reads (hero, carousel, and friends).
//
// All anonymous, so all safe to cache. Kept separate from products-cache.ts
// because none of this goes through the product adapter.

import { cacheLife, cacheTag } from 'next/cache';
import { apiFetchPaginated } from './client';
import { ENDPOINTS } from './endpoints';
import { mediaUrl } from './config';
import type { Locale } from './types';

export interface DjangoHero {
  id: number;
  file: string;
  title_en: string | null;
  title_ar: string | null;
  description_en: string | null;
  description_ar: string | null;
  btn: string | null;
  placement: 'hero' | 'carousel';
  position: number;
  is_active: boolean;
}

export interface Slide {
  id: number;
  src: string;
  alt: string;
  title: string;
  description: string;
  href: string | null;
  /** Hero.file accepts any upload, so a slide may be a video. */
  isVideo: boolean;
}

const VIDEO_EXTENSIONS = /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i;

function toSlide(hero: DjangoHero, locale: Locale): Slide {
  const title = (locale === 'ar' ? hero.title_ar : hero.title_en) || hero.title_en || '';
  const description =
    (locale === 'ar' ? hero.description_ar : hero.description_en) || hero.description_en || '';
  const src = mediaUrl(hero.file);

  return {
    id: hero.id,
    src,
    alt: title || 'Gemma Azzurro',
    title,
    description,
    href: hero.btn || null,
    isVideo: VIDEO_EXTENSIONS.test(src),
  };
}

async function getSlides(placement: 'hero' | 'carousel', locale: Locale): Promise<Slide[]> {
  const page = await apiFetchPaginated<DjangoHero>(ENDPOINTS.HERO, {
    searchParams: { placement, active: 'true' },
  });

  return page.results
    .filter((hero) => hero.is_active !== false)
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map((hero) => toSlide(hero, locale));
}

/**
 * Brand-story carousel slides, editable from the dashboard.
 *
 * Returns [] when the backend is unreachable or nothing is configured — the
 * component falls back to its static asset rather than rendering an empty
 * carousel.
 */
export async function getCarouselSlides(locale: Locale = 'en'): Promise<Slide[]> {
  'use cache';
  cacheTag('cms', 'carousel');
  cacheLife('minutes');

  try {
    return await getSlides('carousel', locale);
  } catch {
    return [];
  }
}

export async function getHeroSlides(locale: Locale = 'en'): Promise<Slide[]> {
  'use cache';
  cacheTag('cms', 'hero');
  cacheLife('minutes');

  try {
    return await getSlides('hero', locale);
  } catch {
    return [];
  }
}
