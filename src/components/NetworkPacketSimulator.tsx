"use client";

import React, { useState, useEffect } from "react";
import { Play, RotateCcw, Zap, Layers, Cpu, ArrowRight, Laptop, Network, Server, CheckCircle2, ShieldCheck, Info } from "lucide-react";
import { sounds } from "@/lib/sound-effects";

type SimulationProtocol = "icmp" | "arp" | "vlan" | "ospf";

interface ProtocolDetail {
  id: SimulationProtocol;
  name: string;
  badge: string;
  src: string;
  dst: string;
  summary: string;
  steps: {
    title: string;
    node: "pc" | "sw" | "r1" | "srv";
    posPercent: number; // 0 to 100
    detail: string;
    headers: {
      l2: string;
      l3: string;
      l4: string;
      data: string;
    };
  }[];
}

const SIMULATIONS: Record<SimulationProtocol, ProtocolDetail> = {
  icmp: {
    id: "icmp",
    name: "ICMP Echo Request (Ping & RTT)",
    badge: "Layer 3 • IP Protocol 1",
    src: "PC-A (192.168.10.50)",
    dst: "SRV-1 (172.16.1.100)",
    summary: "End-to-end IP packet routing through 802.1Q switch trunk and Cisco ISR router default gateway.",
    steps: [
      {
        title: "Step 1: Frame Generation at PC-A",
        node: "pc",
        posPercent: 5,
        detail: "PC-A determines destination 172.16.1.100 is outside local subnet /24. Encapsulates IP packet into Ethernet frame addressed to Default Gateway MAC (0019.06ea.3980).",
        headers: {
          l2: "Src: 0014.a82b.4711 | Dst: 0019.06ea.3980 (R1) | Type: 0x0800",
          l3: "Src: 192.168.10.50 | Dst: 172.16.1.100 | TTL: 128 | Proto: 1 (ICMP)",
          l4: "Type: 8 (Echo Request) | Code: 0 | Checksum: 0x4f12",
          data: "Payload: 32 bytes [abcdefghijklmnopqrstuvwabcdefghi]",
        },
      },
      {
        title: "Step 2: VLAN Access Ingress at Catalyst 2960 SW1",
        node: "sw",
        posPercent: 35,
        detail: "Switch receives frame on Port Fa0/1 (Access VLAN 10). Adds 4-byte 802.1Q VLAN Tag (VID 10) and transmits across GigabitEthernet0/1 Trunk to Router.",
        headers: {
          l2: "802.1Q Tagged [TPID: 0x8100, PCP: 0, VLAN ID: 10] | Dst: R1 Gi0/0.10",
          l3: "Src: 192.168.10.50 | Dst: 172.16.1.100 | TTL: 128",
          l4: "Type: 8 (Echo Request) | Sequence: 1",
          data: "CAM Table Lookup: Fa0/1 mapped to 0014.a82b.4711",
        },
      },
      {
        title: "Step 3: Route Lookup & TTL Decrement at ISR 4331 R1",
        node: "r1",
        posPercent: 65,
        detail: "Router strips 802.1Q header on Subinterface Gi0/0.10. Performs routing table lookup: 172.16.1.0/24 matches OSPF Route via Gi0/0/1. Decrements TTL to 127.",
        headers: {
          l2: "Src: 0019.06ea.3981 (R1 Gi0/0/1) | Dst: 0050.56a1.c001 (SRV-1)",
          l3: "Src: 192.168.10.50 | Dst: 172.16.1.100 | TTL: 127 (Decremented)",
          l4: "Type: 8 (Echo Request) | Recalculated Checksum",
          data: "FIB / CEF Switching: Outgoing Port Gi0/0/1",
        },
      },
      {
        title: "Step 4: Echo Reply Received at Target Server",
        node: "srv",
        posPercent: 95,
        detail: "Web Server verifies ICMP checksum. Generates ICMP Echo Reply (Type 0, Code 0) back to PC-A. Round Trip Time: 1.4ms.",
        headers: {
          l2: "Src: 0050.56a1.c001 | Dst: 0019.06ea.3981 | Type: 0x0800",
          l3: "Src: 172.16.1.100 | Dst: 192.168.10.50 | TTL: 64",
          l4: "Type: 0 (Echo Reply) | Code: 0 | Sequence: 1",
          data: "Status: 200 OK • Ping Success Rate: 100% (5/5)",
        },
      },
    ],
  },
  arp: {
    id: "arp",
    name: "Address Resolution Protocol (ARP Broadcast)",
    badge: "Layer 2/3 • Broadcast 0xFF:FF",
    src: "PC-A (192.168.10.50)",
    dst: "Default Gateway (192.168.10.1)",
    summary: "Resolves unknown Layer 2 MAC address for known Layer 3 IPv4 address via Ethernet Broadcast.",
    steps: [
      {
        title: "Step 1: ARP Cache Miss & Broadcast Construction",
        node: "pc",
        posPercent: 10,
        detail: "PC-A needs to transmit to 192.168.10.1 but has no ARP cache entry. Creates ARP Request with Destination MAC ff:ff:ff:ff:ff:ff.",
        headers: {
          l2: "Src MAC: 0014.a82b.4711 | Dst MAC: ff:ff:ff:ff:ff:ff (BROADCAST)",
          l3: "Hardware: Ethernet (1) | Protocol: IPv4 (0x0800)",
          l4: "Opcode: 1 (ARP REQUEST)",
          data: "Query: Who has 192.168.10.1? Tell 192.168.10.50",
        },
      },
      {
        title: "Step 2: Switch Floods Broadcast across VLAN 10",
        node: "sw",
        posPercent: 45,
        detail: "Switch SW1 receives broadcast frame on Fa0/1. Floods it out all active ports in VLAN 10 (excluding ingress).",
        headers: {
          l2: "VLAN 10 Broadcast Domain • Flooded out Fa0/2 and Gi0/1 Trunk",
          l3: "Opcode: 1 (ARP REQUEST)",
          l4: "Target IP: 192.168.10.1",
          data: "CAM Table: Learned PC-A MAC on Fa0/1",
        },
      },
      {
        title: "Step 3: Gateway R1 Unicast ARP Reply",
        node: "r1",
        posPercent: 85,
        detail: "Router ISR 4331 recognizes its own IP. Sends unicast ARP Reply containing its MAC 0019.06ea.3980. PC-A caches mapping for 240 seconds.",
        headers: {
          l2: "Src MAC: 0019.06ea.3980 | Dst MAC: 0014.a82b.4711 (UNICAST)",
          l3: "Opcode: 2 (ARP REPLY)",
          l4: "Sender IP: 192.168.10.1 | Sender MAC: 0019.06ea.3980",
          data: "ARP Table Populated: 192.168.10.1 -> 0019.06ea.3980 [DYNAMIC]",
        },
      },
    ],
  },
  vlan: {
    id: "vlan",
    name: "802.1Q Trunk Tagging & Native VLAN",
    badge: "IEEE 802.1Q • 4-Byte Tag",
    src: "Access Port Fa0/1",
    dst: "Trunk Port Gi0/1",
    summary: "Encapsulation of multi-VLAN frames across point-to-point trunk links between Cisco switches.",
    steps: [
      {
        title: "Step 1: Standard Untagged Frame Ingress",
        node: "pc",
        posPercent: 15,
        detail: "Host PC-A transmits normal untagged Ethernet II frame. Port Fa0/1 is configured in Access Mode: 'switchport access vlan 10'.",
        headers: {
          l2: "Preamble (7B) | SFD (1B) | Dst MAC | Src MAC | Type 0x0800",
          l3: "Standard 1518 Byte Maximum Transmission Unit (MTU)",
          l4: "Tag Status: UNTAGGED",
          data: "Assigned to Internal VLAN ID 10",
        },
      },
      {
        title: "Step 2: 4-Byte 802.1Q Header Insertion",
        node: "sw",
        posPercent: 55,
        detail: "Switch prepends 4-byte 802.1Q tag between Source MAC and EtherType before trunk transit. Frame size expands to 1522 bytes.",
        headers: {
          l2: "TPID: 0x8100 | Priority (PCP): 0 | DEI: 0 | VLAN ID (VID): 10",
          l3: "Native VLAN: 99 (Untagged) • VLAN 10: TAGGED",
          l4: "Recalculated CRC / Frame Check Sequence (FCS)",
          data: "Trunk Mode: switchport mode trunk | encapsulation dot1q",
        },
      },
      {
        title: "Step 3: Inter-VLAN Router-on-a-Stick Demux",
        node: "r1",
        posPercent: 90,
        detail: "Router subinterface Gi0/0.10 receives frame, matches 'encapsulation dot1q 10', strips tag, and routes into destination subnet.",
        headers: {
          l2: "Tag Processed & Stripped by Subinterface Gi0/0.10",
          l3: "Inter-VLAN Routing Executed",
          l4: "Egress Interface: GigabitEthernet0/0.20 (VLAN 20)",
          data: "Status: Full 802.1Q Frame Decapsulation Complete",
        },
      },
    ],
  },
  ospf: {
    id: "ospf",
    name: "OSPFv2 Link-State Hello Discovery",
    badge: "IP Proto 89 • Multicast 224.0.0.5",
    src: "R1 Router-ID 1.1.1.1",
    dst: "AllSPFRouters (224.0.0.5)",
    summary: "Dynamic neighbor adjacency discovery, dead timer synchronization, and DR/BDR election across broadcast networks.",
    steps: [
      {
        title: "Step 1: Multicast Hello Generation",
        node: "r1",
        posPercent: 20,
        detail: "R1 sends OSPF Hello packet every 10 seconds to multicast address 224.0.0.5 via GigabitEthernet0/0/1.",
        headers: {
          l2: "Dst MAC: 01:00:5E:00:00:05 (Multicast OSPF)",
          l3: "Src IP: 10.0.12.1 | Dst IP: 224.0.0.5 | Protocol: 89 (OSPF)",
          l4: "Router ID: 1.1.1.1 | Area ID: 0.0.0.0 (Backbone)",
          data: "Hello Interval: 10s | Dead Interval: 40s | Netmask: /30",
        },
      },
      {
        title: "Step 2: Neighbor 2-Way Adjacency State",
        node: "sw",
        posPercent: 60,
        detail: "Neighbor R2 receives Hello, verifies matching Area ID, Subnet Mask, Timers, and Authentication. Includes R1 in active neighbor list.",
        headers: {
          l2: "State Transition: DOWN -> INIT -> 2-WAY",
          l3: "Neighbors Listed: 2.2.2.2 and 1.1.1.1",
          l4: "DR Priority: 1 (Default)",
          data: "Designated Router (DR) Election in Progress",
        },
      },
      {
        title: "Step 3: Database Description & FULL State Convergence",
        node: "srv",
        posPercent: 95,
        detail: "DBD, LSR, and LSU Link-State Advertisements exchanged. Both routers achieve identical Link-State Database (LSDB). State: FULL.",
        headers: {
          l2: "Adjacency State: FULL / DR",
          l3: "LSA Type 1 (Router LSA) Synchronized",
          l4: "Shortest Path First (Dijkstra) Algorithm Executed",
          data: "Convergence Time: <2.8s • Routing Table Injected",
        },
      },
    ],
  },
};

