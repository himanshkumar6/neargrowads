"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import Image from "next/image";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { testimonials } from "@/data/testimonials";
import { Star } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true }); // Fixes mobile address bar jitter
}

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const mobileCardsRef = useRef<HTMLElement[]>([]);
  
  // Debug state to visualize timeline and bounds
  const [debug, setDebug] = useState({ progress: 0, start: 0, end: 0, h: 0 });

  useGSAP(() => {
    const mm = gsap.matchMedia();

    // ── 1. MOBILE & TABLET GSAP SCROLLTRIGGER ANIMATION (60fps GPU Composite) ──
    mm.add("(max-width: 767px)", () => {
      mobileCardsRef.current.forEach((card) => {
        if (!card) return;

        // Set initial hidden state with hardware GPU acceleration
        gsap.set(card, {
          y: 60,
          opacity: 0,
          scale: 0.95,
          force3D: true,
        });

        // Buttery-smooth GPU accelerated entrance animation
        gsap.to(card, {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.65,
          ease: "power3.out",
          force3D: true,
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play reverse play reverse",
            fastScrollEnd: true,
            invalidateOnRefresh: true,
          }
        });
      });
    });

    // ── 2. DESKTOP GSAP 3D STACKED PINNED TIMELINE ──
    mm.add({
      isDesktop: "(min-width: 768px)",
      isShort: "(max-height: 850px)"
    }, (context) => {
      const { isShort } = context.conditions as { isShort?: boolean };

      // Initialize background cards state INSIDE the context so it reverts properly on unmount
      cardsRef.current.forEach((card, index) => {
        if (index === 0 || !card) return;
        gsap.set(card, { y: typeof window !== "undefined" ? window.innerHeight * 1.2 : 1200, opacity: 0 });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => setDebug(prev => ({ ...prev, progress: self.progress })),
          onRefresh: (self) => setDebug({ progress: self.progress, start: self.start, end: self.end, h: window.innerHeight })
        }
      });

      const firstCard = cardsRef.current[0];
      if (firstCard) {
        gsap.fromTo(firstCard.querySelector('.avatar-anim'),
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: sectionRef.current, start: "top 70%" } }
        );
        gsap.fromTo(firstCard.querySelectorAll('.stagger-elem'),
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out", scrollTrigger: { trigger: sectionRef.current, start: "top 70%" } }
        );
      }

      // Layered Stacking Animation
      cardsRef.current.forEach((card, index) => {
        if (index === 0 || !card) return; 

        tl.to(card, {
          y: 0,
          opacity: 1,
          duration: 1.5,
          ease: "power4.out",
        }, (index - 1) * 1.5);

        tl.fromTo(card.querySelector('.avatar-anim'),
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1, ease: "power3.out" },
          (index - 1) * 1.5 + 0.3
        );

        tl.fromTo(card.querySelectorAll('.stagger-elem'),
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out" },
          (index - 1) * 1.5 + 0.4
        );

        // Previous cards recede into the background
        const stackScale = isShort ? 0.04 : 0.05;
        const stackY = isShort ? 16 : 40;

        for (let j = 0; j < index; j++) {
          tl.to(cardsRef.current[j], {
            scale: 1 - ((index - j) * stackScale),
            y: -((index - j) * stackY),
            opacity: 1 - ((index - j) * 0.3),
            filter: `blur(${(index - j) * 2}px)`,
            duration: 1.5,
            ease: "power4.out",
          }, (index - 1) * 1.5);
        }
      });
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <>
      {/* ── MOBILE & TABLET TESTIMONIAL VIEW (GSAP ScrollTrigger Scrub) ── */}
      <section className="block md:hidden py-10 xs:py-14 px-3 xs:px-4 bg-white dark:bg-[#050b14] relative overflow-hidden">
        {/* Subtle Decorative Mesh Orbs */}
        <div
          className="absolute -top-1/4 -left-[10%] w-[60%] h-[70%] rounded-full pointer-events-none opacity-40 dark:opacity-20"
          style={{ background: "radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-1/4 -right-[10%] w-[50%] h-[60%] rounded-full pointer-events-none opacity-40 dark:opacity-20"
          style={{ background: "radial-gradient(circle, rgba(20,184,166,0.15) 0%, transparent 70%)" }}
        />

        <div className="max-w-md mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-6 xs:mb-8">
            <span className="text-primary-600 dark:text-primary-400 font-medium uppercase tracking-widest text-[11px] xs:text-xs sm:text-sm block mb-1">
              Client Testimonials
            </span>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
              What They Say?
            </h2>
          </div>

          {/* Overlapping Tilted Cards Deck */}
          <div className="flex flex-col items-center">
            {testimonials.map((testimonial, idx) => {
              const isEven = idx % 2 === 0;
              
              // Alternating slight rotations like reference image
              const tiltClass = idx % 4 === 0 
                ? "rotate-[1.5deg] xs:rotate-[2.5deg]" 
                : idx % 4 === 1 
                ? "-rotate-[1.5deg] xs:-rotate-[2.5deg]" 
                : idx % 4 === 2 
                ? "rotate-[1.2deg] xs:rotate-[2deg]" 
                : "-rotate-[1.2deg] xs:-rotate-[2deg]";
              
              // Global CSS secondary-100 (soft teal accent) vs crisp white cards
              const bgClass = isEven 
                ? "bg-secondary-100/90 dark:bg-secondary-950/90 text-gray-900 dark:text-gray-100 border border-secondary-200 dark:border-secondary-800/80 shadow-[0_12px_30px_rgba(4,47,46,0.06)]" 
                : "bg-white dark:bg-primary-950 text-gray-900 dark:text-gray-100 border border-primary-100 dark:border-primary-800/80 shadow-[0_12px_30px_rgba(31,42,62,0.06)]";

              // Overlapping negative margin for stacked deck effect
              const marginClass = idx > 0 ? "-mt-3 sm:-mt-4" : "mt-0";

              return (
                <div
                  key={testimonial.id}
                  ref={(el) => {
                    if (el && !mobileCardsRef.current.includes(el)) {
                      mobileCardsRef.current[idx] = el;
                    }
                  }}
                  style={{ zIndex: (idx + 1) * 10 }}
                  className={`w-full p-3.5 xs:p-5 rounded-xl xs:rounded-[1.15rem] will-change-transform ${marginClass} ${tiltClass} ${bgClass}`}
                >
                  {/* Top Header Row: Avatar + Identity (Left) | Rating Pill (Right) */}
                  <div className="flex items-start justify-between gap-2 xs:gap-2.5 mb-2 xs:mb-2.5">
                    
                    {/* Left: Avatar + Name/Role */}
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-primary-600/70 dark:border-primary-400/70 shrink-0 shadow-sm">
                        <Image
                          src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(testimonial.name)}&backgroundColor=2D4164,008080&textColor=ffffff`}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base leading-tight tracking-tight">
                          {testimonial.name}
                        </h3>
                        <p className="text-[11px] text-primary-600 dark:text-primary-400 font-medium leading-none mt-0.5">
                          {testimonial.role || "Client"}
                        </p>
                      </div>
                    </div>

                    {/* Right: Compact Floating White Rating Pill */}
                    <div className="flex items-center gap-0.5 bg-white dark:bg-primary-900 border border-primary-100 dark:border-primary-800 px-2.5 py-1 rounded-full shadow-[0_3px_10px_rgba(0,0,0,0.06)] shrink-0">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={11} className="text-yellow-500 dark:text-yellow-400 fill-yellow-500 dark:fill-yellow-400" />
                      ))}
                    </div>
                  </div>

                  {/* Card Body: Compact Reference Typography */}
                  <p className="text-[11px] sm:text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-normal mt-2.5">
                    {testimonial.text || `${testimonial.reviewPart1} ${testimonial.reviewHighlight1} ${testimonial.reviewPart2} ${testimonial.reviewHighlight2} ${testimonial.reviewPart3} ${testimonial.reviewHighlight3}`}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── DESKTOP TESTIMONIAL VIEW (GSAP 3D Stacked Cards) ── */}
      <section ref={sectionRef} className="hidden md:block relative bg-white dark:bg-[#050b14]" style={{ height: `${testimonials.length * 100}svh` }}>
        
        {/* NATIVE STICKY OVER GSAP PIN */}
        <div className="sticky top-0 left-0 w-full h-[100svh] overflow-hidden bg-white dark:bg-[#050b14] z-10 flex flex-col">
          
          {/* Background Planets/Stars logic */}
          <div className="absolute hidden dark:block right-[-10%] top-[10%] w-[120px] h-[120px] md:w-[320px] md:h-[320px] pointer-events-none z-0" style={{
            animation: "planetBounce 22s infinite",
            animationDelay: "-5s",
            transformStyle: "preserve-3d"
          }}>
            <div className="absolute top-1/2 left-1/2 w-[240%] h-[240%] pointer-events-none" style={{ transform: "translate(-50%, -50%) rotateZ(-25deg) rotateX(70deg)", transformStyle: "preserve-3d" }}>
              <div className="absolute inset-0 animate-[planetSpin_25s_linear_infinite]" style={{ transformStyle: "preserve-3d" }}>
                <div className="absolute inset-0 border-[4px] border-cyan-400/20 rounded-full" />
                <div className="absolute inset-4 border-[2px] border-dashed border-teal-300/30 rounded-full" />
                <div className="absolute inset-10 border-[1px] border-blue-500/40 rounded-full" />
              </div>
            </div>
            <div className="absolute inset-0 rounded-full" style={{
              transform: "translateZ(1px)",
              background: "radial-gradient(circle at 30% 30%, #67e8f9 0%, #0891b2 40%, #0f172a 100%)",
              boxShadow: "0 0 40px 10px rgba(6, 182, 212, 0.2), inset -20px -20px 40px rgba(0, 0, 0, 0.8)",
            }}>
              <div className="absolute inset-0 w-full h-full rounded-full overflow-hidden">
                 <div className="absolute w-[150%] h-[150%] top-1/2 left-1/2" style={{ transform: "translate(-50%, -50%) rotate(-25deg)" }}>
                    <div className="absolute top-0 left-0 h-full w-[200%] animate-[planetPan_30s_linear_infinite]">
                      <div className="absolute w-[50%] h-full left-0">
                        <div className="absolute w-full h-[20%] bg-teal-900/40 top-[20%] filter blur-[3px]" />
                        <div className="absolute w-full h-[15%] bg-cyan-200/10 top-[60%] filter blur-[2px]" />
                      </div>
                      <div className="absolute w-[50%] h-full left-[50%]">
                        <div className="absolute w-full h-[20%] bg-teal-900/40 top-[20%] filter blur-[3px]" />
                        <div className="absolute w-full h-[15%] bg-cyan-200/10 top-[60%] filter blur-[2px]" />
                      </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          <div 
            className="container relative z-10 mx-auto px-4 md:px-8 max-w-[1200px] flex flex-col justify-start md:justify-center h-full pt-[90px] pb-[20px] md:pt-[100px] md:pb-[60px] lg:pt-[12vh] lg:pb-[10vh]"
          >
            
            {/* Header */}
            <div className="text-center max-w-4xl mx-auto mb-6 md:mb-12 lg:mb-16 [@media(max-height:850px)]:mb-4 relative z-20 pointer-events-none shrink-0">
              <h2 className="text-[7vw] sm:text-4xl md:text-6xl [@media(max-height:850px)]:md:text-4xl font-semibold sm:font-bold md:font-bold mb-1 sm:mb-4 md:mb-6 uppercase tracking-tight flex flex-wrap justify-center gap-1 sm:gap-2">
                <span className="text-primary-950 dark:text-white">Client Success </span>
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-600 to-secondary-500 dark:from-primary-400 dark:to-secondary-400">Stories</span>
              </h2>
              <p className="text-sm sm:text-xl md:text-2xl [@media(max-height:850px)]:md:text-lg font-normal sm:font-medium tracking-wide text-primary-600/80 dark:text-primary-400/80 uppercase">
                Don&apos;t just take our word for it. Here&apos;s what our <span className="text-primary-900 dark:text-white font-semibold">partners</span> have to say about working with <span className="font-semibold text-primary-950 dark:text-white">NearGrow Ads.</span>
              </p>
            </div>

            {/* Stacked Cards Container */}
            <div 
              ref={containerRef}
              className="relative grid grid-cols-1 w-full mx-auto mt-4 sm:mt-10 [@media(max-height:850px)]:mt-2" 
              style={{ gridTemplateRows: "1fr", gridTemplateColumns: "1fr" }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  ref={(el) => { 
                    if (el && !cardsRef.current.includes(el)) {
                      cardsRef.current[index] = el;
                    }
                  }}
                  className="col-start-1 row-start-1 w-full will-change-transform transform-style-3d origin-top"
                  style={{
                    opacity: index === 0 ? 1 : 0,
                    transform: index === 0 ? "none" : "translateY(120vh)",
                    zIndex: index
                  }}
                >
                  <div className="flex flex-col lg:flex-row gap-2 sm:gap-6 md:gap-8 lg:gap-12 bg-white dark:bg-primary-950 rounded-[1rem] lg:rounded-[2.5rem] p-4 sm:p-6 md:p-10 lg:p-12 [@media(max-height:850px)]:p-6 border-2 border-primary-100 dark:border-primary-800 shadow-[0_20px_60px_rgba(45,65,100,0.08)] dark:shadow-[0_30px_80px_rgba(0,0,0,0.6)] relative group w-full overflow-hidden max-h-[65vh] sm:max-h-[650px] [@media(max-height:850px)]:max-h-[55vh] justify-center">

                    {/* Dual Mesh Orbs */}
                    <div
                      className="absolute -top-1/4 -left-[5%] w-[55%] h-[140%] rounded-full pointer-events-none animate-[pulse_8s_ease-in-out_infinite] will-change-opacity transform-gpu"
                      style={{ background: "radial-gradient(circle, rgba(37,99,235,0.10) 0%, transparent 70%)" }}
                    />
                    <div
                      className="absolute -bottom-1/4 -right-[5%] w-[50%] h-[130%] rounded-full pointer-events-none animate-[pulse_10s_ease-in-out_infinite_reverse] will-change-opacity transform-gpu"
                      style={{ background: "radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)" }}
                    />

                    {/* Geometric Corner Slash */}
                    <div
                      className="absolute bottom-0 right-0 w-[45%] h-[60%] pointer-events-none opacity-[0.07] dark:opacity-[0.12] transition-opacity duration-700 group-hover:opacity-[0.14] dark:group-hover:opacity-[0.20]"
                      style={{
                        clipPath: "polygon(100% 0%, 100% 100%, 0% 100%)",
                        background: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
                      }}
                    />
                    <div
                      className="absolute bottom-0 right-0 w-[28%] h-[45%] pointer-events-none opacity-[0.12] dark:opacity-[0.18] transition-opacity duration-700 group-hover:opacity-[0.22] dark:group-hover:opacity-[0.30]"
                      style={{
                        clipPath: "polygon(100% 0%, 100% 100%, 0% 100%)",
                        background: "linear-gradient(135deg, #22d3ee 0%, #0ea5e9 100%)",
                      }}
                    />

                    {/* Left Side: Avatar & Identity */}
                    <div className="flex-shrink-0 flex flex-col items-center lg:items-start text-center lg:text-left lg:w-1/3 relative z-10">
                      <div className="avatar-anim relative w-14 h-14 sm:w-28 sm:h-28 lg:w-40 lg:h-40 mb-1.5 sm:mb-4 lg:mb-6 rounded-full overflow-hidden border-[2px] lg:border-[4px] border-white dark:border-primary-800 shadow-2xl transition-transform duration-700 group-hover:scale-105 ring-4 ring-primary-100 dark:ring-primary-900">
                        <Image
                          src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(testimonial.name)}&backgroundColor=0ea5e9,2563eb&textColor=ffffff`}
                          alt={testimonial.name}
                          fill
                          sizes="(max-width: 640px) 56px, (max-width: 1024px) 112px, 160px"
                          className="object-cover"
                          loading="lazy"
                          unoptimized
                        />
                      </div>
                      <h3 className="stagger-elem text-base sm:text-2xl lg:text-3xl font-bold uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-primary-950 via-primary-800 to-primary-600 dark:from-white dark:via-primary-100 dark:to-primary-400 drop-shadow-sm leading-none mt-1">{testimonial.name}</h3>
                      <p className="stagger-elem font-medium uppercase tracking-widest text-[9px] sm:text-xs lg:text-sm mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-secondary-600 to-primary-500 dark:from-secondary-400 dark:to-primary-300">{testimonial.company}</p>
                    </div>

                    {/* Right Side: Rating & Quote */}
                    <div className="flex-grow flex flex-col justify-center relative z-10">
                      {/* Rating Badge */}
                      <div className="stagger-elem flex items-center gap-1 sm:gap-3 bg-gradient-to-r from-primary-50 to-white dark:from-primary-900/80 dark:to-primary-950 border border-primary-200 dark:border-primary-800 rounded-full px-2.5 py-0.5 sm:px-4 sm:py-1.5 w-max mb-2 sm:mb-4 lg:mb-8 shadow-[0_8px_20px_rgba(6,182,212,0.08)] dark:shadow-[0_8px_20px_rgba(0,0,0,0.5)] backdrop-blur-sm mx-auto lg:mx-0">
                        <div className="flex gap-0.5 sm:gap-1 text-yellow-500 dark:text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} className="sm:w-[18px] sm:h-[18px]" fill="currentColor" />
                          ))}
                        </div>
                        <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-primary-950 to-primary-700 dark:from-white dark:to-primary-300 text-[9px] sm:text-sm tracking-widest uppercase border-l border-primary-200 dark:border-primary-700 pl-2 sm:pl-3">
                          5.0 Rating
                        </span>
                      </div>

                      {/* Quote */}
                      <div className="stagger-elem font-sans text-[11px] sm:text-xl lg:text-[1.6rem] leading-tight lg:leading-[1.35] font-normal uppercase tracking-tight text-balance text-center lg:text-left">
                        <span className="text-primary-600 dark:text-primary-400">
                          {testimonial.reviewPart1}{" "}
                          <strong className="font-bold">{testimonial.reviewHighlight1}</strong>{" "}
                        </span>
                        <span className="text-secondary-600 dark:text-secondary-400">
                          {testimonial.reviewPart2}{" "}
                          <strong className="font-bold text-primary-950 dark:text-white">{testimonial.reviewHighlight2}</strong>{" "}
                        </span>
                        <span className="text-gray-800 dark:text-gray-200">
                          {testimonial.reviewPart3}{" "}
                          <strong className="font-bold text-primary-600 dark:text-primary-400">{testimonial.reviewHighlight3}</strong>
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
