"use client";

import * as React from "react";
import {
  CalendarDays,
  TrendingUp,
  BookOpen,
  FlaskConical,
  Music,
  Dumbbell,
  Globe,
  Calculator,
  CheckCircle2,
  XCircle,
  MinusCircle,
  ChevronLeft,
  ChevronRight,
  Star,
  MessageSquare,
  BarChart3,
  Award,
  Flame,
  AlertTriangle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

// ─── Types ────────────────────────────────────────────────────────────────────

type AttendanceStatus = "present" | "absent" | "late" | "holiday" | null;

interface DayAttendance {
  date: string; // "YYYY-MM-DD"
  status: AttendanceStatus;
}

interface SubjectAttendance {
  subject: string;
  total: number;
  present: number;
  absent: number;
  late: number;
}

interface Assignment {
  id: string;
  subject: string;
  title: string;
  submittedOn: string;
  score: number;
  maxScore: number;
  grade: string;
  feedback: string;
  teacher: string;
}

// ─── Subject Config ───────────────────────────────────────────────────────────

const SUBJECT_CONFIG: Record<string, { color: string; icon: React.ReactNode }> =
  {
    Mathematics: {
      color:
        "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800",
      icon: <Calculator className="w-3 h-3" />,
    },
    Science: {
      color:
        "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
      icon: <FlaskConical className="w-3 h-3" />,
    },
    English: {
      color:
        "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
      icon: <BookOpen className="w-3 h-3" />,
    },
    History: {
      color:
        "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800",
      icon: <Globe className="w-3 h-3" />,
    },
    Music: {
      color:
        "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-950 dark:text-pink-300 dark:border-pink-800",
      icon: <Music className="w-3 h-3" />,
    },
    PE: {
      color:
        "bg-lime-100 text-lime-800 border-lime-200 dark:bg-lime-950 dark:text-lime-300 dark:border-lime-800",
      icon: <Dumbbell className="w-3 h-3" />,
    },
  };

function getSubjectCfg(subject: string) {
  return (
    SUBJECT_CONFIG[subject] ?? {
      color: "bg-muted text-muted-foreground border-border",
      icon: <BookOpen className="w-3 h-3" />,
    }
  );
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

// March 2025 attendance
const MOCK_CALENDAR: DayAttendance[] = [
  { date: "2025-03-03", status: "present" },
  { date: "2025-03-04", status: "present" },
  { date: "2025-03-05", status: "present" },
  { date: "2025-03-06", status: "late" },
  { date: "2025-03-07", status: "present" },
  { date: "2025-03-10", status: "absent" },
  { date: "2025-03-11", status: "present" },
  { date: "2025-03-12", status: "present" },
  { date: "2025-03-13", status: "present" },
  { date: "2025-03-14", status: "present" },
  { date: "2025-03-17", status: "present" },
  { date: "2025-03-18", status: "present" },
  { date: "2025-03-19", status: "holiday" },
  { date: "2025-03-20", status: "present" },
  { date: "2025-03-21", status: "present" },
  { date: "2025-03-24", status: "present" },
  { date: "2025-03-25", status: "late" },
  { date: "2025-03-26", status: "present" },
  { date: "2025-03-27", status: "present" },
  { date: "2025-03-28", status: "present" },
];

const MOCK_SUBJECT_ATTENDANCE: SubjectAttendance[] = [
  { subject: "Mathematics", total: 20, present: 19, absent: 0, late: 1 },
  { subject: "Science", total: 18, present: 16, absent: 1, late: 1 },
  { subject: "English", total: 19, present: 17, absent: 2, late: 0 },
  { subject: "History", total: 16, present: 15, absent: 1, late: 0 },
  { subject: "Music", total: 8, present: 8, absent: 0, late: 0 },
  { subject: "PE", total: 10, present: 9, absent: 0, late: 1 },
];

const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: "a1",
    subject: "Mathematics",
    title: "Quadratic Equations – Problem Set 3",
    submittedOn: "2025-03-20",
    score: 46,
    maxScore: 50,
    grade: "A",
    feedback:
      "Excellent work! Your approach to problem 7 was particularly creative. Minor arithmetic error in Q4b — watch your signs when expanding brackets.",
    teacher: "Ms. Kavitha Rao",
  },
  {
    id: "a2",
    subject: "English",
    title: "Persuasive Essay – Climate Change",
    submittedOn: "2025-03-18",
    score: 38,
    maxScore: 50,
    grade: "B+",
    feedback:
      "Strong argument structure and good use of evidence. Your introduction was compelling. The conclusion felt rushed — try to revisit and strengthen your final call to action.",
    teacher: "Ms. Anita Desai",
  },
  {
    id: "a3",
    subject: "Science",
    title: "Lab Report – Titration Experiment",
    submittedOn: "2025-03-15",
    score: 43,
    maxScore: 50,
    grade: "A-",
    feedback:
      "Very thorough analysis. Results and discussion section was well-written. Remember to include error analysis and discuss possible sources of experimental error.",
    teacher: "Mr. Suresh Pillai",
  },
  {
    id: "a4",
    subject: "History",
    title: "Essay – Causes of World War I",
    submittedOn: "2025-03-12",
    score: 32,
    maxScore: 50,
    grade: "B-",
    feedback:
      "Good understanding of the main events. However, the essay needs more depth on the long-term causes. The MAIN acronym framework would help you structure this better.",
    teacher: "Mr. Ravi Shankar",
  },
  {
    id: "a5",
    subject: "Mathematics",
    title: "Statistics – Data Analysis Project",
    submittedOn: "2025-03-08",
    score: 48,
    maxScore: 50,
    grade: "A+",
    feedback:
      "Outstanding project! Your data visualisation was excellent and your interpretation of results showed real statistical thinking. Well done.",
    teacher: "Ms. Kavitha Rao",
  },
  {
    id: "a6",
    subject: "English",
    title: "Poetry Analysis – Keats",
    submittedOn: "2025-03-05",
    score: 41,
    maxScore: 50,
    grade: "A-",
    feedback:
      "Perceptive reading of the poem. You identified the key imagery well. Push yourself to explore the historical context more deeply next time.",
    teacher: "Ms. Anita Desai",
  },
  {
    id: "a7",
    subject: "Science",
    title: "Chapter 6 Quiz – Chemical Bonding",
    submittedOn: "2025-02-28",
    score: 18,
    maxScore: 25,
    grade: "B",
    feedback:
      "Solid performance. Review ionic vs covalent bonding differences.",
    teacher: "Mr. Suresh Pillai",
  },
  {
    id: "a8",
    subject: "Music",
    title: "Rhythm Notation Assignment",
    submittedOn: "2025-02-25",
    score: 24,
    maxScore: 25,
    grade: "A+",
    feedback:
      "Perfect notation throughout. You clearly have a strong sense of rhythm. Looking forward to your performance piece.",
    teacher: "Ms. Preethi Nair",
  },
];

