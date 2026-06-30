'use client';
import React, { useState, useId, InputHTMLAttributes } from 'react';

/**
 * Floating-label text input. Borderless — uses a filled surface that tints
 * on focus, with the label animating up and shrinking.
 */
interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'style'> {
  label: string;
  /** Truthy shows error state; a string also renders as a message. */
  error?: boolean | string;
  style?: React.CSSProperties;
}

export default function Input({ label, type = 'text', value, defaultValue, error, id, style, ...rest }: InputProps) {
  const [val, setVal] = useState(value ?? defaultValue ?? '');
  const [focused, setFocused] = useState(false);
  const generatedId = useId();
  const uid = id || generatedId;
  const v = value !== undefined ? value : val;
  const floated = focused || (v && String(v).length > 0);

  return (
    <div style={{ position: 'relative', ...style }}>
      <input
        id={uid}
        type={type}
        value={v}
        onChange={(e) => { setVal(e.target.value); rest.onChange?.(e); }}
        onFocus={(e) => { setFocused(true); rest.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); rest.onBlur?.(e); }}
        {...rest}
        style={{
          width: '100%', height: 'var(--input-height)', boxSizing: 'border-box',
          padding: floated ? '1.25rem 1rem 0.35rem' : '0 1rem',
          fontFamily: 'var(--font-body)', fontSize: '0.9375rem', color: 'var(--color-foreground)',
          background: error ? 'var(--color-error-bg)' : 'var(--color-surface)',
          border: 'none', borderRadius: 'var(--rounded-input)',
          outline: 'none',
          boxShadow: focused ? (error ? '0 0 0 2px var(--color-error)' : '0 0 0 2px var(--color-foreground)') : 'none',
          transition: 'box-shadow 0.2s ease, background 0.2s ease, padding 0.2s ease',
        }}
      />
      <label htmlFor={uid} style={{
        position: 'absolute', insetInlineStart: '1rem', pointerEvents: 'none',
        fontFamily: 'var(--font-body)', color: error ? 'var(--color-error)' : 'var(--color-foreground-muted)',
        transition: 'all 0.2s ease',
        top: floated ? '0.5rem' : '50%', transform: floated ? 'none' : 'translateY(-50%)',
        fontSize: floated ? '0.6875rem' : '0.9375rem',
        letterSpacing: floated ? '0.02em' : 0,
      }}>{label}</label>
      {error && typeof error === 'string' && (
        <span style={{ display: 'block', marginTop: '0.375rem', fontSize: '0.75rem', color: 'var(--color-error)' }}>{error}</span>
      )}
    </div>
  );
}
