"use client";

import { MessageInput } from "./message-input";
import { useChatUI } from "@/context/chat/chat-context";
import { GoFileMedia } from "react-icons/go";
import { VscPinned } from "react-icons/vsc";
import { useRef, useState, useEffect } from "react";
import { MdOutlineCall } from "react-icons/md";
import { IoVideocamOutline } from "react-icons/io5";
import { GoBellSlash } from "react-icons/go";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { PiLinkSimple } from "react-icons/pi";
import { IoChatbubblesOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { DeleteDialog } from "./context-menu/dialogs";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatMessage } from "./chat-message";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { FaAngleDoubleDown } from "react-icons/fa";
import { IoIosChatbubbles } from "react-icons/io";
import { ArrowUpRightIcon } from "lucide-react";
import { AvatarImage, Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DrawerScrollableContent } from "./drawer-scrollable-content";
import { useSession } from "@/context/session-context";
import { redirect } from "next/navigation";
import { useChatMutations } from "@/app/hooks/chat/useChatMutations";

const SCROLL_THRESHOLD = 120;

export default function ChatMain() {
  const {
    activeChatId,
    typingUser,
    cursorPaginationQuery,
    openEditMessage,
    myCursorByChatId,
    chatMessages,
    contextMenuMessage,
    setOpenEditMessage,

    setContextMenuMessage,
    setMessageNotificationByChatId,
    messageNotificationByChatId,
  } = useChatUI();

  const { user } = useSession();
  const { editMessage } = useChatMutations();

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const topRef = useRef<HTMLDivElement | null>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const cursorRef = useRef<Record<string, string | null>>({});
  const [highlightedMessageId, setHighlightedMessageId] = useState<
    string | null
  >(null);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      editMessageValue: "",
    },
  });

  useEffect(() => {
    cursorRef.current = myCursorByChatId;
  }, [myCursorByChatId]);
  // Pagination
  // useEffect(() => {
  //   if (!activeChatId) return;

  //   const chat = chatMessages[activeChatId];
  //   if (!chat?.length) return;

  //   const topEl = topRef.current;
  //   const chatEl = chatRef.current;

  //   if (!topEl || !chatEl) return;

  //   const observer = new IntersectionObserver(
  //     async (entries) => {
  //       if (!entries[0].isIntersecting) return;

  //       const cursor = cursorRef.current[activeChatId];
  //       if (!cursor) return;

  //       console.log("executing pagination...");

  //       await cursorPaginationQuery({
  //         variables: {
  //           input: {
  //             chatId: activeChatId,
  //             myCursor: cursor,
  //           },
  //         },
  //       });
  //     },
  //     {
  //       root: chatEl,
  //       rootMargin: "50px 0px 0px 0px",
  //       threshold: 0,
  //     },
  //   );

  //   observer.observe(topEl);

  //   return () => observer.disconnect();
  // }, [activeChatId, chatMessages[activeChatId as string]]);

  const handleScroll = async () => {
    const chat = chatRef.current;
    if (!chat) return;

    if (chat.scrollTop < 80) {
      const cursor = cursorRef.current[activeChatId as string];
      if (!cursor) return;

      await cursorPaginationQuery({
        variables: {
          input: {
            chatId: activeChatId,
            myCursor: cursor,
          },
        },
      });
    }
  };

  useEffect(() => {
    if (contextMenuMessage) {
      reset({
        editMessageValue: contextMenuMessage?.content as string,
      });
    }
  }, [contextMenuMessage, reset]);

  useEffect(() => {
    const chatView = document.getElementById("chat-main");

    if (!activeChatId || !chatView || !user) return;

    const notifications = messageNotificationByChatId?.[activeChatId];

    if (!notifications?.length) return;

    const { scrollHeight, scrollTop, clientHeight } = chatView;
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
    console.log(notifications);
    const myNotification = notifications.find(
      (notification) => notification.chatMemberId === "1",
    );
    console.log(myNotification);

    if (!myNotification) return;

    // Case 1: message read -> jump to bottom instantly
    if (myNotification.unreadMessageCount === 0) {
      console.log("first if");

      bottomRef.current?.scrollIntoView({
        behavior: "auto",
      });

      return;
    }

    // Case 2: unread messages and user near bottom
    else if (
      myNotification.unreadMessageCount > 0 &&
      distanceFromBottom < SCROLL_THRESHOLD
    ) {
      chatView.scrollTo({
        top: scrollHeight,
        behavior: "smooth",
      });
    } else {
      const messageId = messageNotificationByChatId[activeChatId].find(
        (messageNotification) => messageNotification.chatMemberId === "1",
      )?.messageId;

      requestAnimationFrame(() => {
        document.getElementById(`message-${messageId}`)?.scrollIntoView({
          behavior: "auto",
          block: "center",
        });
      });
    }
  }, [activeChatId, messageNotificationByChatId, user]);

  if (!activeChatId) {
    return (
      <Empty className="m-auto h-full font-sans">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IoIosChatbubbles />
          </EmptyMedia>
          <EmptyTitle>Select a chat to start messaging</EmptyTitle>
          <EmptyDescription>
            Choose a conversation from the sidebar to view messages.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex-row justify-center gap-2">
          <Link
            href="#"
            className="flex flex-row items-center gap-0.5 text-blue-500 text-sm"
          >
            Learn More <ArrowUpRightIcon size={18} />
          </Link>
        </EmptyContent>
      </Empty>
    );
  }

  const chat = chatMessages[activeChatId as string];
  console.log(chat);

  const onSubmitEditMessage = ({
    editMessageValue,
  }: {
    editMessageValue: string;
  }) => {
    if (editMessageValue === contextMenuMessage?.content || !editMessageValue)
      return;

    editMessage({
      messageId: contextMenuMessage?.id as string,
      chatId: activeChatId,
      content: editMessageValue,
    });
    setContextMenuMessage(null);
  };

  const myNotification = messageNotificationByChatId?.[activeChatId]?.find(
    (n) => n.chatMemberId === "1",
  );

  const scrollToMessage = () => {
    if (!activeChatId) return;
    const messageId = messageNotificationByChatId[activeChatId].find(
      (messageNotification) => messageNotification.chatMemberId === "1",
    )?.messageId;
    requestAnimationFrame(() => {
      document.getElementById(`message-${messageId}`)?.scrollIntoView({
        behavior: "instant",
        block: "center",
      });
    });
  };

  return (
    <section
      key={activeChatId}
      className="relative flex flex-col bg-muted p-0 border-none w-full h-full"
    >
      <ResizablePanelGroup
        orientation="vertical"
        className="border w-full h-full"
      >
        <ResizablePanel
          defaultSize="8%"
          maxSize="8%"
          minSize="8%"
          className="flex flex-row justify-between items-center"
        >
          <Tabs defaultValue="overview">
            <TabsList
              variant="line"
              className="flex justify-center items-center"
            >
              <TabsTrigger value="chat">
                <IoChatbubblesOutline />
                Chat
              </TabsTrigger>{" "}
              <TabsTrigger value="media">
                <GoFileMedia />
                Media
              </TabsTrigger>{" "}
              <TabsTrigger value="links">
                <PiLinkSimple />
                Links
              </TabsTrigger>{" "}
              <TabsTrigger value="pinned">
                <VscPinned />
                Pinned
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-row justify-end items-center gap-2 p-3 w-full h-full">
            <Button size="icon-sm" variant="outline">
              <IoVideocamOutline />
            </Button>{" "}
            <Button variant="outline" size="icon-sm">
              <MdOutlineCall />
            </Button>{" "}
            <Button size="icon-sm" variant="outline">
              <GoBellSlash />
            </Button>
            <DrawerScrollableContent />
          </div>
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize="80%" maxSize="80%" minSize="80%">
          {/* Messages Container */}
          <section
            className="relative flex flex-col flex-1 gap-y-4 bg-none pb-16 w-full h-full overflow-auto no-scrollbar"
            id="chat-main"
            ref={chatRef}
            onScroll={() => handleScroll()}
          >
            <div ref={topRef} />

            {chat?.length > 0 &&
              chat?.map((message, idx: number) => {
                const showDateSeparator =
                  idx === 0 ||
                  new Date(Date.parse(message.createdAt)).toDateString() !==
                    new Date(
                      Date.parse(chat[idx - 1].createdAt),
                    ).toDateString();

                return (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    highlightedMessageId={highlightedMessageId}
                    showDateSeparator={showDateSeparator}
                    setHighlightedMessageId={setHighlightedMessageId}
                  />
                );
              })}
            {typingUser[activeChatId]?.length > 0 && (
              <div className="flex flex-row items-center gap-12">
                <div className="flex items-end gap-1.5 -space-x-1 *:data-[slot=avatar]:grayscale-0 *:data-[slot=avatar]:ring-1 *:data-[slot=avatar]:ring-amber-500 max-w-1/2">
                  {typingUser[activeChatId].map((user, idx: number) => {
                    return (
                      <Avatar key={idx} className="size-6">
                        <AvatarImage
                          src="https://github.com/shadcn.png"
                          alt=""
                        />
                        <AvatarFallback>LR</AvatarFallback>
                      </Avatar>
                    );
                  })}
                  {/* <ThreeDots /> */}
                  <div className="flex gap-0.5">
                    <Skeleton className="bg-zinc-300 rounded-full w-[0.3rem] h-[0.3rem]" />
                    <Skeleton className="bg-zinc-300 rounded-full w-[0.3rem] h-[0.3rem]" />
                    <Skeleton className="bg-zinc-300 rounded-full w-[0.3rem] h-[0.3rem]" />
                  </div>
                </div>
              </div>
            )}

            {/* Edit Message Dialog */}
            <Dialog open={openEditMessage} onOpenChange={setOpenEditMessage}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Message</DialogTitle>
                </DialogHeader>
                <div className="flex items-center gap-2">
                  <div className="flex-1 gap-2 grid">
                    <form
                      onSubmit={handleSubmit(onSubmitEditMessage)}
                      className="flex flex-col gap-2"
                    >
                      <Input
                        {...register("editMessageValue")}
                        className="flex-1 p-2 pt-1 border-none focus-visible:ring-0 min-h-8 max-h-24 font-sans text-sm align-bottom leading-6 tracking-wider"
                      />

                      <DialogFooter className="sm:justify-start">
                        <Button
                          type="submit"
                          className="bg-green-600 hover:bg-green-700 font-sans font-semibold"
                          size="sm"
                        >
                          Save
                        </Button>

                        <DialogClose asChild>
                          <Button
                            size="sm"
                            type="button"
                            className="font-sans font-semibold"
                          >
                            Close
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </form>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <DeleteDialog />

            <div ref={bottomRef} />
          </section>

          {/* Unread Messages Badge */}

          {myNotification && myNotification.unreadMessageCount > 0 && (
            <div
              onClick={scrollToMessage}
              className="right-10 bottom-10 z-70 absolute flex flex-row"
            >
              <FaAngleDoubleDown />
              {myNotification.unreadMessageCount}
            </div>
          )}

          <MessageInput />
        </ResizablePanel>
      </ResizablePanelGroup>
    </section>
  );
}
