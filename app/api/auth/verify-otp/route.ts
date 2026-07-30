import { NextResponse } from 'next/server';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { exchangeForSession, forwardPost } from '@/lib/auth/handlers';
import { getSessionToken } from '@/lib/auth/session';

// Two very different responses from one Django endpoint:
//   purpose === 'profile_update' -> { detail, verified_contact }, no token,
//                                   and it requires the current session.
//   anything else                -> { token, ... }, which signs the user in.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const otp = typeof body?.otp === 'string' ? body.otp.trim() : '';
  const phone = typeof body?.phone === 'string' ? body.phone.trim() : '';
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const purpose = typeof body?.purpose === 'string' ? body.purpose : undefined;

  if (!otp || (!phone && !email)) {
    return NextResponse.json(
      { error: 'Enter the code we sent you.' },
      { status: 400 },
    );
  }

  const payload = {
    otp,
    ...(phone ? { phone } : {}),
    ...(email ? { email } : {}),
    ...(purpose ? { purpose } : {}),
  };

  if (purpose === 'profile_update') {
    const token = await getSessionToken();
    if (!token) {
      return NextResponse.json({ error: 'Please sign in first.' }, { status: 401 });
    }
    return forwardPost(ENDPOINTS.VERIFY_OTP, payload, { token });
  }

  return exchangeForSession(ENDPOINTS.VERIFY_OTP, payload);
}