// Grade trend (last 6 months average %)
const GRADE_TREND = [
  { month: "Oct", avg: 74 },
  { month: "Nov", avg: 78 },
  { month: "Dec", avg: 76 },
  { month: "Jan", avg: 82 },
  { month: "Feb", avg: 85 },
  { month: "Mar", avg: 88 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function gradeColor(grade: string): string {
  if (grade.startsWith("A"))
    return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800";
  if (grade.startsWith("B"))
    return "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800";
  if (grade.startsWith("C"))
    return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800";
  return "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800";
}

function attendancePctColor(pct: number): string {
  if (pct >= 90) return "text-emerald-600 dark:text-emerald-400";
  if (pct >= 75) return "text-amber-600 dark:text-amber-400";
  return "text-rose-600 dark:text-rose-400";
}

function attendanceBarColor(pct: number): string {
  if (pct >= 90) return "[&>div]:bg-emerald-500";
  if (pct >= 75) return "[&>div]:bg-amber-500";
  return "[&>div]:bg-rose-500";
}

function statusIcon(status: AttendanceStatus) {
  if (status === "present")
    return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
  if (status === "absent")
    return <XCircle className="w-3.5 h-3.5 text-rose-500" />;
  if (status === "late")
    return <MinusCircle className="w-3.5 h-3.5 text-amber-500" />;
  if (status === "holiday")
    return <Star className="w-3.5 h-3.5 text-sky-400" />;
  return null;
}

// ─── TAB 1: Attendance ────────────────────────────────────────────────────────

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function AttendanceTab() {
  const [monthOffset, setMonthOffset] = React.useState(0); // 0 = March 2025

  const baseYear = 2025;
  const baseMonth = 2; // 0-indexed March
  const viewDate = new Date(baseYear, baseMonth + monthOffset, 1);
  const viewYear = viewDate.getFullYear();
  const viewMonthIdx = viewDate.getMonth();
  const viewMonthName = MONTHS[viewMonthIdx];

  // Build calendar grid for the viewed month
  const firstDow = new Date(viewYear, viewMonthIdx, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(viewYear, viewMonthIdx + 1, 0).getDate();
  // Convert Sun=0 to Mon=0 offset
  const startOffset = (firstDow + 6) % 7;

  const calMap = React.useMemo(() => {
    const m: Record<string, AttendanceStatus> = {};
    MOCK_CALENDAR.forEach((d) => {
      m[d.date] = d.status;
    });
    return m;
  }, []);

  const monthDays = Array.from({ length: daysInMonth }, (_, i) => {
    const d = i + 1;
    const key = `${viewYear}-${String(viewMonthIdx + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const dow = new Date(viewYear, viewMonthIdx, d).getDay();
    const isWeekend = dow === 0 || dow === 6;
    return { day: d, key, status: calMap[key] ?? null, isWeekend };
  });

  // Overall stats for current month data
  const totalDays = MOCK_CALENDAR.filter((d) => d.status !== "holiday").length;
  const presentDays = MOCK_CALENDAR.filter(
    (d) => d.status === "present",
  ).length;
  const absentDays = MOCK_CALENDAR.filter((d) => d.status === "absent").length;
  const lateDays = MOCK_CALENDAR.filter((d) => d.status === "late").length;
  const overallPct = Math.round((presentDays / totalDays) * 100);

  // Streak: count consecutive present/late days from most recent
  const sorted = [...MOCK_CALENDAR]
    .filter((d) => d.status !== "holiday")
    .sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;
  for (const d of sorted) {
    if (d.status === "present" || d.status === "late") streak++;
    else break;
  }

  const cellStatus = (status: AttendanceStatus, isWeekend: boolean) => {
    if (isWeekend) return "bg-muted/30 text-muted-foreground/40 cursor-default";
    if (status === "present")
      return "bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 font-semibold";
    if (status === "absent")
      return "bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800 font-semibold";
    if (status === "late")
      return "bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800 font-semibold";
    if (status === "holiday")
      return "bg-sky-100 text-sky-700 border border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800";
    return "bg-card text-muted-foreground/60 border border-border/40";
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Summary stat cards */}
      <div className="gap-3 grid grid-cols-2 sm:grid-cols-4">
        {/* Overall % */}
        <div className="flex flex-col justify-between bg-card p-4 border rounded-xl">
          <p className="text-muted-foreground text-xs">Overall</p>
          <p
            className={cn(
              "mt-1 font-bold text-2xl",
              attendancePctColor(overallPct),
            )}
          >
            {overallPct}%
          </p>
          <p className="text-[10px] text-muted-foreground">
            {presentDays}/{totalDays} days
          </p>
        </div>

        {/* Streak */}
        <div className="flex flex-col justify-between bg-card p-4 border rounded-xl">
          <p className="text-muted-foreground text-xs">Current Streak</p>
          <div className="flex items-center gap-1 mt-1">
            <Flame className="w-5 h-5 text-orange-500" />
            <p className="font-bold text-orange-500 text-2xl">{streak}</p>
          </div>
          <p className="text-[10px] text-muted-foreground">days in a row</p>
        </div>

        {/* Absent */}
        <div className="flex flex-col justify-between bg-card p-4 border rounded-xl">
          <p className="text-muted-foreground text-xs">Absences</p>
          <p className="mt-1 font-bold text-rose-500 text-2xl">{absentDays}</p>
          <p className="text-[10px] text-muted-foreground">this month</p>
        </div>

        {/* Late */}
        <div className="flex flex-col justify-between bg-card p-4 border rounded-xl">
          <p className="text-muted-foreground text-xs">Late Arrivals</p>
          <p className="mt-1 font-bold text-amber-500 text-2xl">{lateDays}</p>
          <p className="text-[10px] text-muted-foreground">this month</p>
        </div>
      </div>

      {/* Low attendance warning */}
      {overallPct < 75 && (
        <div className="flex items-start gap-3 bg-rose-50 dark:bg-rose-950/30 px-4 py-3 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-300 text-sm">
          <AlertTriangle className="mt-0.5 w-4 h-4 shrink-0" />
          <span>
            Your attendance is below the required 75% threshold. Please speak
            with your class teacher.
          </span>
        </div>
      )}

      {/* Calendar */}
      <div className="space-y-4 bg-card p-4 border rounded-xl">
        {/* Month nav */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => setMonthOffset((o) => o - 1)}
            className="hover:bg-muted p-1.5 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <p className="font-semibold text-sm">
            {viewMonthName} {viewYear}
          </p>
          <button
            type="button"
            onClick={() => setMonthOffset((o) => o + 1)}
            className="hover:bg-muted p-1.5 rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Day headers */}
        <div className="gap-1 grid grid-cols-7 text-center">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <div
              key={i}
              className={cn(
                "py-1 font-semibold text-[10px]",
                i >= 5 ? "text-muted-foreground/40" : "text-muted-foreground",
              )}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="gap-1 grid grid-cols-7">
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {monthDays.map(({ day, key, status, isWeekend }) => (
            <div
              key={key}
              className={cn(
                "flex flex-col justify-center items-center rounded-lg aspect-square text-xs transition-all",
                cellStatus(status, isWeekend),
              )}
            >
              <span>{day}</span>
              {!isWeekend && status && (
                <span className="mt-0.5 scale-75">{statusIcon(status)}</span>
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 pt-1">
          {[
            { status: "present" as const, label: "Present" },
            { status: "absent" as const, label: "Absent" },
            { status: "late" as const, label: "Late" },
            { status: "holiday" as const, label: "Holiday" },
          ].map(({ status, label }) => (
            <div key={status} className="flex items-center gap-1.5">
              {statusIcon(status)}
              <span className="text-[10px] text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Per-subject breakdown */}
      <div>
        <h2 className="mb-4 font-semibold text-base">Per-Subject Breakdown</h2>
        <div className="space-y-3">
          {MOCK_SUBJECT_ATTENDANCE.map((s) => {
            const pct = Math.round((s.present / s.total) * 100);
            const cfg = getSubjectCfg(s.subject);
            return (
              <div key={s.subject} className="bg-card p-4 border rounded-xl">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-1 border rounded-full font-medium text-xs",
                        cfg.color,
                      )}
                    >
                      {cfg.icon}
                      {s.subject}
                    </span>
                  </div>
                  <span
                    className={cn("font-bold text-sm", attendancePctColor(pct))}
                  >
                    {pct}%
                  </span>
                </div>
                <Progress
                  value={pct}
                  className={cn("h-1.5", attendanceBarColor(pct))}
                />
                <div className="flex gap-4 mt-2 text-[10px] text-muted-foreground">
                  <span className="text-emerald-600 dark:text-emerald-400">
                    ✓ {s.present} present
                  </span>
                  {s.absent > 0 && (
                    <span className="text-rose-500">✗ {s.absent} absent</span>
                  )}
                  {s.late > 0 && (
                    <span className="text-amber-500">~ {s.late} late</span>
                  )}
                  <span className="ml-auto">{s.total} total</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── TAB 2: Grades & Feedback ─────────────────────────────────────────────────

function GradesTab() {
  const [selectedAssignment, setSelectedAssignment] =
    React.useState<Assignment | null>(null);

  // Subject GPA
  const subjectAverages = React.useMemo(() => {
    const map: Record<string, number[]> = {};
    MOCK_ASSIGNMENTS.forEach((a) => {
      if (!map[a.subject]) map[a.subject] = [];
      map[a.subject].push((a.score / a.maxScore) * 100);
    });
    return Object.entries(map).map(([subject, scores]) => ({
      subject,
      avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    }));
  }, []);

  const overallAvg = Math.round(
    MOCK_ASSIGNMENTS.reduce((sum, a) => sum + (a.score / a.maxScore) * 100, 0) /
      MOCK_ASSIGNMENTS.length,
  );

  // Mini bar chart height
  const maxTrend = Math.max(...GRADE_TREND.map((g) => g.avg));

  return (
    <div className="space-y-6 font-sans">
      {/* Top stats */}
      <div className="gap-3 grid grid-cols-2 sm:grid-cols-3">
        <div className="flex flex-col justify-between bg-card p-4 border rounded-xl">
          <p className="text-muted-foreground text-xs">Overall Average</p>
          <p
            className={cn(
              "mt-1 font-bold text-2xl",
              attendancePctColor(overallAvg),
            )}
          >
            {overallAvg}%
          </p>
          <p className="text-[10px] text-muted-foreground">
            across all subjects
          </p>
        </div>
        <div className="flex flex-col justify-between bg-card p-4 border rounded-xl">
          <p className="text-muted-foreground text-xs">Assignments Graded</p>
          <p className="mt-1 font-bold text-2xl">{MOCK_ASSIGNMENTS.length}</p>
          <p className="text-[10px] text-muted-foreground">this term</p>
        </div>
        <div className="hidden sm:flex flex-col justify-between bg-card p-4 border rounded-xl">
          <p className="text-muted-foreground text-xs">Top Subject</p>
          <div className="flex items-center gap-1.5 mt-1">
            <Award className="w-5 h-5 text-amber-500" />
            <p className="font-bold text-base">
              {subjectAverages.sort((a, b) => b.avg - a.avg)[0]?.subject}
            </p>
          </div>
          <p className="text-[10px] text-muted-foreground">
            {subjectAverages.sort((a, b) => b.avg - a.avg)[0]?.avg}% average
          </p>
        </div>
      </div>

      {/* Grade trend chart */}
      <div className="bg-card p-4 border rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="font-semibold text-sm">Grade Trend</h2>
            <p className="text-muted-foreground text-xs">
              Monthly average score %
            </p>
          </div>
          <div className="flex items-center gap-1 font-medium text-emerald-500 text-xs">
            <TrendingUp className="w-3.5 h-3.5" />
            +14% since Oct
          </div>
        </div>
        {/* Bar chart */}
        <div className="flex items-end gap-2 h-28">
          {GRADE_TREND.map((g, i) => {
            const isLast = i === GRADE_TREND.length - 1;
            const height = `${(g.avg / maxTrend) * 100}%`;
            return (
              <div
                key={g.month}
                className="flex flex-col flex-1 items-center gap-1"
              >
                <span className="font-medium text-[10px] text-muted-foreground">
                  {g.avg}%
                </span>
                <div
                  className={cn(
                    "rounded-t-md w-full transition-all",
                    isLast
                      ? "bg-primary"
                      : "bg-muted-foreground/20 dark:bg-muted-foreground/30",
                  )}
                  style={{ height }}
                />
                <span className="text-[10px] text-muted-foreground">
                  {g.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subject averages */}
      <div>
        <h2 className="mb-3 font-semibold text-base">Subject Averages</h2>
        <div className="gap-2 grid grid-cols-2 sm:grid-cols-3">
          {subjectAverages
            .sort((a, b) => b.avg - a.avg)
            .map(({ subject, avg }) => {
              const cfg = getSubjectCfg(subject);
              return (
                <div
                  key={subject}
                  className="flex items-center gap-3 bg-card p-3 border rounded-xl"
                >
                  <div
                    className={cn(
                      "flex justify-center items-center rounded-lg w-8 h-8 shrink-0",
                      cfg.color,
                    )}
                  >
                    {cfg.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-xs truncate">{subject}</p>
                    <p
                      className={cn(
                        "font-bold text-sm",
                        attendancePctColor(avg),
                      )}
                    >
                      {avg}%
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <Separator />

      {/* Assignment list */}
      <div>
        <h2 className="mb-4 font-semibold text-base">Recent Assignments</h2>
        <div className="space-y-2">
          {MOCK_ASSIGNMENTS.map((a) => {
            const cfg = getSubjectCfg(a.subject);
            const pct = Math.round((a.score / a.maxScore) * 100);
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => setSelectedAssignment(a)}
                className="flex items-center gap-4 bg-card hover:bg-muted/40 px-4 py-3 border rounded-xl w-full text-left hover:scale-[1.005] active:scale-100 transition-all duration-150"
              >
                {/* Subject pill */}
                <span
                  className={cn(
                    "inline-flex items-center gap-1 px-2.5 py-1 border rounded-full font-medium text-xs shrink-0",
                    cfg.color,
                  )}
                >
                  {cfg.icon}
                  <span className="hidden sm:inline">{a.subject}</span>
                </span>

                {/* Title + teacher */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{a.title}</p>
                  <p className="text-muted-foreground text-xs truncate">
                    {a.teacher} · {a.submittedOn}
                  </p>
                </div>

                {/* Score + grade */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className="hidden sm:block text-muted-foreground text-xs">
                    {a.score}/{a.maxScore}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-1 border rounded-lg font-bold text-xs",
                      gradeColor(a.grade),
                    )}
                  >
                    {a.grade}
                  </span>
                  <MessageSquare className="w-3.5 h-3.5 text-muted-foreground/50" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Assignment detail dialog */}
      <Dialog
        open={!!selectedAssignment}
        onOpenChange={() => setSelectedAssignment(null)}
      >
        <DialogContent className="max-w-sm">
          {selectedAssignment && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2.5 py-1 border rounded-full font-medium text-xs",
                      getSubjectCfg(selectedAssignment.subject).color,
                    )}
                  >
                    {getSubjectCfg(selectedAssignment.subject).icon}
                    {selectedAssignment.subject}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-1 border rounded-lg font-bold text-xs",
                      gradeColor(selectedAssignment.grade),
                    )}
                  >
                    {selectedAssignment.grade}
                  </span>
                </div>
                <DialogTitle className="leading-snug">
                  {selectedAssignment.title}
                </DialogTitle>
                <DialogDescription>
                  {selectedAssignment.teacher} · Submitted{" "}
                  {selectedAssignment.submittedOn}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Score bar */}
                <div>
                  <div className="flex justify-between mb-1.5 font-medium text-sm">
                    <span>Score</span>
                    <span>
                      {selectedAssignment.score}/{selectedAssignment.maxScore}
                    </span>
                  </div>
                  <Progress
                    value={
                      (selectedAssignment.score / selectedAssignment.maxScore) *
                      100
                    }
                    className={cn(
                      "h-2",
                      attendanceBarColor(
                        Math.round(
                          (selectedAssignment.score /
                            selectedAssignment.maxScore) *
                            100,
                        ),
                      ),
                    )}
                  />
                  <p className="mt-1 text-muted-foreground text-xs">
                    {Math.round(
                      (selectedAssignment.score / selectedAssignment.maxScore) *
                        100,
                    )}
                    %
                  </p>
                </div>

                <Separator />

                {/* Feedback */}
                <div>
                  <p className="flex items-center gap-1.5 mb-2 font-medium text-sm">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Teacher Feedback
                  </p>
                  <p className="bg-muted/40 p-3 rounded-lg text-muted-foreground text-sm leading-relaxed">
                    {selectedAssignment.feedback}
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedAssignment(null)}
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Page Root ────────────────────────────────────────────────────────────────

export default function StudentGradingAttendancePage() {
  return (
    <div className="space-y-6 mx-auto p-6 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-2xl tracking-tight">
          Grades & Attendance
        </h1>
        <p className="text-muted-foreground text-sm">
          Your attendance record and graded assignments for Grade 10 – A.
        </p>
      </div>

      <Tabs defaultValue="attendance" className="space-y-6">
        <TabsList className="grid grid-cols-2 w-full max-w-xs">
          <TabsTrigger
            value="attendance"
            className="flex items-center gap-1.5 text-sm"
          >
            <CalendarDays className="w-3.5 h-3.5" />
            Attendance
          </TabsTrigger>
          <TabsTrigger
            value="grades"
            className="flex items-center gap-1.5 text-sm"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Grades
          </TabsTrigger>
        </TabsList>

        <TabsContent value="attendance">
          <AttendanceTab />
        </TabsContent>

        <TabsContent value="grades">
          <GradesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
