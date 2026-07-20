'use client';

import { useState } from 'react';
import RevealBlock from '@/components/motion/RevealBlock';
import { TextEffect } from '@/components/core/text-effect';
import { Shield, ArrowRight } from '@/components/core/Icons';
import { WA_PHONE } from '@/lib/contact';

export default function AccountContent() {
  const [tab, setTab] = useState('signin');
  const [loggedIn, setLoggedIn] = useState(false);
  const [firstName, setFirstName] = useState('Laila');

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

  const ORDERS = [
    { id: '#GA-2891', date: 'May 12, 2025', name: 'Aurora Solitaire Ring', status: 'Delivered', total: '48,500 EGP' },
    { id: '#GA-2104', date: 'Jan 03, 2025', name: 'Azzurro Drop Necklace', status: 'Delivered', total: '27,400 EGP' },
  ];

  if (!loggedIn) {
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
                <button key={t} onClick={() => setTab(t)} style={{
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
              <form onSubmit={(e) => { e.preventDefault(); setLoggedIn(true); }} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div><label style={labelStyle}>Email</label>
                  <input required type="email" placeholder="your@email.com" style={fieldStyle}
                    onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = 'var(--color-brand)'}
                    onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = 'var(--color-border-dark)'} /></div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
                    <button type="button" style={{ fontSize: 13, color: 'var(--color-brand)', textDecoration: 'none', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}>Forgot?</button>
                  </div>
                  <input required type="password" placeholder="••••••••" style={fieldStyle}
                    onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = 'var(--color-brand)'}
                    onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = 'var(--color-border-dark)'} />
                </div>
                <button type="submit" style={{
                  height: 54, borderRadius: 'var(--rounded-button)', background: 'var(--color-brand)',
                  color: '#fff', border: 'none', fontFamily: 'var(--font-body)', fontSize: 15,
                  fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-brand-dark)'}
                onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-brand)'}>
                  Sign In
                </button>
                <p style={{ margin: 0, textAlign: 'center', fontSize: 13, color: 'var(--color-foreground-muted)' }}>
                  New here?{' '}
                  <button type="button" onClick={() => setTab('register')} style={{ color: 'var(--color-foreground)', textDecoration: 'underline', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}>
                    Create an account
                  </button>
                </p>
              </form>
            </RevealBlock>
          ) : (
            <RevealBlock delay={0.15}>
              <form onSubmit={(e) => { e.preventDefault(); setLoggedIn(true); }} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'var(--grid-reg-form)', gap: 14 }}>
                  <div><label style={labelStyle}>First name</label>
                    <input required type="text" placeholder="Laila" style={fieldStyle}
                      onChange={(e) => setFirstName(e.target.value || 'Laila')}
                      onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = 'var(--color-brand)'}
                      onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = 'var(--color-border-dark)'} /></div>
                  <div><label style={labelStyle}>Last name</label>
                    <input required type="text" placeholder="Hassan" style={fieldStyle}
                      onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = 'var(--color-brand)'}
                      onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = 'var(--color-border-dark)'} /></div>
                </div>
                <div><label style={labelStyle}>Email</label>
                  <input required type="email" placeholder="your@email.com" style={fieldStyle}
                    onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = 'var(--color-brand)'}
                    onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = 'var(--color-border-dark)'} /></div>
                <div><label style={labelStyle}>Password</label>
                  <input required type="password" placeholder="8+ characters" style={fieldStyle}
                    onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = 'var(--color-brand)'}
                    onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = 'var(--color-border-dark)'} /></div>
                <button type="submit" style={{
                  height: 54, borderRadius: 'var(--rounded-button)', background: 'var(--color-brand)',
                  color: '#fff', border: 'none', fontFamily: 'var(--font-body)', fontSize: 15,
                  fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-brand-dark)'}
                onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-brand)'}>
                  Create Account
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
            {`Hello, ${firstName}.`}
          </TextEffect>
          <button onClick={() => { setLoggedIn(false); setTab('signin'); }}
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
              <span style={{ fontSize: 13, color: 'var(--color-foreground-muted)' }}>{ORDERS.length} orders</span>
            </div>
            {ORDERS.map((o) => (
              <div key={o.id} style={{ padding: '20px 28px', borderBottom: '1px solid var(--color-border)', display: 'grid', gridTemplateColumns: 'var(--grid-order-history)', gap: '12px 24px', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-wordmark)', fontSize: 11, letterSpacing: '0.08em', color: 'var(--color-foreground-muted)' }}>{o.id}</span>
                <div>
                  <p style={{ margin: '0 0 3px', fontSize: 14, fontWeight: 500 }}>{o.name}</p>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--color-foreground-muted)' }}>{o.date}</p>
                </div>
                <span style={{ fontSize: 12, padding: '5px 12px', borderRadius: 9999, background: 'var(--color-igi-bg)', color: 'var(--color-igi)', fontWeight: 600 }}>
                  {o.status}
                </span>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{o.total}</span>
              </div>
            ))}
          </div>
        </RevealBlock>

        <RevealBlock delay={0.15}>
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--rounded-block)', padding: '24px 28px' }}>
            <h2 style={{ margin: '0 0 20px', fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 20 }}>Profile</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[['Name', `${firstName} Hassan`], ['Email', 'laila@example.com'], ['Phone', '+20 100 000 0000'], ['Location', 'Zamalek, Cairo']].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid var(--color-border)', gap: 16 }}>
                  <span style={{ fontSize: 13, color: 'var(--color-foreground-muted)' }}>{k}</span>
                  <span style={{ fontSize: 14, fontWeight: 500, textAlign: 'right' }}>{v}</span>
                </div>
              ))}
            </div>
            <button style={{ marginTop: 20, width: '100%', padding: '12px', borderRadius: 'var(--rounded-button)', border: '1.5px solid var(--color-border-dark)', background: 'transparent', fontFamily: 'var(--font-body)', fontSize: 14, cursor: 'pointer', color: 'var(--color-foreground)', transition: 'border-color 0.2s ease' }}
              onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-brand)'}
              onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border-dark)'}>
              Edit Profile
            </button>
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
