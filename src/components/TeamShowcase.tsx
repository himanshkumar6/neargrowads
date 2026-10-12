"use client";

import { useRef, useEffect, useSyncExternalStore } from "react";
import { motion, useTransform, useSpring, useReducedMotion, useMotionTemplate, useMotionValue, type MotionValue } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { teamMembers } from "@/data/teamMembers";
import { fadeUp } from "@/lib/animations";

const Card = ({ 
  member, 
  index, 
  total, 
  globalRotation,
  isMobile 
}: { 
  member: (typeof teamMembers)[0]; 
  index: number; 
  total: number; 
  globalRotation: MotionValue<number>;
  isMobile: boolean;
}) => {
  const prefersReducedMotion = useReducedMotion();
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  const angleIncrement = 360 / total;
  
  const centerIndex = Math.floor(total / 2);
  const cardAngle = (index - centerIndex) * angleIncrement;

  const rotateYRaw = useTransform(globalRotation, (y: number) => y + cardAngle);
  
  const rotateY = useSpring(rotateYRaw, { 
    stiffness: prefersReducedMotion ? 1000 : 400, 
    damping: prefersReducedMotion ? 100 : 50 
  });

  const normalizedAngle = useTransform(rotateYRaw, (y: number) => {
    let normalized = y % 360;
    if (normalized > 180) normalized -= 360;
    if (normalized < -180) normalized += 360;
    return normalized;
  });

  const brightnessRaw = useTransform(normalizedAngle, [-60, 0, 60], [0.9, 1.1, 0.9]);
  const brightness = useSpring(brightnessRaw, { stiffness: 400, damping: 50 });
  
  const opacityRaw = useTransform(normalizedAngle, [-90, -70, 0, 70, 90], [0, 1, 1, 1, 0]);
  const opacity = useSpring(opacityRaw, { stiffness: 400, damping: 50 });

  const filter = useMotionTemplate`brightness(${brightness})`;

  // Dynamic Radius Calculation for the Concave Bowl!
  // Instead of hardcoding 720px, we mathematically compute the perfect radius so cards 
  // always have a tight, consistent gap regardless of how many team members exist!
  const cardWidth = isMobile ? 280 : 320;
  // radius = (cardWidth / 2) / tan(PI / total)
  const calculatedRadius = Math.round((cardWidth / 2) / Math.tan(Math.PI / total));
  // Add a little extra padding for a visual gap between cards
  const dynamicRadius = Math.max(isMobile ? 400 : 500, calculatedRadius + (isMobile ? 40 : 60));

  return (
    <motion.div
      style={{
        rotateY,
        opacity,
        filter,
        // SENIOR FIX: The radius is now perfectly dynamic! It scales mathematically 
        // to fit 3, 5, 7, or 50 cards without breaking layout or overlapping!
        transformOrigin: mounted
          ? `center center ${dynamicRadius}px`
          : "center center 800px",
        transformStyle: "preserve-3d"
      }}
      className="group absolute inset-0 w-full h-full rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] will-change-transform [mask-image:-webkit-radial-gradient(white,black)] [-webkit-mask-image:-webkit-radial-gradient(white,black)]"
    >
      <Image
        src={member.image}
        alt={member.name}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 320px, 350px"
        className="object-cover pointer-events-none transition-transform duration-700 ease-out group-hover:scale-110"
        priority={Math.abs(index - Math.floor(total / 2)) <= 2}
        loading={Math.abs(index - Math.floor(total / 2)) > 2 ? "lazy" : undefined}
      />
      
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none opacity-100 rounded-b-2xl md:rounded-b-3xl" />
      
      <div className="absolute bottom-0 left-0 w-full p-3.5 xs:p-4 md:p-6 text-left pointer-events-none transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-white text-base xs:text-lg md:text-2xl font-bold tracking-tight mb-0.5 xs:mb-1 drop-shadow-md leading-tight">{member.name}</h3>
        {member.role ? (
          <p className="text-gray-200 text-[11px] xs:text-xs md:text-sm font-medium uppercase tracking-wider drop-shadow-md">{member.role}</p>
        ) : null}
      </div>
    </motion.div>
  );
};

