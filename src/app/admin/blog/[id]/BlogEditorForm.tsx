"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { triggerPageTransition } from "@/components/BrandedPageLoader";
import {
  Save,
  Loader2,
  ArrowLeft,
  Send,
  CalendarClock,
  Wand2,
  Plus,
  Trash2,
  Tag,
  Sparkles,
  BookOpenText,
  ArrowUpRight,
} from "lucide-react";
import { CloudinaryUploader } from "@/components/admin/CloudinaryUploader";
import { SeoChecklist } from "@/components/admin/SeoChecklist";
import { getCategoriesFull, saveBlogPost, FullCategory } from "@/lib/blog/actions";
import { createClient } from "@/lib/supabase/client";

const BlogEditor = dynamic(() => import("@/components/editor/Editor"), {
  ssr: false,
  loading: () => (
    <div className="h-[460px] w-full animate-pulse bg-slate-50/80 dark:bg-[#07111e]/90 rounded-xl border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-400 text-sm">
      <Loader2 size={24} className="animate-spin text-[#68b955] mr-2" />
      Loading editor...
    </div>
  ),
});

import { TiptapJSONContent } from "@/types/blog";

export interface InitialBlogData {
  id?: string;
  title?: string;
  slug?: string;
  content?: string | TiptapJSONContent;
  excerpt?: string | null;
  featured_image?: string | null;
  cover_image?: string | null;
  category_id?: string | null;
  category?: string | null;
  author_id?: string | null;
  author_name?: string | null;
  author_avatar?: string | null;
  status?: string;
  published_at?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  canonical_url?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
  faqs?: Array<{ question?: string; answer?: string; q?: string; a?: string }>;
}

export interface FormState {
  title: string;
  slug: string;
  content: string | TiptapJSONContent;
  excerpt: string;
  featured_image: string;
  category_id: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  published_at: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  canonical_url: string;
  og_title: string;
  og_description: string;
  og_image: string;
}

interface BlogEditorFormProps {
  initialBlog?: InitialBlogData | null;
  blogId?: string;
}

function parseInitialFaqs(initialBlog?: InitialBlogData | null): { q: string; a: string }[] {
  if (!initialBlog) return [];
  if (Array.isArray(initialBlog.faqs) && initialBlog.faqs.length > 0) {
    return initialBlog.faqs.map((item) => ({
      q: item.question || item.q || "",
      a: item.answer || item.a || "",
    }));
  }
  return [];
}

function parseInitialFormData(initialBlog?: InitialBlogData | null): FormState {
  let pubAt = "";
  if (initialBlog?.published_at) {
    const date = new Date(initialBlog.published_at);
    pubAt = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  }

  return {
    title: initialBlog?.title || "",
    slug: initialBlog?.slug || "",
    content: initialBlog?.content || "",
    excerpt: initialBlog?.excerpt || "",
    featured_image: initialBlog?.featured_image || initialBlog?.cover_image || "",
    category_id: initialBlog?.category_id || "",
    author_id: initialBlog?.author_id || "",
    author_name: initialBlog?.author_name || "",
    author_avatar: initialBlog?.author_avatar || "",
    status: (initialBlog?.status as 'draft' | 'scheduled' | 'published' | 'archived') || "draft",
    published_at: pubAt,
    meta_title: initialBlog?.meta_title || "",
    meta_description: initialBlog?.meta_description || "",
    meta_keywords: initialBlog?.meta_keywords || "",
    canonical_url: initialBlog?.canonical_url || "",
    og_title: initialBlog?.og_title || "",
    og_description: initialBlog?.og_description || "",
    og_image: initialBlog?.og_image || "",
  };
}

