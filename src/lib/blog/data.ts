import { cache } from 'react';
import { createPublicClient } from '@/lib/supabase/public';
import type { Blog } from '@/types/blog';

/**
 * Helper that flattens the categories join into a `category` string and
 * maps `featured_image` to `cover_image` so all consumers can use `post.category` and `post.cover_image`.
 */
function flattenCategory<T extends { categories?: { name: string } | { name: string }[] | null; blog_categories?: { name: string } | { name: string }[] | null; featured_image?: string | null; cover_image?: string | null }>(
  post: T
): T & { category: string; cover_image: string | null } {
  const catName = Array.isArray(post.categories)
    ? post.categories[0]?.name
    : post.categories?.name;
  const fallbackCatName = Array.isArray(post.blog_categories)
    ? post.blog_categories[0]?.name
    : post.blog_categories?.name;

  return {
    ...post,
    category: catName ?? fallbackCatName ?? 'General',
    cover_image: post.featured_image ?? post.cover_image ?? null,
  };
}

/**
 * Cached fetcher for a single published blog post by slug.
 * Using React.cache() memoizes the request during SSR, meaning if `generateMetadata`
 * and `BlogPostPage` both call this, only ONE database query is executed.
 */
export const getPublishedPostBySlug = cache(async (slugOrId: string): Promise<Blog | null> => {
  const supabase = createPublicClient();
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);

  let query = supabase
    .from('blogs')
    .select('*, categories(name)')
    .eq('status', 'published');

  if (isUuid) {
    query = query.or(`slug.eq.${slugOrId},id.eq.${slugOrId}`);
  } else {
    query = query.eq('slug', slugOrId);
  }

  const { data: post } = await query.maybeSingle();

  return post ? flattenCategory(post as unknown as Blog & { categories?: { name: string } | null }) : null;
});

/**
 * Cached fetcher for all published blog posts.
 * Primarily used by the dynamic sitemap, RSS feed, and blog listing pages.
 */
export const getAllPublishedPosts = cache(async (): Promise<Blog[]> => {
  const supabase = createPublicClient();
  const { data: posts } = await supabase
    .from('blogs')
    .select('*, categories(name)')
    .eq('status', 'published')
    .order('published_at', { ascending: false, nullsFirst: false });

  return (posts || []).map(p => flattenCategory(p as unknown as Blog & { categories?: { name: string } | null }));
});

/**
 * Cached fetcher for all active blog categories from Supabase.
 */
export const getAllCategories = cache(async () => {
  const supabase = createPublicClient();
  const { data: categories } = await supabase
    .from('categories')
    .select('name')
    .order('name', { ascending: true });

  return categories?.map(c => c.name) || [];
});
