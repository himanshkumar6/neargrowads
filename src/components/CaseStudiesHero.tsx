"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function CaseStudiesHero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#f3fbf9] dark:bg-slate-950 pt-24 xs:pt-28 pb-16 xs:pb-20 md:pt-32 md:pb-28">
      {/* Abstract Background Elements (Light Pluses & Dots) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg className="absolute top-1/4 right-1/4 opacity-20 dark:opacity-10" width="20" height="20" viewBox="0 0 20 20">
          <path d="M9 0h2v20H9z" fill="#3ca2d9" />
          <path d="M0 9h20v2H0z" fill="#3ca2d9" />
        </svg>
        <svg className="absolute top-1/3 left-1/3 opacity-20 dark:opacity-10" width="20" height="20" viewBox="0 0 20 20">
          <path d="M9 0h2v20H9z" fill="#3ca2d9" />
          <path d="M0 9h20v2H0z" fill="#3ca2d9" />
        </svg>
        <div className="absolute top-1/2 left-[10%] w-2 h-2 rounded-full bg-orange-400 opacity-20 dark:opacity-10" />
        <div className="absolute top-[20%] right-[10%] w-3 h-3 rounded-full bg-purple-400 opacity-20 dark:opacity-10" />
      </div>

      <div className="container mx-auto px-3 xs:px-4 md:px-8 max-w-6xl relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 xs:gap-10 md:gap-8">
          
          {/* Left Column: Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 w-full max-w-xl text-center md:text-left"
          >
            {/* Category / Sub-heading */}
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#6D5D9B] dark:text-[#a594dc] mb-4 xs:mb-6 md:mb-12">
              Success Stories
            </h2>
            
            {/* Main Headline */}
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-[3.5rem] leading-tight text-[#1B143F] dark:text-white mb-4 xs:mb-6 tracking-tight">
              <span className="font-light">Growth &amp; Local</span> <span className="font-bold">Case Studies</span>
            </h1>
            
            {/* Paragraph Description */}
            <p className="text-sm xs:text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-md mx-auto md:mx-0">
              Discover how our integrated digital growth strategies have helped businesses strengthen local visibility, generate qualified inquiries, and achieve sustainable revenue growth.
            </p>
          </motion.div>

          {/* Right Column: Illustration */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="flex-1 w-full flex justify-center md:justify-end relative transform-gpu will-change-transform"
          >
            {/* Organic curved crop luxury hotel image */}
            <div 
              className="relative w-full max-w-[500px] aspect-[4/3] overflow-hidden shadow-2xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] dark:brightness-90 bg-white/50 dark:bg-white/5 backdrop-blur-sm transform-gpu"
              style={{ borderRadius: "50%" }}
            >
              <Image 
                src="https://ik.imagekit.io/rrcdbevrb/AYU08906.jpg" 
                alt="Luxury Resort Case Study" 
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 500px"
              />
            </div>
          </motion.div>

        </div>
      </div>

      {/* Bottom Wavy Curve separating section */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-0">
        <svg 
          className="relative block w-full h-[60px] md:h-[100px]" 
          data-name="Layer 1" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,119.5,193.31,104.22c60.3-14.73,121.71-33.15,183.08-47.78Z" 
            className="fill-gray-50 dark:fill-[#050b14]" 
          />
        </svg>
      </div>
    </section>
  );
}
