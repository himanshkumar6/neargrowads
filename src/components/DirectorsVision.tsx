"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const QuoteMark = ({ className }: { className?: string }) => (
  <svg 
    width="48" height="48" viewBox="0 0 24 24" fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M10 9C10 7.34315 8.65685 6 7 6C5.34315 6 4 7.34315 4 9C4 11.2091 5.79086 13 8 13V15C4.68629 15 2 12.3137 2 9C2 6.23858 4.23858 4 7 4C9.76142 4 12 6.23858 12 9V14H10V9ZM22 9C22 7.34315 20.6569 6 19 6C17.3431 6 16 7.34315 16 9C16 11.2091 17.7909 13 20 13V15C16.6863 15 14 12.3137 14 9C14 6.23858 16.2386 4 19 4C21.7614 4 24 6.23858 24 9V14H22V9Z" />
  </svg>
);

export default function DirectorsVision() {
  return (
    <section className="pt-10 pb-4 md:pt-16 md:pb-8 bg-gray-50 dark:bg-[#050b14]">
      <div className="container mx-auto px-3 xs:px-4 md:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl xs:rounded-3xl md:rounded-[2.5rem] overflow-hidden bg-primary-900 shadow-2xl"
        >
          {/* Topographical Wavy Background Pattern */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 1200 800' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,50 Q100,0 200,50 T400,50 T600,50 T800,50 T1000,50 T1200,50' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3Cpath d='M0,150 Q150,100 300,150 T600,150 T900,150 T1200,150' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3Cpath d='M0,250 Q200,200 400,250 T800,250 T1200,250' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3Cpath d='M0,350 Q100,300 200,350 T400,350 T600,350 T800,350 T1000,350 T1200,350' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3Cpath d='M0,450 Q250,400 500,450 T1000,450 T1200,450' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3Cpath d='M0,550 Q150,500 300,550 T600,550 T900,550 T1200,550' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3Cpath d='M0,650 Q200,600 400,650 T800,650 T1200,650' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3Cpath d='M0,750 Q100,700 200,750 T400,750 T600,750 T800,750 T1000,750 T1200,750' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3C/svg%3E")`,
              backgroundSize: '100% 100%',
              backgroundPosition: 'center',
            }}
          />

          <div className="relative z-10 py-8 xs:py-10 px-3.5 xs:px-5 sm:px-8 md:py-16 md:px-16 lg:px-24 flex flex-col items-center">
            
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 xs:mb-12 md:mb-16 text-center tracking-tight">
              Founder&apos;s Vision
            </h2>

            <div className="w-full relative px-0 sm:px-4 md:px-12 mt-2 xs:mt-4 md:mt-0">
              <div className="absolute -top-6 -left-0.5 xs:-top-8 xs:-left-1 md:-top-12 md:-left-6 text-white pointer-events-none">
                <QuoteMark className="w-6 h-6 xs:w-8 xs:h-8 md:w-16 md:h-16 opacity-80" />
              </div>

              <div className="text-white space-y-4 xs:space-y-5 md:space-y-8 text-center text-[13.5px] xs:text-[15px] sm:text-base md:text-lg lg:text-xl font-medium leading-[1.65] xs:leading-[1.7] md:leading-relaxed px-1 xs:px-2 sm:px-4 md:px-8">
                <p>
                  At NearGrow Ads, we believe every local business has a distinct service, community presence, and identity that deserves to be discovered by nearby customers who need it.
                </p>
                <p>
                  Our vision is to empower local businesses to establish prominent Google Business Profiles, run targeted and cost-efficient ads, and achieve sustainable customer acquisition without bloated agency retainers or empty promises.
                </p>
                <p>
                  We focus on practical execution—clear local SEO, accurate conversion tracking, compelling creative content, and transparent communication that builds long-term local brand equity.
                </p>
              </div>

              <div className="absolute -bottom-6 -right-0.5 xs:-bottom-8 xs:-right-1 md:-bottom-12 md:-right-6 text-white rotate-180 pointer-events-none">
                <QuoteMark className="w-6 h-6 xs:w-8 xs:h-8 md:w-16 md:h-16 opacity-80" />
              </div>
            </div>

            <div className="w-full flex flex-col justify-center items-center mt-8 xs:mt-12 md:mt-24 px-0 md:px-8">
              <div className="text-center">
                <h4 className="text-white font-bold text-base xs:text-lg md:text-xl mb-1">Ajay Singh</h4>
                <p className="text-white/60 text-xs md:text-sm font-medium">Founder</p>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
