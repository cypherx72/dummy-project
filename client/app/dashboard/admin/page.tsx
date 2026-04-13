"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { format } from "date-fns";
import {
  CalendarIcon,
  FileText,
  Wallet,
  User,
  ClipboardList,
  CheckCircle2,
  XCircle,
  Clock3,
  Download,
  Send,
  Save,
  RotateCcw,
  Eye,
  Building2,
  Phone,
  Mail,
  MapPin,
  BadgeCheck,
  BookOpen,
  Banknote,
  TrendingUp,
  AlertCircle,
  // GraduationCap,
  ChevronDown,
  Pencil,
  X,
  Lock,
} from "lucide-react";
import { GraduationCap } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { showToast, errorToast } from "@/components/ui/toast";

// ─── Types ────────────────────────────────────────────────────────────────────

type LeaveStatus = "pending" | "approved" | "rejected";
type LeaveType = "casual" | "sick" | "earned" | "maternity" | "unpaid";
type ReportType =
  | "monthly_progress"
  | "incident"
  | "curriculum"
  | "extracurricular"
  | "other";
type ReportStatus = "draft" | "submitted" | "acknowledged";

interface LeaveApplication {
  id: string;
  type: LeaveType;
  from: string;
  to: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
  reviewedBy?: string;
  reviewNote?: string;
}

interface ReportSubmission {
  id: string;
  type: ReportType;
  title: string;
  submittedTo: string;
  note: string;
  status: ReportStatus;
  submittedOn: string;
  acknowledgedOn?: string;
}

interface Payslip {
  id: string;
  month: string;
  year: number;
  grossPay: number;
  deductions: number;
  netPay: number;
  pf: number;
  tax: number;
  breakdown: { label: string; amount: number; type: "earning" | "deduction" }[];
}

interface TeacherProfile {
  name: string;
  employeeId: string;
  email: string;
  phone: string;
  address: string;
  department: string;
  designation: string;
  joinDate: string;
  qualifications: string;
  subjects: string;
  emergencyContact: string;
  emergencyPhone: string;
  bio: string;
}

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

const leaveSchema = z
  .object({
    type: z.enum(["casual", "sick", "earned", "maternity", "unpaid"]),
    from: z.date({ error: "Select a start date" }),
    to: z.date({ error: "Select an end date" }),
    reason: z
      .string()
      .min(10, "Please provide at least 10 characters")
      .max(500),
    substituteTeacher: z.string().optional(),
  })
  .check((ctx) => {
    if (ctx.value.from && ctx.value.to && ctx.value.to < ctx.value.from) {
      ctx.issues.push({
        code: "custom",
        path: ["to"],
        message: "End date must be after start date",
        input: ctx.value.to,
      });
    }
  });

const reportSchema = z.object({
  type: z.enum([
    "monthly_progress",
    "incident",
    "curriculum",
    "extracurricular",
    "other",
  ]),
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  submittedTo: z.enum(["hod", "principal", "admin"]),
  note: z.string().min(20, "Please provide at least 20 characters").max(2000),
});

const profileSchema = z.object({
  phone: z.string().min(10, "Enter a valid phone number"),
  address: z.string().min(5, "Address is required"),
  qualifications: z.string().min(2, "Required"),
  emergencyContact: z.string().min(2, "Required"),
  emergencyPhone: z.string().min(10, "Enter a valid phone number"),
  bio: z.string().max(300, "Max 300 characters").optional(),
});

type LeaveFormValues = z.infer<typeof leaveSchema>;
type ReportFormValues = z.infer<typeof reportSchema>;
type ProfileFormValues = z.infer<typeof profileSchema>;

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_PROFILE: TeacherProfile = {
  name: "Kavitha Nair",
  employeeId: "TCH-2019-042",
  email: "kavitha.nair@school.edu",
  phone: "+91 98765 11111",
  address: "14, Panchavati, Pune – 411006",
  department: "Science & Mathematics",
  designation: "Senior Teacher",
  joinDate: "2019-07-15",
  qualifications: "M.Sc. Mathematics, B.Ed.",
  subjects: "Mathematics (Grade 9, 10, 11)",
  emergencyContact: "Suresh Nair",
  emergencyPhone: "+91 98765 22222",
  bio: "Passionate educator with 8+ years of experience in teaching Mathematics. Advocate for inquiry-based learning and student-centred classrooms.",
};

