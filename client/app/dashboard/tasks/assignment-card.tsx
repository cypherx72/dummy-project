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
import { FiCalendar, FiClock, FiBook, FiPaperclip } from "react-icons/fi";
import { assignments } from "./data";
import { useEffect } from "react";
import { useTaskUI } from "@/context/tasks/task-context";

export default function AssignmentsCard() {
  const { dashboardData } = useTaskUI();
  useEffect(() => {
    console.log(
      "Dashboard data: ",
      dashboardData?.GetDashboardData?.assignments,
    );
  }, [dashboardData]);

  return (
    <div className="flex flex-col items-start gap-3 w-full">
      <h3 className="flex flex-row items-center gap-1 font-semibold text-zinc-500 tracking-wide">
        <MdOutlineAssignment className="size-5" />
        Assignment Tab
      </h3>
      <section className="flex flex-col justify-center items-center gap-2 w-full h-full">
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
                      {assignment.course}
                    </span>

                    <span className="flex items-center gap-2 text-muted-foreground">
                      <FiCalendar size={14} />
                      Due: {assignment.dueDate}
                    </span>

                    <span className="flex items-center gap-2 text-muted-foreground">
                      <FiClock size={14} />
                      {assignment.daysRemaining} days remaining
                    </span>

                    <span className="flex items-center gap-2 text-muted-foreground">
                      <FiPaperclip size={14} />
                      {assignment.attachments} reference files attached
                    </span>
                  </CardContent>

                  <CardFooter className="flex justify-between items-center">
                    <span className="text-muted-foreground text-xs">
                      {assignment.points} Points
                    </span>

                    <Button>Upload</Button>
                    <Button variant="secondary">View More</Button>
                  </CardFooter>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>
    </div>
  );
}
