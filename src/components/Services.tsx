"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, RotateCcw } from "lucide-react";
import { services } from "@/data/services";
import { fadeUp, staggerContainer } from "@/lib/animations";

function ServiceFlipCard({ service, isFlipped, onFlip }: { service: typeof services[0], isFlipped: boolean, onFlip: () => void }) {
  return (
    <div 
      className="relative w-full h-full min-h-[350px] sm:min-h-[365px] cursor-pointer group mt-6"
      style={{ perspective: "1000px" }}
      onClick={onFlip}
    >
      <motion.div
        className="w-full h-full relative"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* ====== FRONT FACE ====== */}
        <div 
          className="w-full h-full bg-white/80 dark:bg-[#07111e]/85 backdrop-blur-xl rounded-2xl xs:rounded-3xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border border-white/80 dark:border-white/15 flex flex-col pt-6 xs:pt-7 pb-5 xs:pb-6 px-4 xs:px-6 sm:px-7 text-center transition-all duration-300 group-hover:border-primary-400/50 dark:group-hover:border-primary-500/40 relative overflow-hidden"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          {/* Top Glass Specular Rim Highlight */}
          <div className="absolute inset-x-6 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white dark:via-white/40 to-transparent pointer-events-none rounded-full" />

          {/* Apple 3D Liquid Glass Icon Capsule Badge */}
          <div className="w-12 h-12 xs:w-13 xs:h-13 rounded-2xl bg-gradient-to-br from-primary-500/15 via-secondary-500/20 to-primary-600/15 border border-white/60 dark:border-white/20 shadow-md backdrop-blur-md flex items-center justify-center text-primary-600 dark:text-cyan-300 mb-3 xs:mb-3.5 mx-auto group-hover:scale-110 group-hover:border-secondary-400/50 transition-all duration-300 shrink-0">
            <service.icon size={22} strokeWidth={2} />
          </div>

          <div className="flex flex-col flex-grow items-center justify-between">
            <div>
              <h3 className="text-base xs:text-lg sm:text-xl font-semibold sm:font-bold text-gray-900 dark:text-white mb-1 xs:mb-1.5 tracking-tight">{service.title}</h3>
              
              {service.subheading && (
                <h4 className="text-[10px] xs:text-[11px] sm:text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-2.5 xs:mb-3 leading-snug">
                  {service.subheading}
                </h4>
              )}
              
              <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed mb-3 xs:mb-4">
                {service.description}
              </p>
            </div>

            <div className="w-9 h-9 xs:w-10 xs:h-10 mt-auto rounded-full bg-primary-50 dark:bg-gray-800 flex items-center justify-center text-primary-600 dark:text-primary-400 group-hover:bg-secondary-600 dark:group-hover:bg-secondary-500 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-md shrink-0">
              <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform duration-300" />
            </div>
          </div>
        </div>

        {/* ====== BACK FACE ====== */}
        <div 
          className="absolute inset-0 w-full h-full bg-gradient-to-b from-primary-600 via-primary-700 to-primary-900 dark:from-primary-900 dark:to-primary-950 text-white rounded-2xl xs:rounded-3xl border border-white/30 dark:border-white/20 shadow-2xl p-4 xs:p-6 sm:p-7 flex flex-col justify-between overflow-hidden"
          style={{ 
            backfaceVisibility: "hidden", 
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)" 
          }}
        >
          {/* Top Specular Rim */}
          <div className="absolute inset-x-6 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none rounded-full" />

          {/* Faint Background Icon */}
          <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
             <service.icon size={160} />
          </div>

          <div className="relative z-10 flex flex-col flex-1 min-h-0 overflow-hidden">
            <div className="shrink-0 border-b border-white/20 pb-2.5 mb-2.5">
              <h3 className="text-base sm:text-lg font-semibold mb-1 tracking-tight">{service.title}</h3>
              {service.subheading && (
                <h4 className="text-[11px] font-semibold text-primary-200 leading-snug line-clamp-2">
                  {service.subheading}
                </h4>
              )}
            </div>
            <div className="flex-1 overflow-y-auto pb-1 flex flex-col gap-1.5 text-primary-50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <span className="text-[10px] font-medium uppercase tracking-wider text-white/70">Includes:</span>
              <ul className="space-y-1.5">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-xs leading-snug font-medium">
                    <span className="text-teal-300 opacity-80 mt-0.5 text-xs">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="shrink-0 relative z-10 flex items-center justify-between mt-3 pt-3 border-t border-white/20">
             <Link 
               href={`/services/${service.slug}`} 
               className="text-xs sm:text-sm font-semibold hover:text-white text-primary-100 flex items-center gap-1.5 group/link"
               onClick={(e) => e.stopPropagation()}
             >
               View Service <ArrowRight size={15} className="group-hover/link:translate-x-1 transition-transform" />
             </Link>
             
             <button 
               className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
               onClick={(e) => {
                 e.stopPropagation();
                 onFlip();
               }}
               aria-label="Flip back"
             >
               <RotateCcw size={14} />
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Services() {
  const [flippedCardId, setFlippedCardId] = useState<string | number | null>(null);

  return (
    <section className="py-10 xs:py-12 md:py-16 bg-[#fafbfc] dark:bg-gray-950" id="services">
      <div className="container mx-auto px-3 xs:px-4 md:px-8 max-w-7xl">
        <div className="text-center max-w-5xl mx-auto mb-8 xs:mb-10 lg:mb-16">
          <motion.span 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-primary-600 dark:text-primary-400 font-semibold tracking-wider uppercase text-xs xs:text-sm"
          >
            Our Services
          </motion.span>
          <motion.h2 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-2xl xs:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mt-3 xs:mt-4 mb-4 xs:mb-6 tracking-tight"
          >
            Modular Growth Services for Local Businesses
          </motion.h2>
          <motion.p 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-gray-700 dark:text-gray-300 text-sm xs:text-base md:text-lg leading-relaxed max-w-3xl mx-auto"
          >
            From Google Maps optimization and local SEO to targeted Meta & Google Ads, choose individual services or combine them for complete local market coverage.
          </motion.p>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
        >
          {services.map((service) => (
            <motion.div key={service.id} variants={fadeUp} className="h-full">
              <ServiceFlipCard 
                service={service} 
                isFlipped={flippedCardId === service.id}
                onFlip={() => setFlippedCardId(flippedCardId === service.id ? null : service.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
