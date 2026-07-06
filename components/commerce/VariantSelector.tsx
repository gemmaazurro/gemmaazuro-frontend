'use client';
import React, { useState } from 'react';

/**
 * Variant selector — pill chips or swatch dots.
 * Chips share Button's fill-wipe animation (blob rises bottom→top on hover).
 */
interface VariantOption {
  label: string;
  value: string;
  color?: string;
}

interface VariantSelectorProps {
  label?: string;
  options: VariantOption[];
  value?: string;
  onChange?: (value: string) => void;
  /** 'chip' = text pills; 'swatch' = round color dots (uses option.color). */
  type?: 'chip' | 'swatch';
  style?: React.CSSProperties;
}

export default function VariantSelector({ label, options = [], value, onChange, type = 'chip', style }: VariantSelectorProps) {
  const [sel, setSel] = useState(value ?? options[0]?.value);
  const [hoveredOpt, setHoveredOpt] = useState<string | null>(null);
  const cur = value !== undefined ? value : sel;
  const pick = (v: string) => { setSel(v); onChange?.(v); };

  return (
    <div style={{ ...style }}>
      {label && (
        <div style={{
          marginBottom: '0.7rem', fontFamily: 'var(--font-body)', fontSize: '0.75rem',
          color: 'var(--color-foreground-muted)', textTransform: 'uppercase',
          letterSpacing: '0.08em', fontWeight: 500,
        }}>{label}</div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {options.map((o) => {
          const active = cur === o.value;
          const hovered = hoveredOpt === o.value;

          /* ── Swatch ── */
          if (type === 'swatch') {
            return (
              <button key={o.value} onClick={() => pick(o.value)}
                aria-label={o.label} title={o.label}
                onMouseEnter={() => setHoveredOpt(o.value)}
                onMouseLeave={() => setHoveredOpt(null)}
                style={{
                  width: 34, height: 34, borderRadius: 'var(--rounded-full)',
                  cursor: 'pointer', background: o.color, padding: 0, border: 'none',
                  outline: active
                    ? '2.5px solid var(--color-brand)'
                    : hovered ? '1.5px solid var(--color-border-dark)' : '1.5px solid var(--color-border)',
                  outlineOffset: active ? '2px' : '1px',
                  transform: hovered ? 'scale(1.14)' : active ? 'scale(1.06)' : 'scale(1)',
                  transition: 'transform 0.28s cubic-bezier(0.075,0.82,0.165,1), outline 0.18s ease',
                }} />
            );
          }

          /* ── Chip with fill-wipe ── */
          const fillColor = active ? '#fff' : 'var(--color-brand)';
          const fillFg = active ? 'var(--color-brand)' : '#fff';
          const baseFg = active ? '#fff' : 'var(--color-foreground)';

          return (
            <button key={o.value} onClick={() => pick(o.value)}
              onMouseEnter={() => setHoveredOpt(o.value)}
              onMouseLeave={() => setHoveredOpt(null)}
              className="ga-chip-active ga-tap-highlight"
              style={{
                position: 'relative', overflow: 'hidden',
                padding: '0.55rem 1.125rem',
                minHeight: 'var(--chip-min-h)' as any,
                borderRadius: 'var(--rounded-button)',
                cursor: 'pointer',
                background: active ? 'var(--color-brand)' : 'transparent',
                border: `1.5px solid ${active ? 'var(--color-brand)' : 'var(--color-border-dark)'}`,
                fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: active ? 500 : 400,
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
                transition: 'border-color 0.25s ease',
              }}>
              {/* Fill blob — bottom-to-top wipe (matches Button.jsx) */}
              <span aria-hidden style={{
                display: 'block', position: 'absolute',
                width: '150%', height: '200%',
                insetBlockStart: '-50%', insetInlineStart: '-25%',
                borderRadius: '50%', background: fillColor,
                transform: hovered ? 'translate3d(0,0%,0)' : 'translate3d(0,76%,0)',
                transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
                pointerEvents: 'none',
              }} />
              {/* Label */}
              <span style={{
                position: 'relative', zIndex: 1, display: 'inline-block',
                color: hovered ? fillFg : baseFg,
                transition: 'color 0.3s ease 0.08s',
              }}>{o.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
