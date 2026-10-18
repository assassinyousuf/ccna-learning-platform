"use client";

import React, { useState } from "react";
import { 
  Network, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Award, 
  Sparkles, 
  Layers, 
  Laptop, 
  Server,
  Zap,
  Info,
  ArrowRight
} from "lucide-react";
import { sounds } from "@/lib/sound-effects";

type CableType = "straight" | "crossover" | "rollover" | "serial" | "fiber";

interface CablingScenario {
  id: number;
  deviceA: { name: string; port: string; type: "pc" | "sw" | "rtr" };
  deviceB: { name: string; port: string; type: "pc" | "sw" | "rtr" };
  correctCable: CableType;
  explanation: string;
  pinoutDetail: string;
}

const SCENARIOS: CablingScenario[] = [
  {
    id: 1,
    deviceA: { name: "PC-A (Workstation)", port: "FastEthernet 0 (NIC)", type: "pc" },
    deviceB: { name: "Catalyst 2960 SW1", port: "FastEthernet 0/1 (Access VLAN 10)", type: "sw" },
    correctCable: "straight",
    explanation: "Different device layers (MDI PC transmitting on pins 1/2 connects to MDI-X Switch receiving on pins 1/2) require a standard Straight-Through Cat6 patch cable (T568B to T568B).",
    pinoutDetail: "Pin 1 (Tx+) &rarr; Pin 1 (Rx+), Pin 2 (Tx-) &rarr; Pin 2 (Rx-)",
  },
  {
    id: 2,
    deviceA: { name: "Catalyst 2960 SW1", port: "GigabitEthernet 0/1 (802.1Q Trunk)", type: "sw" },
    deviceB: { name: "Catalyst 3650 SW2", port: "GigabitEthernet 0/1 (802.1Q Trunk)", type: "sw" },
    correctCable: "crossover",
    explanation: "Like-devices (Switch to Switch) operate with identical MDI-X pinouts. Under classic CCNA physics, transmitting pins must be crossed over to receiving pins (T568A to T568B), unless Auto-MDIX is enabled.",
    pinoutDetail: "Pins 1 & 2 cross over to Pins 3 & 6",
  },
  {
    id: 3,
    deviceA: { name: "PC-A (Admin Laptop)", port: "USB / RS-232 DB-9 COM Port", type: "pc" },
    deviceB: { name: "Cisco ISR 4331 Router", port: "Console (RJ-45 Blue Port)", type: "rtr" },
    correctCable: "rollover",
    explanation: "Out-of-band management console connections require a Rollover (Yost) cable where pin 1 on one end reverses to pin 8 on the other (9600 baud, 8 data bits, no parity, 1 stop bit).",
    pinoutDetail: "Pin 1 &rarr; Pin 8, Pin 2 &rarr; Pin 7, Pin 3 &rarr; Pin 6 ... Pin 8 &rarr; Pin 1",
  },
  {
    id: 4,
    deviceA: { name: "PC-A (Workstation)", port: "GigabitEthernet 0 (Direct)", type: "pc" },
    deviceB: { name: "Cisco ISR 4331 Router", port: "GigabitEthernet 0/0/0 (Default Gateway)", type: "rtr" },
    correctCable: "crossover",
    explanation: "Both PCs and Routers are MDI (Medium Dependent Interface) endpoints that transmit on pins 1 and 2. Connecting them directly without an intermediate switch requires a Crossover cable.",
    pinoutDetail: "MDI to MDI requires inverted Tx/Rx wiring",
  },
  {
    id: 5,
    deviceA: { name: "ISR 4331 Router (HQ)", port: "Serial 0/1/0 (Smart Serial DTE)", type: "rtr" },
    deviceB: { name: "ISR 4331 Router (Branch)", port: "Serial 0/1/0 (Smart Serial DCE)", type: "rtr" },
    correctCable: "serial",
    explanation: "Legacy point-to-point leased line WAN connections use back-to-back V.35 / Smart Serial cables where the DCE side provides the clock rate synchronization.",
    pinoutDetail: "DCE side sets 'clock rate 64000', DTE connects back-to-back",
  },
  {
    id: 6,
    deviceA: { name: "Catalyst 3850 Core SW", port: "Te1/1/1 (10G SFP+ Transceiver)", type: "sw" },
    deviceB: { name: "Data Center SAN Server", port: "10G LC Optical Adapter", type: "sw" },
    correctCable: "fiber",
    explanation: "High-speed 10Gbps backbone and storage links use Fiber Optic LC duplex connectors with multimode (OM3/OM4 aqua) or singlemode (OS2 yellow) glass cores immunity to EMI.",
    pinoutDetail: "Duplex LC TX fiber mates to RX receptacle on opposite optic",
  },
];

