"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { isPast, differenceInDays } from "date-fns";
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
import { FiCalendar, FiBook } from "react-icons/fi";
import { useAssignmentUI } from "@/context/tasks/task-context";
import { format, formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

export default function AssignmentsCard() {
  const { dashboardData, dashboardLoading } = useAssignmentUI();
  const assignments = (dashboardData?.GetDashboardData?.assignments ?? []).map(
    (a) => ({
      ...a,
      dueDate: a.dueDate ? new Date(Number(a.dueDate)) : null,
    }),
  );
  const router = useRouter();

  return (
    <div className="flex flex-col items-start gap-3 w-full font-sans">
      <h3 className="flex flex-row items-center gap-1 font-semibold text-zinc-500 tracking-wide">
        <MdOutlineAssignment className="size-5" />
        Upcoming Assignments
      </h3>
      <section className="flex flex-col justify-center items-center gap-2 w-full h-full">
        {dashboardLoading && (
          <p className="text-muted-foreground text-xs">Loading…</p>
        )}
        {!dashboardLoading && assignments.length === 0 && (
          <p className="text-muted-foreground text-xs">No assignments due.</p>
        )}
        {assignments.length > 0 && (
          <Carousel className="px-16 pt-4 pb-1 w-full">
            <CarouselContent>
              {assignments.map((assignment) => (
                <CarouselItem className="basis-1/3" key={assignment.id}>
                  <Card className="gap-2 hover:shadow-md py-5 border-none w-full h-full overflow-hidden transition-shadow">
                    <CardHeader className="space-y-1 px-3">
                      <div className="flex flex-col gap-2">
                        <CardTitle className="flex items-center gap-x-1 w-full min-w-0 font-medium text-[12px] truncate capitalize">
                          <p className="truncate">{assignment.title}</p>
                        </CardTitle>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-1.5 px-3 text-sm">
                      <span className="flex items-center gap-2 text-zinc-300 truncate capitalize">
                        <FiBook size={14} />
                        {assignment.course?.name ?? "—"}
                      </span>

                      <span className="flex items-center gap-2 text-muted-foreground truncate">
                        <FiCalendar size={14} />
                        Due:{" "}
                        {assignment.dueDate
                          ? format(new Date(assignment.dueDate), "d MMM yyyy")
                          : "—"}
                      </span>

                      {assignment.dueDate && (
                        <span
                          className={cn(
                            "flex items-center gap-1 px-2 py-0.5 rounded-sm w-fit font-medium text-[11px]",
                            isPast(new Date(assignment.dueDate))
                              ? "bg-red-500/10 text-red-500"
                              : differenceInDays(
                                    new Date(assignment.dueDate),
                                    new Date(),
                                  ) <= 5
                                ? "bg-orange-500/10 text-orange-500"
                                : "bg-green-500/10 text-green-600",
                          )}
                        >
                          {formatDistanceToNow(new Date(assignment.dueDate), {
                            addSuffix: true,
                          })}
                        </span>
                      )}
                    </CardContent>

                    <CardFooter className="flex justify-between items-center px-3">
                      <span className="text-muted-foreground text-xs">
                        {assignment.maxMarks} Marks
                      </span>
                      <Button
                        size="sm"
                        onClick={() =>
                          router.push(
                            `/assignments/@teacher/assignments-and-quizzes`,
                          )
                        }
                      >
                        Upload
                      </Button>
                    </CardFooter>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        )}
      </section>
    </div>
  );
}
