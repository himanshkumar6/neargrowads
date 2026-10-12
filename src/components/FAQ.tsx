"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { faqs } from "@/data/faqs";
import { Plus, Minus } from "lucide-react";
import { fadeUp } from "@/lib/animations";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative py-16 md:py-24 bg-white dark:bg-[#050b14] overflow-hidden">

      {/* ── Mesh Orbs (same pattern as Testimonials) ── */}
      <div
        className="absolute -top-1/4 -left-[10%] hidden md:block w-[50%] h-[80%] rounded-full pointer-events-none animate-[pulse_9s_ease-in-out_infinite] will-change-opacity transform-gpu"
        style={{ background: "radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-1/4 -right-[10%] hidden md:block w-[45%] h-[70%] rounded-full pointer-events-none animate-[pulse_11s_ease-in-out_infinite_reverse] will-change-opacity transform-gpu"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)" }}
      />

      {/* Ice Giant Planet (dark only) */}
      <div className="absolute hidden md:dark:block right-[5%] top-[15%] w-[100px] h-[100px] md:w-[200px] md:h-[200px] pointer-events-none z-0 will-change-transform transform-gpu" style={{
        animation: "planetBounce 15s infinite",
        animationDelay: "-2s",
      }}>
         <div className="absolute inset-0 rounded-full" style={{
            background: "radial-gradient(circle at 35% 35%, #93c5fd 0%, #3b82f6 40%, #1e3a8a 100%)",
            boxShadow: "0 0 40px 10px rgba(59, 130, 246, 0.2), inset -15px -15px 30px rgba(0, 0, 0, 0.7)",
         }}>
            <div className="absolute inset-0 rounded-full overflow-hidden animate-[planetSpin_40s_linear_infinite]">
               <div className="absolute top-[40%] left-[20%] w-[40%] h-[20%] bg-blue-900/30 blur-[4px] rounded-full" />
               <div className="absolute top-[60%] left-[60%] w-[30%] h-[15%] bg-indigo-900/40 blur-[3px] rounded-full" />
            </div>
         </div>
      </div>

      <div className="container relative z-10 mx-auto px-3 xs:px-4 md:px-8 max-w-4xl">

        {/* ── Section Header ── */}
        <div className="text-center mb-10 xs:mb-12 md:mb-16">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} variants={fadeUp}
            className="font-sans font-semibold sm:font-bold text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight flex flex-wrap justify-center gap-1.5 xs:gap-2 mb-3.5 xs:mb-4"
          >
            <span className="text-slate-900 dark:text-white">Frequently</span>
            <span className="text-slate-900 dark:text-white">Asked</span>
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-500 to-amber-400">Questions</span>
          </motion.h2>
          <motion.p
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} variants={fadeUp}
            className="font-sans font-normal sm:font-medium text-sm xs:text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400"
          >
            Everything you need to know about working with <strong className="font-semibold text-slate-900 dark:text-white">NearGrow Ads</strong>.
          </motion.p>
        </div>

        {/* ── FAQ Items ── */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUp}
          className="space-y-3 md:space-y-4"
        >
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const panelId = `faq-panel-${index}`;
            return (
              <div
                key={index}
                className={`relative overflow-hidden rounded-2xl md:rounded-3xl border-2 transition-all duration-500 ${
                  isOpen
                    ? "border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0a1222] shadow-[0_8px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
                    : "border-slate-200/90 dark:border-slate-800/80 bg-slate-50/80 dark:bg-[#080e1a]/90 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm"
                }`}
              >
                {/* Corner Slash */}
                <div
                  className={`absolute bottom-0 right-0 w-[35%] h-[80%] pointer-events-none transition-opacity duration-500 ${isOpen ? "opacity-[0.08] dark:opacity-[0.14]" : "opacity-[0.03] dark:opacity-[0.06]"}`}
                  style={{
                    clipPath: "polygon(100% 0%, 100% 100%, 0% 100%)",
                    background: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
                  }}
                />

                {/* Question Row */}
                <button
                  className="relative z-10 w-full px-3.5 xs:px-5 py-4 xs:py-5 sm:px-7 sm:py-6 text-left flex justify-between items-start gap-2.5 xs:gap-4 focus:outline-none group cursor-pointer"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                >
                  <span
                    className={`font-sans font-semibold text-sm xs:text-base sm:text-lg md:text-xl tracking-tight transition-colors duration-300 flex-1 leading-snug pt-0.5 ${
                      isOpen
                        ? "text-secondary-600 dark:text-secondary-400"
                        : "text-slate-900 dark:text-white group-hover:text-secondary-600 dark:group-hover:text-secondary-400"
                    }`}
                  >
                    {faq.question}
                  </span>

                  {/* +/- Icon */}
                  <div
                    className={`shrink-0 w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 mt-0.5 sm:mt-1 ${
                      isOpen
                        ? "bg-secondary-500 border-secondary-500 text-white rotate-0 shadow-md shadow-secondary-500/25"
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 group-hover:border-secondary-400 dark:group-hover:border-secondary-400"
                    }`}
                  >
                    {isOpen ? <Minus size={15} /> : <Plus size={15} />}
                  </div>
                </button>

                {/* Answer */}
                <div
                  id={panelId}
                  className={`relative z-10 grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-3.5 xs:px-5 pb-5 xs:pb-6 sm:px-7 sm:pb-7 border-t border-slate-200 dark:border-slate-800/80 pt-3.5 xs:pt-4">
                        <p className="font-sans font-normal text-xs xs:text-sm sm:text-base md:text-lg leading-relaxed text-balance text-slate-700 dark:text-slate-300 [&_strong]:font-semibold [&_strong]:text-slate-900 dark:[&_strong]:text-white">
                          <span dangerouslySetInnerHTML={{ __html: faq.answer }} />
                        </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
