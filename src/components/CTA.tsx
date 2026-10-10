"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, fadeLeft, springUp } from "@/lib/animations";
import { ArrowRight, TrendingUp, MapPin } from "lucide-react";

export default function CTA() {
  return (
    <section id="cta-section" className="relative py-16 sm:py-20 md:py-28 overflow-hidden bg-[#050b14] text-white">
      
      {/* ── 1. Luxury Background Image Layer ── */}
      <div 
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2000&auto=format&fit=crop')] opacity-15 bg-cover bg-center mix-blend-luminosity pointer-events-none" 
        aria-hidden="true"
      />

      {/* ── 2. Rich Dark Gradient Base Overlay ── */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#061224]/95 via-[#081b36]/90 to-[#030712]/98 pointer-events-none" 
        aria-hidden="true"
      />

      {/* ── 3. Creative Glowing Mesh Radial Orbs (Brand Green & Amber) ── */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full pointer-events-none blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(104,185,85,0.35) 0%, rgba(104,185,85,0.08) 70%, transparent 100%)" }}
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-24 -right-24 w-[30rem] h-[30rem] rounded-full pointer-events-none blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(251,175,53,0.3) 0%, rgba(251,175,53,0.06) 70%, transparent 100%)" }}
      />
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[20rem] rounded-full pointer-events-none blur-3xl opacity-20"
        style={{ background: "radial-gradient(circle, rgba(104,185,85,0.2) 0%, transparent 70%)" }}
      />

      {/* ── 4. Subtle Geometric Grid Pattern Overlay ── */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-60" 
        aria-hidden="true"
      />

      {/* ── 5. Floating Decorative Badges ── */}
      <motion.div 
        animate={{ y: [-6, 6, -6], rotate: [0, 8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-12 right-[12%] hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-secondary-300 shadow-lg pointer-events-none"
      >
        <MapPin size={14} className="text-secondary-400" />
        <span className="font-semibold tracking-wide">Local Visibility</span>
      </motion.div>

      <motion.div 
        animate={{ y: [6, -6, 6], rotate: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-12 left-[10%] hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-primary-300 shadow-lg pointer-events-none"
      >
        <TrendingUp size={14} className="text-primary-400" />
        <span className="font-semibold tracking-wide">Measurable Inquiries</span>
      </motion.div>

      {/* ── 6. Main Content Container ── */}
      <div className="container mx-auto px-3 xs:px-4 md:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center px-1 xs:px-2 sm:px-0">
          
          {/* Glassmorphic Pill Tag */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} variants={fadeUp}
            className="inline-flex items-center gap-2 xs:gap-2.5 px-3 xs:px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 backdrop-blur-md text-[10px] xs:text-xs sm:text-sm font-medium uppercase tracking-normal xs:tracking-wider sm:tracking-widest text-primary-300 mb-5 xs:mb-6 shadow-xl max-w-full text-center"
          >
            <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse shrink-0" />
            <span className="truncate">Ready to Grow Your Local Business?</span>
          </motion.div>

          <motion.h2 
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} variants={fadeLeft}
            className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 xs:mb-6 md:mb-8 leading-[1.15] tracking-tight text-balance"
          >
            Grow Local. <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#68B955] via-emerald-400 to-[#FBAF35]">Grow Smart.</span>
          </motion.h2>

          <motion.p 
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} variants={fadeUp}
            className="text-sm xs:text-base sm:text-lg md:text-xl text-slate-300 mb-6 xs:mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed font-normal sm:font-medium"
          >
            Partner with NearGrow Ads to strengthen your Google Business Profile, run targeted local ads, and connect with nearby customers who are actively searching for what you offer.
          </motion.p>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} variants={springUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full"
          >
            <Link 
              href="/contact" 
              className="inline-flex justify-center items-center px-4 xs:px-6 sm:px-8 py-3.5 sm:py-4 text-xs xs:text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 hover:from-primary-500 hover:to-secondary-400 rounded-full transition-all duration-300 shadow-[0_4px_25px_rgba(104,185,85,0.4)] hover:shadow-[0_4px_35px_rgba(251,175,53,0.45)] hover:-translate-y-0.5 w-full sm:w-auto cursor-pointer text-center"
            >
              Request a Free Visibility Check
            </Link>
            <Link 
              href="/services" 
              className="inline-flex justify-center items-center gap-2 px-4 xs:px-6 sm:px-8 py-3.5 sm:py-4 text-xs xs:text-sm sm:text-base font-semibold text-white bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 hover:border-primary-400/40 rounded-full transition-all w-full sm:w-auto cursor-pointer text-center"
            >
              Explore Services <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
