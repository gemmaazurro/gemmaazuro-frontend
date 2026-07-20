// Contact details.
//
// The authoritative source is the CMS (`GET /pages/api/contact_us/`), but that
// is a server fetch and these are consumed by client components. Env var for
// now so the number is configurable rather than hardcoded; L5 replaces this
// with the CMS value passed down as props.

const FALLBACK_WA_PHONE = '201000000000';

export function getWhatsAppPhone(): string {
  return process.env.NEXT_PUBLIC_WHATSAPP_PHONE || FALLBACK_WA_PHONE;
}

export const WA_PHONE = getWhatsAppPhone();