const MOCK_LEAVE_BALANCE: Record<LeaveType, { used: number; total: number }> = {
  casual: { used: 3, total: 12 },
  sick: { used: 1, total: 10 },
  earned: { used: 5, total: 20 },
  maternity: { used: 0, total: 0 },
  unpaid: { used: 0, total: 0 },
};

const MOCK_LEAVE_HISTORY: LeaveApplication[] = [
  {
    id: "lv-1",
    type: "casual",
    from: "2025-01-06",
    to: "2025-01-07",
    days: 2,
    reason: "Personal work — family function.",
    status: "approved",
    appliedOn: "2025-01-02",
    reviewedBy: "Mrs. Sharma (HOD)",
    reviewNote: "Approved. Please ensure handover notes.",
  },
  {
    id: "lv-2",
    type: "sick",
    from: "2025-02-12",
    to: "2025-02-12",
    days: 1,
    reason: "Fever and cold. Medical certificate attached.",
    status: "approved",
    appliedOn: "2025-02-12",
    reviewedBy: "Mrs. Sharma (HOD)",
  },
  {
    id: "lv-3",
    type: "casual",
    from: "2025-03-20",
    to: "2025-03-21",
    days: 2,
    reason: "Travel — attending educational conference in Mumbai.",
    status: "pending",
    appliedOn: "2025-03-10",
  },
  {
    id: "lv-4",
    type: "earned",
    from: "2024-12-23",
    to: "2024-12-27",
    days: 5,
    reason: "Year-end holiday leave.",
    status: "approved",
    appliedOn: "2024-12-10",
    reviewedBy: "Principal",
  },
  {
    id: "lv-5",
    type: "casual",
    from: "2025-03-05",
    to: "2025-03-05",
    days: 1,
    reason: "Urgent personal work.",
    status: "rejected",
    appliedOn: "2025-03-04",
    reviewedBy: "Mrs. Sharma (HOD)",
    reviewNote: "Insufficient staffing on that date. Please reschedule.",
  },
];

const MOCK_REPORTS: ReportSubmission[] = [
  {
    id: "rpt-1",
    type: "monthly_progress",
    title: "February 2025 – Class Progress Report",
    submittedTo: "HOD",
    note: "Overview of Term 2 progress for Grades 9, 10, and 11 Math classes.",
    status: "acknowledged",
    submittedOn: "2025-03-03",
    acknowledgedOn: "2025-03-05",
  },
  {
    id: "rpt-2",
    type: "curriculum",
    title: "Revised Curriculum Plan – Grade 10 Math",
    submittedTo: "HOD",
    note: "Updated lesson plan covering new CBSE additions for 2024-25.",
    status: "submitted",
    submittedOn: "2025-02-18",
  },
  {
    id: "rpt-3",
    type: "incident",
    title: "Incident Report – Lab Safety Concern",
    submittedTo: "Principal",
    note: "Minor incident in Grade 9 Science lab on 14 Jan. Documented per protocol.",
    status: "acknowledged",
    submittedOn: "2025-01-15",
    acknowledgedOn: "2025-01-16",
  },
  {
    id: "rpt-4",
    type: "extracurricular",
    title: "Math Olympiad Preparation – Team Selection",
    submittedTo: "Admin",
    note: "Details of 8 students shortlisted for district-level Math Olympiad.",
    status: "submitted",
    submittedOn: "2025-03-12",
  },
];

