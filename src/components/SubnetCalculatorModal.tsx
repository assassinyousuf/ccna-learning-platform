"use client";

import React, { useState, useMemo } from "react";
import { Calculator, X, Binary, Copy, Check, Info, Sparkles, Sliders } from "lucide-react";
import { sounds } from "@/lib/sound-effects";

interface SubnetCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubnetCalculatorModal({ isOpen, onClose }: SubnetCalculatorModalProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>IPv4 Subnet & Binary Calculator</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  CCNA Ch. 11
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                FLSM & VLSM Bitwise Calculation Engine
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Interactive Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-mono text-slate-300">IPv4 Address</label>
            <input
              type="text"
              value={ip}
              onChange={(e) => {
                setIp(e.target.value);
                sounds.playKeyClick();
              }}
              placeholder="192.168.1.1"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 flex justify-between">
              <span>Prefix</span>
              <span className="text-cyan-400 font-bold">/{cidr}</span>
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
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        {/* CIDR Slider */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
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
            className="w-full accent-cyan-400 cursor-pointer"
          />
        </div>

        {/* Results Grid */}
        {calc && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                  className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition-colors group relative"
                >
                  <p className="text-[10px] font-mono uppercase text-slate-400">{item.label}</p>
                  <p className="text-sm font-bold text-white font-mono mt-0.5">{item.val}</p>
                  <button
                    onClick={() => handleCopy(item.val, item.key)}
                    className="absolute top-2 right-2 p-1 rounded bg-slate-800 text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy"
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
            <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-slate-900/50 border border-slate-800/60 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {calc.usableHosts.toLocaleString()} Usable Hosts
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {calc.ipClass}
              </span>
              <span className={`px-2.5 py-1 rounded-lg border ${
                calc.isPrivate
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  : "bg-blue-500/10 text-blue-400 border-blue-500/20"
              }`}>
                {calc.isPrivate ? "RFC 1918 Private" : "Public Routable"}
              </span>
            </div>

            {/* 32-Bit Binary Visualizer */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="flex items-center gap-1 text-slate-300">
                  <Binary className="w-3.5 h-3.5 text-cyan-400" /> 32-Bit Binary Representation
                </span>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Network ({cidr} bits)
                  </span>
                  <span className="flex items-center gap-1 text-cyan-400">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Host ({32 - cidr} bits)
                  </span>
                </div>
              </div>

              {/* Bit Blocks by Octet */}
              <div className="grid grid-cols-4 gap-2 pt-1 font-mono text-center">
                {[0, 1, 2, 3].map((octetIdx) => (
                  <div key={octetIdx} className="p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                    <div className="text-[10px] text-slate-500 mb-1">Octet {octetIdx + 1}</div>
                    <div className="flex items-center justify-center gap-0.5 text-xs font-bold">
                      {calc.binaryBits
                        .slice(octetIdx * 8, (octetIdx + 1) * 8)
                        .map((b, bIdx) => (
                          <span
                            key={bIdx}
                            className={`w-3.5 py-0.5 rounded text-[11px] ${
                              b.isNetwork
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-cyan-500/20 text-cyan-400"
                            }`}
                          >
                            {b.bit}
                          </span>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
