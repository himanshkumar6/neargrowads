"use client";
/* eslint-disable @typescript-eslint/no-unused-vars, @next/next/no-img-element */

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  ArrowRight, 
  ChevronRight, 
  Maximize2, 
  X, 
  BarChart3, 
  Target, 
  Globe, 
  Share2, 
  Gift,
  Zap,
  Star
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";


if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* --- Verified Proof Gallery Data (2 Authentic Reports) --- */
const proofItems = [
  {
    id: 1,
    title: "Social Media Campaign Impressions Report",
    category: "SOCIAL MEDIA REVIVAL & AESTHETIC STORYTELLING",
    value: "13,898,324 Views",
    image: "/case-studies/villasita-13.89m-views.png",
    description: "Verified Meta Ads & Content Analytics dashboard confirming 13,898,324 total views generated across the reporting period."
  },
  {
    id: 2,
    title: "Total Revenue Growth Report",
    category: "REVENUE MANAGEMENT & OTA OPTIMIZATION",
    value: "INR 2,785,447.11",
    image: "/case-studies/villasita-total-revenue-chart.jpg",
    description: "Verified Property Direct Revenue report confirming a revenue surge to INR 2,785,447.11 vs baseline (INR 327,690.20)."
  }
];

/* --- GSAP Counter Component --- */
function GSAPCounter({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const countRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!countRef.current || !containerRef.current) return;

    const counterObj = { val: 0 };
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    gsap.to(counterObj, {
      val: value,
      duration: prefersReduced ? 0 : 2.0,
      ease: "power2.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 90%",
        toggleActions: "play none none reset",
        onLeaveBack: () => {
          counterObj.val = 0;
          if (countRef.current) countRef.current.textContent = "0";
        }
      },
      onUpdate: () => {
        if (countRef.current) {
          countRef.current.textContent = Math.floor(counterObj.val).toLocaleString();
        }
      }
    });
  }, { scope: containerRef, dependencies: [value] });

  return (
    <div ref={containerRef} className="tabular-nums">
      <span>{prefix}</span>
      <span ref={countRef}>0</span>
      <span>{suffix}</span>
    </div>
  );
}

