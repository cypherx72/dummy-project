"use client";

import * as React from "react";

import { TbLayoutDashboardFilled } from "react-icons/tb";
import { AiFillSchedule } from "react-icons/ai";
import { GrTasks } from "react-icons/gr";
import { TbReportAnalytics } from "react-icons/tb";
import { IoSettings } from "react-icons/io5";
import { IoChatbubbles } from "react-icons/io5";
import { GrNotes } from "react-icons/gr";
import { BsSendFill } from "react-icons/bs";
import { MdContactSupport } from "react-icons/md";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import { useSidebar } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Card } from "../ui/card";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: TbLayoutDashboardFilled,
      isActive: true,
    },
    {
      title: "Schedule",
      url: "#",
      icon: AiFillSchedule,
    },
    {
      title: "Tasks",
      url: "/tasks",
      icon: GrTasks,
    },
    {
      title: "Reports",
      url: "#",
      icon: TbReportAnalytics,
    },
    {
      title: "Settings",
      url: "#",
      icon: IoSettings,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: MdContactSupport,
    },
    {
      title: "Feedback",
      url: "#",
      icon: BsSendFill,
    },
  ],
  projects: [
    {
      name: "Chats",
      url: "#",
      icon: IoChatbubbles,
    },
    {
      name: "Notes & AI",
      url: "#",
      icon: GrNotes,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();
  const { data: session } = useSession();

  const user = {
    email: session?.user?.email as string,
    avatar: session?.user?.image as string,
    name: session?.user?.name as string,
  };

  if (!session) redirect("auth/login");

  return (
    <Sidebar variant="inset" {...props} collapsible="icon">
      <SidebarHeader className="flex flex-row justify-even items-center px-2 py-4">
        <div className="flex flex-row justify-between items-center w-full">
          {open && (
            <div className="flex flex-row justify-evenly items-center">
              <Card className="flex bg-black p-3 rounded-xl font-black text-bold">
                CS
              </Card>
              <p className="font-serif font-bold"> Circle Space </p>
            </div>
          )}

          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent className="font-bold">
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
