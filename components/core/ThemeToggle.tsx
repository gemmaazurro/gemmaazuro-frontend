'use client';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from './Icons';

/**
 * Light/dark toggle. Defaults to the device's system theme (see Providers.tsx —
 * defaultTheme="system", enableSystem) until the user picks explicitly; next-themes
 * persists that override in localStorage. The crossfade itself lives in globals.css
 * (universal background/color/border-color transition), not here.
 */
export default function ThemeToggle({ style }: { style?: React.CSSProperties }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <button
      type="button"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      style={{
        width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'transparent', border: 'none', cursor: 'pointer',
        color: 'var(--color-foreground)', WebkitTapHighlightColor: 'transparent',
        ...style,
      }}
    >
      {/* Avoid a hydration mismatch: render a neutral icon until mounted, then the real state. */}
      {mounted ? (isDark ? <Sun size={19} /> : <Moon size={19} />) : <Moon size={19} style={{ opacity: 0 }} />}
    </button>
  );
}
