import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next 16 Cache Components (replaces experimental.ppr) — enables `use cache` +
  // cacheLife/cacheTag on data reads (see app/page.tsx, app/products/[id]/page.tsx).
  cacheComponents: true,
};

export default nextConfig;