export default function VillasitaCaseStudyClient() {
  const [selectedProof, setSelectedProof] = useState<typeof proofItems[0] | null>(null);
  const [copied, setCopied] = useState(false);

  const copyText = `From the Ground Up to Approximately ₹1 Crore in Online Revenue

Villasita Resort, Haridwar partnered with NearGrow Ads to build its digital growth system from the ground up. Our mandate extended beyond social media or advertising: we connected brand storytelling, local search, booking-engine optimisation and paid acquisition into one commercial strategy.

NearGrow Ads developed the content and channel plan, strengthened the Google Business Profile, improved website and local search visibility, managed OTA rates and inventory, and ran Meta and Google campaigns around booking intent. This integrated model helped the property move from approximately ₹20,000 to ₹30,000 in monthly online revenue to peak months of nearly ₹15 lakh, with about ₹1 crore generated through OTAs and the booking engine over 12 months.

Alongside the revenue growth, the resort recorded 13.89 million Meta views, more than 2 lakh Google profile views, over 25,000 profile interactions and a 4.8-star Google rating. Performance campaigns delivered up to 10x ROAS. The case demonstrates how a business can scale faster when visibility, reputation, distribution and marketing execution are planned as one connected growth engine.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#050b14] text-gray-900 dark:text-white selection:bg-secondary-500 selection:text-white overflow-x-hidden">
      {/* ── BREADCRUMBS BAR ── */}
      <div className="pt-28 md:pt-32 pb-4 bg-gray-50/50 dark:bg-gray-950/40 border-b border-gray-200/60 dark:border-gray-800/60">
        <div className="container mx-auto px-3 xs:px-4 md:px-8 max-w-7xl">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 xs:gap-2 text-[11px] xs:text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Home</Link>
            <ChevronRight size={13} className="shrink-0 text-gray-400" />
            <Link href="/case-studies" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Case Studies</Link>
            <ChevronRight size={13} className="shrink-0 text-gray-400" />
            <span className="text-gray-900 dark:text-white font-semibold truncate">Villasita Resort, Haridwar</span>
          </nav>
        </div>
      </div>

      {/* ── HERO SECTION ── */}
      <section className="relative pt-8 xs:pt-10 pb-8 xs:pb-10 md:pt-14 md:pb-12 overflow-hidden bg-linear-to-b from-gray-50 via-white to-white dark:from-[#050b14] dark:via-[#071120] dark:to-[#050b14]">
        {/* Subtle Ambient Backdrop Glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[90vw] max-w-6xl h-96 bg-primary-500/10 dark:bg-primary-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="container mx-auto px-3 xs:px-4 md:px-8 max-w-7xl space-y-6 xs:space-y-8">
          <div className="max-w-4xl space-y-3 xs:space-y-5">
            <div className="inline-flex items-center gap-1.5 xs:gap-2 px-3 xs:px-3.5 py-1 xs:py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/80 border border-primary-200 dark:border-primary-800/60 text-primary-700 dark:text-primary-300 text-[10px] xs:text-xs sm:text-sm font-medium uppercase tracking-widest">
              <Sparkles size={13} className="text-secondary-500" />
              <span>HOSPITALITY GROWTH CASE STUDY</span>
            </div>

            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.15]">
              <span className="text-primary-600 dark:text-primary-400">Villasita Resort</span>
              <span className="text-secondary-600 dark:text-secondary-400">, Haridwar</span>
            </h1>

            <div className="text-lg xs:text-xl sm:text-2xl font-semibold sm:font-bold text-primary-600 dark:text-primary-400 tracking-tight leading-snug">
              From the Ground Up to a Scalable Digital Revenue Engine
            </div>

            <p className="text-sm xs:text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-normal max-w-3xl">
              How NearGrow Ads connected social media, local search, performance marketing, and creative execution into one integrated growth system.
            </p>
          </div>

          {/* SPACIOUS EXECUTIVE 2-TIER KPI GRID (Zero Cramping & Ample Text Space) */}
          <div className="space-y-3 xs:space-y-4 pt-2 xs:pt-4">
            {/* Top Tier: Primary Commercial & Revenue Metrics (4 Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-5">
              {[
                { label: "Approx. ₹1 Cr", sub: "ONLINE REVENUE IN 12 MONTHS", color: "from-primary-500/15 via-primary-500/5 to-transparent border-primary-500/30" },
                { label: "Up to ₹15 Lakh", sub: "PEAK MONTHLY ONLINE REVENUE", color: "from-teal-500/15 via-teal-500/5 to-transparent border-teal-500/30" },
                { label: "Up to 10x", sub: "RETURN ON AD SPEND", color: "from-secondary-500/15 via-secondary-500/5 to-transparent border-secondary-500/30" },
                { label: "13.89 Million", sub: "META VIEWS IN REPORTING PERIOD", color: "from-blue-500/15 via-blue-500/5 to-transparent border-blue-500/30" },
              ].map((kpi, idx) => (
                <div 
                  key={idx}
                  className={`p-4 xs:p-6 sm:p-7 rounded-xl xs:rounded-2xl sm:rounded-3xl bg-linear-to-br ${kpi.color} bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-md hover:shadow-lg transition-transform duration-300 ease-out hover:scale-[1.02] flex flex-col justify-between contain-content`}
                >
                  <div className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white tracking-tight leading-none">
                    {kpi.label}
                  </div>
                  <div className="mt-3 xs:mt-4 pt-2.5 xs:pt-3 border-t border-gray-100 dark:border-gray-800/80">
                    <div className="text-[11px] xs:text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider leading-relaxed">{kpi.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Tier: Search, Trust & Reputation Metrics (3 Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-5">
              {[
                { label: "2 Lakh+", isSplitRating: false, sub: "GOOGLE PROFILE VIEWS", color: "from-purple-500/15 via-purple-500/5 to-transparent border-purple-500/30" },
                { label: "25,000+", isSplitRating: false, sub: "GOOGLE PROFILE INTERACTIONS", color: "from-emerald-500/15 via-emerald-500/5 to-transparent border-emerald-500/30" },
                { label: "4.8 / 4.9 STAR", isSplitRating: true, sub: "GOOGLE & TRIPADVISOR", note: "Supported by actively optimised Google Business and TripAdvisor profiles", color: "from-amber-500/15 via-amber-500/5 to-transparent border-amber-500/30" },
              ].map((kpi, idx) => (
                <div 
                  key={idx}
                  className={`p-4 xs:p-6 sm:p-7 rounded-xl xs:rounded-2xl sm:rounded-3xl bg-linear-to-br ${kpi.color} bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-md hover:shadow-lg transition-transform duration-300 ease-out hover:scale-[1.02] flex flex-col justify-between contain-content`}
                >
                  {kpi.isSplitRating ? (
                    <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white tracking-tight leading-none">
                          4.8<Star className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 fill-amber-400 text-amber-400" />
                        </div>
                        <span className="text-[9px] xs:text-[10px] font-medium uppercase tracking-widest text-gray-500 dark:text-gray-400 mt-1.5 xs:mt-2">Google</span>
                      </div>
                      <div className="w-px h-10 xs:h-12 bg-gray-300 dark:bg-gray-700"></div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white tracking-tight leading-none">
                          4.9<Star className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 fill-amber-400 text-amber-400" />
                        </div>
                        <span className="text-[9px] xs:text-[10px] font-medium uppercase tracking-widest text-gray-500 dark:text-gray-400 mt-1.5 xs:mt-2">TripAdvisor</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white tracking-tight leading-none">
                      {kpi.label}
                    </div>
                  )}
                  <div className="mt-3 xs:mt-4 pt-2.5 xs:pt-3 border-t border-gray-100 dark:border-gray-800/80">
                    <div className="text-[11px] xs:text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider leading-relaxed">{kpi.sub}</div>
                    {kpi.note && <div className="text-[10px] xs:text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-snug font-normal">{kpi.note}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 text-[10px] xs:text-xs font-bold text-gray-400 uppercase tracking-widest">
            NEARGROW ADS &nbsp;|&nbsp; LOCAL BUSINESS & HOSPITALITY GROWTH
          </div>
        </div>
      </section>

      {/* ── THE GROWTH STORY & CLIENT OVERVIEW ── */}
      <section className="py-8 xs:py-10 md:py-12 border-y border-gray-200/80 dark:border-gray-800/80 bg-gray-50/50 dark:bg-[#07101e]">
        <div className="container mx-auto px-3 xs:px-4 md:px-8 max-w-7xl space-y-8 xs:space-y-12">
          <div className="max-w-3xl space-y-2 xs:space-y-3">
            <span className="text-[10px] xs:text-xs font-medium uppercase tracking-widest text-secondary-600 dark:text-secondary-400">
              THE GROWTH STORY
            </span>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-semibold sm:font-bold text-gray-900 dark:text-white tracking-tight">
              Built from the Ground Up
            </h2>
            <p className="text-sm xs:text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
              Villasita Resort partnered with NearGrow Ads at an early stage of its digital journey. Rather than treating social media, advertising, search and revenue management as separate activities, we designed one connected commercial system - built to improve discovery, strengthen trust and convert demand into measurable room revenue.
            </p>
          </div>

          {/* EXECUTIVE PROPERTY BASELINE GRID (Spacious 3-Column Layout with Zero Cramping) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-5">
            <div className="p-4 xs:p-6 rounded-xl xs:rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-md flex flex-col justify-between space-y-2 xs:space-y-3">
              <span className="text-[10px] xs:text-xs font-medium uppercase tracking-wider text-primary-600 dark:text-primary-400">PROPERTY</span>
              <p className="text-base xs:text-lg sm:text-xl font-bold leading-snug">
                <span className="text-primary-600 dark:text-primary-400">Villasita Resort</span>
                <span className="text-secondary-600 dark:text-secondary-400">, Haridwar</span>
              </p>
            </div>

            <div className="p-4 xs:p-6 rounded-xl xs:rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-md flex flex-col justify-between space-y-2 xs:space-y-3">
              <span className="text-[10px] xs:text-xs font-medium uppercase tracking-wider text-primary-600 dark:text-primary-400">ENGAGEMENT</span>
              <p className="text-xs xs:text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 leading-snug">360-degree digital marketing and revenue growth partnership</p>
            </div>

            <div className="p-4 xs:p-6 rounded-xl xs:rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-md flex flex-col justify-between space-y-2 xs:space-y-3">
              <span className="text-[10px] xs:text-xs font-medium uppercase tracking-wider text-primary-600 dark:text-primary-400">PRIMARY OBJECTIVE</span>
              <p className="text-xs xs:text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 leading-snug">Create a visible, trusted and scalable online booking ecosystem</p>
            </div>

            <div className="p-4 xs:p-6 rounded-xl xs:rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-md flex flex-col justify-between space-y-2 xs:space-y-3 md:col-span-2 lg:col-span-2">
              <span className="text-[10px] xs:text-xs font-medium uppercase tracking-wider text-primary-600 dark:text-primary-400">STARTING POINT</span>
              <p className="text-xs xs:text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
                Digital channels built from the ground up; monthly online revenue of approximately <span className="font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-1.5 py-0.5 rounded border border-teal-200 dark:border-teal-800/80">₹20,000 to ₹30,000</span>
              </p>
            </div>

            <div className="p-4 xs:p-6 rounded-xl xs:rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-md flex flex-col justify-between space-y-2 xs:space-y-3 md:col-span-2 lg:col-span-1">
              <span className="text-[10px] xs:text-xs font-medium uppercase tracking-wider text-primary-600 dark:text-primary-400">CORE SERVICES</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {["Social Media Management", "Revenue Management", "Performance Marketing", "SEO & GEO"].map((service, i) => (
                  <span key={i} className="px-2 xs:px-2.5 py-0.5 xs:py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-[11px] xs:text-xs font-medium border border-gray-200 dark:border-gray-700 leading-tight">
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* THE GROWTH OPPORTUNITY TEXT */}
          <div className="p-4 xs:p-6 sm:p-8 md:p-10 rounded-2xl xs:rounded-3xl bg-white dark:bg-gray-900/90 border border-gray-200/80 dark:border-gray-800 shadow-xl space-y-4 xs:space-y-6">
            <h3 className="text-xl xs:text-2xl sm:text-3xl font-bold">
              <span className="text-primary-600 dark:text-primary-400">The Growth </span>
              <span className="text-secondary-600 dark:text-secondary-400">Opportunity</span>
            </h3>
            <p className="text-sm xs:text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
              The opportunity was to turn an early-stage online presence into a complete hospitality growth engine. That meant building consistent brand communication, improving local search visibility, strengthening the resort&apos;s Google profile, actively managing OTAs and the booking engine, and using paid media to capture high-intent demand. Every channel was aligned to a single outcome: more qualified discovery, stronger booking confidence and higher online revenue.
            </p>
            <blockquote className="p-3.5 xs:p-5 rounded-xl xs:rounded-2xl bg-primary-50/80 dark:bg-primary-950/80 border-l-4 border-primary-600 dark:border-primary-400 text-gray-900 dark:text-white font-medium italic text-sm xs:text-base sm:text-lg">
              Our mandate: connect awareness, discoverability, pricing, distribution and paid demand into one measurable growth system.
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── OUR 360-DEGREE GROWTH SYSTEM ── */}
      <section className="py-10 xs:py-12 md:py-16 bg-linear-to-b from-gray-50 via-white to-gray-50 dark:from-[#07101e] dark:via-[#050b14] dark:to-[#07101e] border-b border-gray-200/80 dark:border-gray-800/80 relative overflow-hidden">
        <div className="container mx-auto px-3 xs:px-4 md:px-8 max-w-7xl space-y-10 xs:space-y-16 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-3 xs:space-y-4">
            <span className="inline-flex items-center gap-1.5 xs:gap-2 px-3 xs:px-4 py-1 xs:py-1.5 rounded-full bg-secondary-50 dark:bg-secondary-950/80 border border-secondary-200 dark:border-secondary-800/60 text-secondary-700 dark:text-secondary-300 text-[10px] xs:text-xs font-medium uppercase tracking-widest">
              <Sparkles size={13} className="text-secondary-500" />
              <span>Core Operational Pillars</span>
            </span>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="text-primary-600 dark:text-primary-400">Our 360-Degree </span>
              <span className="text-secondary-600 dark:text-secondary-400">Growth System</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 xs:gap-8 lg:gap-10">
            {[
              {
                number: "01",
                icon: Share2,
                title: "Social Media Management",
                subtitle: "SOCIAL MEDIA REVIVAL & AESTHETIC STORYTELLING",
                gradient: "from-blue-500/20 via-cyan-500/10 to-transparent border-blue-500/30",
                iconBg: "bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-blue-500/25",
                badgeColor: "bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
                description: "Built a consistent hospitality content engine across brand, destination and offer-led communication. Reels, posts and campaigns were planned around seasonal demand, guest intent and the resort experience.",
                analyticsImage: "/case-studies/villasita-13.89m-views.png",
                analyticsTitle: "13,898,324 Views",
                stat: "13.89M",
                statLabel: "Meta Views"
              },
              {
                number: "02",
                icon: BarChart3,
                title: "Revenue Management",
                subtitle: "REVENUE MANAGEMENT & OTA OPTIMIZATION",
                gradient: "from-teal-500/20 via-emerald-500/10 to-transparent border-teal-500/30",
                iconBg: "bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-teal-500/25",
                badgeColor: "bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800",
                description: "Managed OTA visibility, inventory, rates, parity, promotions and booking-engine performance. Continuous optimisation connected market demand with the right price, package and availability.",
                analyticsImage: "/case-studies/villasita-total-revenue-chart.jpg",
                analyticsTitle: "INR 2,785,447.11 Revenue",
                stat: "Up to ₹15L",
                statLabel: "Peak Revenue"
              },
              {
                number: "03",
                icon: Target,
                title: "Performance Marketing",
                subtitle: "HIGH-ROAS PAID CAMPAIGN ENGINE",
                gradient: "from-purple-500/20 via-pink-500/10 to-transparent border-purple-500/30",
                iconBg: "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-purple-500/25",
                badgeColor: "bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
                description: "Ran Meta and Google campaigns using geo-targeting, audience segmentation, retargeting and creative testing. Campaigns were evaluated against booking value and attributed revenue - not reach alone.",
                stat: "10x",
                statLabel: "ROAS"
              },
              {
                number: "04",
                icon: Globe,
                title: "SEO & GEO",
                subtitle: "SEARCH & AI-ASSISTED DISCOVERY",
                gradient: "from-amber-500/20 via-orange-500/10 to-transparent border-amber-500/30",
                iconBg: "bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-amber-500/25",
                badgeColor: "bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
                description: "Optimised the website and Google Business Profile for high-intent local searches, supported by keyword-led content, review management and consistent brand information for search and AI-assisted discovery.",
                stat: "4.8★",
                statLabel: "Google Rating"
              }
            ].map((pillar, idx) => (
              <div 
                key={idx} 
                className={`p-4 xs:p-6 sm:p-8 md:p-10 rounded-2xl xs:rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800/80 shadow-md hover:shadow-lg transition-transform duration-300 ease-out flex flex-col justify-between group relative contain-content`}
              >
                <div className="absolute top-3 right-3 xs:top-4 xs:right-4 sm:top-6 sm:right-6 text-6xl xs:text-7xl sm:text-8xl font-bold text-gray-100 dark:text-gray-800/40 pointer-events-none select-none z-0 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3 origin-top-right">
                  {pillar.number}
                </div>

                <div className="space-y-4 xs:space-y-5 relative z-10">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 xs:gap-4">
                    <div className={`w-12 h-12 xs:w-14 xs:h-14 shrink-0 rounded-xl xs:rounded-2xl ${pillar.iconBg} flex items-center justify-center shadow-lg relative z-10`}>
                      <pillar.icon size={22} className="xs:w-[26px] xs:h-[26px]" />
                    </div>
                    <div className="relative z-10 max-w-full">
                      <span className={`inline-block px-2.5 xs:px-3 py-0.5 xs:py-1 rounded-full text-[9px] xs:text-[10px] sm:text-xs font-medium uppercase tracking-wider border ${pillar.badgeColor} leading-relaxed break-words max-w-full`}>
                        {pillar.subtitle}
                      </span>
                    </div>
                  </div>

                  <div className="min-h-0 sm:min-h-[64px] flex items-center">
                    <h3 className="text-xl xs:text-2xl sm:text-3xl font-semibold sm:font-bold text-gray-900 dark:text-white tracking-tight">
                      {pillar.title}
                    </h3>
                  </div>

                  <div className="min-h-0 sm:min-h-[130px] flex items-start">
                    <p className="text-xs xs:text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
                      {pillar.description}
                    </p>
                  </div>

                  {/* Authentic Verified Analytics Dashboard Preview */}
                  {pillar.analyticsImage && (
                    <div 
                      onClick={() => setSelectedProof(pillar.number === "01" ? proofItems[0] : proofItems[1])}
                      className="my-2 xs:my-3 rounded-xl xs:rounded-2xl overflow-hidden border border-teal-500/30 dark:border-teal-500/40 bg-gray-50 dark:bg-gray-950 p-2 xs:p-2.5 shadow-md relative group/img cursor-pointer transition-colors duration-300 hover:border-teal-500 dark:hover:border-teal-400"
                    >
                      <div className="flex items-center justify-between px-2 xs:px-3 py-1.5 xs:py-2 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/90 rounded-t-lg xs:rounded-t-xl mb-1.5 xs:mb-2 text-[10px] xs:text-[11px] font-medium overflow-hidden gap-2">
                        <span className="uppercase tracking-widest text-[9px] xs:text-[10px] text-teal-700 dark:text-teal-400 truncate flex-1">
                          {pillar.subtitle}
                        </span>
                        <div className="flex items-center gap-1 text-teal-700 dark:text-teal-400 font-semibold text-[9px] xs:text-[10px] sm:text-xs shrink-0">
                          <span>{pillar.analyticsTitle}</span>
                          <Maximize2 size={11} className="shrink-0" />
                        </div>
                      </div>

                      <div className="relative aspect-video w-full rounded-lg xs:rounded-xl overflow-hidden bg-white shadow-inner">
                        <Image
                          src={pillar.analyticsImage}
                          alt={`${pillar.title} Verified Screenshot`}
                          fill
                          className="object-contain group-hover/img:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 xs:mt-8 pt-4 xs:pt-6 border-t border-gray-100 dark:border-gray-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 xs:gap-3 sm:gap-0">
                  <div className="text-[10px] xs:text-[11px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Key Pillar Metric</div>
                  <div className="flex items-baseline gap-1.5 xs:gap-2 flex-wrap sm:flex-nowrap">
                    <span className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white whitespace-nowrap">{pillar.stat}</span>
                    <span className="text-[9px] xs:text-[10px] sm:text-xs font-medium text-teal-600 dark:text-teal-400 uppercase tracking-wider whitespace-nowrap">{pillar.statLabel}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXECUTION & RESULTS ── */}
      <section className="py-10 xs:py-12 md:py-16 bg-white dark:bg-[#050b14]">
        <div className="container mx-auto px-3 xs:px-4 md:px-8 max-w-7xl space-y-8 xs:space-y-12">
          <div className="space-y-3 xs:space-y-4 max-w-3xl">
            <span className="text-[10px] xs:text-xs font-medium uppercase tracking-widest text-primary-600 dark:text-primary-400">
              EXECUTION & RESULTS
            </span>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-semibold sm:font-bold md:font-bold tracking-tight text-gray-900 dark:text-white">
              Results That Mattered
            </h2>
            <p className="text-sm xs:text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
              The engagement was measured across commercial performance, paid media efficiency, brand visibility, local discovery and trust. The strongest outcome was not a single campaign spike; it was the creation of a repeatable online revenue system.
            </p>
          </div>

          {/* EXACT DOCX RESULTS TABLE - HYBRID RESPONSIVE */}
          <div className="rounded-2xl xs:rounded-3xl border sm:border border-transparent sm:border-gray-200/80 dark:sm:border-gray-800 sm:shadow-2xl sm:overflow-hidden bg-transparent sm:bg-white dark:sm:bg-[#050b14]">
            {/* Mobile View: Cards */}
            <div className="grid grid-cols-1 gap-3 xs:gap-4 sm:hidden">
              {[
                {
                  area: "Online revenue",
                  result: "Approx. ₹1 crore in 12 months",
                  impact: (
                    <span>
                      Established OTAs and the booking engine as a meaningful, scalable revenue channel generating <strong className="font-bold text-teal-600 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/70 px-1.5 py-0.5 rounded border border-teal-200 dark:border-teal-800/80">Approx. ₹1 Crore</strong>.
                    </span>
                  )
                },
                {
                  area: "Peak monthly revenue",
                  result: "Up to approx. ₹15 lakh",
                  impact: (
                    <span>
                      Scaled from an early monthly level of around <span className="font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">₹20,000 to ₹30,000</span> to peak months of <strong className="font-bold text-teal-600 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/70 px-1.5 py-0.5 rounded border border-teal-200 dark:border-teal-800/80">Up to ₹15 Lakh</strong> through active distribution, pricing and promotion management.
                    </span>
                  )
                },
                {
                  area: "Paid media",
                  result: "Up to 10x ROAS",
                  impact: (
                    <span>
                      Meta and Google investment was optimised toward direct booking revenue delivering <strong className="font-bold text-secondary-600 dark:text-secondary-300 bg-secondary-50 dark:bg-secondary-950/70 px-1.5 py-0.5 rounded border border-secondary-200 dark:border-secondary-800/80">Up to 10x ROAS</strong>.
                    </span>
                  )
                },
                {
                  area: "Social visibility",
                  result: "13.89M Meta views",
                  impact: (
                    <span>
                      Expanded brand discovery generating <strong className="font-bold text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/70 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800/80">13,898,324 Meta Views</strong> across the reporting period.
                    </span>
                  )
                },
                {
                  area: "Google visibility",
                  result: "2 lakh+ profile views",
                  impact: (
                    <span>
                      Improved local discovery driving <strong className="font-bold text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/70 px-1.5 py-0.5 rounded border border-purple-200 dark:border-purple-800/80">2 Lakh+ Profile Views</strong> among travellers searching with stay intent.
                    </span>
                  )
                },
                {
                  area: "Google actions",
                  result: "25,000+ interactions",
                  impact: (
                    <span>
                      Generated <strong className="font-bold text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/80">25,000+ Profile Interactions</strong> from the resort&apos;s optimised business profile.
                    </span>
                  )
                },
                {
                  area: "Trust & reputation",
                  result: "4.8★ Google / 4.9★ TA",
                  impact: (
                    <span>
                      Strengthened booking confidence through actively managed and optimised profiles maintaining <strong className="font-bold text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/70 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800/80">4.8★ Google & 4.9★ TA Ratings</strong>.
                    </span>
                  )
                }
              ].map((row, idx) => (
                <div key={idx} className="p-3.5 xs:p-5 rounded-xl xs:rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col gap-2 xs:gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] xs:text-xs font-medium uppercase tracking-widest text-gray-500 dark:text-gray-400">{row.area}</span>
                    <span className="px-2 xs:px-2.5 py-0.5 xs:py-1 rounded-lg bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-400 text-[9px] xs:text-[10px] font-semibold border border-teal-200/50 dark:border-teal-800/50 text-right shrink-0 max-w-[140px] leading-tight">{row.result}</span>
                  </div>
                  <div className="text-xs xs:text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
                    {row.impact}
                  </div>
                </div>
              ))}
            </div>

            {/* Tablet/Desktop View: Native Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-175">
              <thead>
                <tr className="bg-gray-100/90 dark:bg-gray-900 text-xs uppercase font-medium tracking-wider text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                  <th className="p-4 sm:p-6 sticky left-0 bg-gray-100 dark:bg-gray-900 z-10 w-1/4">AREA</th>
                  <th className="p-4 sm:p-6 text-teal-600 dark:text-teal-400 w-1/3">RESULT</th>
                  <th className="p-4 sm:p-6 w-5/12">BUSINESS IMPACT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-sm font-normal">
                {[
                  { 
                    area: "Online revenue", 
                    result: "Approx. ₹1 crore in 12 months", 
                    impact: (
                      <span>
                        Established OTAs and the booking engine as a meaningful, scalable revenue channel generating <strong className="font-bold text-teal-600 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/70 px-1.5 py-0.5 rounded border border-teal-200 dark:border-teal-800/80">Approx. ₹1 Crore</strong>.
                      </span>
                    ) 
                  },
                  { 
                    area: "Peak monthly revenue", 
                    result: "Up to approx. ₹15 lakh", 
                    impact: (
                      <span>
                        Scaled from an early monthly level of around <span className="font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">₹20,000 to ₹30,000</span> to peak months of <strong className="font-bold text-teal-600 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/70 px-1.5 py-0.5 rounded border border-teal-200 dark:border-teal-800/80">Up to ₹15 Lakh</strong> through active distribution, pricing and promotion management.
                      </span>
                    ) 
                  },
                  { 
                    area: "Paid media", 
                    result: "Up to 10x ROAS", 
                    impact: (
                      <span>
                        Meta and Google investment was optimised toward direct booking revenue delivering <strong className="font-bold text-secondary-600 dark:text-secondary-300 bg-secondary-50 dark:bg-secondary-950/70 px-1.5 py-0.5 rounded border border-secondary-200 dark:border-secondary-800/80">Up to 10x ROAS</strong>.
                      </span>
                    ) 
                  },
                  { 
                    area: "Social visibility", 
                    result: "13,898,324 Meta views", 
                    impact: (
                      <span>
                        Expanded brand discovery generating <strong className="font-bold text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/70 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800/80">13,898,324 Meta Views</strong> across the reporting period.
                      </span>
                    ) 
                  },
                  { 
                    area: "Google visibility", 
                    result: "2 lakh+ profile views", 
                    impact: (
                      <span>
                        Improved local discovery driving <strong className="font-bold text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/70 px-1.5 py-0.5 rounded border border-purple-200 dark:border-purple-800/80">2 Lakh+ Profile Views</strong> among travellers searching with stay intent.
                      </span>
                    ) 
                  },
                  { 
                    area: "Google actions", 
                    result: "25,000+ profile interactions", 
                    impact: (
                      <span>
                        Generated <strong className="font-bold text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/80">25,000+ Profile Interactions</strong> from the resort&apos;s optimised business profile.
                      </span>
                    ) 
                  },
                  { 
                    area: "Trust & reputation", 
                    result: "4.8★ Google / 4.9★ TA", 
                    impact: (
                      <span>
                        Strengthened booking confidence through actively managed and optimised profiles maintaining <strong className="font-bold text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/70 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800/80">4.8★ Google & 4.9★ TA Ratings</strong>.
                      </span>
                    ) 
                  }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/80 dark:hover:bg-gray-900/50 transition-colors">
                    <td className="p-4 sm:p-6 font-semibold text-gray-900 dark:text-white sticky left-0 bg-white dark:bg-[#050b14] z-10 border-r border-gray-100 dark:border-gray-800">
                      {row.area}
                    </td>
                    <td className="p-4 sm:p-6 font-semibold text-teal-600 dark:text-teal-400 bg-teal-50/20 dark:bg-teal-950/20">
                      {row.result}
                    </td>
                    <td className="p-4 sm:p-6 text-gray-700 dark:text-gray-300 font-normal leading-relaxed">
                      {row.impact}
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          </div>

          {/* DOCX COMMERCIAL EFFICIENCY NOTE */}
          <div className="p-4 xs:p-5 sm:p-6 rounded-xl xs:rounded-2xl bg-teal-50/80 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200 text-xs xs:text-sm sm:text-base font-normal flex items-start gap-2.5 xs:gap-3">
            <Zap size={18} className="text-teal-500 shrink-0 mt-0.5 xs:w-5 xs:h-5" />
            <span>
              Commercial efficiency: a <strong className="font-bold text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-900/60 px-1.5 py-0.5 rounded border border-teal-300 dark:border-teal-700">₹50,000 monthly OTA & revenue-management retainer</strong> supported an operation that reached peak online revenue of <strong className="font-bold text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-900/60 px-1.5 py-0.5 rounded border border-teal-300 dark:border-teal-700">approximately ₹15 Lakh in a month</strong>.
            </span>
          </div>
        </div>
      </section>

      {/* ── BUSINESS IMPACT (LIQUID GLASSMORPHISM) ── */}
      <section className="py-12 xs:py-16 md:py-24 bg-[#050b14] relative overflow-hidden border-y border-gray-800">
        {/* Animated Background Glowing Orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] bg-teal-600/30 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-[20%] right-[-10%] w-[60%] h-[70%] bg-primary-700/40 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] bg-secondary-600/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-3 xs:px-4 md:px-8 max-w-7xl space-y-10 xs:space-y-16 relative z-10">
          <div className="max-w-4xl space-y-3 xs:space-y-5">
            <span className="text-[10px] xs:text-xs font-medium uppercase tracking-widest text-teal-400">
              BUSINESS IMPACT
            </span>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold sm:font-bold md:font-bold tracking-tight leading-tight">
              <span className="text-primary-400">A Connected System,</span> 
              <br className="hidden sm:block" /> 
              <span className="text-secondary-400"> Not Isolated Campaigns</span>
            </h2>
            <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed font-normal pt-1 xs:pt-2">
              Villasita&apos;s growth came from treating <strong className="text-white font-semibold">brand, search, distribution, pricing and paid media</strong> as one commercial system. 
              <span className="inline-flex items-center px-1.5 xs:px-2 py-0.5 mx-1 xs:mx-1.5 rounded-md bg-purple-500/20 text-purple-300 font-medium border border-purple-500/30 text-xs xs:text-sm">Social content</span> created discovery. 
              <span className="inline-flex items-center px-1.5 xs:px-2 py-0.5 mx-1 xs:mx-1.5 rounded-md bg-amber-500/20 text-amber-300 font-medium border border-amber-500/30 text-xs xs:text-sm">Google & reputation signals</span> built trust. 
              <span className="inline-flex items-center px-1.5 xs:px-2 py-0.5 mx-1 xs:mx-1.5 rounded-md bg-teal-500/20 text-teal-300 font-medium border border-teal-500/30 text-xs xs:text-sm">Revenue management</span> converted demand through well-managed OTAs and the booking engine. 
              <span className="inline-flex items-center px-1.5 xs:px-2 py-0.5 mx-1 xs:mx-1.5 rounded-md bg-blue-500/20 text-blue-300 font-medium border border-blue-500/30 text-xs xs:text-sm">Performance marketing</span> accelerated high-intent traffic. 
              <br/><br/>
              Together, the channels supported a stronger and more measurable booking journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 xs:gap-8 pt-2 xs:pt-4">
            {[
              { number: "01", title1: "Revenue-First ", title2: "Thinking", text: "Decisions were linked to room revenue, channel performance and booking intent." },
              { number: "02", title1: "One Integrated ", title2: "Partner", text: "Social, search, paid media and revenue management operated under one coordinated plan." },
              { number: "03", title1: "Continuous ", title2: "Optimisation", text: "Rates, inventory, content, creatives and campaigns were refined continuously." }
            ].map((pillar, idx) => (
              <div 
                key={idx} 
                className="p-5 xs:p-8 sm:p-10 rounded-2xl xs:rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_16px_40px_rgba(0,0,0,0.5)] space-y-4 xs:space-y-5 relative hover:-translate-y-2 transition-transform duration-500 ease-out group contain-content"
              >
                <div aria-hidden="true" className="absolute -top-6 -right-4 xs:-top-8 xs:-right-6 p-6 xs:p-8 text-6xl xs:text-7xl sm:text-8xl md:text-9xl font-bold text-white/4 pointer-events-none transition-all duration-700 group-hover:scale-110 group-hover:text-white/8 group-hover:-rotate-3">
                  {pillar.number}
                </div>
                <span className="block text-2xl xs:text-3xl sm:text-5xl font-bold md:font-extrabold bg-linear-to-br from-teal-400 to-secondary-500 bg-clip-text text-transparent drop-shadow-md relative z-10">{pillar.number}</span>
                <h3 className="text-lg xs:text-xl sm:text-3xl font-semibold sm:font-bold tracking-tight relative z-10 leading-snug pr-6 xs:pr-8">
                  <span className="text-primary-400">{pillar.title1}</span>
                  <span className="text-secondary-400">{pillar.title2}</span>
                </h3>
                <p className="text-xs xs:text-sm sm:text-base font-normal text-gray-300 leading-relaxed relative z-10">{pillar.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROOF OF IMPACT LIGHTBOX GALLERY ── */}
      <section className="py-10 xs:py-12 md:py-16 bg-white dark:bg-[#050b14]">
        <div className="container mx-auto px-3 xs:px-4 md:px-8 max-w-7xl space-y-8 xs:space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3 xs:space-y-4">
            <span className="text-[10px] xs:text-xs font-medium uppercase tracking-widest text-secondary-600 dark:text-secondary-400">
              Verified Proof
            </span>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-semibold sm:font-bold md:font-bold tracking-tight text-gray-900 dark:text-white">
              Proof of Impact Gallery
            </h2>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Meta Insights snapshot: 13,898,324 views in the selected reporting period. Source: platform screenshot supplied for the engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 xs:gap-8 lg:gap-10">
            {proofItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedProof(item)}
                className="group cursor-pointer rounded-xl xs:rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-gray-200 dark:bg-gray-800">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Maximize2 size={24} />
                  </div>
                </div>
                <div className="p-4 xs:p-5 space-y-1.5 xs:space-y-2">
                  <span className="text-[9px] xs:text-[10px] font-medium text-primary-600 dark:text-primary-400 uppercase tracking-widest">{item.category}</span>
                  <h3 className="text-sm xs:text-base font-semibold text-gray-900 dark:text-white line-clamp-1">{item.title}</h3>
                  <div className="text-base xs:text-lg font-bold text-teal-600 dark:text-teal-400">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedProof && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl p-3 xs:p-4 sm:p-6 flex items-center justify-center overflow-hidden"
            onClick={() => setSelectedProof(null)}
          >
            <motion.div 
              initial={{ scale: 0.96, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-2xl sm:max-w-3xl w-full rounded-2xl sm:rounded-3xl bg-white dark:bg-[#09111e] border border-gray-200 dark:border-gray-800 p-3.5 xs:p-4 sm:p-6 space-y-3.5 shadow-2xl my-auto overflow-hidden max-h-[90vh] flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Top Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-gray-200 dark:border-gray-800/80 shrink-0">
                <span className="text-[10px] xs:text-[11px] font-medium uppercase tracking-widest text-teal-600 dark:text-teal-400">
                  {selectedProof.category}
                </span>
                <button
                  onClick={() => setSelectedProof(null)}
                  className="w-10 h-10 xs:w-11 xs:h-11 shrink-0 rounded-full bg-gray-100 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close proof detail"
                >
                  <X size={18} className="xs:w-5 xs:h-5" />
                </button>
              </div>

              {/* Compact Auto-Fitting Image Surface */}
              <div className="w-full rounded-xl bg-white p-1.5 border border-gray-200 dark:border-gray-800 flex items-center justify-center shadow-inner overflow-hidden max-h-[48vh] shrink">
                <img
                  src={selectedProof.image}
                  alt={selectedProof.title}
                  className="w-full h-auto max-h-[45vh] object-contain rounded-lg"
                />
              </div>

              {/* Modal Details Footer */}
              <div className="space-y-1.5 shrink-0 pt-0.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
                    {selectedProof.title}
                  </h3>
                  <div className="px-2.5 xs:px-3 py-0.5 rounded-full bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/30 text-teal-700 dark:text-teal-300 text-xs sm:text-sm font-semibold w-fit shrink-0">
                    {selectedProof.value}
                  </div>
                </div>
                <p className="text-[11px] xs:text-xs text-gray-600 dark:text-gray-400 font-normal leading-relaxed line-clamp-2">
                  {selectedProof.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>



      {/* ── REVENUE-FIRST FULL WIDTH CTA ── */}
      <section className="py-12 xs:py-16 md:py-20 bg-linear-to-r from-primary-950 via-primary-900 to-secondary-950 text-white relative overflow-hidden">
        {/* Ambient Backdrop Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-3 xs:px-4 md:px-8 max-w-4xl text-center space-y-4 xs:space-y-6 relative z-10">
          <div className="inline-flex items-center gap-1.5 xs:gap-2 px-3 xs:px-4 py-1 xs:py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-[10px] xs:text-xs sm:text-sm font-medium uppercase tracking-widest text-teal-300">
            <Sparkles size={13} />
            <span>REVENUE-FIRST HOTEL STRATEGY</span>
          </div>

          <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-semibold sm:font-bold md:font-bold tracking-tight leading-tight text-white">
            Grow Your Hotel with a Revenue-First Digital Strategy
          </h2>

          <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-200 font-normal leading-relaxed max-w-3xl mx-auto">
            NearGrow Ads helps hospitality businesses and local brands turn digital visibility into measurable inquiries and revenue through local search, paid advertising, and creative execution.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 xs:gap-4 pt-2 xs:pt-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 xs:px-8 py-3.5 xs:py-4 text-xs xs:text-sm sm:text-base font-semibold text-primary-950 bg-white hover:bg-gray-100 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Book Strategy Call</span>
              <ArrowRight size={17} />
            </Link>

            <button
              onClick={() => window.dispatchEvent(new Event("openLeadModal"))}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 xs:px-8 py-3.5 xs:py-4 text-xs xs:text-sm sm:text-base font-semibold text-white bg-white/10 hover:bg-white/20 rounded-full border border-white/30 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
            >
              <Gift size={17} className="text-teal-300" />
              <span>Get Free Audit</span>
            </button>
          </div>

          <div className="pt-4 xs:pt-6 text-[10px] xs:text-[11px] text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed border-t border-white/10">
            Performance note: Figures are approximate and based on supplied platform insights and client reporting. Results can vary with seasonality, inventory, pricing, market demand and media investment.
          </div>
        </div>
      </section>


    </main>
  );
}
