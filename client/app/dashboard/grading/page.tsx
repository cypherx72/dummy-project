"use client";

import * as React from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { format } from "date-fns";
import {
  BookOpen,
  ClipboardList,
  FlaskConical,
  ChevronRight,
  ArrowLeft,
  Save,
  RotateCcw,
  Users,
  Percent,
  Hash,
  ToggleLeft,
  Award,
  CheckCheck,
  AlertCircle,
  TrendingUp,
  Star,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type AssignmentType = "assignment" | "quiz" | "exam";
type GradingMode = "marks" | "letter" | "percentage" | "pass_fail";
type LetterGrade = "A+" | "A" | "B+" | "B" | "C+" | "C" | "D" | "F";
type PassFail = "pass" | "fail";

interface Assignment {
  id: string;
  title: string;
  type: AssignmentType;
  subject: string;
  class: string;
  dueDate: string;
  totalMarks: number;
  submittedCount: number;
  totalStudents: number;
  gradingMode: GradingMode;
  status: "pending" | "partial" | "graded";
}

interface StudentSubmission {
  studentId: string;
  studentName: string;
  rollNumber: string;
  avatarInitials: string;
  submittedAt: string | null;
  grade: string;
  isGraded: boolean;
}

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

const marksGradeSchema = z.object({
  mode: z.literal("marks"),
  value: z
    .string()
    .min(1, "Required")
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 0, "Must be ≥ 0"),
  outOf: z.number(),
});

const letterGradeSchema = z.object({
  mode: z.literal("letter"),
  value: z.enum(["A+", "A", "B+", "B", "C+", "C", "D", "F"]),
});

const percentageGradeSchema = z.object({
  mode: z.literal("percentage"),
  value: z
    .string()
    .min(1, "Required")
    .refine(
      (v) => !isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= 100,
      "Must be 0–100",
    ),
});

const passFailGradeSchema = z.object({
  mode: z.literal("pass_fail"),
  value: z.enum(["pass", "fail"]),
});

const studentGradeSchema = z.object({
  studentId: z.string(),
  gradeValue: z.string().min(1, "Grade required"),
  feedback: z.string().max(300).optional(),
});

const gradingFormSchema = z.object({
  assignmentId: z.string(),
  gradingMode: z.enum(["marks", "letter", "percentage", "pass_fail"]),
  grades: z.array(studentGradeSchema),
  bulkValue: z.string().optional(),
});

type GradingFormValues = z.infer<typeof gradingFormSchema>;

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: "a1",
    title: "Chapter 5 – Quadratic Equations",
    type: "assignment",
    subject: "Mathematics",
    class: "Grade 10 – A",
    dueDate: "2025-01-15",
    totalMarks: 50,
    submittedCount: 30,
    totalStudents: 32,
    gradingMode: "marks",
    status: "partial",
  },
  {
    id: "a2",
    title: "Mid-Term Quiz: Algebra",
    type: "quiz",
    subject: "Mathematics",
    class: "Grade 10 – B",
    dueDate: "2025-01-18",
    totalMarks: 25,
    submittedCount: 29,
    totalStudents: 30,
    gradingMode: "percentage",
    status: "pending",
  },
  {
    id: "a3",
    title: "Unit 3 Lab Report – Chemical Reactions",
    type: "assignment",
    subject: "Science",
    class: "Grade 9 – A",
    dueDate: "2025-01-10",
    totalMarks: 100,
    submittedCount: 28,
    totalStudents: 28,
    gradingMode: "letter",
    status: "partial",
  },
  {
    id: "a4",
    title: "Term-End Examination",
    type: "exam",
    subject: "Physics",
    class: "Grade 11 – C",
    dueDate: "2025-01-20",
    totalMarks: 100,
    submittedCount: 25,
    totalStudents: 25,
    gradingMode: "marks",
    status: "pending",
  },
  {
    id: "a5",
    title: "Newton's Laws – Quick Check",
    type: "quiz",
    subject: "Physics",
    class: "Grade 11 – C",
    dueDate: "2025-01-08",
    totalMarks: 10,
    submittedCount: 24,
    totalStudents: 25,
    gradingMode: "pass_fail",
    status: "graded",
  },
  {
    id: "a6",
    title: "Essay: Industrial Revolution Impact",
    type: "assignment",
    subject: "History",
    class: "Grade 10 – A",
    dueDate: "2025-01-22",
    totalMarks: 40,
    submittedCount: 20,
    totalStudents: 32,
    gradingMode: "letter",
    status: "pending",
  },
];

