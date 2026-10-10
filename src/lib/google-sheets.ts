import { google } from "googleapis";

export interface UserRecord {
  userId: string;
  email: string;
  name: string;
  joinedAt: string;
}

export interface QuizAttemptRecord {
  attemptId: string;
  userId: string;
  userEmail: string;
  moduleId: string;
  moduleTitle?: string;
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  timestamp: string;
}

export interface DomainScoreSummary {
  total: number;
  correct: number;
  percentage: number;
  name: string;
}

export interface ExamAttemptRecord {
  attemptId: string;
  userId: string;
  userEmail: string;
  examMode: string;
  examTitle: string;
  scaledScore: number;
  rawScore: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  domainScores: Record<string, DomainScoreSummary>;
  timeTakenSeconds: number;
  timestamp: string;
}

export interface VideoSubmissionRecord {
  submissionId: string;
  userId: string;
  userEmail: string;
  moduleId: string;
  driveFileId: string;
  driveUrl: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedAt: string;
}

// In-memory fallback for development when Google credentials are not yet configured
const inMemoryStore = {
  users: new Map<string, UserRecord>(),
  progress: new Map<string, Record<string, string>>(), // userId -> { moduleId: "COMPLETED" | "READ" | "IN_PROGRESS" }
  quizAttempts: [] as QuizAttemptRecord[],
  examAttempts: [] as ExamAttemptRecord[],
  videoSubmissions: [] as VideoSubmissionRecord[],
};

function getSheetsClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!email || !privateKey) {
    return null;
  }

  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

export async function recordUser(user: UserRecord): Promise<void> {
  const sheets = getSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  if (!sheets || !spreadsheetId) {
    inMemoryStore.users.set(user.userId, user);
    return;
  }

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Users!A:D",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[user.userId, user.email, user.name, user.joinedAt]],
      },
    });
  } catch (error) {
    console.error("Error writing user to Google Sheets:", error);
    inMemoryStore.users.set(user.userId, user);
  }
}

export async function recordQuizAttempt(attempt: QuizAttemptRecord): Promise<void> {
  const sheets = getSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  inMemoryStore.quizAttempts.push(attempt);

  // Update progress
  if (!inMemoryStore.progress.has(attempt.userId)) {
    inMemoryStore.progress.set(attempt.userId, {});
  }
  const userProgress = inMemoryStore.progress.get(attempt.userId)!;
  if (attempt.passed) {
    userProgress[`${attempt.moduleId}_quiz`] = "PASSED";
  }

  if (!sheets || !spreadsheetId) {
    return;
  }

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Quiz_Results!A:I",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            attempt.attemptId,
            attempt.userId,
            attempt.userEmail,
            attempt.moduleId,
            attempt.score,
            attempt.total,
            `${attempt.percentage}%`,
            attempt.passed ? "PASSED" : "FAILED",
            attempt.timestamp,
          ],
        ],
      },
    });
  } catch (error) {
    console.error("Error writing quiz attempt to Google Sheets:", error);
  }
}

export async function recordVideoSubmission(sub: VideoSubmissionRecord): Promise<void> {
  const sheets = getSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  inMemoryStore.videoSubmissions.push(sub);

  // Update progress
  if (!inMemoryStore.progress.has(sub.userId)) {
    inMemoryStore.progress.set(sub.userId, {});
  }
  const userProgress = inMemoryStore.progress.get(sub.userId)!;
  userProgress[`${sub.moduleId}_video`] = "SUBMITTED";
  userProgress[sub.moduleId] = "COMPLETED"; // Module fully unlocked and completed

  if (!sheets || !spreadsheetId) {
    return;
  }

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Video_Submissions!A:G",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            sub.submissionId,
            sub.userId,
            sub.userEmail,
            sub.moduleId,
            sub.driveFileId,
            sub.driveUrl,
            sub.status,
            sub.submittedAt,
          ],
        ],
      },
    });
  } catch (error) {
    console.error("Error writing video submission to Google Sheets:", error);
  }
}

export async function getUserProgress(userId: string): Promise<Record<string, string>> {
  return inMemoryStore.progress.get(userId) || {
    "v1-ch1-introduction-to-the-ccna": "IN_PROGRESS",
  };
}

export async function recordChapterProgress(
  userId: string,
  moduleId: string,
  status: "COMPLETED" | "READ" | "IN_PROGRESS" | "UNMARKED"
): Promise<Record<string, string>> {
  if (!inMemoryStore.progress.has(userId)) {
    inMemoryStore.progress.set(userId, {});
  }
  const userProgress = inMemoryStore.progress.get(userId)!;
  if (status === "UNMARKED") {
    delete userProgress[moduleId];
  } else {
    userProgress[moduleId] = status;
  }
  return userProgress;
}

