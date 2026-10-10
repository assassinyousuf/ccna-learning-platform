"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import confetti from "canvas-confetti";
import { curriculum, getAllModules } from "@/lib/curriculum";
import { sounds } from "@/lib/sound-effects";
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
  ChevronDown,
  TrendingUp,
  BarChart3,
  Target,
  ShieldCheck,
  History,
  User,
  Filter,
  RotateCcw,
  Check,
  Calendar,
  Zap,
  Activity,
  CheckSquare
} from "lucide-react";

interface DomainSummary {
  id: string;
  name: string;
  weight: number;
  percentage: number;
  totalQuestions: number;
  correctQuestions: number;
  status: "MASTERED" | "PROFICIENT" | "DEVELOPING" | "NEEDS_PRACTICE";
}

interface ExamHistoryItem {
  attemptId: string;
  examMode: string;
  examTitle: string;
  scaledScore: number;
  rawScore: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  domainScores?: Record<string, { total: number; correct: number; percentage: number; name: string }>;
  timeTakenSeconds?: number;
  timestamp: string;
}

interface QuizHistoryItem {
  attemptId: string;
  moduleId: string;
  moduleTitle?: string;
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  timestamp: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const allModules = getAllModules();

  const [activeTab, setActiveTab] = useState<"overview" | "chapters" | "exams" | "quizzes" | "timeline">("overview");
  const [selectedVolume, setSelectedVolume] = useState<1 | 2>(1);
  const [chapterFilter, setChapterFilter] = useState<"ALL" | "COMPLETED" | "UNCOMPLETED">("ALL");
  const [progress, setProgress] = useState<Record<string, string>>({});
  const [examHistory, setExamHistory] = useState<ExamHistoryItem[]>([]);
  const [quizHistory, setQuizHistory] = useState<QuizHistoryItem[]>([]);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedExamDetail, setSelectedExamDetail] = useState<ExamHistoryItem | null>(null);

  // Load progress and history from Backend & LocalStorage
  const loadProgressAndData = async () => {
    try {
      const userId = session?.user?.email || "guest-user";
      const res = await fetch(`/api/progress?userId=${encodeURIComponent(userId)}`);
      
      let backendProgress: Record<string, string> = {};
      let backendExams: ExamHistoryItem[] = [];
      let backendQuizzes: QuizHistoryItem[] = [];
      let backendSummary: any = null;

      if (res.ok) {
        const data = await res.json();
        backendProgress = data.progress || {};
        backendExams = data.examAttempts || [];
        backendQuizzes = data.quizAttempts || [];
        backendSummary = data.summary || null;
      }

      // Merge with localStorage fallback
      let mergedProgress = { ...backendProgress };
      try {
        const storedChapters = localStorage.getItem("ccna_completed_chapters");
        if (storedChapters) {
          const map = JSON.parse(storedChapters);
          Object.keys(map).forEach((mId) => {
            if (map[mId]) mergedProgress[mId] = "COMPLETED";
          });
        }
      } catch (e) {}

      let mergedExams = [...backendExams];
      try {
        const storedExams = localStorage.getItem("ccna_exam_history");
        if (storedExams) {
          const localExams: ExamHistoryItem[] = JSON.parse(storedExams);
          localExams.forEach((le) => {
            if (!mergedExams.some((me) => me.attemptId === le.attemptId)) {
              mergedExams.push(le);
            }
          });
        }
      } catch (e) {}
      mergedExams.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      let mergedQuizzes = [...backendQuizzes];
      try {
        const storedQuizzes = localStorage.getItem("ccna_quiz_history");
        if (storedQuizzes) {
          const localQuizzes: QuizHistoryItem[] = JSON.parse(storedQuizzes);
          localQuizzes.forEach((lq) => {
            if (!mergedQuizzes.some((mq) => mq.attemptId === lq.attemptId)) {
              mergedQuizzes.push(lq);
            }
          });
        }
      } catch (e) {}
      mergedQuizzes.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setProgress(mergedProgress);
      setExamHistory(mergedExams);
      setQuizHistory(mergedQuizzes);
      setSummaryData(backendSummary);
    } catch (err) {
      console.error("Failed to load user profile progress:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgressAndData();
  }, [session]);

  // Toggle chapter completion directly from dashboard
  const handleToggleChapterComplete = async (moduleId: string) => {
    sounds.playKeyClick();
    const isNowCompleted = progress[moduleId] !== "COMPLETED" && progress[moduleId] !== "READ";
    const nextStatus = isNowCompleted ? "COMPLETED" : "UNMARKED";

    // Update local state immediately
    const updated = { ...progress };
    if (isNowCompleted) {
      updated[moduleId] = "COMPLETED";
      sounds.playCommandSuccess();
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } else {
      delete updated[moduleId];
    }
    setProgress(updated);

    // Save to localStorage
    try {
      const stored = localStorage.getItem("ccna_completed_chapters");
      const map = stored ? JSON.parse(stored) : {};
      if (isNowCompleted) {
        map[moduleId] = true;
      } else {
        delete map[moduleId];
      }
      localStorage.setItem("ccna_completed_chapters", JSON.stringify(map));
    } catch (e) {}

    // Sync to backend
    try {
      const userId = session?.user?.email || "guest-user";
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          moduleId,
          status: nextStatus,
        }),
      });
    } catch (err) {
      console.error("Error syncing chapter toggle:", err);
    }
  };

  const currentVolumeData = curriculum.volumes.find((v) => v.volumeNumber === selectedVolume);
  const volumeModules = allModules.filter((m) => m.volume === selectedVolume);

  // Compute live dynamic stats
  const completedChaptersCount = useMemo(() => {
    return allModules.filter(
      (m) => progress[m.id] === "COMPLETED" || progress[m.id] === "READ" || progress[`${m.id}_video`] === "SUBMITTED"
    ).length;
  }, [allModules, progress]);

  const progressPercent = Math.round((completedChaptersCount / allModules.length) * 100);

  const quizzesTakenCount = quizHistory.length;
  const quizzesPassedCount = quizHistory.filter((q) => q.passed).length;
  const averageQuizScore = useMemo(() => {
    if (quizHistory.length === 0) return 0;
    const sum = quizHistory.reduce((acc, q) => acc + q.percentage, 0);
    return Math.round(sum / quizHistory.length);
  }, [quizHistory]);

  const examsTakenCount = examHistory.length;
  const examsPassedCount = examHistory.filter((e) => e.passed).length;
  const highestExamScore = useMemo(() => {
    if (examHistory.length === 0) return 0;
    return Math.max(...examHistory.map((e) => e.scaledScore));
  }, [examHistory]);

  const latestExamScore = examHistory.length > 0 ? examHistory[0].scaledScore : 0;

  // Cisco 200-301 Official Readiness Score (Scale 300 to 1000)
  const readinessScore = useMemo(() => {
    if (summaryData?.readinessScore) return summaryData.readinessScore;
    if (examsTakenCount > 0) {
      const examPart = highestExamScore * 0.5;
      const quizPart = (averageQuizScore / 100) * 1000 * 0.3;
      const completionPart = (completedChaptersCount / 49) * 1000 * 0.2;
      return Math.min(1000, Math.max(300, Math.round(examPart + quizPart + completionPart)));
    } else if (quizzesTakenCount > 0 || completedChaptersCount > 0) {
      const quizPart = (averageQuizScore / 100) * 700 * 0.6;
      const completionPart = (completedChaptersCount / 49) * 700 * 0.4;
      return Math.min(840, Math.max(300, Math.round(300 + quizPart + completionPart)));
    }
    return 300;
  }, [summaryData, examsTakenCount, highestExamScore, averageQuizScore, completedChaptersCount, quizzesTakenCount]);

  // Cadet Rank Designation
  const cadetRank = useMemo(() => {
    if (readinessScore >= 825) return { title: "CCNA Certified Candidate", level: "Elite Cadet", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" };
    if (readinessScore >= 700) return { title: "Senior Network Associate", level: "Level 3 Cadet", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30" };
    if (readinessScore >= 500) return { title: "Cisco Junior Apprentice", level: "Level 2 Cadet", color: "text-purple-400 bg-purple-500/10 border-purple-500/30" };
    return { title: "Network Foundations Cadet", level: "Level 1 Cadet", color: "text-slate-400 bg-slate-800 border-slate-700" };
  }, [readinessScore]);

  // 6 Domain Mastery Aggregations
  const domainMasteryList: DomainSummary[] = useMemo(() => {
    const DOMAIN_DEFS = [
      { id: "1.0", name: "Network Fundamentals", weight: 0.20 },
      { id: "2.0", name: "Network Access", weight: 0.20 },
      { id: "3.0", name: "IP Connectivity", weight: 0.25 },
      { id: "4.0", name: "IP Services", weight: 0.10 },
      { id: "5.0", name: "Security Fundamentals", weight: 0.15 },
      { id: "6.0", name: "Automation & Programmability", weight: 0.10 },
    ];

    const aggregates: Record<string, { total: number; correct: number }> = {
      "1.0": { total: 0, correct: 0 },
      "2.0": { total: 0, correct: 0 },
      "3.0": { total: 0, correct: 0 },
      "4.0": { total: 0, correct: 0 },
      "5.0": { total: 0, correct: 0 },
      "6.0": { total: 0, correct: 0 },
    };

    examHistory.forEach((ex) => {
      if (ex.domainScores) {
        Object.entries(ex.domainScores).forEach(([dId, st]) => {
          if (aggregates[dId]) {
            aggregates[dId].total += st.total || 0;
            aggregates[dId].correct += st.correct || 0;
          }
        });
      }
    });

    return DOMAIN_DEFS.map((d) => {
      const agg = aggregates[d.id];
      const pct = agg.total > 0 ? Math.round((agg.correct / agg.total) * 100) : 0;
      let status: DomainSummary["status"] = "NEEDS_PRACTICE";
      if (pct >= 85) status = "MASTERED";
      else if (pct >= 75) status = "PROFICIENT";
      else if (pct >= 50) status = "DEVELOPING";

      return {
        id: d.id,
        name: d.name,
        weight: d.weight,
        percentage: pct,
        totalQuestions: agg.total,
        correctQuestions: agg.correct,
        status,
      };
    });
  }, [examHistory]);

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10 space-y-10">
      {/* 1. STUDENT IDENTITY & COMMAND CENTER PROFILE BANNER */}
      <div className="p-8 sm:p-10 rounded-3xl glass-panel shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* User Bio & Avatar */}
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 via-emerald-400 to-indigo-500 p-0.5 glow-cyan shrink-0 shadow-xl">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center overflow-hidden">
                {session?.user?.image ? (
                  <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-9 h-9 text-cyan-400" />
                )}
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {session?.user?.name || "Cadet Engineer"}
                </h1>
                <span className={`text-xs font-mono px-3 py-1 rounded-full border font-semibold ${cadetRank.color}`}>
                  {cadetRank.title}
                </span>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                  {cadetRank.level}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 font-mono flex items-center gap-2">
                <span>{session?.user?.email || "cadet@ccna.academy"}</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400">CCNA 200-301 Certification Track</span>
              </p>
            </div>
          </div>

          {/* CCNA Readiness Meter Gauge */}
          <div className="flex items-center gap-6 bg-slate-950/80 border border-slate-800 p-5 rounded-2xl shadow-xl shrink-0">
            <div>
              <div className="flex items-center justify-between gap-4 text-xs font-mono text-slate-400">
                <span className="uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-cyan-400" />
                  Exam Readiness Score
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Pass Mark: 825
                </span>
              </div>
              
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl sm:text-4xl font-black text-cyan-400 font-mono">
                  {readinessScore}
                </span>
                <span className="text-xs text-slate-500 font-mono">/ 1000 Scaled</span>
              </div>

              <div className="w-48 sm:w-56 h-2 bg-slate-800 rounded-full mt-2 overflow-hidden relative">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-400 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, Math.max(5, ((readinessScore - 300) / 700) * 100))}%` }}
                />
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-sm"
                  style={{ left: `${((825 - 300) / 700) * 100}%` }}
                  title="Cisco Passing Standard: 825/1000"
                />
              </div>
            </div>

            <div className="w-14 h-14 rounded-full border-4 border-slate-800 border-t-cyan-400 border-r-emerald-400 flex items-center justify-center glow-cyan shadow-sm shrink-0">
              <Award className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
        </div>

        {/* Sync Status Sub-bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div className="flex flex-wrap items-center gap-6">
            <span className="flex items-center gap-2 text-emerald-400 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Gradebook Active
            </span>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5 text-blue-400">
              <HardDrive className="w-3.5 h-3.5" /> 5TB Google Drive Storage
            </span>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <FileSpreadsheet className="w-3.5 h-3.5" /> Google Sheets Synced
            </span>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5 text-purple-400">
              <Terminal className="w-3.5 h-3.5" /> 367 CLI Commands
            </span>
          </div>

          <button
            onClick={loadProgressAndData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors text-xs"
            title="Refresh gradebook data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Sync Stats</span>
          </button>
        </div>
      </div>

      {/* 2. FOUR KEY PERFORMANCE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Practice Exam Scores */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all shadow-lg space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-amber-400">
            <span className="uppercase tracking-wider font-semibold">Cisco Mock Exam</span>
            <Award className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">
              {highestExamScore > 0 ? highestExamScore : "---"}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {highestExamScore > 0 ? "/ 1000 Best" : "Not attempted"}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1 border-t border-slate-800/80">
            <span>Attempts: {examsTakenCount}</span>
            <span className={examsPassedCount > 0 ? "text-emerald-400 font-bold" : "text-slate-500"}>
              {examsPassedCount} Passed (&ge;825)
            </span>
          </div>
        </div>

        {/* Card 2: Chapter Review Quizzes */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all shadow-lg space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
            <span className="uppercase tracking-wider font-semibold">Review Quizzes</span>
            <HelpCircle className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">
              {averageQuizScore > 0 ? `${averageQuizScore}%` : "---"}
            </span>
            <span className="text-xs text-slate-400 font-mono">Average Accuracy</span>
          </div>
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1 border-t border-slate-800/80">
            <span>Taken: {quizzesTakenCount}</span>
            <span className="text-emerald-400 font-bold">
              {quizzesPassedCount} Passed (&ge;80%)
            </span>
          </div>
        </div>

        {/* Card 3: Completed Chapters */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all shadow-lg space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-emerald-400">
            <span className="uppercase tracking-wider font-semibold">Chapters Completed</span>
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">
              {completedChaptersCount}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ {allModules.length} Chapters</span>
          </div>
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1 border-t border-slate-800/80">
            <span>Syllabus Coverage</span>
            <span className="text-cyan-400 font-bold">{progressPercent}%</span>
          </div>
        </div>

        {/* Card 4: Active Video Proofs */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all shadow-lg space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-purple-400">
            <span className="uppercase tracking-wider font-semibold">Lab Video Proofs</span>
            <Video className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">
              {allModules.filter((m) => progress[`${m.id}_video`] === "SUBMITTED").length}
            </span>
            <span className="text-xs text-slate-400 font-mono">Verified on Drive</span>
          </div>
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1 border-t border-slate-800/80">
            <span>5-Pillar Protocol</span>
            <span className="text-purple-400 font-bold">Pillar 05 Ready</span>
          </div>
        </div>
      </div>

      {/* 3. CISCO 6-DOMAIN BLUEPRINT MASTERY MATRIX */}
      <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Official Cisco Blueprint Standard</span>
            </div>
            <h2 className="text-xl font-bold text-white">6-Domain Certification Mastery Matrix</h2>
            <p className="text-xs text-slate-400 mt-1">
              Live tracking calculated across all mock exams and chapter assessments adhering to official blueprint weights.
            </p>
          </div>
          <Link
            href="/practice-test"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors shrink-0"
          >
            <span>Launch Exam Drill</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {domainMasteryList.map((domain) => {
            const hasData = domain.totalQuestions > 0;
            return (
              <div
                key={domain.id}
                className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/90 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-mono text-cyan-400 font-semibold">
                      Domain {domain.id} • {Math.round(domain.weight * 100)}% Weight
                    </span>
                    <h3 className="text-sm font-bold text-white mt-0.5 line-clamp-1">
                      {domain.name}
                    </h3>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase shrink-0 ${
                      !hasData
                        ? "bg-slate-800 text-slate-500"
                        : domain.status === "MASTERED"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : domain.status === "PROFICIENT"
                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {!hasData ? "Untested" : domain.status}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Score Accuracy</span>
                    <span className="text-white font-bold">
                      {hasData ? `${domain.percentage}%` : "---"}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        domain.percentage >= 85
                          ? "bg-emerald-400"
                          : domain.percentage >= 70
                          ? "bg-cyan-400"
                          : "bg-amber-400"
                      }`}
                      style={{ width: `${hasData ? domain.percentage : 0}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-0.5">
                    <span>{hasData ? `${domain.correctQuestions}/${domain.totalQuestions} Qs Correct` : "Take a mock test to calibrate"}</span>
                    <span>Target &ge;82%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. MAIN INTERACTIVE TABS */}
      <div className="space-y-6">
        {/* Navigation Tab Buttons */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "overview"
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Curriculum &amp; Chapters ({completedChaptersCount}/49)</span>
          </button>

          <button
            onClick={() => setActiveTab("exams")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "exams"
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Practice Exam Scores ({examHistory.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("quizzes")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "quizzes"
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Quiz Results ({quizHistory.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("timeline")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "timeline"
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Activity History</span>
          </button>
        </div>

        {/* TAB 1: CURRICULUM & COMPLETED CHAPTERS */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Volume & Filter Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              {/* Volume 1 & 2 Selector */}
              <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
                <button
                  onClick={() => setSelectedVolume(1)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedVolume === 1
                      ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Volume 1: Fundamentals (24 Ch)
                </button>
                <button
                  onClick={() => setSelectedVolume(2)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedVolume === 2
                      ? "bg-emerald-400 text-slate-950 font-bold shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Volume 2: Advanced &amp; Security (25 Ch)
                </button>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs font-mono text-slate-400">Filter:</span>
                <select
                  value={chapterFilter}
                  onChange={(e) => setChapterFilter(e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="ALL">All Chapters ({volumeModules.length})</option>
                  <option value="COMPLETED">Completed Only</option>
                  <option value="UNCOMPLETED">Needs Study</option>
                </select>
              </div>
            </div>

            {/* Part Breakdown & Chapter Cards */}
            {currentVolumeData && (
              <div className="space-y-10">
                {currentVolumeData.parts.map((part) => {
                  let partChapters = volumeModules.filter((m) => m.partNumber === part.partNumber);
                  if (chapterFilter === "COMPLETED") {
                    partChapters = partChapters.filter((m) => progress[m.id] === "COMPLETED" || progress[m.id] === "READ");
                  } else if (chapterFilter === "UNCOMPLETED") {
                    partChapters = partChapters.filter((m) => progress[m.id] !== "COMPLETED" && progress[m.id] !== "READ");
                  }

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
                        <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                          {partChapters.length} Chapters
                        </span>
                      </div>

                      {/* Chapter Cards Grid */}
                      <div className="space-y-3">
                        {partChapters.map((m) => {
                          const isCompleted = progress[m.id] === "COMPLETED" || progress[m.id] === "READ";
                          const isQuizPassed = progress[`${m.id}_quiz`] === "PASSED";
                          const isVideoSubmitted = progress[`${m.id}_video`] === "SUBMITTED";

                          // Check if user took quiz and has a score
                          const moduleQuizAttempt = quizHistory.find((q) => q.moduleId === m.id);

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
                                {/* Chapter Title & Status Info */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
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
                                    {moduleQuizAttempt && (
                                      <span
                                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                                          moduleQuizAttempt.passed
                                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                        }`}
                                      >
                                        Quiz: {moduleQuizAttempt.percentage}% ({moduleQuizAttempt.score}/{moduleQuizAttempt.total})
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

                                {/* Milestone Action Buttons */}
                                <div className="flex flex-wrap items-center gap-2 shrink-0">
                                  {/* Mark Studied Button */}
                                  <button
                                    onClick={() => handleToggleChapterComplete(m.id)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
                                      isCompleted
                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-semibold"
                                        : "bg-slate-800/80 text-slate-400 border-slate-700/80 hover:text-white"
                                    }`}
                                    title={isCompleted ? "Mark as uncompleted" : "Mark chapter completed"}
                                  >
                                    <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? "text-emerald-400" : "text-slate-500"}`} />
                                    <span>{isCompleted ? "Completed ✓" : "Mark Done"}</span>
                                  </button>

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
                                    <span>{isQuizPassed ? "Quiz Passed" : "Quiz (App C)"}</span>
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
                                    <span>{isVideoSubmitted ? "Video Ready" : "Submit Lab"}</span>
                                  </Link>

                                  {/* Study Reader Link */}
                                  <Link
                                    href={`/modules/${m.id}`}
                                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
                                  >
                                    <span>Study</span>
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
        )}

        {/* TAB 2: PRACTICE EXAM SIMULATOR SCORES */}
        {activeTab === "exams" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span>Cisco 200-301 Official Exam Simulator Gradebook</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Scaled score calculated on Pearson VUE standards (300 minimum, 825 passing mark, 1000 maximum).
                </p>
              </div>
              <Link
                href="/practice-test"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all shrink-0"
              >
                <span>Take Practice Exam</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {examHistory.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4">
                <Award className="w-12 h-12 text-slate-600 mx-auto" />
                <h4 className="text-base font-bold text-white">No Exam Simulator Attempts Recorded Yet</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Take a 120-minute, 100-question or 60-question weighted Cisco blueprint exam simulator to establish your baseline score and calibrate your readiness index.
                </p>
                <div className="pt-2">
                  <Link
                    href="/practice-test"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 hover:opacity-90 transition-opacity"
                  >
                    <span>Launch Simulator Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {examHistory.map((exam, idx) => {
                  return (
                    <div
                      key={exam.attemptId || idx}
                      className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/30 transition-all space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-cyan-400 font-semibold">
                              Attempt #{examHistory.length - idx}
                            </span>
                            <span className="text-slate-600">•</span>
                            <span className="text-xs font-mono text-slate-400">
                              {new Date(exam.timestamp).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-white">
                            {exam.examTitle || exam.examMode}
                          </h4>
                        </div>

                        {/* Scaled Score Pill */}
                        <div className="flex items-center gap-4 shrink-0">
                          <div className="text-right">
                            <span className="text-xs font-mono text-slate-400 block">Scaled Score</span>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-2xl font-black text-amber-400 font-mono">
                                {exam.scaledScore}
                              </span>
                              <span className="text-xs font-mono text-slate-500">/ 1000</span>
                            </div>
                          </div>

                          <div
                            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase border ${
                              exam.passed
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                            }`}
                          >
                            {exam.passed ? "PASSED (>=825)" : "FAILED (<825)"}
                          </div>
                        </div>
                      </div>

                      {/* Score Metrics Bar */}
                      <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
                        <div>
                          <span className="text-slate-500">Raw Questions: </span>
                          <span className="text-white font-bold">{exam.rawScore} / {exam.totalQuestions} ({exam.percentage}%)</span>
                        </div>
                        {exam.timeTakenSeconds && (
                          <div>
                            <span className="text-slate-500">Time Taken: </span>
                            <span className="text-cyan-400 font-bold">{Math.round(exam.timeTakenSeconds / 60)} minutes</span>
                          </div>
                        )}
                        <div>
                          <span className="text-slate-500">Benchmark Target: </span>
                          <span className="text-emerald-400 font-bold">825 / 1000</span>
                        </div>
                      </div>

                      {/* Domain breakdown if available */}
                      {exam.domainScores && Object.keys(exam.domainScores).length > 0 && (
                        <div className="pt-2 border-t border-slate-800/80">
                          <span className="text-xs font-mono text-slate-400 block mb-2 font-semibold">
                            Cisco Blueprint 6-Domain Breakdown:
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                            {Object.entries(exam.domainScores).map(([dId, dStat]) => (
                              <div key={dId} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-center">
                                <span className="text-[10px] font-mono text-cyan-400 block font-semibold">
                                  Domain {dId}
                                </span>
                                <span className="text-sm font-bold text-white font-mono mt-0.5 block">
                                  {dStat.percentage}%
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  {dStat.correct}/{dStat.total} Qs
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CHAPTER REVIEW QUIZZES */}
        {activeTab === "quizzes" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-cyan-400" />
                  <span>Appendix C Chapter Review Quiz Results</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  80% passing grade required for mastery endorsement and 5-pillar active recall completion.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                <span>Avg: <strong className="text-cyan-400">{averageQuizScore}%</strong></span>
                <span>•</span>
                <span>Passed: <strong className="text-emerald-400">{quizzesPassedCount}/{quizzesTakenCount}</strong></span>
              </div>
            </div>

            {quizHistory.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4">
                <HelpCircle className="w-12 h-12 text-slate-600 mx-auto" />
                <h4 className="text-base font-bold text-white">No Chapter Quizzes Taken Yet</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Complete reading a chapter and challenge yourself with the official technical review questions from Appendix C.
                </p>
                <div className="pt-2">
                  <Link
                    href="/modules/v1-ch2-network-devices/quiz"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 hover:opacity-90 transition-opacity"
                  >
                    <span>Start Chapter 2 Quiz</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {quizHistory.map((quiz, idx) => (
                  <div
                    key={quiz.attemptId || idx}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-cyan-400 font-semibold">
                          Quiz Assessment
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-xs font-mono text-slate-500">
                          {new Date(quiz.timestamp).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-white">
                        {quiz.moduleTitle || `Chapter Review (${quiz.moduleId})`}
                      </h4>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-mono text-slate-400 block">Score</span>
                        <span className="text-lg font-bold text-white font-mono">
                          {quiz.score} / {quiz.total} ({quiz.percentage}%)
                        </span>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase border ${
                          quiz.passed
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {quiz.passed ? "Passed ✓" : "Needs Retake"}
                      </span>

                      <Link
                        href={`/modules/${quiz.moduleId}/quiz`}
                        className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                        title="Retake Quiz"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: COMPLETED ACTIVITY TIMELINE */}
        {activeTab === "timeline" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" />
                <span>Cadet Learning History &amp; Milestone Feed</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Chronological audit trail of all completed chapters, exam simulator attempts, review quizzes, and lab submissions.
              </p>
            </div>

            <div className="space-y-3">
              {/* Combine activities */}
              {(() => {
                const activities: Array<{
                  id: string;
                  type: "EXAM" | "QUIZ" | "CHAPTER" | "LAB";
                  title: string;
                  badge: string;
                  score?: string;
                  passed?: boolean;
                  date: string;
                }> = [];

                examHistory.forEach((e) => {
                  activities.push({
                    id: e.attemptId,
                    type: "EXAM",
                    title: `Completed Mock Exam: ${e.examTitle || e.examMode}`,
                    badge: "Practice Exam",
                    score: `${e.scaledScore}/1000 (${e.percentage}%)`,
                    passed: e.passed,
                    date: e.timestamp,
                  });
                });

                quizHistory.forEach((q) => {
                  activities.push({
                    id: q.attemptId,
                    type: "QUIZ",
                    title: `Submitted Quiz: ${q.moduleTitle || q.moduleId}`,
                    badge: "Review Quiz",
                    score: `${q.score}/${q.total} (${q.percentage}%)`,
                    passed: q.passed,
                    date: q.timestamp,
                  });
                });

                // Completed chapters
                Object.entries(progress).forEach(([key, val]) => {
                  if (!key.includes("_") && (val === "COMPLETED" || val === "READ")) {
                    const mod = allModules.find((m) => m.id === key);
                    activities.push({
                      id: `ch-${key}`,
                      type: "CHAPTER",
                      title: `Studied Chapter: ${mod ? mod.title : key}`,
                      badge: "Chapter Completed",
                      score: "100%",
                      passed: true,
                      date: new Date().toISOString(),
                    });
                  }
                });

                activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                if (activities.length === 0) {
                  return (
                    <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
                      No activities logged yet. Start studying a chapter or launch an exam simulator to populate your milestone history!
                    </div>
                  );
                }

                return activities.map((act) => (
                  <div
                    key={act.id}
                    className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          act.type === "EXAM"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : act.type === "QUIZ"
                            ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        }`}
                      >
                        {act.type === "EXAM" ? (
                          <Award className="w-4 h-4" />
                        ) : act.type === "QUIZ" ? (
                          <HelpCircle className="w-4 h-4" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                      </div>

                      <div>
                        <span className="text-[10px] font-mono uppercase text-slate-400 block">
                          {act.badge}
                        </span>
                        <h5 className="text-xs sm:text-sm font-bold text-white">
                          {act.title}
                        </h5>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold text-cyan-400 block">
                        {act.score}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                          act.passed
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-rose-500/10 text-rose-400"
                        }`}
                      >
                        {act.passed ? "Passed" : "Needs Review"}
                      </span>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
