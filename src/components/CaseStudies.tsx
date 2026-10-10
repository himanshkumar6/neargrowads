"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { Sparkles, ArrowRight } from "lucide-react";
import Image from "next/image";

const caseStudies = [
  {
    id: "villasita",
    headline: "Proof of Impact: The Villasita Resort",
    challengeSolution: "NearGrow Ads implemented a targeted social media revival strategy, OTA optimization, GMB enhancement, and premium content positioning to strengthen Villasita Resort’s digital presence, increase room night bookings, and improve local search visibility.",
    results: [
      { metric: "Approx. ₹1 Cr+", label: "ONLINE REVENUE IN 12 MONTHS", highlight: true },
      { metric: "Up to ₹15L", label: "PEAK MONTHLY ONLINE REVENUE", highlight: true },
      { metric: "Up to 10x", label: "Return on Ad Spend (ROAS)", highlight: true },
      { metric: "13.89 Million", label: "Social Campaign Impressions" },
      { metric: "2 Lakh+", label: "GOOGLE PROFILE VIEWS" },
      { metric: "25,000+", label: "GOOGLE PROFILE INTERACTIONS" },
    ],
    closingCopy: "The campaign delivered massive improvement in online visibility, guest engagement, and direct customer interest.",
    imageColor: "from-blue-500/20 to-cyan-500/20",
    themeColor: "text-blue-600 dark:text-blue-400",
    themeHighlight: "text-blue-400",
    imageUrl: "/AYU08772.webp",
    link: "/case-studies/villasita-resort-haridwar"
  },
  {
    id: "avyanta",
    headline: "Proof of Impact: Avyanta Hotels",
    challengeSolution: "NearGrow Ads implemented luxury-focused digital branding, a social media growth strategy, premium storytelling content, and a visibility-driven hospitality marketing approach to strengthen Avyanta Hotels’ online presence and audience engagement.",
    results: [
      { metric: "+180%", label: "Growth in Social Media Reach", highlight: true },
      { metric: "+140%", label: "Increase in Audience Engagement", highlight: true },
      { metric: "Premium", label: "Luxury Brand Positioning Established" },
      { metric: "Visuals", label: "Strong Improvement in Storytelling" },
      { metric: "Visibility", label: "Enhanced Online Instagram Presence" },
    ],
    closingCopy: "Avyanta Hotels was successfully positioned as a premium hospitality destination through aesthetic content strategy, luxury-focused branding, and engaging digital storytelling.",
    imageColor: "from-purple-500/20 to-pink-500/20",
    themeColor: "text-purple-600 dark:text-purple-400",
    themeHighlight: "text-purple-400",
    imageUrl: "https://ik.imagekit.io/rrcdbevrb/image",
    link: null
  }
];

