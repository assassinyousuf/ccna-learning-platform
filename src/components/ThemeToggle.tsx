"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeContext";

interface ThemeToggleProps {
  compact?: boolean;
  className?: string;
}

export function ThemeToggle({ compact = false, className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  if (compact) {
    return (
      <button
        onClick={toggleTheme}
        className={`p-1.5 rounded-xl border transition-all flex items-center justify-center ${
          isDark
            ? "bg-slate-900 border-slate-800 text-cyan-400 hover:text-white hover:border-cyan-500/40"
            : "bg-amber-500/10 border-amber-500/30 text-amber-600 hover:bg-amber-500/20"
        } ${className}`}
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        aria-label="Toggle theme"
      >
        {isDark ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`relative flex items-center gap-1.5 p-1 rounded-full border transition-all duration-300 ${
        isDark
          ? "bg-slate-900/90 border-slate-800 hover:border-slate-700 text-slate-400"
          : "bg-slate-200/80 border-slate-300 hover:border-slate-400 text-slate-700 shadow-inner"
      } ${className}`}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle theme"
    >
      {/* Visual Track Indicators */}
      <span
        className={`flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 ${
          !isDark
            ? "bg-amber-500 text-white shadow-md transform scale-105"
            : "text-slate-500 hover:text-slate-300"
        }`}
      >
        <Sun className="w-3.5 h-3.5" />
      </span>

      <span
        className={`flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 ${
          isDark
            ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30 transform scale-105"
            : "text-slate-400 hover:text-slate-600"
        }`}
      >
        <Moon className="w-3.5 h-3.5" />
      </span>
    </button>
  );
}
