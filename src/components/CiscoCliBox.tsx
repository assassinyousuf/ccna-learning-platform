"use client";

import React, { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { sounds } from "@/lib/sound-effects";

interface CiscoCliBoxProps {
  command: string;
  description?: string;
}

export function CiscoCliBox({ command, description }: CiscoCliBoxProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    sounds.playCommandSuccess();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-xl border border-[var(--terminal-border)] bg-[var(--terminal-bg)] overflow-hidden shadow-md">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[var(--panel)] border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-[var(--primary)]" />
          <span className="text-[11px] font-mono text-[var(--foreground)] font-semibold">Cisco IOS CLI</span>
          {description && (
            <span className="text-[11px] text-[var(--foreground-muted)] hidden sm:inline-block ml-2 border-l border-[var(--border)] pl-2 font-sans">
              {description}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors py-1 px-2 rounded hover:bg-[var(--card)]"
          title="Copy command"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-mono text-[11px]">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span className="font-mono text-[11px]">Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3.5 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto text-[var(--terminal-cmd)]">
        <code>{command}</code>
      </pre>
    </div>
  );
}
