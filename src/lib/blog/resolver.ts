import { TiptapJSONContent } from '@/types/blog';
import { createPublicClient } from '@/lib/supabase/public';
import { autoLinkAst } from './autolinker';

/**
 * Standard canonical generator for public blog URLs.
 */
export function getBlogPostUrl(slug: string): string {
  if (!slug) return '/blog';
  const cleanSlug = slug.startsWith('/') ? slug.substring(1) : slug;
  return cleanSlug.startsWith('blog/') ? `/${cleanSlug}` : `/blog/${cleanSlug}`;
}

/**
 * Determines whether a URL is an internal route within the application.
 */
export function isInternalUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  if (url.startsWith('/') || url.startsWith('#')) return true;
  if (url.startsWith('mailto:') || url.startsWith('tel:')) return false;

  try {
    const parsed = new URL(url);
    const internalDomains = [
      'trisagemarketing.com',
      'www.trisagemarketing.com',
      'localhost:3000',
      'localhost',
    ];
    return internalDomains.includes(parsed.host);
  } catch {
    return false;
  }
}

/**
 * Resolves a storage file path in Supabase 'blog-media' bucket into a live public URL.
 */
export function getPublicStorageUrl(filePath: string): string {
  if (!filePath) return '';
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath;
  }
  const supabase = createPublicClient();
  const { data } = supabase.storage.from('blog-media').getPublicUrl(filePath);
  return data?.publicUrl || filePath;
}

/**
 * Extracts all blogIds and legacy /blog/ slugs from a TipTap AST.
 */
function extractReferences(
  nodes: TiptapJSONContent[] | undefined,
  blogIds: Set<string>,
  slugs: Set<string>
) {
  if (!nodes || !Array.isArray(nodes)) return;

  for (const node of nodes) {
    // Check marks on inline text nodes
    if (node.marks && Array.isArray(node.marks)) {
      for (const mark of node.marks) {
        if (mark.type === 'link' && mark.attrs) {
          const blogId = mark.attrs.blogId as string | undefined;
          if (blogId && typeof blogId === 'string') {
            blogIds.add(blogId);
          }

          const href = mark.attrs.href as string | undefined;
          if (href && typeof href === 'string') {
            // Legacy /blog/[slug] extraction
            const match = href.match(/(?:^|\/|\.com)\/blog\/([a-z0-9-]+)/i);
            if (match && match[1]) {
              slugs.add(match[1].toLowerCase());
            }
          }
        }
      }
    }

    // Check nested content
    if (node.content && Array.isArray(node.content)) {
      extractReferences(node.content, blogIds, slugs);
    }
  }
}

/**
 * Recursively updates AST nodes with resolved current URLs and media URLs.
 */
function applyResolvedReferences(
  nodes: TiptapJSONContent[] | undefined,
  blogIdMap: Map<string, { id: string; slug: string; status: string; title: string }>,
  slugMap: Map<string, { id: string; slug: string; status: string; title: string }>
) {
  if (!nodes || !Array.isArray(nodes)) return;

  for (const node of nodes) {
    // 1. Resolve Link Marks
    if (node.marks && Array.isArray(node.marks)) {
      for (const mark of node.marks) {
        if (mark.type === 'link') {
          if (!mark.attrs) mark.attrs = {};
          const blogId = mark.attrs.blogId as string | undefined;
          let href = mark.attrs.href as string | undefined;

          // Auto-heal empty link marks if text matches known service or CTA
          if ((!href || href === '#' || href === 'null') && node.text) {
            const t = String(node.text).toLowerCase().trim();
            if (t.includes('audit') || t.includes('contact') || t.includes('book') || t.includes('enquir')) {
              mark.attrs.href = '/contact';
              mark.attrs.targetType = 'external';
              href = '/contact';
            } else if (t.includes('brand strategy') || t.includes('brand identity')) {
              mark.attrs.href = '/services/brand-strategy';
              mark.attrs.targetType = 'external';
              href = '/services/brand-strategy';
            } else if (t.includes('revenue management')) {
              mark.attrs.href = '/services/revenue-management';
              mark.attrs.targetType = 'external';
              href = '/services/revenue-management';
            } else if (t.includes('website design') || t.includes('seo & geo') || t.includes('geo ai')) {
              mark.attrs.href = '/services/website-design-seo';
              mark.attrs.targetType = 'external';
              href = '/services/website-design-seo';
            } else if (t.includes('performance marketing')) {
              mark.attrs.href = '/services/performance-marketing';
              mark.attrs.targetType = 'external';
              href = '/services/performance-marketing';
            } else if (t.includes('geo & gmb') || t.includes('gmb')) {
              mark.attrs.href = '/services/seo-gmb';
              mark.attrs.targetType = 'external';
              href = '/services/seo-gmb';
            } else if (t.includes('content creation') || t.includes('copywriting')) {
              mark.attrs.href = '/services/content-copywriting';
              mark.attrs.targetType = 'external';
              href = '/services/content-copywriting';
            } else if (t.includes('influencer') || t.includes('pr outreach')) {
              mark.attrs.href = '/services/influencer-pr';
              mark.attrs.targetType = 'external';
              href = '/services/influencer-pr';
            } else if (t.includes('social media')) {
              mark.attrs.href = '/services/social-media-management';
              mark.attrs.targetType = 'external';
              href = '/services/social-media-management';
            }
          }

          if (blogId) {
            if (blogIdMap.has(blogId)) {
              const targetBlog = blogIdMap.get(blogId)!;
              mark.attrs.blogId = targetBlog.id;
              mark.attrs.targetType = 'blog';

              if (targetBlog.status === 'published') {
                mark.attrs.href = getBlogPostUrl(targetBlog.slug);
                mark.attrs.isUnpublished = false;
              } else {
                // Linked post is currently draft/unpublished - keep URL for reference
                mark.attrs.isUnpublished = true;
                mark.attrs.href = getBlogPostUrl(targetBlog.slug);
              }
            } else {
              // Target blog ID not in map; keep existing href if present
              if (!mark.attrs.href) {
                mark.attrs.isUnpublished = true;
                mark.attrs.href = '#';
              }
            }
          } else if (href) {
            const match = href.match(/(?:^|\/|\.com)\/blog\/([a-z0-9-]+)/i);
            if (match && match[1]) {
              const matchedSlug = match[1].toLowerCase();
              if (slugMap.has(matchedSlug)) {
                const targetBlog = slugMap.get(matchedSlug)!;
                mark.attrs.blogId = targetBlog.id;
                mark.attrs.targetType = 'blog';

                if (targetBlog.status === 'published') {
                  mark.attrs.href = getBlogPostUrl(targetBlog.slug);
                  mark.attrs.isUnpublished = false;
                } else {
                  mark.attrs.isUnpublished = true;
                  mark.attrs.href = getBlogPostUrl(targetBlog.slug);
                }
              }
            }
          }
        }
      }
    }

    // 2. Resolve Image Nodes
    if (node.type === 'image' && node.attrs) {
      const mediaId = node.attrs.mediaId as string | undefined;
      const src = node.attrs.src as string | undefined;

      if (mediaId && !src) {
        node.attrs.src = getPublicStorageUrl(mediaId);
      } else if (src && !mediaId && src.includes('/storage/v1/object/public/blog-media/')) {
        // Derive mediaId from existing Supabase storage public URL
        const parts = src.split('/storage/v1/object/public/blog-media/');
        if (parts[1]) {
          node.attrs.mediaId = parts[1];
        }
      }
    }

    // 3. Recurse into child content
    if (node.content && Array.isArray(node.content)) {
      applyResolvedReferences(node.content, blogIdMap, slugMap);
    }
  }
}

