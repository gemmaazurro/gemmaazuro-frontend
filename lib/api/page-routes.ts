// CMS Page slug -> storefront route.
//
// Deliberately free of any server-only import (no next/cache, no fetch
// helpers) because both the Server Components and the client Footer need it.
// Putting it in cms.ts would pull the `use cache` machinery into the client
// bundle.

/**
 * Editors curate CMS Pages into the nav and footer, but a Page carries only a
 * slug and a title — there is no body to render, so there is no generic
 * /[slug] route to fall back on. An unmapped slug therefore has nowhere to go
 * and must be dropped rather than linked, or the footer grows 404s.
 *
 * Note `polices` — the Django URL and slug carry that typo (see the header of
 * endpoints.ts), so both spellings resolve to /policies. Likewise
 * `returns-exchange` is part of the policies page, and `visit-us` is /branches.
 */
const PAGE_ROUTES: Record<string, string> = {
  'faq': '/faq',
  'about-us': '/about-us',
  'contact-us': '/contact-us',
  'branches': '/branches',
  'visit-us': '/branches',
  'polices': '/policies',
  'policies': '/policies',
  'returns-exchange': '/policies',
  'returns-refunds': '/policies',
  'shipping': '/policies',
  'privacy': '/policies',
  'terms': '/policies',
  'size-chart': '/size-chart',
  'size-guide': '/size-chart',
  'blog': '/blog',
  'journal': '/blog',
};

/** null when the slug has no page to point at — callers must skip those. */
export function pageHref(slug: string): string | null {
  return PAGE_ROUTES[slug.replace(/^\/+/, '')] ?? null;
}

/** Map curated CMS pages onto real links, dropping any that lead nowhere. */
export function toPageLinks(
  pages: { slug: string; title: string }[] | undefined | null,
): { label: string; href: string }[] {
  return (pages ?? [])
    .map((page) => ({ label: page.title, href: pageHref(page.slug) }))
    .filter((link): link is { label: string; href: string } => link.href !== null);
}
