"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Tag, ArrowRight, Newspaper } from "lucide-react";

export interface BlogCardData {
  id: string;
  slug?: string | null;
  title: string;
  excerpt?: string | null;
  category?: string | null;
  cover_image?: string | null;
  author_name?: string | null;
  author_avatar?: string | null;
  read_time?: string | null;
  published_at?: string | null;
}

interface BlogCardProps {
  post: BlogCardData;
  priority?: boolean;
}

export default function BlogCard({ post, priority = false }: BlogCardProps) {
  const [imgError, setImgError] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const imageUrl = post.cover_image && !imgError ? post.cover_image : null;
  const authorName = post.author_name?.trim() || "NearGrow Team";
  const authorInitial = authorName.charAt(0).toUpperCase() || "N";
  const hasAvatar = Boolean(post.author_avatar && post.author_avatar.trim() && !avatarError);
  const categoryName = post.category?.trim() || "Digital Marketing";
  const postHref = `/blog/${post.slug || post.id}`;

  return (
    <Link
      href={postHref}
      className="group relative flex flex-col h-full
        bg-white dark:bg-[#0d1526]
        rounded-2xl sm:rounded-[20px] overflow-hidden
        border border-slate-200/80 dark:border-white/5
        shadow-md hover:shadow-xl dark:shadow-[0_4px_30px_rgba(0,0,0,0.35)]
        hover:border-emerald-500/40 dark:hover:border-emerald-500/30
        dark:hover:shadow-[0_20px_60px_rgba(16,185,129,0.1)]
        hover:-translate-y-1.5
        transition-all duration-300 ease-out"
    >
      {/* ── Cover Image ── */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
        {imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              onError={() => setImgError(true)}
            />
            {/* Subtle gradient at bottom of image for contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 dark:from-[#0d1526]/60 via-transparent to-transparent pointer-events-none" />
          </>
        ) : (
          /* Branded placeholder */
          <div className="absolute inset-0 flex flex-col items-center justify-center
            bg-gradient-to-br from-slate-100 via-emerald-50/20 to-slate-200 dark:from-[#0a1120] dark:via-[#0e1c34] dark:to-[#0a1120]">
            {/* Grid texture */}
            <div
              className="absolute inset-0 opacity-[0.04] dark:opacity-[0.07] pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
            {/* Glowing center orb */}
            <div className="absolute w-28 h-28 rounded-full bg-emerald-500/10 blur-2xl" />
            <div className="relative z-10 flex flex-col items-center gap-2.5">
              <Newspaper size={32} className="text-emerald-600 dark:text-emerald-500/70" />
              <span className="text-slate-500 dark:text-white/50 text-[11px] font-medium tracking-[0.2em] uppercase">
                NearGrow Ads
              </span>
            </div>
            {/* Bottom emerald line */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500/40 dark:via-emerald-500/60 to-transparent" />
          </div>
        )}
      </div>

      {/* ── Card Body ── */}
      <div className="flex flex-col flex-1 px-4 xs:px-5 pt-4 xs:pt-5 pb-5 xs:pb-6 sm:px-6 sm:pt-5 sm:pb-6">

        {/* Row: Category + Author */}
        <div className="flex items-center justify-between gap-1.5 xs:gap-2 mb-3 xs:mb-4">

          {/* Category pill — outlined emerald */}
          <span className="inline-flex items-center gap-1.5
            px-2.5 xs:px-3 py-1 rounded-full
            border border-emerald-500/20 dark:border-emerald-500/30
            bg-emerald-500/10 dark:bg-emerald-500/5
            text-emerald-700 dark:text-emerald-400 text-[11px] xs:text-xs font-medium tracking-wide
            shrink-0 max-w-[55%] truncate">
            <Tag className="w-3 h-3 shrink-0" />
            <span className="truncate">{categoryName}</span>
          </span>

          {/* Author avatar + name */}
          <div className="flex items-center gap-1.5 xs:gap-2 shrink-0 min-w-0">
            {/* Avatar */}
            <div className="relative w-6 h-6 xs:w-7 xs:h-7 rounded-full overflow-hidden
              ring-1 ring-emerald-500/25 shrink-0
              bg-slate-100 dark:bg-[#1a2a45] flex items-center justify-center">
              {hasAvatar ? (
                <Image
                  src={post.author_avatar as string}
                  alt={authorName}
                  fill
                  className="object-cover"
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <span className="text-[10px] xs:text-[11px] font-medium text-emerald-600 dark:text-emerald-400 select-none">
                  {authorInitial}
                </span>
              )}
            </div>
            {/* Name */}
            <span className="text-xs xs:text-[13px] font-medium text-slate-700 dark:text-slate-300 tracking-tight truncate max-w-[90px] xs:max-w-[100px]">
              {authorName}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3
          className="font-sans font-semibold sm:font-bold text-[16px] xs:text-[18px] sm:text-[20px]
            text-slate-900 dark:text-white leading-snug tracking-tight mb-2.5 xs:mb-3
            line-clamp-2
            group-hover:text-emerald-600 dark:group-hover:text-emerald-300
            transition-colors duration-200"
          title={post.title}
        >
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="font-sans text-xs xs:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 xs:mb-5 line-clamp-3">
          {post.excerpt ||
            "Discover expert insights, proven strategies, and actionable intelligence to help your business grow."}
        </p>

        {/* Read Article CTA */}
        <div className="mt-auto flex items-center gap-1.5
          text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300
          font-semibold text-[13px] xs:text-[14px] sm:text-[15px]
          transition-colors duration-200">
          <span>Read Article</span>
          <ArrowRight className="w-3.5 h-3.5 xs:w-4 xs:h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
        </div>
      </div>
    </Link>
  );
}
