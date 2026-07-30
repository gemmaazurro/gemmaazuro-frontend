import type { Metadata } from 'next';
import Image from 'next/image';
import StorefrontShell from '@/components/layout/StorefrontShell';
import PageTransition from '@/components/motion/PageTransition';
import ContentPage, { EmptyState } from '@/components/pages/ContentPage';
import { IMAGE_VARIANTS } from '@/lib/media/imgproxy';
import { getBlogPosts } from '@/lib/api/cms';

export const metadata: Metadata = {
  title: 'Journal',
  description: 'Notes on lab diamonds, craft and the house from Gemma Azzurro.',
  alternates: { canonical: '/blog' },
};

/** Strips CKEditor markup down to a plain-text teaser. */
function excerpt(html: string | null, limit = 150): string {
  if (!html) return '';
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length > limit ? `${text.slice(0, limit).trimEnd()}…` : text;
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <StorefrontShell>
      <PageTransition>
        <ContentPage eyebrow="Journal" title="From the house" wide>
          {posts.length === 0 ? (
            <EmptyState>Our first entries are being written.</EmptyState>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 'clamp(20px,3vw,32px)',
            }}>
              {posts.map((post) => {
                // `url` is an editor-supplied external link; without one the
                // card is not a link at all rather than a dead one.
                const Card = post.url ? 'a' : 'div';

                return (
                  <Card
                    key={post.id}
                    {...(post.url ? { href: post.url, target: '_blank', rel: 'noreferrer' } : {})}
                    style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                  >
                    {post.cover && (
                      <div style={{
                        position: 'relative', aspectRatio: '4 / 3', marginBottom: 16,
                        borderRadius: 'var(--rounded-block)', overflow: 'hidden',
                        background: 'var(--color-surface)',
                      }}>
                        <Image
                          src={post.cover}
                          alt={post.title || 'Journal entry'}
                          fill
                          sizes={`(max-width: 767px) 100vw, ${IMAGE_VARIANTS.small}px`}
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    <h2 style={{
                      margin: '0 0 8px', fontFamily: 'var(--font-heading)',
                      fontWeight: 500, fontSize: 18, lineHeight: 1.3,
                    }}>{post.title || 'Untitled'}</h2>
                    <p style={{
                      margin: 0, fontSize: 14, lineHeight: 1.65,
                      color: 'var(--color-foreground-muted)',
                    }}>{excerpt(post.content)}</p>
                  </Card>
                );
              })}
            </div>
          )}
        </ContentPage>
      </PageTransition>
    </StorefrontShell>
  );
}
