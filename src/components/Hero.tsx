"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { 
  Phone,
  Target,
  Users,
  TrendingUp,
  Volume2, 
  VolumeX
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  // ── High-Performance Video Lifecycle & Autoplay Handling ──
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => {});

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, []);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  // ── Fluid GSAP Stagger Entrance (Respects prefers-reduced-motion) ──
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        reduceMotion: "(prefers-reduced-motion: reduce)",
        allowMotion: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const { reduceMotion } = context.conditions as Record<string, boolean>;

        if (reduceMotion) {
          gsap.set([leftColRef.current, rightColRef.current], { opacity: 1, y: 0 });
          return;
        }

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.fromTo(
          leftColRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 }
        ).fromTo(
          rightColRef.current,
          { opacity: 0, y: 25, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.85 },
          "-=0.5"
        );
      }
    );
  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef}
      className="relative w-full pt-20 xs:pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-10 sm:pb-14 md:pb-16 lg:pb-24 overflow-hidden bg-white dark:bg-[#050b14] transition-colors duration-300"
      aria-label="NearGrow Ads Hero"
    >
      {/* ── Background Subtle Ambient Glows (Full Light/Dark Adaptability) ── */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#00c371]/5 dark:bg-[#68B955]/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#FBAF35]/10 dark:bg-[#FBAF35]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* ── Main Container: Strictly Below Fixed Navbar (Zero Navbar Overlap) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-12 items-center">

          {/* ═══════════════════════════════════════════════════
              LEFT HALF: Editorial Content Stack
              (MediWise-Inspired Architecture: Bold 3-Line Headline,
               Dual CTA [Get Started + Call Us Now], 3 Stats with Circle Badges)
              ═══════════════════════════════════════════════════ */}
          <div 
            ref={leftColRef}
            className="lg:col-span-6 xl:col-span-6 flex flex-col items-start text-left relative"
          >
            {/* Subtle Watermark Circular Rings (Reference-Inspired Ambient Accents) */}
            <div 
              className="absolute -top-12 -left-10 w-44 h-44 rounded-full border-[8px] border-[#00c371]/15 dark:border-[#68B955]/15 pointer-events-none -z-10" 
              aria-hidden="true" 
            />
            <div 
              className="hidden sm:block absolute -bottom-8 left-2 w-16 h-16 rounded-full border-[5px] border-[#00c371]/15 dark:border-[#68B955]/15 pointer-events-none -z-10" 
              aria-hidden="true" 
            />

            {/* 1. Bold 3-Line Editorial Headline */}
            <h1 className="text-[1.85rem] xs:text-3xl sm:text-4xl md:text-[2.75rem] lg:text-[3.25rem] xl:text-[3.65rem] font-bold tracking-tight text-slate-900 dark:text-white leading-[1.18] sm:leading-[1.14] mb-3.5 sm:mb-5 text-balance">
              Putting your <br className="hidden sm:inline" />
              growth first with <br className="hidden sm:inline" />
              <span className="text-[#00c371] dark:text-[#68B955]">strategy and skill</span>
            </h1>

            {/* 2. Clean Supporting Description */}
            <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 font-normal leading-relaxed mb-6 sm:mb-8 lg:mb-10 max-w-lg text-balance">
              We are a leading performance marketing agency dedicated to turning your local presence into scalable revenue with high-ROI Google &amp; Meta campaigns.
            </p>

            {/* 3. Action Buttons (Pill CTA + Circular Phone Call Us Now Button) */}
            <div className="flex flex-wrap items-center gap-3 xs:gap-4 sm:gap-6 mb-6 sm:mb-8 lg:mb-12">
              {/* Primary Action Button */}
              <button
                onClick={() => window.dispatchEvent(new Event("openLeadModal"))}
                className="px-5 xs:px-7 sm:px-8 py-3 xs:py-3.5 sm:py-4 rounded-full font-semibold text-xs xs:text-sm sm:text-base text-white bg-[#00c371] hover:bg-[#00ad64] dark:bg-[#68B955] dark:hover:bg-[#58a647] shadow-lg shadow-[#00c371]/25 dark:shadow-[#68B955]/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer whitespace-nowrap"
                aria-label="Get Started"
              >
                Get Started
              </button>

              {/* Call Us Now! Button (Circular Icon Button + Label) */}
              <a
                href="tel:+919289810149"
                className="inline-flex items-center gap-2 xs:gap-3 text-slate-700 dark:text-slate-200 hover:text-[#00c371] dark:hover:text-[#00c371] font-semibold text-xs xs:text-sm sm:text-base transition-colors group cursor-pointer whitespace-nowrap"
                aria-label="Call us now at +91 92898 10149"
              >
                <div className="w-9 h-9 xs:w-11 xs:h-11 rounded-full bg-white dark:bg-slate-800 shadow-md shadow-slate-200/60 dark:shadow-black/50 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-[#00c371] dark:text-[#68B955] group-hover:scale-110 group-hover:bg-[#00c371] group-hover:text-white dark:group-hover:bg-[#68B955] dark:group-hover:text-white transition-all duration-200">
                  <Phone className="w-3.5 h-3.5 xs:w-4 xs:h-4 fill-current" />
                </div>
                <span className="group-hover:text-[#00c371] dark:group-hover:text-[#68B955] transition-colors">
                  Call us now!
                </span>
              </a>
            </div>

            {/* 4. Bottom Stats (3 Clean Stats with Circle Badges Matching Reference) */}
            <div className="grid grid-cols-3 gap-1.5 xs:gap-3 sm:gap-6 w-full max-w-lg pt-1 sm:pt-2">
              <div className="flex flex-col xs:flex-row items-center xs:items-center text-center xs:text-left gap-1 xs:gap-2.5 sm:gap-3 p-1.5 xs:p-0 rounded-xl bg-slate-50/70 dark:bg-slate-900/50 xs:bg-transparent dark:xs:bg-transparent border border-slate-100 dark:border-slate-800/60 xs:border-0">
                <div className="w-7 h-7 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-full bg-[#00c371]/15 dark:bg-[#00c371]/25 text-[#00c371] dark:text-[#68B955] flex items-center justify-center shrink-0">
                  <Target className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="text-sm xs:text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                    500+
                  </div>
                  <div className="text-[10px] xs:text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 whitespace-nowrap">
                    Campaigns
                  </div>
                </div>
              </div>

              <div className="flex flex-col xs:flex-row items-center xs:items-center text-center xs:text-left gap-1 xs:gap-2.5 sm:gap-3 p-1.5 xs:p-0 rounded-xl bg-slate-50/70 dark:bg-slate-900/50 xs:bg-transparent dark:xs:bg-transparent border border-slate-100 dark:border-slate-800/60 xs:border-0">
                <div className="w-7 h-7 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-full bg-[#00c371]/15 dark:bg-[#00c371]/25 text-[#00c371] dark:text-[#68B955] flex items-center justify-center shrink-0">
                  <TrendingUp className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="text-sm xs:text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                    3.5x+
                  </div>
                  <div className="text-[10px] xs:text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 whitespace-nowrap">
                    Avg. ROAS
                  </div>
                </div>
              </div>

              <div className="flex flex-col xs:flex-row items-center xs:items-center text-center xs:text-left gap-1 xs:gap-2.5 sm:gap-3 p-1.5 xs:p-0 rounded-xl bg-slate-50/70 dark:bg-slate-900/50 xs:bg-transparent dark:xs:bg-transparent border border-slate-100 dark:border-slate-800/60 xs:border-0">
                <div className="w-7 h-7 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-full bg-[#00c371]/15 dark:bg-[#00c371]/25 text-[#00c371] dark:text-[#68B955] flex items-center justify-center shrink-0">
                  <Users className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="text-sm xs:text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                    50K+
                  </div>
                  <div className="text-[10px] xs:text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 whitespace-nowrap">
                    Leads
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════
              RIGHT HALF: Crisp Native-Resolution Video (Full Rounded Card)
              (Zero Pixelation • Zero Navbar Overlap • Full Symmetrical Rounded Corners)
              ═══════════════════════════════════════════════════ */}
          <div 
            ref={rightColRef}
            className="lg:col-span-6 xl:col-span-6 relative flex justify-center lg:justify-end w-full mt-8 lg:mt-0"
          >
            {/* Outer Container (Constrained to ~540px so 736x414 video renders 100% crisp!) */}
            <div className="relative w-full max-w-[540px]">

              {/* Decorative Subtle Ambient Glow Underlay */}
              <div 
                className="absolute -inset-1.5 rounded-3xl sm:rounded-[2rem] bg-gradient-to-tr from-[#00c371]/25 via-primary-500/10 to-[#FBAF35]/25 pointer-events-none -z-10 blur-xs"
                aria-hidden="true"
              />

              {/* ── Main Video Container (Full Rounded on All 4 Corners) ── */}
              <div className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-950 border border-slate-200/90 dark:border-slate-800 shadow-2xl shadow-slate-300/50 dark:shadow-2xl dark:shadow-black/80">
                {/* 100% Native Clarity Video (No Zoom, Zero Pixelation, 100% Bright) */}
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster="/hero-bg-poster.webp"
                  className="w-full h-full object-cover object-center opacity-100 transition-opacity duration-300"
                >
                  <source src="/hero-bg.mp4" type="video/mp4" />
                </video>

                {/* Sound Mute/Unmute Control (Floating Top-Right) */}
                <button
                  onClick={toggleSound}
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white transition-all duration-200 shadow-md cursor-pointer z-30"
                  aria-label={isMuted ? "Unmute video" : "Mute video"}
                  title={isMuted ? "Click to unmute" : "Click to mute"}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-white/90" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-[#00c371]" />
                  )}
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
