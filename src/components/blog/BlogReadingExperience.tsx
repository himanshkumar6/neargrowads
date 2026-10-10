"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Copy,
  Check,
  Clock,
  Tag,
  BookOpen,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import BlogFAQ from "@/components/BlogFAQ";

function XIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface BlogReadingExperienceProps {
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage?: string | null;
  readTime?: string | null;
  publishDate?: string;
  authorName?: string | null;
  authorAvatar?: string | null;
  category?: string | null;
  tags?: string[];
  faqs?: FAQItem[];
  children: React.ReactNode;
}

export default function BlogReadingExperience({
  title,
  slug,
  excerpt,
  coverImage,
  readTime = "5 min read",
  publishDate = "",
  authorName = "NearGrow Team",
  authorAvatar,
  category,
  tags = [],
  faqs = [],
  children,
}: BlogReadingExperienceProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeHeadingId, setActiveHeadingId] = useState<string>("");
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [copied, setCopied] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);

  const fullUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return `https://trisagemarketing.com/blog/${slug}`;
  }, [slug]);

  // Extract headings from DOM after mounting
  useEffect(() => {
    const timer = setTimeout(() => {
      const articleEl = document.querySelector("#blog-article-content");
      if (!articleEl) return;

      const headingEls = articleEl.querySelectorAll("h2, h3");
      const items: HeadingItem[] = [];

      headingEls.forEach((el, index) => {
        const text = el.textContent?.trim() || "";
        if (!text) return;

        let id = el.id;
        if (!id) {
          id = text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
          if (!id) id = `heading-${index}`;
          el.id = id;
        }

        items.push({
          id,
          text,
          level: el.tagName.toLowerCase() === "h2" ? 2 : 3,
        });
      });

      setHeadings(items);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  // Track scroll progress and active heading
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }

      setShowBackToTop(window.scrollY > 400);

      // Active heading detection
      const headingEls = document.querySelectorAll("#blog-article-content h2, #blog-article-content h3");
      let currentId = "";

      headingEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // If heading is near top of viewport
        if (rect.top <= 140) {
          currentId = el.id;
        }
      });

      if (currentId) {
        setActiveHeadingId(currentId);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast.success("Article link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleShareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      title
    )}&url=${encodeURIComponent(fullUrl)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer,width=600,height=400");
  };

  const handleShareLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      fullUrl
    )}`;
    window.open(linkedinUrl, "_blank", "noopener,noreferrer,width=600,height=500");
  };

  const handleShareWhatsApp = () => {
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `${title} - ${fullUrl}`
    )}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const yOffset = -100;
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
    setActiveHeadingId(id);
    setIsMobileTocOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative pt-28 sm:pt-32 lg:pt-36 pb-20">
      {/* ── Top Reading Progress Bar (Fixed at top of screen) ── */}
      <div className="fixed top-0 left-0 right-0 h-1 z-[60] bg-transparent pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 transition-all duration-150 ease-out shadow-sm shadow-emerald-500/50"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* ── Desktop Floating Share Dock (Visible only on ultra-wide 2xl screens) ── */}
      <aside className="hidden 2xl:flex flex-col items-center gap-3 fixed left-8 3xl:left-14 top-1/3 z-40 bg-white/90 dark:bg-[#0c1527]/90 backdrop-blur-xl p-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl transition-all">
        <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 tracking-wider uppercase writing-vertical-lr mb-1">
          Share
        </span>
        <button
          type="button"
          onClick={handleCopyLink}
          title="Copy Link"
          className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all cursor-pointer shadow-xs"
        >
          {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
        </button>
        <button
          type="button"
          onClick={handleShareTwitter}
          title="Share on X"
          className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/40 transition-all cursor-pointer shadow-xs"
        >
          <XIcon className="w-[18px] h-[18px]" />
        </button>
        <button
          type="button"
          onClick={handleShareLinkedIn}
          title="Share on LinkedIn"
          className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-all cursor-pointer shadow-xs"
        >
          <LinkedInIcon className="w-[18px] h-[18px]" />
        </button>
        <button
          type="button"
          onClick={handleShareWhatsApp}
          title="Share on WhatsApp"
          className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all cursor-pointer shadow-xs"
        >
          <MessageCircle size={18} />
        </button>
      </aside>

      {/* ── UNIFIED READING CANVAS & SIDEBAR ── */}
      <div className="w-full max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center gap-10 xl:gap-14 relative">

          {/* ── MAIN COLUMN: Exact same container for Header, Cover Image, and Body ── */}
          <div className="w-full max-w-3xl min-w-0">

            {/* Breadcrumbs Navigation */}
            <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mb-4 xs:mb-6 overflow-x-auto whitespace-nowrap pb-1">
              <Link href="/" className="hover:text-emerald-500 transition-colors">Home</Link>
              <span className="opacity-40">/</span>
              <Link href="/blog" className="hover:text-emerald-500 transition-colors">Insights</Link>
              {category && (
                <>
                  <span className="opacity-40">/</span>
                  <span className="text-slate-900 dark:text-white font-medium">{category}</span>
                </>
              )}
            </nav>

            {/* Category badge & Read time */}
            <div className="flex flex-wrap items-center gap-2 xs:gap-2.5 mb-4 xs:mb-5">
              {category && (
                <span className="inline-flex items-center gap-1.5 px-2.5 xs:px-3 py-1 rounded-full text-[11px] xs:text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Tag size={12} />
                  <span>{category}</span>
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 px-2.5 xs:px-3 py-1 rounded-full text-[11px] xs:text-xs font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60">
                <Clock size={12} className="text-emerald-500" />
                <span>{readTime}</span>
              </span>
            </div>

            {/* Post Title */}
            <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold text-slate-900 dark:text-white leading-[1.22] tracking-tight mb-3 xs:mb-5">
              {title}
            </h1>

            {/* Post Excerpt */}
            {excerpt && (
              <p className="text-sm xs:text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-4 xs:mb-6 font-normal">
                {excerpt}
              </p>
            )}

            {/* Author Bar & Metadata Row (Clean editorial divider) */}
            <div className="flex items-center justify-between flex-wrap gap-3 xs:gap-4 py-3 xs:py-4 mb-6 xs:mb-8 border-y border-slate-200 dark:border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden ring-1 ring-emerald-500/20 bg-emerald-500/10 flex items-center justify-center shrink-0">
                  {authorAvatar ? (
                    <Image src={authorAvatar} alt={authorName || 'Author'} fill className="object-cover" />
                  ) : (
                    <span className="font-semibold text-emerald-500 text-sm">
                      {(authorName || 'A')[0].toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-semibold text-slate-900 dark:text-white text-sm">{authorName || 'NearGrow Team'}</span>
                  <div className="text-xs text-slate-400 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-emerald-500 font-medium tracking-wider uppercase">Author</span>
                    {publishDate && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                        <span>{publishDate}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Share Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  title="Copy Link"
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-600 dark:text-slate-300 hover:text-emerald-500 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700/60"
                >
                  {copied ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
                </button>
                <button
                  type="button"
                  onClick={handleShareTwitter}
                  title="Share on X"
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-sky-50 dark:hover:bg-sky-950/40 text-slate-600 dark:text-slate-300 hover:text-sky-500 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700/60"
                >
                  <XIcon className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleShareLinkedIn}
                  title="Share on LinkedIn"
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-600 dark:text-slate-300 hover:text-blue-500 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700/60"
                >
                  <LinkedInIcon className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  title="Share on WhatsApp"
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-600 dark:text-slate-300 hover:text-emerald-500 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700/60"
                >
                  <MessageCircle size={15} />
                </button>
              </div>
            </div>

            {/* Cover Image — Exact same width as the reading column */}
            {coverImage && (
              <div className="mb-10 w-full">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-slate-200/80 dark:border-slate-800">
                  <Image
                    src={coverImage}
                    alt={title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 800px"
                  />
                </div>
              </div>
            )}

            {/* Mobile / Tablet Collapsible Table of Contents */}
            {headings.length > 2 && (
              <div className="xl:hidden mb-8 bg-slate-50 dark:bg-[#0c1527] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all shadow-sm">
                <button
                  type="button"
                  onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
                  className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <BookOpen size={16} className="text-emerald-500" />
                    <span className="font-semibold text-sm text-slate-900 dark:text-white">
                      Table of Contents
                    </span>
                    <span className="text-xs text-slate-400">({headings.length} sections)</span>
                  </div>
                  {isMobileTocOpen ? (
                    <ChevronUp size={16} className="text-slate-400" />
                  ) : (
                    <ChevronDown size={16} className="text-slate-400" />
                  )}
                </button>
                {isMobileTocOpen && (
                  <nav className="p-4 pt-1 border-t border-slate-200 dark:border-slate-800 space-y-2">
                    {headings.map((h) => (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => scrollToHeading(h.id)}
                        className={`block text-left text-xs sm:text-sm py-1 transition-colors w-full cursor-pointer ${
                          h.level === 3 ? "pl-4 text-slate-500 dark:text-slate-400" : "font-medium"
                        } ${
                          activeHeadingId === h.id
                            ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                            : "text-slate-700 dark:text-slate-300 hover:text-emerald-500"
                        }`}
                      >
                        {h.text}
                      </button>
                    ))}
                  </nav>
                )}
              </div>
            )}

            {/* Article Children (Processed HTML + Media) */}
            <div id="blog-article-content">{children}</div>

            {/* Tags footer */}
            {tags && tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500 mr-2">
                  TAGS:
                </span>
                {tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 hover:border-emerald-500/50 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* DYNAMIC FAQ SECTION */}
            {faqs && faqs.length > 0 && (
              <div className="mt-14">
                <BlogFAQ faqs={faqs} />
              </div>
            )}

            {/* Author Bio Box at bottom of post */}
            <div className="mt-10 xs:mt-14 p-4 xs:p-6 sm:p-8 rounded-2xl xs:rounded-3xl bg-slate-50 dark:bg-[#0c1527] border border-slate-200 dark:border-slate-800/90 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-4 xs:gap-5">
              <div className="relative w-14 h-14 xs:w-16 xs:h-16 sm:w-20 sm:h-20 rounded-full ring-2 ring-emerald-500/30 overflow-hidden shadow-md shrink-0 bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                {authorAvatar ? (
                  <Image src={authorAvatar} alt={authorName || "NearGrow Team"} fill className="object-cover" />
                ) : (
                  <span className="text-xl xs:text-2xl font-bold text-emerald-500">
                    {(authorName || "N").charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 text-center sm:text-left min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 xs:gap-2 mb-2">
                  <h4 className="text-base xs:text-lg font-semibold text-slate-900 dark:text-white">
                    Written by {authorName || "NearGrow Team"}
                  </h4>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] xs:text-[11px] font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60 w-fit mx-auto sm:mx-0">
                    Content Strategist
                  </span>
                </div>
                <p className="text-xs xs:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Passionate about helping local businesses and entrepreneurs improve digital visibility, master performance marketing, and grow local search presence.
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-colors shadow-xs cursor-pointer"
                  >
                    <Check size={13} className="text-emerald-500" />
                    <span>Copy Link</span>
                  </button>
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 text-xs font-semibold text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/40 transition-colors"
                  >
                    <span>More Articles</span>
                  </Link>
                </div>
              </div>
            </div>

          </div>

          {/* ── Sticky Right Sidebar: Desktop Table of Contents ── */}
          {headings.length > 2 && (
            <aside className="hidden xl:block w-72 shrink-0">
              <div className="sticky top-28 space-y-6">
                <div className="p-5 rounded-2xl bg-slate-50/90 dark:bg-[#0c1527]/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center gap-2 font-semibold text-sm text-slate-900 dark:text-white mb-3.5 pb-2.5 border-b border-slate-200 dark:border-slate-800">
                    <BookOpen size={16} className="text-emerald-500" />
                    <span>Table of Contents</span>
                  </div>

                  <nav className="space-y-1 max-h-[calc(100vh-260px)] overflow-y-auto pr-1 no-scrollbar text-xs">
                    {headings.map((h) => {
                      const isActive = activeHeadingId === h.id;
                      return (
                        <button
                          key={h.id}
                          type="button"
                          onClick={() => scrollToHeading(h.id)}
                          className={`block text-left w-full py-1.5 px-2.5 rounded-lg transition-all cursor-pointer leading-snug ${
                            h.level === 3 ? "pl-5 text-slate-500 dark:text-slate-400" : "font-medium"
                          } ${
                            isActive
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-semibold border-l-2 border-emerald-500"
                              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50"
                          }`}
                        >
                          {h.text}
                        </button>
                      );
                    })}
                  </nav>

                  <div className="mt-3.5 pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-emerald-500" />
                      <span>{readTime}</span>
                    </span>
                    <span>{Math.round(scrollProgress)}% read</span>
                  </div>
                </div>
              </div>
            </aside>
          )}

        </div>
      </div>

      {/* ── Floating Back to Top Button (Placed cleanly above ChatWidget) ── */}
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          title="Scroll to top"
          className="fixed bottom-20 xs:bottom-24 right-3.5 xs:right-5 sm:right-7 z-40 p-2.5 xs:p-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold shadow-lg shadow-emerald-500/25 transition-all hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </div>
  );
}
