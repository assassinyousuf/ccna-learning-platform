"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import {
  curriculum,
  getAllModules,
} from "@/lib/curriculum";
import { sounds } from "@/lib/sound-effects";
import { NetworkPacketSimulator } from "@/components/NetworkPacketSimulator";
import { SubnetCalculatorModal } from "@/components/SubnetCalculatorModal";
import { AntigravityCanvas } from "@/components/AntigravityCanvas";
import {
  Network,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Cpu,
  Layers,
  Sparkles,
  Terminal,
  ChevronRight,
  BookOpen,
  HelpCircle,
  Video,
  FileSpreadsheet,
  HardDrive,
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
  GraduationCap,
  Calculator,
  Search,
  CheckCircle2,
  Activity,
  Zap,
  Copy,
  Check,
  LayoutDashboard,
  Flame,
  Sliders,
  Lock,
  Shield,
  Server,
  Radio
} from "lucide-react";

interface SwitchPortInfo {
  id: number;
  name: string;
  vlan: number | string;
  mode: string;
  status: "Up" | "Down" | "Standby";
  speed: string;
  desc: string;
}

const SWITCH_PORTS: SwitchPortInfo[] = [
  { id: 1, name: "Fa0/1", vlan: 10, mode: "Access", status: "Up", speed: "100M", desc: "Workstation Host PC-A (192.168.10.50)" },
  { id: 2, name: "Fa0/2", vlan: 10, mode: "Access", status: "Up", speed: "100M", desc: "Workstation Host PC-B (192.168.10.51)" },
  { id: 3, name: "Fa0/3", vlan: 20, mode: "Access", status: "Up", speed: "100M", desc: "Cisco IP Phone 8845 (Voice VLAN)" },
  { id: 4, name: "Fa0/4", vlan: 20, mode: "Access", status: "Down", speed: "Auto", desc: "Executive Office Drop (Standby)" },
  { id: 5, name: "Fa0/5", vlan: 30, mode: "Access", status: "Up", speed: "100M", desc: "Aironet AP 2802i (802.3at PoE+)" },
  { id: 6, name: "Fa0/6", vlan: 30, mode: "Access", status: "Down", speed: "Auto", desc: "Conference Room Access Point" },
  { id: 7, name: "Fa0/7", vlan: 99, mode: "Access", status: "Up", speed: "100M", desc: "NOC Out-of-Band Management Terminal" },
  { id: 8, name: "Fa0/8", vlan: 10, mode: "Access", status: "Up", speed: "100M", desc: "Lab Wireshark Packet Tap / SPAN" },
  { id: 9, name: "Gi0/1", vlan: 99, mode: "Trunk", status: "Up", speed: "1G", desc: "802.1Q Trunk Uplink to Core Switch 2" },
  { id: 10, name: "Gi0/2", vlan: 99, mode: "Trunk", status: "Up", speed: "1G", desc: "Router-on-a-Stick Uplink to Cisco ISR 4331" },
  { id: 11, name: "Te0/1", vlan: "Native", mode: "SFP+", status: "Up", speed: "10G", desc: "10G SFP+ Fiber Core Distribution Ring" },
  { id: 12, name: "Te0/2", vlan: "Native", mode: "SFP+", status: "Standby", speed: "10G", desc: "Redundant Fiber Link (HSRP Standby)" },
];

