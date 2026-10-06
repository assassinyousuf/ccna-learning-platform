import React from "react";
import Link from "next/link";
import { Network, Github, HardDrive, FileSpreadsheet, Globe, Linkedin, ExternalLink, Terminal, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background-subtle)] py-12 mt-20 text-[var(--foreground-muted)] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-[var(--primary)]" />
              <span className="font-bold text-sm tracking-tight text-[var(--foreground)]">
                CCNA<span className="text-[var(--primary)]">.Console</span>
              </span>
              <span className="telemetry-badge telemetry-badge-cyan">
                200-301
              </span>
            </div>
            <p className="text-xs text-[var(--foreground-muted)] max-w-md leading-relaxed">
              Enterprise training environment for Cisco Certified Network Associate (CCNA 200-301). Architected by{" "}
              <a
                href="https://yousuf.surf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--primary)] font-medium hover:underline inline-flex items-center gap-0.5"
              >
                Md. Yousuf Hossain
                <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
              </a>
              . Master 49 chapters, 367 live Cisco IOS CLI commands, 450 technical review questions, and hands-on video lab submissions.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="telemetry-badge">
                <HardDrive className="w-3 h-3 text-[var(--primary)]" /> 5TB Google Drive Storage
              </span>
              <span className="telemetry-badge">
                <FileSpreadsheet className="w-3 h-3 text-[var(--secondary)]" /> Google Sheets Sync
              </span>
              <span className="telemetry-badge">
                <Terminal className="w-3 h-3 text-purple-400" /> Catalyst / IOS CLI Engine
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-mono font-semibold uppercase text-[var(--foreground)] tracking-wider mb-3">
              Curriculum Core
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/practice-test" className="text-amber-500 font-semibold hover:underline flex items-center gap-1">
                  <span>★ CCNA Exam Simulator</span>
                </Link>
              </li>
              <li>
                <Link href="/modules/v1-ch1-introduction-to-the-ccna" className="hover:text-[var(--foreground)] transition-colors">
                  Vol 1: Intro to Networking
                </Link>
              </li>
              <li>
                <Link href="/modules/v1-ch6-ethernet-lan-switching" className="hover:text-[var(--foreground)] transition-colors">
                  Vol 1: Ethernet LAN Switching
                </Link>
              </li>
              <li>
                <Link href="/modules/v1-ch18-open-shortest-path-first" className="hover:text-[var(--foreground)] transition-colors">
                  Vol 1: OSPF Routing
                </Link>
              </li>
              <li>
                <Link href="/modules/v2-ch18-wireless-lan-fundamentals" className="hover:text-[var(--foreground)] transition-colors">
                  Vol 2: Wireless &amp; Security
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-mono font-semibold uppercase text-[var(--foreground)] tracking-wider mb-3">
              Engineering &amp; System
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://yousuf.surf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[var(--primary)] hover:underline"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>yousuf.surf (Portfolio)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/assassinyousuf/ccna-learning-platform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-[var(--foreground)] transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/mdyousufhossainmehrab/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-[var(--foreground)] transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5 text-[var(--primary)]" />
                  <span>LinkedIn Profile</span>
                </a>
              </li>
              <li className="pt-1">
                <Link href="/privacy" className="hover:text-[var(--foreground)] transition-colors">
                  Privacy Policy
                </Link>
                {" • "}
                <Link href="/terms" className="hover:text-[var(--foreground)] transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--border)] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--foreground-muted)] gap-4">
          <p>© 2026 CCNA Learning Platform. Engineered by <a href="https://yousuf.surf" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">Md. Yousuf Hossain</a>.</p>
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="telemetry-dot-online" />
            <span>NOC CONSOLE v2.4 • CISCO IOS EMULATION ACTIVE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
