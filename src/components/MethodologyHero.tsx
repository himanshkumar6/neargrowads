"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function MethodologyHero() {
  return (
    <div className="relative pt-24 xs:pt-28 sm:pt-32 md:pt-36 pb-12 xs:pb-14 sm:pb-16 md:pb-20 text-center overflow-hidden">
      {/* Background Group Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=2000&q=80" 
          alt="NearGrow Ads Methodology and Strategy" 
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
          fetchPriority="high"
          loading="eager"
        />
        {/* Opacity Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/70 dark:bg-black/80 z-10" />
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
          Practical Growth Methodology
        </motion.h1>
        <motion.p 
          variants={fadeUp}
          className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-200 max-w-4xl mx-auto drop-shadow-md font-medium leading-relaxed"
        >
          NearGrow Ads is built on a clear principle: local businesses grow when local search visibility, targeted paid advertising, and high-converting creatives work in unison. We replace disconnected tactics with an integrated system designed to attract, engage, and convert nearby customers.
        </motion.p>
      </motion.div>
    </div>
  );
}
