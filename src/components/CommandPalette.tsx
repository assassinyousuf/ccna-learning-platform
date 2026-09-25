"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, BookOpen, Terminal, Calculator, X, ChevronRight, Hash, ArrowRight } from "lucide-react";
import { getAllModules } from "@/lib/curriculum";
import { sounds } from "@/lib/sound-effects";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSubnetCalc?: () => void;
}

export function CommandPalette({ isOpen, onClose, onOpenSubnetCalc }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const modules = getAllModules();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Build searchable items
  const results = React.useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      // Default recommended quick links
      return [
        {
          type: "action" as const,
          id: "act-subnet",
          title: "Open IPv4 Subnet Calculator",
          subtitle: "FLSM / VLSM 32-bit binary bitwise visualizer",
          icon: Calculator,
          action: () => {
            onClose();
            onOpenSubnetCalc?.();
          },
        },
        ...modules.slice(0, 5).map((m) => ({
          type: "chapter" as const,
          id: m.id,
          title: m.title,
          subtitle: `Vol ${m.volume} • Part ${m.partNumber}: ${m.partTitle}`,
          icon: BookOpen,
          action: () => {
            onClose();
            router.push(`/modules/${m.id}`);
          },
        })),
      ];
    }

    const matched: Array<{
      type: "chapter" | "command" | "action";
      id: string;
      title: string;
      subtitle: string;
      icon: any;
      action: () => void;
    }> = [];

    // Search modules
    modules.forEach((m) => {
      if (
        m.title.toLowerCase().includes(q) ||
        m.rawTitle.toLowerCase().includes(q) ||
        m.partTitle.toLowerCase().includes(q)
      ) {
        matched.push({
          type: "chapter",
          id: m.id,
          title: m.title,
          subtitle: `Vol ${m.volume} • Part ${m.partNumber}: ${m.partTitle}`,
          icon: BookOpen,
          action: () => {
            onClose();
            router.push(`/modules/${m.id}`);
          },
        });
      }

      // Search cisco commands inside module
      m.ciscoCommands?.forEach((c, cIdx) => {
        if (c.cmd.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)) {
          if (matched.length < 15) {
            matched.push({
              type: "command",
              id: `${m.id}-cmd-${cIdx}`,
              title: c.cmd,
              subtitle: `[${c.mode || "Cisco IOS"}] ${c.desc} • ${m.title}`,
              icon: Terminal,
              action: () => {
                onClose();
                router.push(`/modules/${m.id}?tab=commands`);
              },
            });
          }
        }
      });
    });

    return matched.slice(0, 10);
  }, [query, modules, onClose, onOpenSubnetCalc, router]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (results.length || 1));
      sounds.playKeyClick();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % (results.length || 1));
      sounds.playKeyClick();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[selectedIndex]) {
        sounds.playCommandSuccess();
        results[selectedIndex].action();
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-xl rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden"
        onKeyDown={handleKeyDown}
      >
        {/* Search Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800 bg-slate-900/50">
          <Search className="w-4 h-4 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
              sounds.playKeyClick();
            }}
            placeholder="Search all 49 chapters, Cisco commands, subnets... (e.g. OSPF, VLAN, ping)"
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none font-mono"
          />
          <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {results.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-slate-500">
              No results found for &quot;{query}&quot;
            </div>
          ) : (
            results.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = selectedIndex === idx;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    sounds.playCommandSuccess();
                    item.action();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-cyan-500/10 border-l-2 border-cyan-400 text-white"
                      : "text-slate-300 hover:bg-slate-900/60"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg ${
                      isSelected ? "bg-cyan-500/20 text-cyan-300" : "bg-slate-900 text-slate-400"
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate text-white">{item.title}</p>
                      <p className="text-[11px] text-slate-400 truncate font-mono">{item.subtitle}</p>
                    </div>
                  </div>

                  <ArrowRight className={`w-3.5 h-3.5 shrink-0 transition-opacity ${
                    isSelected ? "text-cyan-400 opacity-100" : "opacity-0"
                  }`} />
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-t border-slate-800 text-[10px] font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">↑/↓</kbd> Navigate</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">↵</kbd> Select</span>
          </div>
          <span className="text-cyan-400">CCNA Spotlight Search</span>
        </div>
      </div>
    </div>
  );
}
