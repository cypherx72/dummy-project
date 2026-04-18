"use client";

import { Calendar } from "@/components/ui/calendar";
import {
  startOfWeek,
  endOfWeek,
  subWeeks,
  addWeeks,
  isSameDay,
} from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Annotation = {
  date: Date;
  label: string;
  color: string; // tailwind dot color, e.g. "bg-red-500"
};

const annotations: Annotation[] = [
  { date: new Date(2026, 2, 11), label: "Team standup", color: "bg-blue-500" },
  { date: new Date(2026, 2, 13), label: "Deadline", color: "bg-red-500" },
  {
    date: new Date(2026, 2, 15),
    label: "Launch day 🚀",
    color: "bg-green-500",
  },
];

function getAnnotations(day: Date) {
  return annotations.filter((a) => isSameDay(a.date, day));
}

export function WeekCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });

  return (
    <Calendar
      mode="single"
      selected={currentDate}
      month={currentDate}
      className="relative bg-accent m-0 px-0 py-1.5 rounded-2xl w-full"
      classNames={{
        months: "flex flex-row items-start justify-center",
        month: "space-y-2",
        week: "flex w-full mt-2 [&:not(:has(button:not(.hidden)))]:hidden",
        month_caption: "flex justify-center font-sans",
        nav: "flex items-center text-white gap-32 top-1 absolute",
        // month_grid: "w-full relative border-collapse",
        weekday:
          "text-muted-foreground font-sans rounded-md font-semibold w-9 font-medium text-xs",
        // row: "flex w-ful l mt-1",
        // cell: "h-10 w-10 text-center text-sm p-0 relative",

        day: cn(
          "flex justify-center items-center rounded-md w-9 h-9 font-normal transition-all duration-200",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        ),
        selected: cn(
          "bg-primary rounded-md font-semibold text-primary-foreground",
          "hover:bg-primary/90 hover:text-primary-foreground",
          "focus:bg-primary focus:text-primary-foreground",

          "shadow-sm",
        ),
        today: cn("bg-primary/10 rounded-md font-bold text-primary/90"),

        disabled: "text-muted-foreground opacity-50",
        hidden: "hidden",
      }}
      showOutsideDays={true}
      onMonthChange={setCurrentDate}
      hidden={{
        before: weekStart,
        after: weekEnd,
      }}
      components={{
        DayButton: ({ day, ...props }) => {
          const dayAnnotations = getAnnotations(day.date);
          const button = (
            <button
              {...props}
              className={`${props.className} font-normal px-2 py-1.5 font-sans  tracking-tight relative`}
            >
              {String(day.date.getDate()).padStart(2, "0")}
              {dayAnnotations.length > 0 && (
                <span className="bottom-0.5 left-1/2 absolute flex gap-0.5 -translate-x-1/2">
                  {dayAnnotations.map((a, i) => (
                    <span
                      key={i}
                      className={`w-1.5 h-1.5  rounded-full ${a.color}`}
                    />
                  ))}
                </span>
              )}
            </button>
          );

          if (dayAnnotations.length === 0) return button;

          return (
            <Tooltip>
              <TooltipTrigger asChild>{button}</TooltipTrigger>
              <TooltipContent>
                {dayAnnotations.map((a, i) => (
                  <div
                    key={i}
                    className="flex flex-col justify-center items-center gap-1.5"
                  >
                    <span className={`w-2 h-2 rounded-full ${a.color}`} />
                    <span>{a.label}</span>
                  </div>
                ))}
              </TooltipContent>
            </Tooltip>
          );
        },
        PreviousMonthButton: (props) => (
          <button
            {...props}
            onClick={() => setCurrentDate((d) => subWeeks(d, 1))}
            className="p-1"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        ),

        NextMonthButton: (props) => (
          <button
            {...props}
            onClick={() => setCurrentDate((d) => addWeeks(d, 1))}
            className="p-1"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        ),
      }}
    />
  );
}
