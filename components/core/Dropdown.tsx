'use client';
import React, { ReactNode } from 'react';
import { DropdownMenu } from 'radix-ui';

/**
 * Animated dropdown menu — same public API as before (trigger/items/align), now built on
 * Radix's DropdownMenu primitive (the same primitive shadcn/ui's dropdown-menu wraps; this
 * project has no shadcn/Tailwind-utility setup, so the open/close animation + our own design
 * tokens are wired directly here instead of via shadcn's generated component + Tailwind classes).
 * Radix emits `data-state="open"|"closed"` on Content — the keyframes below key off that.
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
  return (
    <DropdownMenu.Root>
      <style>{`
        @keyframes ga-dd-in { from { opacity: 0; transform: translateY(-6px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes ga-dd-out { from { opacity: 1; transform: translateY(0) scale(1); } to { opacity: 0; transform: translateY(-6px) scale(0.97); } }
        .ga-dd-content[data-state="open"] { animation: ga-dd-in 0.22s cubic-bezier(0.075,0.82,0.165,1) both; }
        .ga-dd-content[data-state="closed"] { animation: ga-dd-out 0.16s ease both; }
      `}</style>
      <DropdownMenu.Trigger asChild>
        <div style={{ cursor: 'pointer', userSelect: 'none', display: 'inline-block', ...style }}>
          {trigger}
        </div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align={align === 'right' ? 'end' : 'start'}
          sideOffset={6}
          className="ga-dd-content"
          style={{
            minWidth: 200,
            zIndex: 50,
            background: 'var(--color-background)',
            borderRadius: 'var(--rounded-card)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)',
            border: '1px solid var(--color-border)',
            overflow: 'hidden',
            padding: '6px 0',
          }}
        >
          {items.map((item, i) =>
            item.separator ? (
              <DropdownMenu.Separator
                key={i}
                style={{ height: 1, background: 'var(--color-border)', margin: '4px 12px' }}
              />
            ) : (
              <DropdownMenu.Item
                key={i}
                onSelect={() => item.onClick?.()}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '0.65rem 1rem', cursor: 'pointer', outline: 'none',
                  fontFamily: 'var(--font-body)', fontSize: '0.9375rem',
                  color: item.destructive ? 'var(--color-error)' : 'var(--color-foreground)',
                  transition: 'background 0.12s ease',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'var(--color-surface)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
              >
                {item.icon && (
                  <span style={{ flexShrink: 0, opacity: 0.5, lineHeight: 0, color: 'inherit' }}>{item.icon}</span>
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
              </DropdownMenu.Item>
            )
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
