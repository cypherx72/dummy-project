"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { format } from "date-fns";
import {
  FileText,
  Download,
  Printer,
  ArrowLeft,
  Calendar,
  TrendingUp,
  Award,
  Users,
  BookOpen,
  BarChart3,
  CheckCircle,
  Target,
  Star,
  AlertCircle,
  ChevronRight,
  Eye,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

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
import { Progress } from "@/components/ui/progress";
import { showToast, errorToast } from "@/components/ui/toast";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  class: string;
  section: string;
  avatarInitials: string;
  email: string;
  overallGrade: string;
  overallPercentage: number;
}

interface SubjectGrade {
  subject: string;
  term1: number;
  term2: number;
  term3: number;
  average: number;
  grade: string;
  assignments: number;
  teacher: string;
}

interface TermProgress {
  term: string;
  percentage: number;
  grade: string;
  rank: number;
}

interface AttendanceData {
  present: number;
  absent: number;
  total: number;
  percentage: number;
}

interface ReportData {
  student: Student;
  subjects: SubjectGrade[];
  termProgress: TermProgress[];
  attendance: AttendanceData;
  remarks: string;
  strengths: string[];
  improvements: string[];
  achievements: string[];
}

// ─── Zod Schema ───────────────────────────────────────────────────────────────

const reportFormSchema = z.object({
  studentId: z.string().min(1, "Please select a student"),
  termRange: z.enum(["term1", "term2", "term3", "all"]),
});

type ReportFormValues = z.infer<typeof reportFormSchema>;

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_STUDENTS: Student[] = [
  {
    id: "s1",
    name: "Aarav Sharma",
    rollNumber: "10A-01",
    class: "10",
    section: "A",
    avatarInitials: "AS",
    email: "aarav.sharma@school.edu",
    overallGrade: "A+",
    overallPercentage: 92,
  },
  {
    id: "s2",
    name: "Priya Patel",
    rollNumber: "10A-02",
    class: "10",
    section: "A",
    avatarInitials: "PP",
    email: "priya.patel@school.edu",
    overallGrade: "A",
    overallPercentage: 85,
  },
  {
    id: "s3",
    name: "Rohan Mehta",
    rollNumber: "10A-03",
    class: "10",
    section: "A",
    avatarInitials: "RM",
    email: "rohan.mehta@school.edu",
    overallGrade: "B+",
    overallPercentage: 78,
  },
  {
    id: "s4",
    name: "Sneha Iyer",
    rollNumber: "10A-04",
    class: "10",
    section: "A",
    avatarInitials: "SI",
    email: "sneha.iyer@school.edu",
    overallGrade: "B",
    overallPercentage: 72,
  },
];

