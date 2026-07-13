'use client';
import React, { useState, SelectHTMLAttributes } from 'react';

/**
 * Styled native select with animated focus border and custom chevron.
 */
interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'style'> {
  label?: string;
  options?: (string | SelectOption)[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export default function Select({
  label,
  options = [],
  value,
  onChange,
  placeholder,
  disabled = false,
  style,
  ...rest
}: SelectProps) {
  const [focus, setFocus] = useState(false);

  return (
    <div style={{ ...style }}>
      {label && (
        <div style={{
          marginBottom: '0.5rem',
          fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 500,
          textTransform: 'uppercase', letterSpacing: '0.08em',
          color: 'var(--color-foreground-muted)',
        }}>{label}</div>
      )}

      <div style={{ position: 'relative' }}>
        <select
          value={value}
          onChange={e => onChange?.(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          disabled={disabled}
          style={{
            width: '100%', height: '3.25rem',
            padding: '0 2.75rem 0 1rem',
            border: `1.5px solid ${focus ? 'var(--color-brand)' : 'var(--color-border-dark)'}`,
            borderRadius: 'var(--rounded-input)',
            background: 'var(--color-background)',
            fontFamily: 'var(--font-body)', fontSize: '0.9375rem',
            color: 'var(--color-foreground)',
            appearance: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
            outline: 'none', opacity: disabled ? 0.55 : 1,
            boxSizing: 'border-box',
            transition: 'border-color 0.22s ease',
          }}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map(o => {
            const val = typeof o === 'string' ? o : o.value;
            const lbl = typeof o === 'string' ? o : o.label;
            return <option key={val} value={val}>{lbl}</option>;
          })}
        </select>

        <span style={{
          position: 'absolute', right: '1rem', top: '50%',
          transform: 'translateY(-50%)', pointerEvents: 'none',
          color: focus ? 'var(--color-brand)' : 'var(--color-foreground-muted)',
          transition: 'color 0.2s ease',
          display: 'flex', alignItems: 'center',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </div>
    </div>
  );
}
