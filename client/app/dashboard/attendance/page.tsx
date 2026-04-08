"use client";

import * as React from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { format } from "date-fns";
import {
  CalendarIcon,
  CheckCircle2,
  XCircle,
  Clock3,
  FileCheck2,
  Save,
  RotateCcw,
  ChevronDown,
  Users,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
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
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type AttendanceStatus = "present" | "absent" | "late" | "excused";

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  avatarInitials: string;
}

interface ClassSession {
  id: string;
  label: string;
  subject: string;
  grade: string;
  section: string;
  totalStudents: number;
}

// ─── Zod Schema ───────────────────────────────────────────────────────────────

const attendanceStatusEnum = z.enum(["present", "absent", "late", "excused"]);

const studentAttendanceSchema = z.object({
  studentId: z.string(),
  status: attendanceStatusEnum,
  remark: z.string().max(200).optional(),
});

const attendanceFormSchema = z.object({
  classId: z.string().min(1, "Please select a class"),
  date: z.date({ error: "Please select a date" }),
  records: z.array(studentAttendanceSchema),
});

type AttendanceFormValues = z.infer<typeof attendanceFormSchema>;

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_CLASSES: ClassSession[] = [
  {
    id: "cls-1",
    label: "Grade 10 – A · Mathematics",
    subject: "Mathematics",
    grade: "10",
    section: "A",
    totalStudents: 32,
  },
  {
    id: "cls-2",
    label: "Grade 10 – B · Mathematics",
    subject: "Mathematics",
    grade: "10",
    section: "B",
    totalStudents: 30,
  },
  {
    id: "cls-3",
    label: "Grade 9 – A · Science",
    subject: "Science",
    grade: "9",
    section: "A",
    totalStudents: 28,
  },
  {
    id: "cls-4",
    label: "Grade 11 – C · Physics",
    subject: "Physics",
    grade: "11",
    section: "C",
    totalStudents: 25,
  },
];

