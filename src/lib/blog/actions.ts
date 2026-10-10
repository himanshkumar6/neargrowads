"use server";

import { createClient } from '@/lib/supabase/server';
import { createPublicClient } from '@/lib/supabase/public';
import { createAdminClient } from '@/lib/supabase/admin';
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { PublishedBlogLinkOption, MediaLibraryItem } from '@/types/blog';


// =======================
// SCHEMAS FOR VALIDATION
// =======================

const EditorJSONSchema = z.union([
  z.record(z.string(), z.any()),
  z.array(z.any()),
  z.string()
]);

const SaveDraftSchema = z.object({
  blogId: z.string().optional().transform(v => (!v || v === "" || v === "new" ? undefined : v)),
  title: z.string().min(1, "Title is required"),
  content: EditorJSONSchema,
  excerpt: z.string().nullable().optional().transform(v => (!v || v === "" ? null : v)),
  coverImage: z.string().nullable().optional().transform(v => (!v || v === "" ? null : v)),
  category: z.string().optional().default("Uncategorized").transform(v => (!v || v.trim() === "" ? "Uncategorized" : v.trim())),
  tags: z.array(z.string()).default([]),
  faqs: z.array(z.object({ question: z.string(), answer: z.string() })).nullable().optional(),
  authorName: z.string().optional(),
  authorRole: z.string().optional(),
  authorAvatar: z.string().nullable().optional().transform(v => (!v || v === "" ? null : v)),
});

const PublishSchema = SaveDraftSchema.extend({
  blogId: z.string().uuid(),
  slug: z.string().min(1, "Slug is required"),
  metaTitle: z.string().nullable().optional().transform(v => (!v || v === "" ? null : v)),
  metaDescription: z.string().nullable().optional().transform(v => (!v || v === "" ? null : v)),
  canonicalUrl: z.string().nullable().optional().transform(v => (!v || v === "" ? null : v)),
});

// =======================
// ACTIONS
// =======================

/**
 * Saves a WIP Draft. Synchronizes metadata to `blogs` table and saves content to `blog_drafts`.
 */
export async function saveDraft(formData: z.input<typeof SaveDraftSchema>) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const validated = SaveDraftSchema.parse(formData);
    const adminSupabase = createAdminClient();
    
    let targetBlogId = validated.blogId;

    if (!targetBlogId) {
      const slug = validated.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `draft-${Date.now()}`;
      let uniqueSlug = slug;
      let counter = 2;
      
      while (true) {
        const { data: existing } = await adminSupabase
          .from('blogs')
          .select('id')
          .eq('slug', uniqueSlug)
          .maybeSingle();

        if (existing) {
          uniqueSlug = `${slug}-${counter}`;
          counter++;
          continue;
        }
        break;
      }

      let resolvedCategoryId: string | null = null;
      if (validated.category) {
        const { data: catRow } = await adminSupabase
          .from('categories')
          .select('id')
          .ilike('name', validated.category.trim())
          .maybeSingle();
        if (catRow) resolvedCategoryId = catRow.id;
      }

      const { data: newBlog, error: insertError } = await adminSupabase
        .from('blogs')
        .insert({
          title: validated.title,
          slug: uniqueSlug,
          content: validated.content,
          excerpt: validated.excerpt || null,
          status: 'draft',
          author_id: user.id,
          author_name: validated.authorName || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin',
          author_role: validated.authorRole || null,
          author_avatar: validated.authorAvatar || null,
          category_id: resolvedCategoryId,
          featured_image: validated.coverImage || null,
          tags: validated.tags || [],
        })
        .select('id')
        .single();
        
      if (insertError) {
        throw new Error("Failed to create initial draft container: " + insertError.message);
      }
      targetBlogId = newBlog.id;
    } else {
      // Existing blog: sync metadata to blogs table using privileged admin client so RLS never drops it
      const { data: existingBlog } = await adminSupabase
        .from('blogs')
        .select('status')
        .eq('id', targetBlogId)
        .maybeSingle();

      let resolvedCategoryId: string | null = null;
      if (validated.category) {
        const { data: catRow } = await adminSupabase
          .from('categories')
          .select('id')
          .ilike('name', validated.category.trim())
          .maybeSingle();
        if (catRow) resolvedCategoryId = catRow.id;
      }

      const updatePayload: Record<string, unknown> = {
        excerpt: validated.excerpt || null,
        featured_image: validated.coverImage || null,
        tags: validated.tags || [],
        author_name: validated.authorName || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin',
        author_role: validated.authorRole || null,
        author_avatar: validated.authorAvatar || null,
        updated_at: new Date().toISOString(),
      };
      if (resolvedCategoryId) {
        updatePayload.category_id = resolvedCategoryId;
      }

      // If the post is currently in 'draft' status, keep content & title in blogs table updated too
      if (existingBlog?.status === 'draft') {
        updatePayload.title = validated.title;
        updatePayload.content = validated.content;
      }

      const { error: blogUpdateError } = await adminSupabase
        .from('blogs')
        .update(updatePayload)
        .eq('id', targetBlogId);

      if (blogUpdateError) {
        console.warn('[CMS Logs] Blog metadata update warning:', blogUpdateError.message);
      }
    }

    // Upsert into active `blog_drafts` table
    const { error: draftError } = await adminSupabase
      .from('blog_drafts')
      .upsert({
        blog_id: targetBlogId,
        draft_content: validated.content,
        draft_title: validated.title,
        autosaved_by: user.id,
        last_autosaved_at: new Date().toISOString()
      }, { onConflict: 'blog_id' });

    if (draftError) throw new Error("Failed to save draft: " + draftError.message);

    console.log(`[CMS Logs] Autosaved draft for blog ${targetBlogId}`);
    return { success: true, blogId: targetBlogId };
  } catch (error: unknown) {
    console.error(`[CMS Logs] Draft save failed:`, error);
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}


