'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RevealBlock from '@/components/motion/RevealBlock';
import { TextEffect } from '@/components/core/text-effect';
import { Shield, ArrowRight } from '@/components/core/Icons';
import { WA_PHONE } from '@/lib/contact';
import type { Order, SessionUser } from '@/lib/auth/types';

interface AccountContentProps {
  /** Null when signed out — the server resolved this from the session cookie. */
  user: SessionUser | null;
  orders: Order[];
}

/** Django stores one `full_name`, but the register form asks for two halves. */
function firstNameOf(user: SessionUser): string {
  const full = (user.full_name || user.username || '').trim();
  return full.split(/\s+/)[0] || 'there';
}

const EGP = new Intl.NumberFormat('en-EG', { maximumFractionDigits: 0 });

function formatTotal(order: Order): string {
  const total = Number(order.total_price) || 0;
  return `${EGP.format(total)} EGP`;
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

/** The first line's product name, which is what the row has room for. */
function orderTitle(order: Order): string {
  const first = order.items?.[0];
  if (!first) return 'Order';

  const translations = first.item?.translations_;
  const name = translations?.en?.name || translations?.ar?.name || first.item?.code;
  const extra = (order.items?.length ?? 0) - 1;

  return extra > 0 ? `${name || 'Item'} + ${extra} more` : name || 'Item';
}

export default function AccountContent({ user, orders }: AccountContentProps) {
  const router = useRouter();
  const [tab, setTab] = useState('signin');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Profile editing
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    full_name: user?.full_name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
  });

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
  const errorStyle: React.CSSProperties = {
    margin: 0,
    fontSize: 13,
    color: 'var(--color-sale)',
    lineHeight: 1.5,
  };

  /** POST to one of our own /api/auth routes; they own the httpOnly cookie. */
  async function submitAuth(path: string, body: unknown) {
    setBusy(true);
    setError(null);

    try {
      const response = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.error || 'Something went wrong. Please try again.');
        return;
      }

      // The session cookie is set; re-render the server component so it picks
      // up the profile and orders.
      router.refresh();
    } catch {
      setError('Could not reach the server. Please check your connection.');
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    setBusy(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function handleSaveProfile(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        // Django may demand a verified one-time code before a contact change.
        setError(data?.error || 'Could not save your profile.');
        return;
      }

      setEditing(false);
      router.refresh();
    } catch {
      setError('Could not reach the server. Please check your connection.');
    } finally {
      setBusy(false);
    }
  }

  const primaryButtonStyle: React.CSSProperties = {
    height: 54,
    borderRadius: 'var(--rounded-button)',
    background: 'var(--color-brand)',
    color: '#fff',
    border: 'none',
    fontFamily: 'var(--font-body)',
    fontSize: 15,
    fontWeight: 500,
    cursor: busy ? 'progress' : 'pointer',
    opacity: busy ? 0.7 : 1,
    transition: 'background 0.2s ease',
  };

  if (!user) {
    return (
      <div style={{ maxWidth: 'var(--page-width)', margin: '0 auto', padding: '48px clamp(20px,3vw,40px) 88px', minHeight: '70vh' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <RevealBlock>
            <span style={{ fontFamily: 'var(--font-wordmark)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-brand)', display: 'block', marginBottom: 12 }}>
              Your Account
            </span>
            <h1 style={{ margin: '0 0 32px', fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 'clamp(2rem,4vw,2.8rem)', lineHeight: 1 }}>
              {tab === 'signin' ? 'Welcome back' : 'Create account'}
            </h1>
          </RevealBlock>

          <RevealBlock delay={0.1}>
            <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', marginBottom: 32 }}>
              {[['signin', 'Sign In'], ['register', 'Create Account']].map(([t, l]) => (
                <button key={t} onClick={() => { setTab(t); setError(null); }} style={{
                  flex: 1, padding: '13px 0', background: 'transparent', border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: tab === t ? 500 : 400,
                  color: tab === t ? 'var(--color-foreground)' : 'var(--color-foreground-muted)',
                  borderBottom: tab === t ? '2px solid var(--color-foreground)' : '2px solid transparent',
                  marginBottom: -1, transition: 'all 0.2s ease',
                }}>{l}</button>
              ))}
            </div>
          </RevealBlock>

          {tab === 'signin' ? (
            <RevealBlock delay={0.15}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const data = new FormData(e.currentTarget);
                  submitAuth('/api/auth/login', {
                    identifier: String(data.get('identifier') ?? ''),
                    password: String(data.get('password') ?? ''),
                  });
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
              >
                {/* Django's LoginView matches on username or phone, not email. */}
                <div><label style={labelStyle}>Username or phone</label>
                  <input required name="identifier" type="text" autoComplete="username" placeholder="your username or +20…" style={fieldStyle}
                    onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = 'var(--color-brand)'}
                    onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = 'var(--color-border-dark)'} /></div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
                    <a href={`https://wa.me/${WA_PHONE}?text=${encodeURIComponent('Hello, I need help signing in to my Gemma Azzurro account.')}`}
                      target="_blank" rel="noreferrer"
                      style={{ fontSize: 13, color: 'var(--color-brand)', textDecoration: 'none' }}>
                      Forgot?
                    </a>
                  </div>
                  <input required name="password" type="password" autoComplete="current-password" placeholder="••••••••" style={fieldStyle}
                    onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = 'var(--color-brand)'}
                    onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = 'var(--color-border-dark)'} />
                </div>
                {error && <p style={errorStyle}>{error}</p>}
                <button type="submit" disabled={busy} style={primaryButtonStyle}
                  onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-brand-dark)'}
                  onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-brand)'}>
                  {busy ? 'Signing in…' : 'Sign In'}
                </button>
                <p style={{ margin: 0, textAlign: 'center', fontSize: 13, color: 'var(--color-foreground-muted)' }}>
                  New here?{' '}
                  <button type="button" onClick={() => { setTab('register'); setError(null); }} style={{ color: 'var(--color-foreground)', textDecoration: 'underline', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}>
                    Create an account
                  </button>
                </p>
              </form>
            </RevealBlock>
          ) : (
            <RevealBlock delay={0.15}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const data = new FormData(e.currentTarget);
                  const first = String(data.get('first_name') ?? '').trim();
                  const last = String(data.get('last_name') ?? '').trim();

                  submitAuth('/api/auth/signup', {
                    username: String(data.get('username') ?? ''),
                    password: String(data.get('password') ?? ''),
                    email: String(data.get('email') ?? ''),
                    // Django stores a single full_name.
                    full_name: [first, last].filter(Boolean).join(' '),
                  });
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'var(--grid-reg-form)', gap: 14 }}>
                  <div><label style={labelStyle}>First name</label>
                    <input required name="first_name" type="text" autoComplete="given-name" placeholder="Laila" style={fieldStyle}
                      onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = 'var(--color-brand)'}
                      onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = 'var(--color-border-dark)'} /></div>
                  <div><label style={labelStyle}>Last name</label>
                    <input required name="last_name" type="text" autoComplete="family-name" placeholder="Hassan" style={fieldStyle}
                      onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = 'var(--color-brand)'}
                      onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = 'var(--color-border-dark)'} /></div>
                </div>
                <div><label style={labelStyle}>Username</label>
                  <input required name="username" type="text" autoComplete="username" placeholder="laila.hassan" style={fieldStyle}
                    onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = 'var(--color-brand)'}
                    onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = 'var(--color-border-dark)'} /></div>
                <div><label style={labelStyle}>Email</label>
                  <input required name="email" type="email" autoComplete="email" placeholder="your@email.com" style={fieldStyle}
                    onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = 'var(--color-brand)'}
                    onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = 'var(--color-border-dark)'} /></div>
                <div><label style={labelStyle}>Password</label>
                  <input required name="password" type="password" autoComplete="new-password" placeholder="8+ characters" style={fieldStyle}
                    onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = 'var(--color-brand)'}
                    onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = 'var(--color-border-dark)'} /></div>
                {error && <p style={errorStyle}>{error}</p>}
                <button type="submit" disabled={busy} style={primaryButtonStyle}
                  onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-brand-dark)'}
                  onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-brand)'}>
                  {busy ? 'Creating…' : 'Create Account'}
                </button>
              </form>
            </RevealBlock>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 'var(--page-width)', margin: '0 auto', padding: '48px clamp(20px,3vw,40px) 88px' }}>
      <RevealBlock>
        <span style={{ fontFamily: 'var(--font-wordmark)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-brand)', display: 'block', marginBottom: 12 }}>
          Welcome back
        </span>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48, gap: 16, flexWrap: 'wrap' }}>
          <TextEffect as="h1" per="char" preset="fade" delay={0.1} speedReveal={2.2}
            style={{ margin: 0, fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 'clamp(2rem,5vw,3.2rem)', lineHeight: 1 }}>
            {`Hello, ${firstNameOf(user)}.`}
          </TextEffect>
          <button onClick={handleSignOut} disabled={busy}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--color-foreground-muted)', textDecoration: 'underline' }}>
            Sign out
          </button>
        </div>
      </RevealBlock>

      <div style={{ display: 'grid', gridTemplateColumns: 'var(--grid-dashboard)', gap: 'clamp(16px,3vw,32px)' }}>
        <RevealBlock delay={0.1} style={{ gridColumn: '1/-1' }}>
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--rounded-block)', overflow: 'hidden' }}>
            <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 20 }}>Order History</h2>
              <span style={{ fontSize: 13, color: 'var(--color-foreground-muted)' }}>
                {orders.length} {orders.length === 1 ? 'order' : 'orders'}
              </span>
            </div>

            {orders.length === 0 ? (
              // Checkout completes over WhatsApp, so this is the normal state
              // until someone records the order in the dashboard.
              <div style={{ padding: '36px 28px', textAlign: 'center' }}>
                <p style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 500 }}>No orders yet</p>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--color-foreground-muted)', lineHeight: 1.6 }}>
                  Orders placed with us over WhatsApp will appear here once confirmed.
                </p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} style={{ padding: '20px 28px', borderBottom: '1px solid var(--color-border)', display: 'grid', gridTemplateColumns: 'var(--grid-order-history)', gap: '12px 24px', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-wordmark)', fontSize: 11, letterSpacing: '0.08em', color: 'var(--color-foreground-muted)' }}>
                    {`#GA-${order.id}`}
                  </span>
                  <div>
                    <p style={{ margin: '0 0 3px', fontSize: 14, fontWeight: 500 }}>{orderTitle(order)}</p>
                    <p style={{ margin: 0, fontSize: 12, color: 'var(--color-foreground-muted)' }}>{formatDate(order.created_at)}</p>
                  </div>
                  <span style={{ fontSize: 12, padding: '5px 12px', borderRadius: 9999, background: 'var(--color-igi-bg)', color: 'var(--color-igi)', fontWeight: 600, textTransform: 'capitalize' }}>
                    {order.status}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{formatTotal(order)}</span>
                </div>
              ))
            )}
          </div>
        </RevealBlock>

        <RevealBlock delay={0.15}>
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--rounded-block)', padding: '24px 28px' }}>
            <h2 style={{ margin: '0 0 20px', fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 20 }}>Profile</h2>

            {editing ? (
              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div><label style={labelStyle}>Name</label>
                  <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    type="text" style={{ ...fieldStyle, height: 46 }} /></div>
                <div><label style={labelStyle}>Email</label>
                  <input value={form.email ?? ''} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    type="email" style={{ ...fieldStyle, height: 46 }} /></div>
                <div><label style={labelStyle}>Phone</label>
                  <input value={form.phone ?? ''} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    type="tel" placeholder="+20…" style={{ ...fieldStyle, height: 46 }} /></div>

                {error && <p style={errorStyle}>{error}</p>}

                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="submit" disabled={busy} style={{ ...primaryButtonStyle, height: 44, flex: 1, fontSize: 14 }}>
                    {busy ? 'Saving…' : 'Save'}
                  </button>
                  <button type="button" onClick={() => { setEditing(false); setError(null); }}
                    style={{ height: 44, flex: 1, borderRadius: 'var(--rounded-button)', border: '1.5px solid var(--color-border-dark)', background: 'transparent', fontFamily: 'var(--font-body)', fontSize: 14, cursor: 'pointer', color: 'var(--color-foreground)' }}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    ['Name', user.full_name || '—'],
                    ['Username', user.username || '—'],
                    ['Email', user.email || '—'],
                    ['Phone', user.phone || '—'],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid var(--color-border)', gap: 16 }}>
                      <span style={{ fontSize: 13, color: 'var(--color-foreground-muted)' }}>{k}</span>
                      <span style={{ fontSize: 14, fontWeight: 500, textAlign: 'right' }}>{v}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setForm({
                      full_name: user.full_name ?? '',
                      email: user.email ?? '',
                      phone: user.phone ?? '',
                    });
                    setEditing(true);
                  }}
                  style={{ marginTop: 20, width: '100%', padding: '12px', borderRadius: 'var(--rounded-button)', border: '1.5px solid var(--color-border-dark)', background: 'transparent', fontFamily: 'var(--font-body)', fontSize: 14, cursor: 'pointer', color: 'var(--color-foreground)', transition: 'border-color 0.2s ease' }}
                  onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-brand)'}
                  onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border-dark)'}>
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </RevealBlock>

        <RevealBlock delay={0.2}>
          <div style={{ background: 'var(--color-brand)', borderRadius: 'var(--rounded-block)', padding: '28px', color: '#fff', display: 'flex', flexDirection: 'column', minHeight: 220 }}>
            <Shield size={28} style={{ marginBottom: 18, opacity: 0.7 }} />
            <h3 style={{ margin: '0 0 10px', fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 20 }}>Personal Concierge</h3>
            <p style={{ margin: '0 0 auto', fontSize: 14, lineHeight: 1.65, opacity: 0.82 }}>
              Sizing, customization, or a private viewing — our team is here for you.
            </p>
            <a href={`https://wa.me/${WA_PHONE}`} target="_blank" rel="noreferrer" style={{ marginTop: 24, padding: '12px 22px', borderRadius: 'var(--rounded-button)', background: '#fff', color: 'var(--color-brand)', border: 'none', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              Message us <ArrowRight size={16} />
            </a>
          </div>
        </RevealBlock>
      </div>
    </div>
  );
}
