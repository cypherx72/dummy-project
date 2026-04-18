"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCw } from "lucide-react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { GoCommentDiscussion } from "react-icons/go";
import { useAssignmentUI } from "@/context/tasks/task-context";
import { format, isToday, isTomorrow, isThisWeek } from "date-fns";

function EventSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="relative flex flex-row items-center gap-3 bg-white/10 backdrop-blur-md px-3 py-3 border border-white/20 rounded-xl"
        >
          <Skeleton className="bg-white/20 rounded-full w-10 h-10 shrink-0" />
          <div className="flex flex-col flex-1 gap-1">
            <Skeleton className="bg-white/20 w-3/4 h-3" />
            <Skeleton className="bg-white/20 w-1/2 h-3" />
          </div>
          <Skeleton className="bg-white/20 rounded-md w-7 h-7 shrink-0" />
        </div>
      ))}
    </>
  );
}

function getGroupKey(startTime: string | null | undefined): string {
  if (!startTime) return "LATER";
  const date = new Date(startTime);
  if (isToday(date)) return "TODAY";
  if (isTomorrow(date)) return "TOMORROW";
  if (isThisWeek(date, { weekStartsOn: 1 })) return "THIS WEEK";
  return "LATER";
}

export default function CalendarEvents() {
  const {
    upcomingEventsData,
    upcomingEventsLoading,
    upcomingEventsError,
    fetchUpcomingEvents,
  } = useAssignmentUI();

  const events: any[] = upcomingEventsData?.GetUpcomingEvents?.events ?? [];

  const groupOrder = ["TODAY", "TOMORROW", "THIS WEEK", "LATER"];

  const grouped = events.reduce((acc: Record<string, any[]>, e: any) => {
    const key = getGroupKey(e.startTime);
    if (!acc[key]) acc[key] = [];
    acc[key].push(e);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-4 w-full h-full overflow-hidden overflow-y-auto">
      {upcomingEventsLoading && <EventSkeleton />}

      {!upcomingEventsLoading && upcomingEventsError && (
        <div className="flex flex-col items-center gap-2 bg-white/10 backdrop-blur-md py-6 border border-white/20 rounded-xl w-full text-center">
          <AlertCircle className="w-6 h-6 text-red-300" />
          <p className="text-white/60 text-xs">Failed to load events.</p>
          <Button
            size="sm"
            variant="outline"
            className="bg-white/10 hover:bg-white/20 border-white/30 text-white"
            onClick={() => (fetchUpcomingEvents as () => void)()}
          >
            <RefreshCw className="mr-1 w-3 h-3" />
            Refetch
          </Button>
          <Button
            size="sm"
            variant="ghost"
            asChild
            className="hover:bg-white/10 text-white/60 hover:text-white"
          >
            <a href="mailto:support@campus.app" className="text-xs">
              Report to Support
            </a>
          </Button>
        </div>
      )}

      {!upcomingEventsLoading &&
        !upcomingEventsError &&
        events.length === 0 && (
          <p className="text-white/50 text-xs">No upcoming events.</p>
        )}

      {!upcomingEventsLoading && !upcomingEventsError && events.length > 0 && (
        <div className="flex flex-col gap-4 p-2 w-full">
          {groupOrder.map((group) => {
            const items = grouped[group];
            if (!items || items.length === 0) return null;
            return (
              <div key={group} className="flex flex-col gap-1 w-full">
                <p className="mb-1 px-1 font-semibold text-white/40 text-xs uppercase tracking-widest">
                  {group}
                </p>
                <div className="flex flex-col gap-2">
                  {items.map((event) => (
                    <div
                      key={event.id}
                      className="relative flex flex-row items-center gap-3 p-2 rounded-xl transition-all duration-200 notification-card"
                    >
                      <div className="flex justify-center items-center bg-white/15 rounded-full ring-1 ring-white/20 w-10 h-10 text-white/70 shrink-0">
                        <GoCommentDiscussion className="text-lg" />
                      </div>

                      <div className="flex flex-col flex-1 gap-0.5 min-w-0">
                        <p className="drop-shadow-sm font-semibold text-white text-sm truncate">
                          {event.title}
                        </p>
                        <p className="text-white/55 text-xs truncate">
                          {event.startTime
                            ? format(
                                new Date(event.startTime),
                                "EEE, MMM d · h:mm a",
                              )
                            : "Time TBD"}
                          {event.location ? ` · ${event.location}` : ""}
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-white/10 rounded-lg w-7 h-7 text-white/40 hover:text-white shrink-0"
                      >
                        <BsThreeDotsVertical className="text-sm" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
