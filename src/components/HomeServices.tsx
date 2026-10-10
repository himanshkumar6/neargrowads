"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { 
  XCircle, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  AlertCircle, 
  TrendingUp, 
  ShieldCheck 
} from "lucide-react";

interface ComparisonItem {
  title: string;
  detail: string;
}

const challenges: ComparisonItem[] = [
  {
    title: "Low Occupancy",
    detail: "Empty inventory during off-peak windows and inconsistent weekday booking volume.",
  },
  {
    title: "Inconsistent Branding",
    detail: "Fragmented social & search presence that weakens guest trust and lowers perceived value.",
  },
  {
    title: "Weak Guest Engagement",
    detail: "No automated direct re-booking system, leaving guest lifetime value unrealized.",
  },
  {
    title: "Heavy OTA Dependence",
    detail: "Losing 18% to 25% of top-line room revenue every month to third-party commissions.",
  },
];

const solutions: ComparisonItem[] = [
  {
    title: "Higher Visibility",
    detail: "Targeted performance marketing and local SEO capturing active high-intent travelers.",
  },
  {
    title: "Stronger Brand Presence",
    detail: "Cohesive visual identity and premium storytelling that justifies higher Average Daily Rates.",
  },
  {
    title: "More Direct Bookings",
    detail: "High-converting, frictionless booking funnel driving direct commission-free reservations.",
  },
  {
    title: "Long-Term Brand Value",
    detail: "Sustainable guest loyalty loops and compounding direct revenue asset for your property.",
  },
];

// ─── Motion Variants ──────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut", delay },
  }),
};

const cardSlideLeft: Variants = {
  hidden: { opacity: 0, x: -32, y: 16 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" },
  },
};

const cardSlideRight: Variants = {
  hidden: { opacity: 0, x: 32, y: 16 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut", delay: 0.1 },
  },
};

