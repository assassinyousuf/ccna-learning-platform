"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { curriculum, getAllModules } from "@/lib/curriculum";
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
  Sparkles,
  BookOpen,
  Terminal,
  Layers,
  ChevronRight,
  ChevronDown
} from "lucide-react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const allModules = getAllModules();
  const [selectedVolume, setSelectedVolume] = useState<1 | 2>(1);
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

  const currentVolumeData = curriculum.volumes.find((v) => v.volumeNumber === selectedVolume);
  const volumeModules = allModules.filter((m) => m.volume === selectedVolume);

  const completedCount = allModules.filter(
    (m) => progress[m.id] === "COMPLETED" || progress[`${m.id}_video`] === "SUBMITTED"
  ).length;
  const progressPercent = Math.round((completedCount / allModules.length) * 100);

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
                  CCNA 200-301 Track
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                {session?.user?.email || "student@ccna.academy"} • Following Jeremy McDowell&apos;s Learning Protocol
              </p>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-4 bg-slate-950/60 border border-slate-800 p-4 rounded-2xl">
            <div>
              <span className="text-[11px] font-mono text-slate-400 uppercase">Curriculum Progress</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black text-cyan-400 font-mono">{progressPercent}%</span>
                <span className="text-xs text-slate-500 font-mono">({completedCount}/{allModules.length} Chapters)</span>
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
            Active Learning Session
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1.5 text-blue-400">
            <HardDrive className="w-3.5 h-3.5" />
            5TB Google Drive Ready
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Google Sheets Gradebook Synced
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1.5 text-purple-400">
            <Terminal className="w-3.5 h-3.5" />
            367 CLI Commands (App B)
          </span>
        </div>
      </div>

      {/* Volume Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <span>Textbook Chapters &amp; Milestone Track</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Complete the 5 active learning pillars for each chapter to unlock full CCNA certification readiness.
          </p>
        </div>

        <div className="flex items-center p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shrink-0">
          <button
            onClick={() => setSelectedVolume(1)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedVolume === 1
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Volume 1: Fundamentals (24 Ch)
          </button>
          <button
            onClick={() => setSelectedVolume(2)}
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

      {/* Parts & Chapters List */}
      {currentVolumeData && (
        <div className="space-y-10">
          {currentVolumeData.parts.map((part) => {
            const partChapters = volumeModules.filter((m) => m.partNumber === part.partNumber);
            if (partChapters.length === 0) return null;

            return (
              <div key={part.partNumber} className="space-y-4">
                {/* Part Header */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                      <span>Volume {selectedVolume}</span>
                      <span>•</span>
                      <span>Part 0{part.partNumber}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{part.partTitle}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{part.description}</p>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                    {partChapters.length} Chapters
                  </span>
                </div>

                {/* Chapter Cards within Part */}
                <div className="space-y-3">
                  {partChapters.map((m) => {
                    const isCompleted = progress[m.id] === "COMPLETED";
                    const isQuizPassed = progress[`${m.id}_quiz`] === "PASSED";
                    const isVideoSubmitted = progress[`${m.id}_video`] === "SUBMITTED";

                    return (
                      <div
                        key={m.id}
                        className={`p-5 rounded-2xl border transition-all ${
                          isCompleted
                            ? "bg-slate-900/40 border-emerald-500/30"
                            : "bg-slate-900/70 border-slate-800/80 hover:border-cyan-500/40"
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          {/* Chapter Title & Meta */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-xs font-mono text-cyan-400 font-semibold">
                                Chapter {m.chapterNumber}
                              </span>
                              <span className="text-slate-600">•</span>
                              <span className="text-xs font-mono text-slate-500">
                                {m.readTime}
                              </span>
                              {m.ciscoCommands.length > 0 && (
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                                  {m.ciscoCommands.length} CLI cmds
                                </span>
                              )}
                              {m.quiz.length > 0 && (
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-300">
                                  {m.quiz.length} Quiz Qs
                                </span>
                              )}
                            </div>
                            <h4 className="text-base font-bold text-white truncate">
                              {m.rawTitle}
                            </h4>
                            <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                              {m.description}
                            </p>
                          </div>

                          {/* 5-Pillar Milestones Status Badges */}
                          <div className="flex items-center gap-2 shrink-0">
                            {/* Quiz status */}
                            <Link
                              href={`/modules/${m.id}/quiz`}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-colors ${
                                isQuizPassed
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                  : "bg-slate-800/80 text-slate-400 hover:text-emerald-300 hover:bg-slate-800"
                              }`}
                            >
                              <HelpCircle className="w-3.5 h-3.5" />
                              <span>{isQuizPassed ? "Quiz Passed (App C)" : "Quiz (App C)"}</span>
                            </Link>

                            {/* Video submission status */}
                            <Link
                              href={`/modules/${m.id}/submit-video`}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-colors ${
                                isVideoSubmitted
                                  ? "bg-purple-500/10 text-purple-400 border border-purple-500/30"
                                  : "bg-slate-800/80 text-slate-400 hover:text-purple-300 hover:bg-slate-800"
                              }`}
                            >
                              <Video className="w-3.5 h-3.5" />
                              <span>{isVideoSubmitted ? "Video on Drive" : "Submit Lab"}</span>
                            </Link>

                            {/* Study Reader Link */}
                            <Link
                              href={`/modules/${m.id}`}
                              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
                            >
                              <span>Study Chapter</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
