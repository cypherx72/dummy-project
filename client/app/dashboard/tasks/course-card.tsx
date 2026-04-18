"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MdOutlineSubject } from "react-icons/md";
import { Progress } from "@/components/ui/progress";
import { BookText, AlertCircle, RefreshCw } from "lucide-react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/components/ui/card";
import { useAssignmentUI } from "@/context/tasks/task-context";
import { Field, FieldLabel } from "@/components/ui/field";

function getProgressColor(value: number): string {
  const red = value < 50 ? 220 : Math.round(220 - (value - 50) * 4.4);
  const green =
    value < 50 ? Math.round(value * 3.1) : 155 + Math.round((value - 50) * 2);
  return `rgb(${red}, ${green}, 60)`;
}

function AssignmentProgress({ value = 78 }: { value?: number }) {
  const color = getProgressColor(value);
  return (
    <Field className="gap-0.5 w-full max-w-sm">
      <FieldLabel htmlFor="progress-upload">
        <span className="font-light">Syllabus progress</span>
        <span
          className="ml-auto transition-colors duration-500"
          style={{ color }}
        >
          {value}%
        </span>
      </FieldLabel>
      <Progress
        value={value}
        id="progress-upload"
        className="[&>[data-slot='progress-indicator']]:transition-[background-color,width] [&>[data-slot='progress-indicator']]:duration-500"
        style={{ "--progress-indicator-color": color } as React.CSSProperties}
      />
    </Field>
  );
}

function CourseCardItem({ course }: { course: any }) {
  return (
    <div className="relative border-0 rounded-2xl w-full h-full">
      <div className="z-0 absolute inset-0 rounded-2xl dark-horizon-glow" />
      <Card className="justify-start p-0 font-sans">
        <div className="z-20 relative flex flex-col justify-evenly space-y-5 bg-black/10 backdrop-blur-sm px-3 py-4 rounded-2xl w-full h-full">
          <CardHeader className="space-y-2 p-0">
            <CardTitle className="font-medium text-white text-lg truncate capitalize">
              {course.name}
            </CardTitle>
            <CardDescription className="space-y-2 font-light text-zinc-200 text-sm tracking-wide">
              <p className="text-zinc-300 line-clamp-2">
                {course.description ??
                  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio magni ipsa dolor, nisi quasi deleniti, reprehenderit mollitia non illo accusamus adipisci earum maiores consectetur."}
              </p>
              <span className="flex flex-row items-center space-x-1 p-0 text-zinc-500">
                <BookText className="size-6" />
                <p className="text-xs uppercase">{course.code}</p>
              </span>
              <AssignmentProgress />
            </CardDescription>
          </CardHeader>
          <CardAction className="ml-auto">
            <Button size="sm" className="font-semibold" variant="default">
              View Course
            </Button>
          </CardAction>
        </div>
      </Card>
    </div>
  );
}

function CourseCardSkeleton() {
  return (
    <div className="gap-4 grid grid-flow-col auto-cols-[16rem] w-full overflow-x-auto no-scrollbar">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="relative border-0 rounded-2xl w-full h-[35vh]">
          <Skeleton className="rounded-2xl w-full h-full" />
        </div>
      ))}
    </div>
  );
}

export default function CoursesSection() {
  const {
    enrolledCoursesData,
    enrolledCoursesLoading,
    enrolledCoursesError,
    fetchEnrolledCourses,
  } = useAssignmentUI();

  const courses: any[] = enrolledCoursesData?.GetEnrolledCourses?.courses ?? [];

  return (
    <section className="space-y-3 px-6 w-full">
      <h3 className="flex flex-row items-center gap-1 font-medium text-zinc-300 tracking-wide">
        Enrolled Courses
      </h3>

      {enrolledCoursesLoading && <CourseCardSkeleton />}

      {!enrolledCoursesLoading && enrolledCoursesError && (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <AlertCircle className="w-7 h-7 text-destructive" />
          <p className="text-muted-foreground text-sm">
            Failed to load courses.
          </p>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => (fetchEnrolledCourses as () => void)()}
            >
              <RefreshCw className="mr-1.5 w-3.5 h-3.5" />
              Refetch
            </Button>
            <Button size="sm" variant="ghost" asChild>
              <a href="mailto:support@campus.app">Report to Support</a>
            </Button>
          </div>
        </div>
      )}

      {!enrolledCoursesLoading &&
        !enrolledCoursesError &&
        courses.length === 0 && (
          <p className="text-muted-foreground text-xs">No enrolled courses.</p>
        )}

      {!enrolledCoursesLoading &&
        !enrolledCoursesError &&
        courses.length > 0 && (
          <div className="gap-4 grid grid-flow-col auto-cols-[16rem] py-2 w-full overflow-y-auto">
            {courses.map((course) => (
              <CourseCardItem key={course.id} course={course} />
            ))}
          </div>
        )}
    </section>
  );
}
