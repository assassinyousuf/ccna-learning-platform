"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { getAllModules, Module, QuizQuestion } from "@/lib/curriculum";
import { sounds } from "@/lib/sound-effects";
import confetti from "canvas-confetti";
import {
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  Flag,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Layers,
  Sparkles,
  Sliders,
  AlertTriangle,
  Play,
  Pause,
  Filter,
  BarChart3,
  Compass,
  FileText,
  Target,
  ExternalLink,
  ShieldCheck,
  Zap
} from "lucide-react";

export interface ExamQuestion extends QuizQuestion {
  moduleId: string;
  moduleTitle: string;
  chapterNumber: number;
  volume: number;
  domainId: string;
  domainName: string;
}

const DOMAINS = [
  { id: "1.0", name: "Network Fundamentals", weight: 0.20, color: "from-blue-500 to-cyan-500", border: "border-cyan-500/30", text: "text-cyan-400" },
  { id: "2.0", name: "Network Access", weight: 0.20, color: "from-emerald-500 to-teal-500", border: "border-emerald-500/30", text: "text-emerald-400" },
  { id: "3.0", name: "IP Connectivity", weight: 0.25, color: "from-purple-500 to-indigo-500", border: "border-purple-500/30", text: "text-purple-400" },
  { id: "4.0", name: "IP Services", weight: 0.10, color: "from-amber-500 to-orange-500", border: "border-amber-500/30", text: "text-amber-400" },
  { id: "5.0", name: "Security Fundamentals", weight: 0.15, color: "from-rose-500 to-pink-500", border: "border-rose-500/30", text: "text-rose-400" },
  { id: "6.0", name: "Automation & Programmability", weight: 0.10, color: "from-fuchsia-500 to-violet-500", border: "border-fuchsia-500/30", text: "text-fuchsia-400" },
];

