"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  CalendarDays,
  Users,
  MapPin,
  Clock,
  BookOpen,
  FlaskConical,
  Music,
  Dumbbell,
  Globe,
  Calculator,
  Mail,
  Search,
  GraduationCap,
  Star,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

// ─── Types ────────────────────────────────────────────────────────────────────

type Day = "Mon" | "Tue" | "Wed" | "Thu" | "Fri";

interface TimetableSlot {
  id: string;
  day: Day;
  period: number;
  startTime: string;
  endTime: string;
  subject: string;
  teacher: string;
  room: string;
}

interface ClassmateProfile {
  id: string;
  name: string;
  rollNumber: string;
  avatarInitials: string;
  avatarColor: string;
  isClassRep?: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const STUDENT_CLASS = "Grade 10 – A";
const STUDENT_SECTION = "Section A";

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

const MOCK_TIMETABLE: TimetableSlot[] = [
  {
    id: "t1",
    day: "Mon",
    period: 1,
    startTime: "08:00",
    endTime: "08:45",
    subject: "Mathematics",
    teacher: "Ms. Kavitha Rao",
    room: "Room 201",
  },
  {
    id: "t2",
    day: "Mon",
    period: 3,
    startTime: "09:40",
    endTime: "10:25",
    subject: "English",
    teacher: "Ms. Anita Desai",
    room: "Room 105",
  },
  {
    id: "t3",
    day: "Mon",
    period: 5,
    startTime: "11:30",
    endTime: "12:15",
    subject: "Science",
    teacher: "Mr. Suresh Pillai",
    room: "Lab 2",
  },
  {
    id: "t4",
    day: "Mon",
    period: 7,
    startTime: "13:50",
    endTime: "14:35",
    subject: "History",
    teacher: "Mr. Ravi Shankar",
    room: "Room 108",
  },
  {
    id: "t5",
    day: "Tue",
    period: 2,
    startTime: "08:50",
    endTime: "09:35",
    subject: "Mathematics",
    teacher: "Ms. Kavitha Rao",
    room: "Room 201",
  },
  {
    id: "t6",
    day: "Tue",
    period: 4,
    startTime: "10:40",
    endTime: "11:25",
    subject: "PE",
    teacher: "Mr. Arjun Menon",
    room: "Gym",
  },
  {
    id: "t7",
    day: "Tue",
    period: 6,
    startTime: "13:00",
    endTime: "13:45",
    subject: "English",
    teacher: "Ms. Anita Desai",
    room: "Room 105",
  },
  {
    id: "t8",
    day: "Tue",
    period: 8,
    startTime: "14:40",
    endTime: "15:25",
    subject: "Science",
    teacher: "Mr. Suresh Pillai",
    room: "Lab 2",
  },
  {
    id: "t9",
    day: "Wed",
    period: 1,
    startTime: "08:00",
    endTime: "08:45",
    subject: "History",
    teacher: "Mr. Ravi Shankar",
    room: "Room 108",
  },
  {
    id: "t10",
    day: "Wed",
    period: 3,
    startTime: "09:40",
    endTime: "10:25",
    subject: "Mathematics",
    teacher: "Ms. Kavitha Rao",
    room: "Room 201",
  },
  {
    id: "t11",
    day: "Wed",
    period: 6,
    startTime: "13:00",
    endTime: "13:45",
    subject: "Music",
    teacher: "Ms. Preethi Nair",
    room: "Music Rm",
  },
  {
    id: "t12",
    day: "Thu",
    period: 2,
    startTime: "08:50",
    endTime: "09:35",
    subject: "Science",
    teacher: "Mr. Suresh Pillai",
    room: "Lab 2",
  },
  {
    id: "t13",
    day: "Thu",
    period: 4,
    startTime: "10:40",
    endTime: "11:25",
    subject: "English",
    teacher: "Ms. Anita Desai",
    room: "Room 105",
  },
  {
    id: "t14",
    day: "Thu",
    period: 7,
    startTime: "13:50",
    endTime: "14:35",
    subject: "Mathematics",
    teacher: "Ms. Kavitha Rao",
    room: "Room 201",
  },
  {
    id: "t15",
    day: "Fri",
    period: 1,
    startTime: "08:00",
    endTime: "08:45",
    subject: "PE",
    teacher: "Mr. Arjun Menon",
    room: "Gym",
  },
  {
    id: "t16",
    day: "Fri",
    period: 3,
    startTime: "09:40",
    endTime: "10:25",
    subject: "History",
    teacher: "Mr. Ravi Shankar",
    room: "Room 108",
  },
  {
    id: "t17",
    day: "Fri",
    period: 5,
    startTime: "11:30",
    endTime: "12:15",
    subject: "Mathematics",
    teacher: "Ms. Kavitha Rao",
    room: "Room 201",
  },
  {
    id: "t18",
    day: "Fri",
    period: 7,
    startTime: "13:50",
    endTime: "14:35",
    subject: "English",
    teacher: "Ms. Anita Desai",
    room: "Room 105",
  },
];

const AVATAR_COLORS = [
  "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
  "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
];

const MOCK_CLASSMATES: ClassmateProfile[] = [
  {
    id: "s1",
    name: "Aarav Sharma",
    rollNumber: "10A-01",
    avatarInitials: "AS",
    avatarColor: AVATAR_COLORS[0],
    isClassRep: true,
  },
  {
    id: "s2",
    name: "Priya Patel",
    rollNumber: "10A-02",
    avatarInitials: "PP",
    avatarColor: AVATAR_COLORS[1],
  },
  {
    id: "s3",
    name: "Rohan Mehta",
    rollNumber: "10A-03",
    avatarInitials: "RM",
    avatarColor: AVATAR_COLORS[2],
  },
  {
    id: "s4",
    name: "Sneha Iyer",
    rollNumber: "10A-04",
    avatarInitials: "SI",
    avatarColor: AVATAR_COLORS[3],
  },
  {
    id: "s5",
    name: "Vikram Nair",
    rollNumber: "10A-05",
    avatarInitials: "VN",
    avatarColor: AVATAR_COLORS[4],
  },
  {
    id: "s6",
    name: "Ananya Reddy",
    rollNumber: "10A-06",
    avatarInitials: "AR",
    avatarColor: AVATAR_COLORS[5],
  },
  {
    id: "s7",
    name: "Karan Gupta",
    rollNumber: "10A-07",
    avatarInitials: "KG",
    avatarColor: AVATAR_COLORS[6],
  },
  {
    id: "s8",
    name: "Divya Krishnan",
    rollNumber: "10A-08",
    avatarInitials: "DK",
    avatarColor: AVATAR_COLORS[7],
  },
  {
    id: "s9",
    name: "Arjun Singh",
    rollNumber: "10A-09",
    avatarInitials: "AS",
    avatarColor: AVATAR_COLORS[0],
  },
  {
    id: "s10",
    name: "Meera Joshi",
    rollNumber: "10A-10",
    avatarInitials: "MJ",
    avatarColor: AVATAR_COLORS[1],
  },
  {
    id: "s11",
    name: "Nikhil Kumar",
    rollNumber: "10A-11",
    avatarInitials: "NK",
    avatarColor: AVATAR_COLORS[2],
  },
  {
    id: "s12",
    name: "Pooja Verma",
    rollNumber: "10A-12",
    avatarInitials: "PV",
    avatarColor: AVATAR_COLORS[3],
  },
  {
    id: "s13",
    name: "Rahul Das",
    rollNumber: "10A-13",
    avatarInitials: "RD",
    avatarColor: AVATAR_COLORS[4],
  },
  {
    id: "s14",
    name: "Shreya Bose",
    rollNumber: "10A-14",
    avatarInitials: "SB",
    avatarColor: AVATAR_COLORS[5],
  },
  {
    id: "s15",
    name: "Aditya Rao",
    rollNumber: "10A-15",
    avatarInitials: "AR",
    avatarColor: AVATAR_COLORS[6],
  },
  {
    id: "s16",
    name: "Bhavna Pillai",
    rollNumber: "10A-16",
    avatarInitials: "BP",
    avatarColor: AVATAR_COLORS[7],
  },
  {
    id: "s17",
    name: "Chirag Malhotra",
    rollNumber: "10A-17",
    avatarInitials: "CM",
    avatarColor: AVATAR_COLORS[0],
  },
  {
    id: "s18",
    name: "Deepika Nanda",
    rollNumber: "10A-18",
    avatarInitials: "DN",
    avatarColor: AVATAR_COLORS[1],
  },
  {
    id: "s19",
    name: "Esha Tiwari",
    rollNumber: "10A-19",
    avatarInitials: "ET",
    avatarColor: AVATAR_COLORS[2],
  },
  {
    id: "s20",
    name: "Farhan Khan",
    rollNumber: "10A-20",
    avatarInitials: "FK",
    avatarColor: AVATAR_COLORS[3],
  },
];

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

function getToday(): Day {
  const map: Record<number, Day> = {
    1: "Mon",
    2: "Tue",
    3: "Wed",
    4: "Thu",
    5: "Fri",
  };
  return map[new Date().getDay()] ?? "Mon";
}

// ─── TAB 1: Timetable ─────────────────────────────────────────────────────────

function TimetableTab() {
  const today = getToday();
  const [activeDay, setActiveDay] = React.useState<Day>(today);
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

  // Unique subjects summary
  const subjectSummary = React.useMemo(() => {
    const map: Record<string, number> = {};
    MOCK_TIMETABLE.forEach((s) => {
      map[s.subject] = (map[s.subject] ?? 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, []);

  // Today's slots in order
  const todaySlots = MOCK_TIMETABLE.filter((s) => s.day === activeDay).sort(
    (a, b) => a.period - b.period,
  );

  const totalPeriodsToday = todaySlots.length;

  return (
    <div className="space-y-6 font-sans">
      {/* Subject legend */}
      <div className="flex flex-wrap gap-2">
        {subjectSummary.map(([subject, count]) => {
          const cfg = getSubjectCfg(subject);
          return (
            <span
              key={subject}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 border rounded-full font-medium text-xs",
                cfg.color,
              )}
            >
              {cfg.icon}
              {subject}
              <span className="opacity-60">· {count}/wk</span>
            </span>
          );
        })}
      </div>

      {/* Day switcher */}
      <div className="flex gap-1.5 pb-1 overflow-x-auto scrollbar-hide">
        {DAYS.map((day) => {
          const hasClass = MOCK_TIMETABLE.some((s) => s.day === day);
          const isToday = day === today;
          const isActive = day === activeDay;
          const daySlots = MOCK_TIMETABLE.filter((s) => s.day === day);
          return (
            <button
              key={day}
              type="button"
              onClick={() => setActiveDay(day)}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2.5 border rounded-xl min-w-[72px] transition-all duration-150 shrink-0",
                isActive
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card hover:bg-muted text-muted-foreground",
              )}
            >
              <span className="font-semibold text-xs">{day}</span>
              <span className={cn("text-[10px]", isActive ? "opacity-80" : "")}>
                {daySlots.length} {daySlots.length === 1 ? "class" : "classes"}
              </span>
              {isToday && !isActive && (
                <span className="bg-primary rounded-full w-1 h-1" />
              )}
            </button>
          );
        })}
      </div>

      {/* Day header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-base">
            {DAY_FULL[activeDay]}
            {activeDay === today && (
              <Badge variant="secondary" className="ml-2 text-xs">
                Today
              </Badge>
            )}
          </h2>
          <p className="mt-0.5 text-muted-foreground text-xs">
            {totalPeriodsToday} period{totalPeriodsToday !== 1 ? "s" : ""}{" "}
            scheduled
          </p>
        </div>
      </div>

      {/* Period timeline */}
      {totalPeriodsToday === 0 ? (
        <div className="flex flex-col justify-center items-center bg-muted/30 py-14 border border-dashed rounded-xl text-center">
          <CalendarDays className="mb-3 w-10 h-10 text-muted-foreground/40" />
          <p className="font-medium text-muted-foreground text-sm">
            No classes on {DAY_FULL[activeDay]}
          </p>
        </div>
      ) : (
        <div className="space-y-0">
          {PERIODS.map((p) => {
            const slot = slotMap[`${activeDay}-${p.period}`];

            // Break indicators
            const isShortBreak = p.period === 4;
            const isLunch = p.period === 6;

            return (
              <React.Fragment key={p.period}>
                {isShortBreak && (
                  <div className="flex items-center gap-3 px-1 py-2">
                    <div className="flex-1 bg-border h-px" />
                    <span className="font-medium text-[10px] text-muted-foreground uppercase tracking-wider shrink-0">
                      Short Break · 10:25–10:40
                    </span>
                    <div className="flex-1 bg-border h-px" />
                  </div>
                )}
                {isLunch && (
                  <div className="flex items-center gap-3 px-1 py-2">
                    <div className="flex-1 bg-border h-px" />
                    <span className="font-medium text-[10px] text-muted-foreground uppercase tracking-wider shrink-0">
                      Lunch · 12:15–13:00
                    </span>
                    <div className="flex-1 bg-border h-px" />
                  </div>
                )}

                <div className="group flex gap-4 py-1.5">
                  {/* Time column */}
                  <div className="pt-3 w-[80px] text-right shrink-0">
                    <p className="font-semibold text-[11px] text-muted-foreground">
                      P{p.period}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60">
                      {p.startTime}
                    </p>
                  </div>

                  {/* Slot card or empty */}
                  <div className="flex-1 pb-2">
                    {slot ? (
                      <button
                        type="button"
                        onClick={() => setDetailSlot(slot)}
                        className={cn(
                          "hover:shadow-md px-4 py-3 border rounded-xl w-full text-left hover:scale-[1.01] active:scale-100 transition-all duration-150",
                          getSubjectCfg(slot.subject).color,
                        )}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              {getSubjectCfg(slot.subject).icon}
                              <span className="font-semibold text-sm">
                                {slot.subject}
                              </span>
                            </div>
                            <p className="opacity-75 text-xs">{slot.teacher}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="flex justify-end items-center gap-1 opacity-80 font-medium text-xs">
                              <MapPin className="w-2.5 h-2.5" />
                              {slot.room}
                            </p>
                            <p className="opacity-60 mt-0.5 text-[10px]">
                              {slot.startTime}–{slot.endTime}
                            </p>
                          </div>
                        </div>
                      </button>
                    ) : (
                      <div className="border border-border/30 border-dashed rounded-xl h-12" />
                    )}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* Slot detail dialog */}
      <Dialog open={!!detailSlot} onOpenChange={() => setDetailSlot(null)}>
        <DialogContent className="max-w-sm">
          {detailSlot && (
            <>
              <DialogHeader>
                <div
                  className={cn(
                    "inline-flex items-center gap-1.5 mb-2 px-3 py-1.5 border rounded-lg w-fit font-medium text-xs",
                    getSubjectCfg(detailSlot.subject).color,
                  )}
                >
                  {getSubjectCfg(detailSlot.subject).icon}
                  {detailSlot.subject}
                </div>
                <DialogTitle>
                  {DAY_FULL[detailSlot.day]} · Period {detailSlot.period}
                </DialogTitle>
                <DialogDescription>
                  {detailSlot.startTime} – {detailSlot.endTime}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <GraduationCap className="w-4 h-4 shrink-0" />
                  <span>{detailSlot.teacher}</span>
                </div>
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>{detailSlot.room}</span>
                </div>
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>
                    {detailSlot.startTime} – {detailSlot.endTime} (45 min)
                  </span>
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

// ─── TAB 2: Class Roster ──────────────────────────────────────────────────────

function RosterTab() {
  const [search, setSearch] = React.useState("");

  const filtered = MOCK_CLASSMATES.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(search.toLowerCase()),
  );

  const classRep = MOCK_CLASSMATES.find((s) => s.isClassRep);

  return (
    <div className="space-y-5">
      {/* Class info banner */}
      <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-4 bg-card p-4 border rounded-xl">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-3 rounded-xl">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-sm">{STUDENT_CLASS}</p>
            <p className="text-muted-foreground text-xs">
              {STUDENT_SECTION} · {MOCK_CLASSMATES.length} students
            </p>
          </div>
        </div>

        {classRep && (
          <div className="flex items-center gap-2.5 bg-amber-50 dark:bg-amber-950/30 px-3 py-2 border border-amber-200 dark:border-amber-800 rounded-lg">
            <Star className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <div>
              <p className="text-[11px] text-muted-foreground">
                Class Representative
              </p>
              <p className="font-semibold text-xs">{classRep.name}</p>
            </div>
          </div>
        )}
      </div>

      {/* Avatar cluster — top 8 */}
      <div className="flex flex-wrap items-center gap-1">
        {MOCK_CLASSMATES.slice(0, 10).map((s, i) => (
          <TooltipProvider key={s.id} delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "flex justify-center items-center border-2 border-background rounded-full w-9 h-9 font-semibold text-xs cursor-default shrink-0",
                    s.avatarColor,
                  )}
                  style={{ marginLeft: i > 0 ? "-6px" : 0, zIndex: 10 - i }}
                >
                  {s.avatarInitials}
                </div>
              </TooltipTrigger>
              <TooltipContent>{s.name}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
        {MOCK_CLASSMATES.length > 10 && (
          <div
            className="flex justify-center items-center bg-muted border-2 border-background rounded-full w-9 h-9 font-semibold text-muted-foreground text-xs shrink-0"
            style={{ marginLeft: "-6px", zIndex: 0 }}
          >
            +{MOCK_CLASSMATES.length - 10}
          </div>
        )}
        <p className="ml-3 text-muted-foreground text-xs">
          {MOCK_CLASSMATES.length} students enrolled
        </p>
      </div>

      <Separator />

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

      {/* Roster list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col justify-center items-center bg-muted/30 py-12 border border-dashed rounded-xl text-center">
          <Users className="mb-2 w-8 h-8 text-muted-foreground/40" />
          <p className="text-muted-foreground text-sm">
            No students match your search
          </p>
        </div>
      ) : (
        <div className="gap-2 grid grid-cols-1 sm:grid-cols-2">
          {filtered.map((student) => (
            <div
              key={student.id}
              className="flex items-center gap-3 bg-card hover:bg-muted/40 px-4 py-3 border rounded-xl transition-colors"
            >
              <div
                className={cn(
                  "flex justify-center items-center rounded-full w-9 h-9 font-semibold text-xs shrink-0",
                  student.avatarColor,
                )}
              >
                {student.avatarInitials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-medium text-sm truncate">{student.name}</p>
                  {student.isClassRep && (
                    <Star className="w-3 h-3 text-amber-500 shrink-0" />
                  )}
                </div>
                <p className="font-mono text-muted-foreground text-xs">
                  {student.rollNumber}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {filtered.length > 0 && (
        <p className="text-muted-foreground text-xs text-center">
          Showing {filtered.length} of {MOCK_CLASSMATES.length} students
        </p>
      )}
    </div>
  );
}

// ─── Page Root ────────────────────────────────────────────────────────────────

export default function StudentClassesPage() {
  return (
    <div className="space-y-6 mx-auto p-6 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-2xl tracking-tight">
          Classes & Timetable
        </h1>
        <p className="text-muted-foreground text-sm">
          Your weekly schedule and classmates for {STUDENT_CLASS}.
        </p>
      </div>

      <Tabs defaultValue="timetable" className="space-y-6">
        <TabsList className="grid grid-cols-2 w-full max-w-xs">
          <TabsTrigger
            value="timetable"
            className="flex items-center gap-1.5 text-sm"
          >
            <CalendarDays className="w-3.5 h-3.5" />
            Timetable
          </TabsTrigger>
          <TabsTrigger
            value="roster"
            className="flex items-center gap-1.5 text-sm"
          >
            <Users className="w-3.5 h-3.5" />
            Class Roster
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timetable">
          <TimetableTab />
        </TabsContent>

        <TabsContent value="roster">
          <RosterTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