const MOCK_REPORT_DATA: Record<string, ReportData> = {
  s1: {
    student: MOCK_STUDENTS[0],
    subjects: [
      {
        subject: "Mathematics",
        term1: 95,
        term2: 92,
        term3: 94,
        average: 93.7,
        grade: "A+",
        assignments: 15,
        teacher: "Mrs. Sharma",
      },
      {
        subject: "Science",
        term1: 88,
        term2: 90,
        term3: 92,
        average: 90,
        grade: "A+",
        assignments: 12,
        teacher: "Mr. Kumar",
      },
      {
        subject: "English",
        term1: 90,
        term2: 88,
        term3: 91,
        average: 89.7,
        grade: "A",
        assignments: 10,
        teacher: "Ms. Johnson",
      },
      {
        subject: "Social Studies",
        term1: 92,
        term2: 93,
        term3: 95,
        average: 93.3,
        grade: "A+",
        assignments: 8,
        teacher: "Mr. Gupta",
      },
      {
        subject: "Hindi",
        term1: 85,
        term2: 87,
        term3: 88,
        average: 86.7,
        grade: "A",
        assignments: 8,
        teacher: "Mrs. Verma",
      },
      {
        subject: "Computer Science",
        term1: 96,
        term2: 98,
        term3: 97,
        average: 97,
        grade: "A+",
        assignments: 14,
        teacher: "Mr. Singh",
      },
    ],
    termProgress: [
      { term: "Term 1", percentage: 91, grade: "A+", rank: 2 },
      { term: "Term 2", percentage: 91.3, grade: "A+", rank: 1 },
      { term: "Term 3", percentage: 92.8, grade: "A+", rank: 1 },
    ],
    attendance: {
      present: 178,
      absent: 2,
      total: 180,
      percentage: 98.9,
    },
    remarks:
      "Aarav has shown exceptional academic performance throughout the year. His dedication, analytical thinking, and problem-solving skills are commendable. He actively participates in class discussions and helps his peers.",
    strengths: [
      "Outstanding mathematical and analytical abilities",
      "Excellent leadership and communication skills",
      "Consistent high performance across all subjects",
      "Active participation in class activities",
    ],
    improvements: [
      "Time management during examinations",
      "Could explore more creative writing opportunities",
    ],
    achievements: [
      "1st Rank in Mathematics Olympiad (District Level)",
      "Best Student Award - Term 2",
      "Captain of School Quiz Team",
    ],
  },
  s2: {
    student: MOCK_STUDENTS[1],
    subjects: [
      {
        subject: "Mathematics",
        term1: 82,
        term2: 85,
        term3: 87,
        average: 84.7,
        grade: "A",
        assignments: 15,
        teacher: "Mrs. Sharma",
      },
      {
        subject: "Science",
        term1: 80,
        term2: 83,
        term3: 85,
        average: 82.7,
        grade: "A",
        assignments: 12,
        teacher: "Mr. Kumar",
      },
      {
        subject: "English",
        term1: 88,
        term2: 90,
        term3: 89,
        average: 89,
        grade: "A",
        assignments: 10,
        teacher: "Ms. Johnson",
      },
      {
        subject: "Social Studies",
        term1: 85,
        term2: 84,
        term3: 86,
        average: 85,
        grade: "A",
        assignments: 8,
        teacher: "Mr. Gupta",
      },
      {
        subject: "Hindi",
        term1: 90,
        term2: 92,
        term3: 91,
        average: 91,
        grade: "A+",
        assignments: 8,
        teacher: "Mrs. Verma",
      },
      {
        subject: "Computer Science",
        term1: 78,
        term2: 80,
        term3: 82,
        average: 80,
        grade: "B+",
        assignments: 14,
        teacher: "Mr. Singh",
      },
    ],
    termProgress: [
      { term: "Term 1", percentage: 83.8, grade: "A", rank: 5 },
      { term: "Term 2", percentage: 85.7, grade: "A", rank: 4 },
      { term: "Term 3", percentage: 86.7, grade: "A", rank: 3 },
    ],
    attendance: {
      present: 175,
      absent: 5,
      total: 180,
      percentage: 97.2,
    },
    remarks:
      "Priya has demonstrated consistent improvement throughout the academic year. Her language skills are exceptional, and she shows dedication to her studies.",
    strengths: [
      "Excellent language and communication abilities",
      "Steady improvement in all subjects",
      "Good organizational skills",
      "Cooperative team player",
    ],
    improvements: [
      "Build confidence in mathematics problem-solving",
      "More active participation in science practicals",
    ],
    achievements: [
      "2nd Place in Inter-school Debate Competition",
      "Member of School Literary Club",
    ],
  },
};

// ─── Helper Functions ─────────────────────────────────────────────────────────

