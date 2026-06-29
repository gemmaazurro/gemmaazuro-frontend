'use client';
import { useState, InputHTMLAttributes } from 'react';

export default function Input({ label, ...props }: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  const [focused, setFocused] = useState(false);
  const [filled, setFilled] = useState(false);
  const up = focused || filled;
  return (
    <div style={{ position: 'relative' }}>
      <label style={{
        position: 'absolute', left: 16, top: up ? 8 : '50%',
        transform: up ? 'none' : 'translateY(-50%)',
        fontSize: up ? 10 : 14,
        color: focused ? 'var(--color-brand)' : 'var(--color-foreground-muted)',
        transition: 'all 0.2s ease', pointerEvents: 'none', zIndex: 1,
        letterSpacing: up ? '0.06em' : 0, textTransform: up ? 'uppercase' : 'none',
      }}>{label}</label>
      <input {...props}
        onFocus={() => setFocused(true)}
        onBlur={e => { setFocused(false); setFilled(!!e.target.value); }}
        onChange={e => { setFilled(!!e.target.value); props.onChange?.(e); }}
        style={{
          width: '100%', height: 'var(--input-height)', padding: '20px 16px 8px',
          background: focused ? 'rgba(27,63,173,0.05)' : 'var(--color-surface)',
          border: 'none',
          borderBottom: focused ? '2px solid var(--color-brand)' : '2px solid transparent',
          borderRadius: 'var(--rounded-input)',
          fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--color-foreground)',
          outline: 'none', transition: 'all 0.2s ease',
        }}
      />
    </div>
  );
}
