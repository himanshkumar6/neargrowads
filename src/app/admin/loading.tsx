"use client";

import { useState, useEffect } from "react";

export default function HRAdminLoading() {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "." : prev + "."));
    }, 350);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#f8fafc]/95 dark:bg-[#050b14]/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-slate-900 dark:text-white font-sans animate-in fade-in duration-200">
      <div className="flex flex-col items-center gap-4 text-center">
        {/* Dual Ring Spinner Loader */}
        <div className="relative flex items-center justify-center">
          <div className="w-10 h-10 border-3 border-slate-200 dark:border-white/10 border-t-[#68b955] rounded-full animate-spin" />
        </div>

        {/* Loading... Text */}
        <div className="text-sm font-medium text-slate-600 dark:text-slate-300 tracking-wide font-sans">
          Loading{dots}
        </div>
      </div>
    </div>
  );
}