export async function getUserSubmissions(userId: string): Promise<VideoSubmissionRecord[]> {
  return inMemoryStore.videoSubmissions.filter((s) => s.userId === userId);
}

export async function getUserQuizAttempts(userId: string): Promise<QuizAttemptRecord[]> {
  return inMemoryStore.quizAttempts.filter((a) => a.userId === userId);
}

export async function recordExamAttempt(attempt: ExamAttemptRecord): Promise<void> {
  const sheets = getSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  inMemoryStore.examAttempts.unshift(attempt);

  // Update progress
  if (!inMemoryStore.progress.has(attempt.userId)) {
    inMemoryStore.progress.set(attempt.userId, {});
  }
  const userProgress = inMemoryStore.progress.get(attempt.userId)!;
  userProgress[`exam_${attempt.examMode.toLowerCase()}`] = attempt.passed ? "PASSED" : "ATTEMPTED";

  if (!sheets || !spreadsheetId) {
    return;
  }

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Exam_Results!A:K",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            attempt.attemptId,
            attempt.userId,
            attempt.userEmail,
            attempt.examMode,
            attempt.scaledScore,
            `${attempt.rawScore}/${attempt.totalQuestions}`,
            `${attempt.percentage}%`,
            attempt.passed ? "PASSED" : "FAILED",
            `${Math.round(attempt.timeTakenSeconds / 60)} min`,
            JSON.stringify(attempt.domainScores),
            attempt.timestamp,
          ],
        ],
      },
    });
  } catch (error) {
    console.error("Error writing exam attempt to Google Sheets:", error);
  }
}

export async function getUserExamAttempts(userId: string): Promise<ExamAttemptRecord[]> {
  return inMemoryStore.examAttempts.filter((a) => a.userId === userId);
}

export interface DomainMasterySummary {
  id: string;
  name: string;
  weight: number;
  percentage: number;
  totalQuestions: number;
  correctQuestions: number;
  status: "MASTERED" | "PROFICIENT" | "DEVELOPING" | "NEEDS_PRACTICE";
}

export interface ProfileSummary {
  userId: string;
  totalChapters: number;
  completedChaptersCount: number;
  chaptersReadCount: number;
  quizzesTaken: number;
  quizzesPassed: number;
  averageQuizScore: number;
  examsTaken: number;
  highestExamScore: number;
  latestExamScore: number;
  examPassCount: number;
  readinessScore: number; // 300 - 1000
  readinessLevel: "CERTIFICATION_READY" | "COMPETENT_PRACTICING" | "DEVELOPING_FOUNDATIONS" | "JUST_STARTED";
  domainMastery: DomainMasterySummary[];
  recentActivities: Array<{
    id: string;
    type: "EXAM" | "QUIZ" | "CHAPTER" | "LAB_VIDEO";
    title: string;
    score?: string;
    passed?: boolean;
    timestamp: string;
  }>;
}

const DEFAULT_DOMAINS = [
  { id: "1.0", name: "Network Fundamentals", weight: 0.20 },
  { id: "2.0", name: "Network Access", weight: 0.20 },
  { id: "3.0", name: "IP Connectivity", weight: 0.25 },
  { id: "4.0", name: "IP Services", weight: 0.10 },
  { id: "5.0", name: "Security Fundamentals", weight: 0.15 },
  { id: "6.0", name: "Automation & Programmability", weight: 0.10 },
];