const MOCK_SUBMISSIONS: Record<string, StudentSubmission[]> = {
  a1: [
    {
      studentId: "s1",
      studentName: "Aarav Sharma",
      rollNumber: "10A-01",
      avatarInitials: "AS",
      submittedAt: "2025-01-14 10:30",
      grade: "42",
      isGraded: true,
    },
    {
      studentId: "s2",
      studentName: "Priya Patel",
      rollNumber: "10A-02",
      avatarInitials: "PP",
      submittedAt: "2025-01-15 08:00",
      grade: "",
      isGraded: false,
    },
    {
      studentId: "s3",
      studentName: "Rohan Mehta",
      rollNumber: "10A-03",
      avatarInitials: "RM",
      submittedAt: "2025-01-13 14:20",
      grade: "38",
      isGraded: true,
    },
    {
      studentId: "s4",
      studentName: "Sneha Iyer",
      rollNumber: "10A-04",
      avatarInitials: "SI",
      submittedAt: "2025-01-15 09:45",
      grade: "",
      isGraded: false,
    },
    {
      studentId: "s5",
      studentName: "Vikram Nair",
      rollNumber: "10A-05",
      avatarInitials: "VN",
      submittedAt: null,
      grade: "",
      isGraded: false,
    },
    {
      studentId: "s6",
      studentName: "Ananya Reddy",
      rollNumber: "10A-06",
      avatarInitials: "AR",
      submittedAt: "2025-01-14 16:10",
      grade: "47",
      isGraded: true,
    },
    {
      studentId: "s7",
      studentName: "Karan Gupta",
      rollNumber: "10A-07",
      avatarInitials: "KG",
      submittedAt: "2025-01-15 07:55",
      grade: "",
      isGraded: false,
    },
    {
      studentId: "s8",
      studentName: "Divya Krishnan",
      rollNumber: "10A-08",
      avatarInitials: "DK",
      submittedAt: "2025-01-12 11:00",
      grade: "45",
      isGraded: true,
    },
  ],
  a2: [
    {
      studentId: "s9",
      studentName: "Arjun Singh",
      rollNumber: "10B-01",
      avatarInitials: "AS",
      submittedAt: "2025-01-18 09:00",
      grade: "",
      isGraded: false,
    },
    {
      studentId: "s10",
      studentName: "Meera Joshi",
      rollNumber: "10B-02",
      avatarInitials: "MJ",
      submittedAt: "2025-01-18 09:05",
      grade: "",
      isGraded: false,
    },
    {
      studentId: "s11",
      studentName: "Nikhil Kumar",
      rollNumber: "10B-03",
      avatarInitials: "NK",
      submittedAt: "2025-01-18 09:12",
      grade: "",
      isGraded: false,
    },
    {
      studentId: "s12",
      studentName: "Pooja Verma",
      rollNumber: "10B-04",
      avatarInitials: "PV",
      submittedAt: "2025-01-18 09:20",
      grade: "",
      isGraded: false,
    },
    {
      studentId: "s13",
      studentName: "Rahul Das",
      rollNumber: "10B-05",
      avatarInitials: "RD",
      submittedAt: null,
      grade: "",
      isGraded: false,
    },
    {
      studentId: "s14",
      studentName: "Shreya Bose",
      rollNumber: "10B-06",
      avatarInitials: "SB",
      submittedAt: "2025-01-18 09:30",
      grade: "",
      isGraded: false,
    },
  ],
  a3: [
    {
      studentId: "s15",
      studentName: "Aditya Rao",
      rollNumber: "9A-01",
      avatarInitials: "AR",
      submittedAt: "2025-01-09 13:00",
      grade: "A",
      isGraded: true,
    },
    {
      studentId: "s16",
      studentName: "Bhavna Pillai",
      rollNumber: "9A-02",
      avatarInitials: "BP",
      submittedAt: "2025-01-10 08:30",
      grade: "B+",
      isGraded: true,
    },
    {
      studentId: "s17",
      studentName: "Chirag Malhotra",
      rollNumber: "9A-03",
      avatarInitials: "CM",
      submittedAt: "2025-01-10 09:00",
      grade: "",
      isGraded: false,
    },
    {
      studentId: "s18",
      studentName: "Deepika Nanda",
      rollNumber: "9A-04",
      avatarInitials: "DN",
      submittedAt: "2025-01-08 15:00",
      grade: "A+",
      isGraded: true,
    },
    {
      studentId: "s19",
      studentName: "Esha Tiwari",
      rollNumber: "9A-05",
      avatarInitials: "ET",
      submittedAt: "2025-01-09 18:00",
      grade: "",
      isGraded: false,
    },
  ],
  a4: [
    {
      studentId: "s20",
      studentName: "Farhan Khan",
      rollNumber: "11C-01",
      avatarInitials: "FK",
      submittedAt: "2025-01-20 10:00",
      grade: "",
      isGraded: false,
    },
    {
      studentId: "s21",
      studentName: "Gauri Saxena",
      rollNumber: "11C-02",
      avatarInitials: "GS",
      submittedAt: "2025-01-20 10:00",
      grade: "",
      isGraded: false,
    },
    {
      studentId: "s22",
      studentName: "Hardik Shah",
      rollNumber: "11C-03",
      avatarInitials: "HS",
      submittedAt: "2025-01-20 10:00",
      grade: "",
      isGraded: false,
    },
    {
      studentId: "s23",
      studentName: "Isha Jain",
      rollNumber: "11C-04",
      avatarInitials: "IJ",
      submittedAt: "2025-01-20 10:00",
      grade: "",
      isGraded: false,
    },
    {
      studentId: "s24",
      studentName: "Jay Kapoor",
      rollNumber: "11C-05",
      avatarInitials: "JK",
      submittedAt: "2025-01-20 10:00",
      grade: "",
      isGraded: false,
    },
  ],
  a5: [
    {
      studentId: "s20",
      studentName: "Farhan Khan",
      rollNumber: "11C-01",
      avatarInitials: "FK",
      submittedAt: "2025-01-08 09:00",
      grade: "pass",
      isGraded: true,
    },
    {
      studentId: "s21",
      studentName: "Gauri Saxena",
      rollNumber: "11C-02",
      avatarInitials: "GS",
      submittedAt: "2025-01-08 09:00",
      grade: "pass",
      isGraded: true,
    },
    {
      studentId: "s22",
      studentName: "Hardik Shah",
      rollNumber: "11C-03",
      avatarInitials: "HS",
      submittedAt: "2025-01-08 09:00",
      grade: "fail",
      isGraded: true,
    },
    {
      studentId: "s23",
      studentName: "Isha Jain",
      rollNumber: "11C-04",
      avatarInitials: "IJ",
      submittedAt: "2025-01-08 09:00",
      grade: "pass",
      isGraded: true,
    },
    {
      studentId: "s24",
      studentName: "Jay Kapoor",
      rollNumber: "11C-05",
      avatarInitials: "JK",
      submittedAt: null,
      grade: "",
      isGraded: false,
    },
  ],
  a6: [
    {
      studentId: "s1",
      studentName: "Aarav Sharma",
      rollNumber: "10A-01",
      avatarInitials: "AS",
      submittedAt: "2025-01-21 20:00",
      grade: "",
      isGraded: false,
    },
    {
      studentId: "s2",
      studentName: "Priya Patel",
      rollNumber: "10A-02",
      avatarInitials: "PP",
      submittedAt: "2025-01-22 07:00",
      grade: "",
      isGraded: false,
    },
    {
      studentId: "s3",
      studentName: "Rohan Mehta",
      rollNumber: "10A-03",
      avatarInitials: "RM",
      submittedAt: null,
      grade: "",
      isGraded: false,
    },
    {
      studentId: "s4",
      studentName: "Sneha Iyer",
      rollNumber: "10A-04",
      avatarInitials: "SI",
      submittedAt: "2025-01-20 18:30",
      grade: "",
      isGraded: false,
    },
  ],
};

