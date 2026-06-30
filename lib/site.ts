const FALLBACK_SITE_URL = 'https://gemmaazuro-frontend.vercel.app';

function normalizeUrl(value: string) {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

export function getSiteUrl() {
  const value =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined) ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
    FALLBACK_SITE_URL;

  return normalizeUrl(value);
}

export function absoluteUrl(path = '/') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath}`;
}