/**
 * Server-side resolver that walks the blog content ProseMirror AST,
 * batch-fetches the current database records for all referenced blogs,
 * and dynamically rewrites links to point to current live URLs.
 */
export async function resolveBlogContent(
  content: TiptapJSONContent | TiptapJSONContent[] | string
): Promise<TiptapJSONContent | TiptapJSONContent[] | string> {
  if (!content) return content;

  // If string, return as-is
  if (typeof content === 'string') return content;

  // 1. Automatically interlink mentions of NearGrow Ads services and CTAs
  const autoLinkedContent = autoLinkAst(content) || content;

  // Clone to avoid mutating cached references
  const clonedContent = JSON.parse(JSON.stringify(autoLinkedContent));
  const nodes = Array.isArray(clonedContent)
    ? clonedContent
    : clonedContent.content && Array.isArray(clonedContent.content)
      ? clonedContent.content
      : null;

  if (!nodes) return clonedContent;

  const blogIds = new Set<string>();
  const slugs = new Set<string>();

  // 1. Traverse & collect references
  extractReferences(nodes, blogIds, slugs);

  // If no internal links exist, still resolve image mediaIds if any
  if (blogIds.size === 0 && slugs.size === 0) {
    applyResolvedReferences(nodes, new Map(), new Map());
    return clonedContent;
  }

  // 2. Batch-query database in a single query
  try {
    const supabase = createPublicClient();
    const blogIdArray = Array.from(blogIds);
    const slugArray = Array.from(slugs);

    let query = supabase.from('blogs').select('id, slug, title, status');

    if (blogIdArray.length > 0 && slugArray.length > 0) {
      query = query.or(`id.in.(${blogIdArray.join(',')}),slug.in.(${slugArray.join(',')})`);
    } else if (blogIdArray.length > 0) {
      query = query.in('id', blogIdArray);
    } else if (slugArray.length > 0) {
      query = query.in('slug', slugArray);
    }

    const { data: matchedBlogs, error } = await query;

    if (error) {
      console.warn('[BlogResolver] Error batch-querying blogs:', error.message);
      return clonedContent;
    }

    const blogIdMap = new Map<string, { id: string; slug: string; status: string; title: string }>();
    const slugMap = new Map<string, { id: string; slug: string; status: string; title: string }>();

    if (matchedBlogs) {
      for (const b of matchedBlogs) {
        blogIdMap.set(b.id, b);
        slugMap.set(b.slug.toLowerCase(), b);
      }
    }

    // 3. Apply resolved current values to AST
    applyResolvedReferences(nodes, blogIdMap, slugMap);
  } catch (err) {
    console.error('[BlogResolver] Unexpected resolution failure:', err);
  }

  return clonedContent;
}
