"use client";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import ChatMain from "./chat-main";
import RightChatAside from "./right-aside";
import LeftChatAside from "./left-aside";
import { useChatUI } from "./layout";
import { Button } from "@/components/ui/button";
import { MdOutlineGroupAdd } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { IoMdOptions } from "react-icons/io";
import { IoMdArchive } from "react-icons/io";
import { RiDraftFill } from "react-icons/ri";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Input } from "@/components/ui/input";
import { SiGotomeeting } from "react-icons/si";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaStar } from "react-icons/fa";
import { GiCheckMark } from "react-icons/gi";
import { LuLogOut } from "react-icons/lu";
import { MdOutlineMailOutline } from "react-icons/md";
import { TiMessages } from "react-icons/ti";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useSession } from "@/context/session-context";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "react-resizable-panels";

const dummyNotifications = [
  {
    id: "n1",
    type: "mention",
    title: "You were mentioned",
    description: "Alex mentioned you in #Project-Discussion",
    chatId: "12",
    messageId: "msg_98",
    createdAt: "2026-01-22T10:15:00Z",
    isRead: false,
    icon: SiGotomeeting,
  },
  {
    id: "n2",
    type: "meeting",
    title: "Zoom meeting link shared",
    description: "A Zoom meeting link was shared in #Weekly-Standup",
    chatId: "7",
    meetingLink: "https://zoom.us/j/123456789",
    createdAt: "2026-01-22T08:45:00Z",
    isRead: false,
    icon: SiGotomeeting,
  },
  {
    id: "n3",
    type: "message",
    title: "New message",
    description: "You received a new message from Sarah",
    chatId: "3",
    createdAt: "2026-01-21T18:30:00Z",
    isRead: true,
    icon: SiGotomeeting,
  },
  {
    id: "n4",
    type: "system",
    title: "Security update",
    description: "Your password was changed successfully",
    createdAt: "2026-01-20T14:10:00Z",
    isRead: true,
    icon: SiGotomeeting,
  },
  {
    id: "n5",
    type: "announcement",
    title: "New announcement",
    description: "Mid-term schedule has been updated",
    createdAt: "2026-01-19T09:00:00Z",
    isRead: false,
    icon: SiGotomeeting,
  },
  {
    id: "n6",
    type: "reaction",
    title: "Message reaction",
    description: "John reacted 👍 to your message",
    chatId: "5",
    messageId: "msg_54",
    createdAt: "2026-01-18T20:40:00Z",
    isRead: true,
    icon: SiGotomeeting,
  },
  {
    id: "n7",
    type: "reminder",
    title: "Reminder",
    description: "Your Zoom meeting starts in 10 minutes",
    meetingLink: "https://zoom.us/j/987654321",
    createdAt: "2026-01-22T09:50:00Z",
    isRead: false,
    icon: SiGotomeeting,
  },
];

export default function Page() {
  const { loading } = useSession();
  const { chatBootstrapPayloadLoading } = useChatUI();

  if (chatBootstrapPayloadLoading || loading)
    return (
      <Empty className="w-full h-full">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Spinner />
          </EmptyMedia>
          <EmptyTitle>Getting your chats ready.</EmptyTitle>
          <EmptyDescription>
            Please wait while we fetch your conversations.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" size="sm">
            Cancel
          </Button>
        </EmptyContent>
      </Empty>
    );

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <ResizablePanelGroup
          orientation="vertical"
          className="border w-full h-full"
        >
          <ResizablePanel
            defaultSize="7.5%"
            maxSize="7.5%"
            minSize="7.5%"
            className="flex flex-row justify-start items-center gap-x-6 p-x-2"
          >
            <Tabs defaultValue="overview">
              <TabsList
                variant="line"
                className="flex justify-center items-center"
              >
                <TabsTrigger value="messages" className="py-0">
                  <TiMessages />
                  Messages
                </TabsTrigger>
                <TabsTrigger value="drafts">
                  <RiDraftFill />
                  Drafs
                </TabsTrigger>
                <TabsTrigger value="archived">
                  <IoMdArchive />
                  Archived
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex flex-row justify-between items-center p-3 w-full h-full">
              <span className="flex flex-row gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <IoNotifications />
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="flex flex-col min-h-[50vh] max-h-[75vh]">
                    <DialogHeader>
                      <DialogTitle>Notification Center</DialogTitle>
                      <DialogDescription>
                        This page displays notifications related to your
                        messages, chats, and account activity.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto no-scrollbar">
                      {dummyNotifications.map((notification) => (
                        <Item key={notification.id}>
                          <ItemMedia variant="icon">
                            {<notification.icon />}
                          </ItemMedia>

                          <ItemContent>
                            <ItemTitle>{notification.title}</ItemTitle>
                            <ItemDescription>
                              {notification.description}
                            </ItemDescription>
                          </ItemContent>

                          <ItemActions>
                            <Button
                              variant="link"
                              className="text-amber-500"
                              size="sm"
                            >
                              View
                            </Button>
                          </ItemActions>
                        </Item>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <IoMdOptions />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-40" align="start">
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        New group
                        <DropdownMenuShortcut>
                          <MdOutlineGroupAdd size={5} />
                        </DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Starred messages
                        <DropdownMenuShortcut>
                          <FaStar size={5} />
                        </DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Select chats
                        <DropdownMenuShortcut>
                          <GiCheckMark />
                        </DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          Invite users
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem className="flex flex-row justify-between items-center">
                              Email
                              <MdOutlineMailOutline />
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex flex-row justify-between items-center">
                              Message
                              <TiMessages />
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </span>
              <Button
                className="bg-red-500/70 font-sans text-neutral-200 tracking-wide"
                size="sm"
              >
                Sign Out <LuLogOut />
              </Button>
            </div>
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel defaultSize="90%">
            <ResizablePanelGroup orientation="horizontal">
              <ResizablePanel defaultSize="35%" maxSize="35%" minSize="29%">
                <LeftChatAside />
              </ResizablePanel>

              <ResizableHandle />

              <ResizablePanel defaultSize="60%">
                <ChatMain />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </SidebarInset>
    </SidebarProvider>
  );
}
