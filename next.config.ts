import type { NextConfig } from "next";

// Allowlist the hosts images can come from: imgproxy (the normal path) and the
// Django/MinIO origin (the fallback when imgproxy is not configured, e.g. local
// dev, where the loader returns the source URL untouched).
function imageHosts() {
  const patterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];

  for (const raw of [
    process.env.NEXT_PUBLIC_IMGPROXY_URL,
    process.env.NEXT_PUBLIC_BACKEND_API_URL,
  ]) {
    if (!raw) continue;
    try {
      const url = new URL(raw);
      patterns.push({
        protocol: url.protocol.replace(":", "") as "http" | "https",
        hostname: url.hostname,
        port: url.port || undefined,
        pathname: "/**",
      });
    } catch {
      // Malformed env var — skip rather than fail the build.
    }
  }

  return patterns;
}

const nextConfig: NextConfig = {
  // Next 16 Cache Components (replaces experimental.ppr) — enables `use cache` +
  // cacheLife/cacheTag on data reads (see lib/products-cache.ts).
  cacheComponents: true,

  images: {
    // imgproxy does the resizing; Next's own optimizer would double-process.
    loader: "custom",
    loaderFile: "./lib/media/loader.ts",
    remotePatterns: imageHosts(),
  },
};

export default nextConfig;
