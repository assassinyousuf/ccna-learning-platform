"use client";

import React, { useState, useEffect } from "react";
import { Edit3, Save, Trash2, Copy, Check, ChevronDown, ChevronUp, Sparkles, BookOpen } from "lucide-react";
import { sounds } from "@/lib/sound-effects";

interface ChapterNotesProps {
  moduleId: string;
  chapterTitle: string;
}

export function ChapterNotes({ moduleId, chapterTitle }: ChapterNotesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState("");
  const [savedTime, setSavedTime] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Load notes for this module
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`ccna_notes_${moduleId}`);
      if (saved) {
        setNote(saved);
        setSavedTime("Saved locally");
      }
    }
  }, [moduleId]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNote(val);
    sounds.playKeyClick();
    if (typeof window !== "undefined") {
      localStorage.setItem(`ccna_notes_${moduleId}`, val);
      setSavedTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(note);
    setCopied(true);
    sounds.playCommandSuccess();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear your notes for this chapter?")) {
      setNote("");
      if (typeof window !== "undefined") {
        localStorage.removeItem(`ccna_notes_${moduleId}`);
      }
      setSavedTime(null);
    }
  };

  const wordCount = note.trim() ? note.trim().split(/\s+/).length : 0;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md overflow-hidden transition-all">
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-900/90 hover:bg-slate-800/60 transition-colors text-left"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Edit3 className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">
              Active Recall Study Notes
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Pillar 1 Active Learning • {wordCount} words
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {savedTime && (
            <span className="text-[10px] text-emerald-400 font-mono hidden sm:inline">
              ✓ {savedTime}
            </span>
          )}
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </button>

      {/* Expandable Notes Area */}
      {isOpen && (
        <div className="p-4 space-y-3 border-t border-slate-800">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Notes for {chapterTitle}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                disabled={!note}
                className="hover:text-white flex items-center gap-1 disabled:opacity-30 transition-colors"
                title="Copy notes"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
              <span>•</span>
              <button
                onClick={handleClear}
                disabled={!note}
                className="hover:text-red-400 flex items-center gap-1 disabled:opacity-30 transition-colors"
                title="Clear notes"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          <textarea
            value={note}
            onChange={handleChange}
            placeholder="Jot down key acronyms, packet flow steps, or concepts you want to remember..."
            rows={5}
            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono placeholder-slate-600 focus:border-cyan-500 focus:outline-none resize-y leading-relaxed"
          />

          <div className="text-[10px] text-slate-500 font-mono text-right">
            Auto-saved to your browser storage
          </div>
        </div>
      )}
    </div>
  );
}
