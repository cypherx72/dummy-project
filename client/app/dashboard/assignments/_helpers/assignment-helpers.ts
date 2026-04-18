import { isPast, isToday, differenceInDays, format } from "date-fns";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PriorityStatus = "low" | "high" | "medium";
export type SubmissionType = "fileUpload" | "textEntry" | "websiteUrl";
export type AssignmentStatus = "pending" | "submitted" | "graded" | "late" | "missed";
export type QuizStatus = "available" | "in_progress" | "completed" | "missed" | "locked";
export type QuestionType = "mcq" | "true_false" | "short_answer";

export interface Course {
  id: string;
  name: string;
}

export interface SubmissionAttachment {
  id: string;
  cloudinary_url: string;
  size: number;
  name: string;
  file_extension: string;
  resource_type: string;
  public_id: string;
  status: string;
  associate: string;
  createdAt: string;
}

export interface Submission {
  id: string;
  status: AssignmentStatus;
  marksObtained?: number;
  feedback?: string;
  submittedAt: string;
  submittedText?: string;
  attachments: SubmissionAttachment[];
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  postedDate: string;
  updatedAt: string;
  maxMarks: number;
  priority: PriorityStatus;
  submissionType: SubmissionType;
  teacher: { id: string; name: string };
  course: Course;
  submissions: Submission[];
}

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer?: string | boolean;
  marks: number;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  teacher: string;
  dueDate: string;
  postedDate: string;
  status: QuizStatus;
  durationMinutes: number;
  totalMarks: number;
  marksObtained?: number;
  questions: QuizQuestion[];
  submittedAnswers?: Record<string, string>;
  attemptedOn?: string;
}

// ─── Pure helpers ─────────────────────────────────────────────────────────────

/** Safe date parser — handles both epoch-ms strings and ISO strings */
export function parseDate(value: string): Date {
  const asNumber = Number(value);
  if (!isNaN(asNumber)) return new Date(asNumber);
  return new Date(value);
}

/** Derive a display status from the assignment + its submission */
export function getAssignmentStatus(assignment: Assignment): AssignmentStatus {
  const sub = assignment.submissions[0];
  if (sub) {
    switch (sub.status) {
      case "pending":
      case "submitted":
      case "graded":
      case "late":
      case "missed":
        return sub.status;
      default:
        return "pending";
    }
  }
  const due = new Date(Number(assignment.dueDate));
  return isPast(due) && !isToday(due) ? "missed" : "pending";
}

export function getDueBadge(
  dueDateRaw: string,
  status: AssignmentStatus | QuizStatus,
): { label: string; class: string } | null {
  if (["graded", "submitted", "completed", "missed", "locked"].includes(status))
    return null;
  const due = parseDate(dueDateRaw);
  const diff = differenceInDays(due, new Date());
  if (isPast(due) && !isToday(due))
    return { label: "Overdue", class: "text-red-600 dark:text-red-400" };
  if (isToday(due))
    return { label: "Due today", class: "text-orange-600 dark:text-orange-400" };
  if (diff <= 3)
    return { label: `Due in ${diff}d`, class: "text-amber-600 dark:text-amber-400" };
  return { label: `Due ${format(due, "dd MMM")}`, class: "text-muted-foreground" };
}

export function buildQuizSchema(questions: QuizQuestion[]) {
  // Dynamically imported by the page component to keep zod out of this pure helper
  return questions.map((q) => ({
    id: q.id,
    required: true,
    isShortAnswer: q.type === "short_answer",
  }));
}
