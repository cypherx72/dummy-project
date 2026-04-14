"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { format, isPast, isToday, differenceInDays } from "date-fns";
import {
  ArrowLeft,
  BookOpen,
  ClipboardList,
  Clock3,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Upload,
  FileText,
  Download,
  Send,
  RotateCcw,
  Search,
  Filter,
  ChevronRight,
  CalendarIcon,
  Star,
  MessageSquare,
  Paperclip,
  X,
  Play,
  CheckSquare,
  AlignLeft,
  ToggleLeft,
  Trophy,
  AlertTriangle,
  Eye,
  Lock,
  Layers,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { showToast, errorToast } from "@/components/ui/toast";
import { useAssignmentUI } from "@/context/tasks/task-context";
import { User } from "../../types-args";
import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";

const GET_STUDENT_QUIZZES = gql`
  query GetQuizzes {
    GetQuizzes {
      status
      quizzes {
        id
        title
        description
        courseId
        timeLimit
        dueDate
        shuffleQuestions
        isPublished
        createdAt
        course {
          id
          name
          code
        }
        questions {
          id
          type
          text
          marks
          options
          correctAnswer
          explanation
          order
        }
      }
    }
  }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

type PriorityStatus = "low" | "high" | "medium";
type SubmissionType = "fileUpload" | "textEntry" | "websiteUrl";
type AssignmentStatus = "pending" | "submitted" | "graded" | "late" | "missed";
type QuizStatus =
  | "available"
  | "in_progress"
  | "completed"
  | "missed"
  | "locked";
type QuestionType = "mcq" | "true_false" | "short_answer";
type SubjectFilter = "all" | string;

interface Course {
  id: string;
  title: string;
}

type Teacher = Pick<User, "id" | "name">;

// Matches actual API response for attachment on a submission
interface SubmissionAttachment {
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

// Matches actual API response
interface Submission {
  id: string;
  status: AssignmentStatus;
  marksObtained?: number;
  feedback?: string;
  submittedAt: string;
  submittedText?: string;
  attachments: SubmissionAttachment[];
}

// Matches actual API response exactly
interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string; // epoch ms as string e.g. "1774636200000"
  postedDate: string; // epoch ms as string
  updatedAt: string; // epoch ms as string
  maxMarks: number;
  priority: PriorityStatus;
  submissionType: SubmissionType;
  teacher: Teacher;
  course: Course;
  submissions: Submission[];
}

// ─── Derived helpers ──────────────────────────────────────────────────────────

/**
 * Derive a display status from the assignment + its submission.
 * The API doesn't return a top-level status, so we compute it here.
 */
function getAssignmentStatus(assignment: Assignment): AssignmentStatus {
  const sub = assignment.submissions[0];
  if (sub) return sub.status;
  const due = new Date(Number(assignment.dueDate));
  return isPast(due) && !isToday(due) ? "missed" : "pending";
}

/** Safe date parser — handles both epoch-ms strings and ISO strings */
function parseDate(value: string): Date {
  const asNumber = Number(value);
  if (!isNaN(asNumber)) return new Date(asNumber);
  return new Date(value);
}

// ─── Quiz types (unchanged — mock data only until API is ready) ───────────────

interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer?: string | boolean;
  marks: number;
}

interface Quiz {
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

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

const submissionSchema = z.object({
  textResponse: z.string().optional(),
  fileName: z.string().optional(),
});

function buildQuizSchema(questions: QuizQuestion[]) {
  const shape: Record<string, z.ZodString> = {};
  questions.forEach((q) => {
    shape[q.id] =
      q.type === "short_answer"
        ? z.string().min(1, "Please provide an answer")
        : z.string().min(1, "Please select an answer");
  });
  return z.object(shape);
}

type SubmissionFormValues = z.infer<typeof submissionSchema>;

// ─── Quiz Data comes from API only ─────────────────────────────────────────────

// ─── Config & Helpers ─────────────────────────────────────────────────────────

const ASSIGNMENT_STATUS_CONFIG: Record<
  AssignmentStatus,
  {
    label: string;
    icon: React.ReactNode;
    badgeClass: string;
    rowClass?: string;
  }
> = {
  pending: {
    label: "Pending",
    icon: <Clock3 className="w-3.5 h-3.5" />,
    badgeClass:
      "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  },
  submitted: {
    label: "Submitted",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    badgeClass: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  },
  graded: {
    label: "Graded",
    icon: <Star className="w-3.5 h-3.5" />,
    badgeClass:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  },
  late: {
    label: "Late",
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    badgeClass:
      "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
    rowClass: "bg-orange-50/40 dark:bg-orange-950/10",
  },
  missed: {
    label: "Missed",
    icon: <XCircle className="w-3.5 h-3.5" />,
    badgeClass: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
    rowClass: "bg-red-50/30 dark:bg-red-950/10",
  },
};

const QUIZ_STATUS_CONFIG: Record<
  QuizStatus,
  { label: string; icon: React.ReactNode; badgeClass: string }
> = {
  available: {
    label: "Available",
    icon: <Play className="w-3.5 h-3.5" />,
    badgeClass:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  },
  in_progress: {
    label: "In Progress",
    icon: <Clock3 className="w-3.5 h-3.5" />,
    badgeClass: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  },
  completed: {
    label: "Completed",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    badgeClass:
      "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
  },
  missed: {
    label: "Missed",
    icon: <XCircle className="w-3.5 h-3.5" />,
    badgeClass: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  },
  locked: {
    label: "Locked",
    icon: <Lock className="w-3.5 h-3.5" />,
    badgeClass: "bg-muted text-muted-foreground",
  },
};

const QUESTION_TYPE_CONFIG: Record<
  QuestionType,
  { label: string; icon: React.ReactNode }
> = {
  mcq: { label: "MCQ", icon: <CheckSquare className="w-3.5 h-3.5" /> },
  true_false: {
    label: "True / False",
    icon: <ToggleLeft className="w-3.5 h-3.5" />,
  },
  short_answer: {
    label: "Short Answer",
    icon: <AlignLeft className="w-3.5 h-3.5" />,
  },
};

function getDueBadge(
  dueDateRaw: string,
  status: AssignmentStatus | QuizStatus,
) {
  if (["graded", "submitted", "completed", "missed", "locked"].includes(status))
    return null;
  const due = parseDate(dueDateRaw);
  const diff = differenceInDays(due, new Date());
  if (isPast(due) && !isToday(due))
    return { label: "Overdue", class: "text-red-600 dark:text-red-400" };
  if (isToday(due))
    return {
      label: "Due today",
      class: "text-orange-600 dark:text-orange-400",
    };
  if (diff <= 3)
    return {
      label: `Due in ${diff}d`,
      class: "text-amber-600 dark:text-amber-400",
    };
  return {
    label: `Due ${format(due, "dd MMM")}`,
    class: "text-muted-foreground",
  };
}

function ScoreChip({ obtained, max }: { obtained: number; max: number }) {
  const pct = Math.round((obtained / max) * 100);
  const cls =
    pct >= 85
      ? "text-emerald-600 dark:text-emerald-400"
      : pct >= 60
        ? "text-blue-600 dark:text-blue-400"
        : pct >= 40
          ? "text-amber-600 dark:text-amber-400"
          : "text-red-600 dark:text-red-400";
  return (
    <span className={cn("font-semibold tabular-nums text-sm", cls)}>
      {obtained}
      <span className="font-normal text-muted-foreground text-xs">/{max}</span>
    </span>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline gap-2">
      <span className="text-muted-foreground text-xs shrink-0">{label}</span>
      <span className="font-medium text-xs text-right">{value}</span>
    </div>
  );
}

// ─── Assignment Detail ────────────────────────────────────────────────────────

function AssignmentDetail({
  assignment,
  onBack,
  onSubmitted,
}: {
  assignment: Assignment;
  onBack: () => void;
  onSubmitted: (id: string, text: string, file?: string) => void;
}) {
  const [fakeFile, setFakeFile] = React.useState<string>("");
  const [isSaving, setIsSaving] = React.useState(false);

  // Derive status and submission data
  const status = getAssignmentStatus(assignment);
  const submission = assignment.submissions[0] ?? null;
  const canSubmit = status === "pending" || status === "late";
  const isGraded = status === "graded";

  const form = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      textResponse: submission?.submittedText ?? "",
      fileName: "",
    },
  });

  async function onSubmit(values: SubmissionFormValues) {
    if (!values.textResponse?.trim() && !fakeFile) {
      errorToast(
        "Please add a text response or attach a file before submitting.",
      );
      return;
    }
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    onSubmitted(
      assignment.id,
      values.textResponse ?? "",
      fakeFile || undefined,
    );
    setIsSaving(false);
    showToast(
      "Assignment submitted!",
      `${assignment.title} · ${format(new Date(), "dd MMM yyyy")}`,
      "success",
    );
  }

  const dueBadge = getDueBadge(assignment.dueDate, status);

  return (
    <div className="space-y-6">
      {/* Back + title */}
      <div className="flex items-start gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mt-0.5 shrink-0"
        >
          <ArrowLeft className="mr-1.5 w-4 h-4" />
          Back
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-semibold text-xl tracking-tight">
              {assignment.title}
            </h2>
            <Badge
              className={cn(
                "gap-1 text-xs",
                ASSIGNMENT_STATUS_CONFIG[status].badgeClass,
              )}
            >
              {ASSIGNMENT_STATUS_CONFIG[status].icon}
              {ASSIGNMENT_STATUS_CONFIG[status].label}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            {/* course.title instead of subject, teacher.name instead of teacher string */}
            <span className="text-muted-foreground text-sm">
              {assignment.course.title} · {assignment.teacher.name}
            </span>
            {dueBadge && (
              <span className={cn("font-medium text-xs", dueBadge.class)}>
                {dueBadge.label}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Graded score banner */}
      {isGraded && submission?.marksObtained !== undefined && (
        <div className="flex items-center gap-4 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-3 border border-emerald-200 dark:border-emerald-800 rounded-lg">
          <Trophy className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-emerald-800 dark:text-emerald-300 text-sm">
              Graded
            </p>
            <p className="text-emerald-700 dark:text-emerald-400 text-xs">
              You scored{" "}
              <span className="font-bold">{submission.marksObtained}</span> out
              of <span className="font-bold">{assignment.maxMarks}</span> marks
              (
              {Math.round(
                (submission.marksObtained / assignment.maxMarks) * 100,
              )}
              %)
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-emerald-700 dark:text-emerald-300 text-2xl leading-none">
              {submission.marksObtained}
            </p>
            <p className="text-emerald-600 dark:text-emerald-400 text-xs">
              / {assignment.maxMarks}
            </p>
          </div>
        </div>
      )}

      <div className="gap-6 grid grid-cols-1 lg:grid-cols-3">
        {/* Left — description (instructions not in API yet) */}
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed">
                {assignment.description}
              </p>
              {/* Submission attachments (from student) */}
              {submission && submission.attachments.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                      Your submitted files
                    </p>
                    {submission.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="flex justify-between items-center bg-muted/40 px-3 py-2 rounded-md"
                      >
                        <div className="flex items-center gap-2">
                          <Paperclip className="w-3.5 h-3.5 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-xs">{att.name}</p>
                            <p className="text-muted-foreground text-xs">
                              {att.file_extension.toUpperCase()} ·{" "}
                              {Math.round(att.size / 1024)} KB
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 h-7 text-xs"
                          onClick={() =>
                            window.open(att.cloudinary_url, "_blank")
                          }
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Teacher feedback */}
          {isGraded && submission?.feedback && (
            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <CardTitle className="text-base">Teacher Feedback</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm italic leading-relaxed">
                  "{submission.feedback}"
                </p>
                <p className="mt-1.5 text-muted-foreground text-xs">
                  — {assignment.teacher.name}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right — meta + submission */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-sm">
              <MetaRow label="Course" value={assignment.course.title} />
              <MetaRow label="Teacher" value={assignment.teacher.name} />
              <MetaRow
                label="Posted"
                value={format(parseDate(assignment.postedDate), "dd MMM yyyy")}
              />
              <MetaRow
                label="Due"
                value={format(parseDate(assignment.dueDate), "dd MMM yyyy")}
              />
              <MetaRow label="Max Marks" value={`${assignment.maxMarks}`} />
              <MetaRow label="Submission" value={assignment.submissionType} />
              <MetaRow label="Priority" value={assignment.priority} />
            </CardContent>
          </Card>

          {/* Submission form */}
          {canSubmit && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Your Submission</CardTitle>
                <CardDescription>
                  Add a text response, attach a file, or both.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-3"
                  >
                    <FormField
                      control={form.control}
                      name="textResponse"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">
                            Text Response{" "}
                            <span className="font-normal text-muted-foreground">
                              (optional)
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={5}
                              placeholder="Type your answer here…"
                              className="text-sm resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-1.5">
                      <p className="font-medium text-xs">
                        Attach File{" "}
                        <span className="font-normal text-muted-foreground">
                          (optional)
                        </span>
                      </p>
                      {fakeFile ? (
                        <div className="flex justify-between items-center bg-muted/40 px-3 py-2 rounded-md">
                          <div className="flex items-center gap-2">
                            <Paperclip className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="max-w-[140px] text-xs truncate">
                              {fakeFile}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-6 h-6"
                            onClick={() => setFakeFile("")}
                          >
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <label className="flex flex-col justify-center items-center gap-1.5 hover:bg-muted/30 px-3 py-4 border border-dashed rounded-md transition-colors cursor-pointer">
                          <Upload className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground text-xs">
                            Click to upload a file
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) setFakeFile(f.name);
                            }}
                          />
                        </label>
                      )}
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          form.reset();
                          setFakeFile("");
                        }}
                      >
                        <RotateCcw className="mr-1.5 w-3.5 h-3.5" />
                        Clear
                      </Button>
                      <Button type="submit" size="sm" disabled={isSaving}>
                        <Send className="mr-1.5 w-3.5 h-3.5" />
                        {isSaving ? "Submitting…" : "Submit"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {/* Already submitted view */}
          {(status === "submitted" || isGraded) && submission && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <CardTitle className="text-base">Your Submission</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {submission.submittedText && (
                  <div>
                    <p className="mb-1 text-muted-foreground text-xs">
                      Text response
                    </p>
                    <p className="text-sm line-clamp-4 leading-relaxed">
                      {submission.submittedText}
                    </p>
                  </div>
                )}
                <p className="text-muted-foreground text-xs">
                  Submitted{" "}
                  {format(
                    parseDate(submission.submittedAt),
                    "dd MMM yyyy, HH:mm",
                  )}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Assignments List Tab ─────────────────────────────────────────────────────

function AssignmentsTab({
  assignments,
  onSelect,
}: {
  assignments: Assignment[];
  onSelect: (a: Assignment) => void;
}) {
  const [filterStatus, setFilterStatus] = React.useState<string>("all");
  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    return assignments.filter((a) => {
      const status = getAssignmentStatus(a);
      if (filterStatus !== "all" && status !== filterStatus) return false;
      if (
        search &&
        !a.title.toLowerCase().includes(search.toLowerCase()) &&
        !a.course.title.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [assignments, filterStatus, search]);

  const pending = assignments.filter(
    (a) => getAssignmentStatus(a) === "pending",
  ).length;
  const late = assignments.filter(
    (a) => getAssignmentStatus(a) === "late",
  ).length;

  return (
    <div className="space-y-5">
      {/* Summary chips */}
      <div className="flex flex-wrap gap-3">
        {[
          {
            label: "Pending",
            count: pending,
            class:
              "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-400",
          },
          {
            label: "Late",
            count: late,
            class:
              "bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-950 dark:border-orange-800 dark:text-orange-400",
          },
          {
            label: "Submitted",
            count: assignments.filter(
              (a) => getAssignmentStatus(a) === "submitted",
            ).length,
            class:
              "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-400",
          },
          {
            label: "Graded",
            count: assignments.filter(
              (a) => getAssignmentStatus(a) === "graded",
            ).length,
            class:
              "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-400",
          },
        ].map((s) => (
          <div
            key={s.label}
            className={cn(
              "flex items-center gap-2 px-3 py-2 border rounded-lg",
              s.class,
            )}
          >
            <span className="font-semibold text-lg leading-none">
              {s.count}
            </span>
            <span className="text-xs">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2 pointer-events-none" />
          <Input
            placeholder="Search assignments…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {(
              [
                "pending",
                "submitted",
                "graded",
                "late",
                "missed",
              ] as AssignmentStatus[]
            ).map((s) => (
              <SelectItem key={s} value={s}>
                {ASSIGNMENT_STATUS_CONFIG[s].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Subject filter removed — use course.title from real data instead of hardcoded SUBJECTS */}
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="flex flex-col justify-center items-center bg-muted/30 py-16 border border-dashed rounded-lg text-center">
          <AlertCircle className="mb-3 w-10 h-10 text-muted-foreground/50" />
          <p className="font-medium text-muted-foreground text-sm">
            No assignments match your filters
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => {
            const status = getAssignmentStatus(a);
            const submission = a.submissions[0] ?? null;
            const cfg = ASSIGNMENT_STATUS_CONFIG[status];
            const dueBadge = getDueBadge(a.dueDate, status);
            return (
              <Card
                key={a.id}
                className={cn(
                  "hover:shadow-sm hover:border-foreground/20 transition-all cursor-pointer",
                  cfg.rowClass,
                )}
                onClick={() => onSelect(a)}
              >
                <CardContent className="py-4">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex flex-1 items-start gap-3 min-w-0">
                      <div className="flex justify-center items-center bg-muted mt-0.5 rounded-md w-9 h-9 shrink-0">
                        <ClipboardList className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <p className="font-medium text-sm">{a.title}</p>
                          <Badge
                            className={cn("gap-1 text-xs", cfg.badgeClass)}
                          >
                            {cfg.icon}
                            {cfg.label}
                          </Badge>
                        </div>
                        {/* Use course.title + teacher.name from real data */}
                        <p className="mb-1.5 text-muted-foreground text-xs">
                          {a.course.title} · {a.teacher.name}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-xs">
                          {dueBadge && (
                            <span className={cn("font-medium", dueBadge.class)}>
                              {dueBadge.label}
                            </span>
                          )}
                          <span className="text-muted-foreground">
                            {a.maxMarks} marks
                          </span>
                          {status === "graded" &&
                            submission?.marksObtained !== undefined && (
                              <ScoreChip
                                obtained={submission.marksObtained}
                                max={a.maxMarks}
                              />
                            )}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="mt-1 w-4 h-4 text-muted-foreground shrink-0" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Quizzes List Tab (unchanged — still mock data) ───────────────────────────

function QuizzesTab({
  quizzes,
  onSelect,
}: {
  quizzes: Quiz[];
  onSelect: (q: Quiz) => void;
}) {
  const [filterSubject, setFilterSubject] =
    React.useState<SubjectFilter>("all");
  const filtered =
    filterSubject === "all"
      ? quizzes
      : quizzes.filter((q) => q.subject === filterSubject);
  const available = quizzes.filter((q) => q.status === "available").length;

  const SUBJECTS = [...new Set(quizzes.map((q) => q.subject))];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3">
        {[
          {
            label: "Available",
            count: available,
            class:
              "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-400",
          },
          {
            label: "Completed",
            count: quizzes.filter((q) => q.status === "completed").length,
            class:
              "bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-950 dark:border-purple-800 dark:text-purple-400",
          },
          {
            label: "Missed",
            count: quizzes.filter((q) => q.status === "missed").length,
            class:
              "bg-red-50 border-red-200 text-red-700 dark:bg-red-950 dark:border-red-800 dark:text-red-400",
          },
          {
            label: "Locked",
            count: quizzes.filter((q) => q.status === "locked").length,
            class: "bg-muted border-border text-muted-foreground",
          },
        ].map((s) => (
          <div
            key={s.label}
            className={cn(
              "flex items-center gap-2 px-3 py-2 border rounded-lg",
              s.class,
            )}
          >
            <span className="font-semibold text-lg leading-none">
              {s.count}
            </span>
            <span className="text-xs">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Select value={filterSubject} onValueChange={setFilterSubject}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {SUBJECTS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered.map((q) => {
          const cfg = QUIZ_STATUS_CONFIG[q.status];
          const dueBadge = getDueBadge(q.dueDate, q.status);
          const canClick = q.status !== "locked";
          return (
            <Card
              key={q.id}
              className={cn(
                "transition-all",
                canClick
                  ? "cursor-pointer hover:shadow-sm hover:border-foreground/20"
                  : "opacity-60",
              )}
              onClick={() => canClick && onSelect(q)}
            >
              <CardContent className="py-4">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex flex-1 items-start gap-3 min-w-0">
                    <div className="flex justify-center items-center bg-muted mt-0.5 rounded-md w-9 h-9 shrink-0">
                      {q.status === "completed" ? (
                        <Trophy className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      ) : q.status === "locked" ? (
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <BookOpen className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="font-medium text-sm">{q.title}</p>
                        <Badge className={cn("gap-1 text-xs", cfg.badgeClass)}>
                          {cfg.icon}
                          {cfg.label}
                        </Badge>
                      </div>
                      <p className="mb-1.5 text-muted-foreground text-xs">
                        {q.subject} · {q.teacher}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        {dueBadge && (
                          <span className={cn("font-medium", dueBadge.class)}>
                            {dueBadge.label}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock3 className="w-3 h-3" />
                          {q.durationMinutes} min
                        </span>
                        <span className="text-muted-foreground">
                          {q.totalMarks} marks
                        </span>
                        <span className="text-muted-foreground">
                          {q.questions.length} questions
                        </span>
                        {q.status === "completed" &&
                          q.marksObtained !== undefined && (
                            <ScoreChip
                              obtained={q.marksObtained}
                              max={q.totalMarks}
                            />
                          )}
                      </div>
                    </div>
                  </div>
                  {canClick && (
                    <div className="mt-1 shrink-0">
                      {q.status === "available" ? (
                        <Button
                          size="sm"
                          variant="default"
                          className="gap-1.5 h-7 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelect(q);
                          }}
                        >
                          <Play className="w-3 h-3" />
                          Start
                        </Button>
                      ) : q.status === "completed" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5 h-7 text-xs"
                        >
                          <Eye className="w-3 h-3" />
                          Review
                        </Button>
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── Quiz Detail (unchanged) ──────────────────────────────────────────────────

function QuizDetail({
  quiz,
  onBack,
  onCompleted,
}: {
  quiz: Quiz;
  onBack: () => void;
  onCompleted: (
    id: string,
    answers: Record<string, string>,
    score: number,
  ) => void;
}) {
  const schema = React.useMemo(
    () => buildQuizSchema(quiz.questions),
    [quiz.id],
  );
  const form = useForm({ resolver: zodResolver(schema), defaultValues: {} });
  const [isSaving, setIsSaving] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(quiz.durationMinutes * 60);
  const [timerActive, setTimerActive] = React.useState(
    quiz.status === "available",
  );

  React.useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timerActive, timeLeft]);

  const isReview = quiz.status === "completed";
  const canAttempt = quiz.status === "available";
  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  async function onSubmit(values: Record<string, string>) {
    setIsSaving(true);
    setTimerActive(false);
    await new Promise((r) => setTimeout(r, 900));
    let score = 0;
    quiz.questions.forEach((q) => {
      if (q.correctAnswer !== undefined && q.type !== "short_answer") {
        if (
          String(q.correctAnswer).toLowerCase() ===
          (values[q.id] ?? "").toLowerCase()
        )
          score += q.marks;
      }
      if (q.type === "short_answer" && values[q.id]?.trim().length > 5)
        score += Math.floor(q.marks * 0.7);
    });
    onCompleted(quiz.id, values, score);
    setIsSaving(false);
    showToast(
      "Quiz submitted!",
      `${quiz.title} · Score: ${score}/${quiz.totalMarks}`,
      "success",
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mt-0.5 shrink-0"
        >
          <ArrowLeft className="mr-1.5 w-4 h-4" />
          Back
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-semibold text-xl tracking-tight">
              {quiz.title}
            </h2>
            <Badge
              className={cn(
                "gap-1 text-xs",
                QUIZ_STATUS_CONFIG[quiz.status].badgeClass,
              )}
            >
              {QUIZ_STATUS_CONFIG[quiz.status].icon}
              {QUIZ_STATUS_CONFIG[quiz.status].label}
            </Badge>
          </div>
          <p className="mt-0.5 text-muted-foreground text-sm">
            {quiz.subject} · {quiz.teacher}
          </p>
        </div>
        {canAttempt && (
          <div
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 border rounded-lg font-mono font-semibold text-sm shrink-0",
              timeLeft < 60
                ? "bg-red-50 border-red-200 text-red-600 dark:bg-red-950 dark:border-red-800 dark:text-red-400"
                : timeLeft < 300
                  ? "bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-400"
                  : "bg-muted border-border text-foreground",
            )}
          >
            <Clock3 className="w-3.5 h-3.5" />
            {formatTime(timeLeft)}
          </div>
        )}
      </div>

      {isReview && quiz.marksObtained !== undefined && (
        <div className="flex items-center gap-4 bg-purple-50 dark:bg-purple-950/30 px-4 py-3 border border-purple-200 dark:border-purple-800 rounded-lg">
          <Trophy className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-purple-800 dark:text-purple-300 text-sm">
              Quiz Completed
            </p>
            <p className="text-purple-700 dark:text-purple-400 text-xs">
              Attempted on{" "}
              {quiz.attemptedOn
                ? format(new Date(quiz.attemptedOn), "dd MMM yyyy")
                : "—"}
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-purple-700 dark:text-purple-300 text-2xl leading-none">
              {quiz.marksObtained}
            </p>
            <p className="text-purple-600 dark:text-purple-400 text-xs">
              / {quiz.totalMarks}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4 text-sm">
        {[
          { label: "Duration", value: `${quiz.durationMinutes} min` },
          { label: "Total Marks", value: `${quiz.totalMarks}` },
          { label: "Questions", value: `${quiz.questions.length}` },
          {
            label: "Due",
            value: format(new Date(quiz.dueDate), "dd MMM yyyy"),
          },
        ].map((m) => (
          <div key={m.label} className="bg-muted/50 px-3 py-1.5 rounded-md">
            <span className="text-muted-foreground text-xs">{m.label}: </span>
            <span className="font-medium text-xs">{m.value}</span>
          </div>
        ))}
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {quiz.questions.map((q, idx) => {
          const qType = QUESTION_TYPE_CONFIG[q.type];
          const submittedAnswer = quiz.submittedAnswers?.[q.id];
          const isCorrect =
            isReview &&
            q.correctAnswer !== undefined &&
            q.type !== "short_answer"
              ? String(q.correctAnswer).toLowerCase() ===
                submittedAnswer?.toLowerCase()
              : undefined;

          return (
            <Card
              key={q.id}
              className={cn(
                isReview &&
                  isCorrect === true &&
                  "border-emerald-200 dark:border-emerald-800",
                isReview &&
                  isCorrect === false &&
                  "border-red-200 dark:border-red-800",
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="flex justify-center items-center bg-muted mt-0.5 rounded-full w-6 h-6 font-semibold text-xs shrink-0">
                      {idx + 1}
                    </span>
                    <p className="font-medium text-sm leading-relaxed">
                      {q.question}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="flex items-center gap-1 text-muted-foreground text-xs">
                      {qType.icon} {qType.label}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {q.marks}m
                    </Badge>
                    {isReview && isCorrect === true && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    )}
                    {isReview && isCorrect === false && (
                      <XCircle className="w-4 h-4 text-red-500 dark:text-red-400" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Controller
                  control={form.control}
                  name={q.id as never}
                  defaultValue={submittedAnswer ?? ""}
                  render={({ field, fieldState }) => (
                    <div className="space-y-2">
                      {q.type === "mcq" && q.options && (
                        <div className="gap-2 grid grid-cols-1 sm:grid-cols-2">
                          {q.options.map((opt) => {
                            const isSelected = field.value === opt;
                            const isCorrectOpt =
                              isReview && String(q.correctAnswer) === opt;
                            const isWrongSelected =
                              isReview && isSelected && !isCorrectOpt;
                            return (
                              <button
                                key={opt}
                                type="button"
                                disabled={isReview}
                                onClick={() => !isReview && field.onChange(opt)}
                                className={cn(
                                  "flex items-center gap-2 px-3 py-2.5 border rounded-md text-sm text-left transition-all",
                                  isSelected &&
                                    !isReview &&
                                    "bg-blue-50 border-blue-400 text-blue-800 dark:bg-blue-950 dark:border-blue-600 dark:text-blue-200",
                                  !isSelected &&
                                    !isReview &&
                                    "border-border hover:bg-muted/50",
                                  isCorrectOpt &&
                                    "bg-emerald-50 border-emerald-400 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-600 dark:text-emerald-200",
                                  isWrongSelected &&
                                    "bg-red-50 border-red-400 text-red-800 dark:bg-red-950 dark:border-red-600 dark:text-red-200",
                                  !isSelected &&
                                    isReview &&
                                    !isCorrectOpt &&
                                    "opacity-50",
                                )}
                              >
                                <span
                                  className={cn(
                                    "flex justify-center items-center border-2 rounded-full w-4 h-4 shrink-0",
                                    isSelected && !isReview
                                      ? "border-blue-500 bg-blue-500"
                                      : isCorrectOpt
                                        ? "border-emerald-500 bg-emerald-500"
                                        : isWrongSelected
                                          ? "border-red-500 bg-red-500"
                                          : "border-muted-foreground",
                                  )}
                                >
                                  {(isSelected || isCorrectOpt) && (
                                    <span className="bg-white rounded-full w-1.5 h-1.5" />
                                  )}
                                </span>
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      )}
                      {q.type === "true_false" && (
                        <div className="flex gap-2">
                          {["true", "false"].map((val) => {
                            const isSelected = field.value === val;
                            const isCorrectOpt =
                              isReview &&
                              String(q.correctAnswer).toLowerCase() === val;
                            const isWrongSelected =
                              isReview && isSelected && !isCorrectOpt;
                            return (
                              <button
                                key={val}
                                type="button"
                                disabled={isReview}
                                onClick={() => !isReview && field.onChange(val)}
                                className={cn(
                                  "flex-1 py-2.5 border rounded-md font-medium text-sm capitalize transition-all",
                                  isSelected &&
                                    !isReview &&
                                    "bg-blue-50 border-blue-400 text-blue-800 dark:bg-blue-950 dark:border-blue-600 dark:text-blue-200",
                                  !isSelected &&
                                    !isReview &&
                                    "border-border hover:bg-muted/50",
                                  isCorrectOpt &&
                                    "bg-emerald-50 border-emerald-400 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-600 dark:text-emerald-200",
                                  isWrongSelected &&
                                    "bg-red-50 border-red-400 text-red-800 dark:bg-red-950 dark:border-red-600 dark:text-red-200",
                                )}
                              >
                                {val === "true" ? "✓ True" : "✗ False"}
                              </button>
                            );
                          })}
                        </div>
                      )}
                      {q.type === "short_answer" && (
                        <Textarea
                          value={field.value as string}
                          onChange={field.onChange}
                          disabled={isReview}
                          placeholder="Write your answer here…"
                          rows={3}
                          className="text-sm resize-none"
                        />
                      )}
                      {fieldState.error && (
                        <p className="text-destructive text-xs">
                          {fieldState.error.message}
                        </p>
                      )}
                      {isReview &&
                        isCorrect === false &&
                        q.correctAnswer !== undefined &&
                        q.type !== "short_answer" && (
                          <p className="text-emerald-700 dark:text-emerald-400 text-xs">
                            Correct answer:{" "}
                            <span className="font-semibold">
                              {String(q.correctAnswer)}
                            </span>
                          </p>
                        )}
                    </div>
                  )}
                />
              </CardContent>
            </Card>
          );
        })}

        {canAttempt && quiz.questions.length > 0 && (
          <div className="bottom-4 sticky flex justify-between items-center gap-4 bg-card shadow-md px-4 py-3 border rounded-lg">
            <p className="text-muted-foreground text-xs">
              {quiz.questions.length} questions · {quiz.totalMarks} marks ·{" "}
              {quiz.durationMinutes} min
            </p>
            <Button type="submit" size="sm" disabled={isSaving}>
              <Send className="mr-1.5 w-3.5 h-3.5" />
              {isSaving ? "Submitting…" : "Submit Quiz"}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────

type DetailView =
  | { kind: "assignment"; item: Assignment }
  | { kind: "quiz"; item: Quiz }
  | null;

export default function StudentContentPage() {
  const [assignments, setAssignments] = React.useState<Assignment[]>([]);
  const [detail, setDetail] = React.useState<DetailView>(null);
  const [activeTab, setActiveTab] = React.useState("assignments");

  const {
    fetchAssignments,
    fetchAssignmentsData,
    fetchAssignmentsLoading,
    fetchAssignmentsError,
  } = useAssignmentUI();

  // Load quizzes from API; fall back to mock data if none returned yet
  const {
    data: quizzesData,
    loading: quizzesLoading,
    error: quizzesError,
  } = useQuery(GET_STUDENT_QUIZZES, {
    onError: () => errorToast("Failed to load quizzes."),
  });

  const quizzes: Quiz[] = React.useMemo(() => {
    const live = quizzesData?.GetQuizzes?.quizzes ?? [];
    if (live.length > 0) {
      return live.map((q: any) => ({
        id: q.id,
        title: q.title,
        subject: q.course?.name ?? "—",
        course: q.course?.name ?? "—",
        dueDate: q.dueDate ?? new Date().toISOString(),
        timeLimit: q.timeLimit ?? 30,
        totalMarks: (q.questions ?? []).reduce(
          (s: number, qq: any) => s + (qq.marks ?? 1),
          0,
        ),
        questionCount: (q.questions ?? []).length,
        status: "not_started" as const,
        questions: (q.questions ?? []).map((qq: any) => ({
          id: qq.id,
          type: qq.type,
          text: qq.text,
          marks: qq.marks,
          options: qq.options ? JSON.parse(qq.options) : undefined,
          correctAnswer: qq.correctAnswer,
          explanation: qq.explanation,
        })),
        instructions: q.description ?? "",
        shuffleQuestions: q.shuffleQuestions ?? false,
        attemptedAt: null,
        score: null,
        answers: {},
      }));
    }
    return [];
  }, [quizzesData]);

  React.useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  // Wire real API data into state
  React.useEffect(() => {
    if (fetchAssignmentsData?.GetAssignments.assignments) {
      setAssignments(fetchAssignmentsData.GetAssignments.assignments);
    }
  }, [fetchAssignmentsData]);

  function handleAssignmentSubmitted(id: string, text: string, file?: string) {
    // Optimistically update the local submission
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              submissions: [
                {
                  id: "optimistic",
                  status: "submitted" as AssignmentStatus,
                  submittedAt: new Date().toISOString(),
                  submittedText: text,
                  feedback: "",
                  attachments: [],
                },
              ],
            }
          : a,
      ),
    );
    setDetail((prev) =>
      prev?.kind === "assignment" && prev.item.id === id
        ? {
            kind: "assignment",
            item: {
              ...prev.item,
              submissions: [
                {
                  id: "optimistic",
                  status: "submitted" as AssignmentStatus,
                  submittedAt: new Date().toISOString(),
                  submittedText: text,
                  feedback: "",
                  attachments: [],
                },
              ],
            },
          }
        : prev,
    );
  }

  function handleQuizCompleted(
    id: string,
    answers: Record<string, string>,
    score: number,
  ) {
    setQuizzes((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              status: "completed",
              marksObtained: score,
              submittedAnswers: answers,
              attemptedOn: new Date().toISOString().split("T")[0],
            }
          : q,
      ),
    );
    setDetail((prev) =>
      prev?.kind === "quiz" && prev.item.id === id
        ? {
            kind: "quiz",
            item: {
              ...prev.item,
              status: "completed",
              marksObtained: score,
              submittedAnswers: answers,
              attemptedOn: new Date().toISOString().split("T")[0],
            },
          }
        : prev,
    );
  }

  const pendingCount = assignments.filter((a) => {
    const s = getAssignmentStatus(a);
    return s === "pending" || s === "late";
  }).length;
  const availableQuizzes = quizzes.filter(
    (q) => q.status === "available",
  ).length;

  if (detail?.kind === "assignment") {
    return (
      <div className="mx-auto p-6 max-w-5xl font-sans">
        <AssignmentDetail
          assignment={detail.item}
          onBack={() => setDetail(null)}
          onSubmitted={handleAssignmentSubmitted}
        />
      </div>
    );
  }

  if (detail?.kind === "quiz") {
    return (
      <div className="mx-auto p-6 max-w-5xl font-sans">
        <QuizDetail
          quiz={detail.item}
          onBack={() => setDetail(null)}
          onCompleted={handleQuizCompleted}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 mx-auto p-6 max-w-5xl font-sans">
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-2xl tracking-tight">
          Content & Assignments
        </h1>
        <p className="text-muted-foreground text-sm">
          View and submit assignments, take quizzes, and access shared
          materials.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="assignments" className="flex-1 sm:flex-none">
            Assignments
            {pendingCount > 0 && (
              <span className="inline-flex justify-center items-center bg-amber-500 ml-1.5 rounded-full w-4 h-4 font-bold text-[10px] text-white">
                {pendingCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="quizzes" className="flex-1 sm:flex-none">
            Quizzes
            {availableQuizzes > 0 && (
              <span className="inline-flex justify-center items-center bg-emerald-500 ml-1.5 rounded-full w-4 h-4 font-bold text-[10px] text-white">
                {availableQuizzes}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assignments" className="mt-6">
          {fetchAssignmentsLoading ? (
            <div className="flex justify-center items-center py-16 text-muted-foreground text-sm">
              Loading assignments…
            </div>
          ) : fetchAssignmentsError ? (
            <div className="flex justify-center items-center py-16 text-destructive text-sm">
              Failed to load assignments. Please try again.
            </div>
          ) : (
            <AssignmentsTab
              assignments={assignments}
              onSelect={(a) => setDetail({ kind: "assignment", item: a })}
            />
          )}
        </TabsContent>

        <TabsContent value="quizzes" className="mt-6">
          {quizzesLoading ? (
            <div className="space-y-3">
              <Skeleton className="w-full h-16" />
              <Skeleton className="w-full h-16" />
              <Skeleton className="w-full h-16" />
            </div>
          ) : quizzesError ? (
            <div className="flex justify-center items-center py-16 text-destructive text-sm">
              Failed to load quizzes. Please try again.
            </div>
          ) : (
            <QuizzesTab
              quizzes={quizzes}
              onSelect={(q) => setDetail({ kind: "quiz", item: q })}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
