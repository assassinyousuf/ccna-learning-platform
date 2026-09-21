"use client";

import React, { useState } from "react";
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
  Laptop
} from "lucide-react";

export default function HomePage() {
  const { data: session } = useSession();
  const allModules = getAllModules();
  const [selectedVolume, setSelectedVolume] = useState<1 | 2>(1);
  const [selectedPart, setSelectedPart] = useState<number | "all">("all");

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
      <section className="relative pt-20 pb-24 lg:pt-28 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-8 glow-cyan">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Strictly Aligned with Jeremy McDowell&apos;s &quot;Acing the CCNA Exam&quot;</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
          Master the CCNA with the{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
            Book&apos;s Active Learning Method
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
          The complete cohort-based platform adhering strictly to Jeremy McDowell&apos;s two-volume textbook. Study theory, master 367 Cisco IOS CLI commands from Appendix B, pass 414 official review questions from Appendix C & D, complete Packet Tracer labs, and submit active video proof to Google Drive.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {session ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:opacity-95 transition-opacity glow-cyan text-sm shadow-xl"
            >
              <span>Go to Student Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" }).catch(() => signIn("demo-student"))}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:opacity-95 transition-opacity glow-cyan text-sm shadow-xl"
            >
              <span>Start Learning Free with Google</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <Link
            href="#curriculum"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-300 bg-slate-900/80 border border-slate-800 hover:bg-slate-800 hover:text-white transition-colors text-sm"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Explore 49 Chapters ({allModules.length} Modules)</span>
          </Link>
        </div>

        {/* Infrastructure Highlights */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-5xl mx-auto text-left">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="flex items-center gap-2 text-cyan-400 mb-1">
              <HardDrive className="w-4 h-4" />
              <span className="font-mono text-xs font-semibold">5TB Google Drive</span>
            </div>
            <p className="text-xs text-slate-400">Direct streaming video uploads bypassing serverless payload limits.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <FileSpreadsheet className="w-4 h-4" />
              <span className="font-mono text-xs font-semibold">Google Sheets DB</span>
            </div>
            <p className="text-xs text-slate-400">Gradebook & module progression tracking spreadsheet.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="flex items-center gap-2 text-purple-400 mb-1">
              <Terminal className="w-4 h-4" />
              <span className="font-mono text-xs font-semibold">367 CLI Commands</span>
            </div>
            <p className="text-xs text-slate-400">Exact Cisco IOS command syntax from Appendix B.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="flex items-center gap-2 text-amber-400 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span className="font-mono text-xs font-semibold">414 Quiz Questions</span>
            </div>
            <p className="text-xs text-slate-400">Official questions & explanations from Appendix C & D.</p>
          </div>
        </div>
      </section>

      {/* Jeremy McDowell's 5-Pillar Learning Method Section */}
      <section className="py-20 border-y border-slate-800/80 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-4">
              <Compass className="w-3.5 h-3.5" />
              <span>Section 1.4: How to Study for the CCNA</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Jeremy McDowell&apos;s 5-Pillar Learning Framework
            </h2>
            <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
              &quot;Studying from a book differs from simply reading from a book. Be an active learner rather than a passive learner... Labbing is an essential part of any CCNA study plan. You have to get your hands dirty and apply what you’ve learned.&quot;
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {curriculum.pedagogicalMethod.pillars.map((pillar) => (
              <div
                key={pillar.pillar}
                className="relative p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono font-bold flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    0{pillar.pillar}
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center text-[11px] font-mono text-cyan-400">
                  <span>Pillar 0{pillar.pillar}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum Explorer: Volumes, Parts, and Chapters */}
      <section id="curriculum" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-3">
              <Layers className="w-3.5 h-3.5" />
              <span>Full Textbook Syllabus</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              The 49-Chapter CCNA Master Curriculum
            </h2>
            <p className="mt-2 text-slate-400 text-sm max-w-2xl">
              Organized into 2 volumes and 11 distinct pedagogical parts according to Jeremy McDowell&apos;s textbook layout.
            </p>
          </div>

          {/* Volume Switcher Tabs */}
          <div className="flex items-center p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shrink-0">
            <button
              onClick={() => {
                setSelectedVolume(1);
                setSelectedPart("all");
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedVolume === 1
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md"
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
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedVolume === 2
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Volume 2: Advanced & Security (25 Ch)
            </button>
          </div>
        </div>

        {/* Part Filter Bar */}
        {currentVolumeData && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            <button
              onClick={() => setSelectedPart("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono shrink-0 transition-all ${
                selectedPart === "all"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
              }`}
            >
              All Parts ({displayedModules.length} Chapters)
            </button>
            {currentVolumeData.parts.map((p) => (
              <button
                key={p.partNumber}
                onClick={() => setSelectedPart(p.partNumber)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono shrink-0 transition-all ${
                  selectedPart === p.partNumber
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                    : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
                }`}
              >
                Part {p.partNumber}: {p.partTitle}
              </button>
            ))}
          </div>
        )}

        {/* Module Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedModules.map((module) => (
            <div
              key={module.id}
              className="group relative p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between backdrop-blur-md hover:shadow-[0_0_25px_rgba(6,182,212,0.1)]"
            >
              <div>
                {/* Header info */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    Vol {module.volume} • Part {module.partNumber}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {module.readTime}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-2 leading-snug">
                  {module.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {module.description}
                </p>

                {/* Badges for commands and quiz */}
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  {module.ciscoCommands.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      <Terminal className="w-3 h-3 text-cyan-400" />
                      {module.ciscoCommands.length} CLI cmds
                    </span>
                  )}
                  {module.quiz.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      <HelpCircle className="w-3 h-3 text-emerald-400" />
                      {module.quiz.length} Quiz Qs
                    </span>
                  )}
                  {module.diagrams.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      <Layers className="w-3 h-3 text-purple-400" />
                      {module.diagrams.length} Diagrams
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <Link
                  href={`/modules/${module.id}`}
                  className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <span>Study Chapter</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/modules/${module.id}/quiz`}
                    title="Take Chapter Quiz"
                    className="p-2 rounded-lg bg-slate-800 hover:bg-emerald-500/20 hover:text-emerald-300 text-slate-400 transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href={`/modules/${module.id}/submit-video`}
                    title="Submit Lab Video"
                    className="p-2 rounded-lg bg-slate-800 hover:bg-purple-500/20 hover:text-purple-300 text-slate-400 transition-colors"
                  >
                    <Video className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Packet Tracer Lab Download & Active Learning Banner */}
      <section className="py-16 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-3">
              <Laptop className="w-3.5 h-3.5" />
              <span>Recommended by Jeremy McDowell</span>
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
