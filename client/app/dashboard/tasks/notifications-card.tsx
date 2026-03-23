"use client";

import { Card, CardContent } from "@/components/ui/card";
import { notifications } from "./data";
import { FiClock, FiBook } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { HiDotsVertical } from "react-icons/hi";

export default function NotificationsCard() {
  return (
    <section className="flex flex-col gap-3 w-full">
      <h3 className="font-semibold text-neutral-500 tracking-wide">
        Notification Center
      </h3>

      <div className="flex flex-col gap-2 w-full h-3/5 overflow-hidden overflow-y-auto no-scrollbar">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className={`relative flex flex-row justify-between items-center border-none
           shadow-md backdrop-blur-sm p-2 rounded-md 
         `}
          >
            {/* content */}
            <CardContent className="flex flex-col gap-1 p-0 truncate">
              <p className="text-sm tracking-wide">{notification.title}</p>

              <p className="p-1 border-l-3 border-l-blue-500 rounded-l-[3px] text-muted-foreground text-sm truncate">
                {notification.message}
              </p>

              <div className="flex items-center gap-4 mt-1 text-muted-foreground text-xs">
                <span className="flex items-center gap-1">
                  <FiBook size={12} />
                  {notification.course}
                </span>

                <span className="flex items-center gap-1">
                  <FiClock size={12} />
                  {notification.time}
                </span>
              </div>
            </CardContent>
            <Button variant="outline" size="icon-sm">
              <HiDotsVertical className="size-4" />
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );
}
