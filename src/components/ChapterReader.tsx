"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  BookOpen,
  Terminal,
  Copy,
  Check,
  Maximize2,
  X,
  ZoomIn,
  ZoomOut,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  List,
  Compass,
  ArrowUp,
  Zap,
  Columns,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Laptop,
  HelpCircle,
  Network,
  ArrowRight,
  Sliders,
  Cpu
} from "lucide-react";
import { CiscoTerminal } from "@/components/CiscoTerminal";
import { CiscoCommand, QuizQuestion } from "@/lib/curriculum";
import { sounds } from "@/lib/sound-effects";
import confetti from "canvas-confetti";

interface TocItem {
  title: string;
  anchor: string;
  level: number;
}

interface ChapterReaderProps {
  title: string;
  chapterNumber: number;
  volume: number;
  fullText: string;
  tableOfContents: TocItem[];
  keyPoints: string[];
  ciscoCommands?: CiscoCommand[];
  quizQuestions?: QuizQuestion[];
  moduleId?: string;
}

export function ChapterReader({
  title,
  chapterNumber,
  volume,
  fullText,
  tableOfContents,
  keyPoints,
  ciscoCommands = [],
  quizQuestions = [],
  moduleId = "",
}: ChapterReaderProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeAnchor, setActiveAnchor] = useState<string>("");
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg">("base");

  // Live Simulation Experience States
  const [readerMode, setReaderMode] = useState<"flow" | "workbench" | "stepper">("flow");
  const [stepperIndex, setStepperIndex] = useState(0);
  const [showTerminalDrawer, setShowTerminalDrawer] = useState(false);
  const [injectedCommand, setInjectedCommand] = useState<string>("");

  // In-Text Micro Simulation 1: Switch Learning & Forwarding Simulator State
  const [switchSimStep, setSwitchSimStep] = useState<number>(0);
  const [camTable, setCamTable] = useState<Array<{ vlan: number; mac: string; type: string; port: string }>>([]);
  const [simPacketStatus, setSimPacketStatus] = useState<string>("Ready: Switch CAM table initialized (empty).");

  // In-Text Micro Simulation 2: Subnetting Magic Number Calculator State
  const [subnetPrefix, setSubnetPrefix] = useState<number>(26);

  // In-Text Micro Simulation 3: Interactive Knowledge Checkpoint State
  const [checkpointAnswer, setCheckpointAnswer] = useState<number | null>(null);
  const [checkpointSubmitted, setCheckpointSubmitted] = useState<boolean>(false);

  // Split chapter text into sections for Stepper Mode
  const sections = useMemo(() => {
    if (!fullText) return [];
    // Split text by H2 headings: lines starting with '## '
    const rawSections = fullText.split(/\n(?=##\s+)/);
    return rawSections.map((sec, idx) => {
      const match = sec.match(/^##\s+(.*)/);
      const heading = match ? match[1].trim() : idx === 0 ? "Introduction & Overview" : `Section ${idx + 1}`;
      return {
        id: idx,
        title: heading,
        content: sec,
      };
    });
  }, [fullText]);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(Math.round(progress));
      }

      // Check which heading is active
      const headings = document.querySelectorAll("h2[id], h3[id]");
      let currentActive = "";
      headings.forEach((h) => {
        const rect = h.getBoundingClientRect();
        if (rect.top <= 140) {
          currentActive = h.id;
        }
      });
      if (currentActive) setActiveAnchor(currentActive);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedText(code);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const scrollToAnchor = (anchor: string) => {
    const el = document.getElementById(anchor);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Run a command in the live Cisco Terminal
  const handleRunInTerminal = (cmd: string) => {
    sounds.playKeyClick();
    // Clean command string from prompt prefixes like Switch# or Router>
    const cleanCmd = cmd.replace(/^([A-Za-z0-9_-]+[#>])\s*/, "").trim();
    setInjectedCommand(cleanCmd);
    if (readerMode !== "workbench") {
      setShowTerminalDrawer(true);
    }
  };

  // Switch Learning Simulator Actions
  const handleSwitchSimAction = (step: number) => {
    sounds.playKeyClick();
    if (step === 1) {
      // Step 1: PC-1 sends frame to PC-2 (Unknown Unicast)
      setSwitchSimStep(1);
      setCamTable([{ vlan: 1, mac: "0014.a82b.4711", type: "DYNAMIC", port: "Fa0/1" }]);
      setSimPacketStatus("Frame arrives on Fa0/1. Switch learns Source MAC 0014.a82b.4711 into CAM Table. Destination MAC (PC-2) is unknown: Switch FLOODS frame out Fa0/2, Fa0/3, Fa0/4!");
    } else if (step === 2) {
      // Step 2: PC-2 replies to PC-1 (Known Unicast)
      setSwitchSimStep(2);
      setCamTable([
        { vlan: 1, mac: "0014.a82b.4711", type: "DYNAMIC", port: "Fa0/1" },
        { vlan: 1, mac: "0014.a82b.4712", type: "DYNAMIC", port: "Fa0/2" },
      ]);
      setSimPacketStatus("Reply arrives on Fa0/2. Switch learns Source MAC 0014.a82b.4712. Destination MAC (PC-1) is in CAM table: Switch FORWARDS UNICAST directly out Fa0/1 without flooding!");
      sounds.playCommandSuccess();
    } else if (step === 3) {
      // Step 3: PC-3 sends to PC-1
      setSwitchSimStep(3);
      setCamTable([
        { vlan: 1, mac: "0014.a82b.4711", type: "DYNAMIC", port: "Fa0/1" },
        { vlan: 1, mac: "0014.a82b.4712", type: "DYNAMIC", port: "Fa0/2" },
        { vlan: 1, mac: "0014.a82b.4713", type: "DYNAMIC", port: "Fa0/3" },
      ]);
      setSimPacketStatus("Frame from PC-3 arrives on Fa0/3. Switch learns PC-3 MAC. Destination PC-1 is known on Fa0/1: Switch forwards unicast directly to Fa0/1!");
      sounds.playCommandSuccess();
    } else {
      // Reset
      setSwitchSimStep(0);
      setCamTable([]);
      setSimPacketStatus("Ready: Switch CAM table initialized (empty).");
    }
  };

  // Subnetting calculations
  const subnetCalculations = useMemo(() => {
    const hostBits = 32 - subnetPrefix;
    const totalHosts = Math.pow(2, hostBits);
    const usableHosts = Math.max(0, totalHosts - 2);
    const magicNumber = totalHosts <= 256 ? totalHosts : 256;
    
    // Calculate 4th octet mask
    let maskOctet = 0;
    const borrowedIn4th = subnetPrefix - 24;
    for (let i = 0; i < borrowedIn4th; i++) {
      maskOctet += Math.pow(2, 7 - i);
    }
    const subnetMask = `255.255.255.${maskOctet}`;

    return {
      hostBits,
      totalHosts,
      usableHosts,
      magicNumber,
      subnetMask,
    };
  }, [subnetPrefix]);

  const fontSizeClasses = {
    sm: "text-xs sm:text-sm leading-relaxed",
    base: "text-sm sm:text-base leading-relaxed",
    lg: "text-base sm:text-lg leading-loose",
  };

  // Active quiz question for the in-text micro checkpoint
  const activeCheckpointQuestion = useMemo(() => {
    if (quizQuestions && quizQuestions.length > 0) {
      return quizQuestions[0];
    }
    return null;
  }, [quizQuestions]);

  const currentSection = sections[stepperIndex] || { title: title, content: fullText };

  return (
    <div className="relative">
      {/* ========================================================================= */}
      {/* 1. STICKY SIMULATION WORKBENCH HUD HEADER                                 */}
      {/* ========================================================================= */}
      <div className="sticky top-16 z-30 bg-[#070c18]/95 border-b border-cyan-500/30 backdrop-blur-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300 font-bold">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Chapter {chapterNumber} Codex</span>
          </div>

          <span className="text-slate-600 hidden sm:inline">•</span>

          {/* Reading progress indicator */}
          <span className="text-xs font-mono text-slate-300 hidden sm:inline">
            {readerMode === "stepper" ? (
              <span className="text-cyan-400 font-bold">
                Objective {stepperIndex + 1} of {sections.length}
              </span>
            ) : (
              <span>{scrollProgress}% completed</span>
            )}
          </span>
        </div>

        {/* INTERACTIVE WORKBENCH MODE SWITCHER */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
          <button
            onClick={() => {
              setReaderMode("flow");
              sounds.playKeyClick();
            }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              readerMode === "flow"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
            title="Continuous Technical Codex reading view"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Full Codex</span>
          </button>

          <button
            onClick={() => {
              setReaderMode("workbench");
              sounds.playKeyClick();
            }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              readerMode === "workbench"
                ? "bg-violet-500/20 text-violet-300 border border-violet-500/40 shadow-sm"
                : "text-violet-400 hover:text-white"
            }`}
            title="Split screen: Left Text, Right Live Cisco IOS Terminal"
          >
            <Columns className="w-3.5 h-3.5 text-violet-400" />
            <span className="hidden sm:inline">Split Workbench</span>
          </button>

          <button
            onClick={() => {
              setReaderMode("stepper");
              sounds.playKeyClick();
            }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              readerMode === "stepper"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                : "text-emerald-400 hover:text-white"
            }`}
            title="Chunked Mission Stepper (Section by section with micro-simulations)"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Mission Stepper</span>
          </button>
        </div>

        {/* Right Tools: Font Size & Live CLI Launcher */}
        <div className="flex items-center gap-2">
          {/* Quick Terminal Trigger */}
          <button
            onClick={() => {
              setShowTerminalDrawer(!showTerminalDrawer);
              sounds.playKeyClick();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold transition-all shadow-sm"
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Console</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          {/* Font Size Adjuster */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl px-2 py-1">
            <button
              onClick={() => setFontSize("sm")}
              className={`px-1.5 py-0.5 rounded text-xs font-mono transition-colors ${
                fontSize === "sm" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              A-
            </button>
            <button
              onClick={() => setFontSize("base")}
              className={`px-1.5 py-0.5 rounded text-xs font-mono transition-colors ${
                fontSize === "base" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              A
            </button>
            <button
              onClick={() => setFontSize("lg")}
              className={`px-1.5 py-0.5 rounded text-xs font-mono transition-colors ${
                fontSize === "lg" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              A+
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar Line */}
      <div className="sticky top-[105px] z-30 w-full bg-slate-900 h-1">
        <div
          className="bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 h-1 transition-all duration-150 shadow-sm shadow-cyan-500/50"
          style={{ width: `${readerMode === "stepper" ? ((stepperIndex + 1) / sections.length) * 100 : scrollProgress}%` }}
        />
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN READING & SIMULATION WORKBENCH CONTAINER                          */}
      {/* ========================================================================= */}
      <div className={`pt-6 ${readerMode === "workbench" ? "grid grid-cols-1 lg:grid-cols-12 gap-6" : "grid grid-cols-1 lg:grid-cols-4 gap-8"}`}>
        {/* Left Sticky Table of Contents (Hidden in workbench mode to conserve space) */}
        {readerMode !== "workbench" && (
          <div className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-32 space-y-6">
              <div className="p-4 rounded-2xl bg-[#090e1c] border border-slate-800/80 backdrop-blur-md max-h-[calc(100vh-160px)] overflow-y-auto scrollbar-none shadow-xl">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold mb-3 tracking-wider uppercase">
                  <List className="w-3.5 h-3.5" />
                  <span>On This Page</span>
                </div>

                <nav className="space-y-1">
                  {tableOfContents.map((item, idx) => {
                    const isActive = activeAnchor === item.anchor;
                    return (
                      <button
                        key={idx}
                        onClick={() => scrollToAnchor(item.anchor)}
                        className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs transition-all truncate block ${
                          item.level === 3 ? "pl-5 text-[11px]" : ""
                        } ${
                          isActive
                            ? "bg-cyan-500/15 text-cyan-300 font-bold border-l-2 border-cyan-400 shadow-sm"
                            : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                        }`}
                      >
                        {item.title}
                      </button>
                    );
                  })}
                </nav>

                <div className="mt-6 pt-4 border-t border-slate-800/80">
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    <ArrowUp className="w-3 h-3" />
                    <span>Back to Top</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Center / Left: Technical Content Area */}
        <div className={`${readerMode === "workbench" ? "lg:col-span-7" : "lg:col-span-3"} space-y-8`}>
          {/* Key Objectives Banner from the Book */}
          <div className="p-6 rounded-3xl bg-[#090e1c] border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Chapter Objectives &amp; Blueprint Scope</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500 bg-slate-950 px-2.5 py-0.5 rounded-full border border-slate-800">
                Vol {volume} • Ch {chapterNumber}
              </span>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {keyPoints.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ===================================================================== */}
          {/* IN-TEXT LIVE SIMULATION 1: ETHERNET SWITCH LEARNING & FORWARDING SIM  */}
          {/* ===================================================================== */}
          {(chapterNumber === 6 || title.toLowerCase().includes("switch") || title.toLowerCase().includes("lan")) && (
            <div className="p-6 sm:p-7 rounded-3xl bg-[#050811] border-2 border-cyan-500/40 shadow-2xl relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-wide">
                      Live Interactive Sim: How Cisco Switches Learn &amp; Forward Frames
                    </h4>
                    <p className="text-[11px] font-mono text-slate-400">
                      Step through real-time CAM table population and unknown unicast flooding.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleSwitchSimAction(0)}
                  className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-cyan-400 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset CAM Table</span>
                </button>
              </div>

              {/* Topology Diagram with 4 Ports */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 text-center">
                <div className={`p-3 rounded-2xl border transition-all ${switchSimStep >= 1 ? "bg-cyan-500/10 border-cyan-400 shadow-md" : "bg-slate-900/80 border-slate-800"}`}>
                  <Laptop className="w-5 h-5 mx-auto text-cyan-400 mb-1" />
                  <div className="text-xs font-bold text-white">PC-1</div>
                  <div className="text-[10px] font-mono text-cyan-300">Fa0/1</div>
                  <div className="text-[9px] font-mono text-slate-500 mt-1">0014.a82b.4711</div>
                </div>

                <div className={`p-3 rounded-2xl border transition-all ${switchSimStep >= 2 ? "bg-emerald-500/10 border-emerald-400 shadow-md" : "bg-slate-900/80 border-slate-800"}`}>
                  <Laptop className="w-5 h-5 mx-auto text-emerald-400 mb-1" />
                  <div className="text-xs font-bold text-white">PC-2</div>
                  <div className="text-[10px] font-mono text-emerald-300">Fa0/2</div>
                  <div className="text-[9px] font-mono text-slate-500 mt-1">0014.a82b.4712</div>
                </div>

                <div className={`p-3 rounded-2xl border transition-all ${switchSimStep >= 3 ? "bg-purple-500/10 border-purple-400 shadow-md" : "bg-slate-900/80 border-slate-800"}`}>
                  <Laptop className="w-5 h-5 mx-auto text-purple-400 mb-1" />
                  <div className="text-xs font-bold text-white">PC-3</div>
                  <div className="text-[10px] font-mono text-purple-300">Fa0/3</div>
                  <div className="text-[9px] font-mono text-slate-500 mt-1">0014.a82b.4713</div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <Laptop className="w-5 h-5 mx-auto text-slate-500 mb-1" />
                  <div className="text-xs font-bold text-slate-400">PC-4</div>
                  <div className="text-[10px] font-mono text-slate-400">Fa0/4</div>
                  <div className="text-[9px] font-mono text-slate-600 mt-1">0014.a82b.4714</div>
                </div>
              </div>

              {/* Status Banner */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/20 text-xs font-mono text-cyan-200 mb-5 leading-relaxed">
                <span className="text-cyan-400 font-bold">SIM STATUS: </span>
                {simPacketStatus}
              </div>

              {/* Step Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <button
                  onClick={() => handleSwitchSimAction(1)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    switchSimStep === 1
                      ? "bg-cyan-500 text-slate-950 shadow-md"
                      : "bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-500"
                  }`}
                >
                  Step 1: PC-1 Sends to PC-2 (Flood)
                </button>

                <button
                  onClick={() => handleSwitchSimAction(2)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    switchSimStep === 2
                      ? "bg-emerald-500 text-slate-950 shadow-md"
                      : "bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-emerald-500"
                  }`}
                >
                  Step 2: PC-2 Replies (Unicast Forward)
                </button>

                <button
                  onClick={() => handleSwitchSimAction(3)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    switchSimStep === 3
                      ? "bg-purple-500 text-slate-950 shadow-md"
                      : "bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-purple-500"
                  }`}
                >
                  Step 3: PC-3 Sends to PC-1
                </button>
              </div>

              {/* Dynamic Live MAC Address Table Output */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
                  <span className="text-cyan-400 font-bold">Switch-1# show mac address-table</span>
                  <span>{camTable.length} dynamic entries</span>
                </div>
                {camTable.length === 0 ? (
                  <div className="py-4 text-center text-slate-500 italic">
                    CAM table is currently empty. Click Step 1 to send a frame.
                  </div>
                ) : (
                  <div className="pt-2 space-y-1">
                    <div className="text-slate-500">Vlan    Mac Address       Type        Ports</div>
                    <div className="text-slate-500">----    -----------       --------    -----</div>
                    {camTable.map((e, idx) => (
                      <div key={idx} className="text-slate-200">
                        <span className="text-amber-400">{e.vlan.toString().padStart(4, " ")}</span>
                        {"    "}{e.mac}{"    "}<span className="text-emerald-400">{e.type}</span>{"     "}<span className="text-cyan-300">{e.port}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* IN-TEXT LIVE SIMULATION 2: SUBNETTING SPEED CALCULATOR & MAGIC NUMBER */}
          {/* ===================================================================== */}
          {(chapterNumber === 11 || chapterNumber === 12 || title.toLowerCase().includes("subnet")) && (
            <div className="p-6 sm:p-7 rounded-3xl bg-[#050811] border-2 border-emerald-500/40 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-wide">
                      Interactive Subnetting Magic Number &amp; Block Size Calculator
                    </h4>
                    <p className="text-[11px] font-mono text-slate-400">
                      Drag the CIDR slider to instantly visualize borrowed bits, magic number, and host ranges.
                    </p>
                  </div>
                </div>
              </div>

              {/* Slider Control */}
              <div className="space-y-3 mb-6 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-bold">Prefix Length:</span>
                  <span className="text-emerald-400 font-black text-base">/{subnetPrefix}</span>
                </div>
                <input
                  type="range"
                  min="24"
                  max="30"
                  value={subnetPrefix}
                  onChange={(e) => {
                    setSubnetPrefix(Number(e.target.value));
                    sounds.playKeyClick();
                  }}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>/24 (Class C)</span>
                  <span>/25</span>
                  <span>/26</span>
                  <span>/27</span>
                  <span>/28</span>
                  <span>/29</span>
                  <span>/30 (P2P Link)</span>
                </div>
              </div>

              {/* Real-time Subnet Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Subnet Mask</span>
                  <span className="text-xs sm:text-sm font-bold text-white mt-1 block truncate">
                    {subnetCalculations.subnetMask}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Magic Number</span>
                  <span className="text-xs sm:text-sm font-bold text-amber-400 mt-1 block">
                    {subnetCalculations.magicNumber}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Usable Hosts</span>
                  <span className="text-xs sm:text-sm font-bold text-emerald-400 mt-1 block">
                    {subnetCalculations.usableHosts}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Host Bits</span>
                  <span className="text-xs sm:text-sm font-bold text-cyan-400 mt-1 block">
                    {subnetCalculations.hostBits} bits
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* STEPPER NAVIGATION CONTROLS (Active in Stepper Mode)                   */}
          {/* ===================================================================== */}
          {readerMode === "stepper" && (
            <div className="p-5 rounded-2xl bg-[#090e1c] border border-cyan-500/30 flex items-center justify-between gap-4 shadow-lg">
              <button
                disabled={stepperIndex === 0}
                onClick={() => {
                  setStepperIndex((prev) => Math.max(0, prev - 1));
                  sounds.playKeyClick();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Section</span>
              </button>

              <div className="text-center font-mono">
                <span className="text-xs text-cyan-400 font-bold block">
                  Objective {stepperIndex + 1} of {sections.length}
                </span>
                <span className="text-[11px] text-slate-400 truncate max-w-xs inline-block">
                  {currentSection.title}
                </span>
              </div>

              <button
                disabled={stepperIndex >= sections.length - 1}
                onClick={() => {
                  setStepperIndex((prev) => Math.min(sections.length - 1, prev + 1));
                  sounds.playCommandSuccess();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span>Complete &amp; Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ===================================================================== */}
          {/* COMPLETE TEXTBOOK MARKDOWN READER                                     */}
          {/* ===================================================================== */}
          <article className={`p-8 sm:p-10 rounded-3xl bg-[#080d1a] border border-slate-800/80 shadow-2xl backdrop-blur-md prose prose-invert max-w-none prose-headings:text-white prose-p:text-slate-300 prose-strong:text-white prose-code:text-cyan-300 prose-code:bg-slate-950 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-table:border prose-table:border-slate-800 ${fontSizeClasses[fontSize]}`}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ node, children, ...props }) => {
                  const text = String(children);
                  const anchor = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                  return (
                    <h2
                      id={anchor}
                      className="text-xl sm:text-2xl font-bold text-white pt-8 pb-2 border-b border-slate-800/80 scroll-mt-36 group flex items-center justify-between"
                      {...props}
                    >
                      <span>{children}</span>
                      <a
                        href={`#${anchor}`}
                        className="text-slate-600 hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity text-sm font-mono ml-2"
                        title="Link to section"
                      >
                        #
                      </a>
                    </h2>
                  );
                },
                h3: ({ node, children, ...props }) => {
                  const text = String(children);
                  const anchor = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                  return (
                    <h3
                      id={anchor}
                      className="text-lg sm:text-xl font-bold text-white pt-6 pb-1 scroll-mt-36"
                      {...props}
                    >
                      {children}
                    </h3>
                  );
                },
                p: ({ node, children, ...props }) => {
                  const hasBlockOrImage = Boolean(
                    node?.children?.some((child: any) => {
                      const tag = child.tagName || (child.type === "element" && child.tagName);
                      return tag === "img" || tag === "div" || tag === "figure" || tag === "pre" || tag === "table";
                    })
                  );

                  if (hasBlockOrImage) {
                    return <div className="my-4 text-slate-300 leading-relaxed" {...props}>{children}</div>;
                  }
                  return <p className="my-4 text-slate-300 leading-relaxed" {...props}>{children}</p>;
                },
                // Interactive Click-to-Zoom Images
                img: ({ node, src, alt, ...props }) => {
                  if (!src) return null;
                  const imgSrc = typeof src === "string" ? src : "";
                  return (
                    <figure className="my-8 p-3 rounded-2xl bg-slate-950 border border-slate-800/90 group not-prose block">
                      <div
                        onClick={() => setLightboxImage({ src: imgSrc, alt: alt || "Textbook Figure" })}
                        className="relative cursor-zoom-in overflow-hidden rounded-xl bg-slate-950/60 flex items-center justify-center min-h-[180px]"
                      >
                        <img
                          src={imgSrc}
                          alt={alt || "Textbook Figure"}
                          className="max-h-[460px] w-auto object-contain mx-auto transition-transform duration-300 group-hover:scale-[1.02]"
                          loading="lazy"
                        />
                        <div className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-slate-900/90 border border-slate-700 text-[10px] font-mono text-slate-300 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Maximize2 className="w-3 h-3 text-cyan-400" />
                          <span>Click to Zoom</span>
                        </div>
                      </div>
                      {alt && (
                        <figcaption className="text-[11px] text-slate-400 font-mono text-center mt-2.5 px-2">
                          {alt}
                        </figcaption>
                      )}
                    </figure>
                  );
                },
                // LIVE INTERACTIVE CISCO CLI CODE BLOCKS WITH "RUN IN SIMULATOR"
                pre: ({ children, ...props }) => {
                  const codeText = React.Children.toArray(children).map((c: any) => {
                    if (typeof c === "string") return c;
                    return c?.props?.children || "";
                  }).join("");

                  // Check if this looks like a Cisco CLI command
                  const isCiscoSnippet = codeText.includes("#") || codeText.includes(">") || codeText.includes("show ") || codeText.includes("interface") || codeText.includes("ip ");

                  return (
                    <div className="my-6 rounded-2xl overflow-hidden border border-slate-800 bg-[#040711] shadow-xl font-mono not-prose">
                      {/* Terminal Top Bezel */}
                      <div className="px-4 py-2 bg-[#080f22] border-b border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                          </div>
                          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 ml-2">
                            <Terminal className="w-3 h-3 text-cyan-400" />
                            Cisco IOS CLI Syntax
                          </span>
                        </div>

                        {/* Interactive Run and Copy Actions */}
                        <div className="flex items-center gap-2">
                          {isCiscoSnippet && (
                            <button
                              onClick={() => handleRunInTerminal(codeText)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold transition-all shadow-sm"
                              title="Execute directly inside live Cisco IOS simulator"
                            >
                              <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                              <span>Run in Console</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleCopy(codeText)}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[10px] transition-all"
                            title="Copy syntax"
                          >
                            {copiedText === codeText ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Code Content */}
                      <pre className="p-4 text-xs sm:text-sm text-cyan-300 overflow-x-auto leading-relaxed bg-[#040711]" {...props}>
                        {children}
                      </pre>
                    </div>
                  );
                },
                // Styled Tables
                table: ({ children, ...props }) => (
                  <div className="my-6 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60 not-prose">
                    <table className="w-full text-left text-xs border-collapse divide-y divide-slate-800" {...props}>
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children, ...props }) => (
                  <th className="py-3 px-4 bg-slate-900/80 font-mono text-slate-300 font-semibold" {...props}>
                    {children}
                  </th>
                ),
                td: ({ children, ...props }) => (
                  <td className="py-2.5 px-4 text-slate-300 border-t border-slate-800/60" {...props}>
                    {children}
                  </td>
                ),
                // Styled Blockquotes (Differentiated Engineering Callouts)
                blockquote: ({ children, ...props }) => (
                  <blockquote
                    className="codex-callout-blueprint my-6 p-4 text-xs text-cyan-200 not-italic border-l-4 border-cyan-400"
                    {...props}
                  >
                    <div className="flex items-center gap-2 font-mono text-cyan-400 font-bold mb-1">
                      <Compass className="w-3.5 h-3.5" />
                      <span>Cisco Engineering Note</span>
                    </div>
                    {children}
                  </blockquote>
                ),
              }}
            >
              {readerMode === "stepper" ? currentSection.content : fullText}
            </ReactMarkdown>
          </article>

          {/* ===================================================================== */}
          {/* IN-TEXT LIVE SIMULATION 3: INTERACTIVE CHECKPOINT CHALLENGE          */}
          {/* ===================================================================== */}
          {activeCheckpointQuestion && (
            <div className="p-6 sm:p-7 rounded-3xl bg-[#070d1e] border-2 border-amber-500/40 shadow-2xl relative">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-400 font-bold mb-3 tracking-wider">
                <HelpCircle className="w-4 h-4" />
                <span>Section Checkpoint: Test Your Active Recall</span>
              </div>

              <h4 className="text-sm sm:text-base font-semibold text-white mb-4 leading-relaxed">
                {activeCheckpointQuestion.question}
              </h4>

              <div className="space-y-2 mb-4">
                {activeCheckpointQuestion.options.map((opt, oIdx) => {
                  const letter = ["A", "B", "C", "D", "E"][oIdx];
                  const isSelected = checkpointAnswer === oIdx;
                  const isCorrect = oIdx === activeCheckpointQuestion.correctAnswer;

                  let cardStyle = "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900";
                  if (checkpointSubmitted) {
                    if (isCorrect) {
                      cardStyle = "bg-emerald-500/15 border-emerald-500 text-emerald-200 font-semibold";
                    } else if (isSelected && !isCorrect) {
                      cardStyle = "bg-rose-500/15 border-rose-500 text-rose-200";
                    }
                  } else if (isSelected) {
                    cardStyle = "bg-amber-500/15 border-amber-500 text-amber-200 font-semibold";
                  }

                  return (
                    <div
                      key={oIdx}
                      onClick={() => {
                        if (!checkpointSubmitted) {
                          setCheckpointAnswer(oIdx);
                          sounds.playKeyClick();
                        }
                      }}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 text-xs sm:text-sm ${cardStyle}`}
                    >
                      <span className="w-6 h-6 rounded-lg font-mono font-bold flex items-center justify-center shrink-0 border border-slate-700 bg-slate-950 text-slate-300">
                        {letter}
                      </span>
                      <span className="pt-0.5 leading-relaxed">{opt}</span>
                    </div>
                  );
                })}
              </div>

              {/* Checkpoint submission button */}
              {!checkpointSubmitted ? (
                <button
                  disabled={checkpointAnswer === null}
                  onClick={() => {
                    setCheckpointSubmitted(true);
                    if (checkpointAnswer === activeCheckpointQuestion.correctAnswer) {
                      sounds.playCommandSuccess();
                      confetti({ particleCount: 80, spread: 60 });
                    } else {
                      sounds.playKeyClick();
                    }
                  }}
                  className="w-full py-3 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
                >
                  Verify Answer
                </button>
              ) : (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-2">
                  <div className="flex items-center gap-2">
                    {checkpointAnswer === activeCheckpointQuestion.correctAnswer ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Correct Answer!
                      </span>
                    ) : (
                      <span className="text-rose-400 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" /> Needs Review
                      </span>
                    )}
                  </div>
                  <p className="text-slate-300 leading-relaxed font-sans">
                    {activeCheckpointQuestion.explanation}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Stepper bottom advance */}
          {readerMode === "stepper" && (
            <div className="pt-4 flex justify-between">
              <button
                disabled={stepperIndex === 0}
                onClick={() => {
                  setStepperIndex((prev) => Math.max(0, prev - 1));
                  sounds.playKeyClick();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white disabled:opacity-20"
              >
                &larr; Previous Objective
              </button>

              <button
                disabled={stepperIndex >= sections.length - 1}
                onClick={() => {
                  setStepperIndex((prev) => Math.min(sections.length - 1, prev + 1));
                  sounds.playCommandSuccess();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex items-center gap-1 px-5 py-2.5 rounded-xl text-xs font-mono font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-20 shadow-md"
              >
                <span>Next Objective</span>
                &rarr;
              </button>
            </div>
          )}
        </div>

        {/* ===================================================================== */}
        {/* RIGHT PANE: LIVE CISCO IOS WORKBENCH (Active in Workbench Mode)       */}
        {/* ===================================================================== */}
        {readerMode === "workbench" && (
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-28 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
                <span className="text-violet-400 font-bold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  Live Parallel Cisco Console
                </span>
                <span className="text-emerald-400 text-[10px]">IOS 15.2 (Up)</span>
              </div>

              {/* Cisco Terminal Sandbox */}
              <CiscoTerminal
                initialHostname="Switch"
                title={`Live Console • Ch ${chapterNumber}`}
                injectedCommand={injectedCommand}
              />

              {/* Quick Preset Commands for this chapter */}
              {ciscoCommands.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-[11px] font-mono text-slate-400 font-semibold block">
                    Chapter IOS Command Shortcuts (Click to Inject):
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                    {ciscoCommands.slice(0, 8).map((c, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleRunInTerminal(c.cmd)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-500/20 hover:text-cyan-300 text-[11px] font-mono text-slate-300 border border-slate-800 transition-colors text-left"
                      >
                        {c.cmd}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. FLOATING QUICK TERMINAL DRAWER (Toggleable at bottom right)            */}
      {/* ========================================================================= */}
      {showTerminalDrawer && (
        <div className="fixed bottom-0 right-0 z-50 w-full sm:w-[540px] p-4 animate-in slide-in-from-bottom duration-200">
          <div className="rounded-3xl bg-slate-950 border-2 border-cyan-500/40 shadow-2xl overflow-hidden">
            <div className="px-4 py-2.5 bg-[#091124] border-b border-slate-800 flex items-center justify-between text-xs">
              <span className="text-cyan-300 font-mono font-bold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                Live Cisco IOS Simulator Dock
              </span>
              <button
                onClick={() => setShowTerminalDrawer(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-2">
              <CiscoTerminal
                initialHostname="Switch"
                title="Docked Console"
                injectedCommand={injectedCommand}
              />
            </div>
          </div>
        </div>
      )}

      {/* Image Zoom Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => {
            setLightboxImage(null);
            setZoomLevel(1);
          }}
        >
          <div
            className="relative max-w-6xl max-h-[90vh] bg-slate-950 border border-slate-800 rounded-3xl p-4 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800">
              <span className="text-xs font-mono text-slate-300 truncate max-w-lg">
                {lightboxImage.alt}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoomLevel((prev) => Math.max(0.75, prev - 0.25))}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-cyan-400 px-1">{Math.round(zoomLevel * 100)}%</span>
                <button
                  onClick={() => setZoomLevel((prev) => Math.min(2.5, prev + 0.25))}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setLightboxImage(null);
                    setZoomLevel(1);
                  }}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white ml-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto flex items-center justify-center p-2">
              <img
                src={lightboxImage.src}
                alt={lightboxImage.alt}
                style={{ transform: `scale(${zoomLevel})` }}
                className="max-w-full max-h-[75vh] object-contain transition-transform duration-150"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
