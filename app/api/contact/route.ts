import { NextResponse } from 'next/server';
import { apiFetch } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { errorResponse } from '@/lib/auth/handlers';

/**
 * Contact form submissions.
 *
 * The same Django endpoint serves the store's contact details on GET and
 * accepts a message on POST — and only when a `message` field is present does
 * it allow anonymous access (pages/api/views.py:338). Django emails the address
 * configured in the dashboard, and 400s if none is set.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const message = typeof body?.message === 'string' ? body.message.trim() : '';
  const phone = typeof body?.phone === 'string' ? body.phone.trim() : '';
  const subject = typeof body?.subject === 'string' ? body.subject.trim() : '';

  if (!name || !message) {
    return NextResponse.json(
      { error: 'Please add your name and a message.' },
      { status: 400 },
    );
  }

  if (!email && !phone) {
    return NextResponse.json(
      { error: 'Leave an email or a phone number so we can reply.' },
      { status: 400 },
    );
  }

  try {
    await apiFetch(ENDPOINTS.CONTACT_US, {
      method: 'POST',
      body: { name, email, phone, subject, message },
      cache: 'no-store',
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
