import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  UserRecord,
  UserRole,
  UserStatus,
  QuizAttemptRecord,
  ExamAttemptRecord,
  VideoSubmissionRecord,
} from "./google-sheets";

/**
 * Cloud Firestore Integration Layer
 * Persists Users, Approvals, Quizzes, Mock Exams, Progress and Labs directly into Firebase.
 */

// 1. Users Collection
export async function saveUserToFirestore(user: UserRecord): Promise<void> {
  try {
    const userRef = doc(db, "users", user.userId);
    await setDoc(
      userRef,
      {
        userId: user.userId,
        email: user.email.toLowerCase().trim(),
        name: user.name,
        joinedAt: user.joinedAt,
        role: user.role,
        status: user.status,
        ...(user.approvedAt ? { approvedAt: user.approvedAt } : {}),
        ...(user.approvedBy ? { approvedBy: user.approvedBy } : {}),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("[Firestore] saveUser error:", error);
  }
}

export async function fetchAllUsersFromFirestore(): Promise<UserRecord[]> {
  try {
    const usersCol = collection(db, "users");
    const snapshot = await getDocs(usersCol);
    const users: UserRecord[] = [];

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.email) {
        users.push({
          userId: data.userId || docSnap.id,
          email: data.email,
          name: data.name || "Cadet",
          joinedAt: data.joinedAt || new Date().toISOString(),
          role: (data.role as UserRole) || "STUDENT",
          status: (data.status as UserStatus) || "PENDING",
          approvedAt: data.approvedAt,
          approvedBy: data.approvedBy,
        });
      }
    });

    return users.sort(
      (a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()
    );
  } catch (error) {
    console.warn("[Firestore] fetchAllUsers error:", error);
    return [];
  }
}

export async function updateUserStatusInFirestore(
  userId: string,
  status: UserStatus,
  approvedBy?: string
): Promise<void> {
  try {
    const userRef = doc(db, "users", userId);
    const updatePayload: Record<string, any> = { status };
    if (status === "APPROVED") {
      updatePayload.approvedAt = new Date().toISOString();
      updatePayload.approvedBy = approvedBy || "Admin";
    }
    await updateDoc(userRef, updatePayload);
  } catch (error) {
    console.error("[Firestore] updateUserStatus error:", error);
  }
}

export async function updateUserRoleInFirestore(
  userId: string,
  role: UserRole
): Promise<void> {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { role });
  } catch (error) {
    console.error("[Firestore] updateUserRole error:", error);
  }
}

export async function deleteUserFromFirestore(userId: string): Promise<void> {
  try {
    const userRef = doc(db, "users", userId);
    await deleteDoc(userRef);
  } catch (error) {
    console.error("[Firestore] deleteUser error:", error);
  }
}

// 2. Quiz Attempts Collection
export async function saveQuizAttemptToFirestore(
  attempt: QuizAttemptRecord
): Promise<void> {
  try {
    const attemptRef = doc(db, "quiz_attempts", attempt.attemptId);
    await setDoc(attemptRef, attempt, { merge: true });
  } catch (error) {
    console.error("[Firestore] saveQuizAttempt error:", error);
  }
}

export async function fetchUserQuizAttemptsFromFirestore(
  userId: string
): Promise<QuizAttemptRecord[]> {
  try {
    const q = query(
      collection(db, "quiz_attempts"),
      where("userId", "==", userId)
    );
    const snapshot = await getDocs(q);
    const attempts: QuizAttemptRecord[] = [];
    snapshot.forEach((docSnap) => {
      attempts.push(docSnap.data() as QuizAttemptRecord);
    });
    return attempts.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error) {
    console.warn("[Firestore] fetchUserQuizAttempts error:", error);
    return [];
  }
}

// 3. Exam Attempts Collection
export async function saveExamAttemptToFirestore(
  attempt: ExamAttemptRecord
): Promise<void> {
  try {
    const attemptRef = doc(db, "exam_attempts", attempt.attemptId);
    await setDoc(attemptRef, attempt, { merge: true });
  } catch (error) {
    console.error("[Firestore] saveExamAttempt error:", error);
  }
}

export async function fetchUserExamAttemptsFromFirestore(
  userId: string
): Promise<ExamAttemptRecord[]> {
  try {
    const q = query(
      collection(db, "exam_attempts"),
      where("userId", "==", userId)
    );
    const snapshot = await getDocs(q);
    const attempts: ExamAttemptRecord[] = [];
    snapshot.forEach((docSnap) => {
      attempts.push(docSnap.data() as ExamAttemptRecord);
    });
    return attempts.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error) {
    console.warn("[Firestore] fetchUserExamAttempts error:", error);
    return [];
  }
}

// 4. Video Submissions Collection
export async function saveVideoSubmissionToFirestore(
  sub: VideoSubmissionRecord
): Promise<void> {
  try {
    const subRef = doc(db, "video_submissions", sub.submissionId);
    await setDoc(subRef, sub, { merge: true });
  } catch (error) {
    console.error("[Firestore] saveVideoSubmission error:", error);
  }
}

export async function fetchUserVideoSubmissionsFromFirestore(
  userId: string
): Promise<VideoSubmissionRecord[]> {
  try {
    const q = query(
      collection(db, "video_submissions"),
      where("userId", "==", userId)
    );
    const snapshot = await getDocs(q);
    const subs: VideoSubmissionRecord[] = [];
    snapshot.forEach((docSnap) => {
      subs.push(docSnap.data() as VideoSubmissionRecord);
    });
    return subs.sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  } catch (error) {
    console.warn("[Firestore] fetchUserVideoSubmissions error:", error);
    return [];
  }
}

// 5. User Progress (Chapter milestones)
export async function saveProgressToFirestore(
  userId: string,
  moduleId: string,
  status: string
): Promise<void> {
  try {
    const progressRef = doc(db, "user_progress", userId);
    await setDoc(progressRef, { [moduleId]: status }, { merge: true });
  } catch (error) {
    console.error("[Firestore] saveProgress error:", error);
  }
}

export async function fetchProgressFromFirestore(
  userId: string
): Promise<Record<string, string>> {
  try {
    const progressRef = doc(db, "user_progress", userId);
    const docSnap = await getDoc(progressRef);
    if (docSnap.exists()) {
      return docSnap.data() as Record<string, string>;
    }
  } catch (error) {
    console.warn("[Firestore] fetchProgress error:", error);
  }
  return {};
}
