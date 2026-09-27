"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getModuleById } from "@/lib/curriculum";
import confetti from "canvas-confetti";
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Award,
  ArrowRight,
  RotateCcw,
  Video,
  BookOpen,
  Sparkles
} from "lucide-react";

export default function ModuleQuizPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const moduleId = params.moduleId as string;
  const moduleData = getModuleById(moduleId);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<{
    score: number;
    total: number;
    percentage: number;
    passed: boolean;
  } | null>(null);

  if (!moduleData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-white">Module Not Found</h1>
        <Link href="/" className="mt-4 inline-block text-cyan-400 font-mono text-xs">
          Return to Syllabus
        </Link>
      </div>
    );
  }

  const quiz = moduleData.quiz;

  if (quiz.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 max-w-lg mx-auto">
          <BookOpen className="w-12 h-12 text-cyan-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Study Strategy &amp; Overview</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Chapter 1 introduces the CCNA certification structure and the 5-pillar active learning methodology. Official technical review quizzes begin in Chapter 2.
          </p>
          <div className="pt-4 flex items-center justify-center gap-3">
            <Link
              href={`/modules/${moduleId}`}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              Back to Chapter 1
            </Link>
            <Link
              href="/modules/v1-ch2-network-devices/quiz"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 hover:opacity-90 transition-opacity"
            >
              Go to Chapter 2 Quiz &rarr;
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = quiz[currentIdx];


  const handleSelect = (optionIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQ.id]: optionIdx,
    });
  };

  const handleSubmitQuiz = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleId,
          answers: selectedAnswers,
          userId: session?.user?.email || "guest-user",
          userEmail: session?.user?.email || "guest@ccna.academy",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResults({
          score: data.score,
          total: data.total,
          percentage: data.percentage,
          passed: data.passed,
        });
        setIsSubmitted(true);

        if (data.passed) {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      }
    } catch (err) {
      console.error("Quiz submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setResults(null);
    setCurrentIdx(0);
  };

  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-slate-800 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Module Assessment • 80% Passing Score</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          {moduleData.title} Quiz
        </h1>
        <p className="text-xs text-slate-400 mt-2">
          Test your mastery of Cisco protocols, addressing, and configuration concepts.
        </p>
      </div>

      {!isSubmitted ? (
        /* Active Question Card */
        <div className="space-y-6">
          {/* Stepper Progress Bar */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>
              Question {currentIdx + 1} of {quiz.length}
            </span>
            <span>{answeredCount} / {quiz.length} Answered</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / quiz.length) * 100}%` }}
            />
          </div>

          {/* Question Box */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl backdrop-blur-md">
            <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed mb-6">
              {currentQ.question}
            </h2>

            {/* Multiple Choice Options */}
            <div className="space-y-3">
              {currentQ.options.map((opt, oIdx) => {
                const isSelected = selectedAnswers[currentQ.id] === oIdx;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelect(oIdx)}
                    className={`w-full text-left p-4 rounded-2xl text-xs sm:text-sm flex items-start gap-3 transition-all ${
                      isSelected
                        ? "bg-cyan-500/10 border-2 border-cyan-500 text-cyan-200 font-medium glow-cyan"
                        : "bg-slate-950/80 border border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs shrink-0 mt-0.5 ${
                        isSelected
                          ? "bg-cyan-500 text-slate-950 font-bold"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span className="flex-1 leading-relaxed">{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="px-4 py-2 rounded-xl text-xs font-mono bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              &larr; Previous
            </button>

            {currentIdx < quiz.length - 1 ? (
              <button
                onClick={() => setCurrentIdx((prev) => Math.min(quiz.length - 1, prev + 1))}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
              >
                Next Question &rarr;
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                disabled={answeredCount < quiz.length || submitting}
                className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:opacity-90 glow-emerald transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Grading & Syncing to Sheets..." : "Submit Assessment"}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results Card */
        <div className="space-y-8">
          <div
            className={`p-8 rounded-3xl border text-center shadow-2xl ${
              results?.passed
                ? "bg-emerald-950/20 border-emerald-500/40 glow-emerald"
                : "bg-red-950/20 border-red-500/40"
            }`}
          >
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
              {results?.passed ? (
                <CheckCircle2 className="w-16 h-16 text-emerald-400" />
              ) : (
                <XCircle className="w-16 h-16 text-red-400" />
              )}
            </div>

            <h2 className="text-2xl font-black text-white">
              {results?.passed ? "Assessment Passed! 🎉" : "Passing Threshold Not Met"}
            </h2>

            <div className="flex items-center justify-center gap-4 my-4">
              <div className="text-center">
                <span className="text-3xl font-black font-mono text-cyan-400">
                  {results?.score} / {results?.total}
                </span>
                <p className="text-[11px] font-mono text-slate-400 uppercase">Correct Answers</p>
              </div>
              <div className="h-10 w-px bg-slate-800" />
              <div className="text-center">
                <span className="text-3xl font-black font-mono text-emerald-400">
                  {results?.percentage}%
                </span>
                <p className="text-[11px] font-mono text-slate-400 uppercase">Final Grade</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              {results?.passed
                ? "Your score has been logged to the central Google Sheet gradebook. You have qualified to record and submit your practical video lab demo!"
                : "A score of 80% or higher is required before proceeding to the video demonstration. Review the lesson materials and try again."}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {results?.passed ? (
                <Link
                  href={`/modules/${moduleId}/submit-video`}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:opacity-90 shadow-lg"
                >
                  <Video className="w-4 h-4" />
                  <span>Proceed to Video Lab Submission</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  onClick={handleRetake}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Assessment</span>
                </button>
              )}

              <Link
                href={`/modules/${moduleId}`}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              >
                <BookOpen className="w-4 h-4" />
                <span>Review Lessons</span>
              </Link>
            </div>
          </div>

          {/* Detailed Question Review with Explanations */}
          <div className="space-y-4">
            <h3 className="text-sm font-mono uppercase text-slate-400 font-semibold">
              Detailed Answer Key &amp; Explanations
            </h3>

            {quiz.map((q, idx) => {
              const studentAnswer = selectedAnswers[q.id];
              const isCorrect = studentAnswer === q.correctAnswer;

              return (
                <div
                  key={q.id}
                  className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="text-sm font-bold text-white">
                      {idx + 1}. {q.question}
                    </h4>
                    {isCorrect ? (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 shrink-0">
                        <XCircle className="w-3.5 h-3.5" /> Incorrect
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 font-mono">
                    Your answer: <span className={isCorrect ? "text-emerald-400" : "text-red-400"}>
                      {q.options[studentAnswer] || "None selected"}
                    </span>
                  </p>

                  {!isCorrect && (
                    <p className="text-xs text-emerald-400 font-mono">
                      Correct answer: {q.options[q.correctAnswer]}
                    </p>
                  )}

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    <span className="font-semibold text-cyan-400 font-mono">Explanation: </span>
                    {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
