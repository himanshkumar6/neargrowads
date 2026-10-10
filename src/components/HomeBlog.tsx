"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import BlogCard from "@/components/blog/BlogCard";

export interface RecentPost {
  id: string;
  slug?: string | null;
  title?: string | null;
  excerpt?: string | null;
  category?: string | null;
  cover_image?: string | null;
  imageUrl?: string | null;
  published_at?: string | null;
  author_name?: string | null;
  author_avatar?: string | null;
  read_time?: string | null;
}

interface HomeBlogProps {
  recentPosts?: RecentPost[];
}

export default function HomeBlog({ recentPosts = [] }: HomeBlogProps) {
  const displayPosts = recentPosts.map((post) => ({
    id: post.id,
    slug: post.slug || post.id,
    title: post.title || "Untitled article",
    excerpt: post.excerpt || "Read our latest insights and strategies for growth.",
    category: post.category || "Digital Marketing",
    cover_image: post.cover_image || null,
    author_name: post.author_name || null,
    author_avatar: post.author_avatar || null,
    read_time: post.read_time || "5 min read",
    published_at: post.published_at || null,
  }));

  return (
    <section
      className="relative py-12 sm:py-16 md:py-20 bg-white dark:bg-[#050b14] overflow-hidden normal-case!"
      id="insights"
    >
      {/* ── Mesh Orbs — same pattern as Testimonials & FAQ ── */}
      <div
        className="absolute -top-1/4 left-[-8%] w-[50%] h-[70%] rounded-full pointer-events-none animate-[pulse_9s_ease-in-out_infinite] will-change-opacity transform-gpu"
        style={{ background: "radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-1/4 right-[-8%] w-[45%] h-[65%] rounded-full pointer-events-none animate-[pulse_12s_ease-in-out_infinite_reverse] will-change-opacity transform-gpu"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)" }}
      />

      {/* Galaxy background (dark only) */}
      <div
        className="absolute hidden dark:block left-[-20%] top-[10%] w-150 h-150 md:w-300 md:h-300 pointer-events-none z-0 opacity-40 mix-blend-screen"
        style={{ transform: "rotateX(60deg) rotateY(15deg) rotateZ(-20deg)", transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 animate-[planetSpin_60s_linear_infinite]" style={{ transformStyle: "preserve-3d" }}>
          <div className="absolute top-1/2 left-1/2 w-[30%] h-[30%] -translate-x-1/2 -translate-y-1/2 bg-rose-500/80 rounded-full blur-[60px]" />
          <div className="absolute top-1/2 left-1/2 w-[15%] h-[15%] -translate-x-1/2 -translate-y-1/2 bg-white/90 rounded-full blur-[20px]" />
          <div className="absolute top-1/2 left-1/2 w-[80%] h-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full border-20 border-t-purple-500/40 border-r-transparent border-b-fuchsia-500/30 border-l-transparent blur-[15px] animate-[planetSpin_40s_linear_infinite_reverse]" />
          <div className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 rounded-full border-40 border-t-transparent border-r-indigo-500/20 border-b-transparent border-l-blue-500/20 blur-[25px] animate-[planetSpin_50s_linear_infinite]" />
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/20 blur-[1px] animate-[planetSpin_30s_linear_infinite]" />
          <div className="absolute inset-8 rounded-full border-[3px] border-dotted border-pink-300/30 blur-[2px] animate-[planetSpin_25s_linear_infinite_reverse]" />
        </div>
      </div>

      <div className="container relative z-10 mx-auto px-3 xs:px-4 md:px-8 max-w-300">

        {/* ── Section Header — exact same pattern as Testimonials ── */}
        <div className="text-center max-w-4xl mx-auto mb-8 md:mb-10">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} variants={fadeUp}
            className="text-2xl xs:text-3xl sm:text-4xl md:text-6xl font-semibold sm:font-bold md:font-bold mb-3 sm:mb-4 md:mb-6 tracking-tight text-center leading-[1.2]"
          >
            <span className="inline-block whitespace-nowrap mr-2 sm:mr-3">
              <span className="text-primary-950 dark:text-white">Latest </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500 dark:from-primary-400 dark:to-secondary-400">Insights</span>
            </span>
            <span className="inline-block whitespace-nowrap">
              <span className="text-primary-950 dark:text-white">&amp; </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-500 to-primary-600 dark:from-secondary-400 dark:to-primary-400">Strategies</span>
            </span>
          </motion.h2>
          <motion.p
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} variants={fadeUp}
            className="font-sans font-normal sm:font-medium text-sm xs:text-base sm:text-xl lg:text-2xl leading-relaxed capitalize tracking-tight text-balance text-primary-700 dark:text-primary-300 max-w-2xl mx-auto"
          >
            Practical guides and strategies on{" "}
            <strong className="font-semibold text-primary-600 dark:text-primary-400">Google Business Profiles</strong>,{" "}
            <strong className="font-semibold text-secondary-600 dark:text-secondary-400">local ads</strong>, and attracting{" "}
            <strong className="font-semibold text-primary-950 dark:text-white">nearby customers</strong>.
          </motion.p>
        </div>

        {/* ── Blog Cards Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12 normal-case!">
          {displayPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
            >
              <BlogCard post={post} priority={index === 0} />
            </motion.div>
          ))}
        </div>

        {/* ── CTA ── */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} variants={fadeUp}
          className="text-center"
        >
          <Link
            href="/blog"
            className="inline-flex items-center justify-center py-3.5 sm:py-4 px-6 sm:px-8 rounded-full text-white text-xs xs:text-sm font-semibold capitalize tracking-widest bg-linear-to-r from-primary-600 to-secondary-500 dark:from-primary-500 dark:to-secondary-400 hover:from-primary-500 hover:to-secondary-400 shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-all duration-300 hover:-translate-y-1 gap-2 group cursor-pointer"
          >
            View All Articles
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