const MOCK_STUDENTS: Record<string, Student[]> = {
  "cls-1": [
    {
      id: "s1",
      rollNumber: "10A-01",
      name: "Aarav Sharma",
      avatarInitials: "AS",
    },
    {
      id: "s2",
      rollNumber: "10A-02",
      name: "Priya Patel",
      avatarInitials: "PP",
    },
    {
      id: "s3",
      rollNumber: "10A-03",
      name: "Rohan Mehta",
      avatarInitials: "RM",
    },
    {
      id: "s4",
      rollNumber: "10A-04",
      name: "Sneha Iyer",
      avatarInitials: "SI",
    },
    {
      id: "s5",
      rollNumber: "10A-05",
      name: "Vikram Nair",
      avatarInitials: "VN",
    },
    {
      id: "s6",
      rollNumber: "10A-06",
      name: "Ananya Reddy",
      avatarInitials: "AR",
    },
    {
      id: "s7",
      rollNumber: "10A-07",
      name: "Karan Gupta",
      avatarInitials: "KG",
    },
    {
      id: "s8",
      rollNumber: "10A-08",
      name: "Divya Krishnan",
      avatarInitials: "DK",
    },
  ],
  "cls-2": [
    {
      id: "s9",
      rollNumber: "10B-01",
      name: "Arjun Singh",
      avatarInitials: "AS",
    },
    {
      id: "s10",
      rollNumber: "10B-02",
      name: "Meera Joshi",
      avatarInitials: "MJ",
    },
    {
      id: "s11",
      rollNumber: "10B-03",
      name: "Nikhil Kumar",
      avatarInitials: "NK",
    },
    {
      id: "s12",
      rollNumber: "10B-04",
      name: "Pooja Verma",
      avatarInitials: "PV",
    },
    {
      id: "s13",
      rollNumber: "10B-05",
      name: "Rahul Das",
      avatarInitials: "RD",
    },
    {
      id: "s14",
      rollNumber: "10B-06",
      name: "Shreya Bose",
      avatarInitials: "SB",
    },
  ],
  "cls-3": [
    {
      id: "s15",
      rollNumber: "9A-01",
      name: "Aditya Rao",
      avatarInitials: "AR",
    },
    {
      id: "s16",
      rollNumber: "9A-02",
      name: "Bhavna Pillai",
      avatarInitials: "BP",
    },
    {
      id: "s17",
      rollNumber: "9A-03",
      name: "Chirag Malhotra",
      avatarInitials: "CM",
    },
    {
      id: "s18",
      rollNumber: "9A-04",
      name: "Deepika Nanda",
      avatarInitials: "DN",
    },
    {
      id: "s19",
      rollNumber: "9A-05",
      name: "Esha Tiwari",
      avatarInitials: "ET",
    },
  ],
  "cls-4": [
    {
      id: "s20",
      rollNumber: "11C-01",
      name: "Farhan Khan",
      avatarInitials: "FK",
    },
    {
      id: "s21",
      rollNumber: "11C-02",
      name: "Gauri Saxena",
      avatarInitials: "GS",
    },
    {
      id: "s22",
      rollNumber: "11C-03",
      name: "Hardik Shah",
      avatarInitials: "HS",
    },
    {
      id: "s23",
      rollNumber: "11C-04",
      name: "Isha Jain",
      avatarInitials: "IJ",
    },
    {
      id: "s24",
      rollNumber: "11C-05",
      name: "Jay Kapoor",
      avatarInitials: "JK",
    },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  AttendanceStatus,
  {
    label: string;
    icon: React.ReactNode;
    activeClass: string;
    badgeClass: string;
  }
> = {
  present: {
    label: "Present",
    icon: <CheckCircle2 className="w-4 h-4" />,
    activeClass:
      "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-700",
    badgeClass:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  },
  absent: {
    label: "Absent",
    icon: <XCircle className="w-4 h-4" />,
    activeClass:
      "bg-red-50 text-red-700 border-red-300 hover:bg-red-100 dark:bg-red-950 dark:text-red-400 dark:border-red-700",
    badgeClass: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  },
  late: {
    label: "Late",
    icon: <Clock3 className="w-4 h-4" />,
    activeClass:
      "bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-700",
    badgeClass:
      "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  },
  excused: {
    label: "Excused",
    icon: <FileCheck2 className="w-4 h-4" />,
    activeClass:
      "bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-700",
    badgeClass: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  },
};

function getDefaultRecords(students: Student[]) {
  return students.map((s) => ({
    studentId: s.id,
    status: "present" as AttendanceStatus,
    remark: "",
  }));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  label,
  count,
  total,
  status,
}: {
  label: string;
  count: number;
  total: number;
  status: AttendanceStatus;
}) {
  const cfg = STATUS_CONFIG[status];
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div className="flex items-center gap-3 bg-card p-3 border rounded-lg">
      <div className={cn("p-2 border rounded-md", cfg.activeClass)}>
        {cfg.icon}
      </div>
      <div className="min-w-0">
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className="font-semibold text-xl leading-tight">
          {count}
          <span className="ml-1 font-normal text-muted-foreground text-xs">
            ({pct}%)
          </span>
        </p>
      </div>
    </div>
  );
}

function StatusToggle({
  value,
  onChange,
}: {
  value: AttendanceStatus;
  onChange: (v: AttendanceStatus) => void;
}) {
  const statuses: AttendanceStatus[] = ["present", "absent", "late", "excused"];
  return (
    <div className="flex flex-wrap gap-1">
      {statuses.map((s) => {
        const cfg = STATUS_CONFIG[s];
        const isActive = value === s;
        return (
          <TooltipProvider key={s} delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => onChange(s)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 border rounded-md font-medium text-xs transition-all duration-150",
                    isActive
                      ? cfg.activeClass
                      : "border-border bg-background text-muted-foreground hover:bg-muted",
                  )}
                >
                  {cfg.icon}
                  <span className="hidden sm:inline">{cfg.label}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent className="sm:hidden">{cfg.label}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function AttendancePage() {
  const [students, setStudents] = React.useState<Student[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);

  const form = useForm<AttendanceFormValues>({
    resolver: zodResolver(attendanceFormSchema),
    defaultValues: {
      classId: "",
      date: new Date(),
      records: [],
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "records",
  });

  const watchClassId = form.watch("classId");
  const watchRecords = form.watch("records");

  // Load students when class changes
  React.useEffect(() => {
    if (!watchClassId) {
      setStudents([]);
      form.setValue("records", []);
      return;
    }
    const loaded = MOCK_STUDENTS[watchClassId] ?? [];
    setStudents(loaded);
    form.setValue("records", getDefaultRecords(loaded));
  }, [watchClassId]);

  // Derived stats
  const stats = React.useMemo(() => {
    const counts: Record<AttendanceStatus, number> = {
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
    };
    watchRecords.forEach((r) => {
      if (r.status in counts) counts[r.status as AttendanceStatus]++;
    });
    return counts;
  }, [watchRecords]);

  // Mark all
  function markAll(status: AttendanceStatus) {
    const current = form.getValues("records");
    current.forEach((_, idx) => form.setValue(`records.${idx}.status`, status));
  }

  async function onSubmit(values: AttendanceFormValues) {
    setIsSaving(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    console.log("Attendance submitted:", values);
    setIsSaving(false);
    toast.success("Attendance saved successfully", {
      description: `${values.records.length} students · ${format(values.date, "PPP")}`,
    });
  }

  const selectedClass = MOCK_CLASSES.find((c) => c.id === watchClassId);
  const total = fields.length;

  return (
    <div className="space-y-6 mx-auto p-6 max-w-5xl font-sans">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-2xl tracking-tight">Attendance</h1>
        <p className="text-muted-foreground text-sm">
          Mark and manage daily attendance for your classes.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Filters row */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Session Details</CardTitle>
              <CardDescription>
                Select a class and date to begin marking attendance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex sm:flex-row flex-col gap-4">
                {/* Class selector */}
                <FormField
                  control={form.control}
                  name="classId"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a class…" />
                          </SelectTrigger>
                          <SelectContent>
                            {MOCK_CLASSES.map((cls) => (
                              <SelectItem key={cls.id} value={cls.id}>
                                {cls.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Date picker */}
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "justify-start w-full sm:w-[200px] font-normal text-left",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 w-4 h-4 shrink-0" />
                              {field.value
                                ? format(field.value, "dd MMM yyyy")
                                : "Pick a date"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-auto" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Stats + bulk actions — only when class is selected */}
          {selectedClass && total > 0 && (
            <>
              {/* Summary stats */}
              <div className="gap-3 grid grid-cols-2 sm:grid-cols-4">
                <StatCard
                  label="Present"
                  count={stats.present}
                  total={total}
                  status="present"
                />
                <StatCard
                  label="Absent"
                  count={stats.absent}
                  total={total}
                  status="absent"
                />
                <StatCard
                  label="Late"
                  count={stats.late}
                  total={total}
                  status="late"
                />
                <StatCard
                  label="Excused"
                  count={stats.excused}
                  total={total}
                  status="excused"
                />
              </div>

              {/* Attendance table */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <CardTitle className="text-base">
                        Student Roster
                      </CardTitle>
                      <Badge variant="secondary" className="ml-1">
                        {total} students
                      </Badge>
                    </div>

                    {/* Bulk mark */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-muted-foreground text-xs">
                        Mark all:
                      </span>
                      {(
                        [
                          "present",
                          "absent",
                          "late",
                          "excused",
                        ] as AttendanceStatus[]
                      ).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => markAll(s)}
                          className={cn(
                            "inline-flex items-center gap-1 px-2 py-0.5 border rounded-md font-medium text-xs transition-all",
                            STATUS_CONFIG[s].activeClass,
                          )}
                        >
                          {STATUS_CONFIG[s].icon}
                          {STATUS_CONFIG[s].label}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardHeader>

                <Separator />

                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="pl-6 w-[60px]">Roll</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden md:table-cell w-[200px]">
                          Remark
                          <span className="ml-1 font-normal text-muted-foreground">
                            (optional)
                          </span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {fields.map((field, index) => {
                        const student = students[index];
                        if (!student) return null;
                        const currentStatus = watchRecords[index]
                          ?.status as AttendanceStatus;

                        return (
                          <TableRow
                            key={field.id}
                            className={cn(
                              "transition-colors",
                              currentStatus === "absent" &&
                                "bg-red-50/40 dark:bg-red-950/20",
                            )}
                          >
                            {/* Roll number */}
                            <TableCell className="pl-6 font-mono text-muted-foreground text-xs">
                              {student.rollNumber}
                            </TableCell>

                            {/* Student name + avatar */}
                            <TableCell>
                              <div className="flex items-center gap-2.5">
                                <div className="flex justify-center items-center bg-muted rounded-full w-8 h-8 font-semibold text-xs shrink-0">
                                  {student.avatarInitials}
                                </div>
                                <span className="font-medium text-sm">
                                  {student.name}
                                </span>
                              </div>
                            </TableCell>

                            {/* Status toggle */}
                            <TableCell>
                              <Controller
                                control={form.control}
                                name={`records.${index}.status`}
                                render={({ field: f }) => (
                                  <StatusToggle
                                    value={f.value as AttendanceStatus}
                                    onChange={f.onChange}
                                  />
                                )}
                              />
                            </TableCell>

                            {/* Remark input */}
                            <TableCell className="hidden md:table-cell">
                              <Controller
                                control={form.control}
                                name={`records.${index}.remark`}
                                render={({ field: f }) => (
                                  <input
                                    {...f}
                                    placeholder="Add a note…"
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
            </>
          )}

          {/* Empty state */}
          {!watchClassId && (
            <div className="flex flex-col justify-center items-center bg-muted/30 py-16 border border-dashed rounded-lg text-center">
              <TrendingUp className="mb-3 w-10 h-10 text-muted-foreground/50" />
              <p className="font-medium text-muted-foreground text-sm">
                Select a class to start marking attendance
              </p>
            </div>
          )}

          {watchClassId && total === 0 && (
            <div className="flex flex-col justify-center items-center bg-muted/30 py-16 border border-dashed rounded-lg text-center">
              <AlertCircle className="mb-3 w-10 h-10 text-muted-foreground/50" />
              <p className="font-medium text-muted-foreground text-sm">
                No students found in this class
              </p>
            </div>
          )}

          {/* Footer actions */}
          {total > 0 && (
            <div className="bottom-4 sticky flex justify-between items-center gap-4 bg-card shadow-md px-4 py-3 border rounded-lg">
              <p className="text-muted-foreground text-xs">
                {stats.present} present · {stats.absent} absent · {stats.late}{" "}
                late · {stats.excused} excused
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    form.reset({
                      classId: watchClassId,
                      date: form.getValues("date"),
                      records: getDefaultRecords(students),
                    });
                  }}
                >
                  <RotateCcw className="mr-1.5 w-3.5 h-3.5" />
                  Reset
                </Button>
                <Button type="submit" size="sm" disabled={isSaving}>
                  <Save className="mr-1.5 w-3.5 h-3.5" />
                  {isSaving ? "Saving…" : "Save Attendance"}
                </Button>
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
