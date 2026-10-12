import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CTA from "@/components/CTA";
import { notFound } from "next/navigation";
import { getPublishedPostBySlug, getAllPublishedPosts } from "@/lib/blog/data";
import { resolveBlogContent } from "@/lib/blog/resolver";
import RichTextRenderer from "@/components/blog/RichTextRenderer";
import ArticleSchema from "@/components/Schema/ArticleSchema";
import BreadcrumbSchema from "@/components/Schema/BreadcrumbSchema";
import BlogViewTracker from "@/components/blog/BlogViewTracker";
import BlogReadingExperience from "@/components/blog/BlogReadingExperience";
import BlogCard from "@/components/blog/BlogCard";

export const revalidate = 60;

// ==========================================
// DYNAMIC METADATA + JSON-LD
// ==========================================
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPublishedPostBySlug(id);

  if (!post) return { title: "Post Not Found" };

  return {
    title: post.meta_title || `${post.title} | NearGrow Ads Blog`,
    description: post.meta_description || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.cover_image ? [post.cover_image] : [],
      type: 'article',
    },
    alternates: {
      canonical: post.canonical_url || `https://trisagemarketing.com/blog/${post.slug}`,
    }
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPublishedPostBySlug(id);

  if (!post) notFound();

  // Dynamically resolve internal blog links and fetch related articles in parallel
  const [resolvedContent, allPosts] = await Promise.all([
    resolveBlogContent(post.content),
    getAllPublishedPosts(),
  ]);
  const relatedPosts = allPosts
    .filter((p) => p.id !== post.id)
    .slice(0, 3);

  const publishDate = new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Insights", item: "/blog" },
    { name: post.title, item: `/blog/${post.slug}` }
  ];

  return (
    <>
      <BlogViewTracker blogId={post.id} />
      <ArticleSchema article={{ ...post, excerpt: post.excerpt ?? undefined, cover_image: post.cover_image ?? undefined, published_at: post.published_at ?? undefined }} />
      <BreadcrumbSchema items={breadcrumbs} />

      <main className="min-h-screen bg-white dark:bg-[#050b14] w-full max-w-full overflow-x-hidden">
        <article className="w-full max-w-full overflow-x-hidden">
          {/* ── Single Unified Reading Canvas with Pixel-Perfect Alignment ── */}
          <BlogReadingExperience
            title={post.title}
            slug={post.slug}
            excerpt={post.excerpt}
            coverImage={post.cover_image}
            readTime={post.read_time || "5 min read"}
            publishDate={publishDate}
            authorName={post.author_name || "NearGrow Team"}
            authorAvatar={post.author_avatar}
            category={post.category}
            tags={post.tags}
            faqs={post.faqs ?? undefined}
          >
            <RichTextRenderer content={resolvedContent} />
          </BlogReadingExperience>
        </article>

        {/* ── Related Articles Section (Read Next) ── */}
        {relatedPosts.length > 0 && (
          <section className="py-12 xs:py-16 sm:py-20 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#070e1b]">
            <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 xs:gap-4 mb-8 xs:mb-10">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] xs:text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-widest mb-2">
                    Continue Reading
                  </span>
                  <h2 className="text-xl xs:text-2xl sm:text-3xl font-semibold sm:font-bold text-slate-900 dark:text-white tracking-tight">
                    Related Articles
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 inline-flex items-center gap-1.5 transition-colors group"
                >
                  <span>Explore All Articles</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((related) => (
                  <BlogCard key={related.id} post={related} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <CTA />
    </>
  );
}