// ─── Config ───────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  AssignmentType,
  { label: string; icon: React.ReactNode; color: string }
> = {
  assignment: {
    label: "Assignment",
    icon: <BookOpen className="w-3.5 h-3.5" />,
    color:
      "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400",
  },
  quiz: {
    label: "Quiz",
    icon: <ClipboardList className="w-3.5 h-3.5" />,
    color: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400",
  },
  exam: {
    label: "Exam",
    icon: <FlaskConical className="w-3.5 h-3.5" />,
    color: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400",
  },
};

const STATUS_CONFIG: Record<
  Assignment["status"],
  { label: string; color: string }
> = {
  pending: {
    label: "Pending",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  },
  partial: {
    label: "Partial",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  },
  graded: {
    label: "Graded",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  },
};

const GRADING_MODE_CONFIG: Record<
  GradingMode,
  { label: string; icon: React.ReactNode; description: string }
> = {
  marks: {
    label: "Marks",
    icon: <Hash className="w-4 h-4" />,
    description: "Numeric score out of total",
  },
  letter: {
    label: "Letter",
    icon: <Award className="w-4 h-4" />,
    description: "A+, A, B+, B, C+, C, D, F",
  },
  percentage: {
    label: "Percentage",
    icon: <Percent className="w-4 h-4" />,
    description: "Score as a percentage 0–100",
  },
  pass_fail: {
    label: "Pass / Fail",
    icon: <ToggleLeft className="w-4 h-4" />,
    description: "Simple pass or fail outcome",
  },
};

