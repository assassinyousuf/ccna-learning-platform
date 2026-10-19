"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  UserCheck,
  UserX,
  Clock,
  Search,
  Filter,
  Check,
  X,
  Trash2,
  KeyRound,
  RotateCcw,
  Sparkles,
  ExternalLink,
  PlusCircle,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Mail,
  Shield,
  Activity,
  Award,
} from "lucide-react";
import { ClearanceGate } from "@/components/ClearanceGate";
import { sounds } from "@/lib/sound-effects";

interface AdminUserRecord {
  userId: string;
  email: string;
  name: string;
  joinedAt: string;
  role: "ADMIN" | "STUDENT";
  status: "PENDING" | "APPROVED" | "REJECTED";
  approvedAt?: string;
  approvedBy?: string;
}

interface AdminStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  admins: number;
}

export default function AdminPage() {
  return (
    <ClearanceGate requireAdmin={true} resourceTitle="NOC Administrator Portal">
      <AdminDashboardContent />
    </ClearanceGate>
  );
}

function AdminDashboardContent() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    admins: 0,
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED" | "ADMIN">("ALL");

  // Pre-approve cadet state
  const [preEmail, setPreEmail] = useState("");
  const [preName, setPreName] = useState("");
  const [preRole, setPreRole] = useState<"STUDENT" | "ADMIN">("STUDENT");
  const [preLoading, setPreLoading] = useState(false);
  const [bannerNotice, setBannerNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Load all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to fetch admin users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showNotice = (text: string, type: "success" | "error" = "success") => {
    setBannerNotice({ text, type });
    setTimeout(() => {
      setBannerNotice(null);
    }, 4500);
  };

  // Perform user action
  const handleUserAction = async (
    userId: string,
    action: "APPROVE" | "REJECT" | "SET_ROLE" | "DELETE",
    role?: "ADMIN" | "STUDENT"
  ) => {
    setActionLoading(`${action}-${userId}`);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action, role }),
      });

      if (res.ok) {
        if (action === "APPROVE") {
          sounds.playExamPass();
          showNotice(`Cadet cleared and approved successfully!`);
        } else if (action === "REJECT") {
          sounds.playExamFail();
          showNotice(`Cadet clearance revoked.`, "error");
        } else if (action === "SET_ROLE") {
          sounds.playCommandSuccess();
          showNotice(`User role updated to ${role}.`);
        } else if (action === "DELETE") {
          sounds.playReset();
          showNotice(`User record deleted.`);
        }
        await fetchUsers();
      } else {
        showNotice("Failed to execute action.", "error");
      }
    } catch (err) {
      console.error(err);
      showNotice("Network error during admin action.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Pre-approve new email
  const handlePreApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preEmail.trim()) return;

    setPreLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "PRE_APPROVE",
          email: preEmail.trim(),
          name: preName.trim() || undefined,
          role: preRole,
        }),
      });

      if (res.ok) {
        sounds.playExamPass();
        showNotice(`Pre-clearance granted to ${preEmail}! They will have instant access upon signing in.`);
        setPreEmail("");
        setPreName("");
        await fetchUsers();
      } else {
        showNotice("Failed to pre-approve user.", "error");
      }
    } catch {
      showNotice("Network error during pre-approval.", "error");
    } finally {
      setPreLoading(false);
    }
  };

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Tab filter
      if (filterTab === "PENDING" && u.status !== "PENDING") return false;
      if (filterTab === "APPROVED" && u.status !== "APPROVED") return false;
      if (filterTab === "REJECTED" && u.status !== "REJECTED") return false;
      if (filterTab === "ADMIN" && u.role !== "ADMIN") return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = u.name?.toLowerCase().includes(q);
        const matchEmail = u.email?.toLowerCase().includes(q);
        const matchId = u.userId?.toLowerCase().includes(q);
        return matchName || matchEmail || matchId;
      }

      return true;
    });
  }, [users, filterTab, searchQuery]);

  return (
    <div className="min-h-screen bg-[#070b14] text-[var(--foreground)] pb-24">
      {/* ============================================================= */}
      {/* TOP COMMAND BANNER                                            */}
      {/* ============================================================= */}
      <div className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  NOC ADMINISTRATOR PORTAL
                </span>
                <span className="text-slate-500 text-xs font-mono">•</span>
                <span className="text-[11px] font-mono text-slate-400">
                  RBAC SECURITY PROTOCOL CCNA-AUTH-01
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                <span>Cadet Clearance &amp; Access Control</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                Authorize cadet registrations, approve pending cohort applicants,
                promote network administrators, and manage platform permissions.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchUsers}
                disabled={loading}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-mono transition-all hover:bg-slate-800"
              >
                <RotateCcw className={`w-3.5 h-3.5 text-cyan-400 ${loading ? "animate-spin" : ""}`} />
                <span>Refresh Directory</span>
              </button>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold font-mono transition-all shadow-md shadow-cyan-500/20"
              >
                <span>Cadet Cockpit →</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* ============================================================= */}
        {/* ACTION BANNER NOTIFICATION                                    */}
        {/* ============================================================= */}
        {bannerNotice && (
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-mono animate-in fade-in slide-in-from-top-2 duration-200 ${
              bannerNotice.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-rose-500/10 border-rose-500/30 text-rose-300"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {bannerNotice.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{bannerNotice.text}</span>
            </div>
            <button
              onClick={() => setBannerNotice(null)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ============================================================= */}
        {/* KPI OVERVIEW METRICS                                          */}
        {/* ============================================================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Cadets */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Total Registered
              </span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {stats.total}
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-1">
              Active directory user records
            </div>
          </div>

          {/* Pending Approvals (Highlighted) */}
          <div
            className={`p-5 rounded-2xl border backdrop-blur-sm relative overflow-hidden transition-all ${
              stats.pending > 0
                ? "bg-amber-500/10 border-amber-500/40 shadow-lg shadow-amber-500/10"
                : "bg-slate-900/60 border-slate-800/80"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-amber-300 uppercase tracking-wider flex items-center gap-1.5 font-bold">
                {stats.pending > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                )}
                Pending Clearance
              </span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-300">
              {stats.pending}
            </div>
            <div className="text-[10px] text-amber-400/80 font-mono mt-1">
              {stats.pending > 0 ? "Requires Administrator review" : "All cadets reviewed"}
            </div>
          </div>

          {/* Approved Cadets */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
                Approved &amp; Cleared
              </span>
              <UserCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300">
              {stats.approved}
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-1">
              Full blueprint &amp; exam access
            </div>
          </div>

          {/* Admins */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wider">
                Administrators
              </span>
              <ShieldCheck className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-300">
              {stats.admins}
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-1">
              Command level access
            </div>
          </div>
        </div>

        {/* ============================================================= */}
        {/* PRE-APPROVE CADET BOX                                         */}
        {/* ============================================================= */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-purple-950/20 border border-purple-500/20">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-purple-400" />
                <span>Grant Pre-Clearance Authorization</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Pre-approve an email in advance so that when the cadet logs in via Google OAuth or Credentials, their access is immediately unlocked.
              </p>
            </div>
          </div>

          <form onSubmit={handlePreApprove} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-5">
              <input
                type="email"
                required
                placeholder="cadet.student@university.edu"
                value={preEmail}
                onChange={(e) => setPreEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 font-mono"
              />
            </div>
            <div className="sm:col-span-4">
              <input
                type="text"
                placeholder="Cadet Name (Optional)"
                value={preName}
                onChange={(e) => setPreName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
              />
            </div>
            <div className="sm:col-span-3">
              <button
                type="submit"
                disabled={preLoading || !preEmail.trim()}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-mono transition-all shadow-md shadow-purple-600/30 disabled:opacity-50"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{preLoading ? "Authorizing..." : "Grant Pre-Clearance"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* ============================================================= */}
        {/* CADET DIRECTORY & PERMISSION CONTROLS                          */}
        {/* ============================================================= */}
        <div className="space-y-4">
          {/* Filter Bar & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 overflow-x-auto text-xs font-mono">
              <button
                onClick={() => setFilterTab("ALL")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterTab === "ALL"
                    ? "bg-slate-800 text-white font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                All ({users.length})
              </button>
              <button
                onClick={() => setFilterTab("PENDING")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  filterTab === "PENDING"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold"
                    : "text-amber-400/80 hover:text-amber-300"
                }`}
              >
                <span>Pending</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/30 text-amber-300">
                  {stats.pending}
                </span>
              </button>
              <button
                onClick={() => setFilterTab("APPROVED")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterTab === "APPROVED"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold"
                    : "text-slate-400 hover:text-emerald-400"
                }`}
              >
                Approved ({stats.approved})
              </button>
              <button
                onClick={() => setFilterTab("REJECTED")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterTab === "REJECTED"
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold"
                    : "text-slate-400 hover:text-rose-400"
                }`}
              >
                Revoked ({stats.rejected})
              </button>
              <button
                onClick={() => setFilterTab("ADMIN")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterTab === "ADMIN"
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold"
                    : "text-slate-400 hover:text-purple-400"
                }`}
              >
                Admins ({stats.admins})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[260px]">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by cadet name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Cadet Table */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Cadet Identity</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Clearance Status</th>
                    <th className="py-3 px-4">Registration Date</th>
                    <th className="py-3 px-4 text-right">Access Permission Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-500 font-mono">
                        No user records match the selected filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => {
                      const isPending = user.status === "PENDING";
                      const isApproved = user.status === "APPROVED";
                      const isRejected = user.status === "REJECTED";
                      const isUserRoleAdmin = user.role === "ADMIN";
                      const isSelf = user.email.toLowerCase() === session?.user?.email?.toLowerCase();

                      return (
                        <tr
                          key={user.userId}
                          className="hover:bg-slate-850/50 transition-colors group"
                        >
                          {/* Cadet Profile */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                                <img
                                  src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user.email}`}
                                  alt={user.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-bold text-white flex items-center gap-1.5">
                                  <span>{user.name}</span>
                                  {isSelf && (
                                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                      YOU
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                                  <Mail className="w-3 h-3 text-slate-500" />
                                  <span>{user.email}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Role */}
                          <td className="py-3.5 px-4 font-mono">
                            {isUserRoleAdmin ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                                <Shield className="w-3 h-3 text-purple-400" />
                                ADMIN
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                                CADET
                              </span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4 font-mono">
                            {isPending && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/40 animate-pulse">
                                <Clock className="w-3 h-3 text-amber-400" />
                                PENDING REVIEW
                              </span>
                            )}
                            {isApproved && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                                <Check className="w-3 h-3 text-emerald-400" />
                                CLEARED (APPROVED)
                              </span>
                            )}
                            {isRejected && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                                <X className="w-3 h-3 text-rose-400" />
                                REVOKED
                              </span>
                            )}
                          </td>

                          {/* Date Joined */}
                          <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                            {new Date(user.joinedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* 1. APPROVE BUTTON */}
                              {user.status !== "APPROVED" && (
                                <button
                                  onClick={() => handleUserAction(user.userId, "APPROVE")}
                                  disabled={actionLoading !== null}
                                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/25 text-emerald-300 font-mono text-[11px] font-bold transition-all disabled:opacity-50"
                                  title="Grant permission to cadet"
                                >
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span>Grant Access</span>
                                </button>
                              )}

                              {/* 2. REVOKE BUTTON */}
                              {user.status !== "REJECTED" && !isSelf && (
                                <button
                                  onClick={() => handleUserAction(user.userId, "REJECT")}
                                  disabled={actionLoading !== null}
                                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-300 font-mono text-[11px] transition-all disabled:opacity-50"
                                  title="Revoke clearance"
                                >
                                  <X className="w-3 h-3 text-rose-400" />
                                  <span>Revoke</span>
                                </button>
                              )}

                              {/* 3. TOGGLE ADMIN ROLE */}
                              {!isSelf && (
                                <button
                                  onClick={() =>
                                    handleUserAction(
                                      user.userId,
                                      "SET_ROLE",
                                      isUserRoleAdmin ? "STUDENT" : "ADMIN"
                                    )
                                  }
                                  disabled={actionLoading !== null}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-purple-500/20 border border-slate-700 hover:border-purple-500/40 text-slate-400 hover:text-purple-300 transition-all"
                                  title={isUserRoleAdmin ? "Demote to Student" : "Promote to Admin"}
                                >
                                  <KeyRound className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* 4. DELETE BUTTON */}
                              {!isSelf && (
                                <button
                                  onClick={() => {
                                    if (confirm(`Delete user record for ${user.email}?`)) {
                                      handleUserAction(user.userId, "DELETE");
                                    }
                                  }}
                                  disabled={actionLoading !== null}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 border border-slate-700 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 transition-all"
                                  title="Delete User Record"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
