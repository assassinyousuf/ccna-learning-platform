"use client";

import React, { useState, useEffect } from "react";
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
  ShieldAlert,
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
  Laptop,
  Github,
  Globe,
  Linkedin,
  Mail,
  Code2,
  GraduationCap,
  Calculator
} from "lucide-react";

export default function HomePage() {
  const { data: session } = useSession();
  const allModules = getAllModules();
  const [selectedVolume, setSelectedVolume] = useState<1 | 2>(1);
  const [selectedPart, setSelectedPart] = useState<number | "all">("all");
  const [authError, setAuthError] = useState<string | null>(null);

  // Hero interactive Cisco demonstration state
  const [heroTab, setHeroTab] = useState<"terminal" | "topology" | "ospf">("terminal");
  const [activeCmd, setActiveCmd] = useState<"mac" | "brief" | "route">("mac");

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
      <section className="relative pt-24 pb-28 lg:pt-36 lg:pb-36 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs sm:text-sm font-mono mb-8 glow-cyan shadow-sm">
          <Sparkles className="w-4 h-4" />
          <span>Complete Interactive CCNA (200-301) Learning Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.12]">
          Master the CCNA with{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
            Active Hands-On Recall
          </span>
        </h1>

        <p className="mt-8 text-base sm:text-xl text-slate-300/90 max-w-3xl mx-auto leading-relaxed">
          The all-in-one interactive platform engineered by <span className="text-white font-semibold">Md. Yousuf Hossain</span> for complete CCNA 200-301 certification mastery. Study 49 comprehensive chapters, execute 367 live Cisco IOS CLI commands, solve 414 technical review questions, and build real muscle memory.
        </p>

        {/* Auth Error Banner */}
        {authError && (
          <div className="mt-10 max-w-xl mx-auto p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm flex flex-col items-center gap-3 backdrop-blur-md shadow-xl">
            <div className="flex items-center gap-2 font-semibold text-amber-400 text-base">
              <ShieldAlert className="w-5 h-5" />
              <span>OAuth Notice: {authError === "OAuthCallback" ? "Google Callback Verification Failed" : authError}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-center">
              Google sign-in was interrupted. You can retry with Google below, or click Instant Student Access to immediately explore all modules and the exam simulator.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
              <button
                onClick={() => signIn("demo-student", { callbackUrl: "/dashboard" })}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs hover:opacity-95 transition-opacity shadow-md"
              >
                Continue with Instant Demo Student
              </button>
              <button
                onClick={() => {
                  setAuthError(null);
                  window.history.replaceState({}, "", "/");
                  signIn("google", { callbackUrl: "/dashboard" });
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-200 font-medium text-xs border border-slate-700 hover:bg-slate-750 transition-colors"
              >
                Retry Google Sign-In
              </button>
            </div>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {session ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:opacity-95 transition-all glow-cyan text-sm sm:text-base shadow-xl hover:-translate-y-0.5"
            >
              <span>Go to Student Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" }).catch(() => signIn("demo-student"))}
              className="flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:opacity-95 transition-all glow-cyan text-sm sm:text-base shadow-xl hover:-translate-y-0.5"
            >
              <span>Start Learning Free with Google</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <Link
            href="#curriculum"
            className="flex items-center gap-2.5 px-8 py-4 rounded-2xl font-semibold text-slate-200 bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 hover:text-white transition-all text-sm sm:text-base shadow-lg hover:-translate-y-0.5"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Explore 49 Chapters ({allModules.length} Modules)</span>
          </Link>
        </div>

        {/* ========================================================================= */}
        {/* HERO FLAGSHIP DEMO: LIVE CISCO IOS WORKSTATION & TOPOLOGY ENGINE         */}
        {/* ========================================================================= */}
        <div className="mt-16 max-w-5xl mx-auto rounded-3xl bg-[#060a14] border border-cyan-500/30 shadow-2xl shadow-cyan-950/40 overflow-hidden text-left relative group">
          {/* Top Bezel / Header */}
          <div className="px-6 py-3.5 bg-[#091124] border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="text-xs font-mono text-slate-400 pl-2 border-l border-slate-800">
                cisco-catalyst-2960-console (tty0) • 9600 8-N-1
              </span>
            </div>

            {/* Interactive View Switcher Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setHeroTab("terminal")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  heroTab === "terminal"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>IOS Terminal</span>
              </button>
              <button
                onClick={() => setHeroTab("topology")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  heroTab === "topology"
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Network className="w-3.5 h-3.5 text-purple-400" />
                <span>Live Topology</span>
              </button>
              <button
                onClick={() => setHeroTab("ospf")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  heroTab === "ospf"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                <span>OSPF Convergence</span>
              </button>
            </div>
          </div>

          {/* TAB 1: Live Interactive Cisco CLI */}
          {heroTab === "terminal" && (
            <div className="p-6 sm:p-8 font-mono text-xs sm:text-sm bg-[#040711]">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800/80 text-xs">
                <span className="text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  <span>Click a command below to execute simulated IOS syntax:</span>
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setActiveCmd("mac")}
                    className={`px-3 py-1.5 rounded-lg border text-xs transition-all ${
                      activeCmd === "mac"
                        ? "bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-md shadow-cyan-500/20"
                        : "bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:border-slate-600"
                    }`}
                  >
                    show mac address-table
                  </button>
                  <button
                    onClick={() => setActiveCmd("brief")}
                    className={`px-3 py-1.5 rounded-lg border text-xs transition-all ${
                      activeCmd === "brief"
                        ? "bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-md shadow-cyan-500/20"
                        : "bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:border-slate-600"
                    }`}
                  >
                    show ip interface brief
                  </button>
                  <button
                    onClick={() => setActiveCmd("route")}
                    className={`px-3 py-1.5 rounded-lg border text-xs transition-all ${
                      activeCmd === "route"
                        ? "bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-md shadow-cyan-500/20"
                        : "bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:border-slate-600"
                    }`}
                  >
                    show ip route
                  </button>
                </div>
              </div>

              {/* Terminal Screen Output */}
              <div className="space-y-3 min-h-[220px] text-slate-300 leading-relaxed overflow-x-auto">
                {activeCmd === "mac" && (
                  <div className="space-y-1 text-slate-300">
                    <p className="text-cyan-400 font-bold">SW1# show mac address-table</p>
                    <p className="text-slate-500">          Mac Address Table</p>
                    <p className="text-slate-500">-------------------------------------------</p>
                    <p className="text-slate-400 font-semibold">Vlan    Mac Address       Type        Ports</p>
                    <p className="text-slate-400 font-semibold">----    -----------       --------    -----</p>
                    <p><span className="text-amber-400">  10</span>    0014.a82b.4711    <span className="text-emerald-400">DYNAMIC</span>     <span className="text-cyan-300">Fa0/1</span></p>
                    <p><span className="text-amber-400">  10</span>    0014.a82b.4712    <span className="text-emerald-400">DYNAMIC</span>     <span className="text-cyan-300">Fa0/2</span></p>
                    <p><span className="text-purple-400">  20</span>    0050.56a1.c001    <span className="text-emerald-400">DYNAMIC</span>     <span className="text-cyan-300">Fa0/3</span></p>
                    <p><span className="text-slate-400">   1</span>    0019.06ea.3980    <span className="text-cyan-400">STATIC</span>      <span className="text-white">CPU</span></p>
                    <p><span className="text-slate-400"> All</span>    0100.0ccc.cccc    <span className="text-cyan-400">STATIC</span>      <span className="text-white">CPU (CDP)</span></p>
                    <p className="pt-2 text-cyan-400 font-bold">SW1# <span className="animate-pulse inline-block w-2 h-4 bg-cyan-400 align-middle ml-1" /></p>
                  </div>
                )}

                {activeCmd === "brief" && (
                  <div className="space-y-1 text-slate-300">
                    <p className="text-cyan-400 font-bold">R1# show ip interface brief</p>
                    <p className="text-slate-400 font-semibold">Interface              IP-Address      OK? Method Status                Protocol</p>
                    <p><span className="text-cyan-300 font-bold">GigabitEthernet0/0/0</span>   <span className="text-amber-300">192.168.1.1</span>     YES NVRAM  <span className="text-emerald-400 font-bold">up</span>                    <span className="text-emerald-400 font-bold">up</span></p>
                    <p><span className="text-cyan-300 font-bold">GigabitEthernet0/0/1</span>   <span className="text-amber-300">10.0.12.1</span>       YES manual <span className="text-emerald-400 font-bold">up</span>                    <span className="text-emerald-400 font-bold">up</span></p>
                    <p><span className="text-slate-400">GigabitEthernet0/0/2</span>   unassigned      YES unset  <span className="text-red-400 font-semibold">administratively down</span> <span className="text-red-400 font-semibold">down</span></p>
                    <p><span className="text-purple-300 font-bold">Loopback0</span>              <span className="text-amber-300">1.1.1.1</span>         YES manual <span className="text-emerald-400 font-bold">up</span>                    <span className="text-emerald-400 font-bold">up</span></p>
                    <p className="pt-2 text-cyan-400 font-bold">R1# <span className="animate-pulse inline-block w-2 h-4 bg-cyan-400 align-middle ml-1" /></p>
                  </div>
                )}

                {activeCmd === "route" && (
                  <div className="space-y-1 text-slate-300">
                    <p className="text-cyan-400 font-bold">R1# show ip route</p>
                    <p className="text-slate-500">Codes: C - connected, S - static, O - OSPF, IA - OSPF inter area, * - candidate default</p>
                    <p className="text-slate-300 font-semibold pt-1">Gateway of last resort is 10.0.12.2 to network 0.0.0.0</p>
                    <p><span className="text-emerald-400 font-bold">C</span>     192.168.1.0/24 is directly connected, <span className="text-cyan-300">GigabitEthernet0/0/0</span></p>
                    <p><span className="text-emerald-400 font-bold">C</span>     10.0.12.0/30 is directly connected, <span className="text-cyan-300">GigabitEthernet0/0/1</span></p>
                    <p><span className="text-purple-400 font-bold">O</span>     <span className="text-amber-300">172.16.0.0/16</span> [110/2] via 10.0.12.2, 00:14:22, <span className="text-cyan-300">GigabitEthernet0/0/1</span></p>
                    <p><span className="text-amber-400 font-bold">S*</span>    0.0.0.0/0 [1/0] via 10.0.12.2</p>
                    <p className="pt-2 text-cyan-400 font-bold">R1# <span className="animate-pulse inline-block w-2 h-4 bg-cyan-400 align-middle ml-1" /></p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Live Topology Preview */}
          {heroTab === "topology" && (
            <div className="p-8 bg-[#040711] font-mono">
              <div className="flex items-center justify-between mb-6 text-xs text-slate-400">
                <span className="text-purple-400 font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                  Active 802.1Q Trunk Topology • Catalyst 2960 &amp; ISR 4331
                </span>
                <span className="text-emerald-400 font-semibold">Links: UP / UP (1000BASE-T)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center text-center">
                {/* Host A */}
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center mb-3">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-xs sm:text-sm">PC-A (Host)</h4>
                  <p className="text-[11px] text-cyan-300 font-mono mt-1">192.168.10.50/24</p>
                  <p className="text-[10px] text-slate-500 mt-1">MAC: 0014.a82b.4711</p>
                  <span className="inline-block mt-3 px-2 py-0.5 rounded-full text-[10px] bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold">
                    VLAN 10 Access
                  </span>
                </div>

                {/* Switch 1 */}
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-purple-500/40 shadow-md relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-[10px] text-purple-300 font-bold">
                    802.1Q TRUNK
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mx-auto flex items-center justify-center mb-3">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-xs sm:text-sm">SW1 (Catalyst 2960)</h4>
                  <p className="text-[11px] text-purple-300 font-mono mt-1">VLAN 10, 20, 99</p>
                  <p className="text-[10px] text-slate-500 mt-1">Port Gi0/1 (Trunk Native 99)</p>
                  <span className="inline-block mt-3 px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold">
                    STP Root Bridge
                  </span>
                </div>

                {/* Router 1 */}
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-3">
                    <Network className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-xs sm:text-sm">R1 (Cisco ISR 4331)</h4>
                  <p className="text-[11px] text-emerald-300 font-mono mt-1">Router-on-a-Stick</p>
                  <p className="text-[10px] text-slate-500 mt-1">Sub-ifs: Gi0/0.10, Gi0/0.20</p>
                  <span className="inline-block mt-3 px-2 py-0.5 rounded-full text-[10px] bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold">
                    Default Gateway
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: OSPF Convergence */}
          {heroTab === "ospf" && (
            <div className="p-8 bg-[#040711] font-mono text-xs text-slate-300 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-emerald-400 font-bold flex items-center gap-2">
                  <Cpu className="w-4 h-4" />
                  <span>OSPFv2 Process ID 1 • Router ID: 1.1.1.1 • Area 0 (Backbone)</span>
                </span>
                <span className="text-cyan-400 font-semibold">State: CONVERGED</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <h5 className="text-slate-400 font-semibold mb-2">Neighbor Adjacency Table:</h5>
                  <p className="text-slate-300">Neighbor ID: <span className="text-cyan-300">2.2.2.2</span></p>
                  <p className="text-slate-300">Priority: 1, State: <span className="text-emerald-400 font-bold">FULL/DR</span></p>
                  <p className="text-slate-300">Dead Time: <span className="text-amber-300">00:00:36</span></p>
                  <p className="text-slate-300">Address: <span className="text-slate-400">10.0.12.2 (Gi0/0/1)</span></p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <h5 className="text-slate-400 font-semibold mb-2">Shortest Path First (Dijkstra) Metric:</h5>
                  <p className="text-slate-300">Reference Bandwidth: <span className="text-cyan-300">1000 Mbps</span></p>
                  <p className="text-slate-300">Gigabit Link Cost: <span className="text-emerald-400">1</span></p>
                  <p className="text-slate-300">FastEthernet Link Cost: <span className="text-amber-300">10</span></p>
                  <p className="text-slate-300">Serial T1 (1.544M) Cost: <span className="text-red-400">64</span></p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Spacious Infrastructure Highlights */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto text-left">
          <div className="p-6 rounded-2xl glass-panel glass-panel-hover flex flex-col justify-between">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white mb-1">5TB Cloud Storage</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Direct streaming video lab uploads bypassing serverless payload limits.</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-panel glass-panel-hover flex flex-col justify-between">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white mb-1">Google Sheets DB</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Live cohort gradebook &amp; milestone progression synchronization.</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-panel glass-panel-hover flex flex-col justify-between">
            <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white mb-1">367 CLI Commands</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Interactive terminal emulator with exact Cisco IOS syntax from Appendix B.</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-panel glass-panel-hover flex flex-col justify-between">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white mb-1">414 Quiz Questions</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Authentic review questions and detailed rationales from Appendix C &amp; D.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The 5-Pillar Active Learning Method Section (Decramped Balanced Grid) */}
      <section className="py-24 sm:py-32 border-y border-slate-800/80 bg-slate-900/30 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-mono mb-5 shadow-sm">
              <Compass className="w-4 h-4" />
              <span>Section 1.4: Proven CCNA Study Methodology</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              The 5-Pillar Active Learning Framework
            </h2>
            <p className="mt-6 text-slate-300/90 text-base sm:text-lg leading-relaxed">
              &quot;Studying differs from simply reading passively. Be an active learner rather than a passive learner... Labbing is an essential part of any CCNA study plan. You have to get your hands dirty and apply what you’ve learned.&quot;
            </p>
          </div>

          {/* Row 1: First 3 Pillars (Distinct Colored Slabs) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Pillar 1 */}
            <div className="relative p-8 sm:p-10 rounded-3xl pillar-slab-1 flex flex-col justify-between group shadow-xl hover:-translate-y-1 transition-all">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono font-black text-xl flex items-center justify-center mb-6 shadow-md">
                  01
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold mb-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Pillar 01 • Active Ingestion</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 leading-snug">
                  Complete Study Reading
                </h3>
                <p className="text-sm text-slate-300/80 leading-relaxed">
                  Engage deeply with all 49 chapters from Wendell Odom&apos;s CCNA Official Cert Guides (Vols 1 &amp; 2). Don&apos;t just skim—annotate and summarize.
                </p>
              </div>
              <div className="mt-8 pt-5 border-t border-cyan-500/20 flex items-center justify-between text-xs font-mono text-cyan-400 font-semibold">
                <span>Volume 1 &amp; 2 Theory</span>
                <span className="text-slate-500">Foundation</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="relative p-8 sm:p-10 rounded-3xl pillar-slab-2 flex flex-col justify-between group shadow-xl hover:-translate-y-1 transition-all">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-sky-500/15 border border-sky-500/30 text-sky-300 font-mono font-black text-xl flex items-center justify-center mb-6 shadow-md">
                  02
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-sky-400 font-bold mb-2">
                  <Calculator className="w-4 h-4" />
                  <span>Pillar 02 • Mental Math</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 leading-snug">
                  Subnetting Muscle Memory
                </h3>
                <p className="text-sm text-slate-300/80 leading-relaxed">
                  Calculate subnets in under 30 seconds using magic numbers and binary powers. Master VLSM and CIDR prefixes without pen and paper.
                </p>
              </div>
              <div className="mt-8 pt-5 border-t border-sky-500/20 flex items-center justify-between text-xs font-mono text-sky-400 font-semibold">
                <span>Subnet Speed Drills</span>
                <span className="text-slate-500">&lt;30s Target</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="relative p-8 sm:p-10 rounded-3xl pillar-slab-3 flex flex-col justify-between group shadow-xl hover:-translate-y-1 transition-all">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-300 font-mono font-black text-xl flex items-center justify-center mb-6 shadow-md">
                  03
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold mb-2">
                  <Layers className="w-4 h-4" />
                  <span>Pillar 03 • Spaced Recall</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 leading-snug">
                  Active Recall Flashcards
                </h3>
                <p className="text-sm text-slate-300/80 leading-relaxed">
                  Daily spaced-repetition testing across port numbers, protocol defaults, encapsulation types, and Cisco timers to defeat the forgetting curve.
                </p>
              </div>
              <div className="mt-8 pt-5 border-t border-purple-500/20 flex items-center justify-between text-xs font-mono text-purple-400 font-semibold">
                <span>Spaced Repetition</span>
                <span className="text-slate-500">Daily Drills</span>
              </div>
            </div>
          </div>

          {/* Row 2: Final 2 Pillars (Amber & Emerald Slabs) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Pillar 4 */}
            <div className="relative p-8 sm:p-10 rounded-3xl pillar-slab-4 flex flex-col justify-between group shadow-xl hover:-translate-y-1 transition-all">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono font-black text-xl flex items-center justify-center mb-6 shadow-md">
                  04
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold mb-2">
                  <Terminal className="w-4 h-4" />
                  <span>Pillar 04 • CLI Mastery</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 leading-snug">
                  Appendix B Cisco IOS Labbing
                </h3>
                <p className="text-sm text-slate-300/80 leading-relaxed">
                  Type every command from Appendix B inside Packet Tracer until fingers execute Cisco IOS configuration and troubleshooting commands automatically.
                </p>
              </div>
              <div className="mt-8 pt-5 border-t border-amber-500/20 flex items-center justify-between text-xs font-mono text-amber-400 font-semibold">
                <span>367 Cisco IOS Commands</span>
                <span className="text-slate-500">Packet Tracer</span>
              </div>
            </div>

            {/* Pillar 5 */}
            <div className="relative p-8 sm:p-10 rounded-3xl pillar-slab-5 flex flex-col justify-between group shadow-xl hover:-translate-y-1 transition-all">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono font-black text-xl flex items-center justify-center mb-6 shadow-md">
                  05
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold mb-2">
                  <Video className="w-4 h-4" />
                  <span>Pillar 05 • Proof-of-Skill</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 leading-snug">
                  Video Proof &amp; Peer Accountability
                </h3>
                <p className="text-sm text-slate-300/80 leading-relaxed">
                  Record 2–5 minute screen captures explaining your running topology and show outputs. Teaching concepts and verifying lab results locks in mastery.
                </p>
              </div>
              <div className="mt-8 pt-5 border-t border-emerald-500/20 flex items-center justify-between text-xs font-mono text-emerald-400 font-semibold">
                <span>Google Drive Storage</span>
                <span className="text-slate-500">Feynman Technique</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Explorer: Volumes, Parts, and Chapters */}
      <section id="curriculum" className="py-24 sm:py-32 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs sm:text-sm font-mono mb-4 shadow-sm">
              <Layers className="w-4 h-4" />
              <span>Full Textbook Syllabus</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              The 49-Chapter CCNA Master Curriculum
            </h2>
            <p className="mt-3 text-slate-400 text-base sm:text-lg max-w-2xl leading-relaxed">
              Organized into 2 comprehensive volumes and 11 distinct pedagogical parts covering all official Cisco CCNA exam domains.
            </p>
          </div>

          {/* Volume Switcher Tabs */}
          <div className="flex items-center p-2 rounded-2xl bg-slate-900 border border-slate-800 shrink-0 shadow-lg">
            <button
              onClick={() => {
                setSelectedVolume(1);
                setSelectedPart("all");
              }}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedVolume === 1
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md glow-cyan"
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
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedVolume === 2
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md glow-emerald"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Volume 2: Advanced &amp; Security (25 Ch)
            </button>
          </div>
        </div>

        {/* Part Filter Bar with Comfortable Padding & Scroll */}
        {currentVolumeData && (
          <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-12 scrollbar-none">
            <button
              onClick={() => setSelectedPart("all")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-mono shrink-0 transition-all font-medium ${
                selectedPart === "all"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                  : "bg-slate-900/90 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700"
              }`}
            >
              All Parts ({displayedModules.length} Chapters)
            </button>
            {currentVolumeData.parts.map((p) => (
              <button
                key={p.partNumber}
                onClick={() => setSelectedPart(p.partNumber)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-mono shrink-0 transition-all font-medium ${
                  selectedPart === p.partNumber
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                    : "bg-slate-900/90 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700"
                }`}
              >
                Part {p.partNumber}: {p.partTitle}
              </button>
            ))}
          </div>
        )}

        {/* Module Cards Grid with Spacious Padding */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedModules.map((module) => (
            <div
              key={module.id}
              className="group relative p-7 sm:p-8 rounded-3xl glass-panel glass-panel-hover flex flex-col justify-between shadow-xl"
            >
              <div>
                {/* Header info */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
                    Vol {module.volume} • Part {module.partNumber}
                  </span>
                  <span className="text-xs font-mono text-slate-500 font-medium">
                    {module.readTime}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-3 leading-snug">
                  {module.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed mb-6">
                  {module.description}
                </p>

                {/* Badges for commands and quiz */}
                <div className="flex flex-wrap items-center gap-2 mb-8">
                  {module.ciscoCommands.length > 0 && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-750">
                      <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                      {module.ciscoCommands.length} CLI cmds
                    </span>
                  )}
                  {module.quiz.length > 0 && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-750">
                      <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                      {module.quiz.length} Quiz Qs
                    </span>
                  )}
                  {module.diagrams.length > 0 && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-750">
                      <Layers className="w-3.5 h-3.5 text-purple-400" />
                      {module.diagrams.length} Diagrams
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-5 border-t border-slate-800/80 flex items-center justify-between">
                <Link
                  href={`/modules/${module.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-cyan-400 hover:text-white hover:bg-cyan-500/10 border border-cyan-500/20 transition-all"
                >
                  <span>Study Chapter</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/modules/${module.id}/quiz`}
                    title="Take Chapter Quiz"
                    className="p-2.5 rounded-xl bg-slate-800/90 hover:bg-emerald-500/20 hover:text-emerald-300 text-slate-400 transition-colors border border-slate-750"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/modules/${module.id}/submit-video`}
                    title="Submit Lab Video"
                    className="p-2.5 rounded-xl bg-slate-800/90 hover:bg-purple-500/20 hover:text-purple-300 text-slate-400 transition-colors border border-slate-750"
                  >
                    <Video className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Architect & Lead Developer Profile Section */}
      <section className="py-24 sm:py-32 border-t border-slate-800/80 bg-slate-900/40 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="p-10 sm:p-14 lg:p-16 rounded-3xl glass-panel shadow-2xl">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
              
              {/* Left Column: Avatar & Bio */}
              <div className="flex-1 space-y-5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Platform Architect &amp; Developer</span>
                </div>

                <div className="flex items-center gap-5 pt-1">
                  <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-cyan-400 via-emerald-400 to-teal-500 p-0.5 glow-cyan shrink-0 shadow-lg">
                    <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-emerald-400 font-mono">
                      YH
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                      Md. Yousuf Hossain
                    </h2>
                    <p className="text-sm font-mono text-cyan-400 mt-0.5">
                      @assassinyousuf • Cybersecurity Researcher &amp; Developer
                    </p>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                  Computer Science &amp; Engineering undergraduate at Dhaka International University. Specializing in zero-trust network architectures, AI security systems, and interactive educational engineering. Engineered this CCNA Mastery Platform with live Cisco IOS CLI terminal simulation, 3D active recall flashcards, 32-bit IPv4 subnet visualizer, and cohort video verification.
                </p>

                {/* Badges / Highlights */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/90 border border-slate-750 text-xs sm:text-sm text-slate-300 font-mono">
                    <GraduationCap className="w-4 h-4 text-cyan-400" />
                    Dhaka International University (CSE)
                  </span>
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/90 border border-slate-750 text-xs sm:text-sm text-slate-300 font-mono">
                    <Award className="w-4 h-4 text-emerald-400" />
                    General Secretary, DIU CPC
                  </span>
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/90 border border-slate-750 text-xs sm:text-sm text-slate-300 font-mono">
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                    Published Security Researcher (Taylor &amp; Francis)
                  </span>
                </div>
              </div>

              {/* Right Column: Interactive Profile & Repository Links */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-4 w-full lg:w-auto shrink-0">
                <a
                  href="https://yousuf.surf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:opacity-95 transition-opacity glow-cyan text-xs sm:text-sm shadow-lg"
                >
                  <Globe className="w-4 h-4" />
                  <span>Visit Portfolio (yousuf.surf)</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                </a>

                <a
                  href="https://github.com/assassinyousuf/ccna-learning-platform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-800/90 hover:bg-slate-750 border border-slate-700 transition-colors text-xs sm:text-sm shadow-md"
                >
                  <Github className="w-4 h-4 text-cyan-400" />
                  <span>GitHub Repository</span>
                </a>

                <div className="flex items-center justify-center gap-2">
                  <a
                    href="https://github.com/assassinyousuf"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="GitHub Profile"
                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors flex-1 flex justify-center"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/mdyousufhossainmehrab/"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="LinkedIn Profile"
                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors flex-1 flex justify-center"
                  >
                    <Linkedin className="w-4 h-4 text-cyan-400" />
                  </a>
                  <a
                    href="mailto:itsmemehrab369@gmail.com"
                    title="Send Email"
                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors flex-1 flex justify-center"
                  >
                    <Mail className="w-4 h-4 text-emerald-400" />
                  </a>
                  <a
                    href="https://www.yousuf.surf/Md__Yousuf_Hossain_CV.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Download CV"
                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors flex-1 flex justify-center"
                  >
                    <FileText className="w-4 h-4 text-amber-400" />
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Packet Tracer Lab Download & Active Learning Banner */}
      <section className="py-16 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-3">
              <Laptop className="w-3.5 h-3.5" />
              <span>Cisco Networking Academy Official Tool</span>
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