export default function TeamShowcase() {
  const isMobile = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener('resize', onStoreChange);
      return () => window.removeEventListener('resize', onStoreChange);
    },
    () => window.innerWidth < 768,
    () => false
  );

  const loopedMembers = [...teamMembers, ...teamMembers, ...teamMembers];
  const angleIncrement = 360 / loopedMembers.length;
  const globalRotation = useMotionValue(0);

  const trackpadRef = useRef<HTMLDivElement>(null);
  const wheelTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const element = trackpadRef.current;
    if (!element) return;

    const handleNativeWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault(); 
        globalRotation.set(globalRotation.get() - e.deltaX * 0.15);

        if (wheelTimeout.current) clearTimeout(wheelTimeout.current);
        
        wheelTimeout.current = setTimeout(() => {
          const current = globalRotation.get();
          const nearestAngle = Math.round(current / angleIncrement) * angleIncrement;
          globalRotation.set(nearestAngle);
        }, 150);
      }
    };

    element.addEventListener("wheel", handleNativeWheel, { passive: false });
    return () => element.removeEventListener("wheel", handleNativeWheel);
  }, [globalRotation, angleIncrement]);

  const handleNext = () => {
    globalRotation.set(globalRotation.get() - angleIncrement);
  };

  const handlePrev = () => {
    globalRotation.set(globalRotation.get() + angleIncrement);
  };

  return (
    <section className="relative min-h-[90vh] py-12 md:py-16 bg-white dark:bg-gray-950 flex flex-col justify-center items-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary-500/10 via-transparent to-transparent opacity-80 dark:opacity-40 pointer-events-none" />

      <div className="container mx-auto px-3 xs:px-4 md:px-8 text-center relative z-20 mb-8 xs:mb-10 md:mb-20 mt-4 xs:mt-6 md:mt-1">
        <motion.span 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="text-primary-600 dark:text-primary-400 font-semibold tracking-wider uppercase text-xs xs:text-sm"
        >
          Leadership Team
        </motion.span>
        <motion.h2 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mt-3 xs:mt-4 mb-3 xs:mb-4 md:mb-6 leading-tight tracking-tight"
        >
          Team Work Makes the Dream Work
        </motion.h2>
        <motion.p 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="text-gray-600 dark:text-gray-300 text-sm xs:text-base md:text-xl max-w-2xl mx-auto leading-relaxed"
        >
          Meet the brilliant minds behind our award-winning campaigns. We combine data-driven precision with world-class creativity to scale your brand.
        </motion.p>
      </div>

      <div 
        className="w-full relative flex flex-col items-center justify-center z-10"
        style={{ perspective: "1500px" }}
      >
        <motion.div 
          ref={trackpadRef}
          className="relative w-[82vw] max-w-[340px] sm:w-[280px] md:w-[320px] lg:w-[350px] aspect-[4/5] sm:aspect-[3/4] mb-8 md:mb-12 cursor-grab active:cursor-grabbing"
          style={{ transformStyle: "preserve-3d", touchAction: "pan-y" }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }} 
          dragElastic={0} 
          onDrag={(e, info) => {
            globalRotation.set(globalRotation.get() + info.delta.x * 0.15);
          }}
          onDragEnd={(e, info) => {
            const momentum = info.velocity.x * 0.05;
            const target = globalRotation.get() + momentum;
            const nearestAngle = Math.round(target / angleIncrement) * angleIncrement;
            globalRotation.set(nearestAngle);
          }}
        >
          {loopedMembers.map((member, i) => (
            <Card 
              key={`${member.id}-${i}`} 
              member={member} 
              index={i} 
              total={loopedMembers.length} 
              globalRotation={globalRotation} 
              isMobile={isMobile}
            />
          ))}
        </motion.div>

        <div className="flex items-center gap-4 sm:gap-6 mt-2 sm:mt-4 relative z-50">
          <button 
            onClick={handlePrev} 
            className="w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/10 backdrop-blur-md border border-black/10 dark:border-white/10 text-gray-900 dark:text-white hover:bg-black/10 dark:hover:bg-white/20 transition-all shadow-sm hover:scale-105 active:scale-95 will-change-transform transform-gpu cursor-pointer"
            aria-label="Previous team member"
          >
            <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7" />
          </button>
          <button 
            onClick={handleNext}
            className="w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/10 backdrop-blur-md border border-black/10 dark:border-white/10 text-gray-900 dark:text-white hover:bg-black/10 dark:hover:bg-white/20 transition-all shadow-sm hover:scale-105 active:scale-95 will-change-transform transform-gpu cursor-pointer"
            aria-label="Next team member"
          >
            <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7" />
          </button>
        </div>
      </div>
    </section>
  );
}
