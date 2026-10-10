"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ExternalLink, ShieldCheck, ArrowUpRight } from "lucide-react";

export interface SitemapItem {
  title: string;
  url: string;
  category: "Core" | "Service" | "Case Study" | "Legal" | "Blog";
  priority: string;
  changeFreq: string;
  description?: string;
}

export default function SitemapClient({ items }: { items: SitemapItem[] }) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string>("All");

  const categories = ["All", "Core", "Service", "Case Study", "Legal", "Blog"];

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.url.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());

      const matchesTab = activeTab === "All" || item.category === activeTab;

      return matchesSearch && matchesTab;
    });
  }, [items, search, activeTab]);

  return (
    <div className="min-h-screen pt-24 xs:pt-28 pb-16 xs:pb-20 px-3 xs:px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#050b14] text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-6xl mx-auto">
        
        {/* ── Top Hero Card ── */}
        <div className="relative overflow-hidden rounded-2xl xs:rounded-3xl bg-gradient-to-br from-[#192361] via-[#243384] to-[#0284c7] p-4 xs:p-6 sm:p-10 text-white shadow-2xl mb-6 xs:mb-8">
          <div className="relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-3 xs:gap-4 mb-3 xs:mb-4">
              <span className="inline-flex items-center gap-1.5 xs:gap-2 px-2.5 xs:px-3.5 py-1 xs:py-1.5 rounded-full text-[10px] xs:text-xs font-bold uppercase tracking-wider bg-white/15 backdrop-blur-md border border-white/20 text-cyan-200">
                <span className="w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-cyan-400 animate-pulse" />
                Hospitality Digital Marketing
              </span>
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] xs:text-xs font-semibold px-3 xs:px-4 py-1.5 xs:py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 transition-all text-white hover:scale-105"
              >
                <span>Raw XML Sitemap</span>
                <ArrowUpRight size={13} />
              </a>
            </div>

            <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-semibold sm:font-bold md:font-bold tracking-tight mb-2 xs:mb-3">
              Website Directory &amp; Sitemap
            </h1>
            <p className="text-slate-200 text-xs xs:text-sm sm:text-base max-w-2xl leading-relaxed font-normal">
              Explore all pages, services, case studies, and insights from <strong className="font-semibold">NearGrow Ads</strong>. 
              Optimized for instant mobile navigation and search engines.
            </p>
          </div>
        </div>

        {/* ── Quick Stats Grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 xs:gap-3 sm:gap-4 mb-6 xs:mb-8">
          <div className="bg-white dark:bg-[#0c1626] border border-slate-200 dark:border-slate-800 rounded-xl xs:rounded-2xl p-3 xs:p-4 sm:p-5 shadow-sm">
            <span className="text-[10px] xs:text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-0.5 xs:mb-1">
              Total Pages
            </span>
            <span className="text-xl xs:text-2xl sm:text-3xl font-bold text-primary-600 dark:text-primary-400">
              {items.length}
            </span>
          </div>

          <div className="bg-white dark:bg-[#0c1626] border border-slate-200 dark:border-slate-800 rounded-xl xs:rounded-2xl p-3 xs:p-4 sm:p-5 shadow-sm">
            <span className="text-[10px] xs:text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-0.5 xs:mb-1">
              Core Services
            </span>
            <span className="text-xl xs:text-2xl sm:text-3xl font-bold text-cyan-600 dark:text-cyan-400">
              8
            </span>
          </div>

          <div className="bg-white dark:bg-[#0c1626] border border-slate-200 dark:border-slate-800 rounded-xl xs:rounded-2xl p-3 xs:p-4 sm:p-5 shadow-sm">
            <span className="text-[10px] xs:text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-0.5 xs:mb-1">
              Device Support
            </span>
            <span className="text-xs xs:text-sm sm:text-base font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5 xs:mt-1">
              <ShieldCheck size={16} className="xs:w-[18px] xs:h-[18px]" /> Mobile &amp; Desktop
            </span>
          </div>

          <div className="bg-white dark:bg-[#0c1626] border border-slate-200 dark:border-slate-800 rounded-xl xs:rounded-2xl p-3 xs:p-4 sm:p-5 shadow-sm">
            <span className="text-[10px] xs:text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-0.5 xs:mb-1">
              Primary Entity
            </span>
            <span className="text-xs xs:text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200 truncate block mt-0.5 xs:mt-1">
              NearGrow Ads
            </span>
          </div>
        </div>

        {/* ── Search & Filter Controls ── */}
        <div className="bg-white dark:bg-[#0c1626] border border-slate-200 dark:border-slate-800 rounded-xl xs:rounded-2xl p-3 xs:p-4 mb-5 xs:mb-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 xs:gap-4">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search URLs, services, or pages..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#050b14] border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === cat
                    ? "bg-[#243384] text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Counter */}
          <span className="text-xs font-medium text-slate-500 whitespace-nowrap hidden lg:inline-block">
            Showing <strong className="text-slate-800 dark:text-slate-200">{filteredItems.length}</strong> of {items.length} URLs
          </span>
        </div>

        {/* ── Content: Mobile Cards + Desktop Table ── */}

        {/* Desktop Table View (md and up) */}
        <div className="hidden md:block bg-white dark:bg-[#0c1626] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm mb-10">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4 text-center w-12">#</th>
                <th className="py-3.5 px-4">Page Title &amp; URL</th>
                <th className="py-3.5 px-4 text-center w-32">Category</th>
                <th className="py-3.5 px-4 text-center w-24">Priority</th>
                <th className="py-3.5 px-4 text-right w-32">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredItems.map((item, idx) => (
                <tr
                  key={item.url}
                  className="hover:bg-cyan-50/40 dark:hover:bg-cyan-950/20 transition-colors"
                >
                  <td className="py-3 px-4 text-center text-xs font-bold text-slate-400">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      href={item.url.replace("https://trisagemarketing.com", "") || "/"}
                      className="font-semibold text-slate-800 dark:text-slate-100 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors block text-[15px]"
                    >
                      {item.title}
                    </Link>
                    <span className="text-xs text-slate-400 font-mono block mt-0.5">
                      {item.url}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-xs font-semibold ${
                        parseFloat(item.priority) >= 0.9
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : parseFloat(item.priority) >= 0.7
                          ? "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {item.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={item.url.replace("https://trisagemarketing.com", "") || "/"}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline"
                    >
                      Visit <ExternalLink size={12} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View (sm and down) */}
        <div className="md:hidden space-y-2.5 xs:space-y-3 mb-8 xs:mb-10">
          {filteredItems.map((item) => (
            <Link
              key={item.url}
              href={item.url.replace("https://trisagemarketing.com", "") || "/"}
              className="block bg-white dark:bg-[#0c1626] border border-slate-200 dark:border-slate-800 rounded-xl xs:rounded-2xl p-3 xs:p-4 shadow-sm active:scale-[0.99] transition-transform"
            >
              <div className="flex items-start justify-between gap-2 mb-1 xs:mb-1.5">
                <span className="text-[10px] xs:text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {item.category}
                </span>
                <span
                  className={`text-[9px] xs:text-[10px] font-semibold px-1.5 xs:px-2 py-0.5 rounded-md ${
                    parseFloat(item.priority) >= 0.9
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300"
                  }`}
                >
                  Prio: {item.priority}
                </span>
              </div>
              <h3 className="text-sm xs:text-base font-semibold text-slate-900 dark:text-white leading-snug">
                {item.title}
              </h3>
              <p className="text-[11px] xs:text-xs text-cyan-600 dark:text-cyan-400 font-mono mt-1 truncate">
                {item.url.replace("https://trisagemarketing.com", "") || "/"}
              </p>
            </Link>
          ))}
        </div>

        {/* ── Footer note ── */}
        <div className="text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
          <p>
            All URLs listed above are verified and indexed by search engines. 
            For technical bots, please reference our{" "}
            <a href="/sitemap.xml" className="text-cyan-600 dark:text-cyan-400 font-bold underline">
              sitemap.xml
            </a>{" "}
            and{" "}
            <a href="/robots.txt" className="text-cyan-600 dark:text-cyan-400 font-bold underline">
              robots.txt
            </a>.
          </p>
          <p>© {new Date().getFullYear()} NearGrow Ads. All rights reserved.</p>
        </div>

      </div>
    </div>
  );
}
