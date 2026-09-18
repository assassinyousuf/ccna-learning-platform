"use client";

import React, { useState } from "react";
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
  Sparkles
} from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 p-0.5 glow-cyan transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Network className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                  CCNA<span className="text-cyan-400">.Academy</span>
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  200-301
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
                Acing the CCNA by Jeremy McDowell
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/#modules"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Curriculum</span>
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              <span>Dashboard</span>
            </Link>

            {/* Architecture Badges */}
            <div className="flex items-center gap-1.5 pl-3 border-l border-slate-800 ml-2">
              <span className="flex items-center gap-1 text-[11px] text-slate-400 font-mono px-2 py-1 rounded bg-slate-900 border border-slate-800">
                <HardDrive className="w-3 h-3 text-blue-400" />
                <span>5TB Drive</span>
              </span>
              <span className="flex items-center gap-1 text-[11px] text-slate-400 font-mono px-2 py-1 rounded bg-slate-900 border border-slate-800">
                <FileSpreadsheet className="w-3 h-3 text-emerald-400" />
                <span>Sheets DB</span>
              </span>
            </div>
          </nav>

          {/* User Profile / Auth Button */}
          <div className="hidden md:flex items-center gap-3">
            {session?.user ? (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-sm text-slate-300 hover:text-white group"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-cyan-500/30 flex items-center justify-center overflow-hidden">
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
                  <span className="font-medium text-xs text-slate-200">
                    {session.user.name?.split(" ")[0] || "Student"}
                  </span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn("google", { callbackUrl: "/dashboard" }).catch(() => signIn("demo-student"))}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 hover:opacity-90 transition-opacity glow-cyan"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In with Google</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/#modules"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-900"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Curriculum</span>
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-900"
          >
            <LayoutDashboard className="w-4 h-4 text-emerald-400" />
            <span>Dashboard</span>
          </Link>
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            {session?.user ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-xs text-slate-300">{session.user.name}</span>
                <button
                  onClick={() => signOut()}
                  className="text-xs text-red-400 flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950"
              >
                Sign In with Google
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
