import { NextResponse } from 'next/server';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { exchangeForSession } from '@/lib/auth/handlers';

// GoogleLoginView validates the credential against oauth2.googleapis.com and
// checks the audience claim, so we just forward it.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const credential = typeof body?.credential === 'string' ? body.credential : '';

  if (!credential) {
    return NextResponse.json({ error: 'Google sign-in was cancelled.' }, { status: 400 });
  }

  return exchangeForSession(ENDPOINTS.GOOGLE_LOGIN, { credential });
}
