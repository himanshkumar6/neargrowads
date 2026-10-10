"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Search, Link2, Globe, FileText, Check, X, Loader2, ExternalLink } from "lucide-react";
import { getPublishedBlogsForLinking } from "@/lib/blog/actions";
import { PublishedBlogLinkOption } from "@/types/blog";

interface InternalLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectInternalLink: (data: { blogId: string; slug: string; title: string; href: string }) => void;
  onSelectCustomLink: (data: { href: string; openInNewTab: boolean }) => void;
  onRemoveLink?: () => void;
  initialHref?: string;
  isLinkActive?: boolean;
}

export default function InternalLinkModal({
  isOpen,
  onClose,
  onSelectInternalLink,
  onSelectCustomLink,
  onRemoveLink,
  initialHref = "",
  isLinkActive = false,
}: InternalLinkModalProps) {
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  const [activeTab, setActiveTab] = useState<"internal" | "custom">("internal");
  const [searchTerm, setSearchTerm] = useState("");
  const [blogs, setBlogs] = useState<PublishedBlogLinkOption[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<PublishedBlogLinkOption | null>(null);
  const [customUrl, setCustomUrl] = useState(initialHref);
  const [openInNewTab, setOpenInNewTab] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Synchronize state when modal opens
  const [prevIsOpen, setPrevIsOpen] = useState(false);
  if (isOpen && !prevIsOpen) {
    setPrevIsOpen(true);
    setCustomUrl(initialHref || "");
    setSelectedBlog(null);
    if (initialHref && !initialHref.startsWith("/blog/")) {
      setActiveTab("custom");
    } else {
      setActiveTab("internal");
    }
  } else if (!isOpen && prevIsOpen) {
    setPrevIsOpen(false);
  }

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Fetch blogs when modal opens or search term changes
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    const delayDebounce = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await getPublishedBlogsForLinking(searchTerm);
        if (isMounted) {
          setBlogs(results);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Failed to load blogs for linking:", err);
        if (isMounted) setIsLoading(false);
      }
    }, 200);

    return () => {
      isMounted = false;
      clearTimeout(delayDebounce);
    };
  }, [isOpen, searchTerm]);

  if (!isOpen || !mounted) return null;

  const handleApplyInternal = () => {
    if (!selectedBlog) return;
    onSelectInternalLink({
      blogId: selectedBlog.id,
      slug: selectedBlog.slug,
      title: selectedBlog.title,
      href: `/blog/${selectedBlog.slug}`,
    });
    onClose();
  };

  const handleApplyCustom = () => {
    if (!customUrl.trim()) return;
    let finalUrl = customUrl.trim();
    if (
      !finalUrl.startsWith("http://") &&
      !finalUrl.startsWith("https://") &&
      !finalUrl.startsWith("/") &&
      !finalUrl.startsWith("#") &&
      !finalUrl.startsWith("mailto:") &&
      !finalUrl.startsWith("tel:")
    ) {
      finalUrl = `https://${finalUrl}`;
    }
    onSelectCustomLink({
      href: finalUrl,
      openInNewTab,
    });
    onClose();
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/80 backdrop-blur-md transition-all duration-300 overflow-y-auto overflow-x-hidden no-scrollbar animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-[#0b1329] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl shadow-black/60 dark:shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col my-auto max-h-[88vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-gray-100 dark:border-white/10 bg-gray-50/70 dark:bg-[#0e1736]/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-500/10 dark:bg-primary-500/15 border border-primary-500/20 flex items-center justify-center text-primary-600 dark:text-primary-400">
              <Link2 size={18} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight">Insert Link</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Search internal articles or enter destination URL</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close (Esc)"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-white/10 bg-white dark:bg-[#0b1329] px-6 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab("internal")}
            className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "internal"
                ? "border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <FileText size={16} />
            Link to Existing Blog
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("custom")}
            className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "custom"
                ? "border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <Globe size={16} />
            Custom / External URL
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar p-5 sm:p-6 space-y-4">
          {activeTab === "internal" ? (
            <div className="space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (selectedBlog) {
                        handleApplyInternal();
                      } else if (searchTerm.startsWith("/") || searchTerm.startsWith("http") || searchTerm.includes(".")) {
                        let url = searchTerm.trim();
                        if (!url.startsWith("/") && !url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("#")) {
                          url = `https://${url}`;
                        }
                        onSelectCustomLink({ href: url, openInNewTab: !url.startsWith("/") });
                        onClose();
                      }
                    }
                  }}
                  placeholder="Search articles or paste URL (e.g. /contact)..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#070d1d] border border-gray-200 dark:border-slate-800 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                  autoFocus
                />
              </div>

              {/* Blog List with Smart URL Quick Action */}
              <div className="border border-gray-100 dark:border-slate-800/80 rounded-xl overflow-hidden bg-gray-50/50 dark:bg-[#070d1d]/50 max-h-60 overflow-y-auto overflow-x-hidden no-scrollbar divide-y divide-gray-100 dark:divide-slate-800/60">
                {searchTerm.trim().length > 0 && (searchTerm.startsWith("/") || searchTerm.startsWith("http") || searchTerm.includes(".")) && (
                  <button
                    type="button"
                    onClick={() => {
                      let url = searchTerm.trim();
                      if (!url.startsWith("/") && !url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("#")) {
                        url = `https://${url}`;
                      }
                      onSelectCustomLink({ href: url, openInNewTab: !url.startsWith("/") });
                      onClose();
                    }}
                    className="w-full text-left p-3 flex items-center justify-between gap-3 bg-primary-50 dark:bg-primary-950/40 hover:bg-primary-100/80 dark:hover:bg-primary-900/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Globe size={15} className="text-primary-600 dark:text-primary-400 shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold text-primary-700 dark:text-primary-300 truncate">
                        Use as Destination URL: <span className="underline">{searchTerm.trim()}</span>
                      </span>
                    </div>
                    <span className="text-xs px-2.5 py-1 bg-primary-600 text-white font-bold rounded-lg shrink-0 shadow-xs">
                      Apply
                    </span>
                  </button>
                )}
                {isLoading ? (
                  <div className="p-8 text-center text-gray-400 flex items-center justify-center gap-2 text-sm">
                    <Loader2 size={16} className="animate-spin text-primary-500" />
                    Loading articles...
                  </div>
                ) : blogs.length === 0 && !(searchTerm.startsWith("/") || searchTerm.startsWith("http")) ? (
                  <div className="p-8 text-center text-gray-400 text-sm">
                    No published articles found matching &quot;{searchTerm}&quot;.
                  </div>
                ) : (
                  blogs.map((blog) => {
                    const isSelected = selectedBlog?.id === blog.id;
                    return (
                      <button
                        key={blog.id}
                        type="button"
                        onClick={() => setSelectedBlog(blog)}
                        className={`w-full text-left p-3.5 flex items-start justify-between gap-3 transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-primary-50 dark:bg-primary-500/15"
                            : "hover:bg-gray-100/70 dark:hover:bg-slate-800/50"
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-1">
                            {blog.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                            <span className="px-1.5 py-0.5 rounded-md bg-gray-200/60 dark:bg-slate-800 text-[11px] font-medium text-gray-600 dark:text-gray-300">
                              {blog.category || "General"}
                            </span>
                            <span className="truncate">/blog/{blog.slug}</span>
                          </div>
                        </div>
                        {isSelected && (
                          <span className="p-1 rounded-full bg-primary-600 text-white shrink-0 mt-1 shadow-xs">
                            <Check size={12} />
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>

              {selectedBlog && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                  <span>Selected: <strong>{selectedBlog.title}</strong></span>
                  <span className="text-[11px]">/blog/{selectedBlog.slug}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Target Destination URL
                </label>
                <div className="relative">
                  <ExternalLink size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleApplyCustom();
                      }
                    }}
                    placeholder="https://example.com or /contact"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#070d1d] border border-gray-200 dark:border-slate-800 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                    autoFocus
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Enter an external website URL or relative site path.
                </p>
              </div>

              <div className="flex items-center gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="openInNewTab"
                  checked={openInNewTab}
                  onChange={(e) => setOpenInNewTab(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 accent-primary-600"
                />
                <label htmlFor="openInNewTab" className="text-xs text-gray-700 dark:text-gray-300 select-none cursor-pointer">
                  Open link in a new browser tab (recommended for external links)
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-white/10 bg-gray-50/70 dark:bg-[#0e1736]/80">
          <div>
            {isLinkActive && onRemoveLink && (
              <button
                type="button"
                onClick={() => {
                  onRemoveLink();
                  onClose();
                }}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 transition-colors cursor-pointer"
              >
                Unlink Selection
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={activeTab === "internal" ? handleApplyInternal : handleApplyCustom}
              disabled={activeTab === "internal" ? !selectedBlog : !customUrl.trim()}
              className="px-5 py-2 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              Apply Link
            </button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}
