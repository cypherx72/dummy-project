"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FiClock, FiBook } from "react-icons/fi";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HiDotsVertical } from "react-icons/hi";
import { useAssignmentUI } from "@/context/tasks/task-context";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

function NotificationSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <Card
          key={i}
          className="relative flex flex-row justify-between items-start shadow-sm p-3 border-none rounded-xl"
        >
          <div className="flex flex-row gap-3 w-full">
            <Skeleton className="rounded-full w-10 h-10 shrink-0" />
            <CardContent className="flex flex-col gap-1 p-0 w-full">
              <Skeleton className="w-3/4 h-3" />
              <Skeleton className="rounded-[3px] w-full h-4" />
              <Skeleton className="mt-1 w-1/2 h-3" />
            </CardContent>
          </div>
        </Card>
      ))}
    </>
  );
}

function getInitials(title: string) {
  return title?.slice(0, 2).toUpperCase() ?? "??";
}

function NotificationIcon({ notification }: { notification: any }) {
  const colorMap: Record<string, string> = {
    security: "bg-blue-100 text-blue-500",
    payment: "bg-blue-100 text-blue-500",
    system: "bg-gray-100 text-gray-500",
  };
  const type = notification.type?.toLowerCase() ?? "system";
  const colorClass = colorMap[type] ?? "bg-blue-100 text-blue-500";

  if (notification.avatarUrl) {
    return (
      <Image
        src={notification.avatarUrl}
        alt={notification.title}
        className="rounded-full w-10 h-10 object-cover shrink-0"
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 ${colorClass}`}
    >
      <FiBook size={18} />
    </div>
  );
}

export default function NotificationsCard() {
  const {
    notificationsData,
    notificationsLoading,
    notificationsError,
    fetchNotifications,
  } = useAssignmentUI();

  const notifications: any[] =
    notificationsData?.GetNotifications?.notifications ?? [];

  const grouped = notifications.reduce((acc: Record<string, any[]>, n: any) => {
    const date = new Date(Number(n.createdAt));
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );
    const key =
      diffDays === 0 ? "TODAY" : diffDays === 1 ? "YESTERDAY" : "EARLIER";
    if (!acc[key]) acc[key] = [];
    acc[key].push(n);
    return acc;
  }, {});

  const groupOrder = ["TODAY", "YESTERDAY", "EARLIER"];

  return (
    <section className="flex flex-col gap-3 p-2 border rounded-2xl w-[28%] h-full">
      <h3 className="font-semibold text-zinc-300 tracking-wide">
        Notification Center
      </h3>

      <div className="flex flex-col gap-2 w-full h-full overflow-hidden overflow-y-auto">
        {notificationsLoading && <NotificationSkeleton />}

        {!notificationsLoading && notificationsError && (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <AlertCircle className="w-6 h-6 text-destructive" />
            <p className="text-muted-foreground text-xs">
              Failed to load notifications.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => (fetchNotifications as () => void)()}
            >
              <RefreshCw className="mr-1 w-3 h-3" />
              Refetch
            </Button>
            <Button size="sm" variant="ghost" asChild>
              <a href="mailto:support@campus.app" className="text-xs">
                Report to Support
              </a>
            </Button>
          </div>
        )}

        {!notificationsLoading &&
          !notificationsError &&
          notifications.length === 0 && (
            <p className="text-muted-foreground text-xs">No notifications.</p>
          )}

        {!notificationsLoading &&
          !notificationsError &&
          notifications.length > 0 && (
            <div className="flex flex-col gap-4 overflow-y-auto">
              {groupOrder.map((group) => {
                const items = grouped[group];
                if (!items || items.length === 0) return null;
                return (
                  <div key={group} className="flex flex-col gap-1 w-full">
                    <p className="mb-1 px-1 font-semibold text-muted-foreground text-xs tracking-widest">
                      {group}
                    </p>
                    <div className="flex flex-col gap-2 pr-3">
                      {items.map((notification) => (
                        <Card
                          key={notification.id}
                          className="relative flex flex-row justify-between items-start gap-3 px-3 py-3 border-none rounded-xl notification-card"
                        >
                          <div className="flex flex-row items-center gap-3 w-full min-w-0">
                            <div className="relative shrink-0">
                              <NotificationIcon notification={notification} />
                              {notification.unread && (
                                <span className="-top-0.5 -left-0.5 absolute bg-blue-500 border-2 rounded-full w-2.5 h-2.5" />
                              )}
                            </div>

                            <CardContent className="flex flex-col gap-0.5 p-0 w-full min-w-0">
                              <div className="flex justify-between items-center gap-2">
                                <p className="font-semibold text-zinc-300 text-sm truncate capitalize">
                                  {notification.title}
                                </p>
                                <span className="text-muted-foreground text-xs whitespace-nowrap shrink-0">
                                  {formatDistanceToNow(
                                    new Date(Number(notification.createdAt)),
                                    {
                                      addSuffix: true,
                                    },
                                  )}
                                </span>
                              </div>

                              <p className="text-muted-foreground text-sm line-clamp-2 leading-snug">
                                {notification.message}
                              </p>
                            </CardContent>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
      </div>
    </section>
  );
}
