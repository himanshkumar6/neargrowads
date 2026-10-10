import { z } from "zod";

// =======================
// DATABASE SCHEMA TYPES
// =======================
export type BlogStatus = 'draft' | 'published';

export interface TiptapJSONContent {
  type?: string;
  attrs?: Record<string, unknown>;
  content?: TiptapJSONContent[];
  marks?: {
    type: string;
    attrs?: Record<string, unknown>;
    [key: string]: unknown;
  }[];
  text?: string;
  styles?: { bold?: boolean; italic?: boolean; underline?: boolean; strikethrough?: boolean; code?: boolean; };
  href?: string;
  id?: string;
  props?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: TiptapJSONContent; // ProseMirror JSON tree
  cover_image: string | null;
  featured_image?: string | null;
  /** FK to categories.id — use categories?.name for the display label */
  category_id: string | null;
  /** Populated when categories is joined in the query (select '*, categories(name)') */
  categories?: { name: string } | null;
  blog_categories?: { name: string } | null;
  /** Convenience accessor — resolved from categories join or falls back to "General" */
  category?: string | null;
  tags: string[];
  is_featured: boolean;
  read_time: string | null;
  
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  faqs: { question: string; answer: string }[] | null;

  author_id: string | null;
  author_name: string;
  author_role: string | null;
  author_avatar: string | null;

  status: BlogStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogDraft {
  blog_id: string;
  draft_content: TiptapJSONContent;
  draft_title: string | null;
  last_autosaved_at: string;
  autosaved_by: string | null;
}

export interface BlogRevision {
  id: string;
  blog_id: string;
  content_snapshot: TiptapJSONContent;
  published_by: string | null;
  created_at: string;
}

// =======================
// DYNAMIC BLOCK SCHEMAS
// =======================
// We use Zod here so we can validate block attributes server-side
// before saving to the database, ensuring data integrity.

export const CtaBannerSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  subheading: z.string().optional(),
  buttonText: z.string().min(1, "Button text is required"),
  buttonUrl: z.string().url("Must be a valid URL").or(z.string().startsWith("/", "Must be a valid path")),
});
export type CtaBannerProps = z.infer<typeof CtaBannerSchema>;

export const TestimonialBlockSchema = z.object({
  quote: z.string().min(10, "Quote is too short"),
  authorName: z.string(),
  authorRole: z.string().optional(),
  avatarUrl: z.string().url().optional().or(z.literal("")),
});
export type TestimonialBlockProps = z.infer<typeof TestimonialBlockSchema>;

export const YouTubeEmbedSchema = z.object({
  videoId: z.string().min(1, "Video ID is required"),
});
export type YouTubeEmbedProps = z.infer<typeof YouTubeEmbedSchema>;

// The unified Zod validation wrapper for all custom blocks
export const CustomBlockValidationRegistry: Record<string, z.ZodTypeAny> = {
  ctaBanner: CtaBannerSchema,
  testimonial: TestimonialBlockSchema,
  youtube: YouTubeEmbedSchema,
};

// =======================
// DYNAMIC INTERNAL LINKS & MEDIA TYPES
// =======================
export interface InternalLinkAttrs {
  href: string;
  blogId?: string | null;
  targetType?: 'blog' | 'page' | 'external' | null;
  target?: string | null;
}

export interface MediaAttrs {
  src: string;
  mediaId?: string | null;
  alt?: string | null;
  caption?: string | null;
  width?: number | null;
  height?: number | null;
}

export interface MediaLibraryItem {
  id: string;
  url: string;
  name: string;
  size?: number;
  created_at?: string | null;
}

export interface PublishedBlogLinkOption {
  id: string;
  title: string;
  slug: string;
  category?: string;
  published_at?: string | null;
}