/**
 * Transactional Publish Event
 * Updates `blogs` with complete content, metadata, sets status to 'published',
 * creates snapshot revision in `blog_revisions`, clears `blog_drafts`, and triggers cache revalidation.
 */
export async function publishBlog(formData: z.input<typeof PublishSchema>) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const validated = PublishSchema.parse(formData);
    const adminSupabase = createAdminClient();

    let finalSlug = validated.slug;
    let counter = 2;

    // Check slug collision excluding current blog
    while (true) {
      const { data: existing } = await adminSupabase
        .from('blogs')
        .select('id')
        .eq('slug', finalSlug)
        .neq('id', validated.blogId)
        .maybeSingle();

      if (existing) {
        finalSlug = `${validated.slug}-${counter}`;
        counter++;
        continue;
      }
      break;
    }

    const now = new Date().toISOString();

    let resolvedCategoryId: string | null = null;
    if (validated.category) {
      const { data: catRow } = await adminSupabase
        .from('categories')
        .select('id')
        .ilike('name', validated.category.trim())
        .maybeSingle();
      if (catRow) resolvedCategoryId = catRow.id;
    }

    const { error: updateError } = await adminSupabase
      .from('blogs')
      .update({
        title: validated.title,
        slug: finalSlug,
        content: validated.content,
        status: 'published',
        published_at: now,
        updated_at: now,
        excerpt: validated.excerpt || null,
        featured_image: validated.coverImage || null,
        category_id: resolvedCategoryId,
        tags: validated.tags || [],
        author_name: validated.authorName || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin',
        author_role: validated.authorRole || null,
        author_avatar: validated.authorAvatar || null,
        meta_title: validated.metaTitle || null,
        meta_description: validated.metaDescription || null,
        canonical_url: validated.canonicalUrl || null,
      })
      .eq('id', validated.blogId);

    if (updateError) {
      throw new Error("Failed to update published blog: " + updateError.message);
    }

    // 2. Snapshot to blog_revisions for version history
    try {
      await adminSupabase
        .from('blog_revisions')
        .insert({
          blog_id: validated.blogId,
          content_snapshot: validated.content,
          published_by: user.id,
          created_at: now,
        });
    } catch (revErr) {
      console.warn('[CMS Logs] Revision snapshot non-fatal notice:', revErr);
    }

    // 3. Clear the draft record from blog_drafts so it never overrides published data
    const { error: deleteDraftError } = await adminSupabase
      .from('blog_drafts')
      .delete()
      .eq('blog_id', validated.blogId);

    if (deleteDraftError) {
      console.warn('[CMS Logs] Draft delete non-fatal notice:', deleteDraftError.message);
    }

    // 4. Trigger On-Demand Next.js Cache Revalidation
    revalidatePath('/blog');
    revalidatePath(`/blog/${finalSlug}`);
    revalidatePath('/admin/blog');
    revalidatePath(`/admin/blog/${validated.blogId}`);

    console.log(`[CMS Logs] Successfully published and revalidated blog ${finalSlug} (${validated.blogId})`);
    return { success: true, slug: finalSlug };
  } catch (error: unknown) {
    console.error(`[CMS Logs] Publish failed:`, error);
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// =======================
// CATEGORY ACTIONS
// =======================

export interface FullCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export async function getCategoriesFull(): Promise<FullCategory[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug, description, created_at')
      .order('name', { ascending: true });
    if (error) throw error;
    return data || [];
  } catch (error: unknown) {
    console.error('[CMS Logs] Failed to fetch full categories:', error);
    return [];
  }
}

