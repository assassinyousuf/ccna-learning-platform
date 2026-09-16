"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getModuleById } from "@/lib/curriculum";
import { CiscoCliBox } from "@/components/CiscoCliBox";
import {
  BookOpen,
  HelpCircle,
  Video,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Terminal,
  Clock,
  ExternalLink,
  Layers,
  Sparkles
} from "lucide-react";

export default function ModuleReaderPage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params.moduleId as string;
  const moduleData = getModuleById(moduleId);

  const [activeLessonIdx, setActiveLessonIdx] = useState(0);

  if (!moduleData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-white">Module Not Found</h1>
        <p className="text-xs text-slate-400 mt-2">The requested CCNA module does not exist.</p>
        <Link href="/" className="mt-6 inline-block text-cyan-400 font-mono text-sm underline">
          &larr; Return to Syllabus
        </Link>
      </div>
    );
  }

  const activeLesson = moduleData.lessons[activeLessonIdx] || moduleData.lessons[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
            <Link href="/" className="hover:text-cyan-400">Curriculum</Link>
            <span>/</span>
            <span className="text-cyan-400 font-semibold">Module 0{moduleData.number}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {moduleData.title}
          </h1>
        </div>

        {/* Milestone Action Links */}
        <div className="flex items-center gap-3">
          <Link
            href={`/modules/${moduleId}/quiz`}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Attempt Quiz ({moduleData.quiz.length} Qs)</span>
          </Link>
          <Link
            href={`/modules/${moduleId}/submit-video`}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 hover:opacity-90 transition-opacity"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Submit Lab Video</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <h3 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-3 tracking-wider">
              Lessons in this Module
            </h3>
            <div className="space-y-1.5">
              {moduleData.lessons.map((lesson, idx) => {
                const isActive = idx === activeLessonIdx;
                return (
                  <button
                    key={lesson.id}
                    onClick={() => setActiveLessonIdx(idx)}
                    className={`w-full text-left p-3 rounded-xl text-xs flex items-start gap-2.5 transition-all ${
                      isActive
                        ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-semibold shadow-sm"
                        : "text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent"
                    }`}
                  >
                    <span className="font-mono text-cyan-500 shrink-0 mt-0.5">
                      {idx + 1}.
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="truncate leading-tight">{lesson.title}</p>
                      <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" /> {lesson.readTime}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Assessment Milestones in Sidebar */}
            <div className="mt-6 pt-6 border-t border-slate-800 space-y-2">
              <h4 className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-2">
                Module Milestones
              </h4>
              <Link
                href={`/modules/${moduleId}/quiz`}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-400 hover:border-emerald-500/40"
              >
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Module Assessment Quiz</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href={`/modules/${moduleId}/submit-video`}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-purple-400 hover:border-purple-500/40"
              >
                <div className="flex items-center gap-2">
                  <Video className="w-3.5 h-3.5" />
                  <span>Practical Video Proof</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Lesson Reading Main Content */}
        <div className="lg:col-span-3 space-y-8">
          <article className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 shadow-xl backdrop-blur-md">
            {/* Lesson Header */}
            <div className="mb-6 pb-6 border-b border-slate-800/80">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
                <span>Lesson 0{activeLesson.number}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3.5 h-3.5" /> {activeLesson.readTime}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-snug">
                {activeLesson.title}
              </h2>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                {activeLesson.summary}
              </p>
            </div>

            {/* Key Points Summary Card */}
            <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 mb-8">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Key Learning Takeaways
              </h4>
              <ul className="space-y-2">
                {activeLesson.keyPoints.map((kp, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span>{kp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Diagrams Showcase */}
            {activeLesson.diagrams && activeLesson.diagrams.length > 0 && (
              <div className="my-8 space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Extracted Architecture &amp; Topologies
                </h4>
                {activeLesson.diagrams.map((diag, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden text-center">
                    <img
                      src={diag.src}
                      alt={diag.caption}
                      className="max-h-96 mx-auto rounded-lg object-contain shadow-md"
                    />
                    <p className="text-xs text-slate-400 mt-3 font-mono">
                      {diag.caption}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Cisco IOS Commands Showcase */}
            {activeLesson.ciscoCommands && activeLesson.ciscoCommands.length > 0 && (
              <div className="my-8">
                <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-2">
                  <Terminal className="w-4 h-4" /> Key Cisco IOS Commands
                </h4>
                {activeLesson.ciscoCommands.map((c, i) => (
                  <CiscoCliBox key={i} command={c.cmd} description={c.desc} />
                ))}
              </div>
            )}

            {/* Core Explanatory Text */}
            <div className="prose prose-invert prose-cyan max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
              <div className="whitespace-pre-wrap font-sans">
                {activeLesson.content}
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="mt-12 pt-6 border-t border-slate-800 flex items-center justify-between">
              {activeLessonIdx > 0 ? (
                <button
                  onClick={() => setActiveLessonIdx(activeLessonIdx - 1)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Lesson</span>
                </button>
              ) : <div />}

              {activeLessonIdx < moduleData.lessons.length - 1 ? (
                <button
                  onClick={() => setActiveLessonIdx(activeLessonIdx + 1)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold transition-colors"
                >
                  <span>Next Lesson</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <Link
                  href={`/modules/${moduleId}/quiz`}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 glow-emerald transition-opacity"
                >
                  <span>Take Module Quiz &rarr;</span>
                </Link>
              )}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
