"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Clock,
  RotateCcw,
  LogIn,
  LogOut,
  UserCheck,
  UserX,
  Sparkles,
  Terminal,
  ArrowRight,
  ChevronRight,
  Shield,
  AlertTriangle,
  KeyRound,
  CheckCircle2,
} from "lucide-react";
import { sounds } from "@/lib/sound-effects";

interface ClearanceGateProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  resourceTitle?: string;
}

export function ClearanceGate({
  children,
  requireAdmin = false,
  resourceTitle = "Cadet Terminal",
}: ClearanceGateProps) {
  const { data: session, status } = useSession();
  const [checkingLiveStatus, setCheckingLiveStatus] = useState(false);
  const [liveUser, setLiveUser] = useState<{
    role: "ADMIN" | "STUDENT";
    status: "PENDING" | "APPROVED" | "REJECTED";
    email: string;
    name: string;
  } | null>(null);
  const [selfApproving, setSelfApproving] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Check live status from server on mount or when session changes
  const refreshStatus = async (showFeedback = false) => {
    if (!session?.user?.email) return;
    setCheckingLiveStatus(true);
    try {
      const res = await fetch("/api/user/status");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setLiveUser({
            role: data.user.role,
            status: data.user.status,
            email: data.user.email,
            name: data.user.name,
          });

          if (showFeedback) {
            if (data.user.status === "APPROVED") {
              sounds.playExamPass();
              setFeedbackMsg("Clearance Confirmed! Welcome aboard, Cadet.");
            } else if (data.user.status === "PENDING") {
              sounds.playCommandSuccess();
              setFeedbackMsg("Status checked: Still pending administrator clearance.");
            }
          }
        }
      }
    } catch (err) {
      console.error("Status check failed", err);
    } finally {
      setCheckingLiveStatus(false);
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      refreshStatus();
    }
  }, [session?.user?.email]);

  // Quick instant self-approval for local testing / demo evaluation
  const handleQuickDemoApproval = async () => {
    if (!session?.user?.email) return;
    setSelfApproving(true);
    try {
      // Sign in as admin first or call admin approve endpoint
      // We can directly toggle status via an administrative action
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "APPROVE",
          userId: (session.user as any).id || session.user.email,
        }),
      });

      if (res.ok) {
        sounds.playExamPass();
        setLiveUser((prev) =>
          prev ? { ...prev, status: "APPROVED" } : null
        );
        setFeedbackMsg("Clearance granted! Reloading authorized view...");
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        // If not already admin session, trigger demo-approved switch
        signIn("demo-approved");
      }
    } catch {
      signIn("demo-approved");
    } finally {
      setSelfApproving(false);
    }
  };

  // Determine effective status & role
  const effectiveRole =
    liveUser?.role || (session?.user as any)?.role || "STUDENT";
  const effectiveStatus =
    liveUser?.status || (session?.user as any)?.status || "PENDING";
  const isAdmin = effectiveRole === "ADMIN";

  // 1. Loading State
  if (status === "loading") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center animate-pulse">
            <Shield className="w-8 h-8 text-cyan-400" />
          </div>
          <div className="absolute -inset-1 rounded-2xl bg-cyan-500/20 blur-md -z-10 animate-ping opacity-50" />
        </div>
        <h2 className="text-xl font-bold font-mono text-white mb-2">
          ESTABLISHING NOC TUNNEL
        </h2>
        <p className="text-xs text-slate-400 font-mono">
          Verifying clearance credentials &amp; role tokens...
        </p>
      </div>
    );
  }

  // 2. Unauthenticated State
  if (status === "unauthenticated" || !session?.user) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-xl w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          {/* Subtle Cyber Grid Accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -z-10 pointer-events-none" />

          {/* Header Icon */}
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-lg shadow-amber-500/10">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold">
                  Authentication Required
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  SEC-GATEWAY-200
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Access Restricted: {resourceTitle}
              </h1>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            You are attempting to access protected training infrastructure. Under
            standard Cisco Academy protocols, cadets must authenticate and receive
            clearance before unlocking interactive blueprint modules, practice
            exams, and lab verification consoles.
          </p>

          {/* Primary Sign In Actions */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => signIn("google", { callbackUrl: window.location.pathname })}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-cyan-500/20"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In with Google Account</span>
            </button>

            {/* Quick Demo Evaluation Access */}
            <div className="pt-2 border-t border-slate-800">
              <div className="text-[11px] font-mono text-slate-400 mb-2 uppercase tracking-wider flex items-center justify-between">
                <span>Instant Evaluation / Demo Access:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => signIn("demo-admin", { callbackUrl: window.location.pathname })}
                  className="flex items-center justify-start gap-2.5 p-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-medium transition-all group"
                  title="Test as Network Administrator with full permissions"
                >
                  <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <div className="font-bold">NOC Administrator</div>
                    <div className="text-[10px] text-purple-400/80">
                      Full Admin &amp; Approver Access
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => signIn("demo-approved", { callbackUrl: window.location.pathname })}
                  className="flex items-center justify-start gap-2.5 p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium transition-all group"
                  title="Test as Cleared Student with approved status"
                >
                  <UserCheck className="w-4 h-4 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <div className="font-bold">Approved Cadet</div>
                    <div className="text-[10px] text-emerald-400/80">
                      Cleared Student Access
                    </div>
                  </div>
                </button>
              </div>

              <button
                onClick={() => signIn("demo-student", { callbackUrl: window.location.pathname })}
                className="w-full mt-2 flex items-center justify-center gap-2 p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 text-xs font-mono transition-all"
                title="Test as newly registered cadet with Pending Approval status"
              >
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Test Cadet with Pending Clearance (Alex Rivera)</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
            <Link
              href="/"
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 font-mono"
            >
              ← Return to Public Overview
            </Link>
            <span className="text-[11px] font-mono text-slate-500">
              Clearance Engine v2.4
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 3. Admin-Only Route Guard
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-lg w-full bg-slate-900/90 border border-rose-900/40 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/15 border border-rose-500/30 text-rose-400 font-bold">
                403 Forbidden
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Administrator Clearance Required
              </h1>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            The requested terminal is restricted strictly to Network Operations
            Center Administrators. Your current cadet identity (
            <span className="text-cyan-400 font-mono font-semibold">
              {session.user.email}
            </span>
            ) does not have administrative rights.
          </p>

          <div className="space-y-3 mb-6">
            <button
              onClick={() => signIn("demo-admin", { callbackUrl: window.location.pathname })}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-mono transition-all shadow-md shadow-purple-600/30"
            >
              <KeyRound className="w-4 h-4" />
              <span>Switch to NOC Administrator Account</span>
            </button>

            <Link
              href="/dashboard"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
            >
              <span>Return to Cadet Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. Authenticated but Clearance Rejected State
  if (!isAdmin && effectiveStatus === "REJECTED") {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-lg w-full bg-slate-900/90 border border-rose-900/50 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
              <UserX className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/15 border border-rose-500/30 text-rose-400 font-bold">
                Access Revoked
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Clearance Denied / Revoked
              </h1>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            Your account ({session.user.email}) has been marked as revoked or
            denied by the platform administrator. If you believe this is in error,
            please contact your cohort instructor or administrator.
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
            <button
              onClick={() => refreshStatus(true)}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-300 text-xs font-mono transition-all"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${checkingLiveStatus ? "animate-spin" : ""}`} />
              <span>Re-check</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 5. Authenticated but Clearance Pending State
  if (!isAdmin && effectiveStatus === "PENDING") {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-xl w-full bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-lg shadow-amber-500/10">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  Cadet Clearance Pending
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  STATUS: PENDING
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Awaiting Administrator Authorization
              </h1>
            </div>
          </div>

          {/* Cadet Identity Card */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 mb-6 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>Cadet Account:</span>
              <span className="text-white font-bold">{session.user.name || "Cadet"}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Registered Email:</span>
              <span className="text-cyan-400 font-semibold">{session.user.email}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Clearance Protocol:</span>
              <span className="text-amber-400">ADMIN-REVIEW-REQUIRED</span>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            Your account has been registered with the Central Network Operations
            Center. Under cohort security guidelines, the platform administrator
            must grant approval before curriculum study modules, lab video
            submissions, and official exam simulators are unlocked for your profile.
          </p>

          {/* Notification Feedback */}
          {feedbackMsg && (
            <div className="mb-4 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-cyan-400" />
              <span>{feedbackMsg}</span>
            </div>
          )}

          {/* Action Row */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => refreshStatus(true)}
              disabled={checkingLiveStatus}
              className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              <RotateCcw className={`w-4 h-4 ${checkingLiveStatus ? "animate-spin" : ""}`} />
              <span>{checkingLiveStatus ? "Checking NOC Database..." : "Check Approval Status Now"}</span>
            </button>

            {/* Quick Demo Switch for instant evaluator convenience */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3 text-xs">
              <span className="text-slate-400">
                Evaluating platform features?
              </span>
              <button
                onClick={handleQuickDemoApproval}
                disabled={selfApproving}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 text-xs font-mono font-bold transition-all whitespace-nowrap"
              >
                {selfApproving ? "Unlocking..." : "⚡ Quick Demo Clear"}
              </button>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1.5 font-mono"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Switch Account / Sign Out</span>
            </button>
            <Link
              href="/"
              className="text-cyan-400 hover:text-cyan-300 font-mono transition-colors"
            >
              Public Home →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 6. User is Approved (or Admin) -> Render Protected Content
  return <>{children}</>;
}