export function NetworkPacketSimulator() {
  const [activeProto, setActiveProto] = useState<SimulationProtocol>("icmp");
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentSim = SIMULATIONS[activeProto];
  const totalSteps = currentSim.steps.length;
  const activeStep = currentSim.steps[currentStepIdx] || currentSim.steps[0];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false);
            sounds.playCommandSuccess();
            return prev;
          }
          sounds.playKeyClick();
          return prev + 1;
        });
      }, 2400);
    }
    return () => clearInterval(timer);
  }, [isPlaying, totalSteps]);

  const handleSelectProto = (proto: SimulationProtocol) => {
    setActiveProto(proto);
    setCurrentStepIdx(0);
    setIsPlaying(false);
    sounds.playKeyClick();
  };

  const handleNext = () => {
    if (currentStepIdx < totalSteps - 1) {
      setCurrentStepIdx((p) => p + 1);
      sounds.playKeyClick();
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx((p) => p - 1);
      sounds.playKeyClick();
    }
  };

  const handleReset = () => {
    setCurrentStepIdx(0);
    setIsPlaying(false);
    sounds.playKeyClick();
  };

  const togglePlay = () => {
    if (currentStepIdx >= totalSteps - 1) {
      setCurrentStepIdx(0);
    }
    setIsPlaying(!isPlaying);
    sounds.playKeyClick();
  };

  return (
    <div className="specular-card p-6 sm:p-8 bg-[var(--card)] border border-[var(--border)] shadow-2xl relative overflow-hidden">
      {/* Background ambient beam */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-[var(--primary-muted)] rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Mode Selectors */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 mb-6 border-b border-[var(--border)] gap-4 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-muted)] border border-[var(--border-highlight)] text-[var(--primary)] text-xs font-mono mb-2">
            <Zap className="w-3.5 h-3.5" />
            <span>Interactive OSI Packet Flight Engine</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[var(--foreground)] tracking-tight">
            Live Cisco Packet Inspection &amp; Flow Simulator
          </h3>
          <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-1">
            Observe real-time bit encapsulation, 802.1Q tags, IP TTL decrements, and ICMP payloads across network hops.
          </p>
        </div>

        {/* Protocol Switcher Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[var(--background-subtle)] border border-[var(--border)] text-xs font-mono">
          {(["icmp", "arp", "vlan", "ospf"] as SimulationProtocol[]).map((proto) => (
            <button
              key={proto}
              onClick={() => handleSelectProto(proto)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeProto === proto
                  ? "bg-[var(--card)] text-[var(--primary)] border border-[var(--border)] shadow-sm"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {proto.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Network Diagram Stage */}
      <div className="p-6 rounded-xl bg-[var(--terminal-bg)] border border-[var(--terminal-border)] relative mb-6">
        {/* Connection Cable Line */}
        <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1 bg-[var(--border)] z-0 rounded-full" />

        {/* Dynamic Animated Packet Orb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 transition-all duration-700 ease-out flex items-center justify-center pointer-events-none"
          style={{ left: `${activeStep.posPercent}%` }}
        >
          <div className="relative">
            <div className="w-6 h-6 rounded-full bg-[var(--primary)] shadow-[0_0_20px_#00d2ff] flex items-center justify-center text-[10px] font-bold text-slate-950 font-mono animate-pulse">
              P
            </div>
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded bg-[var(--card)] border border-[var(--border-highlight)] text-[9px] font-mono text-[var(--primary)] shadow-md">
              {activeProto.toUpperCase()} FRAME
            </div>
          </div>
        </div>

        {/* 4 Network Node Terminals */}
        <div className="grid grid-cols-4 gap-2 relative z-10 text-center">
          {/* Node 1: PC-A */}
          <div className={`p-3 rounded-lg border transition-all ${
            activeStep.node === "pc"
              ? "bg-[var(--card)] border-[var(--primary)] shadow-lg shadow-cyan-500/10"
              : "bg-[var(--card)]/60 border-[var(--border)] opacity-70"
          }`}>
            <Laptop className={`w-5 h-5 mx-auto mb-1 ${activeStep.node === "pc" ? "text-[var(--primary)]" : "text-slate-400"}`} />
            <h5 className="font-bold text-xs text-[var(--foreground)]">PC-A</h5>
            <p className="text-[10px] font-mono text-[var(--primary)]">192.168.10.50</p>
            <span className="text-[9px] font-mono text-[var(--foreground-muted)] hidden sm:inline">Fa0/1 • VLAN 10</span>
          </div>

          {/* Node 2: Catalyst SW1 */}
          <div className={`p-3 rounded-lg border transition-all ${
            activeStep.node === "sw"
              ? "bg-[var(--card)] border-[var(--primary)] shadow-lg shadow-cyan-500/10"
              : "bg-[var(--card)]/60 border-[var(--border)] opacity-70"
          }`}>
            <Network className={`w-5 h-5 mx-auto mb-1 ${activeStep.node === "sw" ? "text-purple-400" : "text-slate-400"}`} />
            <h5 className="font-bold text-xs text-[var(--foreground)]">SW1 2960</h5>
            <p className="text-[10px] font-mono text-purple-400">802.1Q TRUNK</p>
            <span className="text-[9px] font-mono text-[var(--foreground-muted)] hidden sm:inline">Port Gi0/1</span>
          </div>

          {/* Node 3: Cisco ISR R1 */}
          <div className={`p-3 rounded-lg border transition-all ${
            activeStep.node === "r1"
              ? "bg-[var(--card)] border-[var(--primary)] shadow-lg shadow-cyan-500/10"
              : "bg-[var(--card)]/60 border-[var(--border)] opacity-70"
          }`}>
            <Cpu className={`w-5 h-5 mx-auto mb-1 ${activeStep.node === "r1" ? "text-emerald-400" : "text-slate-400"}`} />
            <h5 className="font-bold text-xs text-[var(--foreground)]">R1 ISR 4331</h5>
            <p className="text-[10px] font-mono text-emerald-400">Default Gateway</p>
            <span className="text-[9px] font-mono text-[var(--foreground-muted)] hidden sm:inline">Gi0/0.10, Gi0/0/1</span>
          </div>

          {/* Node 4: Web Server */}
          <div className={`p-3 rounded-lg border transition-all ${
            activeStep.node === "srv"
              ? "bg-[var(--card)] border-[var(--primary)] shadow-lg shadow-cyan-500/10"
              : "bg-[var(--card)]/60 border-[var(--border)] opacity-70"
          }`}>
            <Server className={`w-5 h-5 mx-auto mb-1 ${activeStep.node === "srv" ? "text-amber-400" : "text-slate-400"}`} />
            <h5 className="font-bold text-xs text-[var(--foreground)]">SRV-1</h5>
            <p className="text-[10px] font-mono text-amber-400">172.16.1.100</p>
            <span className="text-[9px] font-mono text-[var(--foreground-muted)] hidden sm:inline">HTTP / Echo</span>
          </div>
        </div>
      </div>

      {/* Simulator Playback Controls & Progress Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[var(--background-subtle)] border border-[var(--border)] mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-bold text-xs hover:opacity-90 transition-opacity shadow-sm"
          >
            <Play className={`w-3.5 h-3.5 ${isPlaying ? "animate-spin" : ""}`} />
            <span>{isPlaying ? "Pause Flow" : "Auto Play Flow"}</span>
          </button>

          <button
            onClick={handlePrev}
            disabled={currentStepIdx === 0}
            className="px-2.5 py-1.5 rounded-lg bg-[var(--card)] border border-[var(--border)] text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)] disabled:opacity-40 transition-colors"
          >
            &larr; Step
          </button>

          <button
            onClick={handleNext}
            disabled={currentStepIdx === totalSteps - 1}
            className="px-2.5 py-1.5 rounded-lg bg-[var(--card)] border border-[var(--border)] text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)] disabled:opacity-40 transition-colors"
          >
            Step &rarr;
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-[var(--card)] border border-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
            title="Reset step"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-[var(--foreground-muted)]">
          <span>Hop {currentStepIdx + 1} of {totalSteps}</span>
          <div className="w-28 h-1.5 rounded-full bg-[var(--card)] overflow-hidden">
            <div
              className="h-full bg-[var(--primary)] transition-all duration-300"
              style={{ width: `${((currentStepIdx + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Deep Protocol Header Inspector Drawer */}
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-[var(--primary)] flex items-center gap-1.5">
              <span className="cisco-led-active" />
              <span>{activeStep.title}</span>
            </span>
            <span className="telemetry-badge">{currentSim.badge}</span>
          </div>
          <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
            {activeStep.detail}
          </p>
        </div>

        {/* 4-Layer Encapsulation Telemetry Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
          {/* L2 Header */}
          <div className="p-3 rounded-lg bg-[var(--terminal-bg)] border border-[var(--terminal-border)]">
            <span className="text-[10px] text-purple-400 font-bold block mb-1">LAYER 2 • ETHERNET II / 802.1Q</span>
            <p className="text-[11px] text-[var(--terminal-out)] break-all">{activeStep.headers.l2}</p>
          </div>

          {/* L3 Header */}
          <div className="p-3 rounded-lg bg-[var(--terminal-bg)] border border-[var(--terminal-border)]">
            <span className="text-[10px] text-[var(--primary)] font-bold block mb-1">LAYER 3 • IPv4 HEADER</span>
            <p className="text-[11px] text-[var(--terminal-out)] break-all">{activeStep.headers.l3}</p>
          </div>

          {/* L4 Header */}
          <div className="p-3 rounded-lg bg-[var(--terminal-bg)] border border-[var(--terminal-border)]">
            <span className="text-[10px] text-emerald-400 font-bold block mb-1">LAYER 4 • TRANSPORT / PROTOCOL</span>
            <p className="text-[11px] text-[var(--terminal-out)] break-all">{activeStep.headers.l4}</p>
          </div>

          {/* L7 / Payload */}
          <div className="p-3 rounded-lg bg-[var(--terminal-bg)] border border-[var(--terminal-border)]">
            <span className="text-[10px] text-amber-400 font-bold block mb-1">LAYER 7 • APPLICATION &amp; CAM STATE</span>
            <p className="text-[11px] text-[var(--terminal-out)] break-all">{activeStep.headers.data}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
