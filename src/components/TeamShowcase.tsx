"use client";

import { useState, useRef, useEffect, useSyncExternalStore } from "react";
import { motion, useTransform, useSpring, useReducedMotion, useMotionTemplate, useMotionValue, type MotionValue } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { teamMembers } from "@/data/teamMembers";

interface CardProps {
  member: (typeof teamMembers)[0];
  index: number;
  total: number;
  globalRotation: MotionValue<number>;
  dynamicRadius: number;
  cardWidth: number;
  cardHeight: number;
  isActive: boolean;
  onSelect: () => void;
}

const Card = ({ 
  member, 
  index, 
  total, 
  globalRotation,
  dynamicRadius,
  cardWidth,
  cardHeight,
  isActive,
  onSelect,
}: CardProps) => {
  const prefersReducedMotion = useReducedMotion();
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  const angleIncrement = 360 / total;
  const centerIndex = Math.floor(total / 2);

  // In LTR coordinate space with positive Z origin:
  // Negating the angle ensures:
  // - index (k + 1) [NEXT member in data] has NEGATIVE angle -> placed on RIGHT (positive X)
  // - index (k - 1) [PREVIOUS member in data] has POSITIVE angle -> placed on LEFT (negative X)
  const cardAngle = -(index - centerIndex) * angleIncrement;

  const rotateYRaw = useTransform(globalRotation, (y: number) => y + cardAngle);
  
  const rotateY = useSpring(rotateYRaw, { 
    stiffness: prefersReducedMotion ? 1000 : 380, 
    damping: prefersReducedMotion ? 100 : 45 
  });

  const normalizedAngle = useTransform(rotateYRaw, (y: number) => {
    let normalized = y % 360;
    if (normalized > 180) normalized -= 360;
    if (normalized < -180) normalized += 360;
    return normalized;
  });

  // Center card is highlighted, side cards subtly dimmed
  const brightnessRaw = useTransform(normalizedAngle, [-60, 0, 60], [0.92, 1.02, 0.92]);
  const brightness = useSpring(brightnessRaw, { stiffness: 380, damping: 45 });
  
  // Smoothly taper opacity for cylinder turnaround while keeping 5 center/flanking cards crisp
  const opacityRaw = useTransform(normalizedAngle, [-80, -65, -45, 0, 45, 65, 80], [0, 0.6, 1, 1, 1, 0.6, 0]);
  const opacity = useSpring(opacityRaw, { stiffness: 380, damping: 45 });

  const filter = useMotionTemplate`brightness(${brightness})`;

  return (
    <motion.div
      onClick={onSelect}
      data-member-name={member.name}
      data-card-index={index}
      data-is-active={isActive ? "true" : "false"}
      aria-current={isActive ? "true" : undefined}
      style={{
        rotateY,
        opacity,
        filter,
        transformOrigin: mounted
          ? `center center ${dynamicRadius}px`
          : `center center ${dynamicRadius}px`,
        transformStyle: "preserve-3d",
        width: cardWidth,
        height: cardHeight,
      }}
      className="group absolute inset-0 rounded-2xl sm:rounded-3xl lg:rounded-[28px] overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.24)] dark:shadow-[0_16px_44px_rgba(0,0,0,0.5)] border border-black/5 dark:border-white/10 will-change-transform cursor-pointer select-none [mask-image:-webkit-radial-gradient(white,black)] [-webkit-mask-image:-webkit-radial-gradient(white,black)]"
    >
      <Image
        src={member.image}
        alt={member.name}
        fill
        sizes="(max-width: 640px) 260px, (max-width: 1024px) 320px, (max-width: 1280px) 390px, (max-width: 1536px) 450px, 520px"
        style={{ objectPosition: member.objectPosition || "center 20%" }}
        className="object-cover pointer-events-none transition-transform duration-700 ease-out group-hover:scale-105"
        priority={Math.abs(index - centerIndex) <= 2}
        loading={Math.abs(index - centerIndex) > 2 ? "lazy" : undefined}
      />
      
      {/* Refined gradient scrim for readable text without covering face */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none rounded-2xl sm:rounded-3xl lg:rounded-[28px]" />
      
      {/* Member Name Label */}
      <div className="absolute bottom-0 left-0 w-full p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8 text-left pointer-events-none transform translate-y-0.5 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-white text-base sm:text-lg md:text-2xl lg:text-3xl font-bold tracking-tight drop-shadow-md leading-tight line-clamp-1">
          {member.name}
        </h3>
        {member.role ? (
          <p className="text-gray-200 text-xs sm:text-sm md:text-base font-medium uppercase tracking-wider drop-shadow-md mt-0.5 line-clamp-1">
            {member.role}
          </p>
        ) : null}
      </div>
    </motion.div>
  );
};

export default function TeamShowcase() {
  // Track viewport width for fluid, responsive calculations
  const viewportWidth = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener('resize', onStoreChange);
      return () => window.removeEventListener('resize', onStoreChange);
    },
    () => (typeof window !== 'undefined' ? window.innerWidth : 1200),
    () => 1200
  );

  // Repeat team members 3 times to provide a seamless continuous carousel
  const loopedMembers = [...teamMembers, ...teamMembers, ...teamMembers];
  const total = loopedMembers.length; // 21
  const angleIncrement = 360 / total; // ~17.14° per card
  const centerIndex = Math.floor(total / 2); // 10 (Aditya initially)

  // Authoritative active-step navigation model:
  // Step 0 = Aditya (centerIndex = 10)
  // Step +1 = Bhawna Bankoti (Next member in data order)
  // Step -1 = Harsh (Previous member in data order)
  const currentStep = useRef(0);
  const [activeStep, setActiveStep] = useState(0);
  const lastClickTime = useRef(0);
  const globalRotation = useMotionValue(0);

  const trackpadRef = useRef<HTMLDivElement>(null);
  const wheelTimeout = useRef<NodeJS.Timeout | null>(null);

  // Compute active member in team data order
  const activeDataIndex = ((centerIndex + activeStep) % teamMembers.length + teamMembers.length) % teamMembers.length;
  const activeMember = teamMembers[activeDataIndex];

  // Fluid responsive card width matching reference proportions:
  // - Mobile (<480px): 220px - 240px (preserved)
  // - Small Tablet (480-767px): 245px (preserved)
  // - Tablet (768-1023px): 285px
  // - Desktop (1024-1279px): 320px -> 370px
  // - Desktop (1280-1439px): 370px -> 415px
  // - Desktop (1440-1535px): 415px -> 440px
  // - Wide Desktop (1536-1919px): 440px -> 470px
  // - Full HD (1920-2559px): 470px -> 480px (Target reference scale: ~470px wide)
  // - Ultrawide (2560px+): Capped at 480px with bounded max width
  const cardWidth = 
    viewportWidth < 480 
      ? Math.min(Math.max(Math.round(viewportWidth * 0.64), 220), 240)
      : viewportWidth < 768 
        ? 245
        : viewportWidth < 1024 
          ? 285
          : viewportWidth < 1280
            ? Math.round(320 + ((viewportWidth - 1024) / (1280 - 1024)) * 50)
            : viewportWidth < 1440 
              ? Math.round(370 + ((viewportWidth - 1280) / (1440 - 1280)) * 45)
              : viewportWidth < 1536
                ? Math.round(415 + ((viewportWidth - 1440) / (1536 - 1440)) * 25)
                : viewportWidth < 1920
                  ? Math.round(440 + ((viewportWidth - 1536) / (1920 - 1536)) * 30)
                  : viewportWidth < 2560
                    ? Math.round(470 + ((viewportWidth - 1920) / (2560 - 1920)) * 10)
                    : 480;

  // Strict 3:4 portrait ratio (~470px wide -> ~627px tall)
  const cardHeight = Math.round(cardWidth * (4 / 3));

  // Narrow, consistent visual gaps matching reference (approx 20-26px on desktop)
  const cardGap = 
    viewportWidth < 640 
      ? 16 
      : viewportWidth < 1024 
        ? 20 
        : viewportWidth < 1440
          ? 22
          : viewportWidth < 1920
            ? 24
            : 26;

  // Mathematically exact radius: chord distance between adjacent card centers = (cardWidth + cardGap)
  // Guarantees an exact, consistent visible gap between adjacent cards regardless of card size
  const effectiveSpacing = cardWidth + cardGap;
  const dynamicRadius = Math.round((effectiveSpacing / 2) / Math.sin(Math.PI / total));

  // Dynamic perspective tuned for smooth cylindrical curve
  const perspective = 
    viewportWidth < 768 
      ? "2000px" 
      : viewportWidth < 1280 
        ? "2600px" 
        : viewportWidth < 1920 
          ? "3200px" 
          : "3500px";

  // Preserve alignment on resize without resetting active member
  useEffect(() => {
    globalRotation.set(currentStep.current * angleIncrement);
  }, [viewportWidth, angleIncrement, globalRotation]);

  useEffect(() => {
    const element = trackpadRef.current;
    if (!element) return;

    const handleNativeWheel = (e: WheelEvent) => {
      // Horizontal trackpad scrolling:
      // Swiping two fingers left (deltaX > 0) advances track left towards next card (+rotation)
      // Swiping two fingers right (deltaX < 0) returns track right towards previous card (-rotation)
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault(); 
        globalRotation.set(globalRotation.get() + e.deltaX * 0.12);

        if (wheelTimeout.current) clearTimeout(wheelTimeout.current);
        
        wheelTimeout.current = setTimeout(() => {
          const current = globalRotation.get();
          const nearestStep = Math.round(current / angleIncrement);
          currentStep.current = nearestStep;
          globalRotation.set(nearestStep * angleIncrement);
          setActiveStep(nearestStep);
        }, 150);
      }
    };

    element.addEventListener("wheel", handleNativeWheel, { passive: false });
    return () => element.removeEventListener("wheel", handleNativeWheel);
  }, [globalRotation, angleIncrement]);

  // Deterministic Navigation:
  // Right arrow (NEXT team member):
  // The next member sits on the right. Advancing to the next member rotates
  // the cylinder so the track moves LEFT, bringing the next member into center.
  const handleNext = () => {
    const now = Date.now();
    if (now - lastClickTime.current < 160) return; // Debounce rapid click bounce
    lastClickTime.current = now;

    currentStep.current += 1;
    globalRotation.set(currentStep.current * angleIncrement);
    setActiveStep(currentStep.current);
  };

  // Left arrow (PREVIOUS team member):
  // The previous member sits on the left. Returning to the previous member rotates
  // the cylinder so the track moves RIGHT, bringing the previous member into center.
  const handlePrev = () => {
    const now = Date.now();
    if (now - lastClickTime.current < 160) return; // Debounce rapid click bounce
    lastClickTime.current = now;

    currentStep.current -= 1;
    globalRotation.set(currentStep.current * angleIncrement);
    setActiveStep(currentStep.current);
  };

  return (
    <section 
      id="team"
      role="region"
      aria-label="Leadership Team Showcase"
      className="relative scroll-mt-16 sm:scroll-mt-20 py-8 sm:py-10 md:py-12 lg:py-14 bg-white dark:bg-gray-950 flex flex-col justify-center items-center overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary-500/10 via-transparent to-transparent opacity-80 dark:opacity-40 pointer-events-none" />

      {/* Section Header */}
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 md:px-8 text-center relative z-20 mb-4 sm:mb-6 md:mb-8">
        <span className="text-[#68B955] font-semibold tracking-wider uppercase text-xs sm:text-sm block mb-1">
          Leadership Team
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mt-1.5 mb-2 sm:mb-2.5 leading-tight tracking-tight">
          Team Work Makes the Dream Work
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Meet the brilliant minds behind our award-winning campaigns. We combine data-driven precision with world-class creativity to scale your brand.
        </p>
      </div>

      {/* Centered, Bounded Carousel Container */}
      <div 
        className="w-full max-w-[2000px] mx-auto px-2 sm:px-4 lg:px-6 relative flex flex-col items-center justify-center z-10"
        style={{ perspective }}
      >
        <motion.div 
          ref={trackpadRef}
          tabIndex={0}
          role="region"
          aria-label="Team member carousel. Use Left and Right arrow keys to navigate."
          aria-roledescription="carousel"
          data-active-step={activeStep}
          data-active-member={activeMember.name}
          data-active-index={activeDataIndex}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              handlePrev();
            } else if (e.key === "ArrowRight") {
              e.preventDefault();
              handleNext();
            }
          }}
          className="relative flex items-center justify-center cursor-grab active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#68B955] rounded-2xl sm:rounded-3xl lg:rounded-[28px]"
          style={{ 
            width: cardWidth, 
            height: cardHeight, 
            transformStyle: "preserve-3d", 
            touchAction: "pan-y" 
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }} 
          dragElastic={0} 
          onDrag={(e, info) => {
            // Drag left (delta.x < 0) advances track left towards next card (+rotation)
            // Drag right (delta.x > 0) returns backward towards previous card (-rotation)
            globalRotation.set(globalRotation.get() - info.delta.x * 0.12);
          }}
          onDragEnd={(e, info) => {
            const momentum = -info.velocity.x * 0.04;
            const target = globalRotation.get() + momentum;
            const nearestStep = Math.round(target / angleIncrement);
            currentStep.current = nearestStep;
            globalRotation.set(nearestStep * angleIncrement);
            setActiveStep(nearestStep);
          }}
        >
          {loopedMembers.map((member, i) => {
            const isActive = (i - centerIndex) === activeStep;
            return (
              <Card 
                key={`${member.id}-${i}`} 
                member={member} 
                index={i} 
                total={total} 
                globalRotation={globalRotation} 
                dynamicRadius={dynamicRadius}
                cardWidth={cardWidth}
                cardHeight={cardHeight}
                isActive={isActive}
                onSelect={() => {
                  const targetStep = i - centerIndex;
                  currentStep.current = targetStep;
                  globalRotation.set(targetStep * angleIncrement);
                  setActiveStep(targetStep);
                }}
              />
            );
          })}
        </motion.div>

        {/* Carousel Controls in Normal Layout Flow */}
        <div className="flex items-center gap-4 sm:gap-6 mt-6 sm:mt-8 md:mt-10 relative z-30">
          <button 
            type="button"
            onClick={handlePrev} 
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-slate-200/90 dark:border-white/10 text-gray-900 dark:text-white hover:bg-slate-50 dark:hover:bg-gray-800 hover:text-[#68B955] dark:hover:text-[#68B955] hover:border-[#68B955]/40 transition-all shadow-md hover:scale-105 active:scale-95 will-change-transform transform-gpu cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#68B955]"
            aria-label="Previous team member"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button 
            type="button"
            onClick={handleNext}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-slate-200/90 dark:border-white/10 text-gray-900 dark:text-white hover:bg-slate-50 dark:hover:bg-gray-800 hover:text-[#68B955] dark:hover:text-[#68B955] hover:border-[#68B955]/40 transition-all shadow-md hover:scale-105 active:scale-95 will-change-transform transform-gpu cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#68B955]"
            aria-label="Next team member"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