const staggerList: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const listItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function HomeServices() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-80px" });

  return (
    <section 
      className="relative py-16 sm:py-20 md:py-24 bg-gradient-to-b from-white via-primary-50/30 to-white dark:from-[#050b14] dark:via-[#091322] dark:to-[#050b14] overflow-hidden"
      id="challenges-solution"
    >
      {/* ── Ambient Background Lighting ── */}
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-6xl h-[450px] bg-gradient-to-r from-red-500/5 via-primary-500/10 to-secondary-500/10 rounded-full blur-[140px] pointer-events-none -z-10" 
      />

      <div className="container relative z-10 mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* ── Section Header ── */}
        <motion.div
          ref={headerRef}
          initial="hidden"
          animate={headerInView ? "visible" : "hidden"}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 md:mb-20"
        >
          {/* Eyebrow Pill */}
          <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-100/70 dark:bg-primary-950/80 border border-primary-200 dark:border-primary-800/80 text-primary-700 dark:text-primary-300 text-xs font-medium uppercase tracking-wider mb-5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-secondary-500" />
            <span>Hospitality Transformation</span>
          </motion.div>

          {/* Main Title */}
          <motion.h2 
            variants={fadeUp} 
            custom={0.1}
            className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold sm:font-bold md:font-bold text-gray-900 dark:text-white tracking-tight leading-[1.15]"
          >
            <span className="text-gray-900 dark:text-white">From Hotel Challenges </span>
            <span className="text-primary-600 dark:text-primary-400">To </span>
            <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-500 via-secondary-400 to-primary-500">
              Hospitality Growth
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            custom={0.2}
            className="mt-4 sm:mt-6 text-sm xs:text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto font-normal"
          >
            Most hospitality brands struggle not because the property lacks potential, but because the{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              digital ecosystem around the brand is incomplete.
            </span>
          </motion.p>
        </motion.div>

        {/* ── Comparison Cards Grid ── */}
        <div ref={gridRef} className="relative max-w-6xl mx-auto">
          
          {/* Central Floating Transformation Pill (Desktop Only) */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-xl shadow-black/5 dark:shadow-black/40 text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-200 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>Shift</span>
              <ArrowRight className="w-3.5 h-3.5 text-primary-500" />
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            
            {/* ══════════════════════════════════════════════════════════
                CARD 1: THE PROBLEM
            ══════════════════════════════════════════════════════════ */}
            <motion.div
              variants={cardSlideLeft}
              initial="hidden"
              animate={gridInView ? "visible" : "hidden"}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="relative flex flex-col justify-between rounded-2xl xs:rounded-3xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl border border-red-500/20 dark:border-red-500/25 p-4 xs:p-6 sm:p-7 md:p-8 lg:p-10 shadow-xl shadow-red-500/5 dark:shadow-red-950/20 overflow-hidden"
            >
              {/* Subtle Red Top Gradient Accent */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between flex-wrap xs:flex-nowrap gap-2 xs:gap-4 mb-5 xs:mb-6">
                  <div className="inline-flex items-center gap-2 px-2.5 xs:px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-400 text-xs font-semibold uppercase tracking-wider">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>The Problem</span>
                  </div>
                  <span className="text-[10px] xs:text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                    Common Bottlenecks
                  </span>
                </div>

                {/* Card Title */}
                <h3 className="text-xl xs:text-2xl sm:text-3xl font-semibold sm:font-bold text-gray-900 dark:text-white tracking-tight mb-2 xs:mb-3">
                  Where Revenue Leaks Occur
                </h3>
                <p className="text-xs xs:text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 leading-relaxed">
                  Traditional property management without aggressive direct marketing leads to low margins and reliance on middle-men.
                </p>

                {/* Challenges List */}
                <motion.div 
                  variants={staggerList}
                  initial="hidden"
                  animate={gridInView ? "visible" : "hidden"}
                  className="space-y-3 xs:space-y-4 sm:space-y-5"
                >
                  {challenges.map((item, idx) => (
                    <motion.div 
                      key={idx}
                      variants={listItem}
                      className="group flex items-start gap-3 xs:gap-3.5 sm:gap-4 p-3 xs:p-3.5 sm:p-4 rounded-xl xs:rounded-2xl bg-red-50/40 dark:bg-red-950/20 border border-red-100/80 dark:border-red-900/30 transition-colors duration-200 hover:bg-red-50/80 dark:hover:bg-red-950/40"
                    >
                      <div className="mt-0.5 shrink-0 rounded-full p-1 bg-red-100 dark:bg-red-900/40 text-red-500 dark:text-red-400">
                        <XCircle className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs xs:text-sm sm:text-base font-semibold text-gray-900 dark:text-white tracking-tight leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-[11px] xs:text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5 leading-relaxed">
                          {item.detail}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Bottom Insight Footer */}
              <div className="mt-8 pt-5 border-t border-red-100 dark:border-red-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 text-xs text-red-600 dark:text-red-400 font-medium">
                <span>Direct Booking Ratio: ~12% – 18%</span>
                <span className="opacity-80">Margin Lost to OTAs: Up to 25%</span>
              </div>
            </motion.div>

            {/* ══════════════════════════════════════════════════════════
                CARD 2: THE SOLUTION
            ══════════════════════════════════════════════════════════ */}
            <motion.div
              variants={cardSlideRight}
              initial="hidden"
              animate={gridInView ? "visible" : "hidden"}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="relative flex flex-col justify-between rounded-2xl xs:rounded-3xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border-2 border-primary-500/40 dark:border-primary-500/40 p-4 xs:p-6 sm:p-7 md:p-8 lg:p-10 shadow-2xl shadow-primary-500/10 dark:shadow-primary-950/30 overflow-hidden"
            >
              {/* Vibrant Green Top Gradient Accent */}
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary-400 via-primary-500 to-secondary-500" />

              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between flex-wrap xs:flex-nowrap gap-2 xs:gap-4 mb-5 xs:mb-6">
                  <div className="inline-flex items-center gap-2 px-2.5 xs:px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/70 border border-primary-200 dark:border-primary-800/70 text-primary-700 dark:text-primary-300 text-xs font-semibold uppercase tracking-wider">
                    <TrendingUp className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                    <span>The Solution</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[10px] xs:text-[11px] font-medium text-primary-600 dark:text-primary-400 uppercase tracking-widest bg-primary-100/60 dark:bg-primary-950/50 px-2.5 py-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    NearGrow System
                  </span>
                </div>

                {/* Card Title */}
                <h3 className="text-xl xs:text-2xl sm:text-3xl font-semibold sm:font-bold text-gray-900 dark:text-white tracking-tight mb-2 xs:mb-3">
                  Predictable, Compounding Growth
                </h3>
                <p className="text-xs xs:text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 leading-relaxed">
                  A high-velocity hospitality growth engine that converts targeted online attention into profitable, direct reservations.
                </p>

                {/* Solutions List */}
                <motion.div 
                  variants={staggerList}
                  initial="hidden"
                  animate={gridInView ? "visible" : "hidden"}
                  className="space-y-3 xs:space-y-4 sm:space-y-5"
                >
                  {solutions.map((item, idx) => (
                    <motion.div 
                      key={idx}
                      variants={listItem}
                      className="group flex items-start gap-3 xs:gap-3.5 sm:gap-4 p-3 xs:p-3.5 sm:p-4 rounded-xl xs:rounded-2xl bg-primary-50/50 dark:bg-primary-950/30 border border-primary-200/60 dark:border-primary-800/40 transition-colors duration-200 hover:bg-primary-50 dark:hover:bg-primary-950/60"
                    >
                      <div className="mt-0.5 shrink-0 rounded-full p-1 bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400">
                        <CheckCircle2 className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs xs:text-sm sm:text-base font-semibold text-gray-900 dark:text-white tracking-tight leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-[11px] xs:text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-0.5 leading-relaxed">
                          {item.detail}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Bottom Insight Footer */}
              <div className="mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-primary-100 dark:border-primary-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 text-xs text-primary-700 dark:text-primary-300 font-medium">
                <span>Direct Booking Ratio: 45%+ Achieved</span>
                <span className="text-secondary-600 dark:text-secondary-400">100% Commission-Free Revenue</span>
              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </section>
  );
}
