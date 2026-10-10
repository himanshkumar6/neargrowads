"use client";
/* eslint-disable @next/next/no-img-element */

const partners = [
  { name: "Expedia", src: "https://ik.imagekit.io/rrcdbevrb/expedia.jpg", className: "h-10 md:h-8 scale-110" },
  { name: "Booking.com", src: "https://ik.imagekit.io/rrcdbevrb/booking.jpg", className: "h-12 md:h-16" },
  { name: "MakeMyTrip", src: "https://ik.imagekit.io/rrcdbevrb/mmt.png", className: "h-12 md:h-16 scale-110" },
  { name: "Yatra", src: "https://ik.imagekit.io/rrcdbevrb/yatra.png", className: "h-7 md:h-10" },
  { name: "EaseMyTrip", src: "https://ik.imagekit.io/rrcdbevrb/EaseMyTrip_Logo.svg", className: "h-9 md:h-14" },
  { name: "Agoda", src: "https://ik.imagekit.io/rrcdbevrb/agooda_logo", className: "h-8 md:h-12" },
  { name: "Airbnb", src: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg", className: "h-8 md:h-12" },
  { name: "TripAdvisor", src: "https://ik.imagekit.io/rrcdbevrb/tripadvisor_wordmark", className: "h-10 md:h-14" },
];

export default function BusinessPartners() {
  return (
    <section className="w-full py-8 xs:py-10 md:py-14 bg-white dark:bg-[#050b14] border-t border-gray-100 dark:border-gray-900 overflow-hidden relative z-20">
      <div className="container mx-auto px-3 xs:px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center gap-6 xs:gap-8 md:gap-16">
          
          {/* Left Title */}
          <div className="shrink-0 text-center md:text-left z-10 bg-white dark:bg-[#050b14] pr-0 xs:pr-4 md:border-r border-gray-200 dark:border-gray-800">
            <h2 className="text-xl xs:text-2xl md:text-3xl font-medium text-secondary-500 dark:text-white leading-[1.15] md:pr-10">
              Our <span className="text-primary-500 font-semibold">Business</span><br />
              Partners
            </h2>
          </div>

          {/* Scrolling Marquee */}
          <div className="relative flex-1 w-full overflow-hidden flex items-center before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-8 xs:before:w-16 before:bg-linear-to-r before:from-white before:to-transparent dark:before:from-[#050b14] after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-8 xs:after:w-16 after:bg-linear-to-l after:from-white after:to-transparent dark:after:from-[#050b14]">
            
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes logo-marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-25%); }
              }
              .animate-logo-marquee {
                animation: logo-marquee 15s linear infinite;
              }
              .animate-logo-marquee:hover {
                animation-play-state: paused;
              }
              @media (prefers-reduced-motion: reduce) {
                .animate-logo-marquee {
                  animation: none;
                }
              }
            `}} />

            <div className="animate-logo-marquee flex w-max items-center py-1 gap-8 xs:gap-12 md:gap-20">
              {/* Quadruple the array for seamless infinite looping across ultra-wide screens */}
              {[...partners, ...partners, ...partners, ...partners].map((partner, i) => {
                const isDuplicate = i >= partners.length;
                return (
                  <div 
                    key={`${partner.name}-${i}`} 
                    className="shrink-0 flex items-center justify-center"
                    aria-hidden={isDuplicate ? "true" : undefined}
                  >
                    <div className="group flex items-center justify-center bg-transparent dark:bg-white dark:rounded-2xl hover:-translate-y-1 transition-all duration-300 p-1 md:p-5 cursor-default">
                      <img
                        src={partner.src}
                        alt={isDuplicate ? "" : `${partner.name} logo`}
                        className={`${partner.className || "h-10 md:h-12"} w-auto object-contain grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500`}
                        loading="lazy"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
