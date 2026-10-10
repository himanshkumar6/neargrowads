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

      // We animate the Mission card scaling down AS the Vision card scrolls over it.
      // Native CSS 'sticky' handles the actual stacking physics with ZERO artificial gaps.
    
      gsap.set(visionTextRef.current, { opacity: 0.3 });
    
      // Calculate the top offset based on sticky position to perfectly sync the animation
      const topOffset = isMobile ? "32px" : "48px";

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: visionWrapperRef.current,
          start: "top bottom", // Animation starts when Vision enters viewport from bottom
          end: `top top+=${topOffset}`, // Animation ends exactly when Vision sticks over Mission
          scrub: true,
        }
      });

      // Animate Mission Card pushing BACK natively under the stacking Vision card.
      tl.to(missionRef.current, {
        scale: isMobile ? 0.96 : 0.92,
        yPercent: isMobile ? -1 : -2,
        opacity: isMobile ? 0.75 : 0.5,
        ease: "none"
      }, 0)
    
      // Crossfade headers smoothly based on Vision card position
      .to(missionTextRef.current, { opacity: 0.3, ease: "none" }, 0)
      .to(visionTextRef.current, { opacity: 1, ease: "none" }, 0);
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
                ref={missionTextRef}
                className="text-primary-600 dark:text-primary-400 relative transition-opacity duration-300"
              >
                Our Mission
              </button>
              <span className="text-gray-200 dark:text-gray-800 font-light opacity-50">/</span>
              <button 
                ref={visionTextRef}
                className="text-secondary-600 dark:text-secondary-400 relative transition-opacity duration-300"
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
              className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-8 items-center rounded-2xl md:rounded-[2.5rem] will-change-transform origin-top p-4 xs:p-6 md:p-8 lg:p-12 transition-all duration-500 overflow-hidden relative bg-primary-50/80 dark:bg-primary-950/85 backdrop-blur-xl border border-primary-200/70 dark:border-primary-800/60 shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.9),0_25px_65px_-10px_rgba(45,65,100,0.25)] dark:shadow-[inset_0_1.5px_2px_0_rgba(255,255,255,0.25),0_30px_75px_-10px_rgba(15,23,42,0.85)]"
            >
              {/* Top Glass Rim Specular Highlight */}
              <div className="absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white dark:via-white/40 to-transparent pointer-events-none rounded-full" />
              {/* Text Content (Left) */}
              <div className="flex flex-col items-start justify-center h-full relative z-10">
                <div className="font-sans font-medium text-base xs:text-lg sm:text-xl lg:text-[2rem] leading-snug lg:leading-[1.3] tracking-tight text-balance">
                  <span className="inline-block text-primary-600 dark:text-primary-400 mb-2">
                    Our mission is to empower <strong className="font-bold">local businesses</strong> with <strong className="font-bold">high-visibility digital marketing</strong>, <strong className="font-bold">local SEO</strong>, and <strong className="font-bold">customer acquisition systems</strong>.
                  </span>
                  <br/>
                  <span className="inline-block text-gray-900 dark:text-white mt-4">
                    We provide businesses with strategies that are <strong className="font-bold">creative</strong>, <strong className="font-bold">practical</strong>, <strong className="font-bold">data-driven</strong>, and tailored to their <strong className="font-bold">local growth goals</strong>.
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
            className="sticky top-8 md:top-12 z-20 w-full rounded-2xl md:rounded-[2.5rem] overflow-hidden p-4 xs:p-6 md:p-8 lg:p-12 transition-all duration-500 relative bg-secondary-50/80 dark:bg-secondary-950/85 backdrop-blur-xl border border-secondary-200/70 dark:border-secondary-800/60 shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.9),0_25px_65px_-10px_rgba(0,128,128,0.2)] dark:shadow-[inset_0_1.5px_2px_0_rgba(255,255,255,0.3),0_30px_75px_-10px_rgba(4,47,46,0.85)]"
          >
            {/* Top Glass Rim Specular Highlight */}
            <div className="absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white dark:via-white/40 to-transparent pointer-events-none rounded-full" />

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
                  <span className="inline-block text-secondary-600 dark:text-secondary-400 mb-2">
                    To be the most <strong className="font-bold">trusted local business growth partner</strong> by delivering <strong className="font-bold">practical digital results</strong>.
                  </span>
                  <br/>
                  <span className="inline-block text-gray-900 dark:text-white mt-4">
                    We envision helping local businesses turn their digital presence into <strong className="font-bold">consistent customer inquiries</strong> through <strong className="font-bold">smart, transparent execution</strong>.
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
