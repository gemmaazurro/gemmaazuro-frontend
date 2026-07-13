'use client';
import React, { useState, useRef, useEffect, ReactNode } from 'react';

/**
 * Custom animated dropdown menu.
 * Pass a `trigger` element; clicking it opens a floating panel
 * with animated item list. Closes on outside click or item select.
 */
interface DropdownItem {
  label?: string;
  icon?: ReactNode;
  badge?: string;
  destructive?: boolean;
  separator?: boolean;
  onClick?: () => void;
}

interface DropdownProps {
  trigger: ReactNode;
  items?: DropdownItem[];
  align?: 'left' | 'right';
  style?: React.CSSProperties;
}

export default function Dropdown({ trigger, items = [], align = 'left', style }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [open]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block', ...style }}>
      <div onClick={() => setOpen(o => !o)} style={{ cursor: 'pointer', userSelect: 'none' }}>
        {trigger}
      </div>

      <div style={{
        position: 'absolute',
        top: 'calc(100% + 6px)',
        [align === 'right' ? 'right' : 'left']: 0,
        minWidth: 200,
        zIndex: 50,
        background: 'var(--color-background)',
        borderRadius: 'var(--rounded-card)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)',
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
        opacity: open ? 1 : 0,
        transform: open ? 'translateY(0) scale(1)' : 'translateY(-6px) scale(0.97)',
        pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity 0.22s ease, transform 0.28s cubic-bezier(0.075,0.82,0.165,1)',
      }}>
        <div style={{ padding: '6px 0' }}>
          {items.map((item, i) => {
            if (item.separator) {
              return (
                <div key={i} style={{
                  height: 1, background: 'var(--color-border)',
                  margin: '4px 12px',
                }} />
              );
            }
            return (
              <button key={i}
                onClick={() => { item.onClick?.(); setOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%', padding: '0.65rem 1rem',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', fontSize: '0.9375rem', textAlign: 'left',
                  color: item.destructive ? 'var(--color-error)' : 'var(--color-foreground)',
                  opacity: open ? 1 : 0,
                  transform: open ? 'translateY(0)' : 'translateY(4px)',
                  transition: [
                    `opacity 0.22s ease ${i * 0.04}s`,
                    `transform 0.28s cubic-bezier(0.075,0.82,0.165,1) ${i * 0.04}s`,
                    'background 0.12s ease',
                  ].join(', '),
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {item.icon && (
                  <span style={{ flexShrink: 0, opacity: 0.5, lineHeight: 0, color: 'inherit' }}>
                    {item.icon}
                  </span>
                )}
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span style={{
                    fontSize: '0.6875rem', fontWeight: 600,
                    padding: '2px 8px', borderRadius: 9999,
                    background: 'var(--color-brand-light)', color: 'var(--color-brand)',
                    letterSpacing: '0.04em',
                  }}>{item.badge}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
