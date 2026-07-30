import { NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/auth/cookie';

// Django issues stateless HS256 tokens with no server-side revocation, so
// signing out is purely "forget the cookie".
export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
