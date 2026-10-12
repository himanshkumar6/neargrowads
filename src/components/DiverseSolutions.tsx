"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const solutions = [
  {
    title: "Retail & Showrooms",
    category: "RETAIL",
    description: "Drive foot traffic and rank for high-intent local searches",
    image: "https://ik.imagekit.io/rrcdbevrb/homestay_market",
  },
  {
    title: "Cafes & Dining",
    category: "CAFE",
    description: "Fill tables consistently and build local community recall",
    image: "https://ik.imagekit.io/rrcdbevrb/cafe_marketing",
  },
  {
    title: "Clinics & Wellness",
    category: "CLINIC",
    description: "Attract nearby patients and build verified search credibility",
    image: "https://ik.imagekit.io/rrcdbevrb/vilias_market",
  },
  {
    title: "HomeStays & Stays",
    category: "HOMESTAY",
    description: "Rank locally on Google Maps and drive direct inquiries",
    image: "https://ik.imagekit.io/rrcdbevrb/glamping_market",
  },
  {
    title: "Salons & Spas",
    category: "SALON",
    description: "Attract appointment bookings with engaging social reels",
    image: "https://ik.imagekit.io/rrcdbevrb/airbnb_img",
  },
  {
    title: "Restaurants",
    category: "RESTAURANT",
    description: "Increase dine-in guests and highlight seasonal menu offerings",
    image: "https://ik.imagekit.io/rrcdbevrb/restro_makret",
  },
  {
    title: "Hotels & Resorts",
    category: "HOTEL",
    description: "Enhance local search visibility and drive direct reservations",
    image: "https://ik.imagekit.io/rrcdbevrb/hotel_market",
  },
  {
    title: "Local Services",
    category: "SERVICES",
    description: "Capture nearby service searches with targeted Google Ads",
    image: "https://ik.imagekit.io/rrcdbevrb/resort_market",
  }
];

/* Premium Frosted Glass Capsule Component */
function AppleLiquidGlassTag({ title }: { title: string }) {
  const firstWord = title.split(' ')[0].toUpperCase();
  const restWord = title.split(' ').slice(1).join(' ').toUpperCase();

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center px-3 xs:px-4 sm:px-5 py-1.5 xs:py-2 sm:py-2.5 rounded-full select-none cursor-pointer overflow-hidden transform-gpu",
        "bg-slate-950/75 dark:bg-black/75 backdrop-blur-xl",
        "border border-white/20 dark:border-white/15",
        "shadow-[0_8px_25px_-5px_rgba(0,0,0,0.5)]",
        "hover:border-emerald-400/50 hover:bg-slate-900/90",
        "hover:shadow-[0_10px_30px_-5px_rgba(16,185,129,0.25)]",
        "hover:-translate-y-0.5 transition-all duration-300 ease-out"
      )}
    >
      {/* Subtle top rim highlight */}
      <div className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none rounded-full" />

      {/* Typography */}
      <div className="relative z-10 flex items-center gap-1.5 font-bold tracking-wider text-[11px] xs:text-xs sm:text-[13px] uppercase">
        <span className="text-[#FBAF35]">
          {firstWord}
        </span>
        <span className="text-white">
          {restWord}
        </span>
      </div>
    </div>
  );
}

export default function DiverseSolutions() {

  return (
    <section className="relative w-full pt-16 pb-12 md:pt-24 md:pb-16 bg-white dark:bg-[#050b14] overflow-hidden" id="hospitality-solutions">
      
      {/* ── Cool Glassmorphic Ambient Background Aura ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] h-[550px] bg-secondary-500/10 dark:bg-secondary-600/15 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* Floating Ambient Glow Orbs */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -left-20 top-1/3 w-96 h-96 bg-primary-500/10 dark:bg-primary-600/15 rounded-full blur-[120px] animate-[planetFloat_16s_infinite]" />
        <div className="absolute -right-20 bottom-1/4 w-96 h-96 bg-secondary-400/10 dark:bg-secondary-500/15 rounded-full blur-[120px] animate-[planetFloat_20s_infinite_reverse]" />
      </div>

      <div className="container mx-auto px-3 xs:px-4 md:px-8 max-w-7xl relative z-10">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 xs:mb-12 lg:mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="text-secondary-600 dark:text-secondary-400 font-medium tracking-widest uppercase text-xs sm:text-sm block mb-2.5 sm:mb-3">
              Tailored Local Expertise
            </span>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-semibold sm:font-bold md:font-bold text-gray-900 dark:text-white leading-[1.2] tracking-tight">
              MARKETING SOLUTIONS FOR EVERY TYPE OF{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-500 via-teal-400 to-primary-500 dark:from-secondary-400 dark:to-teal-300">
                LOCAL BUSINESS
              </span>
            </h2>
          </motion.div>
        </div>

        {/* CSS Marquee Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative w-full pb-8 overflow-hidden"
        >
          <style>
            {`
              @keyframes marketing-marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .animate-marketing-marquee {
                animation: marketing-marquee 40s linear infinite;
              }
              .animate-marketing-marquee:hover {
                animation-play-state: paused;
              }
            `}
          </style>

          <div className="animate-marketing-marquee flex w-max">
            {/* Double array for seamless infinite marquee loop */}
            {[...solutions, ...solutions].map((solution, index) => (
              <div key={index} className="shrink-0 w-[85vw] sm:w-[320px] md:w-[360px] lg:w-[400px] pr-4 sm:pr-6 h-auto">
                {/* 4:5 Aspect Ratio Glass Card Shell */}
                <div className="group relative w-full aspect-4/5 rounded-2xl xs:rounded-[2.2rem] overflow-hidden flex flex-col justify-between transform-gpu bg-gray-900 border border-white/20 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-500">
                  
                  {/* Background Image with Hover Scale */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={solution.image}
                      alt={solution.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transform-gpu transition-transform duration-[1.5s] ease-out group-hover:scale-[1.05]"
                      quality={75}
                      loading="lazy"
                    />
                  </div>

                  {/* Gradient Contrast Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/90 z-10 opacity-90 group-hover:opacity-95 transition-opacity duration-500" />

                  {/* Glassmorphism Inner Bevel Glow */}
                  <div className="absolute inset-0 border border-white/20 rounded-2xl xs:rounded-[2.2rem] z-20 pointer-events-none" />

                  {/* Content Container */}
                  <div className="relative z-30 p-4 xs:p-6 md:p-8 flex flex-col h-full justify-between">
                    
                    {/* Top Content: Apple Liquid Glass Tag */}
                    <div className="flex justify-start items-center">
                      <AppleLiquidGlassTag title={solution.title} />
                    </div>

                    {/* Bottom Content: Description */}
                    <div className="translate-y-1 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                      <p className="text-xs xs:text-sm md:text-[15px] font-normal sm:font-medium leading-relaxed text-gray-200 drop-shadow-md">
                        <span className="text-teal-300 font-semibold">{solution.description.split(' ')[0]}</span>{' '}
                        <span className="text-white">{solution.description.split(' ').slice(1).join(' ')}</span>
                      </p>
                    </div>
                    
                  </div>

                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
