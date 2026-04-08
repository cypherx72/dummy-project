"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { format } from "date-fns";
import {
  Users,
  GraduationCap,
  MessageSquare,
  ArrowLeft,
  Save,
  Calendar,
  BookOpen,
  UserCheck,
  Trophy,
  FileText,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Award,
  Target,
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ClassInfo {
  id: string;
  name: string;
  grade: string;
  subject: string;
  studentCount: number;
  remarksCompleted: number;
  term: string;
}

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  avatarInitials: string;
  email: string;
  hasRemarks: boolean;
  lastUpdated: string | null;
  overallPerformance: "excellent" | "good" | "average" | "needs_improvement";
}

interface StudentRemark {
  studentId: string;
  term: string;
  academic: string;
  behavior: string;
  attendance: string;
  extracurricular: string;
  general: string;
  strengths: string;
  areasForImprovement: string;
  teacherName: string;
  lastUpdated: string;
}

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

const remarkFormSchema = z.object({
  studentId: z.string(),
  term: z.string().min(1, "Please select a term"),
  academic: z
    .string()
    .max(500, "Maximum 500 characters")
    .optional()
    .default(""),
  behavior: z
    .string()
    .max(500, "Maximum 500 characters")
    .optional()
    .default(""),
  attendance: z
    .string()
    .max(300, "Maximum 300 characters")
    .optional()
    .default(""),
  extracurricular: z
    .string()
    .max(300, "Maximum 300 characters")
    .optional()
    .default(""),
  general: z.string().max(800, "Maximum 800 characters").optional().default(""),
  strengths: z
    .string()
    .max(400, "Maximum 400 characters")
    .optional()
    .default(""),
  areasForImprovement: z
    .string()
    .max(400, "Maximum 400 characters")
    .optional()
    .default(""),
});

type RemarkFormValues = z.infer<typeof remarkFormSchema>;

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_CLASSES: ClassInfo[] = [
  {
    id: "c1",
    name: "Grade 10 – A",
    grade: "10",
    subject: "Mathematics",
    studentCount: 32,
    remarksCompleted: 28,
    term: "Term 2 (2025)",
  },
  {
    id: "c2",
    name: "Grade 10 – B",
    grade: "10",
    subject: "Mathematics",
    studentCount: 30,
    remarksCompleted: 15,
    term: "Term 2 (2025)",
  },
  {
    id: "c3",
    name: "Grade 9 – A",
    grade: "9",
    subject: "Science",
    studentCount: 28,
    remarksCompleted: 28,
    term: "Term 2 (2025)",
  },
  {
    id: "c4",
    name: "Grade 11 – C",
    grade: "11",
    subject: "Physics",
    studentCount: 25,
    remarksCompleted: 10,
    term: "Term 2 (2025)",
  },
];

const MOCK_STUDENTS: Record<string, Student[]> = {
  c1: [
    {
      id: "s1",
      name: "Aarav Sharma",
      rollNumber: "10A-01",
      avatarInitials: "AS",
      email: "aarav.sharma@school.edu",
      hasRemarks: true,
      lastUpdated: "2025-01-15",
      overallPerformance: "excellent",
    },
    {
      id: "s2",
      name: "Priya Patel",
      rollNumber: "10A-02",
      avatarInitials: "PP",
      email: "priya.patel@school.edu",
      hasRemarks: true,
      lastUpdated: "2025-01-14",
      overallPerformance: "good",
    },
    {
      id: "s3",
      name: "Rohan Mehta",
      rollNumber: "10A-03",
      avatarInitials: "RM",
      email: "rohan.mehta@school.edu",
      hasRemarks: false,
      lastUpdated: null,
      overallPerformance: "good",
    },
    {
      id: "s4",
      name: "Sneha Iyer",
      rollNumber: "10A-04",
      avatarInitials: "SI",
      email: "sneha.iyer@school.edu",
      hasRemarks: true,
      lastUpdated: "2025-01-13",
      overallPerformance: "average",
    },
    {
      id: "s5",
      name: "Vikram Nair",
      rollNumber: "10A-05",
      avatarInitials: "VN",
      email: "vikram.nair@school.edu",
      hasRemarks: false,
      lastUpdated: null,
      overallPerformance: "needs_improvement",
    },
    {
      id: "s6",
      name: "Ananya Reddy",
      rollNumber: "10A-06",
      avatarInitials: "AR",
      email: "ananya.reddy@school.edu",
      hasRemarks: true,
      lastUpdated: "2025-01-15",
      overallPerformance: "excellent",
    },
  ],
};

