"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { Search, Compass, Cpu, LineChart, Rocket, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    id: "strategy",
    label: "Strategy",
    num: "01",
    title: "Strategy & Audit",
    description: "Analyzing your local service radius, existing search rankings, competitor listings, and target customer intent.",
    icon: Compass,
    align: "left"
  },
  {
    id: "foundation",
    label: "Foundation",
    num: "02",
    title: "Local Foundation",
    description: "Optimizing Google Business Profile details, local citations, NAP consistency, and high-converting landing pages.",
    icon: Search,
    align: "right"
  },
  {
    id: "content",
    label: "Creatives",
    num: "03",
    title: "Engaging Creatives",
    description: "Producing eye-catching short-form Reels, ad graphics, and local promotional assets that drive viewer action.",
    icon: Rocket,
    align: "left"
  },
  {
    id: "growth",
    label: "Growth",
    num: "04",
    title: "Targeted Paid Traffic",
    description: "Launching and refining geo-targeted Meta & Google Ads campaigns to capture nearby demand and generate inquiries.",
    icon: LineChart,
    align: "right"
  }
];

const SvgConnector = ({ isLeft }: { isLeft: boolean }) => {
  // Desktop S-Curve connecting Left Card (25% X) to Right Card (75% X)
  const pathD_desktop = isLeft 
    ? "M 25 0 C 25 50, 75 50, 75 100" 
    : "M 75 0 C 75 50, 25 50, 25 100";
    
  // Mobile Straight Line (50% X down the center)
  const pathD_mobile = "M 50 0 L 50 100";

  const renderSvgPaths = (pathD: string) => (
    <>
      {/* Base Faint Track (Dashed like reference) */}
      <path 
        d={pathD} 
        fill="none" 
        stroke="#3ca2d9" 
        strokeWidth="3" 
        strokeOpacity="0.2" 
        strokeDasharray="12 12"
        vectorEffect="non-scaling-stroke"
      />
      {/* Drawn Path Effect */}
      <motion.path 
        d={pathD} 
        fill="none" 
        stroke="#3ca2d9" 
        strokeWidth="4" 
        strokeDasharray="12 12"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      {/* Traveling Glowing Dot Effect */}
      <motion.path 
        d={pathD} 
        fill="none" 
        stroke="#22d3ee"
        strokeWidth="8" 
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        initial={{ pathLength: 0, pathOffset: 0, opacity: 0 }}
        whileInView={{ pathLength: 0.05, pathOffset: 1, opacity: [0, 1, 1, 0] }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.2 }}
        className="will-change-transform"
      />
    </>
  );
    
  return (
    <>
      {/* Desktop SVG */}
      <div className="hidden lg:block absolute top-1/2 left-0 w-full opacity-100 z-0 pointer-events-none" style={{ height: 'calc(100% + 160px)' }}>
        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
          {renderSvgPaths(pathD_desktop)}
        </svg>
      </div>

      {/* Mobile & Tablet SVG */}
      <div className="block lg:hidden absolute top-[15%] left-0 w-full opacity-30 md:opacity-50 z-0 pointer-events-none h-[calc(100%+32px)] md:h-[calc(100%+48px)]">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
          {renderSvgPaths(pathD_mobile)}
        </svg>
      </div>
    </>
  );
};

