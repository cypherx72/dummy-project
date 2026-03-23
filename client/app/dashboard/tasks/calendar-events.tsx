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

import { calendarEvents } from "./data";

export default function CalendarEvents() {
  return (
    <div className="border-zinc-800 rounded-md divide-y divide-zinc-800 w-full h-1/2 overflow-hidden overflow-y-auto scrollbar">
      {calendarEvents.map((event) => {
        const Icon = event.icon;

        return (
          <Item
            key={event.id}
            className="hover:bg-zinc-800/50 px-1 py-2 transition-colors"
          >
            <ItemMedia
              className="flex flex-col justify-center items-center text-zinc-400"
              variant="icon"
            >
              <Icon className="text-lg" />
            </ItemMedia>

            <ItemContent className="truncate">
              <ItemTitle className="font-medium text-sm">
                {event.title}
              </ItemTitle>

              <ItemDescription className="text-zinc-400 text-xs">
                {event.time} · {event.course}
              </ItemDescription>
            </ItemContent>

            <ItemActions>
              <Button variant="ghost" size="icon">
                <BsThreeDotsVertical className="text-zinc-400" />
              </Button>
            </ItemActions>
          </Item>
        );
      })}
    </div>
  );
}
