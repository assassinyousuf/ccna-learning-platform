"use client";

import React, { useState, useMemo } from "react";
import { Calculator, X, Copy, Check, Flame } from "lucide-react";
import { sounds } from "@/lib/sound-effects";
import { SubnetSpeedDrill } from "./SubnetSpeedDrill";

interface SubnetCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubnetCalculatorModal({ isOpen, onClose }: SubnetCalculatorModalProps) {
  const [modalMode, setModalMode] = useState<"calc" | "drill">("calc");
  const [ip, setIp] = useState("192.168.10.135");
  const [cidr, setCidr] = useState(26);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const calc = useMemo(() => {
    try {
      const octets = ip.split(".").map(Number);
      if (octets.length !== 4 || octets.some((o) => isNaN(o) || o < 0 || o > 255)) {
        return null;
      }

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

      const subnetMask = numToIp(maskNum);
      const wildcardMask = numToIp(wildcardNum);
      const networkAddress = numToIp(netNum);
      const broadcastAddress = numToIp(bcastNum);

      const totalHosts = Math.pow(2, 32 - cidr);
      const usableHosts = cidr >= 31 ? (cidr === 31 ? 2 : 1) : Math.max(0, totalHosts - 2);

      const firstHost = cidr >= 31 ? networkAddress : numToIp(netNum + 1);
      const lastHost = cidr >= 31 ? broadcastAddress : numToIp(bcastNum - 1);

      // Determine class
      let ipClass = "Class A";
      if (octets[0] >= 128 && octets[0] <= 191) ipClass = "Class B";
      else if (octets[0] >= 192 && octets[0] <= 223) ipClass = "Class C";
      else if (octets[0] >= 224 && octets[0] <= 239) ipClass = "Class D (Multicast)";
      else if (octets[0] >= 240) ipClass = "Class E (Experimental)";

      // Private check
      const isPrivate =
        octets[0] === 10 ||
        (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) ||
        (octets[0] === 192 && octets[1] === 168);

      // Binary breakdown
      const binaryIp = octets.map((o) => o.toString(2).padStart(8, "0")).join("");
      const binaryBits = binaryIp.split("").map((bit, idx) => ({
        bit,
        isNetwork: idx < cidr,
      }));

      return {
        subnetMask,
        wildcardMask,
        networkAddress,
        broadcastAddress,
        firstHost,
        lastHost,
        usableHosts,
        totalHosts,
        ipClass,
        isPrivate,
        binaryBits,
      };
    } catch {
      return null;
    }
  }, [ip, cidr]);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    sounds.playCommandSuccess();
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--primary-muted)] text-[var(--primary)] flex items-center justify-center border border-[var(--border-highlight)]">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--foreground)] flex items-center gap-2">
                <span>IPv4 Subnet &amp; Binary Calculator</span>
                <span className="telemetry-badge telemetry-badge-cyan">
                  CCNA Ch. 11
                </span>
              </h2>
              <p className="text-xs text-[var(--foreground-muted)] font-mono">
                FLSM &amp; VLSM Bitwise Calculation Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--background-subtle)] border border-[var(--border)] text-xs font-mono">
              <button
                onClick={() => setModalMode("calc")}
                className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all ${
                  modalMode === "calc"
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
                    : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                }`}
              >
                Calculator
              </button>
              <button
                onClick={() => setModalMode("drill")}
                className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 ${
                  modalMode === "drill"
                    ? "bg-amber-500 text-slate-950 shadow-sm"
                    : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                }`}
              >
                <Flame className="w-3 h-3 text-amber-500" />
                <span>30s Blitz</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[var(--background-subtle)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {modalMode === "drill" ? (
          <SubnetSpeedDrill />
        ) : (
          <>
            {/* Interactive Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-mono text-[var(--foreground-muted)]">IPv4 Address</label>
            <input
              type="text"
              value={ip}
              onChange={(e) => {
                setIp(e.target.value);
                sounds.playKeyClick();
              }}
              placeholder="192.168.1.1"
              className="w-full px-3 py-2 rounded-lg bg-[var(--background-subtle)] border border-[var(--border)] text-[var(--foreground)] font-mono text-sm focus:border-[var(--primary)] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-[var(--foreground-muted)] flex justify-between">
              <span>Prefix</span>
              <span className="text-[var(--primary)] font-bold">/{cidr}</span>
            </label>
            <input
              type="number"
              min={8}
              max={30}
              value={cidr}
              onChange={(e) => {
                setCidr(Math.max(8, Math.min(30, parseInt(e.target.value) || 24)));
                sounds.playKeyClick();
              }}
              className="w-full px-3 py-2 rounded-lg bg-[var(--background-subtle)] border border-[var(--border)] text-[var(--foreground)] font-mono text-sm focus:border-[var(--primary)] focus:outline-none"
            />
          </div>
        </div>

        {/* CIDR Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono text-[var(--foreground-muted)]">
            <span>/8 (Class A)</span>
            <span>/16 (Class B)</span>
            <span>/24 (Class C)</span>
            <span>/30 (P2P Link)</span>
          </div>
          <input
            type="range"
            min={8}
            max={30}
            value={cidr}
            onChange={(e) => {
              setCidr(parseInt(e.target.value));
              sounds.playKeyClick();
            }}
            className="w-full accent-[var(--primary)] cursor-pointer"
          />
        </div>

        {/* Results Grid */}
        {calc && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { label: "Network Address", val: calc.networkAddress, key: "net" },
                { label: "Broadcast Address", val: calc.broadcastAddress, key: "bcast" },
                { label: "Subnet Mask", val: calc.subnetMask, key: "mask" },
                { label: "Wildcard Mask", val: calc.wildcardMask, key: "wild" },
                { label: "First Usable Host", val: calc.firstHost, key: "first" },
                { label: "Last Usable Host", val: calc.lastHost, key: "last" },
              ].map((item) => (
                <div
                  key={item.key}
                  className="p-3 rounded-lg bg-[var(--background-subtle)] border border-[var(--border)] hover:border-[var(--border-highlight)] transition-colors group relative"
                >
                  <p className="text-[10px] font-mono uppercase text-[var(--foreground-muted)]">{item.label}</p>
                  <p className="text-xs sm:text-sm font-bold text-[var(--foreground)] font-mono mt-0.5">{item.val}</p>
                  <button
                    onClick={() => handleCopy(item.val, item.key)}
                    className="absolute top-2 right-2 p-1 rounded bg-[var(--card)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy value"
                  >
                    {copiedKey === item.key ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Extra Metadata Badges */}
            <div className="flex flex-wrap items-center gap-2 p-3 rounded-lg bg-[var(--background-subtle)] border border-[var(--border)] text-xs font-mono">
              <span className="telemetry-badge telemetry-badge-cyan">
                {calc.usableHosts.toLocaleString()} Usable Hosts
              </span>
              <span className="telemetry-badge telemetry-badge-emerald">
                {calc.ipClass}
              </span>
              <span className="telemetry-badge">
                {calc.isPrivate ? "RFC 1918 Private Scope" : "Public Routable IP"}
              </span>
            </div>

            {/* 32-Bit Binary Visualizer */}
            <div className="p-3.5 rounded-lg bg-[var(--terminal-bg)] border border-[var(--terminal-border)] font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-[11px] text-[var(--foreground-muted)]">
                <span className="text-[var(--primary)] font-bold">32-Bit Binary Address Alignment</span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[var(--primary)] inline-block" />
                    <span>Net ({cidr}b)</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-slate-500 inline-block" />
                    <span>Host ({32 - cidr}b)</span>
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 font-mono text-[11px]">
                {calc.binaryBits.map((b, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && i % 8 === 0 && <span className="text-slate-600 px-0.5">•</span>}
                    <span
                      className={`px-1 py-0.5 rounded font-bold ${
                        b.isNetwork
                          ? "bg-[var(--primary-muted)] text-[var(--primary)]"
                          : "text-slate-500"
                      }`}
                    >
                      {b.bit}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
}
