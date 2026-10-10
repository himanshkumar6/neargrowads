'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="bg-white dark:bg-[#1f2a3e] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl max-w-md w-full text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Warning Icon Badge */}
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-sm">
          <AlertTriangle className="w-7 h-7" />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
            Something went wrong!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal leading-relaxed max-w-sm mx-auto">
            We apologize for the inconvenience. An unexpected system exception occurred while rendering this view.
          </p>
          {error?.digest && (
            <span className="inline-block mt-2 font-mono text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-900/60 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800">
              Error Ref: {error.digest}
            </span>
          )}
        </div>

        {/* Action Buttons (Single-Line Typography, Non-Truncating) */}
        <div className="flex flex-col xs:flex-row items-center justify-center gap-3 pt-2 w-full">
          <button
            onClick={() => reset()}
            className="w-full xs:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 text-white font-semibold text-xs uppercase tracking-wide hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer whitespace-nowrap active:scale-98"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full xs:w-auto px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs uppercase tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap active:scale-98"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Go Back Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
