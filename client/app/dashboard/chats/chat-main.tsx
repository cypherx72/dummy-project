"use client";

import { MessageInput } from "./message-input";
import { useChatUI } from "@/app/dashboard/chats/layout";
import { GoFileMedia } from "react-icons/go";
import { VscPinned } from "react-icons/vsc";
import { useRef, useState, useEffect } from "react";
import { MdOutlineCall } from "react-icons/md";
import { IoVideocamOutline } from "react-icons/io5";
import { SlOptions } from "react-icons/sl";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useForm } from "react-hook-form";
import { DeleteDialog } from "./context-menu/dialogs";
import { GoDotFill } from "react-icons/go";
import { FaVideo } from "react-icons/fa";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { IoMdContacts } from "react-icons/io";
import { PiPhoneCallBold } from "react-icons/pi";
import { SiGooglemeet } from "react-icons/si";
import { FaAngleDoubleDown } from "react-icons/fa";
import { MessageSearchBar } from "./search-bar";
import { ThreeDots } from "./three-dots";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatMessage } from "./chat-message";
import { TiMessages } from "react-icons/ti";
import Link from "next/link";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { IoIosChatbubbles } from "react-icons/io";
import { ArrowUpRightIcon } from "lucide-react";
import { useSession } from "@/context/session-context";
const SCROLL_THRESHOLD = 120;

export default function ChatMain() {
  const {
    messagesByChatId,
    activeChatId,
    sendReaction,
    typingUser,
    fetchOlderMessages,
    setOpenRightChatAside,
    openEditMessage,
    myCursorByChatId,
    setContextMenuMessageId,
    setOpenDeleteDialog,
    contextMenuMessageId,
    setOpenEditMessage,
    setMessageNotificationByChatId,
    messageNotificationByChatId,
    editMessage,
  } = useChatUI();

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const topRef = useRef<HTMLDivElement | null>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);

  const [reactionPickerMessageId, setReactionPickerMessageId] = useState<
    string | null
  >(null);
  const [highlightedMessageId, setHighlightedMessageId] = useState<
    string | null
  >(null);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      editMessageValue: "",
    },
  });

  // Pagination
  useEffect(() => {
    if (!topRef.current || !chatRef.current || !activeChatId) return;

    const options = {
      root: chatRef.current,
      rootMargin: "50px 0px 0px 0px",
      threshold: 0,
    };

    const callback = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        fetchOlderMessages({
          activeChatId,
          myCursor: myCursorByChatId[activeChatId],
        });
      }
    };
    const observer = new IntersectionObserver(callback, options);
    observer.observe(topRef.current);

    return () => observer.disconnect();
  }, [activeChatId, fetchOlderMessages, myCursorByChatId]);

  useEffect(() => {
    if (contextMenuMessageId) {
      reset({
        editMessageValue: contextMenuMessageId.content,
      });
    }
  }, [contextMenuMessageId, reset]);

  useEffect(() => {
    const chatView = document.getElementById("chat-main");
    if (
      !activeChatId ||
      !chatView ||
      !messageNotificationByChatId ||
      !setMessageNotificationByChatId
    )
      return;

    const { scrollHeight, scrollTop, clientHeight } = chatView;
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

    console.log("trying to fix bug", messageNotificationByChatId[activeChatId]);
    if (
      messageNotificationByChatId[activeChatId].find(
        (messageNotification) =>
          messageNotification.unreadMessageCount === 0 &&
          messageNotification.chatMemberId === "1",
      )
    ) {
      console.log("first if");
      bottomRef.current?.scrollIntoView({
        behavior: "auto",
      });
      return;
    }

    if (
      messageNotificationByChatId[activeChatId].find(
        (messageNotification) =>
          messageNotification.unreadMessageCount > 0 &&
          messageNotification.chatMemberId === "1",
      ) &&
      distanceFromBottom < SCROLL_THRESHOLD
    ) {
      chatView.scrollTo({
        top: scrollHeight,
        behavior: "smooth",
      });
    }
  }, [
    activeChatId,
    messageNotificationByChatId,
    setMessageNotificationByChatId,
  ]);

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

  const chat = messagesByChatId[activeChatId as string];
  const currentUserId = "1";

  const findRepliedTo = (chatId: string) => {
    return chat?.find((message) => message.id === chatId);
  };

  const onSubmitEditMessage = ({ editMessageValue }) => {
    if (editMessageValue === contextMenuMessageId?.content || !editMessageValue)
      return;

    editMessage({
      messageId: contextMenuMessageId?.id,
      chatId: activeChatId,
      content: editMessageValue,
    });
  };

  const scrollToMessage = () => {
    if (!activeChatId) return;
    const messageId = messageNotificationByChatId[activeChatId].find(
      (messageNotification) => messageNotification.chatMemberId === "1",
    )?.messageId;

    requestAnimationFrame(() => {
      document.getElementById(`message-${messageId}`)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
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
          className="flex flex-row justify-start items-center"
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
            <Button size="icon-sm" variant="outline">
              <SlOptions />
            </Button>{" "}
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize="92%">
          {/* Messages Container */}
          <section
            className="relative flex flex-col flex-1 gap-y-4 bg-none pb-4 w-full h-full overflow-auto no-scrollbar"
            id="chat-main"
            ref={chatRef}
          >
            <div ref={topRef} />

            {chat?.map((message, idx: number) => {
              const showDateSeparator =
                idx === 0 ||
                new Date(Date.parse(message.createdAt)).toDateString() !==
                  new Date(Date.parse(chat[idx - 1].createdAt)).toDateString();

              return (
                <ChatMessage
                  key={message.id}
                  message={message}
                  sender={message.sender}
                  currentUserId={currentUserId}
                  showDateSeparator={showDateSeparator}
                  dateString={new Date(
                    Date.parse(message.createdAt),
                  ).toDateString()}
                  findRepliedTo={findRepliedTo}
                  onContextMenu={setContextMenuMessageId}
                  onOpenEditMessage={() => setOpenEditMessage(true)}
                  onOpenDeleteDialog={() => setOpenDeleteDialog(true)}
                  onSendReaction={(emoji, messageId, chatId) =>
                    sendReaction({
                      emoji,
                      messageId,
                      chatId,
                    })
                  }
                  onScrollToMessage={scrollToMessage}
                  highlightedMessageId={highlightedMessageId}
                  setHighlightedMessageId={setHighlightedMessageId}
                  reactionPickerMessageId={reactionPickerMessageId}
                  setReactionPickerMessageId={setReactionPickerMessageId}
                  chatId={activeChatId}
                  messageId={message.id}
                />
              );
            })}

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
          {messageNotificationByChatId[activeChatId].find(
            (messageNotification) =>
              messageNotification.chatMemberId === "1" &&
              messageNotification.unreadMessageCount > 0,
          ) && (
            <div
              onClick={() => {
                scrollToMessage();
              }}
              className="right-10 bottom-10 z-50 absolute flex flex-row"
            >
              <FaAngleDoubleDown />
              {
                messageNotificationByChatId[activeChatId].find(
                  (messageNotification) =>
                    messageNotification.chatMemberId === "1",
                )?.unreadMessageCount
              }
            </div>
          )}

          <MessageInput />
        </ResizablePanel>
      </ResizablePanelGroup>
    </section>
  );
}
