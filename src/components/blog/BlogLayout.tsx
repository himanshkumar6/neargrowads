"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Sparkles, ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Blog } from "@/types/blog";
import BlogCard from "@/components/blog/BlogCard";

const POSTS_PER_PAGE = 6; // 3 columns x 2 rows

export default function BlogLayout({ 
  initialBlogs, 
  dbCategories = [] 
}: { 
  initialBlogs: Blog[]; 
  dbCategories?: string[]; 
}) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const gridSectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Mouse drag tracking for smooth desktop carousel swiping
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const hasDragged = useRef(false);

  const categories = useMemo(() => {
    const articleCats = initialBlogs
      .map((b) => b.category)
      .filter((c): c is string => !!c && c.trim().length > 0);
    const uniqueArticleCats = Array.from(new Set(articleCats));
    if (uniqueArticleCats.length > 0) {
      return ["All", ...uniqueArticleCats];
    }
    const combined = Array.from(new Set([...dbCategories, ...articleCats]));
    return combined.length > 0 ? ["All", ...combined] : ["All"];
  }, [initialBlogs, dbCategories]);

  // Precompute category article counts for Flipkart / Amazon style chip badges
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: initialBlogs.length };
    initialBlogs.forEach((b) => {
      const cat = b.category?.trim();
      if (cat) {
        counts[cat] = (counts[cat] || 0) + 1;
        counts[cat.toLowerCase()] = (counts[cat.toLowerCase()] || 0) + 1;
      }
    });
    return counts;
  }, [initialBlogs]);

  const updateScrollButtons = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    updateScrollButtons();
    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [categories, updateScrollButtons]);

  const scrollRail = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const amount = Math.max(220, Math.floor(el.clientWidth * 0.65));
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    isDragging.current = true;
    hasDragged.current = false;
    startX.current = e.pageX - el.offsetLeft;
    scrollLeftStart.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const el = scrollContainerRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    if (Math.abs(walk) > 6) {
      hasDragged.current = true;
    }
    el.scrollLeft = scrollLeftStart.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  const filteredBlogs = useMemo(() => {
    if (activeCategory === "All") return initialBlogs;
    return initialBlogs.filter(
      (b) => b.category?.trim().toLowerCase() === activeCategory.trim().toLowerCase()
    );
  }, [activeCategory, initialBlogs]);

  const totalPosts = filteredBlogs.length;
  const totalPages = Math.max(1, Math.ceil(totalPosts / POSTS_PER_PAGE));
  const validCurrentPage = Math.min(currentPage, totalPages);

  const paginatedPosts = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * POSTS_PER_PAGE;
    return filteredBlogs.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [filteredBlogs, validCurrentPage]);

  // Desktop/Tablet pagination range (up to 7 items with standard ellipsis)
  const desktopPaginationRange = useMemo<(number | string)[]>(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const showLeftDots = validCurrentPage > 4;
    const showRightDots = validCurrentPage < totalPages - 3;

    if (!showLeftDots && showRightDots) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }
    if (showLeftDots && !showRightDots) {
      return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", validCurrentPage - 1, validCurrentPage, validCurrentPage + 1, "...", totalPages];
  }, [totalPages, validCurrentPage]);

  // Mobile pagination range (up to 6 items to fit 320px screens perfectly without overflow)
  const mobilePaginationRange = useMemo<(number | string)[]>(() => {
    if (totalPages <= 6) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const showLeftDots = validCurrentPage > 3;
    const showRightDots = validCurrentPage < totalPages - 2;

    if (!showLeftDots && showRightDots) {
      return [1, 2, 3, "...", totalPages];
    }
    if (showLeftDots && !showRightDots) {
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", validCurrentPage, "...", totalPages];
  }, [totalPages, validCurrentPage]);

  const handleCategorySelect = (
    category: string,
    e?: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (hasDragged.current) {
      hasDragged.current = false;
      return;
    }
    setActiveCategory(category);
    setCurrentPage(1);

    if (e?.currentTarget) {
      e.currentTarget.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  };

  const handleClearFilter = () => {
    setActiveCategory("All");
    setCurrentPage(1);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (gridSectionRef.current) {
      gridSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .text-stroke {
          -webkit-text-stroke: 1.5px rgba(0,0,0,0.1);
          color: transparent;
        }
        :is(.dark .text-stroke) {
          -webkit-text-stroke: 1.5px rgba(255,255,255,0.15);
        }
      `}} />

      {/* Hero Section with Infinite Marquee */}
      <section className="relative pt-24 xs:pt-28 pb-10 sm:pt-36 sm:pb-16 md:pt-40 md:pb-20 overflow-hidden w-full">
        {/* Infinite Marquee Background */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 w-full overflow-hidden pointer-events-none select-none z-0">
          <div className="animate-marquee flex whitespace-nowrap text-[40px] xs:text-[50px] sm:text-[80px] md:text-[120px] lg:text-[160px] font-bold text-stroke opacity-70">
            <span>INSIGHTS • STRATEGY • MARKETING • GROWTH • PERFORMANCE • INSIGHTS • STRATEGY • MARKETING •&nbsp;</span>
          </div>
        </div>

        <div className="container relative z-10 mx-auto px-3 xs:px-4 md:px-8 text-center max-w-3xl">
          <div className="inline-flex items-center gap-1.5 xs:gap-2 px-3 xs:px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] xs:text-xs font-medium text-emerald-400 mb-4 xs:mb-6 uppercase tracking-wider shadow-xs">
            <Sparkles size={14} /> Knowledge Hub & Insights
          </div>
          <h1 className="text-2xl xs:text-3xl sm:text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-3 xs:mb-4 sm:mb-6 tracking-tighter">
            Growth <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Insights</span>
          </h1>
          <p className="text-sm xs:text-base md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto font-normal">
            Insights, strategies, and practical playbooks to help your business improve local search visibility and attract high-intent customers.
          </p>
        </div>
      </section>

      {/* Category Filter Rail (Flipkart / Amazon Single Horizontal Line with Chevrons & Edge Fades) */}
      <section className="container mx-auto px-3 xs:px-4 md:px-8 pb-3 xs:pb-4 z-10 relative">
        <div className="relative w-full max-w-5xl mx-auto flex items-center">
          {/* Left Gradient Fade Mask */}
          <div
            className={`pointer-events-none absolute left-0 top-0 bottom-0 w-5 xs:w-8 sm:w-14 bg-gradient-to-r from-white dark:from-[#050b14] to-transparent z-10 transition-opacity duration-200 ${
              canScrollLeft ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Left Scroll Arrow (Desktop / Tablet) */}
          <button
            onClick={() => scrollRail("left")}
            disabled={!canScrollLeft}
            className={`hidden sm:flex absolute -left-2.5 sm:-left-3 lg:-left-5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white dark:bg-[#0c1527] border border-slate-200 dark:border-slate-800 shadow-md items-center justify-center text-slate-700 dark:text-slate-300 hover:text-emerald-500 hover:border-emerald-500/50 hover:scale-105 active:scale-95 transition-all cursor-pointer ${
              canScrollLeft ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
            aria-label="Scroll categories left"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Horizontal Scrollable Rail */}
          <div
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className="w-full flex items-center flex-nowrap gap-1.5 xs:gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar scroll-smooth py-1.5 xs:py-2 px-1 sm:px-4 cursor-grab active:cursor-grabbing select-none"
            style={{
              WebkitOverflowScrolling: "touch",
              overscrollBehaviorX: "contain",
            }}
          >
            {/* "All Articles" Pill */}
            <button
              onClick={(e) => handleCategorySelect("All", e)}
              className={`flex-shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 px-3 xs:px-4 py-1.5 xs:py-2 rounded-full text-[11px] xs:text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeCategory === "All"
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25 scale-[1.02]"
                  : "bg-white/80 dark:bg-[#0c1527] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40"
              }`}
              aria-pressed={activeCategory === "All"}
            >
              <span>All Articles</span>
              <span
                className={`ml-1 px-1.5 py-0.5 rounded-full text-[9px] xs:text-[10px] font-bold leading-none ${
                  activeCategory === "All"
                    ? "bg-slate-950/20 text-slate-950"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                }`}
              >
                {initialBlogs.length}
              </span>
            </button>

            {/* Individual Category Pills */}
            {categories
              .filter((c) => c !== "All")
              .map((category) => {
                const isActive = activeCategory === category;
                const count = categoryCounts[category] || categoryCounts[category.toLowerCase()] || 0;
                return (
                  <button
                    key={category}
                    onClick={(e) => handleCategorySelect(category, e)}
                    className={`flex-shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 px-3 xs:px-4 py-1.5 xs:py-2 rounded-full text-[11px] xs:text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25 scale-[1.02]"
                        : "bg-white/80 dark:bg-[#0c1527] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40"
                    }`}
                    aria-pressed={isActive}
                  >
                    <span>{category}</span>
                    <span
                      className={`ml-1 px-1.5 py-0.5 rounded-full text-[9px] xs:text-[10px] font-bold leading-none ${
                        isActive
                          ? "bg-slate-950/20 text-slate-950"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
          </div>

          {/* Right Scroll Arrow (Desktop / Tablet) */}
          <button
            onClick={() => scrollRail("right")}
            disabled={!canScrollRight}
            className={`hidden sm:flex absolute -right-2.5 sm:-right-3 lg:-right-5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white dark:bg-[#0c1527] border border-slate-200 dark:border-slate-800 shadow-md items-center justify-center text-slate-700 dark:text-slate-300 hover:text-emerald-500 hover:border-emerald-500/50 hover:scale-105 active:scale-95 transition-all cursor-pointer ${
              canScrollRight ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
            aria-label="Scroll categories right"
          >
            <ChevronRight size={16} />
          </button>

          {/* Right Gradient Fade Mask */}
          <div
            className={`pointer-events-none absolute right-0 top-0 bottom-0 w-5 xs:w-8 sm:w-14 bg-gradient-to-l from-white dark:from-[#050b14] to-transparent z-10 transition-opacity duration-200 ${
              canScrollRight ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </section>

      {/* Flipkart / Amazon Style One-Line Results & Active Filter Statement Bar */}
      <section className="container mx-auto px-3 xs:px-4 md:px-8 pb-5 xs:pb-6 sm:pb-8 z-10 relative">
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2.5 xs:gap-3 py-2 xs:py-2.5 px-3 xs:px-4 sm:px-5 rounded-xl xs:rounded-2xl bg-slate-50/90 dark:bg-[#0c1527]/80 border border-slate-200/80 dark:border-slate-800/80 shadow-xs backdrop-blur-md">
          {/* Statement */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <p className="text-[11px] xs:text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 leading-snug">
              Showing{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                {totalPosts === 0
                  ? "0"
                  : `${(validCurrentPage - 1) * POSTS_PER_PAGE + 1} to ${Math.min(
                      validCurrentPage * POSTS_PER_PAGE,
                      totalPosts
                    )}`}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                {totalPosts}
              </span>{" "}
              articles
              {activeCategory !== "All" && (
                <span className="text-slate-500 dark:text-slate-400">
                  {" "}in{" "}
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    &ldquo;{activeCategory}&rdquo;
                  </span>
                </span>
              )}
            </p>
          </div>

          {/* Flipkart / Amazon Style Quick Clear Filter Badge */}
          {activeCategory !== "All" && (
            <button
              onClick={handleClearFilter}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10px] xs:text-[11px] sm:text-xs font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/50 transition-all cursor-pointer group shrink-0 self-start xs:self-auto"
              title="Reset filter to All Articles"
              aria-label="Clear active filter"
            >
              <span>Clear Filter</span>
              <X size={13} className="group-hover:rotate-90 transition-transform duration-200" />
            </button>
          )}
        </div>
      </section>

      {/* Empty State when no published articles match */}
      {filteredBlogs.length === 0 && (
        <section className="container mx-auto px-3 xs:px-4 md:px-8 pb-16 xs:pb-20 sm:pb-28 z-10 relative max-w-2xl text-center">
          <div className="relative group bg-white/80 dark:bg-[#0c1527] backdrop-blur-2xl border border-slate-200 dark:border-slate-800/80 rounded-2xl xs:rounded-3xl p-5 xs:p-8 sm:p-12 shadow-xl">
            <div className="w-14 h-14 xs:w-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4 xs:mb-6 shadow-inner">
              <span className="text-2xl xs:text-3xl sm:text-4xl">📝</span>
            </div>
            <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2 xs:mb-3">
              No Articles Found
            </h2>
            <p className="text-xs xs:text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-6 xs:mb-8 leading-relaxed max-w-lg mx-auto">
              We couldn&apos;t find any articles matching this category right now. Explore all articles or get a free website audit while we finalize our next publication!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 xs:gap-3">
              <button
                onClick={() => handleCategorySelect("All")}
                className="w-full sm:w-auto px-5 xs:px-6 py-2.5 xs:py-3 rounded-xl text-slate-950 text-xs xs:text-sm font-bold bg-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
              >
                View All Articles
              </button>
              <Link
                href="/contact"
                className="w-full sm:w-auto px-5 xs:px-6 py-2.5 xs:py-3 rounded-xl text-slate-800 dark:text-slate-200 text-xs xs:text-sm font-bold bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-all text-center"
              >
                Get Free Audit
              </Link>
            </div>
          </div>
        </section>
      )}


      {/* Professional Blog Grid List */}
      {paginatedPosts.length > 0 && (
        <section
          ref={gridSectionRef}
          id="articles-grid"
          className="container mx-auto px-3 xs:px-4 md:px-8 pb-16 xs:pb-20 sm:pb-24 md:pb-32 z-10 relative scroll-mt-28"
        >
          <AnimatePresence mode="popLayout">
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 xs:gap-6 sm:gap-8 md:gap-10"
            >
              {paginatedPosts.map((post) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={post.id}
                  className="h-full"
                >
                  <BlogCard
                    post={{
                      id: post.id,
                      slug: post.slug,
                      title: post.title,
                      excerpt: post.excerpt,
                      category: post.category,
                      cover_image: post.cover_image,
                      author_name: post.author_name || null,
                      author_avatar: post.author_avatar || null,
                      read_time: post.read_time,
                      published_at: post.published_at,
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Pagination Controls (Flipkart / Amazon Responsive Pagination for Mobile & Tablet) */}
          {totalPages > 1 && (
            <div className="mt-8 xs:mt-10 sm:mt-12 md:mt-16 flex flex-col md:flex-row items-center justify-between gap-3.5 xs:gap-4 pt-6 xs:pt-8 border-t border-slate-200 dark:border-slate-800/80">
              {/* Left Statement */}
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 text-center md:text-left">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>
                  Showing <span className="text-slate-900 dark:text-white font-bold">{(validCurrentPage - 1) * POSTS_PER_PAGE + 1}</span> to{" "}
                  <span className="text-slate-900 dark:text-white font-bold">{Math.min(validCurrentPage * POSTS_PER_PAGE, totalPosts)}</span> of{" "}
                  <span className="text-slate-900 dark:text-white font-bold">{totalPosts}</span> articles
                </span>
              </div>

              {/* Navigation Controls */}
              <nav aria-label="Blog pagination" className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(validCurrentPage - 1)}
                  disabled={validCurrentPage === 1}
                  className="h-7 xs:h-8 sm:h-9 md:h-10 px-2 xs:px-2.5 sm:px-3 md:px-3.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1 transition-all bg-white dark:bg-[#0c1527] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-500/50 hover:text-emerald-500 disabled:opacity-30 disabled:pointer-events-none cursor-pointer shadow-xs shrink-0"
                  aria-label="Previous Page"
                >
                  <ChevronLeft size={15} />
                  <span className="hidden sm:inline">Prev</span>
                  <span className="hidden md:inline">ious</span>
                </button>

                {/* Mobile Page Numbers (Screens < 640px) */}
                <div className="flex sm:hidden items-center gap-1 xs:gap-1.5">
                  {mobilePaginationRange.map((item, idx) => {
                    if (item === "...") {
                      return (
                        <span
                          key={`mob-dots-${idx}`}
                          className="w-5 xs:w-6 text-center text-slate-400 dark:text-slate-500 text-xs font-semibold select-none"
                        >
                          ...
                        </span>
                      );
                    }
                    const pageNum = Number(item);
                    const isActive = pageNum === validCurrentPage;
                    return (
                      <button
                        key={`mob-${pageNum}`}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-7 h-7 xs:w-8 xs:h-8 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                          isActive
                            ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/25 scale-105"
                            : "bg-white dark:bg-[#0c1527] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-500/40 hover:text-emerald-400"
                        }`}
                        aria-label={`Page ${pageNum}`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                {/* Tablet & Desktop Page Numbers (Screens >= 640px) */}
                <div className="hidden sm:flex items-center gap-1.5 md:gap-2">
                  {desktopPaginationRange.map((item, idx) => {
                    if (item === "...") {
                      return (
                        <span
                          key={`desk-dots-${idx}`}
                          className="w-7 text-center text-slate-400 dark:text-slate-500 text-sm font-semibold select-none"
                        >
                          ...
                        </span>
                      );
                    }
                    const pageNum = Number(item);
                    const isActive = pageNum === validCurrentPage;
                    return (
                      <button
                        key={`desk-${pageNum}`}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-9 h-9 md:w-10 md:h-10 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                          isActive
                            ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/25 scale-105"
                            : "bg-white dark:bg-[#0c1527] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-500/40 hover:text-emerald-400"
                        }`}
                        aria-label={`Page ${pageNum}`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(validCurrentPage + 1)}
                  disabled={validCurrentPage === totalPages}
                  className="h-7 xs:h-8 sm:h-9 md:h-10 px-2 xs:px-2.5 sm:px-3 md:px-3.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1 transition-all bg-white dark:bg-[#0c1527] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-500/50 hover:text-emerald-500 disabled:opacity-30 disabled:pointer-events-none cursor-pointer shadow-xs shrink-0"
                  aria-label="Next Page"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight size={15} />
                </button>
              </nav>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
