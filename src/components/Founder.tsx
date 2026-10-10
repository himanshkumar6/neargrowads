"use client";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { founders } from "@/data/founder";
import { fadeUp, staggerContainer } from "@/lib/animations";

const StoryText = ({ text }: { text: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Custom logic to truncate precisely after "transparent governance," as requested
  const splitIndex = text.indexOf('transparent governance,');
  const truncateAt = splitIndex !== -1 ? splitIndex + 23 : 150;
  
  // Don't truncate if the text is already short enough
  if (text.length <= truncateAt + 20) {
    return <>{text}</>;
  }

  const displayText = isExpanded ? text : text.substring(0, truncateAt) + "...";

  return (
    <>
      {displayText}
      <button 
        onClick={(e) => {
          e.preventDefault();
          setIsExpanded(!isExpanded);
        }}
        className="text-primary-600 dark:text-primary-400 font-semibold ml-1 hover:text-primary-700 dark:hover:text-primary-300 transition-colors focus:outline-none not-italic inline-block"
      >
        {isExpanded ? "See less" : "See more"}
      </button>
    </>
  );
};

export default function Founder() {
  return (
    <section className="py-10 xs:py-12 md:py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-3 xs:px-4 md:px-8">
        <div className="text-center max-w-5xl mx-auto mb-10 xs:mb-12 lg:mb-16">
          <motion.span 
            initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeUp}
            className="text-primary-600 dark:text-primary-400 font-semibold tracking-wider uppercase text-xs xs:text-sm mb-3 xs:mb-4 block"
          >
            Leadership Team
          </motion.span>
          <motion.h2 
            initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeUp}
            className="text-2xl xs:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 xs:mb-6 tracking-tight text-balance"
          >
            The Leadership Behind NearGrow Ads
          </motion.h2>
          <motion.p 
            initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeUp}
            className="text-gray-700 dark:text-gray-300 text-sm xs:text-base sm:text-lg max-w-2xl mx-auto"
          >
            A collective of industry veterans dedicated to engineering scalable growth.
          </motion.p>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xs:gap-8 lg:gap-10 lg:pb-16"
        >
          {founders.map((founder, index) => (
            <motion.div
              key={founder.id}
              variants={fadeUp}
              className="h-full flex flex-col"
            >
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: index * 0.8
                }}
                className="h-full flex flex-col bg-white dark:bg-gray-950 rounded-2xl xs:rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 hover:shadow-2xl dark:hover:shadow-primary-900/20 transition-all duration-300 group"
              >
                <div className="relative h-72 xs:h-80 w-full bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0">
                  <Image
                    src={founder.image}
                    alt={founder.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-4 xs:p-6 md:p-8 flex flex-col">
                  <div className="flex justify-between items-start mb-3 xs:mb-4 gap-2">
                    <div>
                      <h3 className="text-xl xs:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{founder.name}</h3>
                      <p className="text-primary-600 dark:text-primary-400 font-medium mt-1 text-xs xs:text-sm uppercase tracking-wide">{founder.position}</p>
                    </div>
                    <div className="flex gap-2.5 xs:gap-3 mt-1 shrink-0">
                      <a href={founder.linkedin} target="_blank" rel="noopener noreferrer" className="p-1 text-gray-400 dark:text-gray-500 hover:text-[#0077b5] dark:hover:text-[#0a66c2] transition-colors" aria-label={`Connect with ${founder.name} on LinkedIn`}>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                        </svg>
                      </a>
                      <a href={founder.email} className="p-1 text-gray-400 dark:text-gray-500 hover:text-[#EA4335] dark:hover:text-[#EA4335] transition-colors" aria-label={`Email ${founder.name}`}>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-9.458l4.623 3.746zm-4.141-5.929h19.035l-9.517 7.713-9.518-7.713zm5.694 7.188l3.824 3.099 3.83-3.104 5.612 6.817h-18.779l5.513-6.812zm9.208-1.264l4.616-3.741v9.348l-4.616-5.607z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                  <div className="relative mt-3 xs:mt-4">
                    <svg className="absolute -top-2 -left-2 w-8 h-8 text-gray-100 dark:text-gray-800 -z-10 transform transition-colors group-hover:text-primary-50 dark:group-hover:text-primary-900/30" fill="currentColor" viewBox="0 0 300 300">
                      <path d="M103.23 145.98c-24.42-11.67-29.98-44.15-10.47-62.91 4.5-4.97 15.66-9.15 10.79-17.58-2.29-3.84-7.25-5.03-11.05-2.67-40.13 28.21-76.9 64.95-68.47 129.87 7.69 59.24 105.24 63.52 107.08-2.53 0-19.63-11.51-36.35-27.88-44.18zm146.08 0c-24.42-11.67-29.98-44.15-10.47-62.91 4.5-4.97 15.66-9.15 10.79-17.58-2.29-3.84-7.25-5.03-11.05-2.67-40.13 28.21-76.9 64.95-68.47 129.87 7.69 59.24 105.24 63.52 107.08-2.53 0-19.63-11.51-36.35-27.88-44.18z" />
                    </svg>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-xs xs:text-sm relative z-10 italic">
                      <StoryText text={founder.story} />
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
