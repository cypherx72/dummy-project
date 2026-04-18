"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { isPast, differenceInDays } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MdOutlineAssignment } from "react-icons/md";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { FiCalendar, FiBook } from "react-icons/fi";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useAssignmentUI } from "@/context/tasks/task-context";
import { format, formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

function AssignmentCardSkeleton() {
  return (
    <Carousel className="px-16 pt-4 pb-1 w-full">
      <CarouselContent>
        {Array.from({ length: 3 }).map((_, i) => (
          <CarouselItem className="basis-1/3" key={i}>
            <Card className="gap-2 py-5 border-none w-full h-full overflow-hidden">
              <CardHeader className="space-y-1 px-3">
                <Skeleton className="w-3/4 h-4" />
              </CardHeader>
              <CardContent className="space-y-1.5 px-3">
                <Skeleton className="w-1/2 h-3" />
                <Skeleton className="w-2/3 h-3" />
                <Skeleton className="w-1/3 h-5 rounded-sm" />
              </CardContent>
              <CardFooter className="flex justify-between items-center px-3">
                <Skeleton className="w-16 h-3" />
                <Skeleton className="w-16 h-8 rounded-md" />
              </CardFooter>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
}

export default function AssignmentsCard() {
  const { fetchAssignmentsData, fetchAssignmentsLoading, fetchAssignmentsError, fetchAssignments } =
    useAssignmentUI();
  const router = useRouter();

  const assignments = (fetchAssignmentsData?.GetAssignments?.assignments ?? []).map(
    (a: any) => ({
      ...a,
      dueDate: a.dueDate ? new Date(Number(a.dueDate)) : null,
    }),
  );

  return (
    <div className="flex flex-col items-start gap-3 w-full font-sans">
      <h3 className="flex flex-row items-center gap-1 font-semibold text-zinc-500 tracking-wide">
        <MdOutlineAssignment className="size-5" />
        Upcoming Assignments
      </h3>
      <section className="flex flex-col justify-center items-center gap-2 w-full h-full">
        {fetchAssignmentsLoading && <AssignmentCardSkeleton />}

        {!fetchAssignmentsLoading && fetchAssignmentsError && (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
            <p className="text-muted-foreground text-sm">Failed to load assignments.</p>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => (fetchAssignments as () => void)()}
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

        {!fetchAssignmentsLoading && !fetchAssignmentsError && assignments.length === 0 && (
          <p className="text-muted-foreground text-xs">No assignments due.</p>
        )}

        {!fetchAssignmentsLoading && !fetchAssignmentsError && assignments.length > 0 && (
          <Carousel className="px-16 pt-4 pb-1 w-full">
            <CarouselContent>
              {assignments.map((assignment: any) => (
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
                            `/assignments/@student/assignments-and-quizzes`,
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
