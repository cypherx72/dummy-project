"use client";
import { useChatUI } from "./layout";
import { Button } from "@/components/ui/button";
import { IoFilter } from "react-icons/io5";
import { IoNotifications } from "react-icons/io5";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { timeFormat } from "@/lib/general-utils";

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
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";

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

export default function LeftChatAside() {
  const { chatSummaries, setActiveChatId, activeChatId } = useChatUI();
  const [position, setPosition] = useState("bottom");
  console.log(chatSummaries, activeChatId);
  return (
    <aside className="flex flex-col gap-y-4 p-4 py-7 w-full">
      <header className="flex flex-col gap-4">
        <div className="flex flex-row justify-between items-center">
          <span className="font-sans font-bold text-3xl">EduConnect</span>
          <span className="flex flex-row">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <BsThreeDotsVertical />
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
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    Log out
                    <DropdownMenuShortcut>
                      <LuLogOut />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost">
                  <IoNotifications />
                </Button>
              </DialogTrigger>

              <DialogContent className="flex flex-col min-h-[50vh] max-h-[75vh]">
                <DialogHeader>
                  <DialogTitle>Notification Center</DialogTitle>
                  <DialogDescription>
                    This page displays notifications related to your messages,
                    chats, and account activity.
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
          </span>
        </div>
        <Input type="text" placeholder="Ask EduAI or Search" />
        <div className="flex flex-wrap justify-evenly gap-2 w-full">
          <Button
            variant="secondary"
            className="px-1.5 py-1.5 rounded-sm cursor-pointer"
          >
            ---
          </Button>
          <Button
            variant="secondary"
            className="px-1.5 py-1.5 rounded-sm cursor-pointer"
          >
            ---
          </Button>
          <Button
            variant="secondary"
            className="px-1.5 py-1.5 rounded-sm cursor-pointer"
          >
            ---
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <IoFilter />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter By: </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={position}
                onValueChange={setPosition}
              >
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Priority</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuRadioItem value="high">
                        High
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="medium">
                        Medium
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="low">
                        Low
                      </DropdownMenuRadioItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuRadioItem value="pending">
                        Pending
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="completed">
                        Completed
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="null">
                        Null
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="cancelled">
                        Cancelled
                      </DropdownMenuRadioItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <section className="flex flex-col gap-3 overflow-y-auto no-scrollbar">
        {chatSummaries &&
          chatSummaries.map((chat) => {
            return (
              <Card
                onClick={() => {
                  setActiveChatId(chat.chatId);
                }} // here it must send the section to activate on the center tab
                className={`flex flex-row justify-center items-center gap-0 p-2 border-none w-full ${activeChatId === chat.chatId ? "bg-neutral-700" : ""}`}
                key={chat.chatId}
              >
                <Avatar className="size-11">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    className=""
                  />
                  <AvatarFallback>dfs</AvatarFallback>
                </Avatar>

                <CardHeader className="flex flex-col p-1 pl-3 w-full tracking-wide">
                  <CardTitle className="flex flex-row justify-between items-center w-full">
                    <span className="font-sans font-medium text-sm capitalize text-wrap">
                      {chat.course}
                    </span>
                    <span className="font-sans font-light text-xs">
                      {timeFormat(chat?.lastMessageCreatedAt)}
                    </span>
                  </CardTitle>

                  <CardContent className="flex flex-row justify-between p-0 w-full text-xs">
                    <span
                      className={`truncate font-sans tracking-wide ${chat.unreadMessageCount === 0 ? "text-neutral-400 italic" : ""}`}
                    >
                      {chat.lastMessage}
                    </span>
                    {chat?.unreadMessageCount !== 0 && (
                      <span>
                        <Badge
                          variant="default"
                          className="rounded-full font-sans font-bold"
                        >
                          {chat.unreadMessageCount}
                        </Badge>
                      </span>
                    )}
                  </CardContent>
                </CardHeader>
              </Card>
            );
          })}
      </section>
    </aside>
  );
}

{
  /*
  data reauired: 
  1. notification data 
  2. chatMetadata
   */
}
