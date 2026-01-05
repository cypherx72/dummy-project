"use client";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import ChatMain from "./chat-main";
import RightChatAside from "./right-aside";
import LeftChatAside from "./left-aside";

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-row gap-4 m-8 p-3 w-full max-h-screen">
        <LeftChatAside />
        <ChatMain />
        <RightChatAside />
      </SidebarInset>
    </SidebarProvider>
  );
}
