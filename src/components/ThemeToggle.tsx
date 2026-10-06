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
        className={`p-1.5 rounded-lg border transition-all duration-150 flex items-center justify-center ${
          isDark
            ? "bg-[var(--card)] border-[var(--border)] text-[var(--primary)] hover:border-[var(--primary)] hover:text-white"
            : "bg-[var(--card)] border-[var(--border)] text-amber-600 hover:border-amber-500 hover:bg-amber-50"
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
      className={`relative inline-flex items-center gap-1 p-1 rounded-full border transition-all duration-200 ${
        isDark
          ? "bg-[var(--background-subtle)] border-[var(--border)] text-slate-400 hover:border-slate-700"
          : "bg-slate-200 border-slate-300 text-slate-600 hover:border-slate-400"
      } ${className}`}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle theme"
    >
      <span
        className={`flex items-center justify-center w-5 h-5 rounded-full text-xs transition-all duration-200 ${
          !isDark
            ? "bg-amber-500 text-white shadow-sm font-bold"
            : "text-slate-500 hover:text-slate-300"
        }`}
      >
        <Sun className="w-3 h-3" />
      </span>

      <span
        className={`flex items-center justify-center w-5 h-5 rounded-full text-xs transition-all duration-200 ${
          isDark
            ? "bg-[var(--primary)] text-slate-950 font-bold shadow-sm"
            : "text-slate-400 hover:text-slate-600"
        }`}
      >
        <Moon className="w-3 h-3" />
      </span>
    </button>
  );
}
