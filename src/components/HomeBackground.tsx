"use client";
/* eslint-disable @typescript-eslint/no-unused-vars, react-hooks/set-state-in-effect */

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Hotel, MapPin, Wine, ChefHat, Globe,
  Compass, Palmtree, Plane, Sparkles, MountainSnow,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/**
 * PERFORMANCE ARCHITECTURE:
 * ─ Synchronized with GSAP Ticker & Lenis Smooth Scroll Engine
 * ─ Consolidated 3D layer tree to eliminate GPU VRAM layer explosion
 * ─ Removed inline CSS shader blur convolution passes inside infinite pan animations
 * ─ Removed redundant long-lived `will-change` properties
 */

// 8 icons max — enough atmosphere, minimal SVG overhead
const ICONS = [
  { Icon: Hotel,       x: "8%",  y: "7%",  size: 24, delay: "0s",   dur: "9s",  color: "#008080" },
  { Icon: MapPin,      x: "88%", y: "10%", size: 20, delay: "1.4s", dur: "10s", color: "#B45309" },
  { Icon: Wine,        x: "5%",  y: "42%", size: 20, delay: "0.6s", dur: "8s",  color: "#2D4164" },
  { Icon: ChefHat,     x: "78%", y: "45%", size: 18, delay: "2.1s", dur: "11s", color: "#008080" },
  { Icon: Globe,       x: "38%", y: "14%", size: 20, delay: "1.8s", dur: "10s", color: "#B45309" },
  { Icon: Compass,     x: "91%", y: "60%", size: 22, delay: "0.3s", dur: "9s",  color: "#2D4164" },
  { Icon: Plane,       x: "25%", y: "72%", size: 22, delay: "2.7s", dur: "12s", color: "#008080" },
  { Icon: MountainSnow,x: "60%", y: "85%", size: 20, delay: "1.0s", dur: "8s",  color: "#B45309" },
];

// 8 sparkle dots — no boxShadow, no blur, just radial-gradient + opacity animation
const DARK_DOTS = [
  { x:"7%",  y:"11%", s:3, d:"0s",   t:"7s"  },
  { x:"33%", y:"7%",  s:2, d:"1.2s", t:"9s"  },
  { x:"65%", y:"5%",  s:3, d:"0.6s", t:"6s"  },
  { x:"91%", y:"22%", s:2, d:"2.0s", t:"8s"  },
  { x:"12%", y:"55%", s:3, d:"0.9s", t:"7s"  },
  { x:"75%", y:"60%", s:2, d:"1.7s", t:"9s"  },
  { x:"44%", y:"82%", s:3, d:"3.0s", t:"6s"  },
  { x:"88%", y:"88%", s:2, d:"1.4s", t:"8s"  },
];

