"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";

const processSteps = [
  {
    num: "01",
    title: "Local Audit",
    description: "We review your Google Business Profile, local search visibility, ad history, and competitor presence in your service radius.",
  },
  {
    num: "02",
    title: "Targeted Strategy",
    description: "We determine the practical mix of GBP optimization, Meta/Google Ads, creative assets, and tracking suited to your budget.",
  },
  {
    num: "03",
    title: "Campaign Setup",
    description: "We build localized landing pages, set up accurate conversion tracking, configure targeting, and launch high-impact creatives.",
  },
  {
    num: "04",
    title: "Active Refinement",
    description: "Ongoing review of local search queries, negative keywords, and ad creatives to reduce wasted ad spend and improve lead quality.",
  },
  {
    num: "05",
    title: "Consistent Growth",
    description: "Scale high-performing ad sets, expand target radius where viable, and maintain steady local visibility and customer inquiries.",
  },
];

export default function Process() {
  return (
    <section className="py-16 md:py-24 bg-white dark:bg-[#050b14] relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px] h-[500px] bg-primary-500/5 dark:bg-primary-900/10 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="container mx-auto px-3 xs:px-4 md:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 md:mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-secondary-500 dark:text-secondary-400 font-medium tracking-[0.2em] uppercase text-xs md:text-sm block mb-3.5 sm:mb-4"
          >
            How We Work
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl xs:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 tracking-tight"
          >
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500 dark:from-primary-400 dark:to-secondary-400">Growth Methodology</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-600 dark:text-gray-400 text-base xs:text-lg md:text-xl font-normal sm:font-medium"
          >
            A structured, practical approach to expanding your local visibility and acquiring nearby customers.
          </motion.p>
        </div>

        <div className="relative">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 lg:grid-cols-5 gap-10 sm:gap-16 lg:gap-6 relative"
          >
            {processSteps.map((step, index) => (
              <motion.div key={index} variants={fadeUp} className="relative group cursor-default flex flex-row lg:flex-col items-start lg:items-center">
                
                {/* Connecting Lines (Desktop: Horizontal) */}
                {index !== processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-[2.25rem] left-[50%] w-[calc(100%+1.5rem)] h-[2px] bg-gradient-to-r from-gray-200 to-gray-200 dark:from-gray-800 dark:to-gray-800 group-hover:from-secondary-400 group-hover:to-gray-200 dark:group-hover:from-secondary-500 dark:group-hover:to-gray-800 transition-colors duration-700 z-0" />
                )}

                {/* Connecting Lines (Mobile/Tablet: Vertical) */}
                {index !== processSteps.length - 1 && (
                  <div className="block lg:hidden absolute top-[3.5rem] sm:top-[4.5rem] left-[1.75rem] sm:left-[2.25rem] -translate-x-1/2 w-[2px] h-[calc(100%-0.5rem)] bg-gradient-to-b from-gray-200 to-gray-200 dark:from-gray-800 dark:to-gray-800 group-hover:from-secondary-400 group-hover:to-gray-200 dark:group-hover:from-secondary-500 dark:group-hover:to-gray-800 transition-colors duration-700 z-0" />
                )}

                {/* Number Circle container */}
                <div className="relative shrink-0 flex justify-center mr-3.5 xs:mr-4 sm:mr-6 lg:mr-0 mb-0 lg:mb-8 z-10">
                  <div className="w-14 h-14 sm:w-[4.5rem] sm:h-[4.5rem] bg-white dark:bg-[#050b14] rounded-full flex items-center justify-center border-2 border-gray-100 dark:border-gray-800 group-hover:border-transparent group-hover:bg-gradient-to-br group-hover:from-primary-500 group-hover:to-secondary-500 shadow-sm group-hover:shadow-[0_0_20px_rgba(45,212,191,0.3)] transition-all duration-300 transform group-hover:-translate-y-1">
                    <span className="text-lg sm:text-xl md:text-2xl font-bold text-primary-600 dark:text-gray-400 group-hover:text-white transition-colors duration-300">
                      {step.num}
                    </span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="text-left lg:text-center pt-1 sm:pt-2 lg:pt-0 min-w-0">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-1.5 sm:mb-2 lg:mb-3 group-hover:text-secondary-500 dark:group-hover:text-secondary-400 transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs xs:text-sm md:text-base leading-relaxed">
                    {step.description}
                  </p>
                </div>

              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
