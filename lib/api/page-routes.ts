// CMS Page slug -> storefront route.
//
// Deliberately kept free of any server-only import (no next/cache, no fetch
// helpers) because both the Server Components and the client Footer need it.
// Putting it in cms.ts would pull the `use cache` machinery into the client
// bundle.

/**
 * Note `polices` — the Django URL and slug carry that typo (see the header of
 * endpoints.ts), so both spellings resolve to /policies.
 */
const PAGE_ROUTES: Record<string, string> = {
  'faq': '/faq',
  'about-us': '/about-us',
  'contact-us': '/contact-us',
  'branches': '/branches',
  'polices': '/policies',
  'policies': '/policies',
  'size-chart': '/size-chart',
  'blog': '/blog',
};

/** Falls through to /<slug> so a new CMS page is never a dead link. */
export function pageHref(slug: string): string {
  return PAGE_ROUTES[slug] ?? `/${slug.replace(/^\/+/, '')}`;
}
