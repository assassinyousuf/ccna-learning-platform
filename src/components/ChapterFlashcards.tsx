"use client";

import React, { useState, useEffect } from "react";
import { 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  Shuffle, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Layers,
  Award,
  Volume2,
  VolumeX
} from "lucide-react";
import { QuizQuestion } from "@/lib/curriculum";
import { sounds } from "@/lib/sound-effects";

interface FlashcardItem {
  id: string;
  front: string;
  back: string;
  category: string;
  explanation?: string;
}

interface ChapterFlashcardsProps {
  questions: QuizQuestion[];
  keyPoints?: string[];
  chapterTitle: string;
}

export function ChapterFlashcards({ questions, keyPoints = [], chapterTitle }: ChapterFlashcardsProps) {
  // Convert questions and keyPoints into flashcard deck
  const initialDeck: FlashcardItem[] = [
    ...questions.map((q) => ({
      id: `q-${q.id}`,
      front: q.question,
      back: q.options[q.correctAnswer] || q.officialAnswer || "Correct Answer",
      explanation: q.explanation,
      category: "Exam Question",
    })),
    ...keyPoints.map((kp, idx) => ({
      id: `kp-${idx}`,
      front: `Core Concept #${idx + 1}`,
      back: kp,
      category: "Key Concept",
    })),
  ];

  const [deck, setDeck] = useState<FlashcardItem[]>(initialDeck);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());
  const [reviewIds, setReviewIds] = useState<Set<string>>(new Set());

  const currentCard = deck[currentIndex];

  const flipCard = () => {
    sounds.playCardFlip();
    setIsFlipped(!isFlipped);
  };

  const nextCard = () => {
    if (currentIndex < deck.length - 1) {
      setIsFlipped(false);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const markMastered = () => {
    if (!currentCard) return;
    const newMastered = new Set(masteredIds);
    newMastered.add(currentCard.id);
    setMasteredIds(newMastered);

    const newReview = new Set(reviewIds);
    newReview.delete(currentCard.id);
    setReviewIds(newReview);

    sounds.playCommandSuccess();
    nextCard();
  };

  const markReview = () => {
    if (!currentCard) return;
    const newReview = new Set(reviewIds);
    newReview.add(currentCard.id);
    setReviewIds(newReview);

    const newMastered = new Set(masteredIds);
    newMastered.delete(currentCard.id);
    setMasteredIds(newMastered);

    sounds.playKeyClick();
    nextCard();
  };

  const shuffleDeck = () => {
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    sounds.playCardFlip();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === "Space") {
        e.preventDefault();
        flipCard();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        nextCard();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        prevCard();
      } else if (e.key === "1") {
        markReview();
      } else if (e.key === "2") {
        markMastered();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, isFlipped, deck, masteredIds, reviewIds]);

  if (!currentCard) {
    return (
      <div className="p-8 text-center text-slate-400">
        No flashcards available for this chapter yet.
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / deck.length) * 100);
  const masteryPercent = Math.round((masteredIds.size / deck.length) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Deck Stats & Controls */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <Layers className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Active Recall Flashcards</h3>
            <p className="text-xs text-slate-400">
              Card {currentIndex + 1} of {deck.length} • {chapterTitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> {masteredIds.size} Mastered
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1 text-amber-400">
              <XCircle className="w-3.5 h-3.5" /> {reviewIds.size} Review
            </span>
          </div>

          <button
            onClick={shuffleDeck}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium"
            title="Shuffle deck"
          >
            <Shuffle className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Shuffle</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800/80">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 3D Flashcard Stage */}
      <div
        className="w-full min-h-[360px] perspective-1000 cursor-pointer select-none group"
        onClick={flipCard}
      >
        <div
          className={`relative w-full min-h-[360px] rounded-3xl transition-transform duration-500 preserve-3d shadow-2xl ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* Card Front */}
          <div className="absolute inset-0 backface-hidden p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border-2 border-slate-800 group-hover:border-cyan-500/50 transition-colors flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-[11px] font-mono uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {currentCard.category}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Click or Space to Flip ⟳
              </span>
            </div>

            <div className="py-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-relaxed text-center">
                {currentCard.front}
              </h2>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-800/60 font-mono">
              <span>Card {currentIndex + 1} / {deck.length}</span>
              <span className="flex items-center gap-1 text-cyan-400">
                <RotateCw className="w-3.5 h-3.5" /> Reveal Answer
              </span>
            </div>
          </div>

          {/* Card Back */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-2 border-emerald-500/50 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-[11px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Official Answer
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Click or Space to Flip ⟳
              </span>
            </div>

            <div className="py-6 space-y-4 overflow-y-auto max-h-[220px] scrollbar-thin scrollbar-thumb-slate-800">
              <p className="text-lg sm:text-xl font-semibold text-emerald-300 text-center leading-relaxed">
                {currentCard.back}
              </p>
              {currentCard.explanation && (
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed font-mono">
                  <span className="text-cyan-400 font-bold block mb-1">Official Technical Explanation:</span>
                  {currentCard.explanation}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-800/60 font-mono">
              <span>Self-Assessment</span>
              <span className="text-emerald-400">Pillar 1 Active Recall</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Action Controls & Keyboard Hints */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={prevCard}
            disabled={currentIndex === 0}
            className="flex-1 sm:flex-initial p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Previous (Left Arrow)"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={flipCard}
            className="flex-1 sm:flex-initial px-6 py-3 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <RotateCw className="w-4 h-4 text-cyan-400" />
            <span>Flip Card (Space)</span>
          </button>
          <button
            onClick={nextCard}
            disabled={currentIndex === deck.length - 1}
            className="flex-1 sm:flex-initial p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Next (Right Arrow)"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={markReview}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
          >
            <XCircle className="w-4 h-4" />
            <span>Need Review [1]</span>
          </button>
          <button
            onClick={markMastered}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all glow-cyan"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mastered [2]</span>
          </button>
        </div>
      </div>
    </div>
  );
}
