'use client';
import { useState } from 'react';

export default function VariantSelector({ options, label }: { options: string[]; label: string }) {
  const [selected, setSelected] = useState(options[0]);
  return (
    <div>
      <p style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase',
        color: 'var(--color-foreground-muted)', marginBottom: 10 }}>{label}</p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {options.map(opt => (
          <button key={opt} onClick={() => setSelected(opt)}
            className="ga-btn"
            style={{
              height: 36, padding: '0 16px', fontSize: 13,
              background: selected === opt ? 'var(--color-brand)' : 'transparent',
              color: selected === opt ? '#fff' : 'var(--color-foreground)',
              border: `1px solid ${selected === opt ? 'var(--color-brand)' : 'var(--color-border-dark)'}`,
            }}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
