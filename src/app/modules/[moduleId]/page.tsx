"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getModuleById, getNextModule, getPreviousModule } from "@/lib/curriculum";
import { ChapterReader } from "@/components/ChapterReader";
import { CiscoTerminal } from "@/components/CiscoTerminal";
import { ChapterFlashcards } from "@/components/ChapterFlashcards";
import { ChapterNotes } from "@/components/ChapterNotes";
import { sounds } from "@/lib/sound-effects";
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
  Sparkles,
  Copy,
  Check,
  Laptop,
  Search,
  CheckSquare,
  Loader2,
  Zap
} from "lucide-react";

export default function ModuleReaderPage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params.moduleId as string;
  const moduleData = getModuleById(moduleId);
  const nextMod = getNextModule(moduleId);
  const prevMod = getPreviousModule(moduleId);

  const [activeTab, setActiveTab] = useState<"theory" | "simulator" | "flashcards" | "commands" | "lab" | "quiz" | "video">("theory");
  const [cmdSearch, setCmdSearch] = useState("");
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  // Full chapter textbook content state
  const [chapterFullData, setChapterFullData] = useState<any>(null);
  const [loadingTextbook, setLoadingTextbook] = useState(true);

  // Detect tab from URL parameter if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get("tab") as any;
      if (tabParam && ["theory", "simulator", "flashcards", "commands", "lab", "quiz", "video"].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  useEffect(() => {
    async function fetchFullChapter() {
      setLoadingTextbook(true);
      try {
        const res = await fetch(`/api/chapter/${moduleId}`);
        if (res.ok) {
          const data = await res.json();
          setChapterFullData(data);
        }
      } catch (e) {
        console.error("Failed to load full chapter:", e);
      } finally {
        setLoadingTextbook(false);
      }
    }
    fetchFullChapter();
  }, [moduleId]);

  if (!moduleData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-white">Chapter Not Found</h1>
        <p className="text-xs text-slate-400 mt-2">The requested CCNA chapter does not exist in the syllabus.</p>
        <Link href="/" className="mt-6 inline-block text-cyan-400 font-mono text-sm underline">
          &larr; Return to Curriculum
        </Link>
      </div>
    );
  }

  const handleCopy = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const filteredCommands = moduleData.ciscoCommands.filter(
    (c) =>
      c.cmd.toLowerCase().includes(cmdSearch.toLowerCase()) ||
      c.desc.toLowerCase().includes(cmdSearch.toLowerCase()) ||
      (c.mode && c.mode.toLowerCase().includes(cmdSearch.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
            <Link href="/" className="hover:text-cyan-400">Curriculum</Link>
            <span>/</span>
            <Link href={`/dashboard`} className="hover:text-cyan-400">Vol {moduleData.volume}</Link>
            <span>/</span>
            <span className="text-cyan-400 font-semibold">Part {moduleData.partNumber}: {moduleData.partTitle}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {moduleData.title}
          </h1>
        </div>

        {/* Milestone Action Links */}
        <div className="flex items-center gap-3">
          {prevMod && (
            <Link
              href={`/modules/${prevMod.id}`}
              className="p-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={`Previous: ${prevMod.title}`}
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
          )}

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

          {nextMod && (
            <Link
              href={`/modules/${nextMod.id}`}
              className="p-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={`Next: ${nextMod.title}`}
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {/* In-Chapter Active Recall Notes Scratchpad */}
      <div className="mb-6">
        <ChapterNotes moduleId={moduleId} chapterTitle={moduleData.title} />
      </div>

      {/* Active Learning Navigation Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 mb-8">
        <button
          onClick={() => {
            setActiveTab("theory");
            sounds.playKeyClick();
          }}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "theory"
              ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md glow-cyan"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">1. Text</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("simulator");
            sounds.playKeyClick();
          }}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold transition-all relative ${
            activeTab === "simulator"
              ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md glow-cyan"
              : "text-cyan-400 hover:text-white bg-cyan-500/5 border border-cyan-500/20"
          }`}
        >
          <Zap className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
          <span className="truncate">2. CLI Sim</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("flashcards");
            sounds.playKeyClick();
          }}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "flashcards"
              ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md glow-cyan"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Layers className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">3. Cards</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("commands");
            sounds.playKeyClick();
          }}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "commands"
              ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md glow-cyan"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Terminal className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">4. CLI Ref ({moduleData.ciscoCommands.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("lab");
            sounds.playKeyClick();
          }}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "lab"
              ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md glow-cyan"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Laptop className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">5. Lab</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("quiz");
            sounds.playKeyClick();
          }}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "quiz"
              ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md glow-cyan"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">6. Quiz ({moduleData.quiz.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("video");
            sounds.playKeyClick();
          }}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "video"
              ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md glow-cyan"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Video className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">7. Video</span>
        </button>
      </div>

      {/* Main Tab Content Display */}
      <div>
        {/* TAB 1: FULL TEXTBOOK CHAPTER READING WITH INTERACTIVE TOC & ZOOM */}
        {activeTab === "theory" && (
          <div>
            {loadingTextbook ? (
              <div className="p-16 text-center bg-slate-900/40 rounded-3xl border border-slate-800 space-y-4">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
                <p className="text-xs font-mono text-slate-400">
                  Loading complete interactive chapter text from &quot;Acing the CCNA Exam&quot;...
                </p>
              </div>
            ) : chapterFullData ? (
              <ChapterReader
                title={chapterFullData.title}
                chapterNumber={chapterFullData.chapterNumber}
                volume={chapterFullData.volume}
                fullText={chapterFullData.fullText}
                tableOfContents={chapterFullData.tableOfContents || []}
                keyPoints={chapterFullData.keyPoints || []}
              />
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                Could not load chapter content. Please refresh.
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INTERACTIVE CISCO IOS CLI SIMULATOR */}
        {activeTab === "simulator" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  <span>Interactive Cisco IOS Terminal Simulator</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase">
                    Live CLI
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Practice Cisco IOS commands directly in a simulated terminal environment with tab completion, history, and verification.
                </p>
              </div>
            </div>

            <CiscoTerminal
              initialHostname="Switch"
              title={`Cisco IOS Terminal • ${moduleData.title}`}
            />
          </div>
        )}

        {/* TAB 3: ACTIVE RECALL 3D FLASHCARDS */}
        {activeTab === "flashcards" && (
          <div className="space-y-6">
            <ChapterFlashcards
              questions={moduleData.quiz}
              keyPoints={moduleData.keyPoints}
              chapterTitle={moduleData.title}
            />
          </div>
        )}

        {/* TAB 2: APPENDIX B CLI COMMAND REFERENCE */}
        {activeTab === "commands" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-cyan-400" />
                  <span>Appendix B: Cisco IOS CLI Command Reference</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Cisco IOS commands covered in {moduleData.title}. Practice these syntax patterns inside Cisco Packet Tracer.
                </p>
              </div>

              {/* Command Search Filter */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter commands..."
                  value={cmdSearch}
                  onChange={(e) => setCmdSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {filteredCommands.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-2xl text-slate-400 text-xs">
                No matching Cisco IOS commands found for &quot;{cmdSearch}&quot;.
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-mono">
                      <th className="py-3 px-4 w-28">Mode</th>
                      <th className="py-3 px-4">Command</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4 w-20 text-right">Copy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {filteredCommands.map((c, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-3 px-4 text-cyan-400 font-bold whitespace-nowrap">
                          {c.mode || "#"}
                        </td>
                        <td className="py-3 px-4 text-emerald-300 font-semibold">
                          {c.cmd}
                        </td>
                        <td className="py-3 px-4 text-slate-300 font-sans text-xs">
                          {c.desc}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleCopy(c.cmd)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition-colors"
                            title="Copy command"
                          >
                            {copiedCmd === c.cmd ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PACKET TRACER LAB MISSION */}
        {activeTab === "lab" && (
          <div className="space-y-6">
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800 gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-2">
                    <Laptop className="w-3.5 h-3.5" />
                    <span>Pillar 03: Hands-On Labbing</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    Packet Tracer Lab: {moduleData.rawTitle}
                  </h3>
                </div>

                <a
                  href="http://mng.bz/2Kra"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors shrink-0"
                >
                  <span>Get Packet Tracer Free</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Lab Scenario */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
                    Lab Mission Scenario
                  </h4>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {moduleData.labMission.scenario}
                  </p>
                </div>

                {/* Lab Objectives */}
                <div className="pt-4 border-t border-slate-800">
                  <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">
                    Mission Objectives
                  </h4>
                  <ul className="space-y-2.5">
                    {moduleData.labMission.objectives.map((obj, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-xs text-slate-300">
                        <CheckSquare className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Verification Commands */}
                {moduleData.labMission.verificationCommands.length > 0 && (
                  <div className="pt-4 border-t border-slate-800">
                    <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">
                      Required Verification Commands
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {moduleData.labMission.verificationCommands.map((vCmd, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-xs flex items-center gap-2"
                        >
                          <Terminal className="w-3 h-3 text-emerald-500" />
                          <span>{vCmd}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Banner to Submit Video */}
              <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-950 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h5 className="text-sm font-bold text-white">Done with the Lab in Packet Tracer?</h5>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Record your screen and microphone explaining your configuration, and stream it to 5TB Google Drive.
                  </p>
                </div>
                <Link
                  href={`/modules/${moduleId}/submit-video`}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity shrink-0"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Submit Video Proof</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: APPENDIX C REVIEW QUIZ GATEWAY */}
        {activeTab === "quiz" && (
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center max-w-3xl mx-auto space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <HelpCircle className="w-8 h-8" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-2">
                <span>Appendix C &amp; D Official Question Bank</span>
              </div>
              <h3 className="text-2xl font-bold text-white">
                Chapter {moduleData.chapterNumber} Review Assessment
              </h3>
              <p className="text-xs text-slate-400 mt-2 max-w-lg mx-auto leading-relaxed">
                Test your mastery using official technical review questions from Appendix C. Full answers and comprehensive explanations from Appendix D will be unlocked upon submission.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-around text-xs font-mono">
              <div>
                <span className="text-slate-500">Total Questions:</span>
                <span className="text-white font-bold ml-1.5">{moduleData.quiz.length} Qs</span>
              </div>
              <div>
                <span className="text-slate-500">Passing Threshold:</span>
                <span className="text-emerald-400 font-bold ml-1.5">80%</span>
              </div>
              <div>
                <span className="text-slate-500">Explanations:</span>
                <span className="text-cyan-400 font-bold ml-1.5">Appendix D</span>
              </div>
            </div>

            <Link
              href={`/modules/${moduleId}/quiz`}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:opacity-95 transition-opacity glow-emerald text-sm shadow-xl"
            >
              <span>Start Chapter Quiz Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* TAB 5: ACTIVE VIDEO PROOF GATEWAY */}
        {activeTab === "video" && (
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center max-w-3xl mx-auto space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
              <Video className="w-8 h-8" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono mb-2">
                <span>Pillar 05: Active Recall &amp; Proof-of-Skill</span>
              </div>
              <h3 className="text-2xl font-bold text-white">
                Submit Video Proof: {moduleData.rawTitle}
              </h3>
              <p className="text-xs text-slate-400 mt-2 max-w-lg mx-auto leading-relaxed">
                {moduleData.labMission.videoSubmissionPrompt}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-around text-xs font-mono">
              <div>
                <span className="text-slate-500">Target Storage:</span>
                <span className="text-blue-400 font-bold ml-1.5">5TB Google Drive</span>
              </div>
              <div>
                <span className="text-slate-500">Gradebook:</span>
                <span className="text-emerald-400 font-bold ml-1.5">Google Sheets</span>
              </div>
              <div>
                <span className="text-slate-500">Recorder:</span>
                <span className="text-purple-400 font-bold ml-1.5">In-Browser Ready</span>
              </div>
            </div>

            <Link
              href={`/modules/${moduleId}/submit-video`}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-95 transition-opacity text-sm shadow-xl"
            >
              <span>Open Screen Recorder &amp; Uploader</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
