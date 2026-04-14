"use client";

import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import {
  BookOpen,
  Search,
  GraduationCap,
  Building2,
  Hash,
  Users,
  UserPlus,
  UserMinus,
  ChevronDown,
  ChevronRight,
  Loader2,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  X,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useEnrollment } from "@/app/hooks/tasks/useEnrollment";
import { useAssignmentUI } from "@/context/tasks/task-context";
import { useSession } from "@/context/session-context";
import { formatDistanceToNow, format } from "date-fns";

// ─── Types ──────────────────────────────────────────────────────────────────

type EnrollmentUser = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
};

type EnrollmentRecord = {
  id: string;
  enrolledAt: string;
  user: EnrollmentUser;
};

type BrowseCourse = {
  id: string;
  name: string;
  code: string;
  description: string | null;
  enrolledCount: number;
  enrolledStudents: EnrollmentRecord[];
  teacher: EnrollmentUser;
  department?: { id: string; name: string; code: string } | null;
};

type Department = {
  id: string;
  name: string;
  code: string;
  courses: BrowseCourse[];
};

// Enrolled course shape from dashboard (simpler)
type EnrolledCourse = {
  id: string;
  title: string;
  code: string;
  createdAt: string;
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function initials(name: string | null | undefined) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ─── Enrolled Course Card ───────────────────────────────────────────────────

function EnrolledCourseCard({
  course,
  onUnenroll,
  unenrolling,
}: {
  course: EnrolledCourse;
  onUnenroll: (courseId: string) => void;
  unenrolling: boolean;
}) {
  const [confirming, setConfirming] = useState(false);

  // Color accent per course (deterministic from code)
  const accent = useMemo(() => {
    const accents = [
      { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400", dot: "bg-blue-400" },
      { bg: "bg-violet-500/10", border: "border-violet-500/20", text: "text-violet-400", dot: "bg-violet-400" },
      { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400", dot: "bg-emerald-400" },
      { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400", dot: "bg-amber-400" },
      { bg: "bg-rose-500/10", border: "border-rose-500/20", text: "text-rose-400", dot: "bg-rose-400" },
      { bg: "bg-cyan-500/10", border: "border-cyan-500/20", text: "text-cyan-400", dot: "bg-cyan-400" },
    ];
    const idx = course.code.charCodeAt(0) % accents.length;
    return accents[idx];
  }, [course.code]);

  return (
    <Card className="group relative border-white/10 bg-zinc-900/60 hover:border-white/20 hover:bg-zinc-900/80 transition-all duration-200 overflow-hidden">
      {/* Left accent stripe */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-0.5", accent.dot)} />

      <CardContent className="px-5 py-4 pl-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div
              className={cn(
                "flex-shrink-0 flex items-center justify-center rounded-lg size-9 border",
                accent.bg,
                accent.border,
              )}
            >
              <BookOpen className={cn("size-4", accent.text)} />
            </div>

            <div className="min-w-0">
              <p className="font-semibold text-sm leading-tight truncate">
                {course.title}
              </p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <Badge
                  variant="outline"
                  className="font-mono text-[10px] px-1.5 py-0 border-zinc-700 text-zinc-400"
                >
                  <Hash className="size-2.5 mr-0.5" />
                  {course.code}
                </Badge>
                {course.createdAt && (
                  <span className="text-[10px] text-zinc-500">
                    Since {format(new Date(course.createdAt), "MMM yyyy")}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Unenroll */}
          {confirming ? (
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-xs text-red-400">Leave?</span>
              <Button
                size="icon-sm"
                variant="destructive"
                className="size-6"
                disabled={unenrolling}
                onClick={() => {
                  onUnenroll(course.id);
                  setConfirming(false);
                }}
              >
                {unenrolling ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  <UserMinus className="size-3" />
                )}
              </Button>
              <Button
                size="icon-sm"
                variant="ghost"
                className="size-6"
                onClick={() => setConfirming(false)}
              >
                <X className="size-3" />
              </Button>
            </div>
          ) : (
            <Button
              size="icon-sm"
              variant="ghost"
              className="size-6 opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0"
              onClick={() => setConfirming(true)}
              title="Leave course"
            >
              <UserMinus className="size-3" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Browse Course Row ───────────────────────────────────────────────────────

function BrowseCourseRow({
  course,
  isEnrolled,
  onEnroll,
  onUnenroll,
  enrolling,
  unenrolling,
}: {
  course: BrowseCourse;
  isEnrolled: boolean;
  onEnroll: (courseId: string) => void;
  onUnenroll: (courseId: string) => void;
  enrolling: boolean;
  unenrolling: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b border-white/5 last:border-0">
      {/* Main row */}
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors">
        {/* Expand toggle */}
        <button
          className="flex-shrink-0 text-zinc-500 hover:text-zinc-300 transition-colors"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? (
            <ChevronDown className="size-3.5" />
          ) : (
            <ChevronRight className="size-3.5" />
          )}
        </button>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">{course.name}</span>
            <Badge
              variant="outline"
              className="font-mono text-[10px] px-1.5 py-0 border-zinc-700 text-zinc-500"
            >
              {course.code}
            </Badge>
            {isEnrolled && (
              <Badge className="text-[10px] px-1.5 py-0 bg-emerald-500/15 text-emerald-400 border-emerald-500/20 border">
                <CheckCircle2 className="size-2.5 mr-0.5" />
                Enrolled
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs text-zinc-500 flex items-center gap-1">
              <Users className="size-2.5" />
              {course.enrolledCount} student{course.enrolledCount !== 1 ? "s" : ""}
            </span>
            {course.teacher.name && (
              <span className="text-xs text-zinc-500 flex items-center gap-1">
                <GraduationCap className="size-2.5" />
                {course.teacher.name}
              </span>
            )}
          </div>
        </div>

        {/* Action */}
        {isEnrolled ? (
          <Button
            size="sm"
            variant="outline"
            className="flex-shrink-0 h-7 text-xs gap-1.5 border-zinc-700 text-zinc-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5"
            onClick={() => onUnenroll(course.id)}
            disabled={unenrolling}
          >
            {unenrolling ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <UserMinus className="size-3" />
            )}
            Leave
          </Button>
        ) : (
          <Button
            size="sm"
            className="flex-shrink-0 h-7 text-xs gap-1.5"
            onClick={() => onEnroll(course.id)}
            disabled={enrolling}
          >
            {enrolling ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <UserPlus className="size-3" />
            )}
            Enroll
          </Button>
        )}
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-10 pb-3 space-y-2">
          {course.description ? (
            <p className="text-xs text-zinc-400 leading-relaxed">
              {course.description}
            </p>
          ) : (
            <p className="text-xs text-zinc-600 italic">No description provided.</p>
          )}
          <div className="flex items-center gap-3 pt-1">
            <div className="flex items-center gap-1.5">
              <Avatar className="size-5">
                <AvatarImage src={course.teacher.image ?? undefined} />
                <AvatarFallback className="bg-zinc-800 text-zinc-400 text-[10px]">
                  {initials(course.teacher.name)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-zinc-400">
                {course.teacher.name ?? "Unknown teacher"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Department Section ──────────────────────────────────────────────────────

function DepartmentSection({
  dept,
  enrolledIds,
  onEnroll,
  onUnenroll,
  enrollingId,
  unenrollingId,
}: {
  dept: Department;
  enrolledIds: Set<string>;
  onEnroll: (courseId: string) => void;
  onUnenroll: (courseId: string) => void;
  enrollingId: string | null;
  unenrollingId: string | null;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const enrolledCount = dept.courses.filter((c) => enrolledIds.has(c.id)).length;

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden bg-zinc-900/40">
      {/* Dept header */}
      <button
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors"
        onClick={() => setCollapsed((v) => !v)}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center bg-zinc-800 border border-zinc-700 rounded-lg size-8">
            <Building2 className="size-3.5 text-zinc-400" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold">{dept.name}</p>
            <p className="text-[10px] text-zinc-500 font-mono">{dept.code}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {enrolledCount > 0 && (
            <Badge className="text-[10px] px-1.5 py-0 bg-emerald-500/15 text-emerald-400 border-emerald-500/20 border">
              {enrolledCount} enrolled
            </Badge>
          )}
          <span className="text-xs text-zinc-500">
            {dept.courses.length} course{dept.courses.length !== 1 ? "s" : ""}
          </span>
          {collapsed ? (
            <ChevronRight className="size-3.5 text-zinc-500" />
          ) : (
            <ChevronDown className="size-3.5 text-zinc-500" />
          )}
        </div>
      </button>

      {/* Course list */}
      {!collapsed && (
        <div className="border-t border-white/5">
          {dept.courses.map((course) => (
            <BrowseCourseRow
              key={course.id}
              course={course}
              isEnrolled={enrolledIds.has(course.id)}
              onEnroll={onEnroll}
              onUnenroll={onUnenroll}
              enrolling={enrollingId === course.id}
              unenrolling={unenrollingId === course.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function MyCoursesPage() {
  const { user } = useSession();
  const { dashboardData, dashboardLoading, fetchDashboardData } = useAssignmentUI();
  const {
    fetchDepartments,
    departments,
    departmentsLoading,
    departmentsError,
    enrollStudent,
    unenrollStudent,
  } = useEnrollment();

  const [browseSearch, setBrowseSearch] = useState("");
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [unenrollingId, setUnenrollingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("my-courses");

  // My enrolled courses from dashboard context (already fetched on mount by TaskUIProvider)
  const enrolledCourses: EnrolledCourse[] =
    dashboardData?.GetDashboardData?.courses ?? [];

  // Set of enrolled course IDs for O(1) lookup in browse view
  const enrolledIds = useMemo(
    () => new Set(enrolledCourses.map((c) => c.id)),
    [enrolledCourses],
  );

  // Fetch departments when browse tab is first opened
  useEffect(() => {
    if (activeTab === "browse" && departments.length === 0) {
      fetchDepartments();
    }
  }, [activeTab]);

  // Filter departments + courses by search
  const filteredDepts = useMemo((): Department[] => {
    if (!browseSearch.trim()) return departments as Department[];
    const q = browseSearch.toLowerCase();
    return (departments as Department[])
      .map((dept) => ({
        ...dept,
        courses: dept.courses.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.code.toLowerCase().includes(q) ||
            c.description?.toLowerCase().includes(q) ||
            c.teacher.name?.toLowerCase().includes(q),
        ),
      }))
      .filter((dept) => dept.courses.length > 0 || dept.name.toLowerCase().includes(q));
  }, [departments, browseSearch]);

  const handleEnroll = async (courseId: string) => {
    setEnrollingId(courseId);
    await enrollStudent(courseId); // no userId = self-enroll
    setEnrollingId(null);
    // Refresh dashboard data so "My Courses" tab updates
    fetchDashboardData();
  };

  const handleUnenroll = async (courseId: string) => {
    setUnenrollingId(courseId);
    await unenrollStudent(courseId); // no userId = self-unenroll
    setUnenrollingId(null);
    fetchDashboardData();
  };

  // Total available courses across all departments
  const totalAvailable = useMemo(
    () => (departments as Department[]).reduce((s, d) => s + d.courses.length, 0),
    [departments],
  );

  return (
    <div className="flex flex-col gap-6 p-5 w-full max-w-4xl mx-auto font-sans">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">My Courses</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {user?.name
              ? `Welcome back, ${user.name.split(" ")[0]}.`
              : "Your enrolled courses and course catalogue."}
          </p>
        </div>
      </div>

      {/* Stats strip — only when data is ready */}
      {!dashboardLoading && enrolledCourses.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5">
            <div className="flex items-center justify-center bg-blue-500/10 rounded-lg size-7">
              <BookOpen className="size-3.5 text-blue-400" />
            </div>
            <div>
              <span className="text-base font-bold leading-none">
                {enrolledCourses.length}
              </span>
              <span className="text-zinc-500 text-xs ml-1.5">
                {enrolledCourses.length === 1 ? "course" : "courses"} enrolled
              </span>
            </div>
          </div>

          {totalAvailable > 0 && (
            <div className="flex items-center gap-2 bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5">
              <div className="flex items-center justify-center bg-violet-500/10 rounded-lg size-7">
                <Sparkles className="size-3.5 text-violet-400" />
              </div>
              <div>
                <span className="text-base font-bold leading-none">
                  {totalAvailable - enrolledCourses.length}
                </span>
                <span className="text-zinc-500 text-xs ml-1.5">
                  available to join
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="bg-zinc-900 border border-white/10 p-1 h-auto">
          <TabsTrigger
            value="my-courses"
            className="text-xs px-4 py-1.5 data-[state=active]:bg-zinc-800"
          >
            <BookOpen className="size-3.5 mr-1.5" />
            My Courses
            {enrolledCourses.length > 0 && (
              <span className="ml-1.5 text-[10px] bg-zinc-700 rounded-full px-1.5 py-0.5 font-mono">
                {enrolledCourses.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="browse"
            className="text-xs px-4 py-1.5 data-[state=active]:bg-zinc-800"
          >
            <Search className="size-3.5 mr-1.5" />
            Browse Catalogue
          </TabsTrigger>
        </TabsList>

        {/* ── MY COURSES TAB ─────────────────────────────────────────── */}
        <TabsContent value="my-courses" className="mt-4">
          {dashboardLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card
                  key={i}
                  className="border-white/10 bg-zinc-900/60"
                >
                  <CardContent className="px-5 py-4">
                    <div className="flex items-start gap-3">
                      <Skeleton className="size-9 rounded-lg flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-44 rounded" />
                        <Skeleton className="h-3 w-24 rounded" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : enrolledCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
              <div className="flex items-center justify-center bg-zinc-800 border border-zinc-700 rounded-2xl size-16">
                <GraduationCap className="size-7 text-zinc-500" />
              </div>
              <div>
                <p className="font-medium text-sm">Not enrolled in any courses yet</p>
                <p className="text-muted-foreground text-xs mt-1 max-w-xs">
                  Browse the course catalogue and enroll in courses offered by
                  your institution.
                </p>
              </div>
              <Button
                size="sm"
                className="gap-1.5 text-xs"
                onClick={() => setActiveTab("browse")}
              >
                <Search className="size-3.5" />
                Browse Catalogue
              </Button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {enrolledCourses.map((course) => (
                <EnrolledCourseCard
                  key={course.id}
                  course={course}
                  onUnenroll={handleUnenroll}
                  unenrolling={unenrollingId === course.id}
                />
              ))}

              <div className="pt-2">
                <Separator className="mb-3 bg-white/5" />
                <p className="text-center text-xs text-zinc-600">
                  Want to explore more?{" "}
                  <button
                    className="text-zinc-400 hover:text-zinc-200 underline-offset-2 hover:underline transition-colors"
                    onClick={() => setActiveTab("browse")}
                  >
                    Browse all courses
                  </button>
                </p>
              </div>
            </div>
          )}
        </TabsContent>

        {/* ── BROWSE TAB ─────────────────────────────────────────────── */}
        <TabsContent value="browse" className="mt-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search courses, teachers, departments…"
              className="pl-9 bg-zinc-900 border-white/10"
              value={browseSearch}
              onChange={(e) => setBrowseSearch(e.target.value)}
            />
            {browseSearch && (
              <Button
                variant="ghost"
                size="icon-sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 size-6"
                onClick={() => setBrowseSearch("")}
              >
                <X className="size-3.5" />
              </Button>
            )}
          </div>

          {/* Results summary */}
          {browseSearch && !departmentsLoading && (
            <p className="text-xs text-zinc-500 px-0.5">
              {filteredDepts.reduce((s, d) => s + d.courses.length, 0)} result
              {filteredDepts.reduce((s, d) => s + d.courses.length, 0) !== 1
                ? "s"
                : ""}{" "}
              for "{browseSearch}"
            </p>
          )}

          {/* Content */}
          {departmentsError ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <AlertCircle className="size-8 text-red-400" />
              <div>
                <p className="text-sm font-medium">Failed to load catalogue</p>
                <p className="text-muted-foreground text-xs mt-1">
                  {departmentsError.message}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => fetchDepartments()}
                className="gap-1.5"
              >
                <RefreshCw className="size-3.5" />
                Try again
              </Button>
            </div>
          ) : departmentsLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="border border-white/10 rounded-xl bg-zinc-900/40 overflow-hidden"
                >
                  <div className="flex items-center gap-3 px-4 py-3">
                    <Skeleton className="size-8 rounded-lg" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-36 rounded" />
                      <Skeleton className="h-2.5 w-16 rounded" />
                    </div>
                  </div>
                  <Separator className="bg-white/5" />
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="flex items-center gap-3 px-4 py-3 border-b border-white/5 last:border-0">
                      <Skeleton className="size-3.5 rounded" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-3.5 w-40 rounded" />
                        <Skeleton className="h-2.5 w-24 rounded" />
                      </div>
                      <Skeleton className="h-7 w-16 rounded" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : filteredDepts.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <SlidersHorizontal className="size-8 text-zinc-600" />
              <div>
                <p className="font-medium text-sm">
                  {browseSearch
                    ? "No courses match your search"
                    : "No courses available"}
                </p>
                <p className="text-muted-foreground text-xs mt-1">
                  {browseSearch
                    ? "Try a different search term."
                    : "Check back later for available courses."}
                </p>
              </div>
              {browseSearch && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setBrowseSearch("")}
                  className="gap-1.5 text-xs"
                >
                  <X className="size-3.5" />
                  Clear search
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDepts.map((dept) => (
                <DepartmentSection
                  key={dept.id}
                  dept={dept}
                  enrolledIds={enrolledIds}
                  onEnroll={handleEnroll}
                  onUnenroll={handleUnenroll}
                  enrollingId={enrollingId}
                  unenrollingId={unenrollingId}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
