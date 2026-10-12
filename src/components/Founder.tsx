"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { founders } from "@/data/founder";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function Founder() {
  return (
    <section className="py-12 xs:py-16 md:py-20 lg:py-24 bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="container mx-auto px-3 xs:px-4 md:px-8">
        <div className="text-center max-w-5xl mx-auto mb-12 xs:mb-14 lg:mb-20">
          <motion.span 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-primary-600 dark:text-primary-400 font-semibold tracking-wider uppercase text-xs xs:text-sm mb-3 xs:mb-4 block"
          >
            Leadership Team
          </motion.span>
          <motion.h2 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-2xl xs:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 xs:mb-6 tracking-tight text-balance"
          >
            The Leadership Behind NearGrow Ads
          </motion.h2>
          <motion.p 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-gray-700 dark:text-gray-300 text-sm xs:text-base sm:text-lg max-w-2xl mx-auto"
          >
            A collective of industry veterans dedicated to engineering scalable growth.
          </motion.p>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6 lg:gap-6 pt-4 pb-8 lg:pt-8 lg:pb-16 items-start"
        >
          {founders.map((founder, index) => {
            // Center two (Ajay Singh & Himanshu) slightly raised upward, outer two (Jyoti & Harsh) pushed downward
            const offsetClass = (index === 1 || index === 2) 
              ? "lg:-translate-y-7" 
              : "lg:translate-y-7";

            return (
              <motion.div
                key={founder.id}
                variants={fadeUp}
                className={`h-full flex flex-col transition-transform duration-500 ${offsetClass}`}
              >
                <div
                  className="h-full flex flex-col bg-white dark:bg-gray-950 rounded-2xl xs:rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800/80 hover:shadow-2xl dark:hover:shadow-primary-950/40 transition-all duration-300 group hover:border-primary-500/40"
                >
                  {/* Founder Image Mock */}
                  <div className="relative h-60 xs:h-64 sm:h-72 w-full overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                    <Image
                      src={founder.image}
                      alt={founder.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity duration-300" />
                  </div>

                  {/* Founder Details */}
                  <div className="p-4 xs:p-5 sm:p-5 flex flex-col flex-1 justify-between bg-white dark:bg-gray-950">
                    <div>
                      {/* Position & Socials */}
                      <div className="flex items-center justify-between gap-1.5 mb-2">
                        <span className="text-primary-600 dark:text-primary-400 font-semibold text-[10.5px] sm:text-xs uppercase tracking-wider">
                          {founder.position}
                        </span>
                        <div className="flex gap-1.5 shrink-0">
                          {founder.linkedin && (
                            <a 
                              href={founder.linkedin} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-500 hover:text-[#0077b5] dark:hover:text-[#0a66c2] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" 
                              aria-label={`Connect with ${founder.name} on LinkedIn`}
                            >
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                              </svg>
                            </a>
                          )}
                          {founder.email && (
                            <a 
                              href={founder.email} 
                              className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-500 hover:text-[#EA4335] dark:hover:text-[#EA4335] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" 
                              aria-label={`Email ${founder.name}`}
                            >
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-9.458l4.623 3.746zm-4.141-5.929h19.035l-9.517 7.713-9.518-7.713zm5.694 7.188l3.824 3.099 3.83-3.104 5.612 6.817h-18.779l5.513-6.812zm9.208-1.264l4.616-3.741v9.348l-4.616-5.607z" />
                              </svg>
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Founder Name - Strictly single line */}
                      <h3 className="text-[15px] sm:text-base lg:text-[17px] font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors whitespace-nowrap mb-2 leading-snug">
                        {founder.name}
                      </h3>

                      {/* Mock Story / Description */}
                      <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed line-clamp-3">
                        {founder.story}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
