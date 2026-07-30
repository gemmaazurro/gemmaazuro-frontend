// Server-side session reads.
//
// The token lives in an httpOnly cookie (see cookie.ts), so only this module
// and the route handlers under app/api/auth can see it. Client components ask
// the server for data instead of holding a token themselves.
//
// Anything that calls these becomes dynamic: reading cookies opts a route out
// of static rendering, which is correct here. Never call these from inside a
// `use cache` boundary — a cached response keyed without a user would serve one
// shopper's profile to everyone.

import { cookies } from 'next/headers';
import { apiFetch, ApiRequestError } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { SESSION_COOKIE } from './cookie';
import type { Order, SessionUser } from './types';

/** The raw token, or null when signed out. */
export async function getSessionToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}

/**
 * The signed-in user, or null.
 *
 * Returns null rather than throwing on 401/403 so a stale or revoked token
 * renders the signed-out view instead of a 500. Django has no refresh flow, so
 * an expired 30-day token is simply a signed-out user.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const token = await getSessionToken();
  if (!token) return null;

  try {
    return await apiFetch<SessionUser>(ENDPOINTS.USER_DETAIL, {
      token,
      cache: 'no-store',
    });
  } catch (error) {
    if (error instanceof ApiRequestError && (error.status === 401 || error.status === 403)) {
      return null;
    }
    throw error;
  }
}

/**
 * This shopper's orders, newest first.
 *
 * Note: with WhatsApp-only checkout the storefront never POSTs to
 * ORDER_CREATE, so in practice this only returns orders staff entered through
 * the dashboard. An empty list is the normal case, not a bug.
 */
export async function getSessionOrders(): Promise<Order[]> {
  const token = await getSessionToken();
  if (!token) return [];

  try {
    const page = await apiFetch<{ results?: Order[] } | Order[]>(ENDPOINTS.ORDERS, {
      token,
      cache: 'no-store',
    });

    const orders = Array.isArray(page) ? page : page.results ?? [];
    return [...orders].sort((a, b) => b.id - a.id);
  } catch (error) {
    if (error instanceof ApiRequestError && (error.status === 401 || error.status === 403)) {
      return [];
    }
    throw error;
  }
}
