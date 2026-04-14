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
import { BookOpen, GraduationCap } from "lucide-react";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavSecondary } from "./nav-secondary";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Card } from "../ui/card";
import { useSession } from "@/context/session-context";

const sharedNav = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: TbLayoutDashboardFilled,
    isActive: true,
  },
  {
    title: "Schedule",
    url: "/dashboard/class-timetable",
    icon: AiFillSchedule,
  },
  {
    title: "Tasks",
    url: "/tasks",
    icon: GrTasks,
  },
  {
    title: "Reports",
    url: "/dashboard/progress-report",
    icon: TbReportAnalytics,
  },
  {
    title: "Settings",
    url: "/dashboard/admin",
    icon: IoSettings,
    items: [
      { title: "General", url: "/dashboard/admin" },
      { title: "Team", url: "/dashboard/admin" },
      { title: "Billing", url: "/dashboard/admin" },
      { title: "Limits", url: "/dashboard/admin" },
    ],
  },
];

// Teacher / admin only
const teacherNav = [
  {
    title: "Courses",
    url: "/dashboard/course-management",
    icon: BookOpen,
  },
];

// Student only
const studentNav = [
  {
    title: "My Courses",
    url: "/dashboard/my-courses",
    icon: GraduationCap,
  },
];

const navSecondary = [
  { title: "Support", url: "/dashboard/communication", icon: MdContactSupport },
  { title: "Feedback", url: "/dashboard/communication", icon: BsSendFill },
];

const projects = [
  { name: "Chats", url: "/dashboard/chats", icon: IoChatbubbles },
  { name: "Notes & AI", url: "/tasks", icon: GrNotes },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();
  const { user } = useSession();

  const roleNav =
    user?.role === "student"
      ? studentNav
      : user?.role === "teacher" || user?.role === "admin"
        ? teacherNav
        : [];

  // Insert role-specific nav after Tasks (index 2)
  const navMain = [
    ...sharedNav.slice(0, 3),
    ...roleNav,
    ...sharedNav.slice(3),
  ];

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
        <NavMain items={navMain} />
        <NavProjects projects={projects} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
