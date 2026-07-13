'use client';

import { useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StoreProvider } from '@/lib/store';
import { LenisProvider } from './LenisProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  // One QueryClient per browser session (not per render) — created lazily so it survives
  // Suspense-driven remounts. Infra only for now: lib/data.ts stays the data source until
  // a real Django-backed fetch layer replaces it (see IMPLEMENTATION.md).
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 60 * 1000 } },
  }));

  // Fresh loads/refreshes should always start at the top — the browser's native scroll
  // restoration (returning to a previous scroll position on refresh/back-forward) was
  // leaving the home page a few pixels down instead of at 0.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
      <QueryClientProvider client={queryClient}>
        <StoreProvider>
          <LenisProvider>{children}</LenisProvider>
        </StoreProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
