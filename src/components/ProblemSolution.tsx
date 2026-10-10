"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

export default function ProblemSolution() {
  return (
    <section className="py-10 xs:py-14 md:py-24 bg-white dark:bg-[#03070d] relative overflow-hidden">
      <div className="container mx-auto px-3 xs:px-4 md:px-8">
        
        {/* Header & Intro */}
        <div className="max-w-4xl mx-auto text-center mb-10 xs:mb-14 md:mb-20">
          <motion.h2 
            initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeUp}
            className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-3 xs:mb-4 sm:mb-6 leading-tight tracking-tight"
          >
            From Hotel Challenges to <span className="text-primary-600 dark:text-primary-400">Hospitality Growth</span>
          </motion.h2>
          <motion.p 
            initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeUp}
            className="text-gray-600 dark:text-gray-400 text-xs xs:text-sm sm:text-base md:text-xl leading-relaxed max-w-3xl mx-auto"
          >
            Most <strong className="font-semibold text-gray-900 dark:text-white">hospitality brands</strong> struggle not because the property lacks potential, but because the digital ecosystem around the brand is incomplete. <strong className="font-semibold text-gray-900 dark:text-white">Weak visibility</strong>, <strong className="font-semibold text-gray-900 dark:text-white">inconsistent branding</strong>, <strong className="font-semibold text-gray-900 dark:text-white">low guest engagement</strong>, and <strong className="font-semibold text-gray-900 dark:text-white">high OTA dependency</strong> can quietly reduce revenue opportunities.
          </motion.p>
        </div>

        {/* 4-Card Problem-Solution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-6 lg:gap-8 max-w-5xl mx-auto mb-10 xs:mb-14 md:mb-20">
          {[
            { challenge: "Low Occupancy", solution: "Higher Visibility", iconPath: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" },
            { challenge: "Inconsistent Branding", solution: "Stronger Brand Presence", iconPath: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" },
            { challenge: "Weak Guest Engagement", solution: "More Direct Bookings", iconPath: "M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" },
            { challenge: "Heavy OTA Dependence", solution: "Long-Term Brand Value", iconPath: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" }
          ].map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white dark:bg-gray-900 rounded-2xl xs:rounded-3xl p-4 xs:p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-3 xs:gap-4 mb-4 xs:mb-6">
                <div className="w-10 h-10 xs:w-12 xs:h-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 xs:w-6 xs:h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mb-0.5 xs:mb-1">Challenge</p>
                  <h3 className="text-base xs:text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-snug">{item.challenge}</h3>
                </div>
              </div>

              <div className="w-px h-6 xs:h-8 bg-gray-200 dark:bg-gray-800 ml-5 xs:ml-6 mb-4 xs:mb-6 relative">
                 <div className="absolute top-1/2 -translate-y-1/2 -left-[5px] w-0 h-0 border-l-[6px] border-l-transparent border-t-[8px] border-t-gray-300 dark:border-t-gray-700 border-r-[6px] border-r-transparent"></div>
              </div>

              <div className="flex items-center gap-3 xs:gap-4">
                <div className="w-10 h-10 xs:w-12 xs:h-12 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5 xs:w-6 xs:h-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] xs:text-xs text-primary-600/70 dark:text-primary-400/70 font-medium uppercase tracking-wider mb-0.5 xs:mb-1">Solution</p>
                  <h3 className="text-base xs:text-lg sm:text-xl font-bold text-primary-700 dark:text-primary-400 leading-snug">{item.solution}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Closing Line */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto bg-gray-50 dark:bg-white/5 rounded-xl xs:rounded-2xl p-4 xs:p-6 sm:p-8 md:p-10 border border-gray-100 dark:border-white/10"
        >
          <div className="border-l-4 border-primary-500 pl-3.5 xs:pl-6 md:pl-8">
            <p className="text-gray-900 dark:text-white font-medium italic text-sm xs:text-base sm:text-xl md:text-2xl leading-relaxed">
              &quot;Unlike traditional agencies focused only on vanity metrics, NearGrow Ads creates marketing systems engineered for actual business performance and improved revenue.&quot;
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