const MOCK_PAYSLIPS: Payslip[] = [
  {
    id: "pay-3",
    month: "February",
    year: 2025,
    grossPay: 68500,
    deductions: 9200,
    netPay: 59300,
    pf: 5200,
    tax: 4000,
    breakdown: [
      { label: "Basic Salary", amount: 42000, type: "earning" },
      { label: "House Rent Allowance", amount: 16800, type: "earning" },
      { label: "Transport Allowance", amount: 4200, type: "earning" },
      { label: "Special Allowance", amount: 5500, type: "earning" },
      { label: "Provident Fund (PF)", amount: 5200, type: "deduction" },
      { label: "Income Tax (TDS)", amount: 4000, type: "deduction" },
    ],
  },
  {
    id: "pay-2",
    month: "January",
    year: 2025,
    grossPay: 68500,
    deductions: 9200,
    netPay: 59300,
    pf: 5200,
    tax: 4000,
    breakdown: [
      { label: "Basic Salary", amount: 42000, type: "earning" },
      { label: "House Rent Allowance", amount: 16800, type: "earning" },
      { label: "Transport Allowance", amount: 4200, type: "earning" },
      { label: "Special Allowance", amount: 5500, type: "earning" },
      { label: "Provident Fund (PF)", amount: 5200, type: "deduction" },
      { label: "Income Tax (TDS)", amount: 4000, type: "deduction" },
    ],
  },
  {
    id: "pay-1",
    month: "December",
    year: 2024,
    grossPay: 74000,
    deductions: 9800,
    netPay: 64200,
    pf: 5200,
    tax: 4600,
    breakdown: [
      { label: "Basic Salary", amount: 42000, type: "earning" },
      { label: "House Rent Allowance", amount: 16800, type: "earning" },
      { label: "Transport Allowance", amount: 4200, type: "earning" },
      { label: "Special Allowance", amount: 5500, type: "earning" },
      { label: "Annual Bonus", amount: 5500, type: "earning" },
      { label: "Provident Fund (PF)", amount: 5200, type: "deduction" },
      { label: "Income Tax (TDS)", amount: 4600, type: "deduction" },
    ],
  },
  {
    id: "pay-0",
    month: "November",
    year: 2024,
    grossPay: 68500,
    deductions: 9200,
    netPay: 59300,
    pf: 5200,
    tax: 4000,
    breakdown: [
      { label: "Basic Salary", amount: 42000, type: "earning" },
      { label: "House Rent Allowance", amount: 16800, type: "earning" },
      { label: "Transport Allowance", amount: 4200, type: "earning" },
      { label: "Special Allowance", amount: 5500, type: "earning" },
      { label: "Provident Fund (PF)", amount: 5200, type: "deduction" },
      { label: "Income Tax (TDS)", amount: 4000, type: "deduction" },
    ],
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const LEAVE_STATUS_CONFIG: Record<
  LeaveStatus,
  { label: string; icon: React.ReactNode; badgeClass: string }
> = {
  pending: {
    label: "Pending",
    icon: <Clock3 className="w-3.5 h-3.5" />,
    badgeClass:
      "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  },
  approved: {
    label: "Approved",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    badgeClass:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  },
  rejected: {
    label: "Rejected",
    icon: <XCircle className="w-3.5 h-3.5" />,
    badgeClass: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  },
};

const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  casual: "Casual Leave",
  sick: "Sick Leave",
  earned: "Earned Leave",
  maternity: "Maternity Leave",
  unpaid: "Unpaid Leave",
};

const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  monthly_progress: "Monthly Progress",
  incident: "Incident Report",
  curriculum: "Curriculum Plan",
  extracurricular: "Extracurricular",
  other: "Other",
};

const REPORT_STATUS_CONFIG: Record<
  ReportStatus,
  { label: string; badgeClass: string }
> = {
  draft: { label: "Draft", badgeClass: "bg-muted text-muted-foreground" },
  submitted: {
    label: "Submitted",
    badgeClass: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  },
  acknowledged: {
    label: "Acknowledged",
    badgeClass:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  },
};

const SUBMIT_TO_LABELS: Record<string, string> = {
  hod: "Head of Department (HOD)",
  principal: "Principal",
  admin: "Admin Office",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function dateDiff(from: string, to: string) {
  const d1 = new Date(from);
  const d2 = new Date(to);
  return Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function SummaryCard({
  icon,
  label,
  value,
  sub,
  colorClass,
  bgClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  colorClass: string;
  bgClass: string;
}) {
  return (
    <div className="flex items-center gap-3 bg-card p-3 border rounded-lg">
      <div
        className={cn("p-2 border rounded-md shrink-0", bgClass, colorClass)}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className={cn("font-semibold text-xl leading-tight", colorClass)}>
          {value}
        </p>
        {sub && <p className="text-muted-foreground text-xs">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Leave Tab ────────────────────────────────────────────────────────────────

function LeaveTab() {
  const [history, setHistory] =
    React.useState<LeaveApplication[]>(MOCK_LEAVE_HISTORY);
  const [isSaving, setIsSaving] = React.useState(false);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const form = useForm<LeaveFormValues>({
    resolver: zodResolver(leaveSchema),
    defaultValues: { type: "casual", reason: "", substituteTeacher: "" },
  });

  const watchFrom = form.watch("from");
  const watchTo = form.watch("to");

  const leaveDays = React.useMemo(() => {
    if (!watchFrom || !watchTo || watchTo < watchFrom) return 0;
    return dateDiff(watchFrom.toISOString(), watchTo.toISOString());
  }, [watchFrom, watchTo]);

  async function onSubmit(values: LeaveFormValues) {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    const newLeave: LeaveApplication = {
      id: `lv-${Date.now()}`,
      type: values.type,
      from: values.from.toISOString().split("T")[0],
      to: values.to.toISOString().split("T")[0],
      days: leaveDays,
      reason: values.reason,
      status: "pending",
      appliedOn: new Date().toISOString().split("T")[0],
    };
    setHistory((prev) => [newLeave, ...prev]);
    setIsSaving(false);
    form.reset({ type: "casual", reason: "", substituteTeacher: "" });
    toast.success("Leave application submitted", {
      description: `${LEAVE_TYPE_LABELS[values.type]} · ${leaveDays} day${leaveDays > 1 ? "s" : ""}`,
    });
  }

  const pending = history.filter((l) => l.status === "pending").length;
  const approved = history.filter((l) => l.status === "approved").length;

  return (
    <div className="space-y-6">
      {/* Balance cards */}
      <div className="gap-3 grid grid-cols-2 sm:grid-cols-3">
        {(["casual", "sick", "earned"] as LeaveType[]).map((type) => {
          const bal = MOCK_LEAVE_BALANCE[type];
          const remaining = bal.total - bal.used;
          return (
            <div
              key={type}
              className="space-y-1.5 bg-card p-3 border rounded-lg"
            >
              <p className="font-medium text-xs">{LEAVE_TYPE_LABELS[type]}</p>
              <div className="flex items-end gap-1">
                <span className="font-semibold text-2xl leading-none">
                  {remaining}
                </span>
                <span className="mb-0.5 text-muted-foreground text-xs">
                  / {bal.total} remaining
                </span>
              </div>
              <div className="bg-muted rounded-full w-full h-1.5 overflow-hidden">
                <div
                  className={cn(
                    "rounded-full h-full",
                    remaining > bal.total * 0.5
                      ? "bg-emerald-500"
                      : remaining > 0
                        ? "bg-amber-500"
                        : "bg-red-500",
                  )}
                  style={{
                    width: `${bal.total > 0 ? (remaining / bal.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Application form */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Apply for Leave</CardTitle>
          <CardDescription>
            Submit a new leave request for approval by your HOD or Principal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Row 1: type + dates */}
              <div className="gap-4 grid grid-cols-1 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Leave Type</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select type…" />
                          </SelectTrigger>
                          <SelectContent>
                            {(
                              Object.keys(LEAVE_TYPE_LABELS) as LeaveType[]
                            ).map((t) => (
                              <SelectItem key={t} value={t}>
                                {LEAVE_TYPE_LABELS[t]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="from"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "justify-start w-full font-normal text-left",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 w-4 h-4 shrink-0" />
                              {field.value
                                ? format(field.value, "dd MMM yyyy")
                                : "Pick date"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-auto" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="to"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        To Date
                        {leaveDays > 0 && (
                          <span className="ml-2 font-normal text-muted-foreground text-xs">
                            {leaveDays} day{leaveDays > 1 ? "s" : ""}
                          </span>
                        )}
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "justify-start w-full font-normal text-left",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 w-4 h-4 shrink-0" />
                              {field.value
                                ? format(field.value, "dd MMM yyyy")
                                : "Pick date"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-auto" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(d) =>
                              watchFrom ? d < watchFrom : false
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Row 2: reason + substitute */}
              <div className="gap-4 grid grid-cols-1 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Reason</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Briefly describe the reason for leave…"
                          className="resize-none"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="substituteTeacher"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Substitute Teacher
                        <span className="ml-1 font-normal text-muted-foreground text-xs">
                          (optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Name of substitute…" />
                      </FormControl>
                      <FormDescription className="text-xs">
                        If arranged, mention their name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    form.reset({
                      type: "casual",
                      reason: "",
                      substituteTeacher: "",
                    })
                  }
                >
                  <RotateCcw className="mr-1.5 w-3.5 h-3.5" />
                  Reset
                </Button>
                <Button type="submit" size="sm" disabled={isSaving}>
                  <Send className="mr-1.5 w-3.5 h-3.5" />
                  {isSaving ? "Submitting…" : "Submit Application"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* History */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div>
              <CardTitle className="text-base">Application History</CardTitle>
              <CardDescription>
                {history.length} applications · {pending} pending · {approved}{" "}
                approved
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">Type</TableHead>
                <TableHead className="hidden sm:table-cell">Duration</TableHead>
                <TableHead className="hidden md:table-cell">
                  Applied On
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[60px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((leave) => {
                const cfg = LEAVE_STATUS_CONFIG[leave.status];
                const isExpanded = expandedId === leave.id;
                return (
                  <React.Fragment key={leave.id}>
                    <TableRow
                      className="cursor-pointer"
                      onClick={() =>
                        setExpandedId(isExpanded ? null : leave.id)
                      }
                    >
                      <TableCell className="pl-6">
                        <p className="font-medium text-sm">
                          {LEAVE_TYPE_LABELS[leave.type]}
                        </p>
                        <p className="sm:hidden text-muted-foreground text-xs">
                          {fmtDate(leave.from)} – {fmtDate(leave.to)} ·{" "}
                          {leave.days}d
                        </p>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <p className="text-sm">
                          {fmtDate(leave.from)} – {fmtDate(leave.to)}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {leave.days} day{leave.days > 1 ? "s" : ""}
                        </p>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                        {fmtDate(leave.appliedOn)}
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("gap-1 text-xs", cfg.badgeClass)}>
                          {cfg.icon}
                          {cfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 text-muted-foreground transition-transform",
                            isExpanded && "rotate-180",
                          )}
                        />
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow className="hover:bg-transparent">
                        <TableCell
                          colSpan={5}
                          className="bg-muted/30 px-6 py-3"
                        >
                          <div className="space-y-1.5 text-sm">
                            <p>
                              <span className="text-muted-foreground text-xs">
                                Reason:{" "}
                              </span>
                              {leave.reason}
                            </p>
                            {leave.reviewedBy && (
                              <p>
                                <span className="text-muted-foreground text-xs">
                                  Reviewed by:{" "}
                                </span>
                                {leave.reviewedBy}
                              </p>
                            )}
                            {leave.reviewNote && (
                              <p>
                                <span className="text-muted-foreground text-xs">
                                  Note:{" "}
                                </span>
                                {leave.reviewNote}
                              </p>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Reports Tab ──────────────────────────────────────────────────────────────

function ReportsTab() {
  const [submissions, setSubmissions] =
    React.useState<ReportSubmission[]>(MOCK_REPORTS);
  const [isSaving, setIsSaving] = React.useState(false);

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      type: "monthly_progress",
      title: "",
      submittedTo: "hod",
      note: "",
    },
  });

  async function onSubmit(values: ReportFormValues) {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    const newReport: ReportSubmission = {
      id: `rpt-${Date.now()}`,
      type: values.type,
      title: values.title,
      submittedTo: SUBMIT_TO_LABELS[values.submittedTo],
      note: values.note,
      status: "submitted",
      submittedOn: new Date().toISOString().split("T")[0],
    };
    setSubmissions((prev) => [newReport, ...prev]);
    setIsSaving(false);
    form.reset({
      type: "monthly_progress",
      title: "",
      submittedTo: "hod",
      note: "",
    });
    toast.success("Report submitted", {
      description: `${values.title} → ${SUBMIT_TO_LABELS[values.submittedTo]}`,
    });
  }

  return (
    <div className="space-y-6">
      {/* Submit form */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Submit a Report</CardTitle>
          <CardDescription>
            Send progress reports, incident reports, or curriculum updates to
            Admin / HOD.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="gap-4 grid grid-cols-1 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Report Type</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type…" />
                          </SelectTrigger>
                          <SelectContent>
                            {(
                              Object.keys(REPORT_TYPE_LABELS) as ReportType[]
                            ).map((t) => (
                              <SelectItem key={t} value={t}>
                                {REPORT_TYPE_LABELS[t]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="submittedTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Submit To</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select recipient…" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hod">
                              Head of Department (HOD)
                            </SelectItem>
                            <SelectItem value="principal">Principal</SelectItem>
                            <SelectItem value="admin">Admin Office</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Report Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g. March Progress Report"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Report Content / Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Write the report content or summary here…"
                        rows={5}
                        className="resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    form.reset({
                      type: "monthly_progress",
                      title: "",
                      submittedTo: "hod",
                      note: "",
                    })
                  }
                >
                  <RotateCcw className="mr-1.5 w-3.5 h-3.5" />
                  Reset
                </Button>
                <Button type="submit" size="sm" disabled={isSaving}>
                  <Send className="mr-1.5 w-3.5 h-3.5" />
                  {isSaving ? "Submitting…" : "Submit Report"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Submissions list */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Submission History</CardTitle>
          <CardDescription>
            {submissions.length} reports submitted
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">Title</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead className="hidden md:table-cell">
                  Submitted To
                </TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((rpt) => {
                const cfg = REPORT_STATUS_CONFIG[rpt.status];
                return (
                  <TableRow key={rpt.id}>
                    <TableCell className="pl-6">
                      <p className="font-medium text-sm">{rpt.title}</p>
                      <p className="md:hidden text-muted-foreground text-xs">
                        {rpt.submittedTo} · {fmtDate(rpt.submittedOn)}
                      </p>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="secondary" className="text-xs">
                        {REPORT_TYPE_LABELS[rpt.type]}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                      {rpt.submittedTo}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                      {fmtDate(rpt.submittedOn)}
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("text-xs", cfg.badgeClass)}>
                        {cfg.label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Payslips Tab ─────────────────────────────────────────────────────────────

function PayslipsTab() {
  const [expandedId, setExpandedId] = React.useState<string | null>(
    MOCK_PAYSLIPS[0]?.id ?? null,
  );

  const ytdEarnings = MOCK_PAYSLIPS.reduce((s, p) => s + p.grossPay, 0);
  const ytdTax = MOCK_PAYSLIPS.reduce((s, p) => s + p.tax, 0);
  const ytdPf = MOCK_PAYSLIPS.reduce((s, p) => s + p.pf, 0);

  return (
    <div className="space-y-6">
      {/* YTD summary */}
      <div className="gap-3 grid grid-cols-2 sm:grid-cols-3">
        <SummaryCard
          icon={<Banknote className="w-4 h-4" />}
          label="YTD Gross"
          value={formatINR(ytdEarnings)}
          colorClass="text-emerald-600 dark:text-emerald-400"
          bgClass="bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800"
        />
        <SummaryCard
          icon={<TrendingUp className="w-4 h-4" />}
          label="YTD Tax Paid"
          value={formatINR(ytdTax)}
          colorClass="text-red-600 dark:text-red-400"
          bgClass="bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
        />
        <SummaryCard
          icon={<BadgeCheck className="w-4 h-4" />}
          label="YTD PF"
          value={formatINR(ytdPf)}
          colorClass="text-blue-600 dark:text-blue-400"
          bgClass="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800"
        />
      </div>

      {/* Payslip list */}
      <div className="space-y-3">
        {MOCK_PAYSLIPS.map((slip) => {
          const isExpanded = expandedId === slip.id;
          const earnings = slip.breakdown.filter((b) => b.type === "earning");
          const deductions = slip.breakdown.filter(
            (b) => b.type === "deduction",
          );
          return (
            <Card
              key={slip.id}
              className={cn(isExpanded && "ring-1 ring-border")}
            >
              {/* Header row — always visible */}
              <button
                type="button"
                className="flex justify-between items-center hover:bg-muted/30 p-4 rounded-t-lg w-full text-left transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : slip.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex justify-center items-center bg-muted rounded-md w-9 h-9 shrink-0">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {slip.month} {slip.year}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Net pay:{" "}
                      <span className="font-semibold text-foreground">
                        {formatINR(slip.netPay)}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex gap-4 text-right">
                    <div>
                      <p className="text-muted-foreground text-xs">Gross</p>
                      <p className="font-medium text-sm">
                        {formatINR(slip.grossPay)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">
                        Deductions
                      </p>
                      <p className="font-medium text-red-600 dark:text-red-400 text-sm">
                        – {formatINR(slip.deductions)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden sm:flex gap-1.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      showToast("Download feature coming soon", undefined, "info");
                    }}
                  >
                    <Download className="w-3.5 h-3.5" />
                    PDF
                  </Button>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-muted-foreground transition-transform",
                      isExpanded && "rotate-180",
                    )}
                  />
                </div>
              </button>

              {/* Expanded breakdown */}
              {isExpanded && (
                <>
                  <Separator />
                  <CardContent className="pt-4 pb-4">
                    <div className="gap-6 grid grid-cols-1 sm:grid-cols-2">
                      {/* Earnings */}
                      <div className="space-y-2">
                        <p className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs uppercase tracking-wide">
                          Earnings
                        </p>
                        {earnings.map((e, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {e.label}
                            </span>
                            <span className="font-medium">
                              {formatINR(e.amount)}
                            </span>
                          </div>
                        ))}
                        <Separator />
                        <div className="flex justify-between font-semibold text-sm">
                          <span>Gross Pay</span>
                          <span className="text-emerald-600 dark:text-emerald-400">
                            {formatINR(slip.grossPay)}
                          </span>
                        </div>
                      </div>

                      {/* Deductions */}
                      <div className="space-y-2">
                        <p className="font-semibold text-red-600 dark:text-red-400 text-xs uppercase tracking-wide">
                          Deductions
                        </p>
                        {deductions.map((d, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {d.label}
                            </span>
                            <span className="font-medium text-red-600 dark:text-red-400">
                              – {formatINR(d.amount)}
                            </span>
                          </div>
                        ))}
                        <Separator />
                        <div className="flex justify-between font-semibold text-sm">
                          <span>Total Deductions</span>
                          <span className="text-red-600 dark:text-red-400">
                            – {formatINR(slip.deductions)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Net pay callout */}
                    <div className="flex justify-between items-center bg-muted/50 mt-4 p-3 rounded-lg">
                      <span className="font-semibold text-sm">Net Pay</span>
                      <span className="font-bold text-lg">
                        {formatINR(slip.netPay)}
                      </span>
                    </div>

                    <div className="flex justify-end mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          showToast("Download feature coming soon", undefined, "info")
                        }
                      >
                        <Download className="mr-1.5 w-3.5 h-3.5" />
                        Download PDF
                      </Button>
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────

function ProfileTab() {
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [profile, setProfile] = React.useState<TeacherProfile>(MOCK_PROFILE);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      phone: profile.phone,
      address: profile.address,
      qualifications: profile.qualifications,
      emergencyContact: profile.emergencyContact,
      emergencyPhone: profile.emergencyPhone,
      bio: profile.bio,
    },
  });

  async function onSubmit(values: ProfileFormValues) {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setProfile((prev) => ({ ...prev, ...values }));
    setIsSaving(false);
    setIsEditing(false);
    showToast("Profile updated successfully", undefined, "success");
  }

  return (
    <div className="space-y-6">
      {/* Header card */}
      <Card>
        <CardContent className="pt-5 pb-5">
          <div className="flex sm:flex-row flex-col sm:items-center gap-4">
            <div className="flex justify-center items-center bg-muted rounded-full w-16 h-16 font-bold text-xl shrink-0">
              {profile.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-semibold text-lg">{profile.name}</h2>
                <Badge variant="secondary" className="font-mono text-xs">
                  {profile.employeeId}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">
                {profile.designation} · {profile.department}
              </p>
              <p className="mt-0.5 text-muted-foreground text-xs">
                Joined{" "}
                {new Date(profile.joinDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <Button
              variant={isEditing ? "outline" : "default"}
              size="sm"
              onClick={() => {
                setIsEditing(!isEditing);
                if (isEditing) form.reset();
              }}
            >
              {isEditing ? (
                <>
                  <X className="mr-1.5 w-3.5 h-3.5" />
                  Cancel
                </>
              ) : (
                <>
                  <Pencil className="mr-1.5 w-3.5 h-3.5" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isEditing ? (
        // ── Edit mode ──
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Edit Profile</CardTitle>
            <CardDescription>
              Update your contact details and personal information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Read-only info notice */}
                <div className="flex items-start gap-2 bg-muted/40 px-3 py-2.5 rounded-md">
                  <Lock className="mt-0.5 w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <p className="text-muted-foreground text-xs">
                    Name, Employee ID, email, designation, and department are
                    managed by Admin and cannot be changed here.
                  </p>
                </div>

                <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="qualifications"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Qualifications</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. M.Sc., B.Ed." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="emergencyContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emergency Contact Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="emergencyPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emergency Contact Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={2} className="resize-none" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Bio
                        <span className="ml-1 font-normal text-muted-foreground text-xs">
                          (optional, max 300 chars)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={3}
                          className="resize-none"
                          placeholder="A short description about yourself…"
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-right">
                        {(field.value ?? "").length} / 300
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditing(false);
                      form.reset();
                    }}
                  >
                    <X className="mr-1.5 w-3.5 h-3.5" />
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" disabled={isSaving}>
                    <Save className="mr-1.5 w-3.5 h-3.5" />
                    {isSaving ? "Saving…" : "Save Changes"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        // ── View mode ──
        <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ProfileRow
                icon={<Mail className="w-3.5 h-3.5" />}
                label="Email"
                value={profile.email}
                locked
              />
              <ProfileRow
                icon={<Phone className="w-3.5 h-3.5" />}
                label="Phone"
                value={profile.phone}
              />
              <ProfileRow
                icon={<MapPin className="w-3.5 h-3.5" />}
                label="Address"
                value={profile.address}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Employment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ProfileRow
                icon={<Building2 className="w-3.5 h-3.5" />}
                label="Department"
                value={profile.department}
                locked
              />
              <ProfileRow
                icon={<BadgeCheck className="w-3.5 h-3.5" />}
                label="Designation"
                value={profile.designation}
                locked
              />
              <ProfileRow
                icon={<BookOpen className="w-3.5 h-3.5" />}
                label="Subjects"
                value={profile.subjects}
                locked
              />
              <ProfileRow
                icon={<CalendarIcon className="w-3.5 h-3.5" />}
                label="Joined"
                value={new Date(profile.joinDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                locked
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Qualifications & Bio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ProfileRow
                icon={<GraduationCap className="w-3.5 h-3.5" />}
                label="Qualifications"
                value={profile.qualifications}
              />
              {profile.bio && (
                <div className="flex items-start gap-2.5 pt-1">
                  <span className="mt-0.5 text-muted-foreground shrink-0">
                    <FileText className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <p className="text-muted-foreground text-xs">Bio</p>
                    <p className="text-sm leading-relaxed">{profile.bio}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ProfileRow
                icon={<User className="w-3.5 h-3.5" />}
                label="Name"
                value={profile.emergencyContact}
              />
              <ProfileRow
                icon={<Phone className="w-3.5 h-3.5" />}
                label="Phone"
                value={profile.emergencyPhone}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function ProfileRow({
  icon,
  label,
  value,
  locked,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  locked?: boolean;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 text-muted-foreground shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-muted-foreground text-xs">{label}</p>
          {locked && <Lock className="w-2.5 h-2.5 text-muted-foreground/60" />}
        </div>
        <p className="text-sm break-words">{value}</p>
      </div>
    </div>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function AdministrativePage() {
  const pendingLeave = MOCK_LEAVE_HISTORY.filter(
    (l) => l.status === "pending",
  ).length;

  return (
    <div className="space-y-6 mx-auto p-6 max-w-5xl font-sans">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-2xl tracking-tight">
          Administrative
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage your leave, submit reports, view payslips, and keep your
          profile up to date.
        </p>
      </div>

      <Tabs defaultValue="leave">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="leave" className="flex-1 sm:flex-none">
            Leave
            {pendingLeave > 0 && (
              <span className="inline-block bg-amber-500 ml-1.5 rounded-full w-1.5 h-1.5" />
            )}
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex-1 sm:flex-none">
            Reports
          </TabsTrigger>
          <TabsTrigger value="payslips" className="flex-1 sm:flex-none">
            Payslips
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex-1 sm:flex-none">
            My Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leave" className="mt-6">
          <LeaveTab />
        </TabsContent>
        <TabsContent value="reports" className="mt-6">
          <ReportsTab />
        </TabsContent>
        <TabsContent value="payslips" className="mt-6">
          <PayslipsTab />
        </TabsContent>
        <TabsContent value="profile" className="mt-6">
          <ProfileTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