const MOCK_REMARKS: Record<string, StudentRemark> = {
  s1: {
    studentId: "s1",
    term: "term2_2025",
    academic:
      "Aarav consistently demonstrates exceptional understanding of mathematical concepts. His problem-solving skills are outstanding, particularly in algebra and geometry. He actively participates in class discussions and helps peers.",
    behavior:
      "Exemplary behavior in class. Shows leadership qualities and maintains a positive attitude. Respectful to teachers and peers.",
    attendance:
      "Perfect attendance record. Punctual and well-prepared for all classes.",
    extracurricular:
      "Active member of the Math Club. Participated in inter-school mathematics olympiad and secured 2nd position.",
    general:
      "Aarav is a role model student who balances academics and extracurricular activities exceptionally well.",
    strengths:
      "Strong analytical thinking, excellent communication skills, natural leadership abilities.",
    areasForImprovement:
      "Could work on time management during exams to avoid rushing through questions.",
    teacherName: "Mrs. Sharma",
    lastUpdated: "2025-01-15T10:30:00Z",
  },
  s2: {
    studentId: "s2",
    term: "term2_2025",
    academic:
      "Priya shows good grasp of fundamental concepts. Her work is consistent and she shows steady improvement in problem-solving.",
    behavior: "Well-behaved and cooperative. Works well in group activities.",
    attendance: "Good attendance with only 2 absences this term.",
    extracurricular: "Member of the school debate team.",
    general: "Priya is a dedicated student with good potential.",
    strengths: "Consistent effort, good organizational skills.",
    areasForImprovement:
      "Could benefit from more confidence when answering questions in class.",
    teacherName: "Mrs. Sharma",
    lastUpdated: "2025-01-14T14:20:00Z",
  },
};

const TERMS = [
  { id: "term1_2025", label: "Term 1 (2025)" },
  { id: "term2_2025", label: "Term 2 (2025)" },
  { id: "term3_2025", label: "Term 3 (2025)" },
];

