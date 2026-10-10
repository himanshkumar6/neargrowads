import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import BlogEditorForm from './BlogEditorForm';
import { notFound, redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminBlogEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  if (id === 'new') {
    return <BlogEditorForm blogId="new" />;
  }

  // Ensure user is authenticated
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/auth/login');
  }

  // Fetch blog data using privileged admin client with fallback to ensure accessibility
  const adminSupabase = createAdminClient();
  
  let publishedData = null;
  const adminRes = await adminSupabase
    .from('blogs')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (adminRes.data) {
    publishedData = adminRes.data;
  } else {
    const pubRes = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    publishedData = pubRes.data;
  }

  if (!publishedData) {
    notFound();
  }

  // Check if there is an active draft
  const { data: draftData } = await adminSupabase
    .from('blog_drafts')
    .select('*')
    .eq('blog_id', id)
    .maybeSingle();

  // Smart Precedence: Only merge draft if the blog is still a 'draft'
  // OR if the draft was saved strictly AFTER the published blog was last updated!
  let initialBlog = publishedData;

  if (draftData) {
    const draftTime = draftData.last_autosaved_at ? new Date(draftData.last_autosaved_at).getTime() : 0;
    const blogTime = publishedData.updated_at 
      ? new Date(publishedData.updated_at).getTime() 
      : (publishedData.published_at ? new Date(publishedData.published_at).getTime() : 0);

    if (publishedData.status === 'draft' || draftTime > blogTime) {
      initialBlog = {
        ...publishedData,
        title: draftData.draft_title || publishedData.title,
        content: draftData.draft_content || publishedData.content,
      };
    }
  }

  return <BlogEditorForm initialBlog={initialBlog} blogId={id} />;
}