export async function createCategory(data: { name: string; slug: string; description?: string | null }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const name = data.name.trim();
    if (!name) throw new Error('Category name is required.');
    const slug = data.slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const { data: inserted, error } = await supabase
      .from('categories')
      .insert({
        name,
        slug,
        description: data.description?.trim() || null
      })
      .select('id, name, slug, description, created_at')
      .single();

    if (error) {
      if (error.code === '23505') throw new Error('That category name or slug already exists.');
      throw error;
    }
    revalidatePath('/admin/categories');
    revalidatePath('/admin/blog');
    revalidatePath('/blog');
    return { success: true, category: inserted };
  } catch (error: unknown) {
    console.error('[CMS Logs] Failed to create category:', error);
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function updateCategory(id: string, data: { name: string; slug: string; description?: string | null }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const name = data.name.trim();
    if (!name) throw new Error('Category name is required.');
    const slug = data.slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const { data: updated, error } = await supabase
      .from('categories')
      .update({
        name,
        slug,
        description: data.description?.trim() || null
      })
      .eq('id', id)
      .select('id, name, slug, description, created_at')
      .single();

    if (error) {
      if (error.code === '23505') throw new Error('That category name or slug already exists.');
      throw error;
    }
    revalidatePath('/admin/categories');
    revalidatePath('/admin/blog');
    revalidatePath('/blog');
    return { success: true, category: updated };
  } catch (error: unknown) {
    console.error('[CMS Logs] Failed to update category:', error);
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function getCategories(): Promise<{ id: string; name: string }[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('id, name')
      .order('name', { ascending: true });
    if (error) throw error;
    return data || [];
  } catch (error: unknown) {
    console.error('[CMS Logs] Failed to fetch categories:', error);
    return [];
  }
}

export async function addCategory(name: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const trimmed = name.trim();
    if (!trimmed || trimmed.length < 2) throw new Error('Category name must be at least 2 characters.');

    const slug = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const { data, error } = await supabase
      .from('categories')
      .insert({ name: trimmed, slug })
      .select('id, name')
      .single();

    if (error) {
      if (error.code === '23505') throw new Error('That category already exists.');
      throw error;
    }
    revalidatePath('/admin/categories');
    revalidatePath('/admin/blog');
    return { success: true, category: data };
  } catch (error: unknown) {
    console.error('[CMS Logs] Failed to add category:', error);
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function deleteCategory(id: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/admin/categories');
    revalidatePath('/admin/blog');
    revalidatePath('/blog');
    return { success: true };
  } catch (error: unknown) {
    console.error('[CMS Logs] Failed to delete category:', error);
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export interface SaveBlogPayload {
  id?: string;
  title: string;
  slug: string;
  content: unknown;
  excerpt?: string | null;
  featured_image?: string | null;
  cover_image?: string | null;
  category_id?: string | null;
  category?: string | null;
  author_id?: string | null;
  author_name?: string | null;
  author_avatar?: string | null;
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  published_at?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  canonical_url?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
  faqs?: { q?: string; a?: string; question?: string; answer?: string }[] | null;
}

export async function saveBlogPost(payload: SaveBlogPayload) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const adminSupabase = createAdminClient();

    const title = payload.title.trim();
    if (!title) throw new Error("Post title is required.");

    let slug = (payload.slug || title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    if (!slug) slug = `post-${Date.now()}`;

    // Ensure slug uniqueness (except against itself)
    let finalSlug = slug;
    let counter = 2;
    while (true) {
      const query = adminSupabase.from('blogs').select('id').eq('slug', finalSlug);
      if (payload.id && payload.id !== 'new') {
        query.neq('id', payload.id);
      }
      const { data: existing } = await query.maybeSingle();
      if (existing) {
        finalSlug = `${slug}-${counter}`;
        counter++;
        continue;
      }
      break;
    }

    const now = new Date().toISOString();
    let publishedAt = payload.published_at ? new Date(payload.published_at).toISOString() : null;
    if (payload.status === 'published' && !publishedAt) {
      publishedAt = now;
    }

    const image = payload.featured_image || payload.cover_image || null;
    const authorName = payload.author_name?.trim() || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin';

    const dataToSave: Record<string, unknown> = {
      title,
      slug: finalSlug,
      content: payload.content,
      excerpt: payload.excerpt?.trim() || null,
      featured_image: image,
      category_id: payload.category_id || null,
      author_id: payload.author_id || user.id,
      author_name: authorName,
      author_avatar: payload.author_avatar || null,
      status: payload.status,
      published_at: publishedAt,
      meta_title: payload.meta_title?.trim() || null,
      meta_description: payload.meta_description?.trim() || null,
      meta_keywords: payload.meta_keywords?.trim() || null,
      canonical_url: payload.canonical_url?.trim() || null,
      og_title: payload.og_title?.trim() || null,
      og_description: payload.og_description?.trim() || null,
      og_image: payload.og_image || image,
      updated_at: now,
    };

    let savedBlogId = payload.id;

    if (savedBlogId && savedBlogId !== 'new') {
      const { error: updateError } = await adminSupabase
        .from('blogs')
        .update(dataToSave)
        .eq('id', savedBlogId);

      if (updateError) throw updateError;
    } else {
      const { data: newBlog, error: insertError } = await adminSupabase
        .from('blogs')
        .insert({
          ...dataToSave,
          created_at: now,
        })
        .select('id')
        .single();

      if (insertError) throw insertError;
      savedBlogId = newBlog.id;
    }

    // Clean up draft if published
    if (savedBlogId && payload.status === 'published') {
      try {
        await adminSupabase.from('blog_drafts').delete().eq('blog_id', savedBlogId);
      } catch (err) {
        console.warn('[CMS Logs] Draft cleanup notice:', err);
      }
    }

    revalidatePath('/admin/blog');
    revalidatePath(`/admin/blog/${savedBlogId}`);
    revalidatePath('/blog');
    revalidatePath(`/blog/${finalSlug}`);

    return {
      success: true,
      blogId: savedBlogId,
      slug: finalSlug
    };
  } catch (error: unknown) {
    console.error('[CMS Logs] Failed to save blog post:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save blog post'
    };
  }
}

export async function deleteBlog(id: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const adminSupabase = createAdminClient();

    // Delete related draft and revision records first if exists
    await adminSupabase.from('blog_drafts').delete().eq('blog_id', id);
    await adminSupabase.from('blog_revisions').delete().eq('blog_id', id);

    const { error } = await adminSupabase.from('blogs').delete().eq('id', id);
    if (error) throw error;

    revalidatePath('/admin/blog');
    revalidatePath('/blog');
    return { success: true };
  } catch (error: unknown) {
    console.error('[CMS Logs] Failed to delete blog post:', error);
    return { error: error instanceof Error ? error.message : 'Failed to delete blog post.' };
  }
}

// =======================
// DYNAMIC LINKING & MEDIA ACTIONS
// =======================

/**
 * Fetches published blogs formatted for WordPress-style internal link insertion in the editor.
 */
export async function getPublishedBlogsForLinking(search?: string): Promise<PublishedBlogLinkOption[]> {
  try {
    const supabase = createPublicClient();
    let query = supabase
      .from('blogs')
      .select('id, title, slug, published_at, categories(name)')
      .eq('status', 'published')
      .order('published_at', { ascending: false, nullsFirst: false })
      .limit(40);

    if (search && search.trim()) {
      query = query.ilike('title', `%${search.trim()}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map((b) => {
      const catObj = Array.isArray(b.categories) ? b.categories[0] : (b.categories as { name?: string } | null);
      const fallbackCat = (b as Record<string, unknown>).blog_categories as { name?: string } | { name?: string }[] | null;
      const fallbackCatName = Array.isArray(fallbackCat) ? fallbackCat[0]?.name : fallbackCat?.name;
      return {
        id: b.id,
        title: b.title,
        slug: b.slug,
        category: catObj?.name ?? fallbackCatName ?? undefined,
        published_at: b.published_at,
      };
    });
  } catch (err) {
    console.error('[CMS Logs] Failed to fetch blogs for linking:', err);
    return [];
  }
}

/**
 * Fetches recent images from Supabase storage and existing blog posts to display in the Media Library picker.
 */
export async function getMediaLibraryItems(): Promise<MediaLibraryItem[]> {
  try {
    const supabase = createPublicClient();
    const itemsMap = new Map<string, MediaLibraryItem>();

    // 1. Fetch images used as cover images across existing blogs
    const { data: blogs } = await supabase
      .from('blogs')
      .select('id, title, cover_image, created_at')
      .order('created_at', { ascending: false })
      .limit(60);

    if (blogs) {
      for (const b of blogs) {
        if (b.cover_image && !itemsMap.has(b.cover_image)) {
          let mediaId = b.cover_image;
          if (b.cover_image.includes('/storage/v1/object/public/blog-media/')) {
            mediaId = b.cover_image.split('/storage/v1/object/public/blog-media/')[1] || b.cover_image;
          }
          itemsMap.set(b.cover_image, {
            id: mediaId,
            url: b.cover_image,
            name: `${b.title || 'Blog'} (Cover)`,
            created_at: b.created_at,
          });
        }
      }
    }

    // 2. Query Supabase Storage directly for files in blogs/drafts
    try {
      const { data: files } = await supabase.storage.from('blog-media').list('blogs/drafts', {
        limit: 40,
        sortBy: { column: 'created_at', order: 'desc' },
      });

      if (files) {
        for (const file of files) {
          if (file.name && !file.name.startsWith('.')) {
            const filePath = `blogs/drafts/${file.name}`;
            const { data: { publicUrl } } = supabase.storage.from('blog-media').getPublicUrl(filePath);
            if (!itemsMap.has(publicUrl)) {
              itemsMap.set(publicUrl, {
                id: filePath,
                url: publicUrl,
                name: file.name,
                size: file.metadata?.size,
                created_at: file.created_at || undefined,
              });
            }
          }
        }
      }
    } catch (storageErr) {
      console.warn('[CMS Logs] Supabase storage list warning:', storageErr);
    }

    return Array.from(itemsMap.values());
  } catch (err) {
    console.error('[CMS Logs] Failed to fetch media library items:', err);
    return [];
  }
}

/**
 * Uploads an image to Cloudinary using the configured unsigned upload preset.
 */
export async function uploadBlogMedia(formData: FormData): Promise<{
  success: boolean;
  url?: string;
  mediaId?: string;
  fileName?: string;
  error?: string;
}> {
  try {
    const file = formData.get('file') as File | null;
    const blogId = (formData.get('blogId') as string) || 'drafts';

    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return { success: false, error: 'Invalid file format. Please upload JPG, PNG, WEBP, SVG, or GIF.' };
    }

    if (file.size > 15 * 1024 * 1024) {
      return { success: false, error: 'File is too large. Maximum file size is 15MB.' };
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'You must be signed in to upload blog media.' };
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) {
      return { success: false, error: 'Cloudinary upload is not configured on the server.' };
    }

    const safeBlogId = blogId === 'new' || !/^[a-zA-Z0-9_-]{1,100}$/.test(blogId)
      ? 'drafts'
      : blogId;
    const cloudinaryForm = new FormData();
    cloudinaryForm.append('file', file, file.name);
    cloudinaryForm.append('upload_preset', uploadPreset);
    cloudinaryForm.append('folder', `blogs/${safeBlogId}`);
    cloudinaryForm.append('public_id', `${Date.now()}-${uuidv4().substring(0, 8)}`);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`,
      { method: 'POST', body: cloudinaryForm }
    );
    const uploadData = await response.json();

    if (!response.ok || !uploadData.secure_url) {
      const message = uploadData.error?.message || 'Cloudinary rejected the upload.';
      return { success: false, error: `Upload failed: ${message}` };
    }

    return {
      success: true,
      url: uploadData.secure_url,
      mediaId: uploadData.public_id,
      fileName: uploadData.original_filename || file.name,
    };
  } catch (err: unknown) {
    console.error('[CMS Logs] Unexpected error in uploadBlogMedia:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unexpected server upload error',
    };
  }
}

