import React from "react";
import Link from "next/link";
import { Network, Github, HardDrive, FileSpreadsheet } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950/60 py-12 mt-20 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-cyan-400" />
              <span className="font-bold text-white tracking-tight">
                CCNA<span className="text-cyan-400">.Academy</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              A cohort-based mastery platform for Cisco Certified Network Associate (CCNA 200-301), powered by Jeremy McDowell’s <em>Acing the CCNA Exam</em>. Study modules, pass rigorous quizzes, and prove hands-on mastery with video lab demos.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-[11px] font-mono px-2 py-1 rounded bg-slate-900 border border-slate-800 text-cyan-400 flex items-center gap-1">
                <HardDrive className="w-3 h-3" /> 5TB Google Drive Storage
              </span>
              <span className="text-[11px] font-mono px-2 py-1 rounded bg-slate-900 border border-slate-800 text-emerald-400 flex items-center gap-1">
                <FileSpreadsheet className="w-3 h-3" /> Google Sheets DB
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase text-slate-200 tracking-wider mb-3">
              Curriculum Tracks
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/modules/module-1-network-fundamentals" className="hover:text-cyan-400 transition-colors">
                  1. Network Fundamentals
                </Link>
              </li>
              <li>
                <Link href="/modules/module-2-network-access" className="hover:text-cyan-400 transition-colors">
                  2. Network Access & Switching
                </Link>
              </li>
              <li>
                <Link href="/modules/module-3-ip-connectivity" className="hover:text-cyan-400 transition-colors">
                  3. IP Connectivity & OSPF
                </Link>
              </li>
              <li>
                <Link href="/modules/module-4-ip-services" className="hover:text-cyan-400 transition-colors">
                  4. IP Services & NAT
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase text-slate-200 tracking-wider mb-3">
              Platform & Source
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://github.com/assassinyousuf/ccna-learning-platform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li>
                <span className="text-slate-500">Deploy: Vercel Edge</span>
              </li>
              <li>
                <span className="text-slate-500">Auth: Google OAuth 2.0</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-900 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 CCNA Learning Platform. Content based on Manning Publications.</p>
          <p className="font-mono text-[11px] text-slate-400">
            Learn → Quiz → Video Proof → Unlock
          </p>
        </div>
      </div>
    </footer>
  );
}
