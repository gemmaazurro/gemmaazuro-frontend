import { NextResponse } from 'next/server';
import { apiFetch } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { errorResponse } from '@/lib/auth/handlers';
import { getSessionToken } from '@/lib/auth/session';
import type { SessionUser } from '@/lib/auth/types';

// UpdateProfileView accepts full_name, email, phone and username. Changing a
// contact detail may require a verified one-time code first, which Django
// enforces server-side; we surface whatever it says.
export async function PATCH(request: Request) {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ error: 'Please sign in first.' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);

  const payload: Record<string, string> = {};
  for (const field of ['full_name', 'email', 'phone', 'username'] as const) {
    const value = body?.[field];
    if (typeof value === 'string' && value.trim()) payload[field] = value.trim();
  }

  if (Object.keys(payload).length === 0) {
    return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 });
  }

  try {
    const user = await apiFetch<SessionUser>(ENDPOINTS.UPDATE_PROFILE, {
      method: 'PATCH',
      body: payload,
      token,
      cache: 'no-store',
    });

    return NextResponse.json(user);
  } catch (error) {
    return errorResponse(error);
  }
}
