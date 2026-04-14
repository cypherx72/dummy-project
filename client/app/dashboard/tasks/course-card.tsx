"use client";

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
import { useAssignmentUI } from "@/context/tasks/task-context";

// Fallback placeholder images cycled by index
const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1628595351029-c2bf17511435?q=80&w=1032&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515879218367-8466d910aaa4",
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
  "https://images.unsplash.com/photo-1526378722484-bd91ca387e72",
];

function CourseCard({ course, index }: { course: any; index: number }) {
  const img = PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];

  return (
    <Card
      className="relative justify-end p-0 border-0 rounded-2xl w-64 h-[22rem] overflow-hidden font-sans"
      style={{
        backgroundImage: `url(${img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Gradient */}
      <div className="bottom-0 left-0 z-10 absolute bg-gradient-to-t from-black via-black/50 to-transparent w-full h-32 pointer-events-none" />

      {/* Content */}
      <div className="z-20 relative flex flex-col justify-evenly bg-black/10 backdrop-blur-sm px-3 py-0 rounded-b-2xl w-full h-3/5">
        <CardHeader className="space-y-1 p-0">
          <CardTitle className="text-white text-lg truncate">
            {course.title ?? course.name}
          </CardTitle>

          <CardDescription className="text-zinc-200 text-xs line-clamp-2">
            {course.description ?? course.code}
          </CardDescription>
        </CardHeader>

        <CardAction>
          <Button size="sm" variant="default">
            View Course
          </Button>
        </CardAction>

        <CardFooter className="flex flex-col gap-1 p-0 pt-1">
          <div className="w-full">
            <p className="text-zinc-300 text-xs">{course.code}</p>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}

export default function CoursesSection() {
  const { dashboardData, dashboardLoading } = useAssignmentUI();
  const courses: any[] = dashboardData?.GetDashboardData?.courses ?? [];

  return (
    <section className="space-y-3 w-full">
      <h3 className="flex flex-row items-center gap-1 font-semibold text-zinc-500 tracking-wide">
        <MdOutlineSubject className="size-5" />
        Course Tab
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
