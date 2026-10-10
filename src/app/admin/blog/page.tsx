import { createClient } from '@/lib/supabase/server';
import { createPublicClient } from '@/lib/supabase/public';
import BlogsListAdmin, { AdminBlogItem } from '@/components/admin/BlogsListAdmin';

export const dynamic = 'force-dynamic';

export default async function AdminBlogDashboard() {
  const supabase = await createClient();
  const { data: initialBlogs, error } = await supabase
    .from('blogs')
    .select('id, title, slug, status, views, category_id, author_name, published_at, created_at, featured_image, categories(name)')
    .order('created_at', { ascending: false });

  let blogs = initialBlogs;

  if (error || !blogs || blogs.length === 0) {
    const publicClient = createPublicClient();
    const fallbackRes = await publicClient
      .from('blogs')
      .select('id, title, slug, status, views, category_id, author_name, published_at, created_at, featured_image, categories(name)')
      .order('created_at', { ascending: false });
    if (fallbackRes.data && fallbackRes.data.length > 0) {
      blogs = fallbackRes.data;
    }
  }

  const mappedBlogs: AdminBlogItem[] = (blogs || []).map((b) => {
    const cat = b.categories;
    const catName = Array.isArray(cat)
      ? (cat[0] as { name?: string })?.name
      : (cat as { name?: string } | null)?.name;

    return {
      id: b.id,
      title: b.title,
      slug: b.slug,
      status: b.status,
      views: b.views ?? 0,
      category_name: catName || null,
      author_name: b.author_name || null,
      published_at: b.published_at || null,
      created_at: b.created_at || null,
      cover_image: b.featured_image || null,
      featured_image: b.featured_image || null,
    };
  });

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto">
      <BlogsListAdmin initialBlogs={mappedBlogs} />
    </div>
  );
}
