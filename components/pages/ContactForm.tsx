'use client';

import { useState } from 'react';
import { WhatsApp } from '@/components/core/Icons';
import { WA_PHONE } from '@/lib/contact';
import type { ContactDetails } from '@/lib/api/cms';

const fieldStyle: React.CSSProperties = {
  width: '100%',
  height: 52,
  padding: '0 16px',
  border: '1.5px solid var(--color-border-dark)',
  borderRadius: 'var(--rounded-input)',
  fontFamily: 'var(--font-body)',
  fontSize: 15,
  color: 'var(--color-foreground)',
  background: 'var(--color-background)',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s ease',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: 8,
  fontSize: 12,
  fontFamily: 'var(--font-wordmark)',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--color-foreground-muted)',
};

export default function ContactForm({ contact }: { contact: ContactDetails | null }) {
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const whatsapp = contact?.whatsapp || WA_PHONE;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    setBusy(true);
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(data.get('name') ?? ''),
          email: String(data.get('email') ?? ''),
          phone: String(data.get('phone') ?? ''),
          subject: String(data.get('subject') ?? ''),
          message: String(data.get('message') ?? ''),
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        setError(payload?.error || 'Your message could not be sent. Please try WhatsApp instead.');
        return;
      }

      setSent(true);
    } catch {
      setError('Could not reach the server. Please try WhatsApp instead.');
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div style={{
        background: 'var(--color-surface)', borderRadius: 'var(--rounded-block)',
        padding: 'clamp(24px,4vw,36px)',
      }}>
        <h2 style={{ margin: '0 0 8px', fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 20 }}>
          Thank you — your message is on its way.
        </h2>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: 'var(--color-foreground-muted)' }}>
          We usually reply within one working day. For anything urgent, message us on WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'var(--grid-reg-form)', gap: 14 }}>
        <div>
          <label style={labelStyle} htmlFor="contact-name">Name</label>
          <input id="contact-name" name="name" required type="text" placeholder="Your name" style={fieldStyle} />
        </div>
        <div>
          <label style={labelStyle} htmlFor="contact-phone">Phone</label>
          <input id="contact-phone" name="phone" type="tel" placeholder="+20…" style={fieldStyle} />
        </div>
      </div>

      <div>
        <label style={labelStyle} htmlFor="contact-email">Email</label>
        <input id="contact-email" name="email" type="email" placeholder="your@email.com" style={fieldStyle} />
      </div>

      <div>
        <label style={labelStyle} htmlFor="contact-subject">Subject</label>
        <input id="contact-subject" name="subject" type="text" placeholder="Custom design, sizing, an order…" style={fieldStyle} />
      </div>

      <div>
        <label style={labelStyle} htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          placeholder="Tell us what you have in mind."
          style={{ ...fieldStyle, height: 'auto', padding: '14px 16px', resize: 'vertical', lineHeight: 1.6 }}
        />
      </div>

      <p style={{ margin: 0, fontSize: 13, color: 'var(--color-foreground-muted)' }}>
        Leave an email or a phone number so we can reply.
      </p>

      {error && (
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: 'var(--color-sale)' }}>{error}</p>
      )}

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button type="submit" disabled={busy} style={{
          height: 54, padding: '0 28px', borderRadius: 'var(--rounded-button)',
          background: 'var(--color-brand)', color: '#fff', border: 'none',
          fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 500,
          cursor: busy ? 'progress' : 'pointer', opacity: busy ? 0.7 : 1,
        }}>
          {busy ? 'Sending…' : 'Send message'}
        </button>

        <a
          href={`https://wa.me/${whatsapp.replace(/[^\d]/g, '')}`}
          target="_blank"
          rel="noreferrer"
          style={{
            height: 54, padding: '0 24px', borderRadius: 'var(--rounded-button)',
            border: '1.5px solid var(--color-border-dark)', display: 'inline-flex',
            alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 500,
            color: 'var(--color-foreground)', textDecoration: 'none',
          }}
        >
          <WhatsApp size={18} /> WhatsApp us
        </a>
      </div>
    </form>
  );
}