export default function BlogEditorForm({ initialBlog, blogId: propBlogId }: BlogEditorFormProps) {
  const router = useRouter();
  const id = propBlogId !== "new" ? propBlogId : undefined;
  const isEditing = !!id && id !== "new";

  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<FullCategory[]>([]);
  const [domainPrefix, setDomainPrefix] = useState("neargrowads.in/blog/");

  // FAQs State - Lazily initialized from initialBlog
  const [faqs, setFaqs] = useState<{ q: string; a: string }[]>(() => parseInitialFaqs(initialBlog));

  // Form State - Lazily initialized from initialBlog
  const [formData, setFormData] = useState(() => parseInitialFormData(initialBlog));

  // Sync hostname safely
  useEffect(() => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDomainPrefix(`${window.location.host}/blog/`);
    }
  }, []);

  // Load categories
  useEffect(() => {
    let isMounted = true;
    getCategoriesFull().then((data) => {
      if (!isMounted) return;
      setCategories(data || []);
      // If we don't have a category_id set, match by category name if available
      if (!initialBlog?.category_id && initialBlog?.category && data && data.length > 0) {
        const found = data.find((c) => c.name.toLowerCase() === initialBlog.category?.toLowerCase());
        if (found) {
          setFormData((prev) => ({ ...prev, category_id: found.id }));
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, [initialBlog]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Auto-generate slug from title if creating a new post
    if (name === "title" && !isEditing) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setFormData((prev) => ({ ...prev, title: value, slug }));
    }
  };

  const handleEditorChange = useCallback((newContent: TiptapJSONContent) => {
    setFormData((prev) => ({ ...prev, content: newContent }));
  }, []);

  const handleImageChange = (field: string, url: string) => {
    setFormData((prev) => ({ ...prev, [field]: url }));
  };

  const handleOptimizeSlug = () => {
    if (!formData.title) {
      toast.error("Please enter a title first!");
      return;
    }
    const stopWords = [
      "a", "an", "the", "and", "or", "but", "is", "are", "was", "were",
      "to", "in", "on", "with", "for", "of", "at", "by", "from", "as",
    ];
    let words = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .split(/[\s-]+/);
    words = words.filter((word: string) => !stopWords.includes(word) && word.length > 0);
    const optimizedSlug = words.join("-");
    setFormData((prev) => ({ ...prev, slug: optimizedSlug }));
    toast.success("Slug optimized for SEO!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    if (!formData.title.trim()) {
      toast.error("Please provide a title for the blog post.");
      return;
    }

    setIsSaving(true);

    try {
      // Find selected category name
      const selectedCat = categories.find((c: FullCategory) => c.id === formData.category_id);
      const categoryName = selectedCat ? selectedCat.name : "General";

      // Filter valid FAQs
      const validFaqs = faqs.filter((f) => f.q.trim() && f.a.trim());

      // If content is string/HTML, optionally append styled FAQ block
      let finalContent = formData.content;
      if (typeof finalContent === "string" && validFaqs.length > 0 && !finalContent.includes("neargrow-faqs")) {
        const faqsHtml = `
          <div class="neargrow-faqs">
            <h2>Frequently Asked Questions</h2>
            ${validFaqs
              .map(
                (f) => `
              <details class="faq-item">
                <summary>${f.q}</summary>
                <div class="faq-content">${f.a}</div>
              </details>
            `
              )
              .join("")}
          </div>
        `;
        finalContent += faqsHtml;
      }

      // Check current user session for author_id fallback
      let authorId = formData.author_id;
      if (!authorId) {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          authorId = user.id;
        }
      }

      const res = await saveBlogPost({
        id: isEditing ? (id || initialBlog?.id) : undefined,
        title: formData.title,
        slug: formData.slug,
        content: finalContent,
        excerpt: formData.excerpt,
        featured_image: formData.featured_image,
        cover_image: formData.featured_image,
        category_id: formData.category_id || null,
        category: categoryName,
        author_id: authorId || null,
        author_name: formData.author_name || null,
        author_avatar: formData.author_avatar || null,
        status: formData.status as 'draft' | 'scheduled' | 'published' | 'archived',
        published_at: formData.published_at || null,
        meta_title: formData.meta_title || null,
        meta_description: formData.meta_description || null,
        meta_keywords: formData.meta_keywords || null,
        canonical_url: formData.canonical_url || null,
        og_title: formData.og_title || null,
        og_description: formData.og_description || null,
        og_image: formData.og_image || formData.featured_image || null,
        faqs: validFaqs,
      });

      if (!res.success || !res.blogId) {
        throw new Error(res.error || "Failed to save blog post");
      }

      toast.success(isEditing ? "Blog post updated successfully!" : "Blog post created successfully!");

      if (!isEditing && res.blogId) {
        triggerPageTransition(`/admin/blog/${res.blogId}`);
        router.push(`/admin/blog/${res.blogId}`);
      } else {
        router.refresh();
      }
    } catch (err: unknown) {
      console.error("Save Error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to save post");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner (Synchronized with CMS Standard) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0d1526] border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 sm:p-5 lg:p-6 shadow-xs">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/admin/blog"
            className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors shrink-0 border border-slate-200/60 dark:border-white/10 shadow-2xs"
            title="Back to Blog Management"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight font-sans">
                {isEditing ? "Edit Article" : "Compose New Article"}
              </h1>
              <span className="px-3 py-0.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 text-xs font-semibold uppercase tracking-wider">
                {formData.status.toUpperCase()}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal">
              {isEditing
                ? "Refine content, update SEO metadata, and optimize reader engagement."
                : "Author and publish high-ranking digital marketing articles and insights."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#68b955] hover:bg-[#4e993d] text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs transition-all cursor-pointer disabled:opacity-70 active:scale-95"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span>{isSaving ? "Saving..." : isEditing ? "Update Article" : "Save Article"}</span>
          </button>
        </div>
      </div>

      {/* 2. ROW 1: Three Summary Status Cards (Exact Dashboard Pattern) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
        {/* Card 1: Article Status */}
        <div className="bg-slate-50/70 dark:bg-[#07111e]/90 border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Publication Status
            </span>
            <div className="w-9 h-9 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center shadow-xs">
              <BookOpenText className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="block text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white capitalize font-sans">
              {formData.status}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-primary-600 dark:text-primary-400 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{formData.published_at ? "Scheduled / Release date configured" : "Draft workflow active"}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Selected Category */}
        <div className="bg-slate-50/70 dark:bg-[#07111e]/90 border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Taxonomy Cluster
            </span>
            <div className="w-9 h-9 rounded-full bg-secondary-500/10 text-secondary-600 dark:text-secondary-400 flex items-center justify-center shadow-xs">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="block text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white truncate font-sans">
              {categories.find((c) => c.id === formData.category_id)?.name || "Uncategorized"}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-secondary-600 dark:text-secondary-400 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Target audience grouping</span>
            </div>
          </div>
        </div>

        {/* Card 3: Search Engine Readiness */}
        <div className="bg-slate-50/70 dark:bg-[#07111e]/90 border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Search Engine Readiness
            </span>
            <div className="w-9 h-9 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="block text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
              {formData.slug ? "URL Ready" : "Awaiting Title"}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-sky-600 dark:text-sky-400 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{formData.meta_keywords ? "Keywords configured" : "Live SEO checklist active"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. ROW 2: Two Panels — Left Content Area (Col 8) + Right Control Sidebar (Col 4) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* Main Content Area (8 Cols) */}
        <div className="xl:col-span-8 space-y-5">
          {/* Core Content Card */}
          <div className="bg-white dark:bg-[#0d1526] border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xs p-4 sm:p-5 lg:p-6 space-y-5">
            <div className="border-b border-slate-100 dark:border-white/10 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white font-sans">
                  Article Content
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Craft your post with rich formatting, heading hierarchy, and media.
                </p>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Post Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 text-lg font-bold border border-slate-200/90 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#68b955]/30 focus:border-[#68b955] dark:bg-[#050b14]/80 dark:text-white outline-none transition-all placeholder:text-slate-400"
                placeholder="Enter an engaging title..."
              />
            </div>

            {/* URL Slug with Optimize Button */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  URL Slug *
                </label>
                <button
                  type="button"
                  onClick={handleOptimizeSlug}
                  className="text-xs text-[#68b955] hover:text-[#4e993d] dark:text-[#68b955] dark:hover:text-[#83ce71] hover:underline flex items-center gap-1 font-bold cursor-pointer"
                >
                  <Wand2 size={12} />
                  Optimize Slug
                </button>
              </div>
              <div className="flex flex-col sm:flex-row rounded-xl overflow-hidden border border-slate-200/90 dark:border-white/10 focus-within:ring-2 focus-within:ring-[#68b955]/30 focus-within:border-[#68b955]">
                <span className="bg-slate-50 dark:bg-[#07111e]/90 px-3.5 py-2.5 text-slate-500 dark:text-slate-400 text-xs sm:text-sm flex items-center border-b sm:border-b-0 sm:border-r border-slate-200/90 dark:border-white/10 font-mono select-none">
                  {domainPrefix}
                </span>
                <input
                  type="text"
                  name="slug"
                  required
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                    }))
                  }
                  className="flex-1 px-3.5 py-2.5 min-h-[42px] text-base sm:text-sm dark:bg-[#050b14]/80 dark:text-white outline-none font-mono"
                  placeholder="e.g. 10-local-seo-strategies"
                />
              </div>
            </div>

            {/* Blog Content Rich Editor */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Article Body
              </label>
              <div className="border border-slate-200/90 dark:border-white/10 rounded-xl overflow-hidden bg-white dark:bg-[#050b14]/80 shadow-xs">
                <BlogEditor
                  initialContent={formData.content}
                  onChange={handleEditorChange}
                  blogId={id}
                />
              </div>
            </div>

            {/* FAQ Builder UI */}
            <div className="bg-slate-50/70 dark:bg-[#07111e]/90 border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 sm:p-5 mt-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 font-sans">
                    <Wand2 size={16} className="text-[#68b955]" />
                    FAQ Structured Snippets
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    FAQs will be automatically formatted and added to the article for rich Google snippet ranking.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFaqs((prev) => [...prev, { q: "", a: "" }])}
                  className="bg-[#68b955]/10 text-[#68b955] hover:bg-[#68b955] hover:text-white font-bold py-1.5 px-3.5 rounded-xl flex items-center gap-1.5 transition-all text-xs cursor-pointer"
                >
                  <Plus size={15} /> Add Question
                </button>
              </div>

              {faqs.length === 0 ? (
                <div className="text-center py-7 border-2 border-dashed border-slate-200/80 dark:border-white/10 rounded-xl bg-white/50 dark:bg-white/5">
                  <p className="text-slate-500 text-xs sm:text-sm mb-2">No FAQs added yet.</p>
                  <button
                    type="button"
                    onClick={() => setFaqs([{ q: "", a: "" }])}
                    className="text-[#68b955] hover:text-[#4e993d] dark:text-[#68b955] font-bold text-xs hover:underline cursor-pointer"
                  >
                    + Create your first FAQ
                  </button>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-[#0d1526] border border-slate-200/80 dark:border-white/10 rounded-xl p-4 relative group shadow-xs"
                    >
                      <button
                        type="button"
                        onClick={() => setFaqs((prev) => prev.filter((_, i) => i !== index))}
                        className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer p-1 rounded-md"
                        title="Delete FAQ"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="mb-3 pr-8">
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider">
                          Question {index + 1}
                        </label>
                        <input
                          type="text"
                          value={faq.q}
                          onChange={(e) =>
                            setFaqs((prev) =>
                              prev.map((f, i) => (i === index ? { ...f, q: e.target.value } : f))
                            )
                          }
                          className="w-full px-3 py-2 min-h-[40px] text-base sm:text-sm border border-slate-200/90 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-[#68b955]/30 focus:border-[#68b955] dark:bg-[#050b14]/80 dark:text-white font-medium"
                          placeholder="E.g. What is Local SEO?"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider">
                          Answer
                        </label>
                        <textarea
                          value={faq.a}
                          onChange={(e) =>
                            setFaqs((prev) =>
                              prev.map((f, i) => (i === index ? { ...f, a: e.target.value } : f))
                            )
                          }
                          rows={3}
                          className="w-full px-3 py-2 text-base sm:text-sm border border-slate-200/90 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-[#68b955]/30 focus:border-[#68b955] dark:bg-[#050b14]/80 dark:text-white"
                          placeholder="Provide a clear, helpful answer..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Summary Excerpt (Optional)
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={3}
                className="w-full px-3.5 py-2.5 text-base sm:text-sm border border-slate-200/90 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#68b955]/30 focus:border-[#68b955] dark:bg-[#050b14]/80 dark:text-white"
                placeholder="A concise summary of the article for archive listings and RSS feeds..."
              />
            </div>
          </div>

          {/* SEO & Metadata Card */}
          <div className="bg-white dark:bg-[#0d1526] border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xs p-4 sm:p-5 lg:p-6 space-y-4">
            <div className="border-b border-slate-100 dark:border-white/10 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white font-sans">
                  Search Engine Optimization (SEO) & Social Graph
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Configure search engine visibility and social media preview tags.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Meta Title
              </label>
              <input
                type="text"
                name="meta_title"
                value={formData.meta_title}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 min-h-[42px] text-base sm:text-sm border border-slate-200/90 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#68b955]/30 focus:border-[#68b955] dark:bg-[#050b14]/80 dark:text-white outline-none"
                placeholder="Defaults to Post Title if empty"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Meta Description
              </label>
              <textarea
                name="meta_description"
                value={formData.meta_description}
                onChange={handleChange}
                rows={2}
                className="w-full px-3.5 py-2.5 text-base sm:text-sm border border-slate-200/90 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#68b955]/30 focus:border-[#68b955] dark:bg-[#050b14]/80 dark:text-white outline-none"
                placeholder="Compelling description for search engine result snippets..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Focus Keywords
              </label>
              <input
                type="text"
                name="meta_keywords"
                value={formData.meta_keywords}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 min-h-[42px] text-base sm:text-sm border border-slate-200/90 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#68b955]/30 focus:border-[#68b955] dark:bg-[#050b14]/80 dark:text-white outline-none"
                placeholder="seo, digital marketing, ads (comma separated)"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-sans">
                Open Graph (Social Media Cards)
              </h3>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Social Title (OG:Title)
                </label>
                <input
                  type="text"
                  name="og_title"
                  value={formData.og_title}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 min-h-[42px] text-base sm:text-sm border border-slate-200/90 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#68b955]/30 focus:border-[#68b955] dark:bg-[#050b14]/80 dark:text-white outline-none"
                  placeholder="Defaults to Post Title"
                />
              </div>

              <CloudinaryUploader
                label="OG Share Image (Optional)"
                value={formData.og_image}
                onChange={(url) => handleImageChange("og_image", url)}
                blogId={id}
              />
            </div>
          </div>
        </div>

        {/* Sidebar Controls (4 Cols) */}
        <div className="xl:col-span-4 space-y-5 xl:sticky xl:top-4">
          {/* Publishing Card */}
          <div className="bg-white dark:bg-[#0d1526] border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xs p-4 sm:p-5 lg:p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-3 font-sans">
              Publishing Controls
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Visibility Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 min-h-[42px] border border-slate-200/90 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#68b955]/30 focus:border-[#68b955] dark:bg-[#050b14]/80 dark:text-white font-semibold text-base sm:text-sm cursor-pointer outline-none"
              >
                <option value="draft" className="dark:bg-[#0d1526] dark:text-white">Draft (Private)</option>
                <option value="scheduled" className="dark:bg-[#0d1526] dark:text-white">Scheduled (Auto-Publish)</option>
                <option value="published" className="dark:bg-[#0d1526] dark:text-white">Published (Live to Public)</option>
                <option value="archived" className="dark:bg-[#0d1526] dark:text-white">Archived (Unlisted)</option>
              </select>
            </div>

            {(formData.status === "published" || formData.status === "scheduled") && (
              <div className="p-3.5 bg-slate-50/70 dark:bg-[#07111e]/90 rounded-xl border border-slate-200/80 dark:border-white/10 space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <CalendarClock size={15} className="text-[#68b955]" />
                  Publish Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="published_at"
                  value={formData.published_at}
                  onChange={handleChange}
                  className="w-full px-3 py-2 min-h-[40px] border border-slate-200/90 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-[#68b955]/30 focus:border-[#68b955] dark:bg-[#050b14]/80 dark:text-white text-base sm:text-xs font-mono outline-none"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  If set in the future, the post will not appear on the live site until this exact timestamp.
                </p>
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSaving}
                className="w-full flex justify-center items-center gap-2 bg-[#68b955] hover:bg-[#4e993d] text-white font-bold py-2.5 px-4 min-h-[44px] rounded-xl transition-all shadow-xs disabled:opacity-70 text-sm cursor-pointer active:scale-95"
              >
                <Send size={16} />
                {formData.status === "published" ? "Publish Live" : "Save as " + formData.status}
              </button>
            </div>
          </div>

          {/* Author & Category Card */}
          <div className="bg-white dark:bg-[#0d1526] border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xs p-4 sm:p-5 lg:p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-3 font-sans">
              Author & Category
            </h2>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Category
                </label>
                <Link
                  href="/admin/categories"
                  className="text-xs text-[#68b955] hover:text-[#4e993d] hover:underline font-semibold"
                >
                  Manage Categories
                </Link>
              </div>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 min-h-[42px] border border-slate-200/90 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#68b955]/30 focus:border-[#68b955] dark:bg-[#050b14]/80 dark:text-white text-base sm:text-sm cursor-pointer outline-none"
              >
                <option value="" className="dark:bg-[#0d1526] dark:text-white">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="dark:bg-[#0d1526] dark:text-white">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Author Name
              </label>
              <input
                type="text"
                name="author_name"
                value={formData.author_name}
                onChange={handleChange}
                placeholder="e.g. NearGrow Team"
                className="w-full px-3.5 py-2.5 min-h-[42px] border border-slate-200/90 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#68b955]/30 focus:border-[#68b955] dark:bg-[#050b14]/80 dark:text-white text-base sm:text-sm outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">Leave blank to default to &apos;NearGrow Team&apos;</p>
            </div>

            <div>
              <CloudinaryUploader
                label="Author Avatar (Optional)"
                value={formData.author_avatar}
                onChange={(url) => handleImageChange("author_avatar", url)}
                blogId={id}
                variant="avatar"
              />
            </div>
          </div>

          {/* Featured Image Card */}
          <div className="bg-white dark:bg-[#0d1526] border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xs p-4 sm:p-5 lg:p-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-3 mb-4 font-sans">
              Featured Media Asset
            </h2>
            <CloudinaryUploader
              label="Featured Image"
              value={formData.featured_image}
              onChange={(url) => handleImageChange("featured_image", url)}
              blogId={id}
            />
          </div>

          {/* SEO Checker Live Card */}
          <SeoChecklist
            title={formData.meta_title || formData.title}
            description={formData.meta_description || formData.excerpt}
            content={formData.content}
            keywords={formData.meta_keywords}
            featuredImage={formData.featured_image}
          />
        </div>
      </div>
    </div>
  );
}
