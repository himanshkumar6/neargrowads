"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function SmartVideo({ 
  src, 
  poster, 
  className 
}: { 
  src: string; 
  poster?: string; 
  className?: string; 
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

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
      { threshold: 0.15 }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      className={className}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

export default function MissionVision() {
  const sectionRef = useRef<HTMLElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const visionWrapperRef = useRef<HTMLDivElement>(null);
  
  const missionTextRef = useRef<HTMLButtonElement>(null);
  const visionTextRef = useRef<HTMLButtonElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add({
      isDesktop: "(min-width: 768px)",
      isMobile: "(max-width: 767px)"
    }, (context) => {
      const { isMobile } = context.conditions as { isMobile?: boolean };

      // We animate the Mission card scaling slightly as the Vision card scrolls over it.
      // Native CSS 'sticky' handles the actual stacking physics with ZERO artificial gaps.
      const topOffset = isMobile ? "32px" : "48px";

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: visionWrapperRef.current,
          start: "top bottom", // Animation starts when Vision enters viewport from bottom
          end: `top top+=${topOffset}`, // Animation ends exactly when Vision sticks over Mission
          scrub: true,
        }
      });

      // Animate Mission Card pushing BACK natively under the stacking Vision card (scale only, zero opacity dimming!)
      tl.to(missionRef.current, {
        scale: isMobile ? 0.96 : 0.92,
        yPercent: isMobile ? -1 : -2,
        ease: "none"
      }, 0);
    });

    return () => mm.revert();

  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef} 
      className="relative pt-12 pb-4 md:pt-20 md:pb-8 bg-white dark:bg-[#050b14]"
    >
      <div className="container relative z-10 mx-auto px-3 xs:px-4 md:px-8 max-w-7xl">
        
        {/* Header - Not Sticky */}
        <div className="relative z-30 py-4 md:py-6 mb-8 md:mb-12 transition-all overflow-hidden">
          <div className="text-center relative">
            <h2 className="font-sans font-bold text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 md:gap-6 justify-center w-full">
              <button 
                type="button"
                ref={missionTextRef}
                onClick={() => missionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                className="text-[#4e993d] dark:text-[#68b955] relative font-extrabold hover:brightness-110 transition-all cursor-pointer opacity-100 drop-shadow-xs"
              >
                Our Mission
              </button>
              <span className="text-slate-400 dark:text-slate-500 font-light select-none opacity-100">/</span>
              <button 
                type="button"
                ref={visionTextRef}
                onClick={() => visionWrapperRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                className="text-[#e08d18] dark:text-[#fbaf35] relative font-extrabold hover:brightness-110 transition-all cursor-pointer opacity-100 drop-shadow-xs"
              >
                Our Vision
              </button>
            </h2>
          </div>
        </div>

        {/* Magazine Cards Stack Wrapper */}
        <div className="relative w-full pb-4 md:pb-8">
          
          {/* ─── BASE CARD (OUR MISSION) ─── */}
          {/* Sticks natively to the screen without GSAP pin logic */}
          <div 
            className="sticky top-8 md:top-12 z-10 w-full"
          >
            <div 
              ref={missionRef}
              className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-8 items-center rounded-2xl md:rounded-[2.5rem] will-change-transform origin-top p-4 xs:p-6 md:p-8 lg:p-12 transition-all duration-500 overflow-hidden relative bg-[#f3f9f1] dark:bg-[#0c1f0a] border-2 border-[#68b955]/40 dark:border-[#68b955]/60 shadow-[0_20px_50px_-10px_rgba(78,153,61,0.25)] dark:shadow-[0_25px_65px_-10px_rgba(0,0,0,0.9)] opacity-100"
            >
              {/* Top Glass Rim Specular Highlight */}
              <div className="absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#68b955]/40 dark:via-[#68b955]/70 to-transparent pointer-events-none rounded-full" />
              {/* Text Content (Left) */}
              <div className="flex flex-col items-start justify-center h-full relative z-10">
                <div className="font-sans font-medium text-base xs:text-lg sm:text-xl lg:text-[2rem] leading-snug lg:leading-[1.3] tracking-tight text-balance">
                  <span className="inline-block text-[#2b5024] dark:text-[#a7d396] font-bold mb-2">
                    Our mission is to empower <strong className="font-extrabold text-[#1a3815] dark:text-white underline decoration-[#68b955]/40 underline-offset-4">local businesses</strong> with <strong className="font-extrabold text-[#1a3815] dark:text-white">high-visibility digital marketing</strong>, <strong className="font-extrabold text-[#1a3815] dark:text-white">local SEO</strong>, and <strong className="font-extrabold text-[#1a3815] dark:text-white">customer acquisition systems</strong>.
                  </span>
                  <br/>
                  <span className="inline-block text-slate-900 dark:text-slate-100 mt-4 font-normal">
                    We provide businesses with strategies that are <strong className="font-bold text-black dark:text-white">creative</strong>, <strong className="font-bold text-black dark:text-white">practical</strong>, <strong className="font-bold text-black dark:text-white">data-driven</strong>, and tailored to their <strong className="font-bold text-black dark:text-white">local growth goals</strong>.
                  </span>
                </div>
              </div>

              {/* Checkerboard Collage Content (Right) */}
              <div className="relative w-full lg:max-w-none mx-auto aspect-square grid grid-cols-[2fr_1fr_1fr] grid-rows-3 gap-2 md:gap-4 relative z-10">

                {/* BIG Video — tall left column (col 1, row 1-2), no overlap with center image */}
                <div className="col-start-1 col-span-1 row-start-1 row-span-2 relative rounded-xl md:rounded-3xl overflow-hidden shadow-2xl group border border-white/40 dark:border-white/10">
                  {/* Brand gradient overlay on hover */}
                  <div className="absolute inset-0 bg-linear-to-br from-primary-900/50 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  {/* Corner slash inside video tile */}
                  <div
                    className="absolute bottom-0 right-0 w-[45%] h-[45%] pointer-events-none z-10 opacity-[0.18]"
                    style={{
                      clipPath: "polygon(100% 0%, 100% 100%, 0% 100%)",
                      background: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
                    }}
                  />
                  <Image src="https://ik.imagekit.io/rrcdbevrb/Hornbill%20post%20july%204.png" alt="Mission campaign preview" fill sizes="(max-width: 768px) 50vw" className="object-cover md:hidden" />
                  <SmartVideo
                    src="https://ik.imagekit.io/rrcdbevrb/BTS%20Trisage.mp4"
                    poster="https://ik.imagekit.io/rrcdbevrb/BTS%20Trisage.mp4/ik-thumbnail.jpg?updatedAt=1785130952172"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Top Right */}
                <div className="col-start-3 row-start-1 relative rounded-xl md:rounded-3xl overflow-hidden shadow-2xl group border border-white/40 dark:border-white/10">
                  <div className="absolute inset-0 bg-linear-to-tr from-primary-900/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <ImageSlideshow 
                    images={[
                      "https://ik.imagekit.io/rrcdbevrb/Avyanya%20july%20post%2019.png",
                      "https://ik.imagekit.io/rrcdbevrb/Gopidham%20post%202.png",
                      "https://ik.imagekit.io/rrcdbevrb/Hornbill%20post%20july%202.png"
                    ]} 
                    alt="Mission 1" 
                    delay={3000} 
                  />
                </div>
                
                {/* Center */}
                <div className="col-start-2 row-start-2 relative rounded-xl md:rounded-3xl overflow-hidden shadow-2xl group border border-white/40 dark:border-white/10">
                  <div className="absolute inset-0 bg-linear-to-tr from-primary-900/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <ImageSlideshow 
                    images={[
                      "https://ik.imagekit.io/rrcdbevrb/Anant%20Dhara%20New%20post%201.png",
                      "https://ik.imagekit.io/rrcdbevrb/Hornbill%20post%20july%207.png",
                      "https://ik.imagekit.io/rrcdbevrb/megha%20post%20new%203.png"
                    ]} 
                    alt="Mission 2" 
                    delay={4000} 
                  />
                </div>

                {/* Bottom Left */}
                <div className="col-start-1 row-start-3 relative rounded-xl md:rounded-3xl overflow-hidden shadow-2xl group border border-white/40 dark:border-white/10">
                  <div className="absolute inset-0 bg-linear-to-tr from-primary-900/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <ImageSlideshow 
                    images={[
                      "https://ik.imagekit.io/rrcdbevrb/Gopidham%20July%20post%202.png",
                      "https://ik.imagekit.io/rrcdbevrb/Hornbill%20post%20july%204.png",
                      "https://ik.imagekit.io/rrcdbevrb/TreeHouse%20Velis%20post%209.png"
                    ]} 
                    alt="Mission 3" 
                    delay={3500} 
                  />
                </div>

                {/* Bottom Right */}
                <div className="col-start-3 row-start-3 relative rounded-xl md:rounded-3xl overflow-hidden shadow-2xl group border border-white/40 dark:border-white/10">
                  <div className="absolute inset-0 bg-linear-to-tr from-primary-900/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <ImageSlideshow 
                    images={[
                      "https://ik.imagekit.io/rrcdbevrb/IBFW%20post%201%20Option.png",
                      "https://ik.imagekit.io/rrcdbevrb/IBFW%20post%202.png",
                      "https://ik.imagekit.io/rrcdbevrb/Avyanya%20july%20post%2019.png"
                    ]} 
                    alt="Mission 4" 
                    delay={4500} 
                  />
                </div>
                
              </div>
            </div>
          </div>

          {/* Native Spacer to create scroll distance between cards */}
          <div className="h-[25vh] md:h-[60vh] w-full pointer-events-none"></div>

          {/* ─── TOP CARD (OUR VISION) ─── */}
          {/* Also sticky! Naturally scrolls over the base card and sticks, before they both scroll away together */}
          <div 
            ref={visionWrapperRef}
            className="sticky top-8 md:top-12 z-20 w-full rounded-2xl md:rounded-[2.5rem] overflow-hidden p-4 xs:p-6 md:p-8 lg:p-12 transition-all duration-500 relative bg-[#fef9ee] dark:bg-[#231405] border-2 border-[#fbaf35]/40 dark:border-[#fbaf35]/60 shadow-[0_20px_50px_-10px_rgba(251,175,53,0.25)] dark:shadow-[0_25px_65px_-10px_rgba(0,0,0,0.9)] opacity-100"
          >
            {/* Top Glass Rim Specular Highlight */}
            <div className="absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#fbaf35]/40 dark:via-[#fbaf35]/70 to-transparent pointer-events-none rounded-full" />

            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-8 items-center relative z-10">
              
              {/* Checkerboard Collage Content — identical layout to Mission (Left on Desktop) */}
              <div className="order-2 lg:order-1 relative w-full lg:max-w-none mx-auto aspect-square grid grid-cols-[2fr_1fr_1fr] grid-rows-3 gap-2 md:gap-4">

                {/* BIG Video — tall left column (col 1, row 1-2) — identical to Mission */}
                <div className="col-start-1 col-span-1 row-start-1 row-span-2 relative rounded-xl md:rounded-3xl overflow-hidden shadow-2xl group border border-white/40 dark:border-white/10">
                  {/* Brand gradient overlay on hover */}
                  <div className="absolute inset-0 bg-linear-to-br from-secondary-900/50 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  {/* Corner slash inside video tile */}
                  <div
                    className="absolute bottom-0 right-0 w-[45%] h-[45%] pointer-events-none z-10 opacity-[0.18]"
                    style={{
                      clipPath: "polygon(100% 0%, 100% 100%, 0% 100%)",
                      background: "linear-gradient(135deg, #22d3ee 0%, #0ea5e9 100%)",
                    }}
                  />
                  <Image src="https://ik.imagekit.io/rrcdbevrb/Satnam%20post%20new%201.png" alt="Vision campaign preview" fill sizes="(max-width: 768px) 50vw" className="object-cover md:hidden" />
                  <SmartVideo
                    src="https://ik.imagekit.io/rrcdbevrb/Reel%201,%20Taste%20&%20Tales.mp4"
                    className="absolute inset-0 md:block w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Top Right — col 3, row 1 */}
                <div className="col-start-3 row-start-1 relative rounded-xl md:rounded-3xl overflow-hidden shadow-2xl group border border-white/40 dark:border-white/10">
                  <div className="absolute inset-0 bg-linear-to-tr from-secondary-900/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <ImageSlideshow 
                    images={[
                      "https://ik.imagekit.io/rrcdbevrb/Hornbill%20post%20july%207.png",
                      "https://ik.imagekit.io/rrcdbevrb/IBFW%20post%205.png"
                    ]} 
                    alt="Vision 1" 
                    delay={3200} 
                  />
                </div>

                {/* Center — col 2, row 2 */}
                <div className="col-start-2 row-start-2 relative rounded-xl md:rounded-3xl overflow-hidden shadow-2xl group border border-white/40 dark:border-white/10">
                  <div className="absolute inset-0 bg-linear-to-tr from-secondary-900/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <ImageSlideshow 
                    images={[
                      "https://ik.imagekit.io/rrcdbevrb/Satnam%20post%20new%201.png",
                      "https://ik.imagekit.io/rrcdbevrb/TreeHouse%20Velis%20post%202.png"
                    ]} 
                    alt="Vision 2" 
                    delay={4200} 
                  />
                </div>

                {/* Bottom Left — col 1, row 3 */}
                <div className="col-start-1 row-start-3 relative rounded-xl md:rounded-3xl overflow-hidden shadow-2xl group border border-white/40 dark:border-white/10">
                  <div className="absolute inset-0 bg-linear-to-tr from-secondary-900/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <ImageSlideshow 
                    images={[
                      "https://ik.imagekit.io/rrcdbevrb/Satnam%20post%20new%202.png",
                      "https://ik.imagekit.io/rrcdbevrb/IBFW%20post%202.png"
                    ]} 
                    alt="Vision 3" 
                    delay={3700} 
                  />
                </div>

                {/* Bottom Right — col 3, row 3 */}
                <div className="col-start-3 row-start-3 relative rounded-xl md:rounded-3xl overflow-hidden shadow-2xl group border border-white/40 dark:border-white/10">
                  <div className="absolute inset-0 bg-linear-to-tr from-secondary-900/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <ImageSlideshow 
                    images={[
                      "https://ik.imagekit.io/rrcdbevrb/TreeHouse%20Velis%20post%207.png",
                      "https://ik.imagekit.io/rrcdbevrb/Hornbill%20post%20july%207.png"
                    ]} 
                    alt="Vision 4" 
                    delay={4700} 
                  />
                </div>

              </div>

              {/* Text Content (Right on Desktop, Top on Mobile) */}
              <div className="order-1 lg:order-2 flex flex-col items-start justify-center h-full">
                <div className="font-sans font-medium text-base xs:text-lg sm:text-xl lg:text-[2rem] leading-snug lg:leading-[1.3] tracking-tight text-balance">
                  <span className="inline-block text-[#955717] dark:text-[#f7cb74] font-bold mb-2">
                    To be the most <strong className="font-extrabold text-[#7a4818] dark:text-white underline decoration-[#fbaf35]/40 underline-offset-4">trusted local business growth partner</strong> by delivering <strong className="font-extrabold text-[#7a4818] dark:text-white">practical digital results</strong>.
                  </span>
                  <br/>
                  <span className="inline-block text-slate-900 dark:text-slate-100 mt-4 font-normal">
                    We envision helping local businesses turn their digital presence into <strong className="font-bold text-black dark:text-white">consistent customer inquiries</strong> through <strong className="font-bold text-black dark:text-white">smart, transparent execution</strong>.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ImageSlideshow({ images, alt, delay = 3000 }: { images: string[]; alt: string; delay?: number }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, delay);
    return () => clearInterval(interval);
  }, [images.length, delay]);

  return (
    <>
      {images.map((imgSrc, index) => (
        <Image 
          key={index}
          src={imgSrc} 
          alt={`${alt} ${index + 1}`} 
          fill 
          sizes="(max-width: 768px) 33vw, 25vw" 
          className={`object-cover object-top transition-all duration-1000 ease-in-out group-hover:scale-110 ${
            index === currentIndex ? "opacity-100 z-0" : "opacity-0 -z-10"
          }`} 
        />
      ))}
    </>
  );
}