const LETTER_GRADES: LetterGrade[] = [
  "A+",
  "A",
  "B+",
  "B",
  "C+",
  "C",
  "D",
  "F",
];

function letterGradeColor(grade: string) {
  if (grade === "A+" || grade === "A")
    return "text-emerald-600 dark:text-emerald-400";
  if (grade === "B+" || grade === "B")
    return "text-blue-600 dark:text-blue-400";
  if (grade === "C+" || grade === "C")
    return "text-amber-600 dark:text-amber-400";
  if (grade === "D") return "text-orange-600 dark:text-orange-400";
  if (grade === "F") return "text-red-600 dark:text-red-400";
  return "";
}

function marksColor(value: string, total: number) {
  const pct = (Number(value) / total) * 100;
  if (pct >= 80) return "text-emerald-600 dark:text-emerald-400";
  if (pct >= 60) return "text-blue-600 dark:text-blue-400";
  if (pct >= 40) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function AssignmentCard({
  assignment,
  onSelect,
}: {
  assignment: Assignment;
  onSelect: () => void;
}) {
  const typeCfg = TYPE_CONFIG[assignment.type];
  const statusCfg = STATUS_CONFIG[assignment.status];
  const pct = Math.round(
    (assignment.submittedCount / assignment.totalStudents) * 100,
  );

  return (
    <Card
      className="group hover:shadow-md hover:border-primary/40 font-sans transition-all duration-150 cursor-pointer"
      onClick={onSelect}
    >
      <CardContent className="space-y-3 p-4">
        {/* Top row */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-medium text-xs",
                typeCfg.color,
              )}
            >
              {typeCfg.icon}
              {typeCfg.label}
            </span>
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-md font-medium text-xs",
                statusCfg.color,
              )}
            >
              {statusCfg.label}
            </span>
          </div>
          <ChevronRight className="mt-0.5 w-4 h-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 shrink-0" />
        </div>

        {/* Title */}
        <div>
          <p className="font-semibold text-sm line-clamp-2 leading-snug">
            {assignment.title}
          </p>
          <p className="mt-0.5 text-muted-foreground text-xs">
            {assignment.class} · {assignment.subject}
          </p>
        </div>

        {/* Footer */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-muted-foreground text-xs">
            <span>
              {assignment.submittedCount}/{assignment.totalStudents} submitted
            </span>
            <span>Due {format(new Date(assignment.dueDate), "dd MMM")}</span>
          </div>
          <Progress value={pct} className="h-1.5" />
        </div>

        {/* Grading mode */}
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
          {GRADING_MODE_CONFIG[assignment.gradingMode].icon}
          <span>
            {GRADING_MODE_CONFIG[assignment.gradingMode].label} grading
          </span>
          <span className="ml-auto font-medium text-foreground">
            {assignment.gradingMode === "marks"
              ? `/ ${assignment.totalMarks} marks`
              : ""}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Grade Input by mode ──────────────────────────────────────────────────────

function GradeInput({
  mode,
  totalMarks,
  value,
  onChange,
  hasError,
}: {
  mode: GradingMode;
  totalMarks: number;
  value: string;
  onChange: (v: string) => void;
  hasError?: boolean;
}) {
  if (mode === "letter") {
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className={cn(
            "w-[90px] h-8 text-xs",
            value && letterGradeColor(value),
            hasError && "border-destructive",
          )}
        >
          <SelectValue placeholder="Grade" />
        </SelectTrigger>
        <SelectContent>
          {LETTER_GRADES.map((g) => (
            <SelectItem
              key={g}
              value={g}
              className={cn("text-xs", letterGradeColor(g))}
            >
              {g}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (mode === "pass_fail") {
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className={cn(
            "w-[90px] h-8 text-xs",
            value === "pass" && "text-emerald-600 dark:text-emerald-400",
            value === "fail" && "text-red-600 dark:text-red-400",
            hasError && "border-destructive",
          )}
        >
          <SelectValue placeholder="Result" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            value="pass"
            className="text-emerald-600 dark:text-emerald-400 text-xs"
          >
            Pass
          </SelectItem>
          <SelectItem
            value="fail"
            className="text-red-600 dark:text-red-400 text-xs"
          >
            Fail
          </SelectItem>
        </SelectContent>
      </Select>
    );
  }

  if (mode === "marks") {
    return (
      <div className="flex items-center gap-1">
        <Input
          type="number"
          min={0}
          max={totalMarks}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-[70px] h-8 text-xs text-center",
            value && marksColor(value, totalMarks),
            hasError && "border-destructive",
          )}
          placeholder="0"
        />
        <span className="text-muted-foreground text-xs shrink-0">
          / {totalMarks}
        </span>
      </div>
    );
  }

  // percentage
  return (
    <div className="flex items-center gap-1">
      <Input
        type="number"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-[70px] h-8 text-xs text-center",
          hasError && "border-destructive",
        )}
        placeholder="0"
      />
      <span className="text-muted-foreground text-xs">%</span>
    </div>
  );
}

