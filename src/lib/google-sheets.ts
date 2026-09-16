import { google } from "googleapis";

interface UserRecord {
  userId: string;
  email: string;
  name: string;
  joinedAt: string;
}

interface QuizAttemptRecord {
  attemptId: string;
  userId: string;
  userEmail: string;
  moduleId: string;
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  timestamp: string;
}

interface VideoSubmissionRecord {
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
  progress: new Map<string, Record<string, string>>(), // userId -> { moduleId: "COMPLETED" }
  quizAttempts: [] as QuizAttemptRecord[],
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
    "module-1-network-fundamentals": "IN_PROGRESS",
  };
}

export async function getUserSubmissions(userId: string): Promise<VideoSubmissionRecord[]> {
  return inMemoryStore.videoSubmissions.filter((s) => s.userId === userId);
}

export async function getUserQuizAttempts(userId: string): Promise<QuizAttemptRecord[]> {
  return inMemoryStore.quizAttempts.filter((a) => a.userId === userId);
}
