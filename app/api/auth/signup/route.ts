import { NextResponse } from 'next/server';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { exchangeForSession } from '@/lib/auth/handlers';

// CreateUserView answers { token, user }, so a successful signup is also a
// sign-in — no second round trip needed.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const username = typeof body?.username === 'string' ? body.username.trim() : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  const fullName = typeof body?.full_name === 'string' ? body.full_name.trim() : '';
  const email = typeof body?.email === 'string' ? body.email.trim() : '';

  if (!username || !password) {
    return NextResponse.json(
      { error: 'Choose a username and a password.' },
      { status: 400 },
    );
  }

  return exchangeForSession(ENDPOINTS.SIGNUP, {
    username,
    password,
    ...(fullName ? { full_name: fullName } : {}),
    ...(email ? { email } : {}),
  });
}