export async function getUserProfileSummary(userId: string): Promise<ProfileSummary> {
  const userProgress = inMemoryStore.progress.get(userId) || {};
  const quizAttempts = inMemoryStore.quizAttempts.filter((a) => a.userId === userId);
  const examAttempts = inMemoryStore.examAttempts.filter((a) => a.userId === userId);
  const videoSubs = inMemoryStore.videoSubmissions.filter((s) => s.userId === userId);

  // Chapters completed (any module with status COMPLETED or READ)
  const completedChaptersCount = Object.entries(userProgress).filter(
    ([k, v]) => !k.includes("_") && (v === "COMPLETED" || v === "READ")
  ).length;

  const chaptersReadCount = Object.entries(userProgress).filter(
    ([k, v]) => !k.includes("_") && v === "READ"
  ).length;

  // Quiz statistics
  const quizzesTaken = quizAttempts.length;
  const quizzesPassed = quizAttempts.filter((q) => q.passed).length;
  const averageQuizScore =
    quizzesTaken > 0
      ? Math.round(quizAttempts.reduce((acc, curr) => acc + curr.percentage, 0) / quizzesTaken)
      : 0;

  // Exam statistics
  const examsTaken = examAttempts.length;
  const highestExamScore =
    examsTaken > 0 ? Math.max(...examAttempts.map((e) => e.scaledScore)) : 0;
  const latestExamScore = examsTaken > 0 ? examAttempts[0].scaledScore : 0;
  const examPassCount = examAttempts.filter((e) => e.passed).length;

  // 6 Domain Mastery Aggregation
  const domainAggregates: Record<string, { total: number; correct: number }> = {
    "1.0": { total: 0, correct: 0 },
    "2.0": { total: 0, correct: 0 },
    "3.0": { total: 0, correct: 0 },
    "4.0": { total: 0, correct: 0 },
    "5.0": { total: 0, correct: 0 },
    "6.0": { total: 0, correct: 0 },
  };

  examAttempts.forEach((exam) => {
    if (exam.domainScores) {
      Object.entries(exam.domainScores).forEach(([dId, stats]) => {
        if (domainAggregates[dId]) {
          domainAggregates[dId].total += stats.total || 0;
          domainAggregates[dId].correct += stats.correct || 0;
        }
      });
    }
  });

  const domainMastery: DomainMasterySummary[] = DEFAULT_DOMAINS.map((dom) => {
    const agg = domainAggregates[dom.id] || { total: 0, correct: 0 };
    const pct = agg.total > 0 ? Math.round((agg.correct / agg.total) * 100) : 0;

    let status: DomainMasterySummary["status"] = "NEEDS_PRACTICE";
    if (pct >= 85) status = "MASTERED";
    else if (pct >= 75) status = "PROFICIENT";
    else if (pct >= 50) status = "DEVELOPING";

    return {
      id: dom.id,
      name: dom.name,
      weight: dom.weight,
      percentage: pct,
      totalQuestions: agg.total,
      correctQuestions: agg.correct,
      status,
    };
  });

  // Calculate Cisco Readiness Index (300 to 1000 scale)
  let readinessScore = 300;
  if (examsTaken > 0) {
    // 50% highest mock exam score + 30% quiz avg scaled + 20% completion progress
    const examPart = highestExamScore * 0.5;
    const quizPart = (averageQuizScore / 100) * 1000 * 0.3;
    const completionPart = (completedChaptersCount / 49) * 1000 * 0.2;
    readinessScore = Math.min(1000, Math.max(300, Math.round(examPart + quizPart + completionPart)));
  } else if (quizzesTaken > 0 || completedChaptersCount > 0) {
    const quizPart = (averageQuizScore / 100) * 700 * 0.6;
    const completionPart = (completedChaptersCount / 49) * 700 * 0.4;
    readinessScore = Math.min(850, Math.max(300, Math.round(300 + quizPart + completionPart)));
  }

  let readinessLevel: ProfileSummary["readinessLevel"] = "JUST_STARTED";
  if (readinessScore >= 825) readinessLevel = "CERTIFICATION_READY";
  else if (readinessScore >= 700) readinessLevel = "COMPETENT_PRACTICING";
  else if (readinessScore >= 500) readinessLevel = "DEVELOPING_FOUNDATIONS";

  // Recent Activities
  const recentActivities: ProfileSummary["recentActivities"] = [];

  examAttempts.slice(0, 5).forEach((e) => {
    recentActivities.push({
      id: e.attemptId,
      type: "EXAM",
      title: `${e.examTitle || e.examMode} Simulator`,
      score: `${e.scaledScore} / 1000 (${e.percentage}%)`,
      passed: e.passed,
      timestamp: e.timestamp,
    });
  });

  quizAttempts.slice(0, 5).forEach((q) => {
    recentActivities.push({
      id: q.attemptId,
      type: "QUIZ",
      title: q.moduleTitle ? `${q.moduleTitle} Quiz` : `Chapter ${q.moduleId} Review Quiz`,
      score: `${q.score}/${q.total} (${q.percentage}%)`,
      passed: q.passed,
      timestamp: q.timestamp,
    });
  });

  videoSubs.slice(0, 3).forEach((s) => {
    recentActivities.push({
      id: s.submissionId,
      type: "LAB_VIDEO",
      title: `Lab Verification (${s.moduleId})`,
      score: s.status,
      passed: s.status === "APPROVED" || s.status === "PENDING",
      timestamp: s.submittedAt,
    });
  });

  recentActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return {
    userId,
    totalChapters: 49,
    completedChaptersCount,
    chaptersReadCount,
    quizzesTaken,
    quizzesPassed,
    averageQuizScore,
    examsTaken,
    highestExamScore,
    latestExamScore,
    examPassCount,
    readinessScore,
    readinessLevel,
    domainMastery,
    recentActivities: recentActivities.slice(0, 10),
  };
}

