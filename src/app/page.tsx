"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import {
  curriculum,
  getAllModules,
  getModulesByVolume
} from "@/lib/curriculum";
import {
  Network,
  ArrowRight,
  CheckCircle2,
  Lock,
  PlayCircle,
  HelpCircle,
  Video,
  FileSpreadsheet,
  HardDrive,
  ShieldCheck,
  ShieldAlert,
  Cpu,
  Layers,
  Sparkles,
  Flame,
  Terminal,
  ChevronRight,
  BookOpen,
  CheckSquare,
  Award,
  Compass,
  FileText,
  ExternalLink,
  Laptop,
  Github,
  Globe,
  Linkedin,
  Mail,
  Code2,
  GraduationCap
} from "lucide-react";

export default function HomePage() {
  const { data: session } = useSession();
  const allModules = getAllModules();
  const [selectedVolume, setSelectedVolume] = useState<1 | 2>(1);
  const [selectedPart, setSelectedPart] = useState<number | "all">("all");
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const err = params.get("error");
      if (err) {
        setAuthError(err);
      }
    }
  }, []);

  const currentVolumeData = curriculum.volumes.find((v) => v.volumeNumber === selectedVolume);
  const displayedModules = allModules.filter((m) => {
    if (m.volume !== selectedVolume) return false;
    if (selectedPart !== "all" && m.partNumber !== selectedPart) return false;
    return true;
  });

  return (
    <div className="relative overflow-hidden">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-28 lg:pt-36 lg:pb-36 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs sm:text-sm font-mono mb-8 glow-cyan shadow-sm">
          <Sparkles className="w-4 h-4" />
          <span>Complete Interactive CCNA (200-301) Learning Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.12]">
          Master the CCNA with{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
            Active Hands-On Recall
          </span>
        </h1>

        <p className="mt-8 text-base sm:text-xl text-slate-300/90 max-w-3xl mx-auto leading-relaxed">
          The all-in-one interactive platform engineered by <span className="text-white font-semibold">Md. Yousuf Hossain</span> for complete CCNA 200-301 certification mastery. Study 49 comprehensive chapters, execute 367 live Cisco IOS CLI commands, solve 414 technical review questions, and build real muscle memory.
        </p>

        {/* Auth Error Banner */}
        {authError && (
          <div className="mt-10 max-w-xl mx-auto p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm flex flex-col items-center gap-3 backdrop-blur-md shadow-xl">
            <div className="flex items-center gap-2 font-semibold text-amber-400 text-base">
              <ShieldAlert className="w-5 h-5" />
              <span>OAuth Notice: {authError === "OAuthCallback" ? "Google Callback Verification Failed" : authError}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-center">
              Google sign-in was interrupted. You can retry with Google below, or click Instant Student Access to immediately explore all modules and the exam simulator.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
              <button
                onClick={() => signIn("demo-student", { callbackUrl: "/dashboard" })}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs hover:opacity-95 transition-opacity shadow-md"
              >
                Continue with Instant Demo Student
              </button>
              <button
                onClick={() => {
                  setAuthError(null);
                  window.history.replaceState({}, "", "/");
                  signIn("google", { callbackUrl: "/dashboard" });
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-200 font-medium text-xs border border-slate-700 hover:bg-slate-750 transition-colors"
              >
                Retry Google Sign-In
              </button>
            </div>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {session ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:opacity-95 transition-all glow-cyan text-sm sm:text-base shadow-xl hover:-translate-y-0.5"
            >
              <span>Go to Student Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" }).catch(() => signIn("demo-student"))}
              className="flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:opacity-95 transition-all glow-cyan text-sm sm:text-base shadow-xl hover:-translate-y-0.5"
            >
              <span>Start Learning Free with Google</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <Link
            href="#curriculum"
            className="flex items-center gap-2.5 px-8 py-4 rounded-2xl font-semibold text-slate-200 bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 hover:text-white transition-all text-sm sm:text-base shadow-lg hover:-translate-y-0.5"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Explore 49 Chapters ({allModules.length} Modules)</span>
          </Link>
        </div>

        {/* Spacious Infrastructure Highlights */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto text-left">
          <div className="p-6 rounded-2xl glass-panel glass-panel-hover flex flex-col justify-between">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white mb-1">5TB Cloud Storage</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Direct streaming video lab uploads bypassing serverless payload limits.</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-panel glass-panel-hover flex flex-col justify-between">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white mb-1">Google Sheets DB</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Live cohort gradebook &amp; milestone progression synchronization.</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-panel glass-panel-hover flex flex-col justify-between">
            <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white mb-1">367 CLI Commands</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Interactive terminal emulator with exact Cisco IOS syntax from Appendix B.</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-panel glass-panel-hover flex flex-col justify-between">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white mb-1">414 Quiz Questions</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Authentic review questions and detailed rationales from Appendix C &amp; D.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The 5-Pillar Active Learning Method Section (Decramped Balanced Grid) */}
      <section className="py-24 sm:py-32 border-y border-slate-800/80 bg-slate-900/30 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-mono mb-5 shadow-sm">
              <Compass className="w-4 h-4" />
              <span>Section 1.4: Proven CCNA Study Methodology</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              The 5-Pillar Active Learning Framework
            </h2>
            <p className="mt-6 text-slate-300/90 text-base sm:text-lg leading-relaxed">
              &quot;Studying differs from simply reading passively. Be an active learner rather than a passive learner... Labbing is an essential part of any CCNA study plan. You have to get your hands dirty and apply what you’ve learned.&quot;
            </p>
          </div>

          {/* Row 1: First 3 Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {curriculum.pedagogicalMethod.pillars.slice(0, 3).map((pillar) => (
              <div
                key={pillar.pillar}
                className="relative p-8 sm:p-10 rounded-3xl glass-panel glass-panel-hover flex flex-col justify-between group shadow-xl"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/15 to-emerald-500/15 border border-cyan-500/30 text-cyan-400 font-mono font-bold text-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md">
                    0{pillar.pillar}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
                <div className="mt-8 pt-5 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono text-cyan-400 font-semibold">
                  <span>Pillar 0{pillar.pillar}</span>
                  <span className="text-slate-600">Active Mastery</span>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2: Final 2 Pillars (Centered and Spacious) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {curriculum.pedagogicalMethod.pillars.slice(3, 5).map((pillar) => (
              <div
                key={pillar.pillar}
                className="relative p-8 sm:p-10 rounded-3xl glass-panel glass-panel-hover flex flex-col justify-between group shadow-xl"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/15 to-emerald-500/15 border border-cyan-500/30 text-cyan-400 font-mono font-bold text-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md">
                    0{pillar.pillar}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
                <div className="mt-8 pt-5 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono text-cyan-400 font-semibold">
                  <span>Pillar 0{pillar.pillar}</span>
                  <span className="text-slate-600">Active Mastery</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum Explorer: Volumes, Parts, and Chapters */}
      <section id="curriculum" className="py-24 sm:py-32 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs sm:text-sm font-mono mb-4 shadow-sm">
              <Layers className="w-4 h-4" />
              <span>Full Textbook Syllabus</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              The 49-Chapter CCNA Master Curriculum
            </h2>
            <p className="mt-3 text-slate-400 text-base sm:text-lg max-w-2xl leading-relaxed">
              Organized into 2 comprehensive volumes and 11 distinct pedagogical parts covering all official Cisco CCNA exam domains.
            </p>
          </div>

          {/* Volume Switcher Tabs */}
          <div className="flex items-center p-2 rounded-2xl bg-slate-900 border border-slate-800 shrink-0 shadow-lg">
            <button
              onClick={() => {
                setSelectedVolume(1);
                setSelectedPart("all");
              }}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedVolume === 1
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md glow-cyan"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Volume 1: Fundamentals (24 Ch)
            </button>
            <button
              onClick={() => {
                setSelectedVolume(2);
                setSelectedPart("all");
              }}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedVolume === 2
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md glow-emerald"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Volume 2: Advanced &amp; Security (25 Ch)
            </button>
          </div>
        </div>

        {/* Part Filter Bar with Comfortable Padding & Scroll */}
        {currentVolumeData && (
          <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-12 scrollbar-none">
            <button
              onClick={() => setSelectedPart("all")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-mono shrink-0 transition-all font-medium ${
                selectedPart === "all"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                  : "bg-slate-900/90 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700"
              }`}
            >
              All Parts ({displayedModules.length} Chapters)
            </button>
            {currentVolumeData.parts.map((p) => (
              <button
                key={p.partNumber}
                onClick={() => setSelectedPart(p.partNumber)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-mono shrink-0 transition-all font-medium ${
                  selectedPart === p.partNumber
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                    : "bg-slate-900/90 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700"
                }`}
              >
                Part {p.partNumber}: {p.partTitle}
              </button>
            ))}
          </div>
        )}

        {/* Module Cards Grid with Spacious Padding */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedModules.map((module) => (
            <div
              key={module.id}
              className="group relative p-7 sm:p-8 rounded-3xl glass-panel glass-panel-hover flex flex-col justify-between shadow-xl"
            >
              <div>
                {/* Header info */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
                    Vol {module.volume} • Part {module.partNumber}
                  </span>
                  <span className="text-xs font-mono text-slate-500 font-medium">
                    {module.readTime}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-3 leading-snug">
                  {module.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed mb-6">
                  {module.description}
                </p>

                {/* Badges for commands and quiz */}
                <div className="flex flex-wrap items-center gap-2 mb-8">
                  {module.ciscoCommands.length > 0 && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-750">
                      <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                      {module.ciscoCommands.length} CLI cmds
                    </span>
                  )}
                  {module.quiz.length > 0 && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-750">
                      <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                      {module.quiz.length} Quiz Qs
                    </span>
                  )}
                  {module.diagrams.length > 0 && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-750">
                      <Layers className="w-3.5 h-3.5 text-purple-400" />
                      {module.diagrams.length} Diagrams
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-5 border-t border-slate-800/80 flex items-center justify-between">
                <Link
                  href={`/modules/${module.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-cyan-400 hover:text-white hover:bg-cyan-500/10 border border-cyan-500/20 transition-all"
                >
                  <span>Study Chapter</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/modules/${module.id}/quiz`}
                    title="Take Chapter Quiz"
                    className="p-2.5 rounded-xl bg-slate-800/90 hover:bg-emerald-500/20 hover:text-emerald-300 text-slate-400 transition-colors border border-slate-750"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/modules/${module.id}/submit-video`}
                    title="Submit Lab Video"
                    className="p-2.5 rounded-xl bg-slate-800/90 hover:bg-purple-500/20 hover:text-purple-300 text-slate-400 transition-colors border border-slate-750"
                  >
                    <Video className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Architect & Lead Developer Profile Section */}
      <section className="py-24 sm:py-32 border-t border-slate-800/80 bg-slate-900/40 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="p-10 sm:p-14 lg:p-16 rounded-3xl glass-panel shadow-2xl">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
              
              {/* Left Column: Avatar & Bio */}
              <div className="flex-1 space-y-5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Platform Architect &amp; Developer</span>
                </div>

                <div className="flex items-center gap-5 pt-1">
                  <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-cyan-400 via-emerald-400 to-teal-500 p-0.5 glow-cyan shrink-0 shadow-lg">
                    <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-emerald-400 font-mono">
                      YH
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                      Md. Yousuf Hossain
                    </h2>
                    <p className="text-sm font-mono text-cyan-400 mt-0.5">
                      @assassinyousuf • Cybersecurity Researcher &amp; Developer
                    </p>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                  Computer Science &amp; Engineering undergraduate at Dhaka International University. Specializing in zero-trust network architectures, AI security systems, and interactive educational engineering. Engineered this CCNA Mastery Platform with live Cisco IOS CLI terminal simulation, 3D active recall flashcards, 32-bit IPv4 subnet visualizer, and cohort video verification.
                </p>

                {/* Badges / Highlights */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/90 border border-slate-750 text-xs sm:text-sm text-slate-300 font-mono">
                    <GraduationCap className="w-4 h-4 text-cyan-400" />
                    Dhaka International University (CSE)
                  </span>
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/90 border border-slate-750 text-xs sm:text-sm text-slate-300 font-mono">
                    <Award className="w-4 h-4 text-emerald-400" />
                    General Secretary, DIU CPC
                  </span>
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/90 border border-slate-750 text-xs sm:text-sm text-slate-300 font-mono">
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                    Published Security Researcher (Taylor &amp; Francis)
                  </span>
                </div>
              </div>

              {/* Right Column: Interactive Profile & Repository Links */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-4 w-full lg:w-auto shrink-0">
                <a
                  href="https://yousuf.surf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:opacity-95 transition-opacity glow-cyan text-xs sm:text-sm shadow-lg"
                >
                  <Globe className="w-4 h-4" />
                  <span>Visit Portfolio (yousuf.surf)</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                </a>

                <a
                  href="https://github.com/assassinyousuf/ccna-learning-platform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-800/90 hover:bg-slate-750 border border-slate-700 transition-colors text-xs sm:text-sm shadow-md"
                >
                  <Github className="w-4 h-4 text-cyan-400" />
                  <span>GitHub Repository</span>
                </a>

                <div className="flex items-center justify-center gap-2">
                  <a
                    href="https://github.com/assassinyousuf"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="GitHub Profile"
                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors flex-1 flex justify-center"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/mdyousufhossainmehrab/"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="LinkedIn Profile"
                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors flex-1 flex justify-center"
                  >
                    <Linkedin className="w-4 h-4 text-cyan-400" />
                  </a>
                  <a
                    href="mailto:itsmemehrab369@gmail.com"
                    title="Send Email"
                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors flex-1 flex justify-center"
                  >
                    <Mail className="w-4 h-4 text-emerald-400" />
                  </a>
                  <a
                    href="https://www.yousuf.surf/Md__Yousuf_Hossain_CV.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Download CV"
                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors flex-1 flex justify-center"
                  >
                    <FileText className="w-4 h-4 text-amber-400" />
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Packet Tracer Lab Download & Active Learning Banner */}
      <section className="py-16 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-3">
              <Laptop className="w-3.5 h-3.5" />
              <span>Cisco Networking Academy Official Tool</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Get Cisco Packet Tracer for Free
            </h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              &quot;Packet Tracer is lightweight, free, and supports the vast majority of commands and topologies needed for the CCNA exam. Download it free from Cisco Networking Academy to complete every lab mission in this course.&quot;
            </p>
          </div>

          <a
            href="http://mng.bz/2Kra"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:opacity-95 transition-opacity glow-cyan text-sm shadow-xl shrink-0"
          >
            <span>Download Cisco Packet Tracer</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
