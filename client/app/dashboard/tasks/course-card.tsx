"use client";

import { Button } from "@/components/ui/button";
import { MdOutlineSubject } from "react-icons/md";
import { Progress } from "@/components/ui/progress";
import { BookText } from "lucide-react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useAssignmentUI } from "@/context/tasks/task-context";

import { Field, FieldLabel } from "@/components/ui/field";

function getProgressColor(value: number): string {
  const red = value < 50 ? 220 : Math.round(220 - (value - 50) * 4.4);
  const green =
    value < 50 ? Math.round(value * 3.1) : 155 + Math.round((value - 50) * 2);
  return `rgb(${red}, ${green}, 60)`;
}

export function AssignmentProgress({ value = 78 }: { value?: number }) {
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
        style={
          {
            "--progress-indicator-color": color,
          } as React.CSSProperties
        }
      />
    </Field>
  );
}

function CourseCard({ course }: { course: any }) {
  return (
    <div className="relative border-0 rounded-2xl w-full h-[35vh]">
      {/* Dark Horizon Glow */}
      <div className="z-0 absolute inset-0 rounded-2xl dark-horizon-glow" />

      {/* Content */}
      <Card className="justify-start p-0 font-sans">
        <div className="z-20 relative flex flex-col justify-evenly space-y-5 bg-black/10 backdrop-blur-sm px-3 py-4 rounded-2xl w-full h-full">
          <CardHeader className="space-y-2 p-0">
            <CardTitle className="font-medium text-white text-lg truncate capitalize">
              {course.name}
            </CardTitle>

            <CardDescription className="space-y-2 font-light text-zinc-200 text-sm tracking-wide">
              {/* {course.description} */}
              <p className="text-zinc-300 line-clamp-2">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio
                magni ipsa dolor, nisi quasi deleniti, reprehenderit mollitia
                non illo accusamus adipisci earum maiores consectetur. Earum
                ipsam adipisci est numquam quia.
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

export default function CoursesSection() {
  const { dashboardData, dashboardLoading } = useAssignmentUI();
  const courses: any[] = dashboardData?.GetDashboardData?.courses ?? [];

  return (
    <section className="space-y-3 w-full">
      <h3 className="flex flex-row items-center gap-1 font-medium text-zinc-500 tracking-wide">
        <MdOutlineSubject className="size-5" />
        Enrolled Courses
      </h3>

      {dashboardLoading && (
        <p className="text-muted-foreground text-xs">Loading…</p>
      )}
      {!dashboardLoading && courses.length === 0 && (
        <p className="text-muted-foreground text-xs">No enrolled courses.</p>
      )}

      <div className="gap-4 grid grid-flow-col auto-cols-[16rem] w-full overflow-x-auto no-scrollbar">
        {courses.map((course, i) => (
          <CourseCard key={course.id} course={course} index={i} />
        ))}
      </div>
    </section>
  );
}