export default function CaseStudies() {
  return (
    <section className="relative pt-8 pb-20 md:pt-16 md:pb-32 bg-gray-50 dark:bg-transparent overflow-hidden" id="case-studies">
      


      <div className="container relative z-10 mx-auto px-3 xs:px-4 md:px-8 max-w-7xl space-y-14 xs:space-y-16 sm:space-y-20 md:space-y-24 lg:space-y-36">
        
        {/* SVG Definitions for Advanced Curve Masking */}
        <svg width="0" height="0" className="absolute pointer-events-none">
          <defs>
            {/* Concave curve on the right edge (for image on left) */}
            <clipPath id="curve-right" clipPathUnits="objectBoundingBox">
              <path d="M 0,0 L 1,0 Q 0.7,0.5 1,1 L 0,1 Z" />
            </clipPath>
            {/* Concave curve on the left edge (for image on right) */}
            <clipPath id="curve-left" clipPathUnits="objectBoundingBox">
              <path d="M 0,0 Q 0.3,0.5 0,1 L 1,1 L 1,0 Z" />
            </clipPath>
          </defs>
        </svg>

        {caseStudies.map((study, index) => {
          const isEven = index % 2 === 0;
          const clipMask = isEven ? "url(#curve-right)" : "url(#curve-left)";
          
          return (
            <motion.div 
              key={study.id}
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className={`flex flex-col lg:flex-row gap-8 xs:gap-10 lg:gap-16 items-center ${isEven ? "" : "lg:flex-row-reverse"}`}
            >
              
              {/* Image/Visual Column with Full-Width Button Below */}
              <motion.div 
                variants={fadeUp}
                className="w-full lg:w-1/2 drop-shadow-2xl dark:drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-4 xs:gap-5"
              >
                <div 
                  className={`relative w-full aspect-4/3 bg-linear-to-br ${study.imageColor} flex items-center justify-center group`}
                  style={{ clipPath: clipMask }}
                >
                  {/* High-end luxury hotel stock image with sharp Tilt crop */}
                  <Image 
                    src={study.imageUrl}
                    alt={study.headline}
                    fill
                    className="object-cover transform-gpu group-hover:scale-105 transition-transform duration-[1.5s] ease-out will-change-transform"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />

                  {/* Holographic "Holosphere" Sparkle Effect Overlay - Hardware Accelerated */}
                  <div className="absolute inset-0 z-10 mix-blend-screen opacity-70 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden transform-gpu will-change-opacity backface-hidden">
                    {/* Glowing Iridescent Orbs */}
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4], x: [0, 30, 0] }} 
                      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-[#8a2be2]/40 rounded-full blur-[80px] md:blur-[100px] transform-gpu will-change-transform backface-hidden" 
                    />
                    <motion.div 
                      animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.7, 0.3], y: [0, -40, 0] }} 
                      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                      className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[80%] bg-[#00ffff]/40 rounded-full blur-[80px] md:blur-[100px] transform-gpu will-change-transform backface-hidden" 
                    />
                    
                    {/* Floating Sparkles */}
                    <motion.div animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }} transition={{ duration: 3, repeat: Infinity, delay: 0.5 }} className="absolute top-[20%] left-[25%] text-white/80 transform-gpu will-change-transform backface-hidden">
                      <Sparkles className="w-6 h-6" />
                    </motion.div>
                    <motion.div animate={{ opacity: [0, 0.8, 0], scale: [0.8, 1.5, 0.8], rotate: [0, 90, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 1.2 }} className="absolute bottom-[35%] right-[20%] text-white/60 transform-gpu will-change-transform backface-hidden">
                      <Sparkles className="w-8 h-8" />
                    </motion.div>
                    <motion.div animate={{ opacity: [0, 0.9, 0], scale: [0.4, 1, 0.4] }} transition={{ duration: 2.5, repeat: Infinity, delay: 2 }} className="absolute top-[45%] left-[60%] text-white/90 transform-gpu will-change-transform backface-hidden">
                      <Sparkles className="w-4 h-4" />
                    </motion.div>
                  </div>
                </div>

                {/* Prominent Full-Width "Read Full Case Study" Button directly under Left Image */}
                {study.link ? (
                  <Link
                    href={study.link}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 xs:px-6 py-3.5 xs:py-4 rounded-xl xs:rounded-2xl bg-linear-to-r from-primary-600 via-primary-700 to-secondary-600 dark:from-primary-500 dark:to-secondary-400 text-white text-xs xs:text-sm sm:text-base font-semibold shadow-xl shadow-primary-600/20 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer text-center"
                  >
                    <span>Read Full Case Study</span>
                    <ArrowRight size={18} />
                  </Link>
                ) : (
                  <div
                    className="w-full inline-flex items-center justify-center gap-2 px-4 xs:px-6 py-3.5 xs:py-4 rounded-xl xs:rounded-2xl bg-gray-200 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs xs:text-sm sm:text-base font-semibold cursor-not-allowed text-center border border-gray-300 dark:border-gray-700/50 opacity-80"
                  >
                    <span>Case Study Coming Soon</span>
                    <Sparkles size={16} className="opacity-60" />
                  </div>
                )}
              </motion.div>

              {/* Content Column */}
              <motion.div 
                variants={fadeUp}
                className="w-full lg:w-1/2 space-y-4 xs:space-y-6 flex flex-col justify-center"
              >
                <div className="space-y-2 xs:space-y-3">
                  <h2 className="text-2xl xs:text-3xl md:text-4xl lg:text-5xl font-semibold italic text-gray-900 dark:text-white tracking-tight">
                    {study.headline}
                  </h2>
                  <p className="text-sm xs:text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                    <strong className="text-gray-900 dark:text-gray-200">Our Approach: </strong> 
                    {study.challengeSolution}
                  </p>
                </div>

                {/* Results Grid */}
                <div className="pt-3 xs:pt-4 border-t border-gray-200 dark:border-gray-800">
                  <h4 className="text-[11px] xs:text-xs md:text-sm uppercase tracking-wider font-medium text-gray-400 dark:text-gray-500 mb-3 xs:mb-4">
                    Key Results
                  </h4>
                  <div className="grid grid-cols-2 gap-3 xs:gap-4 md:gap-6">
                    {study.results.map((result, i) => (
                      <div key={i} className="space-y-0.5 xs:space-y-1">
                        <div className={`text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold break-words leading-tight ${result.highlight ? study.themeColor : "text-gray-900 dark:text-white"}`}>
                          {result.metric}
                        </div>
                        <p className="text-[11px] xs:text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium leading-tight">
                          {result.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Closing Copy Blockquote */}
                <div className="relative pt-3 xs:pt-4">
                  <div className="relative pl-3.5 xs:pl-5">
                    <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-full bg-linear-to-b ${study.imageColor.replace('/20', '/100')}`} />
                    <p className="text-sm xs:text-base md:text-lg font-medium text-gray-800 dark:text-gray-300 italic">
                      &quot;{study.closingCopy}&quot;
                    </p>
                  </div>
                </div>
              </motion.div>

            </motion.div>
          );
        })}
        
      </div>
    </section>
  );
}