// ─── Bulk Grade Bar ───────────────────────────────────────────────────────────

function BulkGradeBar({
  mode,
  totalMarks,
  onApply,
}: {
  mode: GradingMode;
  totalMarks: number;
  onApply: (value: string) => void;
}) {
  const [bulkVal, setBulkVal] = React.useState("");

  return (
    <div className="flex flex-wrap items-center gap-3 bg-muted/40 px-4 py-2.5 border rounded-lg">
      <div className="flex items-center gap-1.5 font-medium text-muted-foreground text-xs">
        <CheckCheck className="w-3.5 h-3.5" />
        Bulk grade all:
      </div>
      <div className="flex items-center gap-2">
        <GradeInput
          mode={mode}
          totalMarks={totalMarks}
          value={bulkVal}
          onChange={setBulkVal}
        />
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="h-8 text-xs"
          disabled={!bulkVal}
          onClick={() => {
            if (bulkVal) onApply(bulkVal);
          }}
        >
          Apply to all
        </Button>
      </div>
      <p className="hidden sm:block ml-auto text-muted-foreground text-xs">
        This will overwrite existing grades
      </p>
    </div>
  );
}

// ─── Grading stats summary ────────────────────────────────────────────────────

function GradingSummary({
  grades,
  mode,
  totalMarks,
  total,
}: {
  grades: { gradeValue: string }[];
  mode: GradingMode;
  totalMarks: number;
  total: number;
}) {
  const graded = grades.filter((g) => g.gradeValue).length;

  if (mode === "marks" || mode === "percentage") {
    const values = grades
      .map((g) => Number(g.gradeValue))
      .filter((v) => !isNaN(v) && v > 0);
    const avg = values.length
      ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)
      : "—";
    const max = values.length ? Math.max(...values) : "—";
    const min = values.length ? Math.min(...values) : "—";

    return (
      <div className="gap-3 grid grid-cols-2 sm:grid-cols-4">
        {[
          { label: "Graded", value: `${graded}/${total}` },
          { label: "Average", value: mode === "marks" ? `${avg}` : `${avg}%` },
          {
            label: "Highest",
            value: mode === "marks" ? `${max}/${totalMarks}` : `${max}%`,
          },
          {
            label: "Lowest",
            value: mode === "marks" ? `${min}/${totalMarks}` : `${min}%`,
          },
        ].map((s) => (
          <div
            key={s.label}
            className="space-y-0.5 bg-card p-3 border rounded-lg"
          >
            <p className="text-muted-foreground text-xs">{s.label}</p>
            <p className="font-semibold text-lg">{s.value}</p>
          </div>
        ))}
      </div>
    );
  }

  if (mode === "letter") {
    const dist: Record<string, number> = {};
    grades.forEach((g) => {
      if (g.gradeValue) dist[g.gradeValue] = (dist[g.gradeValue] ?? 0) + 1;
    });
    return (
      <div className="flex flex-wrap gap-2">
        {LETTER_GRADES.map((g) => (
          <div
            key={g}
            className={cn(
              "flex items-center gap-2 bg-card px-3 py-2 border rounded-lg",
            )}
          >
            <span className={cn("font-bold text-sm", letterGradeColor(g))}>
              {g}
            </span>
            <span className="font-semibold text-sm">{dist[g] ?? 0}</span>
            <span className="text-muted-foreground text-xs">students</span>
          </div>
        ))}
        <div className="flex items-center gap-2 bg-card px-3 py-2 border rounded-lg">
          <Star className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="font-semibold text-sm">
            {graded}/{total}
          </span>
          <span className="text-muted-foreground text-xs">graded</span>
        </div>
      </div>
    );
  }

  // pass_fail
  const passes = grades.filter((g) => g.gradeValue === "pass").length;
  const fails = grades.filter((g) => g.gradeValue === "fail").length;
  return (
    <div className="gap-3 grid grid-cols-2 sm:grid-cols-4">
      {[
        { label: "Graded", value: `${graded}/${total}` },
        {
          label: "Passed",
          value: String(passes),
          color: "text-emerald-600 dark:text-emerald-400",
        },
        {
          label: "Failed",
          value: String(fails),
          color: "text-red-600 dark:text-red-400",
        },
        {
          label: "Pass Rate",
          value: graded ? `${Math.round((passes / graded) * 100)}%` : "—",
        },
      ].map((s) => (
        <div
          key={s.label}
          className="space-y-0.5 bg-card p-3 border rounded-lg"
        >
          <p className="text-muted-foreground text-xs">{s.label}</p>
          <p className={cn("font-semibold text-lg", s.color)}>{s.value}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function GradingPage() {
  const [typeFilter, setTypeFilter] = React.useState<AssignmentType | "all">(
    "all",
  );
  const [selectedAssignment, setSelectedAssignment] =
    React.useState<Assignment | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  const form = useForm<GradingFormValues>({
    resolver: zodResolver(gradingFormSchema),
    defaultValues: {
      assignmentId: "",
      gradingMode: "marks",
      grades: [],
      bulkValue: "",
    },
  });

  const { fields } = useFieldArray({ control: form.control, name: "grades" });
  const watchGrades = form.watch("grades");
  const watchMode = form.watch("gradingMode");

  // Load submissions when assignment selected
  function openAssignment(assignment: Assignment) {
    setSelectedAssignment(assignment);
    const submissions = MOCK_SUBMISSIONS[assignment.id] ?? [];
    form.reset({
      assignmentId: assignment.id,
      gradingMode: assignment.gradingMode,
      grades: submissions.map((s) => ({
        studentId: s.studentId,
        gradeValue: s.grade,
        feedback: "",
      })),
    });
  }

  function applyBulkGrade(value: string) {
    const current = form.getValues("grades");
    current.forEach((_, idx) =>
      form.setValue(`grades.${idx}.gradeValue`, value),
    );
    toast.info("Bulk grade applied", {
      description: `Set to "${value}" for all students`,
    });
  }

  async function onSubmit(values: GradingFormValues) {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    console.log("Grades submitted:", values);
    setIsSaving(false);
    toast.success("Grades saved successfully", {
      description: `${values.grades.length} students · ${selectedAssignment?.title}`,
    });
  }

  const filteredAssignments = MOCK_ASSIGNMENTS.filter(
    (a) => typeFilter === "all" || a.type === typeFilter,
  );

  const submissions = selectedAssignment
    ? (MOCK_SUBMISSIONS[selectedAssignment.id] ?? [])
    : [];

  // ── Detail view ──────────────────────────────────────────────────────────────
  if (selectedAssignment) {
    return (
      <div className="space-y-6 mx-auto p-6 max-w-5xl">
        {/* Back + header */}
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="mt-0.5 -ml-2"
            onClick={() => setSelectedAssignment(null)}
          >
            <ArrowLeft className="mr-1 w-4 h-4" />
            Back
          </Button>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-medium text-xs",
                TYPE_CONFIG[selectedAssignment.type].color,
              )}
            >
              {TYPE_CONFIG[selectedAssignment.type].icon}
              {TYPE_CONFIG[selectedAssignment.type].label}
            </span>
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-md font-medium text-xs",
                STATUS_CONFIG[selectedAssignment.status].color,
              )}
            >
              {STATUS_CONFIG[selectedAssignment.status].label}
            </span>
          </div>
          <h1 className="mt-1 font-semibold text-2xl tracking-tight">
            {selectedAssignment.title}
          </h1>
          <p className="text-muted-foreground text-sm">
            {selectedAssignment.class} · {selectedAssignment.subject} · Due{" "}
            {format(new Date(selectedAssignment.dueDate), "PPP")}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Grading mode selector */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Grading Mode</CardTitle>
                <CardDescription>
                  Choose how to record grades for this assessment.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="gradingMode"
                  render={({ field }) => (
                    <FormItem>
                      <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
                        {(
                          Object.keys(GRADING_MODE_CONFIG) as GradingMode[]
                        ).map((mode) => {
                          const cfg = GRADING_MODE_CONFIG[mode];
                          const isActive = field.value === mode;
                          return (
                            <button
                              key={mode}
                              type="button"
                              onClick={() => field.onChange(mode)}
                              className={cn(
                                "flex flex-col items-start gap-1 p-3 border rounded-lg text-left transition-all duration-150",
                                isActive
                                  ? "border-primary bg-primary/5 dark:bg-primary/10"
                                  : "border-border hover:bg-muted",
                              )}
                            >
                              <div
                                className={cn(
                                  "p-1.5 rounded-md",
                                  isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground",
                                )}
                              >
                                {cfg.icon}
                              </div>
                              <span className="font-semibold text-xs">
                                {cfg.label}
                              </span>
                              <span className="text-[11px] text-muted-foreground leading-tight">
                                {cfg.description}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Live summary */}
            <GradingSummary
              grades={watchGrades}
              mode={watchMode as GradingMode}
              totalMarks={selectedAssignment.totalMarks}
              total={fields.length}
            />

            {/* Bulk grade bar */}
            <BulkGradeBar
              mode={watchMode as GradingMode}
              totalMarks={selectedAssignment.totalMarks}
              onApply={applyBulkGrade}
            />

            {/* Grades table */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <CardTitle className="text-base">Student Grades</CardTitle>
                  <Badge variant="secondary">{fields.length} students</Badge>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="pl-6 w-[60px]">Roll</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead className="hidden sm:table-cell w-[140px]">
                        Submitted
                      </TableHead>
                      <TableHead className="w-[140px]">Grade</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Feedback
                        <span className="ml-1 font-normal text-muted-foreground">
                          (optional)
                        </span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => {
                      const sub = submissions[index];
                      if (!sub) return null;
                      const gradeVal = watchGrades[index]?.gradeValue ?? "";
                      const isGraded = !!gradeVal;

                      return (
                        <TableRow
                          key={field.id}
                          className={cn(
                            "transition-colors",
                            !sub.submittedAt && "opacity-60",
                          )}
                        >
                          <TableCell className="pl-6 font-mono text-muted-foreground text-xs">
                            {sub.rollNumber}
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center gap-2.5">
                              <div
                                className={cn(
                                  "flex justify-center items-center rounded-full w-8 h-8 font-semibold text-xs shrink-0",
                                  isGraded
                                    ? "bg-primary/10 text-primary"
                                    : "bg-muted text-muted-foreground",
                                )}
                              >
                                {sub.avatarInitials}
                              </div>
                              <div>
                                <p className="font-medium text-sm">
                                  {sub.studentName}
                                </p>
                                {!sub.submittedAt && (
                                  <p className="text-[11px] text-muted-foreground">
                                    Not submitted
                                  </p>
                                )}
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="hidden sm:table-cell text-muted-foreground text-xs">
                            {sub.submittedAt ? (
                              format(
                                new Date(sub.submittedAt),
                                "dd MMM · HH:mm",
                              )
                            ) : (
                              <span className="text-destructive/70">—</span>
                            )}
                          </TableCell>

                          <TableCell>
                            <Controller
                              control={form.control}
                              name={`grades.${index}.gradeValue`}
                              render={({ field: f, fieldState }) => (
                                <GradeInput
                                  mode={watchMode as GradingMode}
                                  totalMarks={selectedAssignment.totalMarks}
                                  value={f.value}
                                  onChange={f.onChange}
                                  hasError={!!fieldState.error}
                                />
                              )}
                            />
                          </TableCell>

                          <TableCell className="hidden md:table-cell">
                            <Controller
                              control={form.control}
                              name={`grades.${index}.feedback`}
                              render={({ field: f }) => (
                                <input
                                  {...f}
                                  placeholder="Add feedback…"
                                  className="bg-background px-2.5 py-1.5 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 w-full placeholder:text-muted-foreground text-xs"
                                />
                              )}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Sticky footer */}
            <div className="bottom-4 sticky flex justify-between items-center gap-4 bg-card shadow-md px-4 py-3 border rounded-lg">
              <p className="text-muted-foreground text-xs">
                {watchGrades.filter((g) => g.gradeValue).length} of{" "}
                {fields.length} graded
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => openAssignment(selectedAssignment)}
                >
                  <RotateCcw className="mr-1.5 w-3.5 h-3.5" />
                  Reset
                </Button>
                <Button type="submit" size="sm" disabled={isSaving}>
                  <Save className="mr-1.5 w-3.5 h-3.5" />
                  {isSaving ? "Saving…" : "Save Grades"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    );
  }

  // ── List view ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 mx-auto p-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-2xl tracking-tight">Grading</h1>
        <p className="text-muted-foreground text-sm">
          Grade assignments, quizzes, and exams for your classes.
        </p>
      </div>

      {/* Summary ribbon */}
      <div className="gap-3 grid grid-cols-3">
        {(
          [
            {
              label: "Pending",
              status: "pending",
              count: MOCK_ASSIGNMENTS.filter((a) => a.status === "pending")
                .length,
            },
            {
              label: "Partial",
              status: "partial",
              count: MOCK_ASSIGNMENTS.filter((a) => a.status === "partial")
                .length,
            },
            {
              label: "Graded",
              status: "graded",
              count: MOCK_ASSIGNMENTS.filter((a) => a.status === "graded")
                .length,
            },
          ] as const
        ).map((item) => (
          <div
            key={item.status}
            className="flex items-center gap-3 bg-card hover:bg-muted/40 p-3 border rounded-lg transition-colors cursor-pointer"
          >
            <div
              className={cn("rounded-full w-2 h-2 shrink-0", {
                "bg-amber-500": item.status === "pending",
                "bg-blue-500": item.status === "partial",
                "bg-emerald-500": item.status === "graded",
              })}
            />
            <div>
              <p className="text-muted-foreground text-xs">{item.label}</p>
              <p className="font-semibold text-xl leading-tight">
                {item.count}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Type filter */}
      <div className="flex flex-wrap items-center gap-2">
        {(["all", "assignment", "quiz", "exam"] as const).map((type) => {
          const isAll = type === "all";
          const cfg = isAll ? null : TYPE_CONFIG[type];
          const isActive = typeFilter === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => setTypeFilter(type)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 border rounded-full font-medium text-xs transition-all",
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:bg-muted",
              )}
            >
              {cfg?.icon}
              {isAll ? "All" : cfg?.label}
            </button>
          );
        })}
        <span className="ml-auto text-muted-foreground text-xs">
          {filteredAssignments.length} item
          {filteredAssignments.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Assignment grid */}
      {filteredAssignments.length > 0 ? (
        <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAssignments.map((a) => (
            <AssignmentCard
              key={a.id}
              assignment={a}
              onSelect={() => openAssignment(a)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center bg-muted/30 py-16 border border-dashed rounded-lg text-center">
          <AlertCircle className="mb-3 w-10 h-10 text-muted-foreground/50" />
          <p className="font-medium text-muted-foreground text-sm">
            No assignments found for this filter
          </p>
        </div>
      )}
    </div>
  );
}