export default function HomeBackground() {
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const p1Ref = useRef<HTMLDivElement>(null);
  const p2Ref = useRef<HTMLDivElement>(null);
  const p3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => { 
    setMounted(true); 
  }, []);

  // Synchronized GSAP Ticker Parallax Updates (Zero competing scroll listeners or extra rAF loops)
  useGSAP(() => {
    if (!mounted) return;

    const setY1 = gsap.quickSetter(p1Ref.current, "y", "px");
    const setY2 = gsap.quickSetter(p2Ref.current, "y", "px");
    const setY3 = gsap.quickSetter(p3Ref.current, "y", "px");

    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: () => {
        const sy = window.scrollY;
        setY1(sy * -0.15);
        setY2(sy * -0.3);
        setY3(sy * -0.5);
      }
    });
  }, { scope: rootRef, dependencies: [mounted] });

  if (!mounted) return null;

  return (
    <div
      ref={rootRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* ══════════════════════════════════
          DARK MODE
          ══════════════════════════════════ */}
      <div className="absolute inset-0 hidden dark:block pointer-events-none">
        
        {/* NASA-style Starry Background (Static base) */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(1px 1px at 25px 35px, rgba(255,255,255,0.8), transparent),
            radial-gradient(1.5px 1.5px at 75px 85px, rgba(255,255,255,0.6), transparent),
            radial-gradient(2px 2px at 150px 120px, rgba(255,255,255,0.4), transparent),
            radial-gradient(1px 1px at 220px 250px, rgba(255,255,255,0.8), transparent)
          `,
          backgroundRepeat: "repeat",
          backgroundSize: "300px 300px",
          opacity: 0.6,
        }} />

        {/* ── PARALLAX LAYER 1 (Slow drift) ── */}
        <div ref={p1Ref} className="absolute inset-0 pointer-events-none will-change-transform">
          {/* Main Moon System - Shifted to upper-right flank with soft ambient presence */}
          <div className="absolute right-[4%] top-[2%] w-[60px] h-[60px] md:w-[160px] md:h-[160px] opacity-45 pointer-events-none" style={{
            animation: "planetFloat 18s ease-in-out infinite",
            transformStyle: "preserve-3d"
          }}>
            <div className="absolute top-1/2 left-1/2 w-[220%] h-[220%] pointer-events-none" style={{
              transform: "translate(-50%, -50%) rotateZ(-15deg) rotateX(75deg)",
              transformStyle: "preserve-3d"
            }}>
              <div className="absolute inset-0 border-[1px] border-dashed border-slate-400/20 rounded-full" />
              <div className="absolute inset-0 animate-[planetSpin_24s_linear_infinite]" style={{ transformStyle: "preserve-3d" }}>
                <div className="absolute top-0 left-1/2 w-0 h-0" style={{ transformStyle: "preserve-3d" }}>
                  <div className="absolute inset-0 animate-[planetSpinReverse_24s_linear_infinite]" style={{ transformStyle: "preserve-3d" }}>
                    <div className="absolute inset-0" style={{ transform: "rotateX(-75deg)", transformStyle: "preserve-3d" }}>
                      <div className="absolute w-4 h-4 md:w-7 md:h-7 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{
                        background: "radial-gradient(circle at 30% 30%, #f1f5f9 0%, #cbd5e1 40%, #334155 100%)",
                        boxShadow: "0 0 10px 1px rgba(255,255,255,0.08), inset -2px -2px 6px rgba(0,0,0,0.5)"
                      }}>
                        <div className="absolute rounded-full bg-slate-800/30 w-[30%] h-[30%] top-[20%] left-[25%]" />
                        <div className="absolute rounded-full bg-slate-800/40 w-[20%] h-[20%] top-[55%] left-[60%]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 rounded-full" style={{
              transform: "translateZ(1px)",
              background: "radial-gradient(circle at 30% 30%, #ffffff 0%, #e2e8f0 40%, #94a3b8 100%)",
              boxShadow: "0 0 30px 10px rgba(255, 255, 255, 0.08), inset -10px -10px 20px rgba(0, 0, 0, 0.35)",
            }}>
              <div className="absolute inset-0 w-full h-full animate-[planetSpin_50s_linear_infinite] rounded-full overflow-hidden">
                <div className="absolute rounded-full bg-slate-800/15" style={{ left: "20%", top: "35%", width: "18%", height: "18%" }} />
                <div className="absolute rounded-full bg-slate-800/10" style={{ left: "55%", top: "60%", width: "25%", height: "25%" }} />
              </div>
            </div>
          </div>

          {/* Accent Satellite System - Shifted below hero typography on the left flank */}
          <div className="absolute left-[5%] top-[38%] w-[30px] h-[30px] md:w-[64px] md:h-[64px] opacity-40 pointer-events-none" style={{
            animation: "planetFloat 20s ease-in-out infinite reverse",
            transformStyle: "preserve-3d"
          }}>
            <div className="absolute top-1/2 left-1/2 w-[260%] h-[260%] pointer-events-none" style={{
              transform: "translate(-50%, -50%) rotateZ(25deg) rotateX(70deg)",
              transformStyle: "preserve-3d"
            }}>
              <div className="absolute inset-0 border-[1px] border-dashed border-[#FBAF35]/25 rounded-full" />
              <div className="absolute inset-0 animate-[planetSpin_12s_linear_infinite]" style={{ transformStyle: "preserve-3d" }}>
                <div className="absolute top-0 left-1/2 w-0 h-0" style={{ transformStyle: "preserve-3d" }}>
                  <div className="absolute inset-0 animate-[planetSpinReverse_12s_linear_infinite]" style={{ transformStyle: "preserve-3d" }}>
                    <div className="absolute inset-0" style={{ transform: "rotateX(-70deg)", transformStyle: "preserve-3d" }}>
                      <div className="absolute w-2 h-2 md:w-3.5 md:h-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{
                        background: "radial-gradient(circle at 30% 30%, #fde68a 0%, #fbaf35 40%, #78350f 100%)",
                        boxShadow: "0 0 6px 1px rgba(251,175,55,0.2), inset -1px -1px 3px rgba(0,0,0,0.6)"
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 rounded-full" style={{
              transform: "translateZ(1px)",
              background: "radial-gradient(circle at 30% 30%, #fde68a 0%, #f59e0b 50%, #92400e 100%)",
              boxShadow: "inset -6px -6px 12px rgba(0, 0, 0, 0.5)",
            }}>
              <div className="absolute inset-0 w-full h-full animate-[planetSpin_40s_linear_infinite] rounded-full overflow-hidden">
                <div className="absolute rounded-full bg-amber-950/20" style={{ left: "30%", top: "40%", width: "25%", height: "25%" }} />
              </div>
            </div>
          </div>

          {/* Comet Shower (Layer 1) */}
          <div className="absolute top-[10%] left-[0%] rotate-[35deg] opacity-0 animate-[cometFly_12s_2s_infinite_linear]">
            <div className="h-[2px] w-[150px] bg-gradient-to-r from-transparent to-white rounded-full drop-shadow-[0_0_4px_#fff]" />
          </div>
          <div className="absolute top-[30%] left-[-10%] rotate-[40deg] opacity-0 animate-[cometFly_18s_8s_infinite_linear]">
            <div className="h-[2px] w-[100px] bg-gradient-to-r from-transparent to-teal-300 rounded-full drop-shadow-[0_0_4px_#5eead4]" />
          </div>
          {/* Deep Comet */}
          <div className="absolute top-[120%] left-[5%] rotate-[38deg] opacity-0 animate-[cometFly_15s_4s_infinite_linear]">
            <div className="h-[3px] w-[200px] bg-gradient-to-r from-transparent to-white rounded-full drop-shadow-[0_0_5px_#fff]" />
          </div>
        </div>

        {/* ── PARALLAX LAYER 2 (Medium drift) ── */}
        <div ref={p2Ref} className="absolute inset-0 pointer-events-none will-change-transform hidden md:block">
          {/* Saturn (Deep Space) */}
          <div className="absolute left-[80%] top-[140%] w-[90px] h-[90px] md:w-[200px] md:h-[200px]" style={{
            animation: "planetBounce 20s infinite",
            animationDelay: "-3s",
            transformStyle: "preserve-3d"
          }}>
            {/* Spinning Rings */}
            <div className="absolute top-1/2 left-1/2 w-[220%] h-[220%] pointer-events-none" style={{
              transform: "translate(-50%, -50%) rotateZ(15deg) rotateX(75deg)",
              transformStyle: "preserve-3d"
            }}>
              <div className="absolute inset-0 animate-[planetSpin_20s_linear_infinite]" style={{ transformStyle: "preserve-3d" }}>
                <div className="absolute inset-0 border-[12px] border-amber-900/40 rounded-full" />
                {/* Dashed and dotted borders make the rotation visible like individual orbiting rocks */}
                <div className="absolute inset-4 border-[6px] border-dashed border-amber-700/50 rounded-full" />
                <div className="absolute inset-8 border-[2px] border-dotted border-amber-300/40 rounded-full" />
              </div>
            </div>
            
            {/* Saturn Sphere with Seamless 3D Panning Bands */}
            <div className="absolute inset-0 rounded-full" style={{
              transform: "translateZ(1px)",
              background: "linear-gradient(160deg, #fcd34d 0%, #d97706 40%, #92400e 80%, #451a03 100%)",
              boxShadow: "0 0 30px rgba(217, 119, 6, 0.2), inset -20px -20px 40px rgba(0, 0, 0, 0.6)",
            }}>
              <div className="absolute inset-0 w-full h-full rounded-full overflow-hidden">
                {/* Wrapper tilted 15deg to match rings perfectly */}
                <div className="absolute top-1/2 left-1/2 w-[150%] h-[150%]" style={{ transform: "translate(-50%, -50%) rotate(15deg)" }}>
                  
                  {/* Seamless Pan Animation */}
                  <div className="absolute top-0 left-0 h-full w-[200%] animate-[planetPan_25s_linear_infinite]">
                    {/* Copy 1 */}
                    <div className="absolute w-[50%] h-full left-0">
                      <div className="absolute w-full h-[15%] bg-gradient-to-b from-transparent via-amber-900/30 to-transparent top-[35%]">
                         <div className="absolute w-[20%] h-full bg-gradient-to-r from-transparent via-amber-950/60 to-transparent rounded-full left-[20%]" />
                         <div className="absolute w-[10%] h-full bg-gradient-to-r from-transparent via-amber-950/50 to-transparent rounded-full left-[70%]" />
                      </div>
                      <div className="absolute w-full h-[10%] bg-gradient-to-b from-transparent via-amber-100/20 to-transparent top-[60%]">
                         <div className="absolute w-[15%] h-full bg-gradient-to-r from-transparent via-amber-50/50 to-transparent rounded-full left-[40%]" />
                      </div>
                    </div>
                    {/* Copy 2 */}
                    <div className="absolute w-[50%] h-full left-[50%]">
                      <div className="absolute w-full h-[15%] bg-gradient-to-b from-transparent via-amber-900/30 to-transparent top-[35%]">
                         <div className="absolute w-[20%] h-full bg-gradient-to-r from-transparent via-amber-950/60 to-transparent rounded-full left-[20%]" />
                         <div className="absolute w-[10%] h-full bg-gradient-to-r from-transparent via-amber-950/50 to-transparent rounded-full left-[70%]" />
                      </div>
                      <div className="absolute w-full h-[10%] bg-gradient-to-b from-transparent via-amber-100/20 to-transparent top-[60%]">
                         <div className="absolute w-[15%] h-full bg-gradient-to-r from-transparent via-amber-50/50 to-transparent rounded-full left-[40%]" />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* Comet Shower (Layer 2) */}
          <div className="absolute top-[80%] left-[-5%] rotate-[45deg] opacity-0 animate-[cometFly_15s_5s_infinite_linear]">
            <div className="h-[2px] w-[180px] bg-gradient-to-r from-transparent to-purple-400 rounded-full drop-shadow-[0_0_5px_#c084fc]" />
          </div>
          <div className="absolute top-[160%] left-[60%] rotate-[25deg] opacity-0 animate-[cometFly_10s_1s_infinite_linear]">
            <div className="h-[2px] w-[120px] bg-gradient-to-r from-transparent to-teal-200 rounded-full drop-shadow-[0_0_4px_#99f6e4]" />
          </div>
        </div>

        {/* ── PARALLAX LAYER 3 (Fast drift) ── */}
        <div ref={p3Ref} className="absolute inset-0 pointer-events-none hidden md:block">
          {/* Icy Moon System */}
          <div className="absolute left-[8%] top-[85%] w-[45px] h-[45px] md:w-[110px] md:h-[110px]" style={{
            animation: "planetBounce 14s infinite",
            animationDelay: "-11s"
          }}>
            <div className="absolute top-1/2 left-1/2 w-[260%] h-[260%] pointer-events-none" style={{
              transform: "translate(-50%, -50%) rotateZ(10deg) rotateX(65deg)"
            }}>
              <div className="absolute inset-0 border-[1px] border-dashed border-cyan-500/30 rounded-full" />
              <div className="absolute inset-0 animate-[planetSpin_10s_linear_infinite]">
                <div className="absolute top-0 left-1/2 w-0 h-0">
                  <div className="absolute inset-0 animate-[planetSpinReverse_10s_linear_infinite]">
                    <div className="absolute inset-0" style={{ transform: "rotateX(-65deg)" }}>
                      <div className="absolute w-2 h-2 md:w-5 md:h-5 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{
                        background: "radial-gradient(circle at 30% 30%, #cffafe 0%, #06b6d4 40%, #164e63 100%)",
                        boxShadow: "0 0 8px 1px rgba(6,182,212,0.2), inset -1.5px -1.5px 4px rgba(0,0,0,0.6)"
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 rounded-full" style={{
              transform: "translateZ(1px)",
              background: "radial-gradient(circle at 35% 35%, #e0f2fe 0%, #bae6fd 40%, #0369a1 100%)",
              boxShadow: "0 0 20px 5px rgba(186, 230, 253, 0.1), inset -10px -10px 20px rgba(0, 0, 0, 0.5)",
            }}>
              <div className="absolute inset-0 w-full h-full animate-[planetSpin_35s_linear_infinite] rounded-full overflow-hidden">
                <div className="absolute rounded-full bg-gradient-to-r from-transparent via-cyan-900/30 to-transparent" style={{ left: "40%", top: "30%", width: "15%", height: "15%" }} />
                <div className="absolute rounded-full bg-gradient-to-r from-transparent via-cyan-900/25 to-transparent" style={{ left: "20%", top: "60%", width: "25%", height: "20%" }} />
              </div>
            </div>
          </div>

          {/* Comet Shower (Layer 3) */}
          <div className="absolute top-[180%] left-[20%] rotate-[30deg] opacity-0 animate-[cometFly_16s_4s_infinite_linear]">
            <div className="h-[3px] w-[220px] bg-gradient-to-r from-transparent to-white rounded-full drop-shadow-[0_0_6px_#fff]" />
          </div>
          <div className="absolute top-[260%] left-[-10%] rotate-[35deg] opacity-0 animate-[cometFly_14s_9s_infinite_linear]">
            <div className="h-[2px] w-[130px] bg-gradient-to-r from-transparent to-purple-200 rounded-full drop-shadow-[0_0_4px_#e9d5ff]" />
          </div>
          <div className="absolute top-[320%] left-[80%] rotate-[50deg] opacity-0 animate-[cometFly_20s_12s_infinite_linear]">
            <div className="h-[4px] w-[250px] bg-gradient-to-r from-transparent to-teal-400 rounded-full drop-shadow-[0_0_8px_#2dd4bf]" />
          </div>
        </div>

        {/* Static Background Elements (Blobs, Dots, Icons) */}
        <div className="absolute inset-0">
          <div className="absolute rounded-full animate-blob" style={{
            left:"-5%", top:"-5%", width:"52vw", height:"52vw",
            background:"radial-gradient(circle, rgba(73,108,144,0.20) 0%, transparent 60%)",
            animationDelay:"0s"
          }} />
          <div className="absolute rounded-full animate-blob" style={{
            left:"58%", top:"4%", width:"40vw", height:"40vw",
            background:"radial-gradient(circle, rgba(20,184,166,0.18) 0%, transparent 60%)",
            animationDelay:"2s"
          }} />
          <div className="absolute rounded-full animate-blob" style={{
            left:"10%", top:"55%", width:"44vw", height:"44vw",
            background:"radial-gradient(circle, rgba(73,108,144,0.12) 0%, transparent 60%)",
            animationDelay:"3.5s"
          }} />
        </div>

        {DARK_DOTS.map((dot, i) => (
          <div key={i} className="absolute rounded-full" style={{
            left:dot.x, top:dot.y, width:dot.s, height:dot.s,
            background: i%3===0
              ? `radial-gradient(circle, rgba(94,234,212,0.95) 0%, transparent 100%)`
              : i%3===1
                ? `radial-gradient(circle, rgba(156,177,199,0.85) 0%, transparent 100%)`
                : `radial-gradient(circle, rgba(255,255,255,0.75) 0%, transparent 100%)`,
            animation:`bokehPulse ${dot.t} ${dot.d} ease-in-out infinite`,
          }} />
        ))}

        {ICONS.map(({ Icon, x, y, size, delay, dur }, i) => (
          <div key={i} className="absolute" style={{
            left:x, top:y,
            animation:`iconFloat ${dur} ${delay} ease-in-out infinite`,
          }}>
            <Icon style={{ width:size, height:size, color:"rgba(156,177,199,0.20)" }} strokeWidth={1.1} />
          </div>
        ))}

        <div className="absolute inset-0 pointer-events-none" style={{
          background:"radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, rgba(5,11,20,0.55) 100%)"
        }} />
      </div>

      {/* ══════════════════════════════════
          LIGHT MODE
          ══════════════════════════════════ */}
      <div className="absolute inset-0 block dark:hidden pointer-events-none bg-white">
      </div>
    </div>
  );
}