export default function PracticeTestPage() {
  const { data: session } = useSession();
  const allModules = useMemo(() => getAllModules(), []);

  // Build the complete question pool across all 49 chapters
  const allQuestionsPool: ExamQuestion[] = useMemo(() => {
    const pool: ExamQuestion[] = [];
    allModules.forEach((m) => {
      if (m.quiz && m.quiz.length > 0) {
        m.quiz.forEach((q) => {
          pool.push({
            ...q,
            moduleId: m.id,
            moduleTitle: m.title,
            chapterNumber: m.chapterNumber,
            volume: m.volume,
            domainId: m.domainId || "1.0",
            domainName: m.domainName || "Network Fundamentals",
          });
        });
      }
    });
    return pool;
  }, [allModules]);

  // Test setup states
  const [testState, setTestState] = useState<"SELECT" | "TESTING" | "REVIEW">("SELECT");
  const [testMode, setTestMode] = useState<"FULL_MOCK" | "DOMAIN_DRILL" | "PART_TEST" | "QUICK_DRILL">("FULL_MOCK");
  const [selectedDomain, setSelectedDomain] = useState("1.0");
  const [selectedPart, setSelectedPart] = useState<{ volume: number; part: number }>({ volume: 1, part: 1 });

  // Active test execution states
  const [testQuestions, setTestQuestions] = useState<ExamQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(120 * 60);
  const [timerActive, setTimerActive] = useState(false);
  const [showNavGrid, setShowNavGrid] = useState(false);
  const [confirmSubmitModal, setConfirmSubmitModal] = useState(false);

  // Review states
  const [reviewFilter, setReviewFilter] = useState<"ALL" | "INCORRECT" | "FLAGGED">("ALL");
  const [timeTakenSeconds, setTimeTakenSeconds] = useState(0);

  // Countdown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive && secondsRemaining > 0 && testState === "TESTING") {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            handleCompleteExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, secondsRemaining, testState]);

  // Start selected test
  const startExam = (mode: "FULL_MOCK" | "DOMAIN_DRILL" | "PART_TEST" | "QUICK_DRILL") => {
    sounds.playKeyClick();
    let selected: ExamQuestion[] = [];
    let initialSeconds = 120 * 60; // 120 minutes default

    if (mode === "FULL_MOCK") {
      // 60 Questions weighted by Cisco CCNA 200-301 Blueprint
      initialSeconds = 120 * 60;
      const targetCounts: Record<string, number> = {
        "1.0": 12, // 20%
        "2.0": 12, // 20%
        "3.0": 15, // 25%
        "4.0": 6,  // 10%
        "5.0": 9,  // 15%
        "6.0": 6,  // 10%
      };

      Object.entries(targetCounts).forEach(([dId, count]) => {
        const domainPool = allQuestionsPool.filter((q) => q.domainId === dId);
        const shuffled = [...domainPool].sort(() => 0.5 - Math.random());
        selected.push(...shuffled.slice(0, count));
      });
      // Final shuffle of selected questions
      selected.sort(() => 0.5 - Math.random());
    } else if (mode === "DOMAIN_DRILL") {
      initialSeconds = 30 * 60;
      const domainPool = allQuestionsPool.filter((q) => q.domainId === selectedDomain);
      selected = [...domainPool].sort(() => 0.5 - Math.random()).slice(0, 15);
    } else if (mode === "PART_TEST") {
      initialSeconds = 45 * 60;
      const partPool = allQuestionsPool.filter(
        (q) => {
          const mod = allModules.find((m) => m.id === q.moduleId);
          return mod && mod.volume === selectedPart.volume && mod.partNumber === selectedPart.part;
        }
      );
      selected = [...partPool].sort(() => 0.5 - Math.random()).slice(0, 20);
    } else {
      // QUICK_DRILL: 20 random questions
      initialSeconds = 25 * 60;
      selected = [...allQuestionsPool].sort(() => 0.5 - Math.random()).slice(0, 20);
    }

    if (selected.length === 0) {
      selected = [...allQuestionsPool].slice(0, 20);
    }

    setTestQuestions(selected);
    setCurrentIndex(0);
    setUserAnswers({});
    setFlaggedQuestions({});
    setSecondsRemaining(initialSeconds);
    setTimeTakenSeconds(0);
    setTimerActive(true);
    setTestState("TESTING");
  };

  const handleSelectOption = (qId: string, optionIdx: number) => {
    sounds.playKeyClick();
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: optionIdx,
    }));
  };

  const toggleFlagQuestion = (qId: string) => {
    sounds.playKeyClick();
    setFlaggedQuestions((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const handleCompleteExam = () => {
    setTimerActive(false);
    setConfirmSubmitModal(false);
    sounds.playCommandSuccess();

    const totalSeconds = testMode === "FULL_MOCK" ? 120 * 60 : (testMode === "DOMAIN_DRILL" ? 30 * 60 : 25 * 60);
    setTimeTakenSeconds(totalSeconds - secondsRemaining);
    setTestState("REVIEW");

    // Check pass/fail
    let correctCount = 0;
    testQuestions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const percentage = Math.round((correctCount / testQuestions.length) * 100);
    if (percentage >= 80) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
      });
    }

    // Sync to Sheets
    try {
      fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleId: `practice-exam-${testMode.toLowerCase()}`,
          answers: userAnswers,
          userId: session?.user?.email || "guest-user",
          userEmail: session?.user?.email || "guest@ccna.academy",
        }),
      });
    } catch (e) {
      console.error("Failed to sync score to sheets:", e);
    }
  };

  // Score metrics
  const scoreMetrics = useMemo(() => {
    let totalScore = 0;
    const domainStats: Record<string, { total: number; correct: number; name: string }> = {};

    DOMAINS.forEach((d) => {
      domainStats[d.id] = { total: 0, correct: 0, name: d.name };
    });

    testQuestions.forEach((q) => {
      const isCorrect = userAnswers[q.id] === q.correctAnswer;
      if (isCorrect) totalScore += 1;

      const dId = q.domainId || "1.0";
      if (!domainStats[dId]) {
        domainStats[dId] = { total: 0, correct: 0, name: q.domainName };
      }
      domainStats[dId].total += 1;
      if (isCorrect) domainStats[dId].correct += 1;
    });

    const totalQuestions = testQuestions.length || 1;
    const percent = Math.round((totalScore / totalQuestions) * 100);
    const scaledScore = Math.round(percent * 10); // scale out of 1000
    const passed = percent >= 80;

    return {
      totalScore,
      totalQuestions,
      percent,
      scaledScore,
      passed,
      domainStats,
    };
  }, [testQuestions, userAnswers]);

  // Formatter for timer
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const answeredCount = Object.keys(userAnswers).length;
  const flaggedCount = Object.values(flaggedQuestions).filter(Boolean).length;
  const currentQ = testQuestions[currentIndex];

  // Filtered review questions
  const filteredReviewQuestions = useMemo(() => {
    if (reviewFilter === "INCORRECT") {
      return testQuestions.filter((q) => userAnswers[q.id] !== q.correctAnswer);
    }
    if (reviewFilter === "FLAGGED") {
      return testQuestions.filter((q) => flaggedQuestions[q.id]);
    }
    return testQuestions;
  }, [testQuestions, userAnswers, flaggedQuestions, reviewFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* SCREEN 1: EXAM MODE SELECTION */}
      {testState === "SELECT" && (
        <div className="space-y-12">
          {/* Hero Banner */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden text-center max-w-4xl mx-auto">
            <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xs mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Official Cisco CCNA 200-301 Blueprint Testing Engine</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              CCNA 200-301 <span className="text-cyan-400">Practice Exam</span> &amp; Test Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-4 max-w-2xl mx-auto leading-relaxed">
              Prepare for exam day with authentic assessments, domain-weighted simulations, and comprehensive explanations from Appendix C &amp; D of Jeremy McDowell&apos;s &quot;Acing the CCNA Exam&quot;.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-800/80">
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="text-xl sm:text-2xl font-black text-white font-mono">{allQuestionsPool.length}</span>
                <span className="text-[11px] text-slate-400 block font-mono">Exam Questions</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">49</span>
                <span className="text-[11px] text-slate-400 block font-mono">Chapters Covered</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">6 Domains</span>
                <span className="text-[11px] text-slate-400 block font-mono">Cisco Weighting</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="text-xl sm:text-2xl font-black text-purple-400 font-mono">800 / 1000</span>
                <span className="text-[11px] text-slate-400 block font-mono">Passing Standard</span>
              </div>
            </div>
          </div>

          {/* Test Modes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Mode 1: Full 200-301 Mock Exam */}
            <div className="p-8 rounded-3xl bg-slate-900/70 border border-cyan-500/30 shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-cyan-500/60 transition-all">
              <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-mono uppercase font-semibold">
                Recommended
              </div>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Full CCNA 200-301 Mock Exam</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Real exam simulation with 60 questions selected strictly by Cisco domain weights across all 49 chapters. Enforces a 120-minute countdown timer with score scaling out of 1000.
                </p>
                <div className="flex items-center gap-4 mt-4 text-xs font-mono text-slate-300">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-cyan-400" /> 120 Minutes</span>
                  <span>•</span>
                  <span>60 Questions</span>
                  <span>•</span>
                  <span className="text-emerald-400">80% Pass Mark</span>
                </div>
              </div>

              <button
                onClick={() => startExam("FULL_MOCK")}
                className="mt-8 w-full py-3.5 rounded-xl font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-95 transition-opacity flex items-center justify-center gap-2 glow-cyan text-sm shadow-xl"
              >
                <span>Launch Full Mock Exam</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mode 2: Domain Mastery Drill */}
            <div className="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl flex flex-col justify-between hover:border-emerald-500/40 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Domain Mastery Drill</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Target one of the 6 official exam domains to reinforce specific weak points. 15 questions, 30 minutes timed test.
                </p>

                <div className="mt-4">
                  <label className="text-[11px] font-mono text-slate-400 block mb-1.5 uppercase">Select Target Domain:</label>
                  <select
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    {DOMAINS.map((d) => (
                      <option key={d.id} value={d.id}>
                        Domain {d.id}: {d.name} ({Math.round(d.weight * 100)}%)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={() => startExam("DOMAIN_DRILL")}
                className="mt-8 w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 transition-opacity flex items-center justify-center gap-2 text-sm shadow-xl"
              >
                <span>Start Domain Drill (15 Qs)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mode 3: Book Part Review Assessment */}
            <div className="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl flex flex-col justify-between hover:border-purple-500/40 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Textbook Part Assessment</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Test your comprehension across any of the 11 major parts in Volume 1 and Volume 2 of the textbook. 20 questions, 45 minutes.
                </p>

                <div className="mt-4 space-y-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedPart({ volume: 1, part: 1 })}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                        selectedPart.volume === 1
                          ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                          : "bg-slate-950 text-slate-400 border-slate-800"
                      }`}
                    >
                      Volume 1 Parts
                    </button>
                    <button
                      onClick={() => setSelectedPart({ volume: 2, part: 1 })}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                        selectedPart.volume === 2
                          ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                          : "bg-slate-950 text-slate-400 border-slate-800"
                      }`}
                    >
                      Volume 2 Parts
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => startExam("PART_TEST")}
                className="mt-8 w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-95 transition-opacity flex items-center justify-center gap-2 text-sm shadow-xl"
              >
                <span>Launch Part Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mode 4: Quick 20-Question Daily Drill */}
            <div className="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl flex flex-col justify-between hover:border-amber-500/40 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Rapid 20-Question Daily Drill</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  20 random questions across all 49 chapters. Perfect for a quick 25-minute active recall session on your morning commute or lunch break.
                </p>
                <div className="flex items-center gap-4 mt-4 text-xs font-mono text-slate-300">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-400" /> 25 Minutes</span>
                  <span>•</span>
                  <span>20 Questions</span>
                  <span>•</span>
                  <span>Randomized</span>
                </div>
              </div>

              <button
                onClick={() => startExam("QUICK_DRILL")}
                className="mt-8 w-full py-3.5 rounded-xl font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-orange-400 hover:opacity-95 transition-opacity flex items-center justify-center gap-2 text-sm shadow-xl"
              >
                <span>Start Rapid Drill (20 Qs)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 2: ACTIVE EXAM SIMULATION */}
      {testState === "TESTING" && currentQ && (
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Floating HUD Bar */}
          <div className="sticky top-20 z-40 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400">
                Question <span className="text-white font-bold text-sm">{currentIndex + 1}</span> of {testQuestions.length}
              </span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="text-xs font-mono text-emerald-400 hidden sm:inline">
                {answeredCount} Answered
              </span>
              {flaggedCount > 0 && (
                <span className="text-xs font-mono text-amber-400 flex items-center gap-1">
                  <Flag className="w-3 h-3 fill-amber-400" /> {flaggedCount} Flagged
                </span>
              )}
            </div>

            {/* Center: Live Countdown Timer */}
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-sm font-bold border transition-colors ${
                  secondsRemaining < 300
                    ? "bg-rose-500/20 border-rose-500/40 text-rose-400 animate-pulse"
                    : secondsRemaining < 600
                    ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
                    : "bg-slate-950 border-slate-800 text-cyan-400"
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{formatTime(secondsRemaining)}</span>
              </div>
              <button
                onClick={() => setTimerActive((prev) => !prev)}
                className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
                title={timerActive ? "Pause Timer" : "Resume Timer"}
              >
                {timerActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            </div>

            {/* Right: Navigator & Finish Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowNavGrid((prev) => !prev)}
                className="px-3 py-1.5 rounded-xl text-xs font-mono bg-slate-950 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              >
                Question Grid
              </button>
              <button
                onClick={() => setConfirmSubmitModal(true)}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 hover:opacity-90 transition-opacity"
              >
                Finish Exam
              </button>
            </div>
          </div>

          {/* Question Palette / Navigator Drawer */}
          {showNavGrid && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold">
                  Exam Question Palette
                </h4>
                <div className="flex items-center gap-3 text-[11px] font-mono">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Answered
                  </span>
                  <span className="flex items-center gap-1 text-amber-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Flagged
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-800" /> Unanswered
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 gap-2">
                {testQuestions.map((q, idx) => {
                  const isAnswered = userAnswers[q.id] !== undefined;
                  const isFlagged = flaggedQuestions[q.id];
                  const isCurrent = idx === currentIndex;

                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setCurrentIndex(idx);
                        setShowNavGrid(false);
                      }}
                      className={`h-9 rounded-xl font-mono text-xs font-bold border transition-all relative ${
                        isCurrent
                          ? "ring-2 ring-cyan-400 border-cyan-400 text-white"
                          : ""
                      } ${
                        isFlagged
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                          : isAnswered
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      {idx + 1}
                      {isFlagged && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Active Question Card */}
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-6">
            {/* Question Meta Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Domain {currentQ.domainId}: {currentQ.domainName}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Vol {currentQ.volume} • Ch {currentQ.chapterNumber}
                </span>
              </div>

              {/* Flag for review button */}
              <button
                onClick={() => toggleFlagQuestion(currentQ.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono border transition-all ${
                  flaggedQuestions[currentQ.id]
                    ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                    : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                <Flag className={`w-3.5 h-3.5 ${flaggedQuestions[currentQ.id] ? "fill-amber-400" : ""}`} />
                <span>{flaggedQuestions[currentQ.id] ? "Flagged" : "Flag for Review"}</span>
              </button>
            </div>

            {/* Question Text */}
            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                {currentQ.question}
              </h3>
            </div>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = userAnswers[currentQ.id] === optIdx;

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(currentQ.id, optIdx)}
                    className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? "bg-cyan-500/10 border-cyan-500/60 text-white shadow-lg glow-cyan"
                        : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950"
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full border flex items-center justify-center font-mono text-xs shrink-0 mt-0.5 ${
                        isSelected
                          ? "bg-cyan-400 text-slate-950 border-cyan-400 font-bold"
                          : "border-slate-700 text-slate-400"
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="flex-1 leading-relaxed">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Step Navigation Bar */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-800">
              <button
                disabled={currentIndex === 0}
                onClick={() => {
                  sounds.playKeyClick();
                  setCurrentIndex((prev) => Math.max(0, prev - 1));
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  currentIndex === 0
                    ? "opacity-40 cursor-not-allowed text-slate-500"
                    : "bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <span className="text-xs font-mono text-slate-500">
                {currentIndex + 1} / {testQuestions.length}
              </span>

              {currentIndex < testQuestions.length - 1 ? (
                <button
                  onClick={() => {
                    sounds.playKeyClick();
                    setCurrentIndex((prev) => Math.min(testQuestions.length - 1, prev + 1));
                  }}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setConfirmSubmitModal(true)}
                  className="flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 hover:opacity-90 transition-opacity"
                >
                  <span>Finish &amp; Score</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Confirm Finish Modal */}
          {confirmSubmitModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 max-w-md w-full shadow-2xl space-y-4 text-center">
                <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
                <h3 className="text-xl font-bold text-white">Ready to Finish Your Exam?</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  You have answered <span className="text-emerald-400 font-bold">{answeredCount}</span> of{" "}
                  <span className="text-white font-bold">{testQuestions.length}</span> questions.
                  {testQuestions.length - answeredCount > 0 && (
                    <span className="text-rose-400 block mt-1 font-semibold">
                      You have {testQuestions.length - answeredCount} unanswered questions!
                    </span>
                  )}
                </p>
                <div className="pt-4 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setConfirmSubmitModal(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white"
                  >
                    Keep Working
                  </button>
                  <button
                    onClick={handleCompleteExam}
                    className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:opacity-90"
                  >
                    Submit Now
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SCREEN 3: COMPREHENSIVE PERFORMANCE REPORT & DETAILED REVIEW */}
      {testState === "REVIEW" && (
        <div className="space-y-10 max-w-5xl mx-auto">
          {/* Top Scorecard Hero */}
          <div
            className={`p-8 sm:p-10 rounded-3xl border shadow-2xl text-center relative overflow-hidden ${
              scoreMetrics.passed
                ? "bg-gradient-to-b from-slate-900 via-slate-900/90 to-emerald-950/20 border-emerald-500/40"
                : "bg-gradient-to-b from-slate-900 via-slate-900/90 to-rose-950/20 border-rose-500/40"
            }`}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-4 border bg-slate-950">
              <Award className={`w-4 h-4 ${scoreMetrics.passed ? "text-emerald-400" : "text-rose-400"}`} />
              <span className={scoreMetrics.passed ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                {scoreMetrics.passed ? "PASS • CCNA Readiness Verified" : "NEEDS PRACTICE • Below 80% Threshold"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-4">
              <div>
                <span className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white">
                  {scoreMetrics.scaledScore}
                </span>
                <span className="text-xl font-mono text-slate-500"> / 1000</span>
                <span className="text-xs text-slate-400 block font-mono mt-1">
                  Scaled CCNA Score ({scoreMetrics.percent}%)
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed mt-2">
              {scoreMetrics.passed
                ? "Outstanding performance! Your score satisfies the Cisco CCNA passing threshold. Your test result has been logged to the central Google Sheets database."
                : "A minimum score of 800 (80%) is recommended before booking your official Pearson VUE exam. Review the domain-by-domain diagnostic below to identify chapters requiring re-reading."}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => setTestState("SELECT")}
                className="px-6 py-3 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:opacity-90 shadow-xl flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Take Another Practice Exam</span>
              </button>
              <Link
                href="/dashboard"
                className="px-6 py-3 rounded-xl text-xs font-semibold bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
              >
                Return to Student Dashboard
              </Link>
            </div>
          </div>

          {/* Domain Breakdown Diagnostic Table */}
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                  <span>Domain-by-Domain Proficiency Diagnostic</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Evaluate your competence against Cisco&apos;s 6 CCNA Blueprint domains.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {DOMAINS.map((d) => {
                const stat = scoreMetrics.domainStats[d.id] || { total: 0, correct: 0, name: d.name };
                const pct = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 100;
                const status = pct >= 85 ? "MASTERED" : pct >= 75 ? "PROFICIENT" : "NEEDS REVIEW";

                return (
                  <div key={d.id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono font-bold ${d.text}`}>Domain {d.id}</span>
                        <span className="text-slate-300 font-medium">{d.name}</span>
                        <span className="text-[10px] font-mono text-slate-500">
                          ({Math.round(d.weight * 100)}% Blueprint weight)
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400 font-mono text-xs">
                          {stat.correct} / {stat.total} Correct
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                            status === "MASTERED"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : status === "PROFICIENT"
                              ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {status} ({pct}%)
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          pct >= 85 ? "bg-emerald-400" : pct >= 75 ? "bg-cyan-400" : "bg-rose-400"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Question Review Section */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  <span>Question-by-Question Deep Review &amp; Explanations</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Read complete technical explanations from Appendix D for every question.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
                <button
                  onClick={() => setReviewFilter("ALL")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    reviewFilter === "ALL" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  All ({testQuestions.length})
                </button>
                <button
                  onClick={() => setReviewFilter("INCORRECT")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    reviewFilter === "INCORRECT" ? "bg-rose-500/20 text-rose-300" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Incorrect ({testQuestions.length - scoreMetrics.totalScore})
                </button>
                <button
                  onClick={() => setReviewFilter("FLAGGED")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    reviewFilter === "FLAGGED" ? "bg-amber-500/20 text-amber-300" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Flagged ({flaggedCount})
                </button>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {filteredReviewQuestions.map((q, idx) => {
                const studentAns = userAnswers[q.id];
                const isCorrect = studentAns === q.correctAnswer;

                return (
                  <div
                    key={q.id}
                    className={`p-6 rounded-3xl border space-y-4 ${
                      isCorrect
                        ? "bg-slate-900/50 border-emerald-500/30"
                        : "bg-slate-900/80 border-rose-500/30"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono px-2 py-0.5 rounded text-[11px] font-bold ${
                            isCorrect
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-rose-500/20 text-rose-400"
                          }`}
                        >
                          {isCorrect ? "CORRECT" : "INCORRECT"}
                        </span>
                        <span className="text-slate-400 font-mono">
                          Vol {q.volume} • Ch {q.chapterNumber}: {q.moduleTitle}
                        </span>
                      </div>

                      <Link
                        href={`/modules/${q.moduleId}`}
                        target="_blank"
                        className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
                      >
                        <span>Study Chapter</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-white">
                      {q.question}
                    </h4>

                    {/* Options list in review */}
                    <div className="space-y-2 pt-1">
                      {q.options.map((opt, optIdx) => {
                        const isStudent = studentAns === optIdx;
                        const isOfficial = q.correctAnswer === optIdx;

                        return (
                          <div
                            key={optIdx}
                            className={`p-3 rounded-xl border text-xs flex items-center gap-3 ${
                              isOfficial
                                ? "bg-emerald-500/10 border-emerald-500/60 text-emerald-200"
                                : isStudent && !isOfficial
                                ? "bg-rose-500/10 border-rose-500/60 text-rose-200"
                                : "bg-slate-950/40 border-slate-800/80 text-slate-400"
                            }`}
                          >
                            <span
                              className={`w-5 h-5 rounded-full border flex items-center justify-center font-mono text-[10px] font-bold shrink-0 ${
                                isOfficial
                                  ? "bg-emerald-500 text-slate-950 border-emerald-500"
                                  : isStudent
                                  ? "bg-rose-500 text-white border-rose-500"
                                  : "border-slate-800 text-slate-500"
                              }`}
                            >
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="flex-1">{opt}</span>
                            {isOfficial && (
                              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                                (Official Answer)
                              </span>
                            )}
                            {isStudent && !isOfficial && (
                              <span className="text-[10px] font-mono text-rose-400 font-bold">
                                (Your Answer)
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Appendix D Explanation Card */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                      <span className="text-[11px] font-mono uppercase text-cyan-400 font-semibold block">
                        Appendix D Official Explanation:
                      </span>
                      <p className="text-slate-300 leading-relaxed">
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
