"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import {
  CalendarDays,
  ArrowLeftRight,
  Users,
  Clock,
  MapPin,
  ChevronDown,
  Search,
  UserPlus,
  UserMinus,
  Send,
  BookOpen,
  FlaskConical,
  Music,
  Dumbbell,
  Globe,
  Calculator,
  Pencil,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  GripVertical,
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
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type Day = "Mon" | "Tue" | "Wed" | "Thu" | "Fri";

interface TimetableSlot {
  id: string;
  day: Day;
  period: number;
  startTime: string;
  endTime: string;
  subject: string;
  class: string;
  room: string;
  color: string;
}

interface ClassInfo {
  id: string;
  label: string;
  subject: string;
  grade: string;
  section: string;
  room: string;
  totalStudents: number;
}

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  avatarInitials: string;
  isEnrolled: boolean;
}

interface ChangeRequest {
  id: string;
  type: "swap" | "move";
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  details: string;
}

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

const swapRequestSchema = z.object({
  type: z.literal("swap"),
  mySlotId: z.string().min(1, "Select your slot"),
  targetTeacher: z.string().min(1, "Select a teacher"),
  targetSlotId: z.string().min(1, "Select their slot"),
  reason: z.string().min(10, "Please provide a reason (min 10 chars)").max(500),
});

const moveRequestSchema = z.object({
  type: z.literal("move"),
  mySlotId: z.string().min(1, "Select your slot"),
  targetDay: z.enum(["Mon", "Tue", "Wed", "Thu", "Fri"]),
  targetPeriod: z.string().min(1, "Select target period"),
  reason: z.string().min(10, "Please provide a reason (min 10 chars)").max(500),
});

const changeRequestSchema = z.discriminatedUnion("type", [
  swapRequestSchema,
  moveRequestSchema,
]);

type ChangeRequestFormValues = z.infer<typeof changeRequestSchema>;

// ─── Mock Data ────────────────────────────────────────────────────────────────

const DAYS: Day[] = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const DAY_FULL: Record<Day, string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
};

const PERIODS = [
  { period: 1, startTime: "08:00", endTime: "08:45" },
  { period: 2, startTime: "08:50", endTime: "09:35" },
  { period: 3, startTime: "09:40", endTime: "10:25" },
  { period: 4, startTime: "10:40", endTime: "11:25" },
  { period: 5, startTime: "11:30", endTime: "12:15" },
  { period: 6, startTime: "13:00", endTime: "13:45" },
  { period: 7, startTime: "13:50", endTime: "14:35" },
  { period: 8, startTime: "14:40", endTime: "15:25" },
];

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics:
    "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800",
  Science:
    "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
  Physics:
    "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  English:
    "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  History:
    "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800",
  Music:
    "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-950 dark:text-pink-300 dark:border-pink-800",
  PE: "bg-lime-100 text-lime-800 border-lime-200 dark:bg-lime-950 dark:text-lime-300 dark:border-lime-800",
};

const SUBJECT_ICONS: Record<string, React.ReactNode> = {
  Mathematics: <Calculator className="w-3 h-3" />,
  Science: <FlaskConical className="w-3 h-3" />,
  Physics: <FlaskConical className="w-3 h-3" />,
  English: <BookOpen className="w-3 h-3" />,
  History: <Globe className="w-3 h-3" />,
  Music: <Music className="w-3 h-3" />,
  PE: <Dumbbell className="w-3 h-3" />,
};

