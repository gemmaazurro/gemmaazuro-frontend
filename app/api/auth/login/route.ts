import { NextResponse } from 'next/server';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { exchangeForSession } from '@/lib/auth/handlers';

// Django's LoginView accepts either `username` or `phone`, plus `password`.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const identifier = typeof body?.identifier === 'string' ? body.identifier.trim() : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!identifier || !password) {
    return NextResponse.json(
      { error: 'Enter your username or phone number and your password.' },
      { status: 400 },
    );
  }

  // A leading + or all-digits means they typed a phone number, which Django
  // looks up on a different column.
  const looksLikePhone = /^\+?\d[\d\s-]*$/.test(identifier);

  return exchangeForSession(ENDPOINTS.LOGIN, {
    password,
    ...(looksLikePhone
      ? { phone: identifier.replace(/[\s-]/g, '') }
      : { username: identifier }),
  });
}
