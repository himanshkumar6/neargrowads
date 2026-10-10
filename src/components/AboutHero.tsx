"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function AboutHero() {
  return (
    <div className="relative pt-24 xs:pt-28 sm:pt-32 md:pt-36 pb-12 sm:pb-16 md:pb-20 text-center overflow-hidden">
      {/* Background Group Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80" 
          alt="NearGrow Ads Team working together" 
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        {/* Opacity Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/60 dark:bg-black/80 z-10" />
      </div>

      {/* Content */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-50px" }}
        className="relative z-20 container mx-auto px-3 xs:px-4 md:px-8"
      >
        <motion.h1 
          variants={fadeUp}
          className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 xs:mb-4 sm:mb-6 drop-shadow-lg tracking-tight"
        >
          About NearGrow Ads
        </motion.h1>
        <motion.p 
          variants={fadeUp}
          className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto drop-shadow-md font-medium leading-relaxed"
        >
          We help local businesses and emerging regional brands grow through high-visibility Google Business Profiles, targeted local advertising, and practical customer acquisition systems.
        </motion.p>
      </motion.div>
    </div>
  );
}