const MOCK_TIMETABLE: TimetableSlot[] = [
  {
    id: "t1",
    day: "Mon",
    period: 1,
    startTime: "08:00",
    endTime: "08:45",
    subject: "Mathematics",
    class: "Grade 10 – A",
    room: "Room 201",
    color: "",
  },
  {
    id: "t2",
    day: "Mon",
    period: 3,
    startTime: "09:40",
    endTime: "10:25",
    subject: "Mathematics",
    class: "Grade 10 – B",
    room: "Room 202",
    color: "",
  },
  {
    id: "t3",
    day: "Mon",
    period: 5,
    startTime: "11:30",
    endTime: "12:15",
    subject: "Physics",
    class: "Grade 11 – C",
    room: "Lab 1",
    color: "",
  },
  {
    id: "t4",
    day: "Tue",
    period: 2,
    startTime: "08:50",
    endTime: "09:35",
    subject: "Mathematics",
    class: "Grade 10 – A",
    room: "Room 201",
    color: "",
  },
  {
    id: "t5",
    day: "Tue",
    period: 4,
    startTime: "10:40",
    endTime: "11:25",
    subject: "Science",
    class: "Grade 9 – A",
    room: "Lab 2",
    color: "",
  },
  {
    id: "t6",
    day: "Tue",
    period: 6,
    startTime: "13:00",
    endTime: "13:45",
    subject: "Physics",
    class: "Grade 11 – C",
    room: "Lab 1",
    color: "",
  },
  {
    id: "t7",
    day: "Wed",
    period: 1,
    startTime: "08:00",
    endTime: "08:45",
    subject: "Science",
    class: "Grade 9 – A",
    room: "Lab 2",
    color: "",
  },
  {
    id: "t8",
    day: "Wed",
    period: 3,
    startTime: "09:40",
    endTime: "10:25",
    subject: "Mathematics",
    class: "Grade 10 – B",
    room: "Room 202",
    color: "",
  },
  {
    id: "t9",
    day: "Wed",
    period: 7,
    startTime: "13:50",
    endTime: "14:35",
    subject: "Mathematics",
    class: "Grade 10 – A",
    room: "Room 201",
    color: "",
  },
  {
    id: "t10",
    day: "Thu",
    period: 2,
    startTime: "08:50",
    endTime: "09:35",
    subject: "Physics",
    class: "Grade 11 – C",
    room: "Lab 1",
    color: "",
  },
  {
    id: "t11",
    day: "Thu",
    period: 5,
    startTime: "11:30",
    endTime: "12:15",
    subject: "Mathematics",
    class: "Grade 10 – B",
    room: "Room 202",
    color: "",
  },
  {
    id: "t12",
    day: "Thu",
    period: 8,
    startTime: "14:40",
    endTime: "15:25",
    subject: "Science",
    class: "Grade 9 – A",
    room: "Lab 2",
    color: "",
  },
  {
    id: "t13",
    day: "Fri",
    period: 1,
    startTime: "08:00",
    endTime: "08:45",
    subject: "Mathematics",
    class: "Grade 10 – A",
    room: "Room 201",
    color: "",
  },
  {
    id: "t14",
    day: "Fri",
    period: 4,
    startTime: "10:40",
    endTime: "11:25",
    subject: "Science",
    class: "Grade 9 – A",
    room: "Lab 2",
    color: "",
  },
  {
    id: "t15",
    day: "Fri",
    period: 6,
    startTime: "13:00",
    endTime: "13:45",
    subject: "Physics",
    class: "Grade 11 – C",
    room: "Lab 1",
    color: "",
  },
];

const MOCK_CLASSES: ClassInfo[] = [
  {
    id: "cls-1",
    label: "Grade 10 – A · Mathematics",
    subject: "Mathematics",
    grade: "10",
    section: "A",
    room: "Room 201",
    totalStudents: 32,
  },
  {
    id: "cls-2",
    label: "Grade 10 – B · Mathematics",
    subject: "Mathematics",
    grade: "10",
    section: "B",
    room: "Room 202",
    totalStudents: 30,
  },
  {
    id: "cls-3",
    label: "Grade 9 – A · Science",
    subject: "Science",
    grade: "9",
    section: "A",
    room: "Lab 2",
    totalStudents: 28,
  },
  {
    id: "cls-4",
    label: "Grade 11 – C · Physics",
    subject: "Physics",
    grade: "11",
    section: "C",
    room: "Lab 1",
    totalStudents: 25,
  },
];

