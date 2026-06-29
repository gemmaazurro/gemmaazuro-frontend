'use client';
import { X } from 'lucide-react';

export default function CartDrawer({ open, onClose, count = 0 }: {
  open: boolean; onClose: () => void; count?: number;
}) {
  return (
    <>
      {open && <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 50 }} />}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 420,
        background: '#fff', zIndex: 51,
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.4s var(--ease-spring)',
        boxShadow: '-20px 0 60px rgba(0,0,0,0.08)',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--color-border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontWeight: 500, fontSize: 18, margin: 0 }}>
            Your Selection{count > 0 ? ` (${count})` : ''}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <X size={20} />
          </button>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 12, color: 'var(--color-foreground-muted)' }}>
          <p style={{ fontSize: 15 }}>Your cart is empty.</p>
          <p style={{ fontSize: 13 }}>Shop our collection or customize via WhatsApp.</p>
        </div>
      </div>
    </>
  );
}
