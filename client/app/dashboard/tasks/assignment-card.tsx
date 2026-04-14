"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MdOutlineAssignment } from "react-icons/md";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { VscBellDot } from "react-icons/vsc";
import { FiCalendar, FiBook } from "react-icons/fi";
import { useTaskUI } from "@/context/tasks/task-context";
import { format, formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

export default function AssignmentsCard() {
  const { dashboardData, dashboardLoading } = useTaskUI();
  const assignments = (dashboardData?.GetDashboardData?.assignments ?? []).map(
    (a) => ({
      ...a,
      dueDate: a.dueDate ? new Date(Number(a.dueDate)) : null,
    }),
  );
  const router = useRouter();

  return (
    <div className="flex flex-col items-start gap-3 w-full">
      <h3 className="flex flex-row items-center gap-1 font-semibold text-zinc-500 tracking-wide">
        <MdOutlineAssignment className="size-5" />
        Assignment Tab
      </h3>
      <section className="flex flex-col justify-center items-center gap-2 w-full h-full">
        {dashboardLoading && (
          <p className="text-muted-foreground text-xs">Loading…</p>
        )}
        {!dashboardLoading && assignments.length === 0 && (
          <p className="text-muted-foreground text-xs">No assignments due.</p>
        )}
        {assignments.length > 0 && (
          <Carousel className="w-full max-w-[12rem] sm:max-w-xs">
            <CarouselContent>
              {assignments.map((assignment) => (
                <CarouselItem key={assignment.id}>
                  <Card className="hover:shadow-md border-none w-auto transition-shadow">
                    <CardHeader className="space-y-1">
                      <div className="flex flex-col gap-2">
                        <CardTitle className="flex items-center gap-x-1 text-base">
                          <VscBellDot className="size-6 text-red-500" />
                          {assignment.title}
                        </CardTitle>

                        <CardDescription>
                          {assignment.description}
                        </CardDescription>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-1 text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <FiBook size={14} />
                        {assignment.course?.name ?? "—"}
                      </span>

                      <span className="flex items-center gap-2 text-muted-foreground">
                        <FiCalendar size={14} />
                        Due:{" "}
                        {assignment.dueDate
                          ? format(new Date(assignment.dueDate), "d MMM yyyy")
                          : "—"}
                      </span>

                      <span className="flex items-center gap-2 text-muted-foreground text-xs">
                        {assignment.dueDate
                          ? formatDistanceToNow(new Date(assignment.dueDate), {
                              addSuffix: true,
                            })
                          : ""}
                      </span>
                    </CardContent>

                    <CardFooter className="flex justify-between items-center">
                      <span className="text-muted-foreground text-xs">
                        {assignment.maxMarks} Points
                      </span>
                      <Button
                        onClick={() =>
                          router.push(`/tasks/upload/${assignment.id}`)
                        }
                      >
                        Upload
                      </Button>
                      <Button variant="secondary">View More</Button>
                    </CardFooter>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}
      </section>
    </div>
  );
}