function getGradeColor(grade: string) {
  if (grade === "A+" || grade === "A")
    return "text-emerald-600 dark:text-emerald-400";
  if (grade === "B+" || grade === "B")
    return "text-blue-600 dark:text-blue-400";
  if (grade === "C+" || grade === "C")
    return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function getPerformanceLevel(percentage: number) {
  if (percentage >= 90)
    return {
      label: "Outstanding",
      color:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
    };
  if (percentage >= 80)
    return {
      label: "Excellent",
      color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
    };
  if (percentage >= 70)
    return {
      label: "Good",
      color:
        "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
    };
  if (percentage >= 60)
    return {
      label: "Satisfactory",
      color:
        "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
    };
  return {
    label: "Needs Improvement",
    color: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StudentCard({
  student,
  onSelect,
}: {
  student: Student;
  onSelect: () => void;
}) {
  const perfLevel = getPerformanceLevel(student.overallPercentage);

  return (
    <Card
      className="group hover:shadow-md py-2 hover:border-primary/40 transition-all duration-150 cursor-pointer"
      onClick={onSelect}
      data-testid={`student-card-${student.id}`}
    >
      <CardContent className="flex items-center gap-3 p-4">
        <div className="flex justify-center items-center bg-primary/10 rounded-full w-12 h-12 font-semibold text-primary text-sm shrink-0">
          {student.avatarInitials}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{student.name}</p>
          <p className="text-muted-foreground text-xs">
            {student.rollNumber} · Class {student.class}-{student.section}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={cn("text-[10px]", perfLevel.color)}>
              {perfLevel.label}
            </Badge>
            <span
              className={cn(
                "font-semibold text-xs",
                getGradeColor(student.overallGrade),
              )}
            >
              {student.overallGrade} · {student.overallPercentage}%
            </span>
          </div>
        </div>

        <ChevronRight className="w-4 h-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 shrink-0" />
      </CardContent>
    </Card>
  );
}

function ReportPreview({ reportData }: { reportData: ReportData }) {
  const {
    student,
    subjects,
    termProgress,
    attendance,
    remarks,
    strengths,
    improvements,
    achievements,
  } = reportData;
  const perfLevel = getPerformanceLevel(student.overallPercentage);

  // Prepare chart data
  const termChartData = termProgress.map((tp) => ({
    term: tp.term,
    percentage: tp.percentage,
    rank: tp.rank,
  }));

  const subjectChartData = subjects.map((s) => ({
    subject:
      s.subject.length > 10 ? s.subject.substring(0, 10) + "..." : s.subject,
    fullSubject: s.subject,
    average: s.average,
  }));

  const radarData = subjects.map((s) => ({
    subject: s.subject.split(" ")[0],
    score: s.average,
  }));

  return (
    <div
      className="space-y-6 bg-white dark:bg-background print:shadow-none mx-auto p-8 max-w-4xl"
      id="report-preview"
    >
      {/* Header */}
      <div className="pb-6 border-primary/20 border-b text-center">
        <h1 className="font-bold text-primary text-3xl tracking-tight">
          Student Progress Report
        </h1>
        <p className="mt-2 text-muted-foreground text-sm">
          Academic Year 2024-2025
        </p>
        <p className="text-muted-foreground text-xs">
          Generated on {format(new Date(), "PPP")}
        </p>
      </div>

      {/* Student Info */}
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="flex items-start gap-4">
            <div className="flex justify-center items-center bg-primary/10 rounded-full w-20 h-20 font-bold text-primary text-2xl shrink-0">
              {student.avatarInitials}
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-2xl">{student.name}</h2>
              <div className="gap-4 grid grid-cols-2 mt-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Roll Number:</span>{" "}
                  <span className="font-medium">{student.rollNumber}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Class:</span>{" "}
                  <span className="font-medium">
                    {student.class}-{student.section}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Overall Grade:</span>{" "}
                  <span
                    className={cn(
                      "font-bold",
                      getGradeColor(student.overallGrade),
                    )}
                  >
                    {student.overallGrade}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Percentage:</span>{" "}
                  <span className="font-bold">
                    {student.overallPercentage}%
                  </span>
                </div>
              </div>
              <Badge className={cn("mt-3", perfLevel.color)}>
                {perfLevel.label}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Term-wise Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5 text-primary" />
            Term-wise Academic Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={termChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="term" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="percentage"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Percentage"
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="gap-3 grid grid-cols-3 mt-4">
            {termProgress.map((tp) => (
              <div
                key={tp.term}
                className="bg-muted/40 p-3 rounded-lg text-center"
              >
                <p className="font-medium text-xs">{tp.term}</p>
                <p className="mt-1 font-bold text-xl">{tp.percentage}%</p>
                <p className="text-muted-foreground text-xs">Rank: {tp.rank}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Subject-wise Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="w-5 h-5 text-primary" />
            Subject-wise Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Bar Chart */}
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis domain={[0, 100]} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background shadow-md p-2 border rounded-lg">
                        <p className="font-medium text-xs">
                          {payload[0].payload.fullSubject}
                        </p>
                        <p className="text-primary text-xs">
                          Average: {payload[0].value}%
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Bar dataKey="average" fill="#10b981" name="Average Score" />
            </BarChart>
          </ResponsiveContainer>

          {/* Detailed Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead className="text-center">Term 1</TableHead>
                <TableHead className="text-center">Term 2</TableHead>
                <TableHead className="text-center">Term 3</TableHead>
                <TableHead className="text-center">Average</TableHead>
                <TableHead className="text-center">Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((subject) => (
                <TableRow key={subject.subject}>
                  <TableCell className="font-medium">
                    {subject.subject}
                  </TableCell>
                  <TableCell className="text-center">
                    {subject.term1}%
                  </TableCell>
                  <TableCell className="text-center">
                    {subject.term2}%
                  </TableCell>
                  <TableCell className="text-center">
                    {subject.term3}%
                  </TableCell>
                  <TableCell className="font-semibold text-center">
                    {subject.average.toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={cn("font-bold", getGradeColor(subject.grade))}
                    >
                      {subject.grade}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Performance Radar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="w-5 h-5 text-primary" />
            Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis domain={[0, 100]} />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Attendance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckCircle className="w-5 h-5 text-primary" />
            Attendance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="gap-4 grid grid-cols-2 sm:grid-cols-4">
            <div className="bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-lg text-center">
              <p className="text-muted-foreground text-xs">Present</p>
              <p className="mt-1 font-bold text-emerald-600 text-2xl">
                {attendance.present}
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg text-center">
              <p className="text-muted-foreground text-xs">Absent</p>
              <p className="mt-1 font-bold text-red-600 text-2xl">
                {attendance.absent}
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg text-center">
              <p className="text-muted-foreground text-xs">Total Days</p>
              <p className="mt-1 font-bold text-blue-600 text-2xl">
                {attendance.total}
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg text-center">
              <p className="text-muted-foreground text-xs">Percentage</p>
              <p className="mt-1 font-bold text-purple-600 text-2xl">
                {attendance.percentage}%
              </p>
            </div>
          </div>
          <Progress value={attendance.percentage} className="mt-4 h-3" />
        </CardContent>
      </Card>

      {/* Strengths & Improvements */}
      <div className="gap-4 grid sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Star className="w-4 h-4 text-emerald-500" />
              Key Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {strengths.map((strength, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="mt-0.5 w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="w-4 h-4 text-amber-500" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {improvements.map((improvement, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <AlertCircle className="mt-0.5 w-4 h-4 text-amber-500 shrink-0" />
                  <span>{improvement}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="w-5 h-5 text-primary" />
              Achievements & Recognition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {achievements.map((achievement, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <Award className="mt-0.5 w-4 h-4 text-amber-500 shrink-0" />
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Teacher Remarks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="w-5 h-5 text-primary" />
            Teacher&apos;s Remarks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {remarks}
          </p>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="pt-6 border-t text-center">
        <p className="text-muted-foreground text-xs">
          This is a computer-generated report · {student.name} ·{" "}
          {student.rollNumber}
        </p>
        <p className="mt-1 text-muted-foreground text-xs">
          © 2025 School ERP System · All rights reserved
        </p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProgressReportsPage() {
  const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(
    null,
  );
  const [reportData, setReportData] = React.useState<ReportData | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      studentId: "",
      termRange: "all",
    },
  });

  function handleStudentSelect(student: Student) {
    setSelectedStudent(student);
    form.setValue("studentId", student.id);
  }

  function handleBack() {
    setSelectedStudent(null);
    setReportData(null);
    form.reset();
  }

  async function onSubmit(values: ReportFormValues) {
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 1500));

    const data = MOCK_REPORT_DATA[values.studentId];
    if (data) {
      setReportData(data);
      toast.success("Report generated successfully", {
        description: `Progress report for ${data.student.name}`,
      });
    }
    setIsGenerating(false);
  }

  function handleDownload() {
    toast.success("Download started", {
      description: "Progress report PDF is being prepared",
    });
    // Implement actual PDF download logic here
  }

  function handlePrint() {
    window.print();
  }

  // ── Report Preview View ──────────────────────────────────────────────────────
  if (reportData) {
    return (
      <div className="space-y-6 mx-auto p-6 max-w-5xl">
        <div className="print:hidden flex flex-wrap justify-between items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            data-testid="back-btn"
          >
            <ArrowLeft className="mr-1 w-4 h-4" />
            Back
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              data-testid="print-btn"
            >
              <Printer className="mr-1.5 w-4 h-4" />
              Print
            </Button>
            <Button
              size="sm"
              onClick={handleDownload}
              data-testid="download-btn"
            >
              <Download className="mr-1.5 w-4 h-4" />
              Download PDF
            </Button>
          </div>
        </div>

        <ReportPreview reportData={reportData} />
      </div>
    );
  }

  // ── Configuration View ───────────────────────────────────────────────────────
  if (selectedStudent) {
    return (
      <div className="space-y-6 mx-auto p-6 max-w-3xl">
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="mt-0.5 -ml-2"
            onClick={handleBack}
            data-testid="back-to-students-btn"
          >
            <ArrowLeft className="mr-1 w-4 h-4" />
            Back to Students
          </Button>
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="font-semibold text-2xl tracking-tight">
            Generate Progress Report
          </h1>
          <p className="text-muted-foreground text-sm">
            Configure and generate comprehensive progress report
          </p>
        </div>

        {/* Selected Student Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Selected Student</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="flex justify-center items-center bg-primary/10 rounded-full w-12 h-12 font-semibold text-primary text-sm">
                {selectedStudent.avatarInitials}
              </div>
              <div>
                <p className="font-semibold">{selectedStudent.name}</p>
                <p className="text-muted-foreground text-sm">
                  {selectedStudent.rollNumber} · Class {selectedStudent.class}-
                  {selectedStudent.section}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuration Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  Report Configuration
                </CardTitle>
                <CardDescription>
                  Select the term range for the progress report
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="termRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Term Range</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="term-range-selector">
                            <SelectValue placeholder="Select term range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">
                            All Terms (Full Year)
                          </SelectItem>
                          <SelectItem value="term1">Term 1 Only</SelectItem>
                          <SelectItem value="term2">Term 2 Only</SelectItem>
                          <SelectItem value="term3">Term 3 Only</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Report Contents Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Report Contents</CardTitle>
                <CardDescription>
                  The generated report will include:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {[
                    {
                      icon: <BookOpen className="w-4 h-4" />,
                      text: "Subject-wise grades and performance",
                    },
                    {
                      icon: <TrendingUp className="w-4 h-4" />,
                      text: "Term-wise progress comparison with charts",
                    },
                    {
                      icon: <CheckCircle className="w-4 h-4" />,
                      text: "Attendance summary and statistics",
                    },
                    {
                      icon: <Star className="w-4 h-4" />,
                      text: "Strengths and areas for improvement",
                    },
                    {
                      icon: <Award className="w-4 h-4" />,
                      text: "Achievements and recognition",
                    },
                    {
                      icon: <FileText className="w-4 h-4" />,
                      text: "Teacher remarks and feedback",
                    },
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <div className="text-primary">{item.icon}</div>
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="w-full"
              disabled={isGenerating}
              data-testid="generate-report-btn"
            >
              <Eye className="mr-2 w-4 h-4" />
              {isGenerating
                ? "Generating Report..."
                : "Generate Report Preview"}
            </Button>
          </form>
        </Form>
      </div>
    );
  }

  // ── Student List View ────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 mx-auto p-6 max-w-4xl">
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-2xl tracking-tight">
          Progress Reports
        </h1>
        <p className="text-muted-foreground text-sm">
          Generate comprehensive progress reports for individual students
        </p>
      </div>

      {/* Info Cards */}
      <div className="gap-4 grid grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex justify-center items-center bg-blue-100 dark:bg-blue-950 rounded-lg w-10 h-10 shrink-0">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Total Students</p>
                <p className="font-bold text-2xl">{MOCK_STUDENTS.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex justify-center items-center bg-emerald-100 dark:bg-emerald-950 rounded-lg w-10 h-10 shrink-0">
                <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Subjects</p>
                <p className="font-bold text-2xl">6</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex justify-center items-center bg-purple-100 dark:bg-purple-950 rounded-lg w-10 h-10 shrink-0">
                <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Terms</p>
                <p className="font-bold text-2xl">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Selection */}
      <div className="space-y-3">
        <h2 className="font-semibold text-lg">Select Student</h2>
        <div className="gap-3 grid">
          {MOCK_STUDENTS.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onSelect={() => handleStudentSelect(student)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
