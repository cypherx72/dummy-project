"use client";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { BsThreeDotsVertical } from "react-icons/bs";
import { GoCommentDiscussion } from "react-icons/go";
import { useTaskUI } from "@/context/tasks/task-context";
import { format } from "date-fns";

export default function CalendarEvents() {
  const { dashboardData, dashboardLoading } = useTaskUI();
  const events: any[] = dashboardData?.GetDashboardData?.events ?? [];

  return (
    <div className="border-zinc-800 rounded-md divide-y divide-zinc-800 w-full h-1/2 overflow-hidden overflow-y-auto scrollbar">
      {dashboardLoading && (
        <p className="text-muted-foreground text-xs px-2 py-1">Loading…</p>
      )}
      {!dashboardLoading && events.length === 0 && (
        <p className="text-muted-foreground text-xs px-2 py-1">
          No upcoming events.
        </p>
      )}
      {events.map((event) => (
        <Item
          key={event.id}
          className="hover:bg-zinc-800/50 px-1 py-2 transition-colors"
        >
          <ItemMedia
            className="flex flex-col justify-center items-center text-zinc-400"
            variant="icon"
          >
            <GoCommentDiscussion className="text-lg" />
          </ItemMedia>

          <ItemContent className="truncate">
            <ItemTitle className="font-medium text-sm">{event.title}</ItemTitle>

            <ItemDescription className="text-zinc-400 text-xs">
              {event.startDate
                ? format(new Date(event.startDate), "h:mm a")
                : "TBD"}
              {event.location ? ` · ${event.location}` : ""}
            </ItemDescription>
          </ItemContent>

          <ItemActions>
            <Button variant="ghost" size="icon">
              <BsThreeDotsVertical className="text-zinc-400" />
            </Button>
          </ItemActions>
        </Item>
      ))}
    </div>
  );
}
