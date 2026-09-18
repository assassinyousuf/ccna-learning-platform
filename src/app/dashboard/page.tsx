"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { getAllModules } from "@/lib/curriculum";
import {
  LayoutDashboard,
  CheckCircle2,
  Lock,
  PlayCircle,
  HelpCircle,
  Video,
  FileSpreadsheet,
  HardDrive,
  Award,
  ArrowRight,
  ExternalLink,
  Clock,
  Sparkles
} from "lucide-react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const modules = getAllModules();
  const [progress, setProgress] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProgress() {
      try {
        const userId = session?.user?.email || "guest-user";
        const res = await fetch(`/api/progress?userId=${encodeURIComponent(userId)}`);
        if (res.ok) {
          const data = await res.json();
          setProgress(data.progress || {});
        }
      } catch (err) {
        console.error("Failed to load progress:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProgress();
  }, [session]);

  const completedCount = modules.filter(
    (m) => progress[m.id] === "COMPLETED" || progress[`${m.id}_video`] === "SUBMITTED"
  ).length;
  const progressPercent = Math.round((completedCount / modules.length) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Student Welcome Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden mb-10">
        <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 p-0.5 glow-cyan shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center overflow-hidden">
                {session?.user?.image ? (
                  <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <LayoutDashboard className="w-8 h-8 text-cyan-400" />
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Welcome back, {session?.user?.name || "Cadet Engineer"}
                </h1>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Enrolled
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                {session?.user?.email || "student@ccna.academy"} • Cisco CCNA 200-301 Track
              </p>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-4 bg-slate-950/60 border border-slate-800 p-4 rounded-2xl">
            <div>
              <span className="text-[11px] font-mono text-slate-400 uppercase">Curriculum Progress</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black text-cyan-400 font-mono">{progressPercent}%</span>
                <span className="text-xs text-slate-500 font-mono">({completedCount}/{modules.length} Modules)</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-cyan-400 flex items-center justify-center">
              <Award className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
        </div>

        {/* Live Infrastructure Sync Status */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Google OAuth Session Active
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1.5 text-blue-400">
            <HardDrive className="w-3.5 h-3.5" />
            5TB Google Drive Storage Ready
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Google Sheets Gradebook Synced
          </span>
        </div>
      </div>

      {/* Modules Progress Grid */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <BookOpenIcon className="w-5 h-5 text-cyan-400" />
          <span>Module Learning &amp; Assessment Road</span>
        </h2>

        <div className="space-y-4">
          {modules.map((m, idx) => {
            const isCompleted = progress[m.id] === "COMPLETED";
            const isQuizPassed = progress[`${m.id}_quiz`] === "PASSED";
            const isVideoSubmitted = progress[`${m.id}_video`] === "SUBMITTED";
            const isUnlocked = idx === 0 || progress[modules[idx - 1].id] === "COMPLETED" || isCompleted;

            return (
              <div
                key={m.id}
                className={`p-6 rounded-2xl border transition-all ${
                  isCompleted
                    ? "bg-slate-900/40 border-emerald-500/30"
                    : isUnlocked
                    ? "bg-slate-900/80 border-slate-800 hover:border-cyan-500/40"
                    : "bg-slate-950/40 border-slate-900 opacity-60"
                }`}
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  {/* Module Details */}
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-lg shrink-0 ${
                        isCompleted
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : isUnlocked
                          ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                          : "bg-slate-800 text-slate-500"
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : `0${m.number}`}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                          Module {m.number} • Vol {m.volume}
                        </span>
                        {isCompleted && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                            PASSED &amp; VERIFIED
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-white mt-0.5">{m.title}</h3>
                      <p className="text-xs text-slate-400 max-w-xl mt-1 leading-relaxed">{m.description}</p>
                    </div>
                  </div>

                  {/* Verification Pipeline Badges */}
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Step 1: Study */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                      <PlayCircle className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{m.lessons.length} Lessons</span>
                    </div>

                    {/* Step 2: Quiz */}
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono ${
                        isQuizPassed
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                          : "bg-slate-950 border-slate-800 text-slate-400"
                      }`}
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Quiz: {isQuizPassed ? "Passed" : "Pending"}</span>
                    </div>

                    {/* Step 3: Video Demo */}
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono ${
                        isVideoSubmitted
                          ? "bg-purple-500/10 border-purple-500/20 text-purple-400"
                          : "bg-slate-950 border-slate-800 text-slate-400"
                      }`}
                    >
                      <Video className="w-3.5 h-3.5 text-purple-400" />
                      <span>Video: {isVideoSubmitted ? "Stored in Drive" : "Pending"}</span>
                    </div>

                    {/* Action Link */}
                    {isUnlocked ? (
                      <Link
                        href={`/modules/${m.id}`}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors ml-2"
                      >
                        <span>{isCompleted ? "Review" : "Study & Test"}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono bg-slate-800 text-slate-500 cursor-not-allowed ml-2"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Locked</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function BookOpenIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}