export default function MethodologyTimeline() {
  return (
    <section className="pt-24 pb-20 md:pt-32 md:pb-24 bg-white dark:bg-[#081120] overflow-hidden relative">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-1/2 bg-[#3ca2d9]/5 dark:bg-[#3ca2d9]/10 blur-[120px] rounded-full pointer-events-none transform-gpu" />
      
      <div className="container mx-auto px-3 xs:px-4 md:px-8 max-w-6xl relative z-10">
        
        {/* Top Header */}
        <div className="text-center mb-10 xs:mb-16 md:mb-24">
          <motion.span 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}
            className="text-[#3ca2d9] font-medium tracking-[0.2em] uppercase text-xs md:text-sm mb-3 xs:mb-4 md:mb-6 block will-change-transform"
          >
            OUR METHODOLOGY
          </motion.span>
          <motion.h2 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}
            className="text-2xl xs:text-3xl md:text-4xl lg:text-5xl font-semibold sm:font-bold text-gray-900 dark:text-white mb-8 xs:mb-12 md:mb-16 tracking-tight will-change-transform"
          >
            The 4 Pillars of Local Business Growth
          </motion.h2>
        </div>

        {/* Alternating Timeline Layout */}
        <div className="space-y-6 xs:space-y-8 md:space-y-12 lg:space-y-40">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLeft = step.align === "left";

            return (
              <motion.div 
                key={step.id}
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
                className="relative pb-4 md:pb-8 lg:pb-24 group"
              >
                <div className={cn(
                  "flex flex-col items-center relative z-10",
                  isLeft ? "lg:flex-row" : "lg:flex-row-reverse",
                  "gap-0 lg:gap-16" // Remove gap on mobile to allow negative margin overlap
                )}>
                  {/* Text Card Side */}
                  <motion.div variants={fadeUp} className="flex-1 w-full relative z-20 will-change-transform transform-gpu">
                    <div className="bg-white/40 dark:bg-[#0c162d]/40 backdrop-blur-md border border-gray-200 dark:border-white/5 rounded-2xl md:rounded-3xl p-4 xs:p-6 md:p-10 lg:p-12 pb-12 xs:pb-16 md:pb-20 lg:pb-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] relative overflow-hidden transition-all duration-500 hover:shadow-[0_8px_40px_rgb(60,162,217,0.1)] dark:hover:shadow-[0_8px_40px_rgb(60,162,217,0.1)] hover:-translate-y-1 will-change-transform transform-gpu">
                      
                      {/* Faded Background Number */}
                      <div className="absolute -right-4 -bottom-8 xs:-bottom-10 md:-right-8 md:-bottom-16 text-[90px] xs:text-[120px] md:text-[180px] font-bold text-gray-900/5 dark:text-white/5 select-none pointer-events-none group-hover:scale-105 transition-transform duration-700">
                        {step.num}
                      </div>
                      
                      <span className="text-[#3ca2d9] font-medium uppercase tracking-wider text-xs md:text-sm mb-2 xs:mb-3 md:mb-4 block relative z-10">
                        Pillar {step.num}
                      </span>
                      <h3 className="text-xl xs:text-2xl md:text-3xl lg:text-4xl font-semibold sm:font-bold text-gray-900 dark:text-white mb-3 xs:mb-4 md:mb-6 relative z-10 tracking-tight">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm xs:text-base md:text-lg lg:text-xl leading-relaxed relative z-10">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>

                  {/* Icon Illustration Side (Mobile/Tablet Overlap) */}
                  <motion.div variants={fadeUp} className="w-full lg:flex-1 flex justify-end lg:justify-center relative z-30 -mt-12 xs:-mt-16 md:-mt-24 lg:mt-0 pr-2 xs:pr-4 md:pr-12 lg:pr-0 pointer-events-none will-change-transform transform-gpu">
                    <div className="relative p-4 xs:p-6 md:p-12 flex items-center justify-center group-hover:scale-105 transition-transform duration-700 pointer-events-auto">
                      {/* Premium Glow Blobs behind the icon */}
                      <div className="absolute inset-0 bg-[#3ca2d9]/20 dark:bg-[#3ca2d9]/40 blur-[40px] md:blur-[60px] rounded-full" />
                      <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-orange-500/20 dark:bg-orange-500/40 blur-[30px] md:blur-[40px] rounded-full" />
                      
                      {/* Glass Illustration Container */}
                      <div className="relative z-10 w-20 h-20 xs:w-28 xs:h-28 md:w-40 md:h-40 lg:w-56 lg:h-56 bg-white/70 dark:bg-black/40 backdrop-blur-md border border-white/60 dark:border-white/20 rounded-2xl xs:rounded-3xl lg:rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-2xl flex items-center justify-center transform transition-all duration-500 lg:group-hover:rotate-6 will-change-transform transform-gpu">
                        {/* Inner subtle border for 3D effect */}
                        <div className="absolute inset-1.5 xs:inset-2 border border-white/40 dark:border-white/10 rounded-xl xs:rounded-2xl lg:rounded-[2rem] pointer-events-none" />
                        <Icon className="w-9 h-9 xs:w-12 xs:h-12 md:w-16 md:h-16 lg:w-24 lg:h-24 text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.4)]" strokeWidth={1.5} />
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* SVG Animated Connector spanning to the NEXT row */}
                {index < steps.length - 1 && (
                  <SvgConnector isLeft={isLeft} />
                )}

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
