"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { 
  Network, 
  LayoutDashboard, 
  BookOpen, 
  Menu, 
  X, 
  Search, 
  Calculator, 
  Volume2, 
  VolumeX, 
  Github, 
  Award,
  User,
  LogOut,
  LogIn,
  Activity,
  Terminal,
  ShieldCheck,
  Zap,
  ChevronDown,
  Cpu,
  Layers,
  Sparkles
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
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(sounds.isMuted());
  const [ping, setPing] = useState(1.8);

  const toolsDropdownRef = useRef<HTMLDivElement>(null);

  // Subtle telemetry ping fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setPing(Number((1.6 + Math.random() * 0.5).toFixed(1)));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(e.target as Node)) {
        setToolsMenuOpen(false);
      }
    };
    if (toolsMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [toolsMenuOpen]);

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
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/85 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* ============================================================= */}
            {/* LEFT: BRAND & SUBTLE STATUS                                   */}
            {/* ============================================================= */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2.5 group shrink-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-600/10 to-transparent border border-cyan-500/30 flex items-center justify-center transition-all group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] shadow-sm">
                  <Network className="w-5 h-5 text-cyan-400 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base tracking-tight text-[var(--foreground)]">
                    CCNA<span className="text-cyan-400 font-normal">.Console</span>
                  </span>
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>200-301</span>
                  </span>
                </div>
              </Link>
            </div>

            {/* ============================================================= */}
            {/* CENTER: CLEAN, FOCUSED NAVIGATION LINKS + TOOLS DROPDOWN      */}
            {/* ============================================================= */}
            <nav className="hidden md:flex items-center gap-1.5">
              <Link
                href="/#curriculum"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-subtle)] transition-all whitespace-nowrap"
              >
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>Curriculum</span>
              </Link>

              <Link
                href="/practice-test"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--background-subtle)] transition-all group whitespace-nowrap"
                title="CCNA 200-301 Authentic Exam Simulator & Test Center"
              >
                <Award className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>Exam Simulator</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  450 Qs
                </span>
              </Link>

              {/* TOOLS DROPDOWN MENU */}
              <div className="relative" ref={toolsDropdownRef}>
                <button
                  onClick={() => setToolsMenuOpen(!toolsMenuOpen)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    toolsMenuOpen 
                      ? "bg-[var(--background-subtle)] text-cyan-400 border border-cyan-500/30" 
                      : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-subtle)]"
                  }`}
                  aria-expanded={toolsMenuOpen}
                >
                  <Cpu className="w-3.5 h-3.5 text-purple-400" />
                  <span>Tools &amp; Labs</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${toolsMenuOpen ? "rotate-180 text-cyan-400" : "text-slate-500"}`} />
                </button>

                {/* Dropdown Menu Panel */}
                {toolsMenuOpen && (
                  <div className="absolute left-0 mt-2 w-80 rounded-2xl bg-[#080d1a] border border-slate-800 shadow-2xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-1">
                    
                    {/* Interactive Engineering Workbenches */}
                    <div className="px-2.5 py-1 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                      Interactive Workbenches
                    </div>

                    <button
                      onClick={() => {
                        setToolsMenuOpen(false);
                        setSubnetCalcOpen(true);
                      }}
                      className="w-full flex items-start gap-3 p-2 rounded-xl hover:bg-slate-900 transition-colors text-left group"
                    >
                      <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:border-emerald-400 shrink-0">
                        <Calculator className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-emerald-300">
                          32-Bit Subnet Calculator
                        </div>
                        <div className="text-[11px] text-slate-400">
                          IPv4 &amp; IPv6 CIDR, VLSM &amp; speed drill
                        </div>
                      </div>
                    </button>

                    <Link
                      href="/dashboard"
                      onClick={() => setToolsMenuOpen(false)}
                      className="w-full flex items-start gap-3 p-2 rounded-xl hover:bg-slate-900 transition-colors text-left group"
                    >
                      <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:border-purple-400 shrink-0">
                        <LayoutDashboard className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-purple-300">
                          Command Center Cockpit
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Cadet milestone tracker &amp; cohort metrics
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/#packet-flight"
                      onClick={() => setToolsMenuOpen(false)}
                      className="w-full flex items-start gap-3 p-2 rounded-xl hover:bg-slate-900 transition-colors text-left group"
                    >
                      <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:border-cyan-400 shrink-0">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-cyan-300">
                          Packet Flight Simulator
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Real-time ARP, IP &amp; ICMP packet flow
                        </div>
                      </div>
                    </Link>

                    {/* Preferences & Utilities */}
                    <div className="pt-2 mt-1 border-t border-slate-800/80 px-2.5 py-1 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                      <span>Console Preferences</span>
                    </div>

                    <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-slate-900">
                      <span className="text-xs text-slate-300 flex items-center gap-2">
                        {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-500" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
                        <span>Synthesized Sound FX</span>
                      </span>
                      <button
                        onClick={toggleSound}
                        className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border transition-colors ${
                          isMuted 
                            ? "bg-slate-800 border-slate-700 text-slate-400" 
                            : "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
                        }`}
                      >
                        {isMuted ? "MUTED" : "ACTIVE"}
                      </button>
                    </div>

                    <a
                      href="https://github.com/assassinyousuf/ccna-learning-platform"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-slate-900 text-xs text-slate-300 group"
                    >
                      <span className="flex items-center gap-2">
                        <Github className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
                        <span>Source Code Repository</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">GitHub ↗</span>
                    </a>

                    {/* Integrated System Telemetry Footer */}
                    <div className="pt-2 mt-1 border-t border-slate-800/80 p-2.5 bg-slate-950/80 rounded-xl space-y-1 text-[10px] font-mono">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          NOC: CCNA-CORE-01
                        </span>
                        <span className="text-cyan-400">{ping}ms ping</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-500 text-[9px]">
                        <span>49 Ch • 367 Cmds • 450 Qs</span>
                        <span className="text-emerald-400">Nominal</span>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            </nav>

            {/* ============================================================= */}
            {/* RIGHT: SEARCH, THEME TOGGLE & AUTHENTICATION                   */}
            {/* ============================================================= */}
            <div className="hidden md:flex items-center gap-2.5">
              {/* Spotlight Search Trigger */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[var(--background-subtle)] border border-[var(--border)] hover:border-cyan-500/40 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-all text-xs font-mono group"
                title="Search chapters, commands and blueprints (Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] text-slate-400">Search</span>
                <kbd className="px-1.5 py-0.5 rounded bg-[var(--card)] text-[10px] text-[var(--foreground-muted)] border border-[var(--border)] font-semibold">
                  Ctrl K
                </kbd>
              </button>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Auth Area */}
              <div className="pl-2 border-l border-[var(--border)]">
                {session?.user ? (
                  <div className="flex items-center gap-2">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-2 py-1 rounded-lg text-xs text-[var(--foreground)] hover:bg-[var(--background-subtle)] transition-colors group"
                      title="View Student Profile, Scores & Milestone Track"
                    >
                      <div className="w-7 h-7 rounded-full bg-[var(--background-subtle)] border border-[var(--border)] flex items-center justify-center overflow-hidden shrink-0">
                        {session.user.image ? (
                          <img
                            src={session.user.image}
                            alt={session.user.name || "User"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-3.5 h-3.5 text-cyan-400" />
                        )}
                      </div>
                      <span className="font-semibold text-xs text-[var(--foreground)]">
                        {session.user.name?.split(" ")[0] || "Cadet"}
                      </span>
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="p-1.5 text-[var(--foreground-muted)] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Sign Out"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => signIn("demo-student", { callbackUrl: "/dashboard" })}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-mono border border-[var(--border)] hover:border-cyan-500/40 bg-[var(--background-subtle)] text-[var(--foreground-muted)] hover:text-white transition-all flex items-center gap-1.5"
                      title="Instant cadet demo bypass without Google OAuth"
                    >
                      <Terminal className="w-3 h-3 text-cyan-400" />
                      <span>Cadet Demo</span>
                    </button>
                    <button
                      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 transition-all shadow-md shadow-cyan-500/20"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Sign In</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ============================================================= */}
            {/* MOBILE TOGGLES                                                */}
            {/* ============================================================= */}
            <div className="flex md:hidden items-center gap-2">
              <ThemeToggle compact />
              <button
                onClick={() => setSubnetCalcOpen(true)}
                className="p-2 rounded-lg bg-[var(--background-subtle)] border border-[var(--border)] text-emerald-400"
                title="Subnet Calculator"
              >
                <Calculator className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] rounded-lg bg-[var(--background-subtle)] border border-[var(--border)]"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* ============================================================= */}
        {/* MOBILE MENU ACCORDION                                         */}
        {/* ============================================================= */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[var(--border)] bg-[var(--card)] px-6 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-150">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setSearchOpen(true);
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg bg-[var(--background-subtle)] border border-[var(--border)] text-xs text-[var(--foreground)] font-mono"
            >
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4 text-cyan-400" />
                Search 49 chapters, 367 commands...
              </span>
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--card)] text-[10px] text-[var(--foreground-muted)] border border-[var(--border)]">
                Ctrl K
              </kbd>
            </button>

            <Link
              href="/#curriculum"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-[var(--foreground)] hover:bg-[var(--background-subtle)] transition-colors"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Curriculum (49 Modules)</span>
            </Link>

            <Link
              href="/practice-test"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-slate-900 border border-slate-800"
            >
              <div className="flex items-center gap-3">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Exam Simulator</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-400">
                450 Qs
              </span>
            </Link>

            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-[var(--foreground)] hover:bg-[var(--background-subtle)] transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-purple-400" />
              <span>Command Center</span>
            </Link>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setSubnetCalcOpen(true);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-[var(--foreground)] hover:bg-[var(--background-subtle)] transition-colors text-left"
            >
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>32-Bit Subnet Calculator</span>
            </button>

            <div className="pt-3 border-t border-[var(--border)]">
              {session?.user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs text-[var(--foreground)] font-medium">
                      {session.user.name}
                    </span>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="text-xs text-red-400 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signIn("google", { callbackUrl: "/dashboard" });
                    }}
                    className="w-full py-2.5 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 flex items-center justify-center gap-2 shadow-sm"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In with Google</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signIn("demo-student", { callbackUrl: "/dashboard" });
                    }}
                    className="w-full py-2 rounded-lg text-xs font-mono border border-[var(--border)] bg-[var(--background-subtle)] text-[var(--foreground-muted)] hover:text-white flex items-center justify-center gap-2"
                  >
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Instant Cadet Demo Access</span>
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
