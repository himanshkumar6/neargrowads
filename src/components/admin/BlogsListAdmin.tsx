"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  CalendarClock,
  Globe,
  FileText,
  AlertTriangle,
  Search,
  Loader2,
  Calendar,
  Tag,
  LayoutGrid,
  List,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { deleteBlog } from "@/lib/blog/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface AdminBlogItem {
  id: string;
  title: string;
  slug: string;
  status: string;
  views?: number | null;
  category_name?: string | null;
  author_name?: string | null;
  published_at?: string | null;
  created_at?: string | null;
  cover_image?: string | null;
  featured_image?: string | null;
}

export interface BlogsListAdminProps {
  initialBlogs: AdminBlogItem[];
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function formatDisplayDate(dateStr?: string | null): string {
  if (!dateStr) return "Draft";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Draft";
    return `${MONTH_NAMES[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
  } catch {
    return "Draft";
  }
}

export default function BlogsListAdmin({ initialBlogs }: BlogsListAdminProps) {
  const [blogs, setBlogs] = useState<AdminBlogItem[]>(initialBlogs);
  const [filter, setFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [blogToDelete, setBlogToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const router = useRouter();

  // Status counts for tabs
  const counts = useMemo(() => {
    return {
      all: blogs.length,
      published: blogs.filter((b) => b.status === "published").length,
      scheduled: blogs.filter((b) => b.status === "scheduled").length,
      draft: blogs.filter((b) => b.status === "draft").length,
    };
  }, [blogs]);

  // Filtered and searched blogs
  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      const matchesFilter = filter === "all" ? true : b.status === filter;
      const matchesSearch =
        !searchQuery.trim() ||
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.category_name && b.category_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (b.author_name && b.author_name.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }, [blogs, filter, searchQuery]);

  const confirmDelete = async () => {
    if (!blogToDelete) return;
    const { id, title } = blogToDelete;
    setIsDeleting(true);

    // Optimistic UI update
    const previousBlogs = [...blogs];
    setBlogs((prev) => prev.filter((b) => b.id !== id));

    try {
      const res = await deleteBlog(id);
      if (res.success) {
        toast.success(`Deleted "${title}"`);
        setBlogToDelete(null);
        router.refresh();
      } else {
        setBlogs(previousBlogs);
        toast.error(res.error || "Failed to delete post");
      }
    } catch {
      setBlogs(previousBlogs);
      toast.error("Network error while deleting post");
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (blog: AdminBlogItem) => {
    switch (blog.status) {
      case "published":
        return (
          <span suppressHydrationWarning className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-sm border border-emerald-700/30 dark:border-emerald-400/30">
            <Globe size={12} className="shrink-0" /> Published
          </span>
        );
      case "scheduled": {
        const isLive = blog.published_at && new Date(blog.published_at).getTime() <= Date.now();
        if (isLive) {
          return (
            <span
              suppressHydrationWarning
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-sm border border-emerald-700/30 dark:border-emerald-400/30"
              title="Automatically published via schedule"
            >
              <CalendarClock size={12} className="shrink-0" /> Published
            </span>
          );
        }
        return (
          <span suppressHydrationWarning className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-600 text-white dark:bg-blue-500 dark:text-slate-950 shadow-sm border border-blue-700/30 dark:border-blue-400/30">
            <CalendarClock size={12} className="shrink-0" /> Scheduled
          </span>
        );
      }
      case "draft":
        return (
          <span suppressHydrationWarning className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-600 text-white dark:bg-amber-400 dark:text-slate-950 shadow-sm border border-amber-700/30 dark:border-amber-300/30">
            <FileText size={12} className="shrink-0" /> Draft
          </span>
        );
      default:
        return (
          <span suppressHydrationWarning className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-slate-800 text-white dark:bg-slate-700 dark:text-slate-100 shadow-sm border border-slate-700">
            {blog.status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner (Synchronized with CMS Dashboard Standard) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0d1526] border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 sm:p-5 lg:p-6 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Blog Posts
            </h1>
            <span className="px-3 py-0.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 text-xs font-semibold uppercase tracking-wider">
              {blogs.length} Articles Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal">
            Manage, publish, and monitor your website&apos;s marketing articles.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/admin/categories"
            className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-white/10 font-bold py-2.5 px-4 rounded-xl transition-all text-xs sm:text-sm shadow-2xs"
          >
            <Tag size={16} className="text-[#68b955]" />
            <span>Categories</span>
          </Link>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center justify-center gap-2 bg-[#68b955] hover:bg-[#4e993d] text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-xs text-xs sm:text-sm cursor-pointer"
          >
            <Plus size={16} />
            <span>New Post</span>
          </Link>
        </div>
      </div>

      {/* Filter Tabs, Search Bar and View Switcher */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {(["all", "published", "scheduled", "draft"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold capitalize whitespace-nowrap transition-all cursor-pointer ${
                filter === status
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 scale-105"
                  : "bg-white dark:bg-[#0d1526] text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 hover:border-[#68b955]/40"
              }`}
            >
              {status} ({counts[status]})
            </button>
          ))}
        </div>

        {/* Search Input and View Switcher */}
        <div className="flex items-center gap-2.5 w-full xl:w-auto">
          <div className="relative flex-1 min-w-0 sm:min-w-[260px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, slug, category..."
              className="w-full pl-9 pr-4 py-2 min-h-[40px] bg-white dark:bg-[#050b14]/80 border border-slate-200/80 dark:border-white/10 rounded-xl text-base sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#68b955]/30 focus:border-[#68b955] transition-all"
            />
          </div>

          {/* View Mode Switcher */}
          <div className="hidden sm:flex items-center bg-white dark:bg-[#0d1526] p-1 rounded-xl border border-slate-200/80 dark:border-white/10 shadow-xs shrink-0">
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`p-1.5 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === "cards"
                  ? "bg-emerald-500 text-slate-950 shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
              title="Card Grid View"
              aria-label="Card Grid View"
            >
              <LayoutGrid size={15} />
              <span className="text-xs">Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`p-1.5 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === "table"
                  ? "bg-emerald-500 text-slate-950 shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
              title="Table View"
              aria-label="Table View"
            >
              <List size={15} />
              <span className="text-xs">Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredBlogs.length === 0 ? (
        <div className="bg-white dark:bg-[#0d1526] rounded-2xl p-12 text-center border border-slate-200/80 dark:border-white/10 shadow-xs">
          <div className="w-14 h-14 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
            <FileText size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No articles found</h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
            {searchQuery
              ? `No posts matched "${searchQuery}". Try a different keyword.`
              : "No articles are currently in this view. Create a new article to get started!"}
          </p>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#68b955] hover:bg-[#4e993d] text-white text-xs font-bold rounded-xl transition-all shadow-xs"
          >
            <Plus size={16} />
            <span>Create First Post</span>
          </Link>
        </div>
      ) : viewMode === "cards" ? (
        /* 🎴 RESPONSIVE CARD GRID VIEW (Default - No Horizontal Scroll) */
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredBlogs.map((blog) => {
            const imageSrc = blog.featured_image || blog.cover_image;
            return (
              <div
                key={blog.id}
                className="bg-white dark:bg-[#0d1526] rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-xs hover:shadow-md hover:border-[#68b955]/40 dark:hover:border-[#68b955]/40 transition-all duration-200 flex flex-col overflow-hidden group"
              >
                {/* Card Banner / Thumbnail */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-[#07111e] border-b border-slate-100 dark:border-white/10">
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 bg-slate-100 dark:bg-[#07111e]">
                      <FileText size={32} className="opacity-40" />
                    </div>
                  )}

                  {/* Status badge in top-left */}
                  <div className="absolute top-3 left-3 z-10 drop-shadow-md">
                    {getStatusBadge(blog)}
                  </div>

                  {/* Top-Right Badge: Author Name */}
                  <div className="absolute top-3 right-3 z-10">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-950/75 backdrop-blur-md text-white border border-white/10 shadow-sm truncate max-w-[150px]"
                      title={`Author: ${blog.author_name || "NearGrow Team"}`}
                    >
                      <User size={12} className="text-[#68b955] shrink-0" />
                      <span className="truncate">{blog.author_name || "NearGrow Team"}</span>
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3.5 sm:gap-4">
                  <div>
                    {/* Category Tag above title */}
                    {blog.category_name && (
                      <div className="mb-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                          <Tag size={11} className="shrink-0" />
                          <span className="truncate max-w-[200px]">{blog.category_name}</span>
                        </span>
                      </div>
                    )}

                    <h3
                      className="font-bold text-base text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors"
                      title={blog.title}
                    >
                      {blog.title}
                    </h3>
                    <p
                      className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate mt-1.5"
                      title={`/blog/${blog.slug}`}
                    >
                      /blog/{blog.slug}
                    </p>
                  </div>

                  {/* Meta Row: Views & Published Date */}
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-3 border-t border-slate-200/80 dark:border-white/10">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Eye size={14} className="text-emerald-600 dark:text-emerald-400" />
                      <span className="text-slate-900 dark:text-white font-bold">
                        {blog.views ?? 0}
                      </span>
                      <span>views</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-slate-500 dark:text-slate-400" />
                      <span suppressHydrationWarning className="text-slate-700 dark:text-slate-300 font-medium">
                        {formatDisplayDate(blog.published_at)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200/80 dark:border-white/10">
                    <a
                      href={`/blog/${blog.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 text-slate-700 dark:text-slate-200 hover:text-[#68b955] dark:hover:text-[#68b955] bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-bold border border-slate-200/60 dark:border-white/10"
                      title="View live article"
                    >
                      <Eye size={14} />
                      <span>View</span>
                    </a>
                    <Link
                      href={`/admin/blog/${blog.id}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 text-xs font-bold transition-colors border border-emerald-300/60 dark:border-emerald-500/20"
                    >
                      <Pencil size={14} />
                      <span>Edit</span>
                    </Link>
                    <button
                      onClick={() => setBlogToDelete({ id: blog.id, title: blog.title })}
                      className="p-2 text-rose-600 hover:text-rose-700 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 rounded-xl transition-colors cursor-pointer border border-rose-200/60 dark:border-rose-500/20"
                      title="Delete"
                      aria-label={`Delete ${blog.title}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* 💻 DATA TABLE VIEW (Optional view) */
        <div className="bg-white dark:bg-[#0d1526] border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/80 dark:bg-[#07111e]/90 text-xs uppercase text-slate-500 dark:text-slate-400 border-b border-slate-200/80 dark:border-white/10">
                <tr>
                  <th className="px-6 py-4 font-bold tracking-wider">Post</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Category</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Views</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Published</th>
                  <th className="px-6 py-4 font-bold tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 dark:divide-white/10">
                {filteredBlogs.map((blog) => {
                  const imageSrc = blog.featured_image || blog.cover_image;
                  return (
                    <tr
                      key={blog.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-white/5 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          {imageSrc ? (
                            <div className="relative w-14 h-11 rounded-lg overflow-hidden shrink-0 bg-slate-100 dark:bg-[#07111e] border border-slate-200/80 dark:border-white/10">
                              <Image src={imageSrc} alt="" fill className="object-cover" />
                            </div>
                          ) : (
                            <div className="w-14 h-11 rounded-lg bg-slate-100 dark:bg-[#07111e] flex items-center justify-center shrink-0 text-slate-400">
                              <FileText size={18} />
                            </div>
                          )}
                          <div className="min-w-0 max-w-sm lg:max-w-md">
                            <div className="font-bold text-slate-900 dark:text-white text-sm leading-snug truncate" title={blog.title}>
                              {blog.title}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono truncate mt-0.5">
                              <span className="truncate">/blog/{blog.slug}</span>
                              {blog.author_name && (
                                <>
                                  <span className="text-slate-300 dark:text-slate-700">•</span>
                                  <span className="text-slate-500 dark:text-slate-400 font-sans font-medium whitespace-nowrap">
                                    By {blog.author_name}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(blog)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {blog.category_name || <span className="text-slate-400 italic">Uncategorized</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {blog.views ?? 0}
                      </td>
                      <td suppressHydrationWarning className="px-6 py-4 whitespace-nowrap text-xs font-medium text-slate-600 dark:text-slate-400">
                        {blog.published_at ? formatDisplayDate(blog.published_at) : "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={`/blog/${blog.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-[#68b955] dark:hover:bg-white/10 rounded-lg transition-colors"
                            title="View Live"
                          >
                            <Eye size={16} />
                          </a>
                          <Link
                            href={`/admin/blog/${blog.id}`}
                            className="p-2 text-blue-700 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 rounded-lg transition-colors font-semibold"
                            title="Edit Post"
                          >
                            <Pencil size={16} />
                          </Link>
                          <button
                            onClick={() => setBlogToDelete({ id: blog.id, title: blog.title })}
                            className="p-2 text-rose-700 bg-rose-50 hover:bg-rose-100 dark:text-rose-400 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 rounded-lg transition-colors cursor-pointer"
                            title="Delete Post"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (Legacy BlogsList design with AnimatePresence) */}
      <AnimatePresence>
        {blogToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setBlogToDelete(null)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white dark:bg-[#0d1526] rounded-3xl shadow-2xl border border-slate-200/80 dark:border-white/10 overflow-hidden"
            >
              <div className="p-6 sm:p-8">
                <div className="w-14 h-14 bg-red-100 dark:bg-rose-500/10 rounded-2xl flex items-center justify-center mb-5">
                  <AlertTriangle className="h-7 w-7 text-red-600 dark:text-rose-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Delete Blog Post?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                  Are you sure you want to permanently delete{" "}
                  <strong className="text-slate-900 dark:text-white">&ldquo;{blogToDelete.title}&rdquo;</strong>?
                  This action cannot be undone and the content will be permanently removed.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    disabled={isDeleting}
                    onClick={() => setBlogToDelete(null)}
                    className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-colors text-sm cursor-pointer disabled:opacity-50 border border-slate-200/60 dark:border-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isDeleting}
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md shadow-red-500/20 transition-all flex justify-center items-center gap-2 text-sm cursor-pointer disabled:opacity-50"
                  >
                    {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    <span>{isDeleting ? "Deleting..." : "Delete Post"}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