function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function HomePage() {
  const { data: session } = useSession();
  const allModules = useMemo(() => getAllModules(), []);
  const [selectedVolume, setSelectedVolume] = useState<1 | 2>(1);
  const [selectedPart, setSelectedPart] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubnetOpen, setIsSubnetOpen] = useState(false);

  // Hero interactive Cisco demonstration state
  const [heroTab, setHeroTab] = useState<"terminal" | "topology" | "ospf">("terminal");
  const [activeCmd, setActiveCmd] = useState<"mac" | "brief" | "route">("mac");
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [selectedPortId, setSelectedPortId] = useState<number>(1);

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
  
  const displayedModules = useMemo(() => {
    return allModules.filter((m) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = m.title.toLowerCase().includes(q);
        const matchesDesc = m.description.toLowerCase().includes(q);
        const matchesCmds = m.ciscoCommands.some((c) => c.cmd.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q));
        const matchesPart = m.partTitle?.toLowerCase().includes(q);
        return matchesTitle || matchesDesc || matchesCmds || matchesPart;
      }
      if (m.volume !== selectedVolume) return false;
      if (selectedPart !== "all" && m.partNumber !== selectedPart) return false;
      return true;
    });
  }, [allModules, searchQuery, selectedVolume, selectedPart]);

  const handleCopyCmd = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(text);
    sounds.playCommandSuccess();
    setTimeout(() => setCopiedCmd(null), 1500);
  };

  const selectedPort = SWITCH_PORTS.find((p) => p.id === selectedPortId) || SWITCH_PORTS[0];

  return (
    <div className="relative overflow-hidden">
      {/* Precision Micro-Grid Background */}
      <div className="absolute inset-0 noc-grid-bg [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_65%,transparent_100%)] pointer-events-none" />

      {/* Hero Section: High-Tech Industrial NOC Cockpit */}
      <section className="relative min-h-[640px] pt-8 pb-16 lg:pt-12 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Antigravity Ambient Particle Canvas */}
        <AntigravityCanvas />

        {/* Content Container (relative z-10) */}
        <div className="relative z-10">
          {/* Main Dual-Column Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* ========================================================================= */}
            {/* LEFT COLUMN: Industrial Mission Control & Telemetry                       */}
            {/* ========================================================================= */}
            <div className="xl:col-span-6 flex flex-col justify-center text-left">
              {/* Telemetry Operational Badge */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[var(--card)]/90 backdrop-blur-md border border-[var(--border-highlight)] text-xs font-mono mb-6 shadow-sm w-fit">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-[var(--foreground)] font-semibold">SYS_ONLINE</span>
                <span className="text-[var(--border)]">|</span>
                <span className="text-[var(--primary)] font-mono">CCNA 200-301 v1.1 NOC COCKPIT</span>
                <span className="text-[var(--border)] hidden sm:inline">|</span>
                <span className="text-emerald-500 dark:text-emerald-400 hidden sm:inline text-[11px]">UPTIME: 99.99%</span>
              </div>

              {/* High-Impact Industrial Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-black tracking-tight text-[var(--foreground)] leading-[1.1] select-none">
                Industrial Cockpit for{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-400">
                  Cisco Network Mastery
                </span>
              </h1>

              {/* Subtext */}
              <p className="mt-5 text-sm sm:text-base text-[var(--foreground-muted)] max-w-xl leading-relaxed font-normal">
                Architected by <span className="text-[var(--foreground)] font-semibold">Md. Yousuf Hossain</span> for mission-critical fluency. Experience interactive Cisco Catalyst chassis telemetry, drill 367 live IOS commands across 49 chapters, and verify your lab work.
              </p>

              {/* Auth Error Banner if applicable */}
              {authError && (
                <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-xs flex flex-col gap-2 shadow-lg">
                  <div className="flex items-center gap-2 font-semibold text-amber-600 dark:text-amber-400 text-sm">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>OAuth Notice: {authError === "OAuthCallback" ? "Google Callback Verification Failed" : authError}</span>
                  </div>
                  <p className="text-[var(--foreground-muted)] leading-relaxed">
                    Google authentication was interrupted. Retry below to restore clearance.
                  </p>
                  <button
                    onClick={() => {
                      setAuthError(null);
                      window.history.replaceState({}, "", "/");
                      signIn("google", { callbackUrl: "/dashboard" });
                    }}
                    className="self-start px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors shadow-sm"
                  >
                    Retry Google Sign-In
                  </button>
                </div>
              )}

              {/* 4-Metric Industrial Telemetry KPI Rail */}
              <div className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-xl">
                <div className="p-3 rounded-lg bg-[var(--card)] border border-[var(--border)] text-left hover:border-[var(--border-highlight)] transition-colors">
                  <div className="text-xl sm:text-2xl font-black text-[var(--foreground)] font-mono">49</div>
                  <div className="text-[11px] font-mono text-[var(--foreground-muted)] uppercase tracking-wider mt-0.5">Chapters (Vol 1 & 2)</div>
                </div>
                <div className="p-3 rounded-lg bg-[var(--card)] border border-[var(--border)] text-left hover:border-cyan-500/40 transition-colors">
                  <div className="text-xl sm:text-2xl font-black text-cyan-500 dark:text-cyan-400 font-mono">367</div>
                  <div className="text-[11px] font-mono text-[var(--foreground-muted)] uppercase tracking-wider mt-0.5">IOS Commands</div>
                </div>
                <div className="p-3 rounded-lg bg-[var(--card)] border border-[var(--border)] text-left hover:border-amber-500/40 transition-colors">
                  <div className="text-xl sm:text-2xl font-black text-amber-500 dark:text-amber-400 font-mono">450</div>
                  <div className="text-[11px] font-mono text-[var(--foreground-muted)] uppercase tracking-wider mt-0.5">Exam Pool Qs</div>
                </div>
                <div className="p-3 rounded-lg bg-[var(--card)] border border-[var(--border)] text-left hover:border-emerald-500/40 transition-colors">
                  <div className="text-xl sm:text-2xl font-black text-emerald-500 dark:text-emerald-400 font-mono">100%</div>
                  <div className="text-[11px] font-mono text-[var(--foreground-muted)] uppercase tracking-wider mt-0.5">Video Proof Lab</div>
                </div>
              </div>

              {/* Tactical Mission Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {session ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 hover:brightness-110 transition-all shadow-lg shadow-cyan-500/20 group"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-950" />
                      <span>Enter Mission Control</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>

                    <Link
                      href="/practice-test"
                      className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm text-amber-600 dark:text-amber-400 bg-[var(--card)] border border-amber-500/30 hover:border-amber-400 hover:bg-amber-500/10 transition-all shadow-sm"
                    >
                      <Award className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                      <span>CCNA Exam Simulator</span>
                    </Link>

                    <a
                      href="#packet-flight"
                      className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] hover:border-cyan-500 hover:bg-[var(--card-hover)] transition-all shadow-sm"
                    >
                      <Activity className="w-4 h-4 text-cyan-500 dark:text-cyan-400 animate-pulse" />
                      <span>Packet Flight</span>
                    </a>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                      className="flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 transition-all shadow-md group border border-slate-700 dark:border-slate-300"
                    >
                      <GoogleIcon className="w-4 h-4" />
                      <span>Sign In with Google</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    <a
                      href="#curriculum"
                      className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm text-cyan-600 dark:text-cyan-300 bg-[var(--card)] border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-500/10 transition-all shadow-sm"
                    >
                      <BookOpen className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                      <span>Explore Syllabus Matrix</span>
                    </a>

                    <Link
                      href="/practice-test"
                      className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm text-amber-600 dark:text-amber-400 bg-[var(--card)] border border-amber-500/30 hover:border-amber-400 hover:bg-amber-500/10 transition-all shadow-sm"
                    >
                      <Award className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                      <span>Exam Simulator</span>
                    </Link>
                  </>
                )}

                <button
                  onClick={() => {
                    sounds.playCommandSuccess();
                    setIsSubnetOpen(true);
                  }}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 bg-[var(--card)] border border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-500/10 transition-all shadow-sm"
                >
                  <Calculator className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  <span>32-Bit Subnet Drill</span>
                </button>
              </div>

              {/* Protocol Spec Footnote Strip */}
              <div className="mt-8 pt-4 border-t border-[var(--border)] flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px] font-mono text-[var(--foreground-muted)]">
                <span className="px-2 py-0.5 rounded bg-[var(--panel)] border border-[var(--border)]">IEEE 802.1Q</span>
                <span className="px-2 py-0.5 rounded bg-[var(--panel)] border border-[var(--border)]">RFC 2328 OSPFv2</span>
                <span className="px-2 py-0.5 rounded bg-[var(--panel)] border border-[var(--border)]">RFC 791 IPv4</span>
                <span className="px-2 py-0.5 rounded bg-[var(--panel)] border border-[var(--border)]">Cisco IOS 15.2(SE)</span>
                <span className="px-2 py-0.5 rounded bg-[var(--panel)] border border-[var(--border)]">1000BASE-T</span>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* RIGHT COLUMN: 1U Cisco Catalyst Chassis & Interactive Console             */}
            {/* ========================================================================= */}
            <div className="xl:col-span-6 flex flex-col gap-4 text-left">
              
              {/* 1U CISCO CATALYST HARDWARE SWITCH CHASSIS */}
              <div className="rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-2xl overflow-hidden relative group">
                
                {/* Rackmount Top Ear Bezel */}
                <div className="px-4 py-2.5 bg-[var(--panel)] border-b border-[var(--border)] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {/* Metallic Bolt Screws */}
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full border border-slate-500/60 dark:border-slate-400/60 flex items-center justify-center text-[8px] font-mono text-slate-500 leading-none">✚</span>
                      <span className="w-2.5 h-2.5 rounded-full border border-slate-500/60 dark:border-slate-400/60 flex items-center justify-center text-[8px] font-mono text-slate-500 leading-none">✚</span>
                    </div>
                    {/* Cisco Logo & Model Tag */}
                    <div className="flex items-center gap-1.5 pl-2 border-l border-[var(--border)]">
                      <Server className="w-3.5 h-3.5 text-cyan-500" />
                      <span className="text-xs font-black tracking-wider text-[var(--foreground)] uppercase font-mono">
                        CISCO <span className="font-semibold text-[var(--foreground-muted)] text-[11px]">Catalyst 2960-X</span>
                      </span>
                    </div>
                  </div>

                  {/* Diagnostic Status LEDs */}
                  <div className="flex items-center gap-3 text-[10px] font-mono">
                    <div className="flex items-center gap-1" title="Power Supply 1 Active">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shadow-sm shadow-emerald-400/50" />
                      <span className="text-[var(--foreground-muted)]">PWR</span>
                    </div>
                    <div className="flex items-center gap-1" title="Switch Operating Status">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                      <span className="text-[var(--foreground-muted)]">STAT</span>
                    </div>
                    <div className="flex items-center gap-1" title="Redundant Power Standby">
                      <span className="w-2 h-2 rounded-full bg-amber-400/80 inline-block" />
                      <span className="text-[var(--foreground-muted)]">RPS</span>
                    </div>
                    <span className="hidden sm:inline text-[var(--border)]">|</span>
                    <span className="hidden sm:inline text-cyan-600 dark:text-cyan-400 text-[10px]">
                      FAN: 4800 RPM • 38.2°C
                    </span>
                  </div>
                </div>

                {/* 12-Port RJ-45 Gigabit Port Matrix */}
                <div className="p-4 bg-[var(--terminal-bg)] border-b border-[var(--border)]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--foreground-muted)] flex items-center gap-1.5">
                      <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
                      <span>Interactive 10/100/1000BASE-T Ports (Click Port to Inspect)</span>
                    </span>
                    <span className="text-[10px] font-mono text-[var(--foreground-muted)]">
                      Port {selectedPort.id}/12 Active
                    </span>
                  </div>

                  {/* 12-Port Grid (2 Rows of 6) */}
                  <div className="grid grid-cols-6 gap-2">
                    {SWITCH_PORTS.map((port) => {
                      const isSelected = port.id === selectedPortId;
                      const isUp = port.status === "Up";
                      const isStandby = port.status === "Standby";

                      return (
                        <button
                          key={port.id}
                          onClick={() => {
                            setSelectedPortId(port.id);
                            sounds.playKeyClick();
                          }}
                          className={`p-2 rounded-lg border text-left transition-all relative flex flex-col justify-between h-[68px] ${
                            isSelected
                              ? "bg-cyan-500/15 border-cyan-400 ring-2 ring-cyan-400/30"
                              : "bg-[var(--card)] border-[var(--border)] hover:border-cyan-500/50 hover:bg-[var(--card-hover)]"
                          }`}
                        >
                          {/* Port Link LED */}
                          <div className="flex items-center justify-between w-full">
                            <span className="text-[9px] font-mono font-bold text-[var(--foreground)]">
                              {port.name}
                            </span>
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isUp
                                  ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)] animate-pulse"
                                  : isStandby
                                  ? "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]"
                                  : "bg-slate-400/40"
                              }`}
                            />
                          </div>

                          {/* RJ-45 Connector Visual Mockup */}
                          <div className="w-full h-3 rounded-sm bg-slate-900/60 dark:bg-black/60 border border-slate-700/50 flex items-center justify-center gap-0.5 px-1 my-0.5">
                            <span className="w-0.5 h-1.5 bg-amber-400/80 rounded-full inline-block" />
                            <span className="w-0.5 h-1.5 bg-amber-400/80 rounded-full inline-block" />
                            <span className="w-0.5 h-1.5 bg-amber-400/80 rounded-full inline-block" />
                            <span className="w-0.5 h-1.5 bg-amber-400/80 rounded-full inline-block" />
                          </div>

                          {/* Port VLAN / Mode Label */}
                          <div className="flex items-center justify-between w-full text-[8px] font-mono text-[var(--foreground-muted)]">
                            <span className="truncate">{port.mode === "Trunk" ? "TRK" : `V${port.vlan}`}</span>
                            <span className="text-cyan-500 dark:text-cyan-400">{port.speed}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Active Port Diagnostics Bar */}
                <div className="px-4 py-2.5 bg-[var(--panel)] border-b border-[var(--border)] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30">
                      {selectedPort.name}
                    </span>
                    <span className="text-[var(--foreground)] font-semibold truncate max-w-[240px] sm:max-w-xs">
                      {selectedPort.desc}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="text-[var(--foreground-muted)]">
                      VLAN: <strong className="text-[var(--foreground)]">{selectedPort.vlan}</strong> ({selectedPort.mode})
                    </span>
                    <span className="text-[var(--border)]">|</span>
                    <span className="text-[var(--foreground-muted)]">
                      Speed: <strong className="text-cyan-500 dark:text-cyan-400">{selectedPort.speed}</strong>
                    </span>
                    <span className="text-[var(--border)]">|</span>
                    <span className={`font-bold ${selectedPort.status === "Up" ? "text-emerald-500" : selectedPort.status === "Standby" ? "text-amber-500" : "text-rose-500"}`}>
                      {selectedPort.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* View Switcher Tabs (Terminal, Topology, OSPF) */}
                <div className="px-4 py-2 bg-[var(--background)] border-b border-[var(--border)] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/90 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/90 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/90 inline-block" />
                    <span className="text-[10px] font-mono text-[var(--foreground-muted)] pl-2 border-l border-[var(--border)]">
                      tty0 • 9600 8-N-1
                    </span>
                  </div>

                  <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--card)] border border-[var(--border)] text-xs font-mono">
                    <button
                      onClick={() => setHeroTab("terminal")}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1 ${
                        heroTab === "terminal"
                          ? "bg-[var(--primary-muted)] text-[var(--primary)] border border-[var(--border-highlight)]"
                          : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      <Terminal className="w-3 h-3" />
                      <span>CLI Console</span>
                    </button>
                    <button
                      onClick={() => setHeroTab("topology")}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1 ${
                        heroTab === "topology"
                          ? "bg-purple-500/20 text-purple-400 border border-purple-500/40"
                          : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      <Network className="w-3 h-3" />
                      <span>Topology</span>
                    </button>
                    <button
                      onClick={() => setHeroTab("ospf")}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1 ${
                        heroTab === "ospf"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      <Cpu className="w-3 h-3" />
                      <span>OSPF Live</span>
                    </button>
                  </div>
                </div>

                {/* TAB 1: Live Interactive Cisco CLI */}
                {heroTab === "terminal" && (
                  <div className="p-4 sm:p-5 font-mono text-xs bg-[var(--terminal-bg)]">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-3 border-b border-[var(--border)] text-xs">
                      <span className="text-[var(--foreground-muted)] flex items-center gap-1.5 text-[11px]">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                        <span>Command:</span>
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          onClick={() => {
                            setActiveCmd("mac");
                            sounds.playKeyClick();
                          }}
                          className={`px-2 py-0.5 rounded text-[11px] transition-all border ${
                            activeCmd === "mac"
                              ? "bg-[var(--primary)] text-slate-950 font-bold border-[var(--primary)]"
                              : "bg-[var(--card)] border-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                          }`}
                        >
                          show mac address-table
                        </button>
                        <button
                          onClick={() => {
                            setActiveCmd("brief");
                            sounds.playKeyClick();
                          }}
                          className={`px-2 py-0.5 rounded text-[11px] transition-all border ${
                            activeCmd === "brief"
                              ? "bg-[var(--primary)] text-slate-950 font-bold border-[var(--primary)]"
                              : "bg-[var(--card)] border-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                          }`}
                        >
                          show ip int brief
                        </button>
                        <button
                          onClick={() => {
                            setActiveCmd("route");
                            sounds.playKeyClick();
                          }}
                          className={`px-2 py-0.5 rounded text-[11px] transition-all border ${
                            activeCmd === "route"
                              ? "bg-[var(--primary)] text-slate-950 font-bold border-[var(--primary)]"
                              : "bg-[var(--card)] border-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                          }`}
                        >
                          show ip route
                        </button>
                      </div>
                    </div>

                    {/* Terminal Output */}
                    <div className="space-y-1.5 min-h-[160px] text-[var(--terminal-out)] leading-relaxed overflow-x-auto text-[11px] sm:text-xs">
                      {activeCmd === "mac" && (
                        <div>
                          <div className="flex items-center justify-between">
                            <p className="text-[var(--primary)] font-bold">SW1# show mac address-table</p>
                            <button
                              onClick={() => handleCopyCmd("show mac address-table")}
                              className="text-[10px] text-[var(--foreground-muted)] hover:text-[var(--foreground)] flex items-center gap-1"
                              title="Copy command"
                            >
                              {copiedCmd === "show mac address-table" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedCmd === "show mac address-table" ? "Copied" : "Copy"}</span>
                            </button>
                          </div>
                          <p className="text-slate-500">          Mac Address Table</p>
                          <p className="text-slate-500">-------------------------------------------</p>
                          <p className="text-slate-400 font-semibold">Vlan    Mac Address       Type        Ports</p>
                          <p className="text-slate-400 font-semibold">----    -----------       --------    -----</p>
                          <p><span className="text-amber-400">  10</span>    0014.a82b.4711    <span className="text-emerald-400">DYNAMIC</span>     <span className="text-cyan-300">Fa0/1</span></p>
                          <p><span className="text-amber-400">  10</span>    0014.a82b.4712    <span className="text-emerald-400">DYNAMIC</span>     <span className="text-cyan-300">Fa0/2</span></p>
                          <p><span className="text-purple-400">  20</span>    0050.56a1.c001    <span className="text-emerald-400">DYNAMIC</span>     <span className="text-cyan-300">Fa0/3</span></p>
                          <p><span className="text-slate-400">   1</span>    0019.06ea.3980    <span className="text-[var(--primary)]">STATIC</span>      <span className="text-emerald-300">CPU</span></p>
                          <p className="pt-1.5 text-[var(--primary)] font-bold">SW1# <span className="animate-pulse inline-block w-1.5 h-3 bg-[var(--primary)] align-middle ml-0.5" /></p>
                        </div>
                      )}

                      {activeCmd === "brief" && (
                        <div>
                          <div className="flex items-center justify-between">
                            <p className="text-[var(--primary)] font-bold">R1# show ip interface brief</p>
                            <button
                              onClick={() => handleCopyCmd("show ip interface brief")}
                              className="text-[10px] text-[var(--foreground-muted)] hover:text-[var(--foreground)] flex items-center gap-1"
                              title="Copy command"
                            >
                              {copiedCmd === "show ip interface brief" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedCmd === "show ip interface brief" ? "Copied" : "Copy"}</span>
                            </button>
                          </div>
                          <p className="text-slate-400 font-semibold">Interface              IP-Address      OK? Method Status                Protocol</p>
                          <p><span className="text-cyan-300 font-bold">GigabitEthernet0/0/0</span>   <span className="text-amber-300">192.168.1.1</span>     YES NVRAM  <span className="text-emerald-400 font-bold">up</span>                    <span className="text-emerald-400 font-bold">up</span></p>
                          <p><span className="text-cyan-300 font-bold">GigabitEthernet0/0/1</span>   <span className="text-amber-300">10.0.12.1</span>       YES manual <span className="text-emerald-400 font-bold">up</span>                    <span className="text-emerald-400 font-bold">up</span></p>
                          <p><span className="text-slate-400">GigabitEthernet0/0/2</span>   unassigned      YES unset  <span className="text-rose-400 font-semibold">administratively down</span> <span className="text-rose-400 font-semibold">down</span></p>
                          <p><span className="text-purple-300 font-bold">Loopback0</span>              <span className="text-amber-300">1.1.1.1</span>         YES manual <span className="text-emerald-400 font-bold">up</span>                    <span className="text-emerald-400 font-bold">up</span></p>
                          <p className="pt-1.5 text-[var(--primary)] font-bold">R1# <span className="animate-pulse inline-block w-1.5 h-3 bg-[var(--primary)] align-middle ml-0.5" /></p>
                        </div>
                      )}

                      {activeCmd === "route" && (
                        <div>
                          <div className="flex items-center justify-between">
                            <p className="text-[var(--primary)] font-bold">R1# show ip route</p>
                            <button
                              onClick={() => handleCopyCmd("show ip route")}
                              className="text-[10px] text-[var(--foreground-muted)] hover:text-[var(--foreground)] flex items-center gap-1"
                              title="Copy command"
                            >
                              {copiedCmd === "show ip route" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedCmd === "show ip route" ? "Copied" : "Copy"}</span>
                            </button>
                          </div>
                          <p className="text-slate-500">Gateway of last resort is 10.0.12.2 to network 0.0.0.0</p>
                          <p><span className="text-emerald-400 font-bold">C</span>     192.168.1.0/24 is directly connected, <span className="text-cyan-300">GigabitEthernet0/0/0</span></p>
                          <p><span className="text-emerald-400 font-bold">C</span>     10.0.12.0/30 is directly connected, <span className="text-cyan-300">GigabitEthernet0/0/1</span></p>
                          <p><span className="text-purple-400 font-bold">O</span>     <span className="text-amber-300">172.16.0.0/16</span> [110/2] via 10.0.12.2, 00:14:22, <span className="text-cyan-300">Gi0/0/1</span></p>
                          <p><span className="text-amber-400 font-bold">S*</span>    0.0.0.0/0 [1/0] via 10.0.12.2</p>
                          <p className="pt-1.5 text-[var(--primary)] font-bold">R1# <span className="animate-pulse inline-block w-1.5 h-3 bg-[var(--primary)] align-middle ml-0.5" /></p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 2: Live Topology Preview */}
                {heroTab === "topology" && (
                  <div className="p-4 sm:p-5 bg-[var(--terminal-bg)] font-mono">
                    <div className="flex items-center justify-between mb-3 text-xs text-[var(--foreground-muted)]">
                      <span className="text-purple-400 font-bold flex items-center gap-1.5 text-[11px]">
                        <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                        802.1Q Trunk Topology: Catalyst 2960 + ISR 4331
                      </span>
                      <span className="text-emerald-400 font-semibold text-[10px]">1000BASE-T UP/UP</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-center text-center">
                      <div className="p-3 rounded-lg bg-[var(--card)] border border-[var(--border)]">
                        <div className="w-7 h-7 rounded-md bg-[var(--primary-muted)] text-[var(--primary)] mx-auto flex items-center justify-center mb-1.5">
                          <Laptop className="w-3.5 h-3.5" />
                        </div>
                        <h4 className="font-bold text-[var(--foreground)] text-xs">PC-A Host</h4>
                        <p className="text-[10px] text-[var(--primary)]">192.168.10.50/24</p>
                        <span className="inline-block mt-1 px-1.5 py-0.2 rounded text-[9px] bg-amber-500/10 text-amber-500 dark:text-amber-400 font-semibold border border-amber-500/20">
                          VLAN 10 Access
                        </span>
                      </div>

                      <div className="p-3 rounded-lg bg-[var(--card)] border border-purple-500/30 relative">
                        <div className="w-7 h-7 rounded-md bg-purple-500/10 text-purple-400 mx-auto flex items-center justify-center mb-1.5">
                          <Layers className="w-3.5 h-3.5" />
                        </div>
                        <h4 className="font-bold text-[var(--foreground)] text-xs">SW1 (2960-X)</h4>
                        <p className="text-[10px] text-purple-400">VLAN 10, 20, 99</p>
                        <span className="inline-block mt-1 px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                          STP Root Bridge
                        </span>
                      </div>

                      <div className="p-3 rounded-lg bg-[var(--card)] border border-[var(--border)]">
                        <div className="w-7 h-7 rounded-md bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center mb-1.5">
                          <Network className="w-3.5 h-3.5" />
                        </div>
                        <h4 className="font-bold text-[var(--foreground)] text-xs">R1 (ISR 4331)</h4>
                        <p className="text-[10px] text-emerald-400">Router-on-Stick</p>
                        <span className="inline-block mt-1 px-1.5 py-0.2 rounded text-[9px] bg-cyan-500/10 text-[var(--primary)] font-semibold border border-cyan-500/20">
                          Default Gateway
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: OSPF Convergence */}
                {heroTab === "ospf" && (
                  <div className="p-4 sm:p-5 bg-[var(--terminal-bg)] font-mono text-xs text-[var(--foreground-muted)] space-y-2.5">
                    <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                      <span className="text-emerald-400 font-bold flex items-center gap-1.5 text-[11px]">
                        <Cpu className="w-3.5 h-3.5" />
                        <span>OSPFv2 Proc 1 • Router ID: 1.1.1.1 • Area 0</span>
                      </span>
                      <span className="text-[var(--primary)] font-semibold text-[10px]">CONVERGED</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2.5 rounded-lg bg-[var(--card)] border border-[var(--border)]">
                        <h5 className="text-[var(--foreground)] font-semibold mb-1 text-[11px]">Neighbor Table:</h5>
                        <p>Neighbor: <span className="text-cyan-400">2.2.2.2</span></p>
                        <p>State: <span className="text-emerald-400 font-bold">FULL/DR</span></p>
                        <p>Dead Time: <span className="text-amber-400">00:00:36</span></p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[var(--card)] border border-[var(--border)]">
                        <h5 className="text-[var(--foreground)] font-semibold mb-1 text-[11px]">SPF Cost Matrix:</h5>
                        <p>Ref BW: <span className="text-cyan-400">1000 Mbps</span></p>
                        <p>Gigabit Cost: <span className="text-emerald-400">1</span></p>
                        <p>FastEth Cost: <span className="text-amber-400">10</span></p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Chassis Telemetry Stream Footer */}
                <div className="px-4 py-2 bg-[var(--panel)] border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-[var(--foreground-muted)]">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-500 font-semibold">RX: 148,291 pkts/s</span>
                    <span className="text-[var(--border)]">|</span>
                    <span className="text-cyan-500 font-semibold">TX: 142,804 pkts/s</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>CRC ERR: 0</span>
                    <span className="text-[var(--border)]">|</span>
                    <span>MTU: 1500 BYTES</span>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* 4 Infrastructure Highlights */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto text-left">
            <div className="p-5 rounded-xl noc-surface noc-surface-interactive flex flex-col justify-between">
              <div className="w-9 h-9 rounded-lg bg-[var(--primary-muted)] text-[var(--primary)] flex items-center justify-center mb-3">
                <HardDrive className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[var(--foreground)] mb-1">5TB Cloud Storage</h3>
                <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">Direct streaming video lab uploads bypassing serverless payload limits.</p>
              </div>
            </div>

            <div className="p-5 rounded-xl noc-surface noc-surface-interactive flex flex-col justify-between">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[var(--foreground)] mb-1">Google Sheets DB</h3>
                <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">Live cohort gradebook and milestone progression synchronization.</p>
              </div>
            </div>

            <div className="p-5 rounded-xl noc-surface noc-surface-interactive flex flex-col justify-between">
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[var(--foreground)] mb-1">367 CLI Commands</h3>
                <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">Interactive terminal emulator with exact Cisco IOS syntax from Appendix B.</p>
              </div>
            </div>

            <div className="p-5 rounded-xl noc-surface noc-surface-interactive flex flex-col justify-between">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[var(--foreground)] mb-1">450 Quiz Questions</h3>
                <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">Authentic review questions and detailed rationales from Appendix C &amp; D.</p>
              </div>
            </div>
          </div>

        </div>
      </section>



      {session ? (
        <>
          {/* Cadet Mission Control Quick Jump Strip */}
          <section className="py-6 border-t border-cyan-500/20 bg-cyan-950/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold font-mono">
                  {session.user?.name ? session.user.name.slice(0, 2).toUpperCase() : "CD"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">
                      Welcome, Cadet {session.user?.name || session.user?.email}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      SESSION ACTIVE
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Authorized training cockpit ready • 49 Chapters Unlocked
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Cadet Cockpit</span>
                </Link>
                <Link
                  href="/practice-test"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition-colors flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Exam Center (450 Qs)</span>
                </Link>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION: LIVE PACKET FLIGHT & OSI ENCAPSULATION SIMULATOR                */}
          {/* ========================================================================= */}
          <section id="packet-flight" className="py-20 sm:py-24 border-t border-[var(--border)] bg-[var(--background)] relative scroll-mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-mono mb-4">
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  <span>OSI 7-LAYER PACKET FLIGHT &amp; PROTOCOL ENGINE</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--foreground)] tracking-tight">
                  Watch Bits Fly: Real-Time Packet Traversal Engine
                </h2>
                <p className="mt-4 text-[var(--foreground-muted)] text-sm sm:text-base leading-relaxed">
                  Step through ICMP Echo pings, ARP broadcasts, 802.1Q trunk encapsulations, and OSPF link-state database synchronizations. Inspect Layer 2, Layer 3, and Layer 4 headers dynamically updated at every network hop.
                </p>
              </div>

              <NetworkPacketSimulator />
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION: INTERACTIVE CCNA ENGINEERING TOOLSUITE                           */}
          {/* ========================================================================= */}
          <section className="py-20 border-t border-[var(--border)] bg-[var(--background-subtle)] relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-500 text-xs font-mono mb-3">
                  <Zap className="w-3.5 h-3.5" />
                  <span>HANDS-ON ACTIVE SKILL WORKBENCHES</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--foreground)] tracking-tight">
                  Interactive CCNA Engineering Toolsuite
                </h2>
                <p className="mt-3 text-sm text-[var(--foreground-muted)] leading-relaxed">
                  Drill exam-critical calculations, syntax configurations, and layer-1 media logic directly in your browser.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Tool 1 */}
                <Link
                  href="/dashboard?tab=subnet-drill"
                  className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-amber-500/50 transition-all hover:-translate-y-1 group shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Flame className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-base text-[var(--foreground)] mb-1.5 flex items-center justify-between">
                      <span>30s Subnet Blitz</span>
                      <ArrowRight className="w-4 h-4 text-[var(--foreground-muted)] group-hover:text-amber-500 transition-colors" />
                    </h3>
                    <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                      Rapid-fire mental math trainer for Network ID, Broadcast ID, and usable host ranges under 30-second exam pressure.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[var(--border)] text-[10px] font-mono text-amber-500 font-semibold">
                    LAUNCH TRAINER &rarr;
                  </div>
                </Link>

                {/* Tool 2 */}
                <Link
                  href="/dashboard?tab=config-gen"
                  className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-cyan-500/50 transition-all hover:-translate-y-1 group shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Sliders className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-base text-[var(--foreground)] mb-1.5 flex items-center justify-between">
                      <span>IOS Config Generator</span>
                      <ArrowRight className="w-4 h-4 text-[var(--foreground-muted)] group-hover:text-cyan-400 transition-colors" />
                    </h3>
                    <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                      Synthesize deployable Cisco IOS configurations for 802.1Q sub-interfaces, OSPF areas, ACLs, NAT Overload, and DHCP.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[var(--border)] text-[10px] font-mono text-cyan-400 font-semibold">
                    OPEN WORKBENCH &rarr;
                  </div>
                </Link>

                {/* Tool 3 */}
                <Link
                  href="/dashboard?tab=eui64"
                  className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-emerald-500/50 transition-all hover:-translate-y-1 group shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Globe className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-base text-[var(--foreground)] mb-1.5 flex items-center justify-between">
                      <span>IPv6 EUI-64 Flipper</span>
                      <ArrowRight className="w-4 h-4 text-[var(--foreground-muted)] group-hover:text-emerald-400 transition-colors" />
                    </h3>
                    <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                      Interactive bit-level visualizer demonstrating 48-bit MAC splitting, FFFE injection, and 7th-bit Universal/Local inversion.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[var(--border)] text-[10px] font-mono text-emerald-400 font-semibold">
                    EXPLORE BIT-FLIPPER &rarr;
                  </div>
                </Link>

                {/* Tool 4 */}
                <Link
                  href="/dashboard?tab=cabling"
                  className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-purple-500/50 transition-all hover:-translate-y-1 group shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Network className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-base text-[var(--foreground)] mb-1.5 flex items-center justify-between">
                      <span>Layer 1 Cabling Lab</span>
                      <ArrowRight className="w-4 h-4 text-[var(--foreground-muted)] group-hover:text-purple-400 transition-colors" />
                    </h3>
                    <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                      Interactive media matching lab for Straight-Through, Crossover, Rollover console, Serial WAN, and Fiber optics.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[var(--border)] text-[10px] font-mono text-purple-400 font-semibold">
                    ENTER CABLING LAB &rarr;
                  </div>
                </Link>
              </div>
            </div>
          </section>

          {/* The 5-Pillar Active Learning Method Section */}
          <section className="py-20 sm:py-28 border-y border-[var(--border)] bg-[var(--background-subtle)] relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--secondary-muted)] border border-emerald-500/25 text-emerald-400 text-xs font-mono mb-4">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Section 1.4: Proven CCNA Study Methodology</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--foreground)] tracking-tight">
                  The 5-Pillar Active Learning Framework
                </h2>
                <p className="mt-4 text-[var(--foreground-muted)] text-sm sm:text-base leading-relaxed">
                  &quot;Studying differs from simply reading passively. Be an active learner rather than a passive learner... Labbing is an essential part of any CCNA study plan. You have to get your hands dirty and apply what you’ve learned.&quot;
                </p>
              </div>

              {/* Row 1: First 3 Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Pillar 1 */}
                <div className="pillar-slab p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-lg bg-[var(--primary-muted)] border border-[var(--border-highlight)] text-[var(--primary)] font-mono font-bold text-lg flex items-center justify-center mb-5">
                      01
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--primary)] font-semibold mb-2">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Active Ingestion</span>
                    </div>
                    <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">
                      Complete Study Reading
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--foreground-muted)] leading-relaxed">
                      Engage deeply with all 49 chapters from Wendell Odom&apos;s CCNA Official Cert Guides (Vols 1 &amp; 2). Don&apos;t just skim—annotate and summarize.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs font-mono text-[var(--foreground-muted)]">
                    <span>Volume 1 &amp; 2 Theory</span>
                    <span className="text-[var(--primary)]">Foundation</span>
                  </div>
                </div>

                {/* Pillar 2 */}
                <div className="pillar-slab p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 font-mono font-bold text-lg flex items-center justify-center mb-5">
                      02
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-sky-400 font-semibold mb-2">
                      <Calculator className="w-3.5 h-3.5" />
                      <span>Mental Math</span>
                    </div>
                    <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">
                      Subnetting Muscle Memory
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--foreground-muted)] leading-relaxed">
                      Calculate subnets in under 30 seconds using magic numbers and binary powers. Master VLSM and CIDR prefixes without pen and paper.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs font-mono text-[var(--foreground-muted)]">
                    <span>Subnet Speed Drills</span>
                    <span className="text-sky-400">&lt;30s Target</span>
                  </div>
                </div>

                {/* Pillar 3 */}
                <div className="pillar-slab p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 font-mono font-bold text-lg flex items-center justify-center mb-5">
                      03
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-purple-400 font-semibold mb-2">
                      <Layers className="w-3.5 h-3.5" />
                      <span>Spaced Recall</span>
                    </div>
                    <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">
                      Active Recall Flashcards
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--foreground-muted)] leading-relaxed">
                      Daily spaced-repetition testing across port numbers, protocol defaults, encapsulation types, and Cisco timers to defeat the forgetting curve.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs font-mono text-[var(--foreground-muted)]">
                    <span>Spaced Repetition</span>
                    <span className="text-purple-400">Daily Drills</span>
                  </div>
                </div>
              </div>

              {/* Row 2: Final 2 Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {/* Pillar 4 */}
                <div className="pillar-slab p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold text-lg flex items-center justify-center mb-5">
                      04
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400 font-semibold mb-2">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>CLI Mastery</span>
                    </div>
                    <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">
                      Appendix B Cisco IOS Labbing
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--foreground-muted)] leading-relaxed">
                      Type every command from Appendix B inside Packet Tracer until fingers execute Cisco IOS configuration and troubleshooting commands automatically.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs font-mono text-[var(--foreground-muted)]">
                    <span>367 Cisco IOS Commands</span>
                    <span className="text-amber-400">Packet Tracer</span>
                  </div>
                </div>

                {/* Pillar 5 */}
                <div className="pillar-slab p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-lg flex items-center justify-center mb-5">
                      05
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 font-semibold mb-2">
                      <Video className="w-3.5 h-3.5" />
                      <span>Proof-of-Skill</span>
                    </div>
                    <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">
                      Video Proof &amp; Peer Accountability
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--foreground-muted)] leading-relaxed">
                      Record 2–5 minute screen captures explaining your running topology and show outputs. Teaching concepts and verifying lab results locks in mastery.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs font-mono text-[var(--foreground-muted)]">
                    <span>Google Drive Storage</span>
                    <span className="text-emerald-400">Feynman Technique</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Curriculum Explorer: Volumes, Parts, and Chapters */}
          <section id="curriculum" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-muted)] border border-[var(--border-highlight)] text-[var(--primary)] text-xs font-mono mb-3">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Full Textbook Syllabus</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--foreground)] tracking-tight">
                  The 49-Chapter CCNA Master Curriculum
                </h2>
                <p className="mt-2 text-[var(--foreground-muted)] text-sm sm:text-base max-w-2xl leading-relaxed">
                  Organized into 2 volumes and 11 distinct pedagogical parts covering all official Cisco CCNA exam domains.
                </p>
              </div>

              {/* Volume Switcher Tabs */}
              <div className="flex items-center p-1 rounded-lg bg-[var(--background-subtle)] border border-[var(--border)] shrink-0 shadow-sm">
                <button
                  onClick={() => {
                    setSelectedVolume(1);
                    setSelectedPart("all");
                  }}
                  className={`px-4 py-2 rounded-md text-xs sm:text-sm font-semibold transition-all ${
                    selectedVolume === 1
                      ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm border border-[var(--border)]"
                      : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  Volume 1: Fundamentals (24 Ch)
                </button>
                <button
                  onClick={() => {
                    setSelectedVolume(2);
                    setSelectedPart("all");
                  }}
                  className={`px-4 py-2 rounded-md text-xs sm:text-sm font-semibold transition-all ${
                    selectedVolume === 2
                      ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm border border-[var(--border)]"
                      : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  Volume 2: Advanced &amp; Security (25 Ch)
                </button>
              </div>
            </div>

            {/* Search Bar + Part Filter */}
            <div className="space-y-4 mb-10">
              <div className="relative max-w-md">
                <Search className="w-4 h-4 text-[var(--foreground-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by topic, command, or concept (e.g. OSPF, VLAN, Subnetting)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--background-subtle)] border border-[var(--border)] focus:border-[var(--primary)] text-xs text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] outline-none transition-colors"
                />
              </div>

              {currentVolumeData && !searchQuery && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  <button
                    onClick={() => setSelectedPart("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono shrink-0 transition-all font-medium border ${
                      selectedPart === "all"
                        ? "bg-[var(--primary-muted)] text-[var(--primary)] border-[var(--border-highlight)]"
                        : "bg-[var(--card)] text-[var(--foreground-muted)] border-[var(--border)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    All Parts ({allModules.filter(m => m.volume === selectedVolume).length} Ch)
                  </button>
                  {currentVolumeData.parts.map((p) => (
                    <button
                      key={p.partNumber}
                      onClick={() => setSelectedPart(p.partNumber)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono shrink-0 transition-all font-medium border ${
                        selectedPart === p.partNumber
                          ? "bg-[var(--primary-muted)] text-[var(--primary)] border-[var(--border-highlight)]"
                          : "bg-[var(--card)] text-[var(--foreground-muted)] border-[var(--border)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      Part {p.partNumber}: {p.partTitle}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Module Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedModules.map((module) => (
                <div
                  key={module.id}
                  className="group relative p-6 rounded-xl noc-surface noc-surface-interactive flex flex-col justify-between shadow-sm"
                >
                  <div>
                    {/* Header info */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="telemetry-badge telemetry-badge-cyan">
                        Vol {module.volume} • Part {module.partNumber}
                      </span>
                      <span className="text-[11px] font-mono text-[var(--foreground-muted)]">
                        {module.readTime}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors mb-2 leading-snug">
                      {module.title}
                    </h3>
                    <p className="text-xs text-[var(--foreground-muted)] line-clamp-2 leading-relaxed mb-5">
                      {module.description}
                    </p>

                    {/* Badges for commands and quiz */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-6">
                      {module.ciscoCommands.length > 0 && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-[var(--background-subtle)] text-[var(--foreground-muted)] border border-[var(--border)]">
                          <Terminal className="w-3 h-3 text-[var(--primary)]" />
                          {module.ciscoCommands.length} CLI cmds
                        </span>
                      )}
                      {module.quiz.length > 0 && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-[var(--background-subtle)] text-[var(--foreground-muted)] border border-[var(--border)]">
                          <HelpCircle className="w-3 h-3 text-emerald-400" />
                          {module.quiz.length} Quiz Qs
                        </span>
                      )}
                      {module.diagrams.length > 0 && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-[var(--background-subtle)] text-[var(--foreground-muted)] border border-[var(--border)]">
                          <Layers className="w-3 h-3 text-purple-400" />
                          {module.diagrams.length} Diagrams
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
                    <Link
                      href={`/modules/${module.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[var(--primary)] hover:bg-[var(--primary-muted)] border border-[var(--border)] hover:border-[var(--border-highlight)] transition-all"
                    >
                      <span>Study Chapter</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>

                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/modules/${module.id}/quiz`}
                        title="Take Chapter Quiz"
                        className="p-1.5 rounded-lg bg-[var(--background-subtle)] hover:bg-emerald-500/15 hover:text-emerald-400 text-[var(--foreground-muted)] transition-colors border border-[var(--border)]"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/modules/${module.id}/submit-video`}
                        title="Submit Lab Video"
                        className="p-1.5 rounded-lg bg-[var(--background-subtle)] hover:bg-purple-500/15 hover:text-purple-400 text-[var(--foreground-muted)] transition-colors border border-[var(--border)]"
                      >
                        <Video className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        /* ========================================================================= */
        /* INDUSTRIAL ENTERPRISE CURRICULUM SYLLABUS & CLEARANCE GATE               */
        /* ========================================================================= */
        <section id="curriculum" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[var(--border)] relative scroll-mt-16">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-mono mb-4">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>OFFICIAL CISCO CCNA 200-301 v1.1 BLUEPRINT MATRIX</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--foreground)] tracking-tight">
              49-Chapter Master Curriculum Syllabus
            </h2>
            <p className="mt-4 text-[var(--foreground-muted)] text-sm sm:text-base leading-relaxed">
              Engineered according to Wendell Odom&apos;s CCNA 200-301 Official Cert Guides (Volumes 1 &amp; 2). All 11 pedagogical parts covering 100% of the Cisco CCNA exam blueprint.
            </p>
          </div>

          {/* Central High-Tech Clearance Prompt Card */}
          <div className="mb-14 rounded-3xl bg-[var(--card)] dark:bg-gradient-to-b dark:from-slate-900/90 dark:to-slate-950/90 border border-cyan-500/30 p-8 sm:p-10 backdrop-blur-xl shadow-xl relative overflow-hidden text-center max-w-4xl mx-auto">
            {/* Ambient Cyber Grid Accent */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-xs font-mono mb-6">
              <Lock className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span>RESTRICTED PROTOCOL • CADET CLEARANCE REQUIRED</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-3">
              Cadet Sign-In Required to Unlock Full Blueprints
            </h3>

            <p className="text-sm text-[var(--foreground-muted)] max-w-2xl mx-auto leading-relaxed mb-8">
              Full chapter study notes, syntax-highlighted Cisco IOS command emulators, 450 authentic exam questions with simlets, and Google Drive video lab submission pipelines are protected under standard Cisco Academy protocols.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-8">
              <button
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 text-slate-950 font-extrabold text-sm hover:brightness-110 transition-all shadow-xl shadow-cyan-500/25 group"
              >
                <GoogleIcon className="w-4 h-4" />
                <span>Sign In with Google Account</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => setIsSubnetOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[var(--background-subtle)] hover:bg-[var(--card-hover)] border border-[var(--border)] text-[var(--foreground)] text-xs font-mono transition-all"
              >
                <Calculator className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                <span>Try 32-Bit Subnet Drill (Public Preview)</span>
              </button>
            </div>

            {/* Unlocked Features Badge Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-[var(--border)] text-left font-mono">
              <div className="p-3 rounded-xl bg-[var(--background-subtle)] border border-[var(--border)]">
                <div className="text-[10px] text-[var(--foreground-muted)] uppercase">Curriculum</div>
                <div className="text-xs font-bold text-cyan-600 dark:text-cyan-300 mt-0.5">49 Chapters</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--background-subtle)] border border-[var(--border)]">
                <div className="text-[10px] text-[var(--foreground-muted)] uppercase">Interactive CLI</div>
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-300 mt-0.5">367 Commands</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--background-subtle)] border border-[var(--border)]">
                <div className="text-[10px] text-[var(--foreground-muted)] uppercase">Exam Simulator</div>
                <div className="text-xs font-bold text-amber-600 dark:text-amber-300 mt-0.5">450 Questions</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--background-subtle)] border border-[var(--border)]">
                <div className="text-[10px] text-[var(--foreground-muted)] uppercase">Video Verification</div>
                <div className="text-xs font-bold text-purple-600 dark:text-purple-300 mt-0.5">5TB Cloud Pipeline</div>
              </div>
            </div>
          </div>

          {/* Syllabus Volume & Part Architecture Matrix (Preview) */}
          <div className="space-y-8">
            {curriculum.volumes.map((vol) => (
              <div key={vol.volumeNumber} className="rounded-2xl noc-surface border border-[var(--border)] p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[var(--border)]">
                  <div>
                    <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                      Volume {vol.volumeNumber}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mt-0.5">
                      {vol.title}
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono bg-[var(--background-subtle)] text-[var(--foreground-muted)] border border-[var(--border)]">
                    {vol.volumeNumber === 1 ? "Chapters 1–24 (Fundamentals)" : "Chapters 25–49 (Advanced & Security)"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {vol.parts.map((part) => {
                    const partModules = allModules.filter(
                      (m) => m.volume === vol.volumeNumber && m.partNumber === part.partNumber
                    );
                    const chStart = partModules[0]?.chapterNumber;
                    const chEnd = partModules[partModules.length - 1]?.chapterNumber;

                    return (
                      <div
                        key={part.partNumber}
                        className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs font-mono text-[var(--foreground-muted)] mb-2">
                            <span>Part {part.partNumber}</span>
                            <span className="flex items-center gap-1 text-[11px] text-amber-400">
                              <Lock className="w-3 h-3" />
                              <span>Sign-In Required</span>
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-[var(--foreground)] mb-2">
                            {part.partTitle}
                          </h4>
                          <p className="text-xs text-[var(--foreground-muted)] font-mono">
                            {partModules.length} Chapters {chStart && chEnd ? `(Ch ${chStart}–${chEnd})` : ""}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between">
                          <button
                            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group font-mono"
                          >
                            <span>Authenticate to unlock</span>
                            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Architect & Lead Developer Profile Section */}
      <section className="py-20 sm:py-28 border-t border-[var(--border)] bg-[var(--background-subtle)] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-xl noc-surface shadow-lg">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              
              {/* Left Column: Avatar & Bio */}
              <div className="flex-1 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-muted)] border border-[var(--border-highlight)] text-[var(--primary)] text-xs font-mono">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Platform Architect &amp; Developer</span>
                </div>

                <div className="flex items-center gap-4 pt-1">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--primary)] via-[var(--cobalt)] to-[var(--secondary)] p-0.5 shrink-0 shadow-md">
                    <div className="w-full h-full bg-[var(--card)] rounded-[10px] flex items-center justify-center text-xl font-bold text-[var(--foreground)] font-mono">
                      YH
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">
                      Md. Yousuf Hossain
                    </h2>
                    <p className="text-xs font-mono text-[var(--primary)] mt-0.5">
                      @assassinyousuf • Cybersecurity Researcher &amp; Developer
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[var(--foreground-muted)] max-w-2xl leading-relaxed">
                  Computer Science &amp; Engineering undergraduate at Dhaka International University. Specializing in zero-trust network architectures, AI security systems, and interactive educational engineering. Engineered this CCNA Mastery Platform with live Cisco IOS CLI terminal simulation, 3D active recall flashcards, 32-bit IPv4 subnet visualizer, and cohort video verification.
                </p>

                {/* Badges / Highlights */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="telemetry-badge">
                    <GraduationCap className="w-3.5 h-3.5 text-[var(--primary)]" />
                    Dhaka International University (CSE)
                  </span>
                  <span className="telemetry-badge">
                    <Award className="w-3.5 h-3.5 text-emerald-400" />
                    General Secretary, DIU CPC
                  </span>
                  <span className="telemetry-badge">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                    Published Researcher (Taylor &amp; Francis)
                  </span>
                </div>
              </div>

              {/* Right Column: Interactive Profile & Repository Links */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
                <a
                  href="https://yousuf.surf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-xs text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90 transition-opacity shadow-sm"
                >
                  <Globe className="w-4 h-4" />
                  <span>Visit Portfolio (yousuf.surf)</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>

                <a
                  href="https://github.com/assassinyousuf/ccna-learning-platform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-medium text-xs text-[var(--foreground)] bg-[var(--card)] hover:bg-[var(--card-hover)] border border-[var(--border)] transition-colors shadow-sm"
                >
                  <Github className="w-4 h-4 text-[var(--primary)]" />
                  <span>GitHub Repository</span>
                </a>

                <div className="flex items-center justify-center gap-2">
                  <a
                    href="https://github.com/assassinyousuf"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="GitHub Profile"
                    className="p-2.5 rounded-lg bg-[var(--card)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] border border-[var(--border)] transition-colors flex-1 flex justify-center"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/mdyousufhossainmehrab/"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="LinkedIn Profile"
                    className="p-2.5 rounded-lg bg-[var(--card)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] border border-[var(--border)] transition-colors flex-1 flex justify-center"
                  >
                    <Linkedin className="w-4 h-4 text-[var(--primary)]" />
                  </a>
                  <a
                    href="mailto:itsmemehrab369@gmail.com"
                    title="Send Email"
                    className="p-2.5 rounded-lg bg-[var(--card)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] border border-[var(--border)] transition-colors flex-1 flex justify-center"
                  >
                    <Mail className="w-4 h-4 text-emerald-400" />
                  </a>
                  <a
                    href="https://www.yousuf.surf/Md__Yousuf_Hossain_CV.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Download CV"
                    className="p-2.5 rounded-lg bg-[var(--card)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] border border-[var(--border)] transition-colors flex-1 flex justify-center"
                  >
                    <FileText className="w-4 h-4 text-amber-400" />
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Packet Tracer Lab Download Banner */}
      <section className="py-12 bg-[var(--background-subtle)] border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[var(--primary-muted)] border border-[var(--border-highlight)] text-[var(--primary)] text-xs font-mono mb-2">
              <Laptop className="w-3.5 h-3.5" />
              <span>Official Cisco Tooling</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">
              Get Cisco Packet Tracer for Free
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-[var(--foreground-muted)] leading-relaxed">
              Packet Tracer is lightweight, free, and supports all CCNA commands and topologies. Complete every lab mission in this course with hands-on practice.
            </p>
          </div>

          <a
            href="http://mng.bz/2Kra"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-xs sm:text-sm text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90 transition-opacity shadow-sm shrink-0"
          >
            <span>Download Cisco Packet Tracer</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Subnet Calculator Interactive Modal */}
      <SubnetCalculatorModal
        isOpen={isSubnetOpen}
        onClose={() => setIsSubnetOpen(false)}
      />
    </div>
  );
}
