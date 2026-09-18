"use client";

import React from "react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { getAllModules } from "@/lib/curriculum";
import { CiscoCliBox } from "@/components/CiscoCliBox";
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
  BookOpen
} from "lucide-react";

export default function HomePage() {
  const { data: session } = useSession();
  const modules = getAllModules();

  return (
    <div className="relative overflow-hidden">
      {/* Background Cyber Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 lg:pt-28 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-8 glow-cyan">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Extracted from Jeremy McDowell’s &quot;Acing the CCNA Exam&quot;</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
          Master the CCNA Through{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
            Proof of Skill
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Don&apos;t just read textbooks. Study modular lessons, pass rigorous quizzes, and record video demonstrations of real Packet Tracer labs. Uploaded directly to Google Drive, graded in Google Sheets.
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
            href="#modules"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-300 bg-slate-900/80 border border-slate-800 hover:bg-slate-800 hover:text-white transition-colors text-sm"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Explore Syllabus ({modules.length} Modules)</span>
          </Link>
        </div>

        {/* Architecture Highlights Banner */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="flex items-center gap-2 text-cyan-400 mb-1">
              <HardDrive className="w-4 h-4" />
              <span className="font-mono text-xs font-semibold">5TB Google Drive</span>
            </div>
            <p className="text-xs text-slate-400">Direct resumable video uploads bypassing Vercel body limits.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <FileSpreadsheet className="w-4 h-4" />
              <span className="font-mono text-xs font-semibold">Google Sheets DB</span>
            </div>
            <p className="text-xs text-slate-400">Lightweight administrative gradebook & student tracker.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="flex items-center gap-2 text-purple-400 mb-1">
              <Video className="w-4 h-4" />
              <span className="font-mono text-xs font-semibold">In-Browser Recorder</span>
            </div>
            <p className="text-xs text-slate-400">Record Packet Tracer screen & mic right in your browser.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="flex items-center gap-2 text-amber-400 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span className="font-mono text-xs font-semibold">1,673 Pages Extracted</span>
            </div>
            <p className="text-xs text-slate-400">684 Cisco topologies & comprehensive quiz banks.</p>
          </div>
        </div>
      </section>

      {/* The 4-Step Learning Pipeline */}
      <section className="py-16 bg-slate-950/80 border-y border-slate-900 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-xs uppercase font-mono tracking-widest text-cyan-400 mb-2">
            The Verified Progression Engine
          </h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-white">
            How You Master Every Cisco Domain
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 relative group hover:border-cyan-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-mono font-bold mb-4">
              01
            </div>
            <h4 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" /> Study Module
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Read structured lessons derived from Volume 1 & 2. Inspect high-res topology maps, frame formats, and copyable Cisco IOS CLI commands.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 relative group hover:border-emerald-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-mono font-bold mb-4">
              02
            </div>
            <h4 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-400" /> Pass Module Quiz
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Take an interactive 10–20 question assessment. Instant explanations are provided for every choice. Score &ge; 80% to qualify for lab submission.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 relative group hover:border-purple-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-mono font-bold mb-4">
              03
            </div>
            <h4 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Video className="w-4 h-4 text-purple-400" /> Submit Video Proof
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Record a 3–5 min video explaining the concept or demonstrating Packet Tracer CLI commands. Uploads directly to Google Drive via resumable streaming.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 relative group hover:border-teal-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-mono font-bold mb-4">
              04
            </div>
            <h4 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400" /> Unlock Next Tier
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your video link, quiz grade, and completion timestamp are automatically written to Google Sheets, unlocking the next CCNA module!
            </p>
          </div>
        </div>
      </section>

      {/* Curriculum Grid */}
      <section id="modules" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
              <Layers className="w-4 h-4" />
              <span>Cisco CCNA 200-301 Curriculum</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Course Modules &amp; Laboratories
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-md">
            Covering both volumes of Jeremy McDowell’s masterwork: Fundamentals, Switching, Routing, IP Services, Security, and Programmability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((m) => (
            <div
              key={m.id}
              className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 flex flex-col justify-between transition-all duration-200 group hover:shadow-2xl hover:bg-slate-900/80"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    Module 0{m.number} • Vol {m.volume}
                  </span>
                  <span className="text-[11px] font-mono text-cyan-400">
                    ~{m.estimatedHours} Hours
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors mb-2">
                  {m.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  {m.description}
                </p>

                <div className="space-y-2 mb-6">
                  <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                    Included Lessons &amp; Labs:
                  </span>
                  {m.lessons.slice(0, 3).map((l) => (
                    <div
                      key={l.id}
                      className="flex items-center gap-2 text-xs text-slate-300"
                    >
                      <PlayCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{l.title}</span>
                    </div>
                  ))}
                  {m.lessons.length > 3 && (
                    <p className="text-[11px] text-slate-500 font-mono">
                      + {m.lessons.length - 3} more lessons
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {m.quiz.length} Quiz Qs • 1 Lab Demo
                  </span>
                </div>
                <Link
                  href={`/modules/${m.id}`}
                  className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all"
                >
                  <span>Enter Module</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Live Interactive Cisco CLI Showcase */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-2">
            <Terminal className="w-3.5 h-3.5" /> Interactive CLI Practice
          </div>
          <h3 className="text-2xl font-bold text-white">
            Real Cisco IOS Syntax at Your Fingertips
          </h3>
          <p className="text-xs text-slate-400 mt-2">
            Every module includes ready-to-paste Cisco commands with syntax breakdown for Packet Tracer or live labs.
          </p>
        </div>

        <CiscoCliBox
          command={`Router(config)# interface GigabitEthernet0/0/0
Router(config-if)# ip address 192.168.10.1 255.255.255.0
Router(config-if)# no shutdown
Router(config-if)# exit
Router(config)# router ospf 1
Router(config-router)# router-id 1.1.1.1
Router(config-router)# network 192.168.10.0 0.0.0.255 area 0`}
          description="Basic Interface Configuration & Single-Area OSPFv2 Activation"
        />
      </section>
    </div>
  );
}
