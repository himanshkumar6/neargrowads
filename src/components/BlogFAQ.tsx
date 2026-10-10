"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface FAQItem {
  question: string;
  answer: string;
}

interface BlogFAQProps {
  faqs: FAQItem[];
  title?: string;
}

export default function BlogFAQ({ faqs, title = "Frequently Asked Questions" }: BlogFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  // Generate JSON-LD Schema for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-10 md:py-16 neargrow-faqs">
      {/* ── SEO JSON-LD Injection ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-6 md:mb-8 pb-3 border-b border-slate-200 dark:border-white/10 tracking-tight">
        {title}
      </h2>

      <div className="space-y-2.5 sm:space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          const panelId = `blog-faq-panel-${index}`;
          const buttonId = `blog-faq-button-${index}`;

          return (
            <div
              key={index}
              className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                isOpen
                  ? "bg-white dark:bg-[#0b1322] border-emerald-500/40 dark:border-emerald-500/35 shadow-md dark:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.5)]"
                  : "bg-slate-50 dark:bg-[#0d1627] hover:bg-slate-100 dark:hover:bg-[#121e35] border-slate-200/90 dark:border-white/8 shadow-xs"
              }`}
            >
              <h3 className="m-0">
                <button
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleAccordion(index)}
                  className="flex items-center justify-between w-full p-4 sm:p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer group"
                >
                  <span className={`text-base sm:text-lg font-semibold tracking-tight transition-colors pr-4 ${
                    isOpen 
                      ? "text-slate-950 dark:text-white" 
                      : "text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
                  }`}>
                    {faq.question}
                  </span>
                  <div
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-light leading-none transition-transform duration-300 ${
                      isOpen
                        ? "rotate-45 text-rose-500 dark:text-rose-400"
                        : "text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    +
                  </div>
                </button>
              </h3>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
                      opacity: { duration: 0.2, delay: 0.05 },
                    }}
                    className="overflow-hidden border-t border-slate-200 dark:border-white/8 bg-slate-50/70 dark:bg-[#080e1a]/60"
                  >
                    <div className="p-4 sm:p-6 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
                      {/* Using dangerouslySetInnerHTML in case the answer contains bolding/links from the rich text editor */}
                      <p dangerouslySetInnerHTML={{ __html: faq.answer }} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
