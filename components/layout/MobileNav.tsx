'use client';
import { Bag, Heart, Phone, User, Search } from '@/components/core/Icons';
import { useEffect, useRef, useCallback } from 'react';
import ThemeToggle from '../core/ThemeToggle';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  onSearch?: () => void;
  categories: string[];
  cartCount?: number;
}

const linkBase: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  minHeight: 48,
  padding: '0 24px',
  fontFamily: 'var(--font-heading)',
  fontWeight: 500,
  fontSize: 16,
  color: 'var(--color-foreground)',
  textDecoration: 'none',
  borderBottom: '1px solid var(--color-border)',
  cursor: 'pointer',
  background: 'transparent',
  width: '100%',
  textAlign: 'left',
  letterSpacing: '-0.3px',
  WebkitTapHighlightColor: 'transparent',
};

export default function MobileNav({ open, onClose, onNavigate, onSearch, categories, cartCount }: MobileNavProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);

  // Escape key, body scroll lock, and focus restoration
  useEffect(() => {
    if (!open) return;

    prevFocusRef.current = document.activeElement as HTMLElement;
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKey);

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      prevFocusRef.current?.focus();
    };
  }, [open, onClose]);

  // Focus trap
  useEffect(() => {
    if (!open || !drawerRef.current) return;
    const container = drawerRef.current;
    const focusableEls = container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusableEls[0];
    const last = focusableEls[focusableEls.length - 1];

    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    container.addEventListener('keydown', trap);
    // Focus the close button by default
    const closeBtn = container.querySelector<HTMLElement>('[aria-label="Close navigation menu"]');
    closeBtn?.focus();
    return () => container.removeEventListener('keydown', trap);
  }, [open]);

  const handleBackdrop = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleBackdrop}
        role="presentation"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          background: 'rgba(0,0,0,0.4)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: 'min(320px, 85vw)',
          zIndex: 101,
          background: 'var(--color-background)',
          display: 'flex',
          flexDirection: 'column',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.32s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: open ? '4px 0 24px rgba(0,0,0,0.12)' : 'none',
          overflowY: 'auto',
          outline: 'none',
        }}
      >
        {/* Header with close button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 16px 16px 24px',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-wordmark)',
              fontSize: 14,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-foreground-muted)',
            }}
          >
            Menu
          </span>
          <button
            onClick={onClose}
            aria-label="Close navigation menu"
            style={{
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--color-surface)',
              border: 'none',
              borderRadius: 9999,
              cursor: 'pointer',
              color: 'var(--color-foreground)',
              fontSize: 18,
              lineHeight: 1,
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            ✕
          </button>
        </div>

        {/* Navigation links */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* Search */}
          <button
            onClick={() => { onSearch?.(); onClose(); }}
            style={{ ...linkBase, gap: 12 }}
          >
            <Search size={18} />
            Search
          </button>

          {/* Home */}
          <button
            onClick={() => { onNavigate('home'); onClose(); }}
            style={linkBase}
          >
            Home
          </button>

          {/* Shop with category accordion */}
          <details
            style={{ borderBottom: '1px solid var(--color-border)' }}
          >
            <summary
              style={{
                ...linkBase,
                borderBottom: 'none',
                cursor: 'pointer',
                listStyle: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>Shop</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                style={{ opacity: 0.4, flexShrink: 0 }}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </summary>
            <div
              style={{
                background: 'var(--color-surface)',
                padding: '4px 0 8px',
              }}
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { onNavigate('collection'); onClose(); }}
                  style={{
                    ...linkBase,
                    borderBottom: 'none',
                    minHeight: 44,
                    fontSize: 14,
                    fontWeight: cat === 'All' ? 600 : 400,
                    color:
                      cat === 'All'
                        ? 'var(--color-brand)'
                        : 'var(--color-foreground)',
                    paddingLeft: 40,
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </details>

          {/* Account */}
          <button
            onClick={() => { onNavigate('account'); onClose(); }}
            style={{ ...linkBase, gap: 12 }}
          >
            <User size={18} />
            Account
          </button>

          {/* Wishlist */}
          <button
            onClick={() => { onNavigate('wishlist'); onClose(); }}
            style={{ ...linkBase, gap: 12 }}
          >
            <Heart size={18} />
            Wishlist
          </button>

          {/* Cart */}
          <button
            onClick={() => { onNavigate('cart'); onClose(); }}
            style={{ ...linkBase, gap: 12 }}
          >
            <Bag size={18} />
            <span style={{ flex: 1 }}>Cart</span>
            {cartCount !== undefined && cartCount > 0 && (
              <span style={{
                minWidth: 20, height: 20,
                padding: '0 5px', borderRadius: 9999,
                background: 'var(--color-brand)', color: '#fff',
                fontSize: 11, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{cartCount}</span>
            )}
          </button>

          {/* Contact */}
          <button
            onClick={onClose}
            style={{ ...linkBase, gap: 12 }}
          >
            <Phone size={18} />
            Contact
          </button>

          {/* Theme */}
          <div style={{ ...linkBase, gap: 12, borderBottom: 'none', cursor: 'default' }}>
            <span style={{ flex: 1 }}>Theme</span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </>
  );
}
