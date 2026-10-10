"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const stats = [
  { 
    id: 1, 
    label: "Core Marketing Channels", 
    value: 5, 
    suffix: "+",
    bgClass: "bg-gradient-to-br from-slate-800/90 to-slate-900/95 border-slate-700/50"
  },
  { 
    id: 2, 
    label: "Modular Transparency", 
    value: 100, 
    suffix: "%",
    bgClass: "bg-gradient-to-bl from-slate-800/90 to-slate-900/95 border-slate-700/50"
  },
  { 
    id: 3, 
    label: "Client Retention Focus", 
    value: 95, 
    suffix: "%",
    bgClass: "bg-gradient-to-tr from-slate-800/90 via-slate-900/95 to-slate-950 border-slate-700/50"
  },
];

const parseBoldWords = (text: string) => {
  const parsedWords: { text: string; isBold: boolean }[] = [];
  let isBoldContext = false;

  for (const word of text.split(" ")) {
    let cleanWord = word;
    let shouldBeBold = isBoldContext;

    if (cleanWord.startsWith("**")) {
      isBoldContext = true;
      shouldBeBold = true;
      cleanWord = cleanWord.replace("**", "");
    }

    if (cleanWord.includes("**")) {
      isBoldContext = false;
      shouldBeBold = true;
      cleanWord = cleanWord.replace("**", "");
    }

    parsedWords.push({ text: cleanWord, isBold: shouldBeBold });
  }

  return parsedWords;
};

const SplitChars = ({ text }: { text: string }) => {
  return (
    <>
      {parseBoldWords(text).map((word, wordIndex) => (
        <span 
          key={wordIndex} 
          className={`inline-block mr-[0.25em] char-drop will-change-transform transform-gpu ${word.isBold ? 'font-semibold text-secondary-300' : 'font-normal'}`}
        >
          {word.text}
        </span>
      ))}
    </>
  );
};

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const countRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!countRef.current || !containerRef.current) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const counterObj = { val: 0 };

    gsap.to(counterObj, {
      val: value,
      duration: prefersReduced ? 0 : 1.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 88%",
        toggleActions: "play none none reset",
        onLeaveBack: () => {
          counterObj.val = 0;
          if (countRef.current) countRef.current.textContent = "0";
        }
      },
      onUpdate: () => {
        if (countRef.current) {
          countRef.current.textContent = Math.floor(counterObj.val).toString();
        }
      }
    });
  }, { scope: containerRef, dependencies: [value] });

  return (
    <div ref={containerRef} className="text-4xl xs:text-5xl md:text-7xl font-bold text-white mb-2 tabular-nums">
      <span ref={countRef}>{value}</span><span className="stat-suffix">{suffix}</span>
    </div>
  );
}

