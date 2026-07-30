// CMS reads (hero, carousel, and friends).
//
// All anonymous, so all safe to cache. Kept separate from products-cache.ts
// because none of this goes through the product adapter.

import { cacheLife, cacheTag } from 'next/cache';
import { apiFetch, apiFetchPaginated, ApiRequestError } from './client';
import { ENDPOINTS } from './endpoints';
import { mediaUrl } from './config';
import type { Locale } from './types';

/**
 * Read a CMS singleton (footer, about, policies, …).
 *
 * These views answer with the object or a 404 when an editor has not created
 * the row yet, which is an empty state rather than an error — so 404 becomes
 * null and the caller renders its own fallback. Any other failure also yields
 * null so one unreachable CMS read can never blank the whole page.
 */
async function getSingleton<T>(path: string, locale: Locale): Promise<T | null> {
  try {
    return await apiFetch<T>(path, { searchParams: { lang: locale } });
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) return null;
    return null;
  }
}

/** Read a CMS list, tolerating both paginated and bare-array responses. */
async function getList<T>(
  path: string,
  locale: Locale,
  searchParams: Record<string, string> = {},
): Promise<T[]> {
  try {
    const page = await apiFetchPaginated<T>(path, {
      searchParams: { lang: locale, ...searchParams },
    });
    return page.results;
  } catch {
    return [];
  }
}

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

// ---------------------------------------------------------------------------
// Announcements
// ---------------------------------------------------------------------------

/**
 * `placement` decides which strip a row belongs to, so one model drives all
 * three: the top promo bar, the ribbon under the hero, and the accent ribbon.
 */
export type AnnouncementPlacement = 'promo' | 'hero_ribbon' | 'accent_ribbon';

export interface Announcement {
  id: number;
  content: string;
  is_active: boolean;
  marquee: boolean;
  placement: AnnouncementPlacement;
  position: number;
}

export async function getAnnouncements(
  placement: AnnouncementPlacement,
  locale: Locale = 'en',
): Promise<Announcement[]> {
  'use cache';
  cacheTag('cms', 'announcement', `announcement:${placement}`);
  cacheLife('minutes');

  const rows = await getList<Announcement>(ENDPOINTS.ANNOUNCEMENT, locale, {
    placement,
    active: 'true',
  });

  // The backend already filters, but anonymous GETs of older rows can still
  // arrive without the flag set — belt and braces, and cheap.
  return rows
    .filter((row) => row.is_active !== false && row.content?.trim())
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
}

// ---------------------------------------------------------------------------
// Footer, payment methods and contact details
// ---------------------------------------------------------------------------

export interface FooterPage {
  id: number;
  slug: string;
  title: string;
}


export interface FooterSubGroup {
  id: number;
  name: string;
}

export interface PaymentMethod {
  id: number;
  name: string;
  logo: string | null;
}

export interface Footer {
  id: number;
  section1_title: string | null;
  section2_title: string | null;
  description: string | null;
  newsletter_title: string | null;
  section1_pages: FooterPage[];
  section2_subgroups: FooterSubGroup[];
  section3_payment_methods: PaymentMethod[];
  facebook_link: string | null;
  instagram_link: string | null;
  tiktok_link: string | null;
  twitter_link: string | null;
}

export async function getFooter(locale: Locale = 'en'): Promise<Footer | null> {
  'use cache';
  cacheTag('cms', 'footer');
  cacheLife('minutes');

  return getSingleton<Footer>(ENDPOINTS.FOOTER, locale);
}

export async function getPaymentMethods(locale: Locale = 'en'): Promise<PaymentMethod[]> {
  'use cache';
  cacheTag('cms', 'payment-methods');
  cacheLife('minutes');

  const rows = await getList<PaymentMethod>(ENDPOINTS.PAYMENT_METHODS, locale);
  return rows.map((row) => ({ ...row, logo: row.logo ? mediaUrl(row.logo) : null }));
}

/** Phone, WhatsApp and email — the footer's contact block and /contact-us. */
export interface ContactDetails {
  id: number;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  company_name: string | null;
}

export async function getContactDetails(locale: Locale = 'en'): Promise<ContactDetails | null> {
  'use cache';
  cacheTag('cms', 'contact');
  cacheLife('minutes');

  return getSingleton<ContactDetails>(ENDPOINTS.CONTACT_US, locale);
}

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

export interface NavData {
  id: number;
  name: string;
  pages_display: FooterPage[];
  groups_display: { id: number; name: string }[];
}

/**
 * The editor-curated nav.
 *
 * Returns null when nothing is configured, in which case the header keeps
 * deriving its menu from Groups/SubGroups — which shows everything rather
 * than nothing.
 */
export async function getNav(locale: Locale = 'en'): Promise<NavData | null> {
  'use cache';
  cacheTag('cms', 'nav');
  cacheLife('minutes');

  return getSingleton<NavData>(ENDPOINTS.NAV, locale);
}

// ---------------------------------------------------------------------------
// Content pages
// ---------------------------------------------------------------------------

export interface Faq {
  id: number;
  question: string;
  answer: string;
}

export async function getFaqs(locale: Locale = 'en'): Promise<Faq[]> {
  'use cache';
  cacheTag('cms', 'faq');
  cacheLife('minutes');

  return getList<Faq>(ENDPOINTS.FAQ, locale);
}

export interface Branch {
  id: number;
  address: string | null;
  area: string | null;
  location: string | null;
  working_hours: string | null;
  phone_numbers: string | null;
}

export async function getBranches(locale: Locale = 'en'): Promise<Branch[]> {
  'use cache';
  cacheTag('cms', 'branches');
  cacheLife('minutes');

  return getList<Branch>(ENDPOINTS.BRANCH, locale);
}

/** About Us and the size chart are both a single rich-text blob. */
export interface RichTextPage {
  id: number;
  content: string | null;
}

export async function getAboutUs(locale: Locale = 'en'): Promise<RichTextPage | null> {
  'use cache';
  cacheTag('cms', 'about-us');
  cacheLife('minutes');

  return getSingleton<RichTextPage>(ENDPOINTS.ABOUT_US, locale);
}

export async function getSizeChart(locale: Locale = 'en'): Promise<RichTextPage | null> {
  'use cache';
  cacheTag('cms', 'size-chart');
  cacheLife('minutes');

  return getSingleton<RichTextPage>(ENDPOINTS.SIZE_CHART, locale);
}

/** Four separate policies live on one row. */
export interface Policies {
  id: number;
  return_refund: string | null;
  shipping: string | null;
  privacy: string | null;
  service: string | null;
}

export async function getPolicies(locale: Locale = 'en'): Promise<Policies | null> {
  'use cache';
  cacheTag('cms', 'policies');
  cacheLife('minutes');

  return getSingleton<Policies>(ENDPOINTS.POLICIES, locale);
}

export interface BlogPost {
  id: number;
  url: string | null;
  cover: string | null;
  title: string | null;
  content: string | null;
  created_at: string;
}

export async function getBlogPosts(locale: Locale = 'en'): Promise<BlogPost[]> {
  'use cache';
  cacheTag('cms', 'blog');
  cacheLife('minutes');

  const rows = await getList<BlogPost>(ENDPOINTS.BLOG, locale);
  return rows.map((row) => ({ ...row, cover: row.cover ? mediaUrl(row.cover) : null }));
}
