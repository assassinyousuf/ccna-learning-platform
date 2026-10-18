"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  Zap, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Flame, 
  Award, 
  ChevronRight, 
  Sparkles, 
  HelpCircle,
  Trophy,
  ArrowRight,
  Calculator
} from "lucide-react";
import { sounds } from "@/lib/sound-effects";

interface SubnetQuestion {
  ip: string;
  cidr: number;
  networkAddress: string;
  broadcastAddress: string;
  firstUsable: string;
  lastUsable: string;
  usableHosts: number;
  subnetMask: string;
  interestingOctet: number; // 1-indexed (1, 2, 3, 4)
  magicNumber: number;
}

function generateRandomSubnetQuestion(): SubnetQuestion {
  // Generate random class A, B, or C IP and CIDR /18 to /30
  const cidrOptions = [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
  const cidr = cidrOptions[Math.floor(Math.random() * cidrOptions.length)];

  // Random IP based on CIDR
  let o1 = 192;
  let o2 = 168;
  let o3 = Math.floor(Math.random() * 254) + 1;
  let o4 = Math.floor(Math.random() * 254) + 1;

  if (cidr < 24) {
    o1 = 172;
    o2 = Math.floor(Math.random() * 16) + 16; // 172.16 - 172.31
  }

  const ip = `${o1}.${o2}.${o3}.${o4}`;
  const octets = [o1, o2, o3, o4];

  const ipNum = ((octets[0] << 24) >>> 0) + ((octets[1] << 16) >>> 0) + ((octets[2] << 8) >>> 0) + (octets[3] >>> 0);
  const maskNum = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
  const wildcardNum = (~maskNum) >>> 0;
  const netNum = (ipNum & maskNum) >>> 0;
  const bcastNum = (netNum | wildcardNum) >>> 0;

  const numToIp = (num: number) =>
    [
      (num >>> 24) & 255,
      (num >>> 16) & 255,
      (num >>> 8) & 255,
      num & 255,
    ].join(".");

  const networkAddress = numToIp(netNum);
  const broadcastAddress = numToIp(bcastNum);
  const subnetMask = numToIp(maskNum);

  const totalHosts = Math.pow(2, 32 - cidr);
  const usableHosts = cidr >= 31 ? 0 : Math.max(0, totalHosts - 2);

  const firstUsable = cidr >= 31 ? "N/A" : numToIp(netNum + 1);
  const lastUsable = cidr >= 31 ? "N/A" : numToIp(bcastNum - 1);

  // Interesting octet:
  const interestingOctet = Math.floor((cidr - 1) / 8) + 1;
  const maskOctetVal = (maskNum >>> ((4 - interestingOctet) * 8)) & 255;
  const magicNumber = 256 - maskOctetVal;

  return {
    ip,
    cidr,
    networkAddress,
    broadcastAddress,
    firstUsable,
    lastUsable,
    usableHosts,
    subnetMask,
    interestingOctet,
    magicNumber,
  };
}

export function SubnetSpeedDrill() {
  const [question, setQuestion] = useState<SubnetQuestion>(() => generateRandomSubnetQuestion());
  const [userNet, setUserNet] = useState("");
  const [userBcast, setUserBcast] = useState("");
  const [userFirst, setUserFirst] = useState("");
  const [userLast, setUserLast] = useState("");
  const [userHosts, setUserHosts] = useState("");

  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [showFormula, setShowFormula] = useState(false);

  // Timer loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0 && !isSubmitted) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          if (prev <= 6) {
            sounds.playKeyClick();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerActive, timeLeft, isSubmitted]);

  const handleTimeUp = () => {
    setIsSubmitted(true);
    setIsCorrect(false);
    setStreak(0);
    sounds.playQuizWrong();
  };

  const handleNextQuestion = () => {
    setQuestion(generateRandomSubnetQuestion());
    setUserNet("");
    setUserBcast("");
    setUserFirst("");
    setUserLast("");
    setUserHosts("");
    setTimeLeft(30);
    setIsSubmitted(false);
    setIsCorrect(null);
    setShowFormula(false);
    setIsTimerActive(true);
    sounds.playKeyClick();
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isSubmitted) return;

    setIsSubmitted(true);
    setIsTimerActive(false);

    const netMatch = userNet.trim() === question.networkAddress;
    const bcastMatch = userBcast.trim() === question.broadcastAddress;
    const firstMatch = userFirst.trim() === question.firstUsable;
    const lastMatch = userLast.trim() === question.lastUsable;
    const hostsMatch = userHosts.trim() === String(question.usableHosts);

    const allCorrect = netMatch && bcastMatch && firstMatch && lastMatch && hostsMatch;

    if (allCorrect) {
      setIsCorrect(true);
      const points = 100 + timeLeft * 10;
      setScore((s) => s + points);
      setStreak((s) => {
        const next = s + 1;
        if (next > bestStreak) setBestStreak(next);
        return next;
      });
      sounds.playQuizCorrect();
    } else {
      setIsCorrect(false);
      setStreak(0);
      sounds.playQuizWrong();
    }
  };

  const rankTier = useMemo(() => {
    if (score >= 1200) return { title: "CCNA Subnet Grandmaster", color: "text-amber-400 bg-amber-500/10 border-amber-500/30" };
    if (score >= 600) return { title: "Senior Network Engineer", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30" };
    if (score >= 250) return { title: "NOC Tier 2 Operator", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" };
    return { title: "Network Cadet", color: "text-slate-400 bg-slate-800/40 border-slate-700" };
  }, [score]);

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xl relative overflow-hidden">
      {/* Top Header & Telemetry */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--primary)] mb-1">
            <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
            <span>30-SECOND CCNA SPEED BLITZ</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight">
            Subnetting Mental Math Trainer
          </h3>
          <p className="text-xs text-[var(--foreground-muted)] mt-1">
            Solve Network ID, Broadcast ID, Usable Hosts &amp; Ranges under exam pressure.
          </p>
        </div>

        {/* Stats Pill Strip */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-[var(--background-subtle)] border border-[var(--border)] text-center">
            <span className="text-[10px] text-[var(--foreground-muted)] font-mono block">STREAK</span>
            <span className="text-base font-bold text-amber-500 font-mono flex items-center justify-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              {streak}
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-[var(--background-subtle)] border border-[var(--border)] text-center">
            <span className="text-[10px] text-[var(--foreground-muted)] font-mono block">SCORE</span>
            <span className="text-base font-bold text-[var(--primary)] font-mono">
              {score} XP
            </span>
          </div>

          <div className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-semibold hidden sm:flex items-center gap-1.5 ${rankTier.color}`}>
            <Award className="w-4 h-4" />
            <span>{rankTier.title}</span>
          </div>
        </div>
      </div>

      {/* Timer Bar */}
      <div className="my-6">
        <div className="flex items-center justify-between text-xs font-mono mb-2">
          <span className="text-[var(--foreground-muted)] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>TIME REMAINING</span>
          </span>
          <span className={`font-bold ${timeLeft <= 5 ? "text-rose-500 animate-pulse text-sm" : "text-[var(--primary)]"}`}>
            {timeLeft}s
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-[var(--background-subtle)] overflow-hidden border border-[var(--border)]">
          <div 
            className={`h-full transition-all duration-1000 ${
              timeLeft > 15 ? "bg-[var(--primary)]" : timeLeft > 6 ? "bg-amber-500" : "bg-rose-500"
            }`}
            style={{ width: `${(timeLeft / 30) * 100}%` }}
          />
        </div>
      </div>

      {/* The Target Address Slab */}
      <div className="p-6 rounded-xl bg-[var(--background-subtle)] border border-[var(--border)] text-center mb-6 relative">
        <span className="text-[10px] font-mono text-[var(--foreground-muted)] uppercase tracking-wider block mb-1">
          TARGET HOST IP &amp; CIDR PREFIX
        </span>
        <div className="text-3xl sm:text-4xl font-black font-mono tracking-wider text-[var(--foreground)]">
          {question.ip} <span className="text-[var(--primary)]">/{question.cidr}</span>
        </div>
        <div className="mt-2 text-xs font-mono text-[var(--foreground-muted)]">
          Subnet Mask: <span className="text-[var(--foreground)] font-semibold">{question.subnetMask}</span>
        </div>
      </div>

      {/* Input Grid */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Network Address */}
          <div>
            <label className="block text-[11px] font-mono text-[var(--foreground-muted)] mb-1">
              1. Network Address (ID)
            </label>
            <input
              type="text"
              value={userNet}
              onChange={(e) => setUserNet(e.target.value)}
              disabled={isSubmitted}
              placeholder="e.g. 192.168.10.0"
              className={`w-full px-3 py-2 rounded-lg bg-[var(--card)] border text-xs font-mono text-[var(--foreground)] outline-none transition-colors ${
                isSubmitted
                  ? userNet.trim() === question.networkAddress
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                    : "border-rose-500 bg-rose-500/10 text-rose-400"
                  : "border-[var(--border)] focus:border-[var(--primary)]"
              }`}
            />
            {isSubmitted && userNet.trim() !== question.networkAddress && (
              <span className="text-[10px] font-mono text-emerald-400 mt-1 block">
                Ans: {question.networkAddress}
              </span>
            )}
          </div>

          {/* Broadcast Address */}
          <div>
            <label className="block text-[11px] font-mono text-[var(--foreground-muted)] mb-1">
              2. Broadcast Address
            </label>
            <input
              type="text"
              value={userBcast}
              onChange={(e) => setUserBcast(e.target.value)}
              disabled={isSubmitted}
              placeholder="e.g. 192.168.10.63"
              className={`w-full px-3 py-2 rounded-lg bg-[var(--card)] border text-xs font-mono text-[var(--foreground)] outline-none transition-colors ${
                isSubmitted
                  ? userBcast.trim() === question.broadcastAddress
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                    : "border-rose-500 bg-rose-500/10 text-rose-400"
                  : "border-[var(--border)] focus:border-[var(--primary)]"
              }`}
            />
            {isSubmitted && userBcast.trim() !== question.broadcastAddress && (
              <span className="text-[10px] font-mono text-emerald-400 mt-1 block">
                Ans: {question.broadcastAddress}
              </span>
            )}
          </div>

          {/* Usable Hosts Count */}
          <div>
            <label className="block text-[11px] font-mono text-[var(--foreground-muted)] mb-1">
              3. Usable Host Count (2^H - 2)
            </label>
            <input
              type="text"
              value={userHosts}
              onChange={(e) => setUserHosts(e.target.value)}
              disabled={isSubmitted}
              placeholder="e.g. 62"
              className={`w-full px-3 py-2 rounded-lg bg-[var(--card)] border text-xs font-mono text-[var(--foreground)] outline-none transition-colors ${
                isSubmitted
                  ? userHosts.trim() === String(question.usableHosts)
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                    : "border-rose-500 bg-rose-500/10 text-rose-400"
                  : "border-[var(--border)] focus:border-[var(--primary)]"
              }`}
            />
            {isSubmitted && userHosts.trim() !== String(question.usableHosts) && (
              <span className="text-[10px] font-mono text-emerald-400 mt-1 block">
                Ans: {question.usableHosts}
              </span>
            )}
          </div>

          {/* First Usable Host */}
          <div>
            <label className="block text-[11px] font-mono text-[var(--foreground-muted)] mb-1">
              4. First Usable Host IP
            </label>
            <input
              type="text"
              value={userFirst}
              onChange={(e) => setUserFirst(e.target.value)}
              disabled={isSubmitted}
              placeholder="e.g. 192.168.10.1"
              className={`w-full px-3 py-2 rounded-lg bg-[var(--card)] border text-xs font-mono text-[var(--foreground)] outline-none transition-colors ${
                isSubmitted
                  ? userFirst.trim() === question.firstUsable
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                    : "border-rose-500 bg-rose-500/10 text-rose-400"
                  : "border-[var(--border)] focus:border-[var(--primary)]"
              }`}
            />
            {isSubmitted && userFirst.trim() !== question.firstUsable && (
              <span className="text-[10px] font-mono text-emerald-400 mt-1 block">
                Ans: {question.firstUsable}
              </span>
            )}
          </div>

          {/* Last Usable Host */}
          <div className="sm:col-span-2 lg:col-span-2">
            <label className="block text-[11px] font-mono text-[var(--foreground-muted)] mb-1">
              5. Last Usable Host IP
            </label>
            <input
              type="text"
              value={userLast}
              onChange={(e) => setUserLast(e.target.value)}
              disabled={isSubmitted}
              placeholder="e.g. 192.168.10.62"
              className={`w-full px-3 py-2 rounded-lg bg-[var(--card)] border text-xs font-mono text-[var(--foreground)] outline-none transition-colors ${
                isSubmitted
                  ? userLast.trim() === question.lastUsable
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                    : "border-rose-500 bg-rose-500/10 text-rose-400"
                  : "border-[var(--border)] focus:border-[var(--primary)]"
              }`}
            />
            {isSubmitted && userLast.trim() !== question.lastUsable && (
              <span className="text-[10px] font-mono text-emerald-400 mt-1 block">
                Ans: {question.lastUsable}
              </span>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
          <button
            type="button"
            onClick={() => setShowFormula(!showFormula)}
            className="flex items-center gap-1.5 text-xs font-mono text-[var(--primary)] hover:underline"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showFormula ? "Hide Formula" : "Show Magic Number Formula"}</span>
          </button>

          <div className="flex items-center gap-2">
            {!isSubmitted ? (
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-bold text-xs hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2"
              >
                <span>Verify Subnet Answers</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNextQuestion}
                className="px-6 py-2.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors shadow-sm flex items-center gap-2"
              >
                <span>Next Rapid Fire Drill</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Step-by-Step Magic Number Formula Breakdown */}
      {showFormula && (
        <div className="mt-6 p-5 rounded-xl bg-[var(--terminal-bg)] border border-[var(--terminal-border)] text-xs font-mono text-[var(--terminal-out)] space-y-2">
          <div className="text-[var(--primary)] font-bold pb-1 border-b border-[var(--terminal-border)] flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Exam Shortcut: Magic Number Algorithm for /{question.cidr}</span>
          </div>
          <p>
            1. <strong className="text-white">Interesting Octet:</strong> Octet {question.interestingOctet} is the subnetting boundary.
          </p>
          <p>
            2. <strong className="text-white">Magic Number:</strong> 256 - {question.subnetMask.split(".")[question.interestingOctet - 1]} = <span className="text-amber-400 font-bold">{question.magicNumber}</span> (Block Size).
          </p>
          <p>
            3. <strong className="text-white">Network Address Multiples:</strong> The network boundary in Octet {question.interestingOctet} increments by {question.magicNumber} (0, {question.magicNumber}, {question.magicNumber * 2}, ...).
          </p>
          <p>
            4. <strong className="text-white">Host Capacity:</strong> 32 - {question.cidr} = {32 - question.cidr} host bits &rarr; 2^{32 - question.cidr} - 2 = <span className="text-cyan-400 font-bold">{question.usableHosts} valid hosts</span>.
          </p>
        </div>
      )}
    </div>
  );
}
