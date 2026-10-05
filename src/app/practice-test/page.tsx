"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
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
  Zap,
  Terminal,
  Cpu,
  Eye,
  EyeOff,
  Maximize2,
  FileSpreadsheet,
  Printer,
  HelpCircle,
  Calculator,
  Shuffle
} from "lucide-react";
import {
  AuthenticExamQuestion,
  CISCO_AUTHENTIC_SIMULATIONS,
  DragDropItem
} from "@/data/cisco-exam-simulations";

export interface UnifiedExamQuestion extends AuthenticExamQuestion {
  // Common normalized properties
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

  // Build the complete question pool across all 49 chapters + authentic Cisco simlets/DNDs
  const allQuestionsPool: UnifiedExamQuestion[] = useMemo(() => {
    const pool: UnifiedExamQuestion[] = [];

    // Add Authentic Simlets & Drag-and-Drops first
    CISCO_AUTHENTIC_SIMULATIONS.forEach((sim) => {
      pool.push(sim);
    });

    // Add all 446 chapter questions from Jeremy McDowell's books
    allModules.forEach((m) => {
      if (m.quiz && m.quiz.length > 0) {
        m.quiz.forEach((q) => {
          // Convert QuizQuestion to UnifiedExamQuestion
          pool.push({
            id: q.id,
            type: "single_choice",
            question: q.question,
            options: q.options,
            correctAnswer: ["A", "B", "C", "D", "E", "F"][q.correctAnswer] || "A",
            explanation: q.explanation,
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
  const [testMode, setTestMode] = useState<
    "AUTHENTIC_100" | "STANDARD_60" | "SIMLET_DRILL" | "DOMAIN_DRILL" | "PART_TEST" | "QUICK_DRILL"
  >("AUTHENTIC_100");
  const [isStrictCiscoMode, setIsStrictCiscoMode] = useState(true); // No back button on real Cisco exam!
  const [selectedDomain, setSelectedDomain] = useState("1.0");
  const [selectedPart, setSelectedPart] = useState<{ volume: number; part: number }>({ volume: 1, part: 1 });

  // Active test execution states
  const [testQuestions, setTestQuestions] = useState<UnifiedExamQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // User answers storage:
  // For single choice: option string e.g. "A" or "0"
  // For multi choice: array of strings e.g. ["A", "C"]
  // For drag & drop: object mapping itemId -> targetCategory e.g. { "item-1": "AD 0", ... }
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(120 * 60);
  const [timerActive, setTimerActive] = useState(false);
  const [hideTimer, setHideTimer] = useState(false); // Pearson VUE feature
  const [showNavGrid, setShowNavGrid] = useState(false);
  const [confirmSubmitModal, setConfirmSubmitModal] = useState(false);

  // Pearson VUE Aux Tools
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [whiteboardNotes, setWhiteboardNotes] = useState("");
  const [showExhibitModal, setShowExhibitModal] = useState(false);

  // Simlet CLI Interactive State
  const [activeSimletDeviceIdx, setActiveSimletDeviceIdx] = useState(0);
  const [simletCliInput, setSimletCliInput] = useState("");
  const [simletCliLogs, setSimletCliLogs] = useState<Record<string, string[]>>({});

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
  const startExam = (
    mode: "AUTHENTIC_100" | "STANDARD_60" | "SIMLET_DRILL" | "DOMAIN_DRILL" | "PART_TEST" | "QUICK_DRILL",
    strict: boolean = true
  ) => {
    sounds.playKeyClick();
    let selected: UnifiedExamQuestion[] = [];
    let initialSeconds = 120 * 60; // 120 minutes default

    if (mode === "AUTHENTIC_100") {
      // 100 Questions: Full authentic Cisco CCNA exam
      initialSeconds = 120 * 60;
      // Include all Simlets and DNDs first as performance questions
      const simletsAndDnd = allQuestionsPool.filter((q) => q.type === "simlet" || q.type === "drag_drop" || q.type === "multi_choice");
      selected.push(...simletsAndDnd);

      // Distribute remaining across 6 domains strictly by Cisco blueprint
      const remainingNeeded = 100 - selected.length;
      const targetDomainWeights: Record<string, number> = {
        "1.0": Math.round(remainingNeeded * 0.20),
        "2.0": Math.round(remainingNeeded * 0.20),
        "3.0": Math.round(remainingNeeded * 0.25),
        "4.0": Math.round(remainingNeeded * 0.10),
        "5.0": Math.round(remainingNeeded * 0.15),
        "6.0": Math.round(remainingNeeded * 0.10),
      };

      Object.entries(targetDomainWeights).forEach(([dId, count]) => {
        const domainPool = allQuestionsPool.filter((q) => q.domainId === dId && q.type === "single_choice");
        const shuffled = [...domainPool].sort(() => 0.5 - Math.random());
        selected.push(...shuffled.slice(0, count));
      });

      // Randomize overall order
      selected.sort(() => 0.5 - Math.random());
    } else if (mode === "STANDARD_60") {
      // 60 Questions: Fast-track Cisco exam (90 minutes)
      initialSeconds = 90 * 60;
      // Include 2 simlets & 2 DNDs
      const simlets = allQuestionsPool.filter((q) => q.type === "simlet").slice(0, 2);
      const dnds = allQuestionsPool.filter((q) => q.type === "drag_drop").slice(0, 2);
      selected.push(...simlets, ...dnds);

      const targetCounts: Record<string, number> = {
        "1.0": 11,
        "2.0": 11,
        "3.0": 14,
        "4.0": 6,
        "5.0": 8,
        "6.0": 6,
      };

      Object.entries(targetCounts).forEach(([dId, count]) => {
        const domainPool = allQuestionsPool.filter((q) => q.domainId === dId && q.type === "single_choice");
        const shuffled = [...domainPool].sort(() => 0.5 - Math.random());
        selected.push(...shuffled.slice(0, count));
      });
      selected.sort(() => 0.5 - Math.random());
    } else if (mode === "SIMLET_DRILL") {
      // Performance-Based Simlets, Drag-and-Drop, and Multi-Select only
      initialSeconds = 45 * 60;
      const perfPool = allQuestionsPool.filter((q) => q.type !== "single_choice");
      selected = [...perfPool].sort(() => 0.5 - Math.random());
    } else if (mode === "DOMAIN_DRILL") {
      initialSeconds = 30 * 60;
      const domainPool = allQuestionsPool.filter((q) => q.domainId === selectedDomain);
      selected = [...domainPool].sort(() => 0.5 - Math.random()).slice(0, 20);
    } else if (mode === "PART_TEST") {
      initialSeconds = 45 * 60;
      const partPool = allQuestionsPool.filter((q) => {
        const mod = allModules.find((m) => m.id === q.moduleId);
        return mod && mod.volume === selectedPart.volume && mod.partNumber === selectedPart.part;
      });
      selected = [...partPool].sort(() => 0.5 - Math.random()).slice(0, 25);
    } else {
      // QUICK_DRILL: 20 random questions
      initialSeconds = 25 * 60;
      selected = [...allQuestionsPool].sort(() => 0.5 - Math.random()).slice(0, 20);
    }

    if (selected.length === 0) {
      selected = [...allQuestionsPool].slice(0, 20);
    }

    setTestQuestions(selected);
    setTestMode(mode);
    setIsStrictCiscoMode(strict);
    setCurrentIndex(0);
    setUserAnswers({});
    setFlaggedQuestions({});
    setSecondsRemaining(initialSeconds);
    setTimeTakenSeconds(0);
    setTimerActive(true);
    setSimletCliLogs({});
    setActiveSimletDeviceIdx(0);
    setTestState("TESTING");
  };

  // Multiple Choice Single Answer selection
  const handleSelectSingleOption = (qId: string, optionIndex: number) => {
    sounds.playKeyClick();
    const letter = ["A", "B", "C", "D", "E", "F"][optionIndex];
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: letter,
    }));
  };

  // Multiple Choice Multi Answer selection
  const handleToggleMultiOption = (qId: string, optionIndex: number, maxCount: number = 2) => {
    sounds.playKeyClick();
    const letter = ["A", "B", "C", "D", "E", "F"][optionIndex];
    const current: string[] = userAnswers[qId] || [];

    if (current.includes(letter)) {
      setUserAnswers((prev) => ({
        ...prev,
        [qId]: current.filter((item) => item !== letter),
      }));
    } else {
      if (current.length < maxCount) {
        setUserAnswers((prev) => ({
          ...prev,
          [qId]: [...current, letter],
        }));
      } else {
        // Replace oldest if exceeded max
        const updated = [...current.slice(1), letter];
        setUserAnswers((prev) => ({
          ...prev,
          [qId]: updated,
        }));
      }
    }
  };

  // Drag and Drop Match Handler
  const handleAssignDnd = (qId: string, itemId: string, targetCategory: string) => {
    sounds.playKeyClick();
    setUserAnswers((prev) => {
      const currentMap = prev[qId] || {};
      return {
        ...prev,
        [qId]: {
          ...currentMap,
          [itemId]: targetCategory,
        },
      };
    });
  };

  const handleResetDnd = (qId: string) => {
    sounds.playKeyClick();
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: {},
    }));
  };

  // Simlet CLI Interactive Execution
  const handleExecuteSimletCommand = (device: any, cmdToRun?: string) => {
    sounds.playKeyClick();
    const cmd = (cmdToRun || simletCliInput).trim().toLowerCase();
    if (!cmd) return;

    const deviceKey = `${currentQ.id}-${device.hostname}`;
    const prevLogs = simletCliLogs[deviceKey] || [];

    let output = "";
    // Match against device supported outputs
    const matchedKey = Object.keys(device.outputs).find(
      (k) => k.toLowerCase() === cmd || k.toLowerCase().startsWith(cmd)
    );

    if (matchedKey) {
      output = device.outputs[matchedKey];
    } else if (cmd === "?" || cmd === "help") {
      output = `Available verification commands on ${device.hostname}:\n` + Object.keys(device.outputs).map((c) => `  ${c}`).join("\n");
    } else if (cmd === "clear") {
      setSimletCliLogs((prev) => ({ ...prev, [deviceKey]: [] }));
      setSimletCliInput("");
      return;
    } else {
      output = `% Invalid input detected at '^' marker.\nTry typing '?' for available verification commands on ${device.hostname}.`;
    }

    const newLogs = [
      ...prevLogs,
      `${device.prompt} ${cmdToRun || simletCliInput}`,
      output,
    ];

    setSimletCliLogs((prev) => ({
      ...prev,
      [deviceKey]: newLogs,
    }));
    setSimletCliInput("");
  };

  const toggleFlagQuestion = (qId: string) => {
    sounds.playKeyClick();
    setFlaggedQuestions((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  // Complete exam and score calculation
  const handleCompleteExam = () => {
    setTimerActive(false);
    setConfirmSubmitModal(false);
    sounds.playCommandSuccess();

    let totalSecs = 120 * 60;
    if (testMode === "STANDARD_60") totalSecs = 90 * 60;
    if (testMode === "SIMLET_DRILL" || testMode === "PART_TEST") totalSecs = 45 * 60;
    if (testMode === "DOMAIN_DRILL") totalSecs = 30 * 60;
    if (testMode === "QUICK_DRILL") totalSecs = 25 * 60;

    setTimeTakenSeconds(totalSecs - secondsRemaining);
    setTestState("REVIEW");

    // Calculate score
    let correctCount = 0;
    testQuestions.forEach((q) => {
      if (checkQuestionCorrect(q, userAnswers[q.id])) {
        correctCount += 1;
      }
    });

    const percent = Math.round((correctCount / testQuestions.length) * 100);
    // Official Cisco CCNA passing standard is 825/1000 (~82.5%)
    if (percent >= 82) {
      confetti({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.6 },
      });
    }

    // Sync score to Gradebook
    try {
      fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleId: `cisco-exam-${testMode.toLowerCase()}`,
          answers: userAnswers,
          userId: session?.user?.email || "guest-cadet",
          userEmail: session?.user?.email || "cadet@ccna.academy",
        }),
      });
    } catch (e) {
      console.error("Failed to sync exam score:", e);
    }
  };

  // Validation function for each question type
  const checkQuestionCorrect = (q: UnifiedExamQuestion, answer: any): boolean => {
    if (!answer) return false;

    if (q.type === "single_choice" || q.type === "simlet") {
      return String(answer).toUpperCase() === String(q.correctAnswer).toUpperCase();
    }

    if (q.type === "multi_choice") {
      if (!Array.isArray(answer) || !Array.isArray(q.correctAnswer)) return false;
      if (answer.length !== q.correctAnswer.length) return false;
      const sortedAns = [...answer].map((s) => s.toUpperCase()).sort();
      const sortedCorrect = [...q.correctAnswer].map((s) => s.toUpperCase()).sort();
      return sortedAns.every((val, idx) => val === sortedCorrect[idx]);
    }

    if (q.type === "drag_drop") {
      if (!q.dndItems || typeof answer !== "object") return false;
      return q.dndItems.every((item) => answer[item.id] === item.targetCategory);
    }

    return false;
  };

  // Comprehensive Cisco Exam Score Metrics
  const scoreMetrics = useMemo(() => {
    let totalScore = 0;
    const domainStats: Record<string, { total: number; correct: number; name: string }> = {};

    DOMAINS.forEach((d) => {
      domainStats[d.id] = { total: 0, correct: 0, name: d.name };
    });

    testQuestions.forEach((q) => {
      const isCorrect = checkQuestionCorrect(q, userAnswers[q.id]);
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
    // Cisco 200-301 Scaled Score: 300 (minimum) to 1000 (maximum). Passing standard is 825.
    const scaledScore = Math.round(300 + (percent / 100) * 700);
    const passed = scaledScore >= 825;

    return {
      totalScore,
      totalQuestions,
      percent,
      scaledScore,
      passed,
      domainStats,
    };
  }, [testQuestions, userAnswers]);

  // Formatter for Pearson VUE timer
  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h > 0 ? `${h.toString().padStart(2, "0")}:` : ""}${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const answeredCount = Object.keys(userAnswers).filter((k) => {
    const val = userAnswers[k];
    if (!val) return false;
    if (Array.isArray(val)) return val.length > 0;
    if (typeof val === "object") return Object.keys(val).length > 0;
    return true;
  }).length;

  const flaggedCount = Object.values(flaggedQuestions).filter(Boolean).length;
  const currentQ = testQuestions[currentIndex];

  // Filtered review questions
  const filteredReviewQuestions = useMemo(() => {
    if (reviewFilter === "INCORRECT") {
      return testQuestions.filter((q) => !checkQuestionCorrect(q, userAnswers[q.id]));
    }
    if (reviewFilter === "FLAGGED") {
      return testQuestions.filter((q) => flaggedQuestions[q.id]);
    }
    return testQuestions;
  }, [testQuestions, userAnswers, flaggedQuestions, reviewFilter]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* ========================================================================= */}
      {/* SCREEN 1: EXAM SELECTION & CISCO TEST CENTER PORTAL                       */}
      {/* ========================================================================= */}
      {testState === "SELECT" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
          {/* Pearson VUE Official Exam Banner */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-950/70 via-slate-900 to-cyan-950/70 border border-cyan-500/30 shadow-2xl relative overflow-hidden text-center max-w-5xl mx-auto">
            <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs mb-4">
              <ShieldCheck className="w-4 h-4" />
              <span>Official Cisco Certified Network Associate (200-301 CCNA) Simulation</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              CCNA 200-301 <span className="text-cyan-400">Exam Simulator</span> &amp; Test Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-4 max-w-3xl mx-auto leading-relaxed">
              Experience the actual Cisco certification exam environment delivered via Pearson VUE. Practice with authentic multiple-choice questions, interactive Drag-and-Drop matching, live CLI Simlets with simulated routers/switches, and official 6-domain score scaling.
            </p>

            {/* Test Center Specification Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-800/80 max-w-4xl mx-auto">
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
                <span className="text-xl sm:text-2xl font-black text-white font-mono">{allQuestionsPool.length}</span>
                <span className="text-[11px] text-slate-400 block font-mono">Question Bank</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
                <span className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">120 Mins</span>
                <span className="text-[11px] text-slate-400 block font-mono">Official Duration</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
                <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">825 / 1000</span>
                <span className="text-[11px] text-slate-400 block font-mono">Passing Standard</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
                <span className="text-xl sm:text-2xl font-black text-purple-400 font-mono">6 Domains</span>
                <span className="text-[11px] text-slate-400 block font-mono">Cisco Blueprint</span>
              </div>
            </div>

            {/* Strict Cisco Exam Engine Toggle */}
            <div className="mt-8 inline-flex items-center gap-3 p-2 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
              <span className="text-slate-300 font-medium pl-2">Exam Navigation Rule:</span>
              <button
                onClick={() => setIsStrictCiscoMode(true)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                  isStrictCiscoMode
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Strict Cisco Exam Mode (No Back Button)
              </button>
              <button
                onClick={() => setIsStrictCiscoMode(false)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                  !isStrictCiscoMode
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Study Mode (Back &amp; Palette Allowed)
              </button>
            </div>
          </div>

          {/* Test Modes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Mode 1: Full 100-Question Authentic CCNA Exam */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-cyan-500/40 shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-cyan-500/80 transition-all">
              <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono uppercase font-bold">
                Most Authentic
              </div>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-4">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Full CCNA Exam (100 Qs)</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  The definitive CCNA 200-301 simulation. 100 questions weighted strictly by the Cisco blueprint, featuring Simlets, Drag &amp; Drop, and Multi-Select questions with a 120-minute countdown.
                </p>
                <div className="flex items-center gap-3 mt-4 text-xs font-mono text-slate-300">
                  <span className="flex items-center gap-1 text-cyan-400"><Clock className="w-3.5 h-3.5" /> 120 Mins</span>
                  <span>•</span>
                  <span>100 Questions</span>
                </div>
              </div>
              <button
                onClick={() => startExam("AUTHENTIC_100", isStrictCiscoMode)}
                className="mt-6 w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:brightness-110 shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Launch Full 100-Q Exam</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mode 2: Standard 60-Question Mock */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Standard CCNA Mock (60 Qs)</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Balanced 90-minute fast-track exam covering all 6 domains and key interactive question types. Perfect for mid-week benchmark assessments.
                </p>
                <div className="flex items-center gap-3 mt-4 text-xs font-mono text-slate-300">
                  <span className="flex items-center gap-1 text-emerald-400"><Clock className="w-3.5 h-3.5" /> 90 Mins</span>
                  <span>•</span>
                  <span>60 Questions</span>
                </div>
              </div>
              <button
                onClick={() => startExam("STANDARD_60", isStrictCiscoMode)}
                className="mt-6 w-full py-3 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white transition-all flex items-center justify-center gap-2 border border-slate-700"
              >
                <span>Launch 60-Q Mock</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mode 3: Performance-Based Simlets & Drag-and-Drop Drill */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-purple-500/30 shadow-xl flex flex-col justify-between hover:border-purple-500/60 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
                  <Terminal className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Simlet &amp; DND Lab Drill</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Drill the highest-stakes interactive questions on the CCNA: live CLI router/switch terminal troubleshooting, drag-and-drop matching, and multi-selects.
                </p>
                <div className="flex items-center gap-3 mt-4 text-xs font-mono text-slate-300">
                  <span className="flex items-center gap-1 text-purple-400"><Clock className="w-3.5 h-3.5" /> 45 Mins</span>
                  <span>•</span>
                  <span>Interactive Labs</span>
                </div>
              </div>
              <button
                onClick={() => startExam("SIMLET_DRILL", false)}
                className="mt-6 w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:brightness-110 shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Launch Simlet Drill</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Drills & Domain Selector Section */}
          <div className="max-w-6xl mx-auto p-8 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-cyan-400" />
                  <span>Targeted Domain &amp; Rapid Practice</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Focus on specific Cisco examination domains or launch a quick 20-question randomized sprint.
                </p>
              </div>

              <button
                onClick={() => startExam("QUICK_DRILL", false)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>Rapid 20-Question Daily Drill</span>
              </button>
            </div>

            {/* Domain Selection Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {DOMAINS.map((domain) => (
                <div
                  key={domain.id}
                  onClick={() => {
                    setSelectedDomain(domain.id);
                    startExam("DOMAIN_DRILL", false);
                  }}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 cursor-pointer group transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-400">Domain {domain.id}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      {Math.round(domain.weight * 100)}% Weight
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1 group-hover:text-cyan-300 transition-colors">
                    {domain.name}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 2: ACTIVE PEARSON VUE CISCO EXAM ENVIRONMENT                      */}
      {/* ========================================================================= */}
      {testState === "TESTING" && currentQ && (
        <div className="flex flex-col min-h-screen bg-[#0b1120] select-none">
          {/* Pearson VUE Authentic Navy Header */}
          <header className="sticky top-0 z-40 bg-[#091124] border-b border-slate-700/80 shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
              {/* Exam & Candidate Metadata */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-xs text-white">
                    CISCO
                  </div>
                  <div>
                    <h2 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                      200-301 CCNA: Cisco Certified Network Associate
                    </h2>
                    <p className="text-[10px] font-mono text-slate-400">
                      Candidate: {session?.user?.name || "Yousuf Hossain"} • ID: CSCO-{session?.user ? "18492048" : "94827103"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pearson VUE Clock & Top Controls */}
              <div className="flex items-center gap-3">
                {/* Live Countdown Timer */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700">
                  <Clock className={`w-3.5 h-3.5 ${secondsRemaining < 300 ? "text-red-400 animate-pulse" : "text-cyan-400"}`} />
                  <span className="text-xs font-mono font-bold text-white">
                    {hideTimer ? "Time Hidden" : formatTime(secondsRemaining)}
                  </span>
                  <button
                    onClick={() => setHideTimer(!hideTimer)}
                    className="text-[10px] font-mono text-slate-400 hover:text-white ml-1 border-l border-slate-700 pl-1.5"
                    title="Pearson VUE Hide/Show Time"
                  >
                    {hideTimer ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  </button>
                </div>

                {/* Exhibit Button (active if exhibit exists) */}
                {(currentQ.exhibitContent || currentQ.type === "simlet") && (
                  <button
                    onClick={() => setShowExhibitModal(true)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-semibold transition-all"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-400" />
                    <span>Exhibit</span>
                  </button>
                )}

                {/* Digital Whiteboard / Scratchpad */}
                <button
                  onClick={() => setShowWhiteboard(true)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold transition-all"
                  title="Digital Whiteboard / Scratchpad for subnet calculations"
                >
                  <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Whiteboard</span>
                </button>

                {/* Question Palette Toggle (Disabled in strict Cisco mode) */}
                {!isStrictCiscoMode && (
                  <button
                    onClick={() => setShowNavGrid(!showNavGrid)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold transition-all"
                  >
                    <Layers className="w-3.5 h-3.5 text-purple-400" />
                    <span className="hidden sm:inline">Palette</span>
                  </button>
                )}

                {/* Flag for Review */}
                <button
                  onClick={() => toggleFlagQuestion(currentQ.id)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                    flaggedQuestions[currentQ.id]
                      ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                      : "bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-400"
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Flag</span>
                </button>
              </div>
            </div>

            {/* Question Progress Banner */}
            <div className="bg-[#0e172e] border-t border-slate-800 px-4 py-1.5 text-[11px] font-mono flex items-center justify-between text-slate-300">
              <div className="flex items-center gap-3">
                <span className="font-bold text-white">
                  Question {currentIndex + 1} of {testQuestions.length}
                </span>
                <span>•</span>
                <span className="text-cyan-400">Domain {currentQ.domainId}: {currentQ.domainName}</span>
                {isStrictCiscoMode && (
                  <>
                    <span>•</span>
                    <span className="text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Strict Exam Mode (Linear Progression)
                    </span>
                  </>
                )}
              </div>

              <div>
                <span>Answered: {answeredCount} / {testQuestions.length}</span>
              </div>
            </div>
          </header>

          {/* Main Question Display Area */}
          <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 space-y-6">
            {/* Question Stem Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              {/* Question Type Badge */}
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  {currentQ.type === "simlet" && "Performance-Based Simlet (CLI Console)"}
                  {currentQ.type === "drag_drop" && "Interactive Drag-and-Drop Matching"}
                  {currentQ.type === "multi_choice" && `Multiple Choice (Select ${currentQ.selectCount || 2})`}
                  {currentQ.type === "single_choice" && "Multiple Choice (Single Answer)"}
                </span>

                {currentQ.moduleTitle && (
                  <span className="text-xs font-mono text-slate-400">
                    Source: Ch {currentQ.chapterNumber} • {currentQ.moduleTitle}
                  </span>
                )}
              </div>

              {/* Question Text */}
              <h3 className="text-base sm:text-lg font-semibold text-white leading-relaxed">
                {currentQ.question}
              </h3>
            </div>

            {/* ============================================================= */}
            {/* QUESTION TYPE 1: PERFORMANCE-BASED SIMLET (LIVE CLI CONSOLE)  */}
            {/* ============================================================= */}
            {currentQ.type === "simlet" && currentQ.simletDevices && (
              <div className="space-y-4">
                {/* Console Tabs for Devices (e.g. R1, R2, SW1) */}
                <div className="flex items-center justify-between bg-slate-900 p-2 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-400 ml-2" />
                    <span className="text-xs font-mono text-slate-300">Device Consoles:</span>
                    {currentQ.simletDevices.map((dev, idx) => (
                      <button
                        key={dev.hostname}
                        onClick={() => setActiveSimletDeviceIdx(idx)}
                        className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                          activeSimletDeviceIdx === idx
                            ? "bg-cyan-500 text-slate-950 shadow-md"
                            : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                        }`}
                      >
                        {dev.hostname}#
                      </button>
                    ))}
                  </div>

                  <span className="text-[11px] font-mono text-slate-400 mr-2">
                    Type commands or click quick shortcuts below
                  </span>
                </div>

                {/* Embedded Interactive CLI Console */}
                {(() => {
                  const currentDev = currentQ.simletDevices[activeSimletDeviceIdx];
                  const logKey = `${currentQ.id}-${currentDev.hostname}`;
                  const logs = simletCliLogs[logKey] || [];

                  return (
                    <div className="rounded-2xl border border-slate-800 bg-[#050811] overflow-hidden shadow-2xl font-mono">
                      {/* Terminal Chrome */}
                      <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Console Session: {currentDev.hostname} (IOS Software, 15.X)</span>
                        </span>
                        <span>Type &apos;?&apos; or &apos;help&apos; for list</span>
                      </div>

                      {/* Log Output Display */}
                      <div className="p-4 max-h-72 overflow-y-auto space-y-2 text-xs text-cyan-300 font-mono">
                        <div className="text-slate-500">
                          {currentDev.hostname} Line 0 is active. Type standard Cisco IOS show commands to diagnose.
                        </div>
                        {logs.map((line, lIdx) => (
                          <div key={lIdx} className="whitespace-pre-wrap leading-relaxed">
                            {line}
                          </div>
                        ))}
                      </div>

                      {/* Interactive Command Input Line */}
                      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
                        <span className="text-xs text-emerald-400 font-bold">{currentDev.prompt}</span>
                        <input
                          type="text"
                          value={simletCliInput}
                          onChange={(e) => setSimletCliInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleExecuteSimletCommand(currentDev);
                            }
                          }}
                          placeholder="e.g. show ip ospf neighbor, show ip int brief..."
                          className="flex-1 bg-transparent text-xs text-white focus:outline-none placeholder-slate-600"
                        />
                        <button
                          onClick={() => handleExecuteSimletCommand(currentDev)}
                          className="px-3 py-1 rounded-lg text-xs font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                        >
                          Enter
                        </button>
                      </div>

                      {/* Quick Command Shortcuts Bar */}
                      <div className="px-3 py-2 bg-slate-900/50 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span className="text-slate-400 text-[10px] mr-1">Shortcuts:</span>
                        {Object.keys(currentDev.outputs).map((cmd) => (
                          <button
                            key={cmd}
                            onClick={() => handleExecuteSimletCommand(currentDev, cmd)}
                            className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-cyan-300 transition-colors"
                          >
                            {cmd}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Multiple Choice Options for Simlet Diagnosis */}
                {currentQ.options && (
                  <div className="space-y-2.5 pt-2">
                    <span className="text-xs font-mono text-slate-400">Select the correct diagnosis:</span>
                    {currentQ.options.map((opt, oIdx) => {
                      const letter = ["A", "B", "C", "D", "E", "F"][oIdx];
                      const isSelected = userAnswers[currentQ.id] === letter;

                      return (
                        <div
                          key={oIdx}
                          onClick={() => handleSelectSingleOption(currentQ.id, oIdx)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                            isSelected
                              ? "bg-cyan-500/10 border-cyan-500 text-white shadow-md shadow-cyan-500/10"
                              : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-lg font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                              isSelected ? "bg-cyan-500 text-slate-950" : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {letter}
                          </div>
                          <span className="text-xs sm:text-sm leading-relaxed">{opt}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ============================================================= */}
            {/* QUESTION TYPE 2: INTERACTIVE DRAG AND DROP MATCHING           */}
            {/* ============================================================= */}
            {currentQ.type === "drag_drop" && currentQ.dndCategories && currentQ.dndItems && (
              <div className="space-y-6">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Click an item on the left, then click its destination category on the right.</span>
                  <button
                    onClick={() => handleResetDnd(currentQ.id)}
                    className="flex items-center gap-1 text-red-400 hover:underline"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset Matchings
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Source Pool of Items */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                      Items to Assign:
                    </h4>
                    {currentQ.dndItems.map((item) => {
                      const assignedTarget = (userAnswers[currentQ.id] || {})[item.id];

                      return (
                        <div
                          key={item.id}
                          className={`p-3.5 rounded-xl border text-xs font-mono transition-all flex items-center justify-between ${
                            assignedTarget
                              ? "bg-slate-950/60 border-slate-800 text-slate-500"
                              : "bg-slate-900 border-cyan-500/30 text-white shadow-sm"
                          }`}
                        >
                          <span>{item.sourceText}</span>
                          {assignedTarget && (
                            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px]">
                              → {assignedTarget}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Target Categories Dropzones */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                      Target Categories:
                    </h4>
                    {currentQ.dndCategories.map((cat) => {
                      // Find items currently assigned to this category
                      const assignedItems = currentQ.dndItems?.filter(
                        (it) => (userAnswers[currentQ.id] || {})[it.id] === cat
                      );

                      return (
                        <div
                          key={cat}
                          className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/90 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white font-mono">{cat}</span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {assignedItems?.length || 0} assigned
                            </span>
                          </div>

                          {/* Render Assigned Item Chips */}
                          <div className="min-h-[38px] p-2 rounded-lg bg-slate-900 border border-dashed border-slate-800 flex flex-wrap gap-1.5 items-center">
                            {assignedItems && assignedItems.length > 0 ? (
                              assignedItems.map((it) => (
                                <span
                                  key={it.id}
                                  onClick={() => handleAssignDnd(currentQ.id, it.id, "")}
                                  className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 cursor-pointer hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/40 transition-colors"
                                  title="Click to unassign"
                                >
                                  {it.sourceText} ✕
                                </span>
                              ))
                            ) : (
                              <div className="w-full flex items-center justify-between text-[11px] text-slate-600 font-mono">
                                <span>Assign items:</span>
                                <div className="flex flex-wrap gap-1">
                                  {currentQ.dndItems?.filter((it) => !(userAnswers[currentQ.id] || {})[it.id]).map((it) => (
                                    <button
                                      key={it.id}
                                      onClick={() => handleAssignDnd(currentQ.id, it.id, cat)}
                                      className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 hover:bg-cyan-500 hover:text-slate-950"
                                    >
                                      + {it.sourceText.slice(0, 16)}...
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* QUESTION TYPE 3: MULTI-CHOICE ("CHOOSE TWO / THREE")          */}
            {/* ============================================================= */}
            {currentQ.type === "multi_choice" && currentQ.options && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="text-amber-400 font-bold">
                    Select exactly {currentQ.selectCount || 2} options:
                  </span>
                  <span>
                    Selected: {(userAnswers[currentQ.id] || []).length} / {currentQ.selectCount || 2}
                  </span>
                </div>

                {currentQ.options.map((opt, oIdx) => {
                  const letter = ["A", "B", "C", "D", "E", "F"][oIdx];
                  const currentSelected: string[] = userAnswers[currentQ.id] || [];
                  const isSelected = currentSelected.includes(letter);

                  return (
                    <div
                      key={oIdx}
                      onClick={() => handleToggleMultiOption(currentQ.id, oIdx, currentQ.selectCount || 2)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                        isSelected
                          ? "bg-cyan-500/10 border-cyan-500 text-white shadow-md shadow-cyan-500/10"
                          : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-md font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected ? "bg-cyan-500 text-slate-950" : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {isSelected ? "✓" : letter}
                      </div>
                      <span className="text-xs sm:text-sm leading-relaxed">{opt}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ============================================================= */}
            {/* QUESTION TYPE 4: STANDARD SINGLE CHOICE (RADIO BUTTONS)       */}
            {/* ============================================================= */}
            {currentQ.type === "single_choice" && currentQ.options && (
              <div className="space-y-3">
                {currentQ.options.map((opt, oIdx) => {
                  const letter = ["A", "B", "C", "D", "E", "F"][oIdx];
                  const isSelected = userAnswers[currentQ.id] === letter;

                  return (
                    <div
                      key={oIdx}
                      onClick={() => handleSelectSingleOption(currentQ.id, oIdx)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                        isSelected
                          ? "bg-cyan-500/10 border-cyan-500 text-white shadow-md shadow-cyan-500/10"
                          : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected ? "bg-cyan-500 text-slate-950" : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {letter}
                      </div>
                      <span className="text-xs sm:text-sm leading-relaxed">{opt}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </main>

          {/* Pearson VUE Authentic Bottom Action Bar */}
          <footer className="sticky bottom-0 z-40 bg-[#091124] border-t border-slate-700/80 px-4 py-3">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
              {/* Previous Button (Only in Study Mode, Disabled in Strict Cisco Mode) */}
              <div>
                {!isStrictCiscoMode ? (
                  <button
                    disabled={currentIndex === 0}
                    onClick={() => {
                      sounds.playKeyClick();
                      setCurrentIndex((prev) => Math.max(0, prev - 1));
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-700"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                ) : (
                  <span className="text-[11px] font-mono text-slate-500 italic hidden sm:inline">
                    Cisco Policy: Linear testing engine (No Previous)
                  </span>
                )}
              </div>

              {/* End Exam or Next Button */}
              <div className="flex items-center gap-3">
                {currentIndex < testQuestions.length - 1 ? (
                  <button
                    onClick={() => {
                      sounds.playKeyClick();
                      setCurrentIndex((prev) => prev + 1);
                    }}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:brightness-110 text-white shadow-md shadow-blue-500/20 transition-all"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setConfirmSubmitModal(true)}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-slate-950 shadow-md shadow-emerald-500/20 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit &amp; Finish Exam</span>
                  </button>
                )}
              </div>
            </div>
          </footer>

          {/* ============================================================= */}
          {/* MODAL 1: QUESTION PALETTE GRID (TRAINING MODE ONLY)           */}
          {/* ============================================================= */}
          {showNavGrid && !isStrictCiscoMode && (
            <div
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
              onClick={() => setShowNavGrid(false)}
            >
              <div
                className="max-w-2xl w-full bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-cyan-400" />
                    <span>Exam Question Palette Navigator</span>
                  </h3>
                  <button
                    onClick={() => setShowNavGrid(false)}
                    className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900"
                  >
                    Close [Esc]
                  </button>
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 max-h-72 overflow-y-auto p-1">
                  {testQuestions.map((q, idx) => {
                    const isAnswered = Boolean(userAnswers[q.id]);
                    const isFlagged = flaggedQuestions[q.id];
                    const isCurrent = idx === currentIndex;

                    let bg = "bg-slate-900 border-slate-800 text-slate-400";
                    if (isAnswered) bg = "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold";
                    if (isFlagged) bg = "bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold";
                    if (isCurrent) bg = "bg-cyan-500 text-slate-950 font-black border-cyan-400";

                    return (
                      <button
                        key={q.id}
                        onClick={() => {
                          sounds.playKeyClick();
                          setCurrentIndex(idx);
                          setShowNavGrid(false);
                        }}
                        className={`w-full aspect-square rounded-xl text-xs font-mono border flex items-center justify-center transition-transform hover:scale-105 ${bg}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* MODAL 2: PEARSON VUE DIGITAL WHITEBOARD / SCRATCHPAD          */}
          {/* ============================================================= */}
          {showWhiteboard && (
            <div
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
              onClick={() => setShowWhiteboard(false)}
            >
              <div
                className="max-w-3xl w-full bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">Pearson VUE Digital Whiteboard &amp; Scratchpad</h3>
                  </div>
                  <button
                    onClick={() => setShowWhiteboard(false)}
                    className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900"
                  >
                    Done [Esc]
                  </button>
                </div>

                <div className="text-[11px] font-mono text-slate-400">
                  Quick CIDR &amp; Block Size Reference:
                  <span className="text-cyan-400 ml-2">/24 = 256 (.0) | /25 = 128 (.128) | /26 = 64 (.192) | /27 = 32 (.224) | /28 = 16 (.240) | /29 = 8 (.248) | /30 = 4 (.252)</span>
                </div>

                <textarea
                  value={whiteboardNotes}
                  onChange={(e) => setWhiteboardNotes(e.target.value)}
                  placeholder="Use this digital scratchpad for binary subnet calculations, routing table matching, or OSPF timer scratchwork..."
                  rows={10}
                  className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs text-cyan-200 focus:outline-none focus:border-cyan-500 resize-none leading-relaxed"
                />

                <div className="flex justify-between items-center text-xs font-mono text-slate-500">
                  <span>Whiteboard contents are stored during your active exam session.</span>
                  <button
                    onClick={() => setWhiteboardNotes("")}
                    className="text-red-400 hover:underline"
                  >
                    Clear Notes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* MODAL 3: EXHIBIT / TOPOLOGY VIEWER                            */}
          {/* ============================================================= */}
          {showExhibitModal && (
            <div
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
              onClick={() => setShowExhibitModal(false)}
            >
              <div
                className="max-w-3xl w-full bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <h3 className="text-sm font-bold text-white">
                      {currentQ.exhibitTitle || "Exam Exhibit: Network Topology"}
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowExhibitModal(false)}
                    className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900"
                  >
                    Close Exhibit
                  </button>
                </div>

                {currentQ.exhibitContent && (
                  <pre className="p-4 rounded-2xl bg-[#050811] border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
                    {currentQ.exhibitContent}
                  </pre>
                )}

                {currentQ.simletScenario && (
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                    <span className="font-bold text-cyan-400">Topology Scenario: </span>
                    {currentQ.simletScenario}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* MODAL 4: CONFIRM SUBMISSION MODAL                             */}
          {/* ============================================================= */}
          {confirmSubmitModal && (
            <div
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setConfirmSubmitModal(false)}
            >
              <div
                className="max-w-md w-full bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-6 h-6" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">Ready to Finish Your Cisco Exam?</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    You have answered <span className="text-white font-bold">{answeredCount}</span> of{" "}
                    <span className="text-white font-bold">{testQuestions.length}</span> questions.
                    {answeredCount < testQuestions.length && (
                      <span className="block text-amber-400 mt-2 font-mono">
                        Warning: You have {testQuestions.length - answeredCount} unanswered questions!
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmSubmitModal(false)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
                  >
                    Return to Exam
                  </button>
                  <button
                    onClick={handleCompleteExam}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:brightness-110 shadow-md"
                  >
                    Confirm &amp; Grade
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 3: OFFICIAL CISCO CANDIDATE SCORE REPORT & POST-EXAM ANALYSIS       */}
      {/* ========================================================================= */}
      {testState === "REVIEW" && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
          {/* Printable Official Cisco Candidate Examination Score Report */}
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-8 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Cisco Official Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-lg">
                  CISCO
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white">
                    Cisco Systems Candidate Score Report
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">
                    Pearson VUE Authorized Testing Delivery Center
                  </p>
                </div>
              </div>

              {/* Print Button */}
              <button
                onClick={() => window.print()}
                className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white"
              >
                <Printer className="w-3.5 h-3.5 text-cyan-400" />
                <span>Print Score Report</span>
              </button>
            </div>

            {/* Candidate & Test Metadata Table */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block">Candidate Name:</span>
                <span className="text-white font-bold">{session?.user?.name || "Yousuf Hossain"}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block">Cisco ID:</span>
                <span className="text-cyan-400 font-bold">CSCO-{session?.user ? "18492048" : "94827103"}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block">Exam Code:</span>
                <span className="text-white font-bold">200-301 CCNA</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block">Date Completed:</span>
                <span className="text-white">{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            {/* Pass / Fail Official Stamp Card */}
            <div className={`p-8 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-6 ${
              scoreMetrics.passed
                ? "bg-emerald-950/20 border-emerald-500/50"
                : "bg-rose-950/20 border-rose-500/50"
            }`}>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className={`text-4xl font-black font-mono px-4 py-1.5 rounded-2xl border ${
                    scoreMetrics.passed
                      ? "bg-emerald-500 text-slate-950 border-emerald-400"
                      : "bg-rose-500 text-white border-rose-400"
                  }`}>
                    {scoreMetrics.passed ? "PASS" : "FAIL"}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {scoreMetrics.passed ? "Congratulations! You Passed the CCNA 200-301." : "Exam Not Passed. Review Prescribed Areas."}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      Passing Score: 825 / 1000 • Candidate Score: {scoreMetrics.scaledScore} / 1000
                    </p>
                  </div>
                </div>
              </div>

              {/* Scaled Score Circle */}
              <div className="flex items-baseline gap-2 shrink-0">
                <span className="text-4xl sm:text-5xl font-black font-mono text-white">
                  {scoreMetrics.scaledScore}
                </span>
                <span className="text-xs font-mono text-slate-500">/ 1000 pts</span>
              </div>
            </div>

            {/* Performance by Examination Domain */}
            <div className="space-y-4 pt-4">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Section Analysis: Performance by Cisco Blueprint Domain
              </h3>

              <div className="space-y-3">
                {DOMAINS.map((domain) => {
                  const stat = scoreMetrics.domainStats[domain.id] || { total: 0, correct: 0, name: domain.name };
                  const pct = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
                  
                  let rating = "Needs Study";
                  let ratingColor = "text-rose-400 bg-rose-500/10 border-rose-500/20";
                  if (pct >= 85) {
                    rating = "Mastery";
                    ratingColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
                  } else if (pct >= 70) {
                    rating = "Competent";
                    ratingColor = "text-amber-400 bg-amber-500/10 border-amber-500/20";
                  }

                  return (
                    <div key={domain.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-cyan-400">{domain.id}</span>
                          <span className="font-semibold text-white">{domain.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${ratingColor}`}>
                            {rating}
                          </span>
                          <span className="font-mono text-white font-bold">{pct}% ({stat.correct}/{stat.total})</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${domain.color} transition-all duration-500`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-800">
              <button
                onClick={() => setTestState("SELECT")}
                className="flex-1 py-3 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Take Another Practice Exam</span>
              </button>
              <Link
                href="/dashboard"
                className="flex-1 py-3 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white transition-all text-center"
              >
                Return to Student Dashboard
              </Link>
            </div>
          </div>

          {/* ============================================================= */}
          {/* DETAILED QUESTION REVIEW WITH APPENDIX D RATIONALES           */}
          {/* ============================================================= */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-cyan-400" />
                  <span>Itemized Question Review &amp; Textbook Explanations</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Cross-referenced with Jeremy McDowell&apos;s Appendix D detailed answer keys and explanations.
                </p>
              </div>

              {/* Review Filter Tabs */}
              <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
                <button
                  onClick={() => setReviewFilter("ALL")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    reviewFilter === "ALL" ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-white"
                  }`}
                >
                  All ({testQuestions.length})
                </button>
                <button
                  onClick={() => setReviewFilter("INCORRECT")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    reviewFilter === "INCORRECT" ? "bg-rose-500 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Incorrect ({testQuestions.length - scoreMetrics.totalScore})
                </button>
                <button
                  onClick={() => setReviewFilter("FLAGGED")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    reviewFilter === "FLAGGED" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Flagged ({flaggedCount})
                </button>
              </div>
            </div>

            {/* Question Review Cards */}
            <div className="space-y-4">
              {filteredReviewQuestions.map((q, idx) => {
                const userAns = userAnswers[q.id];
                const isCorrect = checkQuestionCorrect(q, userAns);

                return (
                  <div
                    key={q.id}
                    className={`p-6 rounded-2xl bg-slate-900/80 border space-y-4 ${
                      isCorrect ? "border-emerald-500/30" : "border-rose-500/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-lg text-xs font-bold font-mono flex items-center justify-center ${
                          isCorrect ? "bg-emerald-500 text-slate-950" : "bg-rose-500 text-white"
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="text-xs font-mono text-cyan-400">
                          Domain {q.domainId}: {q.domainName}
                        </span>
                      </div>

                      {q.moduleId && (
                        <Link
                          href={`/modules/${q.moduleId}`}
                          className="text-[11px] font-mono text-slate-400 hover:text-cyan-400 flex items-center gap-1"
                        >
                          <span>Review Ch {q.chapterNumber}</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>

                    {/* Question Text */}
                    <h4 className="text-sm font-semibold text-white leading-relaxed">
                      {q.question}
                    </h4>

                    {/* Options / Answer Summary */}
                    {q.options && (
                      <div className="space-y-1.5 text-xs">
                        {q.options.map((opt, oIdx) => {
                          const letter = ["A", "B", "C", "D", "E", "F"][oIdx];
                          const isCorrectOption = Array.isArray(q.correctAnswer)
                            ? q.correctAnswer.includes(letter)
                            : q.correctAnswer === letter;
                          const isUserSelected = Array.isArray(userAns)
                            ? userAns.includes(letter)
                            : userAns === letter;

                          let optStyle = "bg-slate-950/60 border-slate-800 text-slate-400";
                          if (isCorrectOption) optStyle = "bg-emerald-950/30 border-emerald-500/60 text-emerald-300 font-semibold";
                          if (isUserSelected && !isCorrectOption) optStyle = "bg-rose-950/30 border-rose-500/60 text-rose-300";

                          return (
                            <div key={oIdx} className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${optStyle}`}>
                              <span className="font-mono font-bold">{letter}.</span>
                              <span>{opt}</span>
                              {isCorrectOption && <span className="text-[10px] ml-auto font-mono text-emerald-400">✓ Correct Answer</span>}
                              {isUserSelected && !isCorrectOption && <span className="text-[10px] ml-auto font-mono text-rose-400">Your Selection</span>}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Official Appendix D Explanation */}
                    {q.explanation && (
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                        <div className="flex items-center gap-1.5 text-cyan-400 font-mono font-bold text-[11px]">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Jeremy McDowell&apos;s Textbook Explanation (Appendix D):</span>
                        </div>
                        <p className="leading-relaxed text-slate-300">{q.explanation}</p>
                      </div>
                    )}
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
