"use client";

import React, { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";

interface CiscoCliBoxProps {
  command: string;
  description?: string;
}

export function CiscoCliBox({ command, description }: CiscoCliBoxProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-lg">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs font-mono text-slate-300 font-semibold">Cisco IOS CLI</span>
          {description && (
            <span className="text-[11px] text-slate-400 hidden sm:inline-block ml-2 border-l border-slate-800 pl-2 font-sans">
              {description}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors py-1 px-2 rounded hover:bg-slate-800"
          title="Copy command"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-mono">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="font-mono">Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 font-mono text-sm leading-relaxed overflow-x-auto text-cyan-300">
        <code>{command}</code>
      </pre>
    </div>
  );
}
