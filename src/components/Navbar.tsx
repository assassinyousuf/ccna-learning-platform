"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { 
  Network, 
  LayoutDashboard, 
  BookOpen, 
  HardDrive, 
  FileSpreadsheet, 
  User, 
  LogOut, 
  LogIn,
  Menu,
  X,
  Sparkles,
  Search,
  Calculator,
  Volume2,
  VolumeX,
  Github,
  Award
} from "lucide-react";
import { CommandPalette } from "./CommandPalette";
import { SubnetCalculatorModal } from "./SubnetCalculatorModal";
import { ThemeToggle } from "./ThemeToggle";
import { sounds } from "@/lib/sound-effects";

export function Navbar() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [subnetCalcOpen, setSubnetCalcOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(sounds.isMuted());

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
    if (!muted) sounds.playCommandSuccess();
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-2">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-3.5 group shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 p-0.5 glow-cyan transition-transform duration-300 group-hover:scale-105 shadow-md">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Network className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                  CCNA<span className="text-cyan-400">.Academy</span>
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold tracking-wide">
                  200-301
                </span>
              </div>
            </Link>

            {/* Center Navigation Links */}
            <nav className="hidden md:flex items-center gap-2 lg:gap-3">
              <Link
                href="/#curriculum"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
              >
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Curriculum</span>
              </Link>
              <Link
                href="/practice-test"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium text-amber-300 hover:text-white hover:bg-amber-500/10 border border-amber-500/20 transition-all shadow-sm"
                title="CCNA 200-301 Practice Exam Simulator & Test Center"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>Exam Simulator</span>
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                <span>Profile &amp; Progress</span>
              </Link>
            </nav>

            {/* Right Tools & Auth Controls */}
            <div className="hidden md:flex items-center gap-2.5">
              {/* Spotlight Search Trigger */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 text-slate-400 hover:text-white transition-all text-xs font-mono"
                title="Search chapters (Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden xl:inline">Search chapters...</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 border border-slate-700">Ctrl K</kbd>
              </button>

              {/* Subnet Calculator Trigger */}
              <button
                onClick={() => setSubnetCalcOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-white transition-all text-xs font-mono"
                title="Open Subnet Calculator"
              >
                <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden lg:inline">Subnet Calc</span>
              </button>

              {/* Sound Toggle */}
              <button
                onClick={toggleSound}
                className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all"
                title={isMuted ? "Unmute sound effects" : "Mute sound effects"}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
              </button>

              {/* Theme Toggle (Light / Dark Switch) */}
              <ThemeToggle />

              {/* GitHub Link */}
              <a
                href="https://github.com/assassinyousuf/ccna-learning-platform"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all"
                title="GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>

              {/* User Profile / Auth Area */}
              <div className="pl-2 border-l border-slate-800/80 ml-1">
                {session?.user ? (
                  <div className="flex items-center gap-2.5">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2.5 px-2.5 py-1 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-slate-900 transition-colors group"
                      title="View Student Profile, Scores & Milestone Track"
                    >
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-cyan-500/30 flex items-center justify-center overflow-hidden shrink-0">
                        {session.user.image ? (
                          <img
                            src={session.user.image}
                            alt={session.user.name || "User"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4 text-cyan-400" />
                        )}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-semibold text-xs text-slate-200 leading-tight">
                          {session.user.name?.split(" ")[0] || "Cadet"}
                        </span>
                        <span className="text-[10px] font-mono text-cyan-400 leading-tight">Profile &amp; Scores</span>
                      </div>
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                      title="Sign Out"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => signIn("demo-student", { callbackUrl: "/dashboard" })}
                      className="px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-800 hover:border-slate-700 bg-slate-900/80 text-slate-400 hover:text-slate-200 transition-colors"
                      title="Explore without signing into Google"
                    >
                      Demo Access
                    </button>
                    <button
                      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 hover:opacity-95 transition-opacity glow-cyan shadow-md"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Sign In</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setSubnetCalcOpen(true)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400"
                title="Subnet Calculator"
              >
                <Calculator className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-800 bg-slate-950 px-6 pt-3 pb-6 space-y-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setSearchOpen(true);
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono"
            >
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4 text-cyan-400" />
                Search 49 chapters...
              </span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400">Ctrl K</kbd>
            </button>

            <Link
              href="/#curriculum"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-300 hover:bg-slate-900 hover:text-white transition-colors"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Full Curriculum (49 Modules)</span>
            </Link>
            <Link
              href="/practice-test"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-amber-300 bg-amber-500/5 border border-amber-500/20"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Exam Simulator &amp; Test Center</span>
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-300 hover:bg-slate-900 hover:text-white transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              <span>Student Dashboard</span>
            </Link>

            {/* Theme Toggle (Mobile) */}
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs font-mono text-slate-300">Interface Theme</span>
              <ThemeToggle />
            </div>

            <div className="pt-4 border-t border-slate-800">
              {session?.user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs text-slate-200 font-medium">{session.user.name}</span>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="text-xs text-red-400 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signIn("google", { callbackUrl: "/dashboard" });
                    }}
                    className="w-full py-3 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 flex items-center justify-center gap-2 shadow-md glow-cyan"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In with Google</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signIn("demo-student", { callbackUrl: "/dashboard" });
                    }}
                    className="w-full py-2.5 rounded-xl text-xs font-medium border border-slate-800 bg-slate-900/80 text-slate-400 hover:text-slate-200"
                  >
                    Instant Student Demo Access
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

    {/* Global Interactive Modals */}
    <CommandPalette
      isOpen={searchOpen}
      onClose={() => setSearchOpen(false)}
      onOpenSubnetCalc={() => setSubnetCalcOpen(true)}
    />

    <SubnetCalculatorModal
      isOpen={subnetCalcOpen}
      onClose={() => setSubnetCalcOpen(false)}
    />
  </>
  );
}
