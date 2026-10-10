"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ showLabel = false }: { showLabel?: boolean }) {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return showLabel ? (
      <div className="h-8 w-24 rounded-full bg-slate-200/50 dark:bg-slate-800/50 animate-pulse" />
    ) : (
      <div className="w-9 h-9 rounded-full bg-slate-200/50 dark:bg-slate-800/50 animate-pulse shrink-0" />
    );
  }

  const currentTheme = resolvedTheme || theme;
  const isDark = currentTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  if (showLabel) {
    return (
      <button
        onClick={toggleTheme}
        type="button"
        suppressHydrationWarning
        className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-[#1f2a3e]/90 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow transition-all duration-300 cursor-pointer group select-none"
        aria-label="Toggle theme mode"
      >
        <span className="text-xs font-bold tracking-tight text-slate-700 dark:text-slate-200">
          {isDark ? "Dark Mode" : "Light Mode"}
        </span>

        {/* Realme UI / iOS Settings Style Sliding Pill Switch Track */}
        <div
          className={`relative w-11 h-6 rounded-full transition-colors duration-300 p-0.5 flex items-center ${
            isDark ? "bg-slate-800 border border-slate-700" : "bg-slate-200 border border-slate-300"
          }`}
        >
          {/* Sliding Knob Handle */}
          <div
            className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center ${
              isDark ? "translate-x-5 bg-indigo-600 text-amber-300" : "translate-x-0 bg-white text-amber-500"
            }`}
          >
            {isDark ? (
              <Moon size={11} className="text-indigo-400 fill-indigo-400" />
            ) : (
              <Sun size={11} className="text-amber-500 fill-amber-500" />
            )}
          </div>
        </div>
      </button>
    );
  }

  // Original Sleek Compact Circle Theme Toggle
  return (
    <button
      onClick={toggleTheme}
      type="button"
      suppressHydrationWarning
      className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border border-slate-200 dark:border-slate-700/80 shadow-xs transition-colors cursor-pointer select-none"
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <Sun size={18} className="text-amber-400 fill-amber-400" />
      ) : (
        <Moon size={18} className="text-slate-700 fill-slate-700" />
      )}
    </button>
  );
}
