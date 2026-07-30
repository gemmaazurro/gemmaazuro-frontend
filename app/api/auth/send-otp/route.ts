import { NextResponse } from 'next/server';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { forwardPost } from '@/lib/auth/handlers';
import { getSessionToken } from '@/lib/auth/session';

// Returns no token — it only sends the code. Two purposes share the endpoint:
// signup verification (anonymous) and profile_update (needs the session, since
// Django checks the code against the signed-in user's otp_contact).
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const phone = typeof body?.phone === 'string' ? body.phone.trim() : '';
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const purpose = typeof body?.purpose === 'string' ? body.purpose : undefined;

  if (!phone && !email) {
    return NextResponse.json(
      { error: 'Enter a phone number or an email address.' },
      { status: 400 },
    );
  }

  const token = purpose === 'profile_update' ? await getSessionToken() : null;

  if (purpose === 'profile_update' && !token) {
    return NextResponse.json({ error: 'Please sign in first.' }, { status: 401 });
  }

  return forwardPost(
    ENDPOINTS.SEND_OTP,
    {
      ...(phone ? { phone } : {}),
      ...(email ? { email } : {}),
      ...(purpose ? { purpose } : {}),
    },
    { token },
  );
}
