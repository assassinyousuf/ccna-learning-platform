import React from "react";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | CCNA Learning Platform",
  description: "Privacy policy and Google user data handling for CCNA Learning Platform.",
};

export default function PrivacyPage() {
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
            <Shield className="w-3.5 h-3.5" />
            <span>Google OAuth & Data Compliance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Privacy Policy</h1>
          <p className="text-xs text-slate-400 font-mono mt-2">Last updated: September 2024</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">1. Overview</h2>
          <p>
            The CCNA Learning Platform is an educational web application designed to help students master Cisco CCNA 200-301 networking concepts through active recall and lab simulations, engineered by Md. Yousuf Hossain. We respect your privacy and are committed to protecting your personal information.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">2. Google User Data We Collect</h2>
          <p>When you register or sign in using Google OAuth, we only request access to basic identity scopes:</p>
          <ul className="list-disc pl-6 space-y-1 font-mono text-xs text-slate-400">
            <li><strong className="text-slate-200">Email address:</strong> To identify your account and record your course progress.</li>
            <li><strong className="text-slate-200">Full Name & Profile Avatar:</strong> To personalize your student dashboard experience.</li>
            <li><strong className="text-slate-200">Google Account ID:</strong> A unique identifier to authenticate your sessions.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">3. How We Use Your Data</h2>
          <p>Your data is used strictly for educational tracking purposes:</p>
          <ul className="list-disc pl-6 space-y-1 text-slate-400">
            <li>Tracking chapter reading completion, flashcard mastery, and quiz scores.</li>
            <li>Logging your lab verification video submissions to the student gradebook.</li>
            <li>We do NOT sell, rent, or monetize your personal data to third parties.</li>
            <li>We do NOT use your information for advertising purposes.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">4. Data Storage & Security</h2>
          <p>
            Student grades and progress records are securely synchronized with the instructor&apos;s Google Sheets gradebook. Student video proofs are stored within dedicated Google Drive cloud storage. All communication between your browser and our servers is encrypted via HTTPS / TLS.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">5. Contact Us</h2>
          <p>
            If you have questions regarding this Privacy Policy or your personal information, contact the administrator at:{" "}
            <a href="mailto:mahbubhossain369@gmail.com" className="text-cyan-400 underline font-mono">
              mahbubhossain369@gmail.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
