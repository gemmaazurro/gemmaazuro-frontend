'use client';
import { useState, ReactNode } from 'react';

export default function Accordion({ items }: { items: { title: string; content: ReactNode }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div style={{ borderTop: '1px solid var(--color-border)' }}>
      {items.map((item, i) => (
        <div key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
          <button onClick={() => setOpen(open === i ? null : i)} style={{
            width: '100%', padding: '18px 0', background: 'none', border: 'none',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 15,
            cursor: 'pointer', color: 'var(--color-foreground)', textAlign: 'left',
          }}>
            {item.title}
            <span style={{
              transform: open === i ? 'rotate(45deg)' : 'rotate(0)',
              transition: 'transform 0.3s var(--ease-spring)',
              fontSize: 20, lineHeight: 1, color: 'var(--color-foreground-muted)',
            }}>+</span>
          </button>
          <div style={{
            display: 'grid',
            gridTemplateRows: open === i ? '1fr' : '0fr',
            transition: 'grid-template-rows 0.35s var(--ease-spring)',
          }}>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ padding: '0 0 18px', fontSize: 14, lineHeight: 1.7, color: 'var(--color-foreground-subtle)' }}>
                {item.content}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
