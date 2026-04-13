"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  BookOpen,
  Users,
  UserPlus,
  UserMinus,
  ChevronDown,
  ChevronRight,
  Search,
  GraduationCap,
  Building2,
  Hash,
  Calendar,
  MoreHorizontal,
  X,
  Check,
  Loader2,
  AlertCircle,
  RefreshCw,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useEnrollment } from "@/app/hooks/tasks/useEnrollment";
import { useCourseStudents } from "@/app/hooks/tasks/useCourseStudents";
import { useSession } from "@/context/session-context";
import { format } from "date-fns";

// ─── Types ─────────────────────────────────────────────────────────────────

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

type Course = {
  id: string;
  name: string;
  code: string;
  description: string | null;
  enrolledCount: number;
  enrolledStudents: EnrollmentRecord[];
  teacher: EnrollmentUser;
  department?: { id: string; name: string; code: string } | null;
};

// ─── Helpers ───────────────────────────────────────────────────────────────

function initials(name: string | null | undefined) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ─── Enroll Dialog ─────────────────────────────────────────────────────────

function EnrollDialog({
  course,
  open,
  onClose,
}: {
  course: Course;
  open: boolean;
  onClose: () => void;
}) {
  const [userId, setUserId] = useState("");
  const { enrollStudent, enrolling } = useEnrollment();

  const handleEnroll = async () => {
    if (!userId.trim()) return;
    await enrollStudent(course.id, userId.trim());
    setUserId("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="size-4 text-blue-400" />
            Enroll a Student
          </DialogTitle>
          <DialogDescription>
            Add a student to{" "}
            <span className="font-semibold text-foreground">{course.name}</span>{" "}
            by entering their user ID.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <label className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
              Student User ID
            </label>
            <Input
              placeholder="e.g. clxxxxxxxxxxxxx"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleEnroll()}
              className="font-mono text-sm"
            />
            <p className="text-muted-foreground text-xs">
              Students can find their ID in their account settings.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={enrolling}>
            Cancel
          </Button>
          <Button
            onClick={handleEnroll}
            disabled={!userId.trim() || enrolling}
            className="gap-2"
          >
            {enrolling ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Check className="size-3.5" />
            )}
            Enroll Student
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Student Row ────────────────────────────────────────────────────────────

function StudentRow({
  record,
  courseId,
  onUnenroll,
}: {
  record: EnrollmentRecord;
  courseId: string;
  onUnenroll: (courseId: string, userId: string) => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleRemove = async () => {
    setRemoving(true);
    await onUnenroll(courseId, record.user.id);
    setRemoving(false);
    setConfirming(false);
  };

  return (
    <div className="flex justify-between items-center hover:bg-white/[0.03] px-4 py-2.5 border-b border-white/5 last:border-0 transition-colors group">
      <div className="flex items-center gap-3">
        <Avatar className="size-7">
          <AvatarImage src={record.user.image ?? undefined} />
          <AvatarFallback className="bg-zinc-800 text-zinc-300 text-xs">
            {initials(record.user.name)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <p className="font-medium text-sm leading-tight truncate">
            {record.user.name ?? "Unnamed student"}
          </p>
          <p className="text-muted-foreground text-xs truncate">
            {record.user.email ?? "—"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-muted-foreground text-xs hidden group-hover:inline">
          Enrolled {format(new Date(record.enrolledAt), "d MMM yyyy")}
        </span>

        {confirming ? (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-red-400">Remove?</span>
            <Button
              size="icon-sm"
              variant="destructive"
              className="size-6"
              disabled={removing}
              onClick={handleRemove}
            >
              {removing ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <Check className="size-3" />
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
            className="size-6 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-opacity"
            onClick={() => setConfirming(true)}
          >
            <UserMinus className="size-3" />
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Course Card ────────────────────────────────────────────────────────────

function CourseCard({ course }: { course: Course }) {
  const [expanded, setExpanded] = useState(false);
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { unenrollStudent } = useEnrollment();
  const { fetchStudents, students: liveStudents, loading: enrolledStudentsLoading } =
    useCourseStudents(course.id);

  // Fetch enrolled students when expanding for the first time
  useEffect(() => {
    if (expanded) {
      fetchStudents();
    }
  }, [expanded]);

  // Use live data when available, fall back to snapshot from course list
  const students: EnrollmentRecord[] =
    expanded && liveStudents.length > 0 ? liveStudents : course.enrolledStudents;

  const filtered = students.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.user.name?.toLowerCase().includes(q) ||
      r.user.email?.toLowerCase().includes(q)
    );
  });

  const handleUnenroll = async (courseId: string, userId: string) => {
    await unenrollStudent(courseId, userId);
    // Refetch after unenroll
    fetchStudents();
  };

  return (
    <>
      <Card className="border-white/10 bg-zinc-900/60 overflow-hidden">
        {/* Course Header */}
        <CardHeader className="px-5 py-4 pb-3">
          <div className="flex justify-between items-start gap-4">
            <div className="flex items-start gap-3 min-w-0">
              {/* Accent block */}
              <div className="flex-shrink-0 flex items-center justify-center bg-blue-500/10 border border-blue-500/20 rounded-lg size-10">
                <BookOpen className="size-4 text-blue-400" />
              </div>

              <div className="min-w-0">
                <CardTitle className="text-base font-semibold leading-tight truncate">
                  {course.name}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge
                    variant="outline"
                    className="font-mono text-[10px] px-1.5 py-0 border-zinc-700 text-zinc-400"
                  >
                    <Hash className="size-2.5 mr-0.5" />
                    {course.code}
                  </Badge>
                  {course.department && (
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 border-zinc-700 text-zinc-400"
                    >
                      <Building2 className="size-2.5 mr-0.5" />
                      {course.department.name}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Student count pill */}
              <div className="flex items-center gap-1.5 bg-zinc-800 rounded-full px-3 py-1">
                <Users className="size-3.5 text-zinc-400" />
                <span className="text-xs font-medium text-zinc-300">
                  {course.enrolledCount}
                </span>
                <span className="text-xs text-zinc-500">students</span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm" className="size-7">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem
                    onClick={() => setEnrollDialogOpen(true)}
                    className="gap-2"
                  >
                    <UserPlus className="size-3.5" />
                    Enroll student
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2">
                    <BookOpen className="size-3.5" />
                    View assignments
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="icon-sm"
                className="size-7"
                onClick={() => setExpanded((v) => !v)}
              >
                {expanded ? (
                  <ChevronDown className="size-4" />
                ) : (
                  <ChevronRight className="size-4" />
                )}
              </Button>
            </div>
          </div>

          {course.description && (
            <CardDescription className="text-xs mt-2 line-clamp-2">
              {course.description}
            </CardDescription>
          )}
        </CardHeader>

        {/* Expanded student list */}
        {expanded && (
          <CardContent className="px-0 pt-0 pb-0">
            <div className="border-t border-white/5">
              {/* Search + enroll bar */}
              <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search students…"
                    className="pl-8 h-8 text-sm bg-zinc-800 border-zinc-700"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Button
                  size="sm"
                  className="h-8 gap-1.5 text-xs"
                  onClick={() => setEnrollDialogOpen(true)}
                >
                  <UserPlus className="size-3.5" />
                  Enroll
                </Button>
              </div>

              {/* Student rows */}
              {enrolledStudentsLoading ? (
                <div className="space-y-0 divide-y divide-white/5">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-4 py-2.5"
                    >
                      <Skeleton className="size-7 rounded-full" />
                      <div className="space-y-1.5">
                        <Skeleton className="h-3 w-28 rounded" />
                        <Skeleton className="h-2.5 w-40 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                  <GraduationCap className="size-8 text-zinc-600" />
                  <p className="text-sm text-zinc-500">
                    {search
                      ? "No students match your search."
                      : "No students enrolled yet."}
                  </p>
                  {!search && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-1 gap-1.5 text-xs"
                      onClick={() => setEnrollDialogOpen(true)}
                    >
                      <UserPlus className="size-3.5" />
                      Enroll first student
                    </Button>
                  )}
                </div>
              ) : (
                <div>
                  {filtered.map((record) => (
                    <StudentRow
                      key={record.id}
                      record={record}
                      courseId={course.id}
                      onUnenroll={handleUnenroll}
                    />
                  ))}
                </div>
              )}

              {/* Footer */}
              {filtered.length > 0 && (
                <div className="flex items-center justify-between px-5 py-2 border-t border-white/5 bg-zinc-950/30">
                  <span className="text-muted-foreground text-xs">
                    {filtered.length}{" "}
                    {filtered.length === 1 ? "student" : "students"}
                    {search && " matching"}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      <EnrollDialog
        course={course}
        open={enrollDialogOpen}
        onClose={() => setEnrollDialogOpen(false)}
      />
    </>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function CourseManagementPage() {
  const { user, loading: sessionLoading } = useSession();
  const {
    fetchTeacherCourses,
    teacherCourses,
    teacherCoursesLoading,
    teacherCoursesError,
  } = useEnrollment();

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTeacherCourses();
  }, []);

  const filtered: Course[] = (teacherCourses as Course[]).filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q) ||
      c.department?.name.toLowerCase().includes(q)
    );
  });

  const totalStudents = (teacherCourses as Course[]).reduce(
    (sum, c) => sum + c.enrolledCount,
    0,
  );

  if (sessionLoading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (user?.role === "student") {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 p-8 text-center">
        <AlertCircle className="size-10 text-zinc-600" />
        <p className="text-sm text-muted-foreground">
          This page is only available to teachers and admins.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-5 w-full max-w-4xl mx-auto font-sans">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Course Management
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Manage your courses and enrolled students
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={() => fetchTeacherCourses()}
          disabled={teacherCoursesLoading}
        >
          <RefreshCw
            className={cn("size-3.5", teacherCoursesLoading && "animate-spin")}
          />
          Refresh
        </Button>
      </div>

      {/* Stats row */}
      {!teacherCoursesLoading && teacherCourses.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-3 bg-zinc-900 border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-center bg-blue-500/10 rounded-lg size-9">
              <BookOpen className="size-4 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold leading-none">
                {teacherCourses.length}
              </p>
              <p className="text-muted-foreground text-xs mt-0.5">
                {teacherCourses.length === 1 ? "Course" : "Courses"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-zinc-900 border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-center bg-emerald-500/10 rounded-lg size-9">
              <Users className="size-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold leading-none">{totalStudents}</p>
              <p className="text-muted-foreground text-xs mt-0.5">
                Total students
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-zinc-900 border border-white/10 rounded-xl p-4 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-center bg-violet-500/10 rounded-lg size-9">
              <GraduationCap className="size-4 text-violet-400" />
            </div>
            <div>
              <p className="text-2xl font-bold leading-none">
                {teacherCourses.length > 0
                  ? Math.round(totalStudents / teacherCourses.length)
                  : 0}
              </p>
              <p className="text-muted-foreground text-xs mt-0.5">
                Avg. per course
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      {teacherCourses.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search courses, codes, departments…"
            className="pl-9 bg-zinc-900 border-white/10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 size-6"
              onClick={() => setSearch("")}
            >
              <X className="size-3.5" />
            </Button>
          )}
        </div>
      )}

      {/* Content */}
      {teacherCoursesError ? (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          <AlertCircle className="size-8 text-red-400" />
          <div>
            <p className="text-sm font-medium">Failed to load courses</p>
            <p className="text-muted-foreground text-xs mt-1">
              {teacherCoursesError.message}
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => fetchTeacherCourses()}
            className="gap-1.5"
          >
            <RefreshCw className="size-3.5" />
            Try again
          </Button>
        </div>
      ) : teacherCoursesLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-white/10 bg-zinc-900/60">
              <CardHeader className="px-5 py-4">
                <div className="flex items-start gap-3">
                  <Skeleton className="size-10 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48 rounded" />
                    <Skeleton className="h-3 w-32 rounded" />
                  </div>
                  <Skeleton className="h-7 w-24 rounded-full" />
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="flex items-center justify-center bg-zinc-800 rounded-full size-16">
            <BookOpen className="size-7 text-zinc-500" />
          </div>
          <div>
            <p className="font-medium text-sm">
              {search ? "No courses match your search" : "No courses yet"}
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              {search
                ? "Try a different search term."
                : "Courses assigned to you will appear here."}
            </p>
          </div>
          {search && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSearch("")}
              className="gap-1.5 text-xs"
            >
              <X className="size-3.5" />
              Clear search
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {search && (
            <p className="text-muted-foreground text-xs px-0.5">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "
              {search}"
            </p>
          )}
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