export function CablingLab() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedCable, setSelectedCable] = useState<CableType | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const scenario = SCENARIOS[currentIdx];

  const handleSelectCable = (cable: CableType) => {
    if (isAnswered) return;
    setSelectedCable(cable);
    setIsAnswered(true);

    if (cable === scenario.correctCable) {
      setScore((s) => s + 100);
      sounds.playQuizCorrect();
    } else {
      sounds.playQuizWrong();
    }
  };

  const handleNext = () => {
    if (currentIdx < SCENARIOS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedCable(null);
      setIsAnswered(false);
      sounds.playKeyClick();
    } else {
      sounds.playCommandSuccess();
      setCurrentIdx(0);
      setSelectedCable(null);
      setIsAnswered(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--primary)] mb-1">
            <Network className="w-4 h-4 text-cyan-400" />
            <span>PHYSICAL LAYER 1 MEDIA WORKBENCH</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight">
            Interactive Cabling &amp; Port Pinout Lab
          </h3>
          <p className="text-xs text-[var(--foreground-muted)] mt-1">
            Match Straight-Through, Crossover, Rollover Console, Serial, and Fiber optics based on MDI/MDI-X standards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-[var(--background-subtle)] border border-[var(--border)] text-xs font-mono">
            Scenario <span className="text-[var(--primary)] font-bold">{currentIdx + 1}</span> of {SCENARIOS.length}
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-[var(--background-subtle)] border border-[var(--border)] text-xs font-mono">
            Score: <span className="text-emerald-400 font-bold">{score} XP</span>
          </div>
        </div>
      </div>

      {/* Visual Device Rack Connection Viewport */}
      <div className="my-6 p-6 sm:p-8 rounded-xl bg-[var(--terminal-bg)] border border-[var(--terminal-border)] relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          {/* Device A */}
          <div className="w-full sm:w-64 p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] text-center shadow-lg">
            <div className="w-10 h-10 rounded-lg bg-[var(--primary-muted)] text-[var(--primary)] mx-auto flex items-center justify-center mb-2">
              {scenario.deviceA.type === "pc" && <Laptop className="w-5 h-5" />}
              {scenario.deviceA.type === "sw" && <Layers className="w-5 h-5" />}
              {scenario.deviceA.type === "rtr" && <Network className="w-5 h-5" />}
            </div>
            <h4 className="font-bold text-xs text-[var(--foreground)]">{scenario.deviceA.name}</h4>
            <div className="mt-2 py-1 px-2 rounded bg-[var(--background-subtle)] text-[10px] font-mono text-[var(--primary)] border border-[var(--border)]">
              {scenario.deviceA.port}
            </div>
            {/* LED Status */}
            <div className="flex items-center justify-center gap-1.5 mt-2 text-[10px] font-mono">
              <span className={isAnswered && selectedCable === scenario.correctCable ? "cisco-led-active" : "cisco-led-amber"} />
              <span className={isAnswered && selectedCable === scenario.correctCable ? "text-emerald-400 font-bold" : "text-amber-400"}>
                {isAnswered && selectedCable === scenario.correctCable ? "LINK UP" : "NO LINK"}
              </span>
            </div>
          </div>

          {/* Animated Cable Conduit / Bridge */}
          <div className="flex-1 flex flex-col items-center justify-center w-full px-4">
            <div className="w-full h-1 relative rounded-full bg-slate-800 my-4">
              {selectedCable && (
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isAnswered && selectedCable === scenario.correctCable
                      ? "bg-emerald-400 shadow-[0_0_12px_#10b981]"
                      : "bg-rose-500"
                  }`}
                  style={{ width: "100%" }}
                />
              )}
            </div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider text-center">
              {selectedCable ? `Selected: ${selectedCable.toUpperCase()} CABLE` : "SELECT CABLE TYPE BELOW"}
            </span>
          </div>

          {/* Device B */}
          <div className="w-full sm:w-64 p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] text-center shadow-lg">
            <div className="w-10 h-10 rounded-lg bg-[var(--secondary-muted)] text-[var(--secondary)] mx-auto flex items-center justify-center mb-2">
              {scenario.deviceB.type === "pc" && <Laptop className="w-5 h-5" />}
              {scenario.deviceB.type === "sw" && <Layers className="w-5 h-5" />}
              {scenario.deviceB.type === "rtr" && <Network className="w-5 h-5" />}
            </div>
            <h4 className="font-bold text-xs text-[var(--foreground)]">{scenario.deviceB.name}</h4>
            <div className="mt-2 py-1 px-2 rounded bg-[var(--background-subtle)] text-[10px] font-mono text-[var(--secondary)] border border-[var(--border)]">
              {scenario.deviceB.port}
            </div>
            {/* LED Status */}
            <div className="flex items-center justify-center gap-1.5 mt-2 text-[10px] font-mono">
              <span className={isAnswered && selectedCable === scenario.correctCable ? "cisco-led-active" : "cisco-led-amber"} />
              <span className={isAnswered && selectedCable === scenario.correctCable ? "text-emerald-400 font-bold" : "text-amber-400"}>
                {isAnswered && selectedCable === scenario.correctCable ? "LINK UP" : "NO LINK"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cable Selector Options */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <button
          onClick={() => handleSelectCable("straight")}
          disabled={isAnswered}
          className={`p-3 rounded-xl border text-xs font-mono font-semibold transition-all flex flex-col items-center justify-center gap-1.5 ${
            selectedCable === "straight"
              ? isAnswered
                ? scenario.correctCable === "straight"
                  ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                  : "bg-rose-500/10 border-rose-500 text-rose-400"
                : "bg-[var(--primary)] text-[var(--primary-foreground)]"
              : "bg-[var(--background-subtle)] border-[var(--border)] text-[var(--foreground)] hover:border-[var(--primary)]"
          }`}
        >
          <span className="w-3 h-3 rounded-full bg-blue-500 inline-block shadow-sm" />
          <span>Straight-Through</span>
          <span className="text-[10px] text-[var(--foreground-muted)] font-normal">T568B to T568B</span>
        </button>

        <button
          onClick={() => handleSelectCable("crossover")}
          disabled={isAnswered}
          className={`p-3 rounded-xl border text-xs font-mono font-semibold transition-all flex flex-col items-center justify-center gap-1.5 ${
            selectedCable === "crossover"
              ? isAnswered
                ? scenario.correctCable === "crossover"
                  ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                  : "bg-rose-500/10 border-rose-500 text-rose-400"
                : "bg-[var(--primary)] text-[var(--primary-foreground)]"
              : "bg-[var(--background-subtle)] border-[var(--border)] text-[var(--foreground)] hover:border-[var(--primary)]"
          }`}
        >
          <span className="w-3 h-3 rounded-full bg-orange-500 inline-block shadow-sm" />
          <span>Crossover</span>
          <span className="text-[10px] text-[var(--foreground-muted)] font-normal">T568A to T568B</span>
        </button>

        <button
          onClick={() => handleSelectCable("rollover")}
          disabled={isAnswered}
          className={`p-3 rounded-xl border text-xs font-mono font-semibold transition-all flex flex-col items-center justify-center gap-1.5 ${
            selectedCable === "rollover"
              ? isAnswered
                ? scenario.correctCable === "rollover"
                  ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                  : "bg-rose-500/10 border-rose-500 text-rose-400"
                : "bg-[var(--primary)] text-[var(--primary-foreground)]"
              : "bg-[var(--background-subtle)] border-[var(--border)] text-[var(--foreground)] hover:border-[var(--primary)]"
          }`}
        >
          <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block shadow-sm" />
          <span>Rollover / Console</span>
          <span className="text-[10px] text-[var(--foreground-muted)] font-normal">RJ-45 to DB-9</span>
        </button>

        <button
          onClick={() => handleSelectCable("serial")}
          disabled={isAnswered}
          className={`p-3 rounded-xl border text-xs font-mono font-semibold transition-all flex flex-col items-center justify-center gap-1.5 ${
            selectedCable === "serial"
              ? isAnswered
                ? scenario.correctCable === "serial"
                  ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                  : "bg-rose-500/10 border-rose-500 text-rose-400"
                : "bg-[var(--primary)] text-[var(--primary-foreground)]"
              : "bg-[var(--background-subtle)] border-[var(--border)] text-[var(--foreground)] hover:border-[var(--primary)]"
          }`}
        >
          <span className="w-3 h-3 rounded-full bg-teal-400 inline-block shadow-sm" />
          <span>Serial (V.35)</span>
          <span className="text-[10px] text-[var(--foreground-muted)] font-normal">Smart Serial WAN</span>
        </button>

        <button
          onClick={() => handleSelectCable("fiber")}
          disabled={isAnswered}
          className={`p-3 rounded-xl border text-xs font-mono font-semibold transition-all flex flex-col items-center justify-center gap-1.5 ${
            selectedCable === "fiber"
              ? isAnswered
                ? scenario.correctCable === "fiber"
                  ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                  : "bg-rose-500/10 border-rose-500 text-rose-400"
                : "bg-[var(--primary)] text-[var(--primary-foreground)]"
              : "bg-[var(--background-subtle)] border-[var(--border)] text-[var(--foreground)] hover:border-[var(--primary)]"
          }`}
        >
          <span className="w-3 h-3 rounded-full bg-amber-400 inline-block shadow-sm" />
          <span>Fiber Optic (LC)</span>
          <span className="text-[10px] text-[var(--foreground-muted)] font-normal">SFP+ Duplex</span>
        </button>
      </div>

      {/* Explanation Banner */}
      {isAnswered && (
        <div className={`mt-6 p-5 rounded-xl border text-xs font-mono leading-relaxed flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          selectedCable === scenario.correctCable
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
            : "bg-rose-500/10 border-rose-500/30 text-rose-300"
        }`}>
          <div>
            <div className="font-bold text-sm mb-1 flex items-center gap-1.5">
              {selectedCable === scenario.correctCable ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Correct Cable Connection!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>Incorrect Cable Choice</span>
                </>
              )}
            </div>
            <p className="text-[var(--foreground-muted)] mt-1">{scenario.explanation}</p>
            <p className="text-[11px] text-[var(--foreground)] mt-1 font-semibold">{scenario.pinoutDetail}</p>
          </div>

          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-bold text-xs hover:opacity-90 transition-opacity shrink-0 flex items-center gap-2"
          >
            <span>{currentIdx < SCENARIOS.length - 1 ? "Next Scenario" : "Restart Lab"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
