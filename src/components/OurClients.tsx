/* eslint-disable @next/next/no-img-element */
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

export default function OurClients() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative pt-8 xs:pt-12 pb-12 xs:pb-16 md:pt-16 md:pb-24 bg-transparent overflow-hidden" id="our-clients">
      
      {/* ── Ambient iPhone Liquid Glass Glow Halo ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-5xl h-[300px] bg-gradient-to-r from-primary-500/20 via-secondary-500/25 to-primary-600/20 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Skyblue Cosmic Beams */}
      <div className="absolute hidden dark:block left-[-20%] top-[40%] w-[150%] h-[150px] pointer-events-none z-0 rotate-[-10deg]">
         {/* Main diffuse beam */}
         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-400/10 to-transparent animate-[pulse_8s_infinite]" />
         {/* Intense core beam */}
         <div className="absolute inset-y-1/3 inset-x-0 bg-gradient-to-r from-transparent via-sky-300/20 to-transparent animate-[pulse_5s_infinite_reverse]" />
         {/* Laser thin beam */}
         <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-sky-200/40 to-transparent" />
      </div>

      {/* Cosmic Creative Stuff: Floating Skyblue Orbs & Twinkling Stars */}
      <div className="absolute hidden dark:block inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Skyblue Glowing Orb 1 */}
        <div className="absolute left-[8%] top-[20%] w-[100px] h-[100px] bg-sky-500/10 rounded-full animate-[planetBounce_12s_infinite]" />
        {/* Skyblue Glowing Orb 2 */}
        <div className="absolute right-[15%] bottom-[10%] w-[150px] h-[150px] bg-cyan-400/5 rounded-full animate-[planetBounce_15s_infinite_reverse]" />
        
        {/* Twinkling Stars */}
        <div className="absolute left-[20%] top-[30%] w-1 h-1 bg-sky-100 rounded-full animate-[pulse_3s_infinite]" />
        <div className="absolute right-[30%] top-[50%] w-1.5 h-1.5 bg-white rounded-full animate-[pulse_4s_infinite]" />
        <div className="absolute left-[40%] bottom-[20%] w-1 h-1 bg-cyan-100 rounded-full animate-[pulse_5s_infinite]" />
        <div className="absolute right-[10%] top-[15%] w-2 h-2 bg-sky-200 rounded-full animate-[pulse_6s_infinite_reverse]" />
      </div>

      <div className="container relative z-10 mx-auto px-3 xs:px-4 md:px-8 max-w-7xl">
        
        <div className="text-center max-w-3xl mx-auto mb-6 xs:mb-8 md:mb-12">
          <motion.h2 
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} variants={fadeUp}
            className="text-2xl xs:text-3xl md:text-5xl font-semibold sm:font-bold text-[#2A3F64] dark:text-white tracking-tight"
          >
            Our Valued Clients
          </motion.h2>
        </div>

        {/* ── Apple iPhone Liquid Glass Marquee Runway ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
          className="w-full bg-[#fafbfc]/80 dark:bg-[#07111e]/80 backdrop-blur-2xl rounded-2xl xs:rounded-3xl md:rounded-[2.8rem] border border-gray-200/80 dark:border-white/15 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] py-4 xs:py-6 md:py-8 px-2.5 xs:px-4 sm:px-6 relative overflow-hidden flex items-center"
        >
          {/* Top Glass Specular Rim Highlight */}
          <div className="absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary-400/50 dark:via-white/50 to-transparent pointer-events-none rounded-full" />

          {/* Left/Right Edge Fade Vignettes */}
          <div className="absolute left-0 top-0 bottom-0 w-12 xs:w-20 md:w-32 bg-gradient-to-r from-[#fafbfc] dark:from-[#07111e] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 xs:w-20 md:w-32 bg-gradient-to-l from-[#fafbfc] dark:from-[#07111e] to-transparent z-10 pointer-events-none" />

          {/* Infinite Marquee Wrapper */}
          <motion.div
            animate={prefersReducedMotion ? { x: 0 } : { x: [0, "-50%"] }}
            transition={prefersReducedMotion ? { duration: 0 } : {
              repeat: Infinity,
              ease: "linear",
              duration: 30,
            }}
            className="flex w-max items-center relative z-0"
          >
            {/* First Set of Logos */}
            <div className="flex items-center justify-center pr-3 xs:pr-4 sm:pr-8 md:pr-12">
              <img
                src="/Frame 31.svg"
                alt="Our Clients"
                loading="lazy"
                decoding="async"
                className="h-[50px] xs:h-[60px] sm:h-[80px] md:h-[120px] lg:h-[161px] w-auto max-w-none drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
              />
            </div>
            
            {/* Duplicate Set of Logos for Seamless Looping */}
            <div className="flex items-center justify-center pr-3 xs:pr-4 sm:pr-8 md:pr-12" aria-hidden="true">
              <img
                src="/Frame 31.svg"
                alt=""
                loading="lazy"
                decoding="async"
                className="h-[50px] xs:h-[60px] sm:h-[80px] md:h-[120px] lg:h-[161px] w-auto max-w-none drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
              />
            </div>
          </motion.div>
        </motion.div>
        
      </div>
    </section>
  );
}
