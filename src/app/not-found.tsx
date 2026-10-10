import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-3 xs:px-4 relative overflow-hidden bg-white dark:bg-[#050b14]">
      
      {/* Background Glow Effect for extra contrast and premium feel */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] xs:w-[300px] h-[260px] xs:h-[300px] md:w-[500px] md:h-[500px] bg-primary-500/10 dark:bg-primary-500/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-md w-full">
        {/* The 404 Text - Upgraded to a highly visible, premium gradient */}
        <h1 className="text-6xl xs:text-7xl sm:text-9xl md:text-[180px] font-bold md:font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-500 dark:from-white dark:to-gray-600 mb-3 xs:mb-4 leading-none tracking-tighter drop-shadow-sm select-none">
          404
        </h1>
        
        {/* Subheadings */}
        <h2 className="text-2xl xs:text-3xl md:text-4xl font-semibold sm:font-bold text-gray-900 dark:text-white mb-3 xs:mb-6 tracking-tight">
          Page Not Found
        </h2>
        
        <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 mb-8 xs:mb-10 max-w-md mx-auto leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        {/* Call to Action */}
        <Link 
          href="/"
          className="inline-flex items-center justify-center gap-2 xs:gap-3 px-6 xs:px-8 py-3.5 xs:py-4 text-xs xs:text-sm sm:text-base font-semibold text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-full transition-all shadow-lg hover:shadow-primary-600/25 dark:hover:shadow-primary-500/25 hover:-translate-y-1 active:scale-95"
        >
          <Home size={18} className="shrink-0" />
          <span>Back to Homepage</span>
        </Link>
      </div>
    </div>
  );
}