const MOCK_ALL_STUDENTS: Student[] = [
  {
    id: "s1",
    name: "Aarav Sharma",
    rollNumber: "10A-01",
    avatarInitials: "AS",
    isEnrolled: true,
  },
  {
    id: "s2",
    name: "Priya Patel",
    rollNumber: "10A-02",
    avatarInitials: "PP",
    isEnrolled: true,
  },
  {
    id: "s3",
    name: "Rohan Mehta",
    rollNumber: "10A-03",
    avatarInitials: "RM",
    isEnrolled: true,
  },
  {
    id: "s4",
    name: "Sneha Iyer",
    rollNumber: "10A-04",
    avatarInitials: "SI",
    isEnrolled: true,
  },
  {
    id: "s5",
    name: "Vikram Nair",
    rollNumber: "10A-05",
    avatarInitials: "VN",
    isEnrolled: true,
  },
  {
    id: "s6",
    name: "Ananya Reddy",
    rollNumber: "10A-06",
    avatarInitials: "AR",
    isEnrolled: true,
  },
  {
    id: "s7",
    name: "Karan Gupta",
    rollNumber: "10A-07",
    avatarInitials: "KG",
    isEnrolled: false,
  },
  {
    id: "s8",
    name: "Divya Krishnan",
    rollNumber: "10A-08",
    avatarInitials: "DK",
    isEnrolled: false,
  },
  {
    id: "s9",
    name: "Arjun Singh",
    rollNumber: "10B-01",
    avatarInitials: "AS",
    isEnrolled: false,
  },
  {
    id: "s10",
    name: "Meera Joshi",
    rollNumber: "10B-02",
    avatarInitials: "MJ",
    isEnrolled: false,
  },
  {
    id: "s11",
    name: "Nikhil Kumar",
    rollNumber: "10B-03",
    avatarInitials: "NK",
    isEnrolled: false,
  },
];

const MOCK_OTHER_TEACHERS = [
  { id: "t1", name: "Ms. Kavitha Rao", subject: "Mathematics" },
  { id: "t2", name: "Mr. Suresh Pillai", subject: "Science" },
  { id: "t3", name: "Ms. Anita Desai", subject: "English" },
  { id: "t4", name: "Mr. Ravi Shankar", subject: "Physics" },
];

const MOCK_THEIR_SLOTS: TimetableSlot[] = [
  {
    id: "ot1",
    day: "Mon",
    period: 2,
    startTime: "08:50",
    endTime: "09:35",
    subject: "Mathematics",
    class: "Grade 9 – B",
    room: "Room 105",
    color: "",
  },
  {
    id: "ot2",
    day: "Wed",
    period: 4,
    startTime: "10:40",
    endTime: "11:25",
    subject: "Mathematics",
    class: "Grade 8 – A",
    room: "Room 103",
    color: "",
  },
  {
    id: "ot3",
    day: "Fri",
    period: 3,
    startTime: "09:40",
    endTime: "10:25",
    subject: "Mathematics",
    class: "Grade 11 – A",
    room: "Room 204",
    color: "",
  },
];

