'use client';

import { useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StoreProvider } from '@/lib/store';

export function Providers({ children }: { children: React.ReactNode }) {
  // One QueryClient per browser session (not per render) — created lazily so it survives
  // Suspense-driven remounts. Infra only for now: lib/data.ts stays the data source until
  // a real Django-backed fetch layer replaces it (see IMPLEMENTATION.md).
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 60 * 1000 } },
  }));

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
      <QueryClientProvider client={queryClient}>
        <StoreProvider>{children}</StoreProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
