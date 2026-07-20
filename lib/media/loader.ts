'use client';

// Custom next/image loader -> imgproxy.
//
// Next requires this file to be a Client Component (it serializes the function),
// which is exactly why imgproxy runs unsigned here. See lib/media/imgproxy.ts.

import { buildImgproxyUrl, IMAGE_QUALITY } from './imgproxy';

interface LoaderArgs {
  src: string;
  width: number;
  quality?: number;
}

export default function imgproxyLoader({ src, width, quality }: LoaderArgs): string {
  return buildImgproxyUrl(src, { width, quality: quality ?? IMAGE_QUALITY });
}
