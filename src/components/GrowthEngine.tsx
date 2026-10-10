"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { TrendingUp, CalendarDays, Smartphone, Star } from "lucide-react";

const growthDrivers = [
  {
    title: "Direct Inquiries & Calls",
    description: "Connect high-intent local searchers directly to your phone, WhatsApp, or business location.",
    icon: TrendingUp
  },
  {
    title: "Geo-Targeted Promotions",
    description: "Run targeted Meta and Google campaigns focused strictly within your immediate customer radius.",
    icon: CalendarDays
  },
  {
    title: "High-Converting Creatives",
    description: "Publish short-form Reels, graphics, and localized landing pages that convert views into customers.",
    icon: Smartphone
  },
  {
    title: "Local Trust & Reputation",
    description: "Build local credibility through Google Business Profile optimization, review systems, and citations.",
    icon: Star
  }
];

export default function GrowthEngine() {
  return (
    <section className="py-12 xs:py-16 md:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-3 xs:px-4 md:px-8 max-w-7xl">
        <div className="text-center max-w-4xl mx-auto mb-10 xs:mb-16 md:mb-24">
          <motion.span 
            initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeUp}
            className="text-primary-500 font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-3 xs:mb-4 block"
          >
            GROWTH ENGINE
          </motion.span>
          <motion.h2 
            initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeUp}
            className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 xs:mb-6 tracking-tight"
          >
            Marketing That Drives Footfall, Calls, and Inquiries
          </motion.h2>
          <motion.p 
            initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeUp}
            className="text-sm xs:text-base md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto"
          >
            Our local growth engine is designed to guide nearby customers from initial search discovery to trust, active contact, and walk-ins.
          </motion.p>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-6 md:gap-8"
        >
          {growthDrivers.map((driver, index) => {
            const Icon = driver.icon;
            return (
              <motion.div 
                key={index} 
                variants={fadeUp} 
                className="bg-white dark:bg-[#0a1220] p-4 xs:p-6 sm:p-8 rounded-2xl xs:rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className="w-12 h-12 xs:w-14 xs:h-14 rounded-xl xs:rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4 xs:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon size={24} />
                </div>
                <h3 className="text-base xs:text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 xs:mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {driver.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-xs xs:text-sm md:text-base leading-relaxed">
                  {driver.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