const MOCK_PAST_REQUESTS: ChangeRequest[] = [
  {
    id: "r1",
    type: "swap",
    status: "approved",
    submittedAt: "2025-01-10",
    details: "Swap Mon P1 with Ms. Kavitha Rao – Wed P4",
  },
  {
    id: "r2",
    type: "move",
    status: "pending",
    submittedAt: "2025-01-18",
    details: "Move Tue P4 → Thu P3",
  },
  {
    id: "r3",
    type: "swap",
    status: "rejected",
    submittedAt: "2025-01-05",
    details: "Swap Fri P1 with Mr. Suresh Pillai – Mon P2",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slotLabel(slot: TimetableSlot) {
  return `${slot.day} P${slot.period} · ${slot.subject} (${slot.startTime}–${slot.endTime})`;
}

function getToday(): Day {
  const map: Record<number, Day> = {
    1: "Mon",
    2: "Tue",
    3: "Wed",
    4: "Thu",
    5: "Fri",
  };
  const d = new Date().getDay();
  return map[d] ?? "Mon";
}

// ─── TAB 1: Timetable Grid ────────────────────────────────────────────────────

function TimetableTab() {
  const today = getToday();
  const [highlightDay, setHighlightDay] = React.useState<Day | null>(today);
  const [detailSlot, setDetailSlot] = React.useState<TimetableSlot | null>(
    null,
  );

  const slotMap = React.useMemo(() => {
    const m: Record<string, TimetableSlot> = {};
    MOCK_TIMETABLE.forEach((s) => {
      m[`${s.day}-${s.period}`] = s;
    });
    return m;
  }, []);

  const totalPeriods = MOCK_TIMETABLE.length;
  const subjectSet = [...new Set(MOCK_TIMETABLE.map((s) => s.subject))];

  return (
    <div className="space-y-5">
      {/* Summary pills */}
      <div className="flex flex-wrap gap-2">
        {subjectSet.map((subj) => {
          const count = MOCK_TIMETABLE.filter((s) => s.subject === subj).length;
          return (
            <div
              key={subj}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 border rounded-full font-medium text-xs",
                SUBJECT_COLORS[subj] ?? "bg-muted text-muted-foreground",
              )}
            >
              {SUBJECT_ICONS[subj]}
              {subj}
              <span className="opacity-70">· {count}</span>
            </div>
          );
        })}
        <div className="inline-flex items-center gap-1.5 bg-muted ml-auto px-3 py-1 border rounded-full font-medium text-muted-foreground text-xs">
          <Clock className="w-3 h-3" />
          {totalPeriods} periods / week
        </div>
      </div>

      {/* Grid */}
      <div className="border rounded-xl overflow-auto">
        <table className="w-full min-w-[640px] text-sm border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b">
              {/* Time column header */}
              <th className="left-0 z-10 sticky bg-muted/50 px-3 py-3 w-[90px] font-semibold text-muted-foreground text-xs text-left">
                Period
              </th>
              {DAYS.map((day) => (
                <th
                  key={day}
                  onClick={() =>
                    setHighlightDay(highlightDay === day ? null : day)
                  }
                  className={cn(
                    "px-2 py-3 font-semibold text-xs text-center transition-colors cursor-pointer select-none",
                    highlightDay === day
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground",
                    day === today && "text-primary",
                  )}
                >
                  <span className="block">{day}</span>
                  {day === today && (
                    <span className="inline-block bg-primary mt-0.5 rounded-full w-1.5 h-1.5" />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERIODS.map((p, pi) => (
              <React.Fragment key={p.period}>
                {/* Break row after period 3 (before period 4) and period 5 (lunch) */}
                {p.period === 4 && (
                  <tr className="border-b">
                    <td colSpan={6} className="bg-muted/30 px-3 py-1.5">
                      <span className="font-medium text-[10px] text-muted-foreground uppercase tracking-wide">
                        Short Break · 10:25 – 10:40
                      </span>
                    </td>
                  </tr>
                )}
                {p.period === 6 && (
                  <tr className="border-b">
                    <td colSpan={6} className="bg-muted/30 px-3 py-1.5">
                      <span className="font-medium text-[10px] text-muted-foreground uppercase tracking-wide">
                        Lunch Break · 12:15 – 13:00
                      </span>
                    </td>
                  </tr>
                )}
                <tr
                  className={cn(
                    "border-b transition-colors",
                    pi % 2 === 0 ? "bg-background" : "bg-muted/10",
                  )}
                >
                  {/* Period / time label */}
                  <td className="left-0 z-10 sticky bg-inherit px-3 py-2 border-r">
                    <div className="font-semibold text-foreground text-xs">
                      P{p.period}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {p.startTime}–{p.endTime}
                    </div>
                  </td>
                  {DAYS.map((day) => {
                    const slot = slotMap[`${day}-${p.period}`];
                    const isHighlighted = highlightDay === day;
                    return (
                      <td
                        key={day}
                        className={cn(
                          "px-1.5 py-1.5 align-top transition-colors",
                          isHighlighted && "bg-primary/5 dark:bg-primary/10",
                        )}
                      >
                        {slot ? (
                          <button
                            type="button"
                            onClick={() => setDetailSlot(slot)}
                            className={cn(
                              "hover:shadow-sm px-2 py-1.5 border rounded-lg w-full text-left hover:scale-[1.02] active:scale-100 transition-all",
                              SUBJECT_COLORS[slot.subject] ??
                                "bg-muted text-muted-foreground border-border",
                            )}
                          >
                            <div className="flex items-center gap-1 mb-0.5">
                              {SUBJECT_ICONS[slot.subject]}
                              <span className="font-semibold text-[11px] truncate">
                                {slot.subject}
                              </span>
                            </div>
                            <div className="opacity-80 text-[10px] truncate">
                              {slot.class}
                            </div>
                            <div className="flex items-center gap-0.5 opacity-60 mt-0.5 text-[10px] truncate">
                              <MapPin className="w-2.5 h-2.5 shrink-0" />
                              {slot.room}
                            </div>
                          </button>
                        ) : (
                          <div className="border border-border/40 border-dashed rounded-lg h-full min-h-[52px]" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Slot detail dialog */}
      <Dialog open={!!detailSlot} onOpenChange={() => setDetailSlot(null)}>
        <DialogContent className="max-w-sm">
          {detailSlot && (
            <>
              <DialogHeader>
                <div
                  className={cn(
                    "inline-flex items-center gap-1.5 mb-1 px-2.5 py-1 rounded-md w-fit font-medium text-xs",
                    SUBJECT_COLORS[detailSlot.subject],
                  )}
                >
                  {SUBJECT_ICONS[detailSlot.subject]}
                  {detailSlot.subject}
                </div>
                <DialogTitle>{detailSlot.class}</DialogTitle>
                <DialogDescription>
                  {DAY_FULL[detailSlot.day]} · Period {detailSlot.period}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4 shrink-0" />
                  {detailSlot.startTime} – {detailSlot.endTime}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 shrink-0" />
                  {detailSlot.room}
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDetailSlot(null)}
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

// ─── TAB 2: Request Timetable Change ─────────────────────────────────────────

const REQUEST_TYPE_CONFIG = {
  swap: {
    label: "Swap with Teacher",
    icon: <ArrowLeftRight className="w-4 h-4" />,
    description: "Exchange a slot with another teacher",
  },
  move: {
    label: "Move to New Slot",
    icon: <CalendarDays className="w-4 h-4" />,
    description: "Reschedule your slot to a different day/period",
  },
};

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    icon: <AlertCircle className="w-3.5 h-3.5" />,
    color: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  },
  approved: {
    label: "Approved",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  },
  rejected: {
    label: "Rejected",
    icon: <XCircle className="w-3.5 h-3.5" />,
    color: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  },
};

function RequestChangeTab() {
  const [requestType, setRequestType] = React.useState<"swap" | "move">("swap");
  const [isSaving, setIsSaving] = React.useState(false);

  const form = useForm<ChangeRequestFormValues>({
    resolver: zodResolver(changeRequestSchema),
    defaultValues: {
      type: "swap",
      mySlotId: "",
      targetTeacher: "",
      targetSlotId: "",
      reason: "",
    } as any,
  });

  function switchType(type: "swap" | "move") {
    setRequestType(type);
    if (type === "swap") {
      form.reset({
        type: "swap",
        mySlotId: "",
        targetTeacher: "",
        targetSlotId: "",
        reason: "",
      });
    } else {
      form.reset({
        type: "move",
        mySlotId: "",
        targetDay: "Mon",
        targetPeriod: "",
        reason: "",
      });
    }
  }

  async function onSubmit(values: ChangeRequestFormValues) {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    console.log("Change request submitted:", values);
    setIsSaving(false);
    toast.success("Request submitted", {
      description: "Your timetable change request has been sent to the admin.",
    });
    switchType(requestType);
  }

  return (
    <div className="space-y-6">
      {/* Request type toggle */}
      <div className="gap-3 grid grid-cols-2">
        {(["swap", "move"] as const).map((type) => {
          const cfg = REQUEST_TYPE_CONFIG[type];
          const isActive = requestType === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => switchType(type)}
              className={cn(
                "flex items-start gap-3 p-4 border rounded-xl text-left transition-all duration-150",
                isActive
                  ? "border-primary bg-primary/5 dark:bg-primary/10"
                  : "border-border hover:bg-muted",
              )}
            >
              <div
                className={cn(
                  "mt-0.5 p-2 rounded-lg",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {cfg.icon}
              </div>
              <div>
                <p
                  className={cn(
                    "font-semibold text-sm",
                    isActive && "text-primary",
                  )}
                >
                  {cfg.label}
                </p>
                <p className="mt-0.5 text-muted-foreground text-xs">
                  {cfg.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Request Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* My slot */}
              <FormField
                control={form.control}
                name="mySlotId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Slot to Change</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select one of your periods…" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {MOCK_TIMETABLE.map((slot) => (
                          <SelectItem key={slot.id} value={slot.id}>
                            {slotLabel(slot)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Swap-specific fields */}
              {requestType === "swap" && (
                <>
                  <FormField
                    control={form.control}
                    name={"targetTeacher" as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teacher to Swap With</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a teacher…" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {MOCK_OTHER_TEACHERS.map((t) => (
                              <SelectItem key={t.id} value={t.id}>
                                {t.name} · {t.subject}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={"targetSlotId" as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Their Slot to Take</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select their period…" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {MOCK_THEIR_SLOTS.map((slot) => (
                              <SelectItem key={slot.id} value={slot.id}>
                                {slotLabel(slot)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Move-specific fields */}
              {requestType === "move" && (
                <div className="gap-4 grid grid-cols-2">
                  <FormField
                    control={form.control}
                    name={"targetDay" as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Day</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Day…" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DAYS.map((d) => (
                              <SelectItem key={d} value={d}>
                                {DAY_FULL[d]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={"targetPeriod" as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Period</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Period…" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {PERIODS.map((p) => (
                              <SelectItem
                                key={p.period}
                                value={String(p.period)}
                              >
                                P{p.period} · {p.startTime}–{p.endTime}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Reason */}
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Briefly explain why you need this change…"
                        className="resize-none"
                        rows={3}
                      />
                    </FormControl>
                    <FormDescription>
                      This will be reviewed by the admin / HOD.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving} size="sm">
              <Send className="mr-1.5 w-3.5 h-3.5" />
              {isSaving ? "Submitting…" : "Submit Request"}
            </Button>
          </div>
        </form>
      </Form>

      {/* Past requests */}
      <div className="space-y-3">
        <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wide">
          Past Requests
        </h3>
        <div className="space-y-2">
          {MOCK_PAST_REQUESTS.map((req) => {
            const statusCfg = STATUS_CONFIG[req.status];
            const typeCfg = REQUEST_TYPE_CONFIG[req.type];
            return (
              <div
                key={req.id}
                className="flex items-center gap-3 bg-card px-4 py-3 border rounded-lg"
              >
                <div className="text-muted-foreground">{typeCfg.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{req.details}</p>
                  <p className="text-muted-foreground text-xs">
                    Submitted {req.submittedAt}
                  </p>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-medium text-xs shrink-0",
                    statusCfg.color,
                  )}
                >
                  {statusCfg.icon}
                  {statusCfg.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── TAB 3: Class Rosters ─────────────────────────────────────────────────────

function RostersTab() {
  const [selectedClass, setSelectedClass] = React.useState<ClassInfo | null>(
    null,
  );
  const [search, setSearch] = React.useState("");
  const [enrolledIds, setEnrolledIds] = React.useState<Set<string>>(
    new Set(MOCK_ALL_STUDENTS.filter((s) => s.isEnrolled).map((s) => s.id)),
  );
  const [confirmDialog, setConfirmDialog] = React.useState<{
    student: Student;
    action: "add" | "remove";
  } | null>(null);

  const enrolled = MOCK_ALL_STUDENTS.filter((s) => enrolledIds.has(s.id));
  const available = MOCK_ALL_STUDENTS.filter((s) => !enrolledIds.has(s.id));

  const filteredEnrolled = enrolled.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(search.toLowerCase()),
  );
  const filteredAvailable = available.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(search.toLowerCase()),
  );

  function confirmAction() {
    if (!confirmDialog) return;
    const { student, action } = confirmDialog;
    setEnrolledIds((prev) => {
      const next = new Set(prev);
      action === "add" ? next.add(student.id) : next.delete(student.id);
      return next;
    });
    toast.success(
      action === "add"
        ? `${student.name} added to roster`
        : `${student.name} removed from roster`,
    );
    setConfirmDialog(null);
  }

  return (
    <div className="space-y-5">
      {/* Class selector */}
      <div className="gap-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {MOCK_CLASSES.map((cls) => {
          const isSelected = selectedClass?.id === cls.id;
          return (
            <button
              key={cls.id}
              type="button"
              onClick={() => {
                setSelectedClass(cls);
                setSearch("");
              }}
              className={cn(
                "flex flex-col items-start gap-1 p-4 border rounded-xl text-left transition-all duration-150",
                isSelected
                  ? "border-primary bg-primary/5 dark:bg-primary/10"
                  : "border-border hover:bg-muted",
              )}
            >
              <div
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-medium text-[11px]",
                  SUBJECT_COLORS[cls.subject] ??
                    "bg-muted text-muted-foreground",
                )}
              >
                {SUBJECT_ICONS[cls.subject]}
                {cls.subject}
              </div>
              <p
                className={cn(
                  "mt-1 font-semibold text-sm",
                  isSelected && "text-primary",
                )}
              >
                Grade {cls.grade} – {cls.section}
              </p>
              <div className="flex items-center gap-3 text-muted-foreground text-xs">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {enrolledIds.size} students
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {cls.room}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {selectedClass ? (
        <>
          {/* Search */}
          <div className="relative">
            <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />
            <Input
              placeholder="Search by name or roll number…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="gap-6 grid grid-cols-1 lg:grid-cols-2">
            {/* Enrolled students */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">Enrolled</CardTitle>
                    <Badge variant="secondary">{filteredEnrolled.length}</Badge>
                  </div>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="p-0">
                {filteredEnrolled.length === 0 ? (
                  <div className="flex flex-col justify-center items-center py-10 text-center">
                    <Users className="mb-2 w-8 h-8 text-muted-foreground/40" />
                    <p className="text-muted-foreground text-sm">
                      No students found
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y">
                    {filteredEnrolled.map((student) => (
                      <li
                        key={student.id}
                        className="flex items-center gap-3 hover:bg-muted/40 px-4 py-3 transition-colors"
                      >
                        <div className="flex justify-center items-center bg-primary/10 rounded-full w-8 h-8 font-semibold text-primary text-xs shrink-0">
                          {student.avatarInitials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {student.name}
                          </p>
                          <p className="font-mono text-muted-foreground text-xs">
                            {student.rollNumber}
                          </p>
                        </div>
                        <TooltipProvider delayDuration={300}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="hover:bg-destructive/10 w-7 h-7 text-muted-foreground hover:text-destructive"
                                onClick={() =>
                                  setConfirmDialog({
                                    student,
                                    action: "remove",
                                  })
                                }
                              >
                                <UserMinus className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Remove from roster</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* Available students */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">Available to Add</CardTitle>
                  <Badge variant="secondary">{filteredAvailable.length}</Badge>
                </div>
                <CardDescription className="text-xs">
                  Students not currently enrolled in this class.
                </CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="p-0">
                {filteredAvailable.length === 0 ? (
                  <div className="flex flex-col justify-center items-center py-10 text-center">
                    <CheckCircle2 className="mb-2 w-8 h-8 text-muted-foreground/40" />
                    <p className="text-muted-foreground text-sm">
                      All students enrolled
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y">
                    {filteredAvailable.map((student) => (
                      <li
                        key={student.id}
                        className="flex items-center gap-3 hover:bg-muted/40 px-4 py-3 transition-colors"
                      >
                        <div className="flex justify-center items-center bg-muted rounded-full w-8 h-8 font-semibold text-muted-foreground text-xs shrink-0">
                          {student.avatarInitials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {student.name}
                          </p>
                          <p className="font-mono text-muted-foreground text-xs">
                            {student.rollNumber}
                          </p>
                        </div>
                        <TooltipProvider delayDuration={300}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="hover:bg-emerald-50 dark:hover:bg-emerald-950 w-7 h-7 text-muted-foreground hover:text-emerald-600"
                                onClick={() =>
                                  setConfirmDialog({ student, action: "add" })
                                }
                              >
                                <UserPlus className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Add to roster</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <div className="flex flex-col justify-center items-center bg-muted/30 py-16 border border-dashed rounded-lg text-center">
          <Users className="mb-3 w-10 h-10 text-muted-foreground/40" />
          <p className="font-medium text-muted-foreground text-sm">
            Select a class above to manage its roster
          </p>
        </div>
      )}

      {/* Confirm dialog */}
      <Dialog
        open={!!confirmDialog}
        onOpenChange={() => setConfirmDialog(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {confirmDialog?.action === "add"
                ? "Add Student"
                : "Remove Student"}
            </DialogTitle>
            <DialogDescription>
              {confirmDialog?.action === "add"
                ? `Add ${confirmDialog?.student.name} to ${selectedClass?.label}?`
                : `Remove ${confirmDialog?.student.name} from ${selectedClass?.label}? Their grades and attendance records will not be deleted.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmDialog(null)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant={
                confirmDialog?.action === "remove" ? "destructive" : "default"
              }
              onClick={confirmAction}
            >
              {confirmDialog?.action === "add" ? "Add" : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Page Root ────────────────────────────────────────────────────────────────

export default function ClassesTimetablePage() {
  return (
    <div className="space-y-6 mx-auto p-6 max-w-6xl font-sans">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-2xl tracking-tight">
          Classes & Timetable
        </h1>
        <p className="text-muted-foreground text-sm">
          View your schedule, request changes, and manage class rosters.
        </p>
      </div>

      <Tabs defaultValue="timetable" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger
            value="timetable"
            className="flex items-center gap-1.5 text-xs sm:text-sm"
          >
            <CalendarDays className="w-3.5 h-3.5" />
            Timetable
          </TabsTrigger>
          <TabsTrigger
            value="request"
            className="flex items-center gap-1.5 text-xs sm:text-sm"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            Request Change
          </TabsTrigger>
          <TabsTrigger
            value="rosters"
            className="flex items-center gap-1.5 text-xs sm:text-sm"
          >
            <Users className="w-3.5 h-3.5" />
            Rosters
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timetable">
          <TimetableTab />
        </TabsContent>

        <TabsContent value="request">
          <RequestChangeTab />
        </TabsContent>

        <TabsContent value="rosters">
          <RostersTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
