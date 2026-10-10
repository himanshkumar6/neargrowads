"use client";
/* eslint-disable @typescript-eslint/no-unused-vars, react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import { DESTINATIONS, DestinationStory } from "../data/destinations";

export default function GlobalPresence() {
  const [destinations, setDestinations] = useState<DestinationStory[]>([]);
  const [hasError, setHasError] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [expandedProps, setExpandedProps] = useState<Record<string, boolean>>({});
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedProps(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    setMounted(true);
    // Murphy's Law: Never trust external/static data blindly.
    try {
      if (!DESTINATIONS || typeof DESTINATIONS !== 'object') {
        throw new Error("DESTINATIONS data is invalid or missing.");
      }
      const dataArray = Object.values(DESTINATIONS).filter(
        dest => dest && dest.id && dest.title // Ensure critical fields exist
      );
      setDestinations(dataArray);
    } catch (err) {
      console.error("[GlobalPresence] Failed to parse destinations:", err);
      setHasError(true);
    }
  }, []);

  // Handle fatal errors gracefully
  if (hasError || destinations.length === 0) {
    // Graceful degradation: If data fails, don't crash the whole homepage.
    return (
      <section className="relative w-full py-24 bg-transparent flex items-center justify-center">
        <p className="text-primary-900/50 dark:text-white/50 tracking-widest uppercase">Global Network Loading...</p>
      </section>
    );
  }

  return (
    <section className="relative w-full pt-12 md:pt-20 pb-0 bg-transparent overflow-hidden">
      {/* Background Ambience (Adaptive) - Positioned behind the Title */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-5xl h-100 pointer-events-none -z-10 opacity-40 dark:opacity-20 blur-[80px] flex items-center justify-between px-10">
        <div className="w-75 h-75 bg-secondary-300/60 dark:bg-secondary-500/40 rounded-full mix-blend-multiply dark:mix-blend-screen" />
        <div className="w-100 h-100 bg-primary-200/60 dark:bg-primary-600/30 rounded-full mix-blend-multiply dark:mix-blend-screen" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 md:px-12 lg:px-24 mb-6 xs:mb-8 md:mb-12 text-center md:text-left">
        <h4 className="flex items-center justify-center md:justify-start gap-2.5 xs:gap-4 text-secondary-600 dark:text-secondary-400 tracking-[0.15em] xs:tracking-[0.2em] text-xs xs:text-sm uppercase mb-3 xs:mb-6" aria-label="Section Title">
          <span className="w-6 xs:w-8 h-px bg-secondary-600/50 dark:bg-secondary-400/50"></span>
          Regional Footprint
        </h4>
        
        <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-primary-950 dark:text-white leading-[1.15] tracking-tight mb-4 xs:mb-6 sm:mb-8">
          Regional Markets. <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-secondary-600 to-primary-600 dark:from-secondary-300 dark:to-primary-300">
            Localized Reach.
          </span>
        </h2>
        
        <p className="max-w-2xl mx-auto md:mx-0 text-primary-800/80 dark:text-gray-300 text-xs xs:text-sm sm:text-base md:text-xl font-light leading-relaxed">
          Supporting local businesses and regional enterprises across key regional markets. From bustling commercial districts to regional service hubs, we help businesses establish reliable search visibility, prominent map placements, and steady local customer acquisition.
        </p>
      </div>

      {/* CSS Marquee Implementation matching Business Partner Logic */}
      <style>
        {`
          @keyframes card-marquee {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-50%, 0, 0); }
          }
          .animate-card-marquee {
            animation: card-marquee 20s linear infinite;
            will-change: transform;
            /* Force GPU Hardware Acceleration to eliminate mobile jitter */
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
            backface-visibility: hidden;
          }
          .animate-card-marquee:hover, .animate-card-marquee.is-paused {
            animation-play-state: paused;
          }
        `}
      </style>
      {/* Reduced bottom padding on mobile to fix the massive empty gap; added top padding so top ring/border is never clipped */}
      <div className="relative z-10 w-full pt-2 xs:pt-3 md:pt-4 pb-4 md:pb-8 overflow-hidden">
        {/* MURPHY'S LAW FIX: Reduced quadrupled array to doubled array. 
            Quadrupling created 20+ heavy DOM nodes which caused massive memory lag and jitter on mobile.
            Doubling is perfectly sufficient for a seamless 50% translation width. */}
        <div className={`animate-card-marquee flex w-max ${activeCard ? 'is-paused' : ''}`}>
          {[...destinations, ...destinations].map((dest, i) => {
            const uniqueId = `${dest.id}-${i}`;
            const isActive = activeCard === uniqueId;

            return (
              <div 
                key={uniqueId} 
                className="shrink-0 w-[86vw] xs:w-[90vw] sm:w-85 md:w-105 pr-3 xs:pr-4 md:pr-8 cursor-pointer"
                onClick={() => setActiveCard(isActive ? null : uniqueId)}
              >
                
                <div className={`group relative w-full h-96 xs:h-105 sm:h-120 md:h-145 rounded-2xl xs:rounded-3xl md:rounded-4xl overflow-hidden border border-white/40 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] transition-all duration-700 hover:shadow-[0_12px_48px_0_rgba(31,38,135,0.15)] dark:hover:shadow-[0_12px_48px_0_rgba(0,0,0,0.5)] ${isActive ? 'ring-2 ring-inset ring-secondary-400 dark:ring-secondary-500' : ''}`}>
                  
                  {/* Image Container with Parallax effect */}
                  <div className="absolute inset-0 m-2 md:m-3 rounded-xl xs:rounded-[1.25rem] md:rounded-3xl overflow-hidden bg-primary-100 dark:bg-[#0c162d]">
                    <div 
                      className={`absolute inset-0 bg-cover bg-center transform transition-transform duration-1200 ease-[cubic-bezier(0.16,1,0.3,1)] ${isActive ? 'scale-110' : 'scale-[1.03] group-hover:scale-110'}`}
                      style={{ backgroundImage: `url(${dest.heroImage || '/assets/placeholder-dest.jpg'})` }}
                    />
                    {/* Adaptive Overlays for legibility */}
                    <div className={`absolute inset-0 bg-linear-to-t from-primary-950/90 via-primary-950/40 to-transparent dark:from-black/95 dark:via-black/50 dark:to-transparent transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`} />
                  </div>

                  {/* Content Container */}
                  <div className="absolute inset-0 p-4 xs:p-6 md:p-10 flex flex-col justify-end z-10 pointer-events-none">
                    
                    {/* Header: Visible by default */}
                    <div className={`transform transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-auto ${isActive ? 'translate-y-0' : 'translate-y-6 group-hover:translate-y-0'}`}>
                      <h4 className="text-secondary-300 dark:text-secondary-400 tracking-widest text-[9px] md:text-[10px] uppercase mb-1.5 xs:mb-2 md:mb-3 flex items-center gap-2 drop-shadow-md">
                        <span className="w-3 xs:w-4 h-px bg-secondary-300 dark:bg-secondary-400"></span>
                        {dest.subtitle || 'Premium Hub'}
                      </h4>
                      <h3 className="text-2xl xs:text-3xl md:text-4xl font-bold text-white drop-shadow-lg tracking-wide">
                        {dest.title}
                      </h3>
                    </div>

                    {/* Expanding Details: Reveals gracefully on click/hover */}
                    <div className={`grid transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] mt-4 pointer-events-auto ${isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] group-hover:grid-rows-[1fr] opacity-0 group-hover:opacity-100'}`}>
                      <div className="overflow-hidden">
                        
                        {/* Properties List */}
                        {dest.hospitalityHighlights && dest.hospitalityHighlights.length > 0 && (
                          <div className="pt-2 pb-4">
                            <p className="text-[10px] text-gray-300 uppercase tracking-widest mb-3">Key Properties</p>
                            <ul className="space-y-1.5 transition-all duration-300">
                              {dest.hospitalityHighlights
                                .slice(0, expandedProps[uniqueId] ? dest.hospitalityHighlights.length : 4)
                                .map((highlight, idx) => (
                                <li key={idx} className="text-[13px] text-white/95 font-light flex items-start gap-2">
                                  <span className="text-secondary-400 mt-1 text-[10px]">♦</span>
                                  <span className={expandedProps[uniqueId] ? "wrap-break-word" : "line-clamp-1"}>{highlight}</span>
                                </li>
                              ))}
                              {dest.hospitalityHighlights.length > 4 && (
                                <li>
                                  <button 
                                    onClick={(e) => toggleExpand(uniqueId, e)}
                                    className="text-[11px] text-secondary-400 hover:text-secondary-300 italic mt-1 bg-transparent border-none cursor-pointer focus:outline-none transition-colors"
                                  >
                                    {expandedProps[uniqueId] ? '- Show less' : `+ ${dest.hospitalityHighlights.length - 4} more properties`}
                                  </button>
                                </li>
                              )}
                            </ul>
                          </div>
                        )}

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/20 dark:border-white/10 mt-2">
                          {(dest.statistics || []).slice(0, 2).map((stat, idx) => (
                            <div key={`stat-${idx}`} className="flex flex-col">
                              <span className="text-xl text-white font-light mb-1">{stat.value || '-'}</span>
                              <span className="text-[9px] uppercase tracking-[0.2em] text-gray-300 dark:text-gray-400">{stat.label || 'Metric'}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
