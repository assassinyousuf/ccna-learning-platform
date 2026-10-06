"use client";

import React, { useState, useMemo } from "react";
import { 
  Globe, 
  Copy, 
  Check, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Info,
  Binary
} from "lucide-react";
import { sounds } from "@/lib/sound-effects";

export function IPv6Eui64Visualizer() {
  const [macInput, setMacInput] = useState("0014.a82b.4711");
  const [prefixInput, setPrefixInput] = useState("2001:db8:acad:1");
  const [copied, setCopied] = useState<string | null>(null);

  // Parse MAC address into 6 hex bytes
  const parsedBytes = useMemo(() => {
    const clean = macInput.replace(/[^a-fA-F0-9]/g, "").toLowerCase();
    if (clean.length !== 12) {
      return ["00", "14", "a8", "2b", "47", "11"];
    }
    return [
      clean.slice(0, 2),
      clean.slice(2, 4),
      clean.slice(4, 6),
      clean.slice(6, 8),
      clean.slice(8, 10),
      clean.slice(10, 12),
    ];
  }, [macInput]);

  // Step 1: OUI vs NIC
  const oui = `${parsedBytes[0]}:${parsedBytes[1]}:${parsedBytes[2]}`;
  const nic = `${parsedBytes[3]}:${parsedBytes[4]}:${parsedBytes[5]}`;

  // Step 2: 1st byte binary and flipped
  const firstByteHex = parsedBytes[0];
  const firstByteInt = parseInt(firstByteHex, 16);
  const firstByteBin = firstByteInt.toString(2).padStart(8, "0");

  // In EUI-64, bit 7 (from left, 0-indexed index 1: 0 1 2 3 4 5 6 7) is flipped (XOR 0x02)
  const flippedByteInt = firstByteInt ^ 0x02;
  const flippedByteHex = flippedByteInt.toString(16).padStart(2, "0");
  const flippedByteBin = flippedByteInt.toString(2).padStart(8, "0");

  // Step 3: Resulting 64-bit Interface ID
  const interfaceId = `${flippedByteHex}${parsedBytes[1]}:${parsedBytes[2]}ff:fe${parsedBytes[3]}:${parsedBytes[4]}${parsedBytes[5]}`;

  // Step 4: Link-Local & Global SLAAC Addresses
  const linkLocal = `fe80::${interfaceId}/64`;
  const globalUnicast = `${prefixInput}::${interfaceId}/64`;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    sounds.playCommandSuccess();
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--primary)] mb-1">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>IPV6 STATELESS ADDRESS AUTOCONFIGURATION (SLAAC)</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight">
            Modified EUI-64 Interface Identifier &amp; Bit-Flipper
          </h3>
          <p className="text-xs text-[var(--foreground-muted)] mt-1">
            Visual breakdown of how Cisco routers convert a 48-bit IEEE MAC into a 64-bit IPv6 host ID.
          </p>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[var(--foreground-muted)] hidden sm:inline">Presets:</span>
          <button
            onClick={() => { setMacInput("0014.a82b.4711"); sounds.playKeyClick(); }}
            className="px-2.5 py-1 rounded bg-[var(--background-subtle)] border border-[var(--border)] text-[11px] font-mono hover:text-[var(--primary)]"
          >
            PC-A
          </button>
          <button
            onClick={() => { setMacInput("5254.0012.3456"); sounds.playKeyClick(); }}
            className="px-2.5 py-1 rounded bg-[var(--background-subtle)] border border-[var(--border)] text-[11px] font-mono hover:text-[var(--primary)]"
          >
            Catalyst SW
          </button>
          <button
            onClick={() => { setMacInput("a036.9f22.88aa"); sounds.playKeyClick(); }}
            className="px-2.5 py-1 rounded bg-[var(--background-subtle)] border border-[var(--border)] text-[11px] font-mono hover:text-[var(--primary)]"
          >
            ISR Router
          </button>
        </div>
      </div>

      {/* Input Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        <div>
          <label className="block text-[11px] font-mono text-[var(--foreground-muted)] mb-1">
            Source 48-bit Hardware MAC Address (Cisco or EUI Format)
          </label>
          <input
            type="text"
            value={macInput}
            onChange={(e) => setMacInput(e.target.value)}
            placeholder="e.g. 0014.a82b.4711"
            className="w-full px-3 py-2 rounded-lg bg-[var(--background-subtle)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)] focus:border-[var(--primary)] outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-mono text-[var(--foreground-muted)] mb-1">
            IPv6 Global /64 Routing Prefix
          </label>
          <input
            type="text"
            value={prefixInput}
            onChange={(e) => setPrefixInput(e.target.value)}
            placeholder="e.g. 2001:db8:acad:1"
            className="w-full px-3 py-2 rounded-lg bg-[var(--background-subtle)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)] focus:border-[var(--primary)] outline-none"
          />
        </div>
      </div>

      {/* 4-Step Interactive Visual Transformation Pipeline */}
      <div className="space-y-4">
        {/* Step 1: Split OUI and Vendor */}
        <div className="p-4 rounded-xl bg-[var(--background-subtle)] border border-[var(--border)]">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="font-bold text-[var(--primary)]">STEP 1: Split 48-bit MAC Address into Two 24-bit Halves</span>
            <span className="text-[var(--foreground-muted)]">3 Bytes + 3 Bytes</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-sm py-2">
            <div className="p-3 rounded-lg bg-[var(--card)] border border-cyan-500/30 text-center">
              <span className="text-[10px] text-cyan-400 block font-bold">24-BIT OUI (VENDOR)</span>
              <span className="font-black text-cyan-300 text-base">{oui}</span>
            </div>
            <div className="text-[var(--foreground-muted)] font-bold text-lg">+</div>
            <div className="p-3 rounded-lg bg-[var(--card)] border border-purple-500/30 text-center">
              <span className="text-[10px] text-purple-400 block font-bold">24-BIT NIC EXTENSION</span>
              <span className="font-black text-purple-300 text-base">{nic}</span>
            </div>
          </div>
        </div>

        {/* Step 2: Insert FF:FE */}
        <div className="p-4 rounded-xl bg-[var(--background-subtle)] border border-[var(--border)]">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="font-bold text-amber-400">STEP 2: Insert 16-bit Reserved Hex Constant 0xFFFE in the Center</span>
            <span className="text-[var(--foreground-muted)]">Expands 48-bit &rarr; 64-bit</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-sm py-2">
            <span className="px-3 py-1.5 rounded bg-[var(--card)] border border-cyan-500/30 text-cyan-300 font-bold">{oui}</span>
            <span className="px-3 py-1.5 rounded bg-amber-500/15 border border-amber-500/40 text-amber-400 font-black animate-pulse">ff:fe</span>
            <span className="px-3 py-1.5 rounded bg-[var(--card)] border border-purple-500/30 text-purple-300 font-bold">{nic}</span>
          </div>
        </div>

        {/* Step 3: Flip the 7th Bit (U/L Bit) */}
        <div className="p-4 rounded-xl bg-[var(--terminal-bg)] border border-[var(--terminal-border)] font-mono text-xs text-[var(--terminal-out)]">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--terminal-border)] text-emerald-400 font-bold">
            <span className="flex items-center gap-1.5">
              <Binary className="w-4 h-4" />
              <span>STEP 3: Invert the 7th Bit (Universal / Local Flag) in 1st Byte</span>
            </span>
            <span className="text-slate-400 text-[11px]">RFC 4291 Standard</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 items-center">
            <div className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)]">
              <span className="text-[10px] text-[var(--foreground-muted)] block">ORIGINAL 1ST BYTE (HEX {firstByteHex}):</span>
              <div className="flex items-center gap-1 text-sm font-black pt-1">
                {firstByteBin.split("").map((b, idx) => (
                  <span
                    key={idx}
                    className={`w-5 h-6 flex items-center justify-center rounded ${
                      idx === 6 ? "bg-rose-500/20 text-rose-400 border border-rose-500/40" : "text-slate-300"
                    }`}
                  >
                    {b}
                  </span>
                ))}
              </div>
              <span className="text-[9px] text-rose-400 mt-1 block">Bit 7 is index 1 from left (Value: {firstByteBin[6]})</span>
            </div>

            <div className="p-3 rounded-lg bg-[var(--background)] border border-emerald-500/30">
              <span className="text-[10px] text-emerald-400 block font-bold">FLIPPED 7TH BIT (HEX {flippedByteHex}):</span>
              <div className="flex items-center gap-1 text-sm font-black pt-1">
                {flippedByteBin.split("").map((b, idx) => (
                  <span
                    key={idx}
                    className={`w-5 h-6 flex items-center justify-center rounded ${
                      idx === 6 ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "text-slate-300"
                    }`}
                  >
                    {b}
                  </span>
                ))}
              </div>
              <span className="text-[9px] text-emerald-400 mt-1 block">XOR 0x02 &rarr; 7th bit inverted to {flippedByteBin[6]}</span>
            </div>
          </div>
        </div>

        {/* Step 4: Final Computed IPv6 Addresses */}
        <div className="p-4 rounded-xl bg-[var(--background-subtle)] border border-[var(--border)]">
          <span className="font-bold text-xs font-mono text-[var(--foreground)] block mb-3">
            STEP 4: Resulting EUI-64 Host Identifier &amp; Cisco Generated IPv6 Addresses
          </span>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--card)] border border-[var(--border)]">
              <div>
                <span className="text-[10px] font-mono text-[var(--primary)] font-bold block">64-BIT INTERFACE ID:</span>
                <span className="text-xs font-mono font-bold text-[var(--foreground)]">{interfaceId}</span>
              </div>
              <button
                onClick={() => handleCopy(interfaceId, "id")}
                className="p-1.5 rounded bg-[var(--background-subtle)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              >
                {copied === "id" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--card)] border border-[var(--border)]">
              <div>
                <span className="text-[10px] font-mono text-amber-400 font-bold block">LINK-LOCAL ADDRESS (FE80::):</span>
                <span className="text-xs font-mono font-bold text-amber-300">{linkLocal}</span>
              </div>
              <button
                onClick={() => handleCopy(linkLocal, "ll")}
                className="p-1.5 rounded bg-[var(--background-subtle)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              >
                {copied === "ll" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--card)] border border-emerald-500/30">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold block">GLOBAL UNICAST SLAAC ADDRESS:</span>
                <span className="text-xs font-mono font-bold text-emerald-300">{globalUnicast}</span>
              </div>
              <button
                onClick={() => handleCopy(globalUnicast, "gua")}
                className="p-1.5 rounded bg-[var(--background-subtle)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              >
                {copied === "gua" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
