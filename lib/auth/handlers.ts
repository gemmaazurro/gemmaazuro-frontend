// Shared plumbing for the app/api/auth/* route handlers.
//
// These exist because the token is httpOnly: the browser cannot set or read it,
// so every credential exchange has to round-trip through our own origin. Each
// handler forwards to Django, then sets or clears the cookie.

import { NextResponse } from 'next/server';
import { apiFetch, ApiRequestError } from '@/lib/api/client';
import { SESSION_COOKIE, sessionCookieOptions } from './cookie';
import type { AuthResponse } from './types';

/** Collapse an ApiRequestError into the JSON shape the account UI renders. */
export function errorResponse(error: unknown): NextResponse {
  if (error instanceof ApiRequestError) {
    return NextResponse.json(
      { error: error.message, fieldErrors: error.fieldErrors },
      { status: error.status },
    );
  }

  // A network failure against Django, not a rejected credential.
  return NextResponse.json(
    { error: 'Could not reach the server. Please try again.' },
    { status: 502 },
  );
}

/**
 * POST to a Django endpoint that answers with a token, and store it.
 *
 * The token is deliberately not echoed back to the client — the whole point of
 * httpOnly is that the browser never holds it.
 */
export async function exchangeForSession(
  path: string,
  body: unknown,
  { token }: { token?: string | null } = {},
): Promise<NextResponse> {
  try {
    const auth = await apiFetch<AuthResponse>(path, {
      method: 'POST',
      body,
      token,
      cache: 'no-store',
    });

    if (!auth?.token) {
      return NextResponse.json(
        { error: 'The server did not return a session token.' },
        { status: 502 },
      );
    }

    const response = NextResponse.json({
      ok: true,
      role: auth.role,
      name: auth.full_name || auth.name || auth.username || '',
      isNewUser: auth.is_new_user ?? false,
    });

    response.cookies.set(SESSION_COOKIE, auth.token, sessionCookieOptions());
    return response;
  } catch (error) {
    return errorResponse(error);
  }
}

/** Forward a call that needs no token and returns no token (e.g. send-otp). */
export async function forwardPost(
  path: string,
  body: unknown,
  { token }: { token?: string | null } = {},
): Promise<NextResponse> {
  try {
    const data = await apiFetch<unknown>(path, {
      method: 'POST',
      body,
      token,
      cache: 'no-store',
    });

    return NextResponse.json(data ?? { ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
