"use client";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import ChatMain from "./chat-main";
import RightChatAside from "./right-aside";
import LeftChatAside from "./left-aside";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useState } from "react";
import { useChatUI } from "./layout";

export default function Page() {
  const { openRightChatAside } = useChatUI();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <ResizablePanelGroup
          direction="horizontal"
          className="max-w-screen max-h-screen"
        >
          <ResizablePanel className="min-w-1/4 max-w-1/3">
            <LeftChatAside />
          </ResizablePanel>
          <ResizableHandle className="bg-neutral-700" />
          <ResizablePanel className="min-w-7/15 max-w-2/3">
            <ChatMain />
          </ResizablePanel>

          {openRightChatAside && (
            <ResizablePanel className="min-w-1/4 max-w-1/3">
              <RightChatAside />
            </ResizablePanel>
          )}
        </ResizablePanelGroup>
      </SidebarInset>
    </SidebarProvider>
  );
}
