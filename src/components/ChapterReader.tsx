"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  BookOpen,
  Terminal,
  Copy,
  Check,
  Maximize2,
  X,
  ZoomIn,
  ZoomOut,
  Sparkles,
  ChevronRight,
  List,
  Compass,
  ArrowUp
} from "lucide-react";

interface TocItem {
  title: string;
  anchor: string;
  level: number;
}

interface ChapterReaderProps {
  title: string;
  chapterNumber: number;
  volume: number;
  fullText: string;
  tableOfContents: TocItem[];
  keyPoints: string[];
}

export function ChapterReader({
  title,
  chapterNumber,
  volume,
  fullText,
  tableOfContents,
  keyPoints,
}: ChapterReaderProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeAnchor, setActiveAnchor] = useState<string>("");
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg">("base");

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(Math.round(progress));
      }

      // Check which heading is active
      const headings = document.querySelectorAll("h2[id], h3[id]");
      let currentActive = "";
      headings.forEach((h) => {
        const rect = h.getBoundingClientRect();
        if (rect.top <= 140) {
          currentActive = h.id;
        }
      });
      if (currentActive) setActiveAnchor(currentActive);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedText(code);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const scrollToAnchor = (anchor: string) => {
    const el = document.getElementById(anchor);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const fontSizeClasses = {
    sm: "text-xs sm:text-sm leading-relaxed",
    base: "text-sm sm:text-base leading-relaxed",
    lg: "text-base sm:text-lg leading-loose",
  };

  return (
    <div className="relative">
      {/* Sticky Top Reading Progress Bar */}
      <div className="sticky top-16 z-30 bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-md px-4 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Reading Chapter {chapterNumber}</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">
            {scrollProgress}% completed
          </span>
        </div>

        {/* Font Size Adjuster */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2 py-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase mr-1">Text:</span>
          <button
            onClick={() => setFontSize("sm")}
            className={`px-1.5 py-0.5 rounded text-xs font-mono transition-colors ${
              fontSize === "sm" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            A-
          </button>
          <button
            onClick={() => setFontSize("base")}
            className={`px-1.5 py-0.5 rounded text-xs font-mono transition-colors ${
              fontSize === "base" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            A
          </button>
          <button
            onClick={() => setFontSize("lg")}
            className={`px-1.5 py-0.5 rounded text-xs font-mono transition-colors ${
              fontSize === "lg" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            A+
          </button>
        </div>
      </div>

      {/* Progress Bar Line */}
      <div className="sticky top-[105px] z-30 w-full bg-slate-900 h-1">
        <div
          className="bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 h-1 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-6">
        {/* Left Sticky Table of Contents (On this page) */}
        <div className="lg:col-span-1 hidden lg:block">
          <div className="sticky top-32 space-y-6">
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md max-h-[calc(100vh-160px)] overflow-y-auto scrollbar-none">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold mb-3 tracking-wider uppercase">
                <List className="w-3.5 h-3.5" />
                <span>On This Page</span>
              </div>

              <nav className="space-y-1">
                {tableOfContents.map((item, idx) => {
                  const isActive = activeAnchor === item.anchor;
                  return (
                    <button
                      key={idx}
                      onClick={() => scrollToAnchor(item.anchor)}
                      className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs transition-all truncate block ${
                        item.level === 3 ? "pl-5 text-[11px]" : ""
                      } ${
                        isActive
                          ? "bg-cyan-500/10 text-cyan-300 font-semibold border-l-2 border-cyan-500"
                          : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                      }`}
                    >
                      {item.title}
                    </button>
                  );
                })}
              </nav>

              <div className="mt-6 pt-4 border-t border-slate-800/80">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  <ArrowUp className="w-3 h-3" />
                  <span>Back to Top</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Full Textbook Reading Area */}
        <div className="lg:col-span-3 space-y-8">
          {/* Key Objectives Banner from the Book */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-cyan-400 font-semibold mb-3 tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>This Chapter Covers</span>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {keyPoints.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Active Recall Callout */}
          <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex items-start gap-3.5">
            <Compass className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs text-cyan-200 leading-relaxed">
              <span className="font-bold text-cyan-300">Active Recall Philosophy: </span>
              &quot;Studying differs from simply reading passively. Stop occasionally to think about what you&apos;ve just read. Try to explain the concepts in your own words.&quot;
            </div>
          </div>

          {/* Complete Textbook Markdown Reader */}
          <article className={`p-8 sm:p-10 rounded-3xl bg-slate-900/40 border border-slate-800/80 shadow-2xl backdrop-blur-md prose prose-invert max-w-none prose-headings:text-white prose-p:text-slate-300 prose-strong:text-white prose-code:text-cyan-300 prose-code:bg-slate-950 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-table:border prose-table:border-slate-800 ${fontSizeClasses[fontSize]}`}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Auto-generate anchor IDs for headings
                h2: ({ node, children, ...props }) => {
                  const text = String(children);
                  const anchor = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                  return (
                    <h2
                      id={anchor}
                      className="text-xl sm:text-2xl font-bold text-white pt-8 pb-2 border-b border-slate-800/80 scroll-mt-36 group flex items-center justify-between"
                      {...props}
                    >
                      <span>{children}</span>
                      <a
                        href={`#${anchor}`}
                        className="text-slate-600 hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity text-sm font-mono ml-2"
                        title="Link to section"
                      >
                        #
                      </a>
                    </h2>
                  );
                },
                h3: ({ node, children, ...props }) => {
                  const text = String(children);
                  const anchor = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                  return (
                    <h3
                      id={anchor}
                      className="text-lg sm:text-xl font-bold text-white pt-6 pb-1 scroll-mt-36"
                      {...props}
                    >
                      {children}
                    </h3>
                  );
                },
                // Interactive Click-to-Zoom Images
                img: ({ node, src, alt, ...props }) => {
                  if (!src) return null;
                  const imgSrc = typeof src === "string" ? src : "";
                  return (
                    <div className="my-8 p-3 rounded-2xl bg-slate-950 border border-slate-800/90 group">
                      <div
                        onClick={() => setLightboxImage({ src: imgSrc, alt: alt || "Textbook Figure" })}
                        className="relative cursor-zoom-in overflow-hidden rounded-xl bg-slate-950/60 flex items-center justify-center min-h-[180px]"
                      >
                        <img
                          src={imgSrc}
                          alt={alt || "Textbook Figure"}
                          className="max-h-[460px] w-auto object-contain mx-auto transition-transform duration-300 group-hover:scale-[1.02]"
                          loading="lazy"
                        />
                        <div className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-slate-900/90 border border-slate-700 text-[10px] font-mono text-slate-300 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Maximize2 className="w-3 h-3 text-cyan-400" />
                          <span>Click to Zoom</span>
                        </div>
                      </div>
                      {alt && (
                        <p className="text-[11px] text-slate-400 font-mono text-center mt-2.5 px-2">
                          {alt}
                        </p>
                      )}
                    </div>
                  );
                },
                // Styled Cisco CLI Code Blocks with 1-Click Copy
                pre: ({ children, ...props }) => (
                  <div className="my-6 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl">
                    <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                        </div>
                        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 ml-2">
                          <Terminal className="w-3 h-3 text-cyan-400" />
                          Cisco IOS CLI
                        </span>
                      </div>
                    </div>
                    <pre className="p-4 text-xs sm:text-sm font-mono text-cyan-300 overflow-x-auto" {...props}>
                      {children}
                    </pre>
                  </div>
                ),
                // Styled Tables
                table: ({ children, ...props }) => (
                  <div className="my-6 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
                    <table className="w-full text-left text-xs border-collapse divide-y divide-slate-800" {...props}>
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children, ...props }) => (
                  <th className="py-3 px-4 bg-slate-900/80 font-mono text-slate-300 font-semibold" {...props}>
                    {children}
                  </th>
                ),
                td: ({ children, ...props }) => (
                  <td className="py-2.5 px-4 text-slate-300 border-t border-slate-800/60" {...props}>
                    {children}
                  </td>
                ),
                // Styled Blockquotes (Key Study Tips & Warnings)
                blockquote: ({ children, ...props }) => (
                  <blockquote
                    className="my-6 pl-4 border-l-4 border-cyan-500 bg-cyan-950/10 p-4 rounded-r-2xl text-xs text-cyan-200 not-italic"
                    {...props}
                  >
                    {children}
                  </blockquote>
                ),
              }}
            >
              {fullText}
            </ReactMarkdown>
          </article>
        </div>
      </div>

      {/* Image Zoom Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => {
            setLightboxImage(null);
            setZoomLevel(1);
          }}
        >
          <div
            className="relative max-w-6xl max-h-[90vh] bg-slate-950 border border-slate-800 rounded-3xl p-4 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Controls Header */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800">
              <span className="text-xs font-mono text-slate-300 truncate max-w-lg">
                {lightboxImage.alt}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoomLevel((prev) => Math.max(0.75, prev - 0.25))}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                  title="Zoom out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-cyan-400 px-1">{Math.round(zoomLevel * 100)}%</span>
                <button
                  onClick={() => setZoomLevel((prev) => Math.min(2.5, prev + 0.25))}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                  title="Zoom in"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setLightboxImage(null);
                    setZoomLevel(1);
                  }}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white ml-2"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Image Container with Zoom */}
            <div className="flex-1 overflow-auto flex items-center justify-center p-2 min-h-[300px]">
              <img
                src={lightboxImage.src}
                alt={lightboxImage.alt}
                className="max-h-[75vh] w-auto object-contain transition-transform duration-200"
                style={{ transform: `scale(${zoomLevel})` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