const PERFORMANCE_CONFIG = {
  excellent: {
    label: "Excellent",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
    icon: <Award className="w-3 h-3" />,
  },
  good: {
    label: "Good",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
    icon: <TrendingUp className="w-3 h-3" />,
  },
  average: {
    label: "Average",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
    icon: <Target className="w-3 h-3" />,
  },
  needs_improvement: {
    label: "Needs Improvement",
    color: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400",
    icon: <AlertCircle className="w-3 h-3" />,
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function ClassCard({
  classInfo,
  onSelect,
}: {
  classInfo: ClassInfo;
  onSelect: () => void;
}) {
  const completionPct = Math.round(
    (classInfo.remarksCompleted / classInfo.studentCount) * 100,
  );

  return (
    <Card
      className="group hover:shadow-md hover:border-primary/40 transition-all duration-150 cursor-pointer"
      onClick={onSelect}
      data-testid={`class-card-${classInfo.id}`}
    >
      <CardContent className="space-y-3 p-4">
        <div className="flex justify-between items-start gap-2">
          <div className="flex items-center gap-2">
            <div className="flex justify-center items-center bg-primary/10 rounded-lg w-10 h-10 shrink-0">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm">{classInfo.name}</p>
              <p className="text-muted-foreground text-xs">
                {classInfo.subject}
              </p>
            </div>
          </div>
          <ChevronRight className="mt-1 w-4 h-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 shrink-0" />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Remarks Progress</span>
            <span className="font-medium">
              {classInfo.remarksCompleted}/{classInfo.studentCount}
            </span>
          </div>
          <Progress value={completionPct} className="h-1.5" />
        </div>

        <div className="flex items-center gap-4 text-muted-foreground text-xs">
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{classInfo.studentCount} students</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{classInfo.term}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StudentCard({
  student,
  onSelect,
}: {
  student: Student;
  onSelect: () => void;
}) {
  const perfConfig = PERFORMANCE_CONFIG[student.overallPerformance];

  return (
    <Card
      className="group hover:shadow-md hover:border-primary/40 transition-all duration-150 cursor-pointer"
      onClick={onSelect}
      data-testid={`student-card-${student.id}`}
    >
      <CardContent className="flex items-center gap-3 p-4">
        <div
          className={cn(
            "flex justify-center items-center rounded-full w-12 h-12 font-semibold text-sm shrink-0",
            student.hasRemarks
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground",
          )}
        >
          {student.avatarInitials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm truncate">{student.name}</p>
            {student.hasRemarks && (
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            )}
          </div>
          <p className="text-muted-foreground text-xs">{student.rollNumber}</p>
          {student.lastUpdated && (
            <p className="flex items-center gap-1 mt-0.5 text-[11px] text-muted-foreground">
              <Clock className="w-3 h-3" />
              Updated {format(new Date(student.lastUpdated), "dd MMM yyyy")}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <Badge className={cn("text-[10px]", perfConfig.color)}>
            {perfConfig.icon}
            <span className="ml-1">{perfConfig.label}</span>
          </Badge>
          <ChevronRight className="w-4 h-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function RemarksPage() {
  const [selectedClass, setSelectedClass] = React.useState<ClassInfo | null>(
    null,
  );
  const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(
    null,
  );
  const [isSaving, setIsSaving] = React.useState(false);

  const form = useForm<RemarkFormValues>({
    resolver: zodResolver(remarkFormSchema),
    defaultValues: {
      studentId: "",
      term: "term2_2025",
      academic: "",
      behavior: "",
      attendance: "",
      extracurricular: "",
      general: "",
      strengths: "",
      areasForImprovement: "",
    },
  });

  function openClass(classInfo: ClassInfo) {
    setSelectedClass(classInfo);
    setSelectedStudent(null);
  }

  function openStudent(student: Student) {
    setSelectedStudent(student);
    const existingRemark = MOCK_REMARKS[student.id];
    if (existingRemark) {
      form.reset({
        studentId: student.id,
        term: existingRemark.term,
        academic: existingRemark.academic,
        behavior: existingRemark.behavior,
        attendance: existingRemark.attendance,
        extracurricular: existingRemark.extracurricular,
        general: existingRemark.general,
        strengths: existingRemark.strengths,
        areasForImprovement: existingRemark.areasForImprovement,
      });
    } else {
      form.reset({
        studentId: student.id,
        term: "term2_2025",
        academic: "",
        behavior: "",
        attendance: "",
        extracurricular: "",
        general: "",
        strengths: "",
        areasForImprovement: "",
      });
    }
  }

  function backToClasses() {
    setSelectedClass(null);
    setSelectedStudent(null);
  }

  function backToStudents() {
    setSelectedStudent(null);
  }

  async function onSubmit(values: RemarkFormValues) {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    console.log("Remarks submitted:", values);
    setIsSaving(false);
    toast.success("Remarks saved successfully", {
      description: `Feedback saved for ${selectedStudent?.name}`,
    });
  }

  const students = selectedClass ? MOCK_STUDENTS[selectedClass.id] || [] : [];

  // ── Student Remark Form ──────────────────────────────────────────────────────
  if (selectedStudent && selectedClass) {
    const perfConfig = PERFORMANCE_CONFIG[selectedStudent.overallPerformance];

    return (
      <div className="space-y-6 mx-auto p-6 max-w-4xl">
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="mt-0.5 -ml-2"
            onClick={backToStudents}
            data-testid="back-to-students-btn"
          >
            <ArrowLeft className="mr-1 w-4 h-4" />
            Back to Students
          </Button>
        </div>

        {/* Student Header */}
        <div className="flex items-start gap-4">
          <div className="flex justify-center items-center bg-primary/10 rounded-full w-16 h-16 font-bold text-primary text-xl shrink-0">
            {selectedStudent.avatarInitials}
          </div>
          <div className="flex-1">
            <h1 className="font-semibold text-2xl tracking-tight">
              {selectedStudent.name}
            </h1>
            <p className="text-muted-foreground text-sm">
              {selectedStudent.rollNumber} · {selectedClass.name} ·{" "}
              {selectedClass.subject}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={cn("text-xs", perfConfig.color)}>
                {perfConfig.icon}
                <span className="ml-1">{perfConfig.label}</span>
              </Badge>
              {selectedStudent.hasRemarks && (
                <Badge variant="outline" className="text-xs">
                  <CheckCircle className="mr-1 w-3 h-3" />
                  Remarks Added
                </Badge>
              )}
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Term Selector */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  Academic Term
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="term"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            className="w-full sm:w-[300px]"
                            data-testid="term-selector"
                          >
                            <SelectValue placeholder="Select term" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TERMS.map((term) => (
                            <SelectItem key={term.id} value={term.id}>
                              {term.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Remarks Tabs */}
            <Tabs defaultValue="academic" className="w-full">
              <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full">
                <TabsTrigger value="academic" className="text-xs">
                  <BookOpen className="mr-1 w-3.5 h-3.5" />
                  Academic
                </TabsTrigger>
                <TabsTrigger value="behavior" className="text-xs">
                  <UserCheck className="mr-1 w-3.5 h-3.5" />
                  Behavior
                </TabsTrigger>
                <TabsTrigger value="attendance" className="text-xs">
                  <Calendar className="mr-1 w-3.5 h-3.5" />
                  Attendance
                </TabsTrigger>
                <TabsTrigger value="extra" className="text-xs">
                  <Trophy className="mr-1 w-3.5 h-3.5" />
                  Extra
                </TabsTrigger>
              </TabsList>

              <TabsContent value="academic" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      Academic Performance
                    </CardTitle>
                    <CardDescription>
                      Comment on the student's understanding of concepts,
                      problem-solving abilities, and class participation.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="academic"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="E.g., Shows excellent understanding of algebraic concepts. Active participation in class discussions..."
                              className="min-h-[120px] resize-none"
                              data-testid="academic-textarea"
                            />
                          </FormControl>
                          <FormDescription>
                            {field.value?.length || 0}/500 characters
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="behavior" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      Behavior & Conduct
                    </CardTitle>
                    <CardDescription>
                      Note the student's behavior, attitude, and interaction
                      with peers and teachers.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="behavior"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="E.g., Respectful and well-behaved. Shows leadership qualities in group activities..."
                              className="min-h-[120px] resize-none"
                              data-testid="behavior-textarea"
                            />
                          </FormControl>
                          <FormDescription>
                            {field.value?.length || 0}/500 characters
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="attendance" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      Attendance & Punctuality
                    </CardTitle>
                    <CardDescription>
                      Record attendance patterns, punctuality, and any concerns.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="attendance"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="E.g., Perfect attendance this term. Always punctual and prepared for class..."
                              className="min-h-[120px] resize-none"
                              data-testid="attendance-textarea"
                            />
                          </FormControl>
                          <FormDescription>
                            {field.value?.length || 0}/300 characters
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="extra" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      Extra-curricular Activities
                    </CardTitle>
                    <CardDescription>
                      Note participation in clubs, sports, competitions, or
                      special activities.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="extracurricular"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="E.g., Active member of the Math Club. Participated in inter-school olympiad..."
                              className="min-h-[120px] resize-none"
                              data-testid="extracurricular-textarea"
                            />
                          </FormControl>
                          <FormDescription>
                            {field.value?.length || 0}/300 characters
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Strengths & Areas for Improvement */}
            <div className="gap-4 grid sm:grid-cols-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Award className="w-4 h-4 text-emerald-500" />
                    Key Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="strengths"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="E.g., Strong analytical thinking, excellent communication..."
                            className="min-h-[100px] resize-none"
                            data-testid="strengths-textarea"
                          />
                        </FormControl>
                        <FormDescription>
                          {field.value?.length || 0}/400 characters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Target className="w-4 h-4 text-amber-500" />
                    Areas for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="areasForImprovement"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="E.g., Could work on time management during exams..."
                            className="min-h-[100px] resize-none"
                            data-testid="areas-improvement-textarea"
                          />
                        </FormControl>
                        <FormDescription>
                          {field.value?.length || 0}/400 characters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* General Notes */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  General Notes
                </CardTitle>
                <CardDescription>
                  Any additional observations or comments about the student.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="general"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Additional remarks or observations..."
                          className="min-h-[100px] resize-none"
                          data-testid="general-textarea"
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value?.length || 0}/800 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Sticky Footer */}
            <div className="bottom-4 sticky flex justify-between items-center gap-4 bg-card shadow-md px-4 py-3 border rounded-lg">
              <p className="text-muted-foreground text-xs">
                Last saved:{" "}
                {selectedStudent.lastUpdated
                  ? format(
                      new Date(selectedStudent.lastUpdated),
                      "dd MMM yyyy, HH:mm",
                    )
                  : "Never"}
              </p>
              <Button
                type="submit"
                size="sm"
                disabled={isSaving}
                data-testid="save-remarks-btn"
              >
                <Save className="mr-1.5 w-3.5 h-3.5" />
                {isSaving ? "Saving..." : "Save Remarks"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    );
  }

  // ── Student List View ────────────────────────────────────────────────────────
  if (selectedClass) {
    const completionPct = Math.round(
      (selectedClass.remarksCompleted / selectedClass.studentCount) * 100,
    );

    return (
      <div className="space-y-6 mx-auto p-6 max-w-4xl">
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="mt-0.5 -ml-2"
            onClick={backToClasses}
            data-testid="back-to-classes-btn"
          >
            <ArrowLeft className="mr-1 w-4 h-4" />
            Back to Classes
          </Button>
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="font-semibold text-2xl tracking-tight">
            {selectedClass.name}
          </h1>
          <p className="text-muted-foreground text-sm">
            {selectedClass.subject} · {selectedClass.term}
          </p>
        </div>

        {/* Progress Summary */}
        <Card>
          <CardContent className="space-y-3 p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium text-sm">Remarks Progress</span>
              </div>
              <span className="font-semibold text-sm">
                {selectedClass.remarksCompleted}/{selectedClass.studentCount}
              </span>
            </div>
            <Progress value={completionPct} className="h-2" />
            <p className="text-muted-foreground text-xs">
              {completionPct}% complete ·{" "}
              {selectedClass.studentCount - selectedClass.remarksCompleted}{" "}
              remaining
            </p>
          </CardContent>
        </Card>

        {/* Student List */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg">Students</h2>
            <Badge variant="secondary">
              {students.length} student{students.length !== 1 ? "s" : ""}
            </Badge>
          </div>

          <div className="gap-3 grid">
            {students.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onSelect={() => openStudent(student)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Class List View ──────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 mx-auto p-6 max-w-5xl">
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-2xl tracking-tight">
          Student Remarks & Feedback
        </h1>
        <p className="text-muted-foreground text-sm">
          Add detailed remarks and feedback for your students by class.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="gap-4 grid grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex justify-center items-center bg-blue-100 dark:bg-blue-950 rounded-lg w-10 h-10 shrink-0">
                <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Total Classes</p>
                <p className="font-bold text-2xl">{MOCK_CLASSES.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex justify-center items-center bg-emerald-100 dark:bg-emerald-950 rounded-lg w-10 h-10 shrink-0">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Completed</p>
                <p className="font-bold text-2xl">
                  {MOCK_CLASSES.reduce((acc, c) => acc + c.remarksCompleted, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex justify-center items-center bg-amber-100 dark:bg-amber-950 rounded-lg w-10 h-10 shrink-0">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Pending</p>
                <p className="font-bold text-2xl">
                  {MOCK_CLASSES.reduce(
                    (acc, c) => acc + (c.studentCount - c.remarksCompleted),
                    0,
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Classes Grid */}
      <div className="space-y-3">
        <h2 className="font-semibold text-lg">Your Classes</h2>
        <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_CLASSES.map((classInfo) => (
            <ClassCard
              key={classInfo.id}
              classInfo={classInfo}
              onSelect={() => openClass(classInfo)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