export default function WhyChooseUs() {
  const containerRef      = useRef<HTMLDivElement>(null);
  const headingRef        = useRef<HTMLHeadingElement>(null);
  const paraRef           = useRef<HTMLParagraphElement>(null);
  const listRef           = useRef<HTMLUListElement>(null);
  const lineRef           = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!headingRef.current) return;
    
    // 3D Magnetic Word Reveal (Optimized for 60fps)
    gsap.fromTo(
      headingRef.current.querySelectorAll('.heading-word'),
      {
        y: 50,
        opacity: 0,
        rotateX: -60,
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power2.out", // Smoother for scrubbing
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 95%", // Start as soon as it enters the bottom of the screen
          end: "top 50%", // Finish exactly when it reaches the middle of the screen
          scrub: 1.5, // 1.5 second smoothing effect ties the animation perfectly to the scroll wheel!
        }
      }
    );

    if (!paraRef.current) return;

    // Character Drop from Sky Animation (Optimized)
    gsap.fromTo(
      paraRef.current.querySelectorAll('.char-drop'),
      {
        y: -150,
        opacity: 0,
        scale: 1.2,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        stagger: 0.05,
        ease: "power2.out",
        scrollTrigger: {
          trigger: paraRef.current,
          start: "top 95%",
          end: "top 65%",
          scrub: 1.5,
        }
      }
    );

    if (!listRef.current) return;

    // List Timeline Animation (Bouncing Line + Staggered Items)
    const listTl = gsap.timeline({
      scrollTrigger: {
        trigger: listRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse", // Play when scrolling down, reverse on scroll up
      }
    });

    // 1. Draw the vertical connecting line with a spring bounce
    listTl.fromTo(
      lineRef.current,
      { scaleY: 0 },
      { scaleY: 1, duration: 1, ease: "back.out(1.5)", transformOrigin: "top" }
    );

    // 2. Pop the checkmarks in
    listTl.fromTo(
      listRef.current.querySelectorAll('.list-icon'),
      { scale: 0, rotation: -90 },
      { scale: 1, rotation: 0, duration: 0.6, stagger: 0.15, ease: "back.out(2)" },
      "-=0.7" // Start slightly after the line starts drawing
    );

    // 3. Slide in the text
    listTl.fromTo(
      listRef.current.querySelectorAll('.list-text'),
      { x: 30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "power2.out" },
      "-=0.7"
    );

    if (!cardsContainerRef.current) return;

    const cards = cardsContainerRef.current.querySelectorAll<HTMLElement>('.stat-card');
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ── QUANTUM BOUNCE ENTRY ─────────────────────────────────────────────────
    // Phase 1: Cards launch from below with elastic overshoot
    gsap.fromTo(
      cards,
      {
        y: 100,
        opacity: 0,
        scale: 0.85,
        rotateX: -20,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        rotateX: 0,
        duration: prefersReduced ? 0 : 1.1,
        stagger: {
          each: 0.18,           // cascade delay between cards
          ease: "power1.inOut", // smoothly space the waterfall
        },
        ease: "elastic.out(1, 0.55)", // signature quantum elastic bounce
        scrollTrigger: {
          trigger: cardsContainerRef.current,
          start: "top 88%",
          toggleActions: "play none none reset", // re-bounces every time section enters
        },
      }
    );

    // Phase 2: Staggered number suffix "pop" bounce after cards land
    gsap.fromTo(
      cardsContainerRef.current.querySelectorAll('.stat-suffix'),
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: prefersReduced ? 0 : 0.7,
        stagger: 0.2,
        ease: "back.out(3.5)",  // hard snap with pronounced overshoot
        scrollTrigger: {
          trigger: cardsContainerRef.current,
          start: "top 80%",
          toggleActions: "play none none reset",
        },
      }
    );

    // Phase 3: Hover micro-bounce (Murphy's Law: guard against cards that unmount)
    cards.forEach((card) => {
      let hoverTween: gsap.core.Tween | null = null;

      const onEnter = () => {
        if (hoverTween) hoverTween.kill();
        hoverTween = gsap.to(card, {
          y: -10,
          scale: 1.03,
          boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
          duration: 0.35,
          ease: "back.out(2.5)",
          overwrite: "auto",
        });
      };

      const onLeave = () => {
        if (hoverTween) hoverTween.kill();
        hoverTween = gsap.to(card, {
          y: 0,
          scale: 1,
          boxShadow: "0 15px 40px rgba(0,0,0,0.4)",
          duration: 0.5,
          ease: "elastic.out(1, 0.6)", // spring back to rest
          overwrite: "auto",
        });
      };

      card.addEventListener("mouseenter", onEnter);
      card.addEventListener("mouseleave", onLeave);

      // Murphy's Law cleanup — remove listeners when GSAP context cleans up
      return () => {
        card.removeEventListener("mouseenter", onEnter);
        card.removeEventListener("mouseleave", onLeave);
        hoverTween?.kill();
      };
    });

  }, { scope: containerRef });

  return (
    <section id="why-choose-us" ref={containerRef} className="py-12 md:py-16 bg-[#080f1e] dark:bg-[#060c18] relative overflow-hidden border-y border-slate-800/80">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
      
      <div className="container mx-auto px-3 xs:px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xs:gap-10 lg:gap-16 items-center">
          <div>
            <h2 ref={headingRef} className="text-2xl xs:text-3xl md:text-5xl font-bold mb-5 xs:mb-6 [perspective:1000px]">
              <span className="block text-slate-300 text-xl xs:text-2xl md:text-3xl mb-1.5 xs:mb-2">
                {"Why Choose Us".split(" ").map((word, i) => (
                  <span key={`w1-${i}`} className="inline-block mr-[0.25em] heading-word origin-bottom">{word}</span>
                ))}
              </span>
              <span className="inline-block text-secondary-400">
                {"Smart Digital Growth Built for Local Businesses".split(" ").map((word, i) => (
                  <span key={`w2-${i}`} className="inline-block mr-[0.25em] heading-word origin-bottom">{word}</span>
                ))}
              </span>
            </h2>
            <div ref={paraRef} className="space-y-4 mb-6 xs:mb-8">
              <p className="text-slate-300 text-sm xs:text-base sm:text-lg leading-relaxed">
                <SplitChars text="In today’s competitive local landscape, businesses need more than disconnected ads. We connect Google Maps, targeted paid campaigns, and organic social into one practical growth system." />
              </p>
            </div>
            <div className="relative pl-1 xs:pl-4 mt-6">
              {/* Connecting vertical line */}
              <div 
                ref={lineRef} 
                className="absolute left-[19px] xs:left-[31px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-secondary-400/50 via-primary-400/50 to-transparent" 
                />
              
              <ul ref={listRef} className="space-y-5 xs:space-y-6 relative">
                {[
                  "**High-intent local discovery** ensuring your business ranks clearly across Google Maps and local search.",
                  "**Targeted paid campaigns** on Meta and Google Ads focused on local customer inquiries and walk-ins.",
                  "**Modular & transparent pricing** with direct ad spend control and zero lock-in contracts.",
                  "**Complete creative execution** from Reels and graphics to localized landing pages and profile optimization."
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2.5 xs:gap-3.5 sm:gap-4 text-slate-100 relative z-10">
                    <div className="list-icon shrink-0 w-7 h-7 xs:w-8 xs:h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 shadow-[0_0_15px_rgba(251,175,53,0.35)] flex items-center justify-center text-white mt-0.5 sm:mt-1">
                      <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="list-text text-sm xs:text-base sm:text-lg leading-relaxed">
                      <SplitChars text={item} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div ref={cardsContainerRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4 xs:gap-6 sm:gap-8 [perspective:1000px]">
            {stats.map((stat, index) => (
              <div
                key={stat.id}
                className={`stat-card p-5 xs:p-6 sm:p-8 rounded-2xl xs:rounded-3xl apple-glass-tile transition-all duration-300 will-change-transform transform-gpu ${
                  index === 2 ? "sm:col-span-2 text-center" : ""
                }`}
              >
                {/* Number + suffix split so suffix can pop independently */}
                <div className="text-4xl xs:text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-bold md:font-extrabold text-white mb-2 xs:mb-3 tabular-nums flex items-end gap-1 justify-start tracking-tight" style={index === 2 ? { justifyContent: 'center' } : {}}>
                  <AnimatedCounter value={stat.value} suffix="" />
                  <span className="stat-suffix inline-block text-secondary-400 font-medium" style={{ lineHeight: 1.1 }}>{stat.suffix}</span>
                </div>
                <p className="text-slate-300 font-medium uppercase tracking-widest text-[11px] xs:text-xs sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
