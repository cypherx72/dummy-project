"use client";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { IconType } from "react-icons/lib";

export function NavProjects({
  projects,
}: {
  projects: {
    name: string;
    url: string;
    icon: IconType;
  }[];
}) {
  return (
    <SidebarGroup className="my-8">
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              asChild
              tooltip={item.name}
              className="items-center px-16 h-[6vh]"
            >
              <a href={item.url} className="flex items-center gap-2">
                <item.icon className="w-5 h-5" />

                <span className="group-data-[collapsible=icon]:hidden">
                  {item.name}
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
