// Backend base URL + media URL absolutization.
//
// Mirrors the fallback style of lib/site.ts so there is one way to resolve a
// base URL in this codebase.

const FALLBACK_BACKEND_URL = 'http://localhost:8000';

function normalizeUrl(value: string) {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

export function getBackendUrl(): string {
  const configured = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  // Falling back to localhost in production is silent death: every catalog and
  // CMS read resolves to a host that does not exist, and the site renders as if
  // the store were simply empty. Fail loudly instead — a missing env var in
  // Vercel should stop the deploy, not ship a blank shop.
  if (!configured && process.env.NODE_ENV === 'production') {
    throw new Error(
      'NEXT_PUBLIC_BACKEND_API_URL is not set. Set it in the Vercel project ' +
        'settings (see .env.example); the localhost fallback is dev-only.',
    );
  }

  return normalizeUrl(configured || FALLBACK_BACKEND_URL);
}

/**
 * Absolutize a media path returned by Django.
 *
 * DRF emits either a relative `/media/...` path or a fully-qualified URL
 * depending on whether the serializer had a request in context — and once
 * USE_S3 is on, paths come back as absolute MinIO URLs. Handle all three.
 */
export function mediaUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return `${getBackendUrl()}${path.startsWith('/') ? path : `/${path}`}`;
}
