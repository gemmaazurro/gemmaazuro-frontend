// Backend base URL + media URL absolutization.
//
// Mirrors the fallback style of lib/site.ts so there is one way to resolve a
// base URL in this codebase.

const FALLBACK_BACKEND_URL = 'http://localhost:8000';

function normalizeUrl(value: string) {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

export function getBackendUrl(): string {
  return normalizeUrl(process.env.NEXT_PUBLIC_BACKEND_API_URL || FALLBACK_BACKEND_URL);
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
