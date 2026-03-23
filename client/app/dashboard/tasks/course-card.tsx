"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MdOutlineSubject } from "react-icons/md";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { courses } from "./data";

function CourseCard({ course }: any) {
  return (
    <Card className="relative justify-end p-0 border-0 rounded-2xl w-64 h-[22rem] overflow-hidden font-sans">
      <Image
        src={course.image}
        alt={course.title}
        fill
        className="object-cover"
      />

      {/* Gradient */}
      <div className="bottom-0 left-0 z-10 absolute bg-gradient-to-t from-black via-black/50 to-transparent w-full h-32 pointer-events-none" />

      {/* Content */}
      <div className="z-20 relative flex flex-col justify-evenly bg-black/10 backdrop-blur-sm px-3 py-0 rounded-b-2xl w-full h-3/5">
        <CardHeader className="space-y-1 p-0">
          <CardTitle className="text-white text-lg truncate">
            {course.title}
          </CardTitle>

          <CardDescription className="text-zinc-200 text-xs line-clamp-2">
            {course.description}
          </CardDescription>
        </CardHeader>

        <CardAction>
          <Button size="sm" variant="default">
            View Course
          </Button>
        </CardAction>

        <CardFooter className="flex flex-col gap-1 p-0 pt-1">
          <div className="w-full">
            <div className="flex space-y-1 text-zinc-300 text-xs">
              <span>Progress</span>
              <span className="ml-auto">{course.progress}%</span>
            </div>

            <Progress value={course.progress} className="h-1.5" />
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}

export default function CoursesSection() {
  return (
    <section className="space-y-3 w-full">
      <h3 className="flex flex-row items-center gap-1 font-semibold text-zinc-500 tracking-wide">
        <MdOutlineSubject className="size-5" />
        Course Tab
      </h3>

      <div className="gap-4 grid grid-flow-col auto-cols-[16rem] w-full overflow-x-auto no-scrollbar">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}
