import React from "react";
import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service | CCNA Learning Platform",
  description: "Terms of service and student usage guidelines for CCNA Learning Platform.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 mb-8"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Curriculum</span>
      </Link>

      <div className="space-y-8 text-slate-300 text-sm leading-relaxed">
        <div className="border-b border-slate-800 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono mb-4 border border-cyan-500/20">
            <FileText className="w-3.5 h-3.5" />
            <span>Student Terms & Guidelines</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Terms of Service</h1>
          <p className="text-xs text-slate-400 font-mono mt-2">Last updated: September 2024</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing and registering on the CCNA Learning Platform, you agree to comply with these Terms of Service. This platform is provided for educational and certification exam preparation purposes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">2. Permitted Use</h2>
          <p>You agree to use the platform in accordance with the following rules:</p>
          <ul className="list-disc pl-6 space-y-1 text-slate-400">
            <li>You may access the curriculum, simulated Cisco IOS terminal, flashcards, and review questions for personal study.</li>
            <li>Video submissions must reflect your own hands-on lab configurations and explanations.</li>
            <li>You may not attempt to compromise or reverse-engineer the platform infrastructure or server endpoints.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">3. Intellectual Property</h2>
          <p>
            The textbook content, chapter titles, review questions, diagrams, and pedagogical structure are authored by Jeremy McDowell (&quot;Acing the CCNA Exam&quot;, 2024). Cisco, CCNA, and Cisco IOS are registered trademarks of Cisco Systems, Inc.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">4. Disclaimer & Limitations</h2>
          <p>
            The learning materials and simulations are provided &quot;as is&quot; without warranty of any kind. While designed to comprehensively cover the Cisco CCNA 200-301 examination objectives, successful certification depends on individual study effort and diligence.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">5. Contact</h2>
          <p>
            For inquiries regarding these Terms, contact:{" "}
            <a href="mailto:mahbubhossain369@gmail.com" className="text-cyan-400 underline font-mono">
              mahbubhossain369@gmail.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
