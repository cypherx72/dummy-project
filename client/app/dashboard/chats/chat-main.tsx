"use client";

import { MessageInput } from "./message-input";
import { useChatUI } from "@/app/dashboard/chats/layout";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { timeFormat } from "@/lib/general-utils";
import { DateSeparator } from "@/components/chat/date-seperator";
import { Fragment, useRef } from "react";
import { GoDotFill } from "react-icons/go";
import { PiPhoneCallBold } from "react-icons/pi";
import { FaPlus } from "react-icons/fa";
import { SiGooglemeet } from "react-icons/si";
import { FaVideo } from "react-icons/fa";
import { IoMdContacts } from "react-icons/io";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { BsReplyAllFill } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { LuSmilePlus } from "react-icons/lu";
import { ReactionPicker } from "./reaction-picker";
import { useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { MdSearch } from "react-icons/md";
import { ThreeDots } from "./three-dots";
import { ContextMenuSeparator } from "@radix-ui/react-context-menu";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { DeleteDialog } from "./context-menu/dialogs";
import { cn } from "@/lib/utils";
import { FaAngleDoubleDown } from "react-icons/fa";

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
    setMessageNotification,
    messageNotification,
    editMessage,
  } = useChatUI();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const topRef = useRef<HTMLDivElement | null>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);

  const [reactionPickerMessageId, setReactionPickerMessageId] = useState<
    string | null
  >(null);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      editMessageValue: "",
    },
  });

  const [highlightedMessageId, setHighlightedMessageId] = useState<
    string | null
  >(null);

  // pagination
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
    if (!activeChatId || !chatView) return;

    const { scrollHeight, scrollTop, clientHeight } = chatView;
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

    // by default open last msg if there are no new messages
    if (messageNotification[activeChatId]?.unreadCount === 0) {
      bottomRef.current?.scrollIntoView({
        behavior: "auto",
      });
      return;
    }

    // scroll to the last new message

    if (
      messageNotification[activeChatId]?.unreadCount > 0 &&
      distanceFromBottom < SCROLL_THRESHOLD
    ) {
      setMessageNotification((prev) => ({
        ...prev,
        [activeChatId]: {
          ...prev[activeChatId],
          unreadCount: 0,
        },
      }));
      chatView.scrollTo({
        top: scrollHeight,
        behavior: "smooth",
      });
    }
  }, [activeChatId, messageNotification, setMessageNotification]);

  if (!activeChatId) {
    return <p>nothing to render yet click on the .... </p>;
  }

  const chat = messagesByChatId[activeChatId as string];
  console.log(chat);

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
    const messageId = messageNotification[activeChatId].messageId;

    requestAnimationFrame(() => {
      document.getElementById(`message-${messageId}`)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    setMessageNotification((prev) => ({
      ...prev,
      [activeChatId]: {
        ...prev[activeChatId],
        unreadCount: 0,
      },
    }));
  };

  return (
    <section
      key={activeChatId}
      className="relative flex flex-col bg-muted p-0 border-none w-full h-full justifty-between"
    >
      <Card
        className="z-50 flex flex-row justify-between items-center gap-6 p-2.5 pr-4 rounded-none"
        onClick={() => setOpenRightChatAside((prev: boolean) => !prev)}
      >
        <CardHeader className="flex flex-row items-center gap-2 p-0 w-full">
          <Avatar className="size-10">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="@shadcn"
              className="grayscale"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <CardTitle>
            <p className="font-sans font-bold text-xl truncate">
              Discrete Mathematics
            </p>

            {typingUser[activeChatId]?.length > 0 ? (
              <div className="flex flex-row flex-wrap items-center gap-12">
                <div className="flex gap-1 -space-x-1 *:data-[slot=avatar]:grayscale-0 *:data-[slot=avatar]:ring-1 *:data-[slot=avatar]:ring-amber-500 max-w-1/2">
                  {typingUser[activeChatId].map((user, idx: number) => {
                    return (
                      <Avatar key={idx} className="size-5">
                        <AvatarImage
                          src="https://github.com/shadcn.png"
                          alt=""
                        />
                        <AvatarFallback>LR</AvatarFallback>
                      </Avatar>
                    );
                  })}
                  <ThreeDots />
                </div>
              </div>
            ) : (
              <span className="flex flex-row items-center gap-4 font-sans font-light text-xs">
                <p>50 Members</p>
                <p className="flex flex-row items-center text-green-500">
                  <GoDotFill /> 17 online
                </p>
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardAction className="flex flex-row justify-evenly items-center gap-x-2 p-0">
          <Button variant="secondary">
            <MdSearch />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">
                <FaVideo />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <SiGooglemeet />
                Join Meeting
              </DropdownMenuItem>
              <DropdownMenuItem disabled variant="destructive">
                <SiGooglemeet />
                Schedule Meeting
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="secondary">
            <PiPhoneCallBold />
          </Button>
          <Button variant="secondary">
            <IoMdContacts />
          </Button>
        </CardAction>
      </Card>
      <section
        className="relative flex flex-col flex-1 gap-y-4 bg-none pb-4 w-full overflow-auto no-scrollbar"
        id="chat-main"
        ref={chatRef}
      >
        <div ref={topRef} />
        {chat?.map((message, idx: number) => {
          const sender = message.sender;

          const reducedReactionsPerMessage = (message: any) =>
            message.reactions.reduce((acc: any, reaction) => {
              if (acc[reaction.emoji]) {
                acc[reaction.emoji] += 1;
              } else {
                acc[reaction.emoji] = 1;
              }
              return acc;
            }, {});

          const showDateSeparator =
            idx === 0 ||
            new Date(Date.parse(message.createdAt)).toDateString() !==
              new Date(Date.parse(chat[idx - 1].createdAt)).toDateString();

          return (
            <Fragment key={message.id}>
              {showDateSeparator && <DateSeparator date={message.createdAt} />}
              {message?.media ? (
                <ContextMenu>
                  <ContextMenuTrigger>
                    <HoverCard openDelay={10} closeDelay={100}>
                      <HoverCardTrigger asChild>
                        <div className="flex flex-col gap-0 pl-11 w-3/5">
                          {message?.replyToId && (
                            <div className="flex flex-col justify-center items-start gap-y-0 py-0 pr-6 pl-11 w-full">
                              <span className="flex flex-row gap-x-1 w-full text-neutral-500 items">
                                <BsReplyAllFill className="" />{" "}
                                <span className="flex flex-row justify-between items-start w-full font-sans font-semibold text-xs tracking-wide">
                                  <p>
                                    {sender?.name} replied to{" "}
                                    {
                                      findRepliedTo(message?.replyToId)?.sender
                                        ?.name
                                    }
                                  </p>
                                </span>
                              </span>

                              <p className="bg-neutral-700 p-1 rounded-md max-w-4/5 font-sans text-neutral-500 text-sm truncate tracking-wide">
                                {findRepliedTo(message?.replyToId)?.content}
                              </p>
                            </div>
                          )}
                          <span className="flex flex-row justify-between items-center gap-x-1 bg-neutral-900 m-0 p-2 py-1.5 rounded-lg rounded-b-none font-sans text-xs tracking-wider">
                            <p>
                              <Link
                                href="#"
                                className="pl-1 text-amber-500 hover:text-amber-500/90 underline"
                              >
                                @{sender?.name}
                              </Link>{" "}
                              shared post.
                            </p>
                          </span>
                          {message?.media && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="relative w-full min-h-[170px] max-h-[320px] overflow-hidden">
                                  <Image
                                    src={message.media.cloudinary_url as string}
                                    alt=""
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <span>
                                  <p>Image data</p>
                                </span>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          {message?.content && (
                            <span className="flex flex-col justify-center items-center gap-y-2 bg-neutral-900 px-3 py-1 rounded-2xl rounded-t-none">
                              <span className="flex flex-row justify-between items-center p-0 w-full">
                                <p className="p-0 pr-10 font-sans text-sm">
                                  {message.content}
                                </p>
                                {!(message?.reactions?.length > 0) && (
                                  <p className="font-sans font-light text-neutral-500 text-xs">
                                    {timeFormat(message.createdAt)}
                                  </p>
                                )}
                              </span>
                              {message?.reactions?.length > 0 && (
                                <div className="flex flex-row justify-between items-end w-full">
                                  <div className="flex flex-row justify-between items-end gap-2 w-full">
                                    <div
                                      className={`flex flex-row justify-start items-center w-auto p-1 rounded-lg ${
                                        message.reactions.length > 0
                                          ? "border-1"
                                          : ""
                                      }`}
                                    >
                                      {message?.reactions?.length > 0 && (
                                        <div className="flex flex-row flex-nowrap items-center gap-1">
                                          {Object.entries(
                                            reducedReactionsPerMessage(message),
                                          ).map(
                                            ([emoji, count], idx: number) =>
                                              idx < 4 && (
                                                <span
                                                  key={emoji}
                                                  className="flex flex-row items-center bg-neutral-700 hover:bg-neutral-600 p-0.5 pr-1 rounded-md text-sm cursor-pointer"
                                                >
                                                  {emoji}
                                                  <p className="font-sans text-xs">
                                                    {count}
                                                  </p>
                                                </span>
                                              ),
                                          )}
                                          {Object.entries(
                                            reducedReactionsPerMessage(message),
                                          ).length > 4 && (
                                            <Button
                                              size="icon"
                                              variant="secondary"
                                              className="size-6"
                                            >
                                              <FaPlus />
                                            </Button>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                    <p className="font-sans font-light text-neutral-500 text-xs">
                                      {timeFormat(message.createdAt)}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </span>
                          )}
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent
                        side="right"
                        align="center"
                        sideOffset={8}
                        avoidCollisions={true}
                        className="z-10 p-0 border-0 w-0"
                      >
                        <LuSmilePlus
                          className="bg-neutral-700 hover:bg-neutral-600 p-1 rounded-md text-2xl cursor-pointer"
                          onClick={() => setReactionPickerMessageId(message.id)} //set the whole message object
                        />
                      </HoverCardContent>
                    </HoverCard>
                    {reactionPickerMessageId === message.id && (
                      <div className="bottom-42 left-90 z-50">
                        <ReactionPicker
                          onSelectEmoji={(emoji: string) => {
                            sendReaction({
                              emoji,
                              messageId: reactionPickerMessageId,
                              chatId: activeChatId,
                            });
                            setReactionPickerMessageId(null);
                          }}
                        />
                      </div>
                    )}
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuGroup>
                      <ContextMenuItem>Back</ContextMenuItem>
                      <ContextMenuItem disabled>Forward</ContextMenuItem>
                      <ContextMenuItem>Reload</ContextMenuItem>
                    </ContextMenuGroup>
                  </ContextMenuContent>
                </ContextMenu>
              ) : (
                <ContextMenu>
                  <ContextMenuTrigger
                    onContextMenu={() => setContextMenuMessageId(message)}
                    className={cn(
                      "w-1/2",
                      highlightedMessageId === message.id &&
                        "animate-[highlightFade_3s_ease-out]",
                    )}
                    id={`message-${message.id}`}
                  >
                    <HoverCard openDelay={10} closeDelay={100}>
                      <HoverCardTrigger asChild>
                        <div className="flex flex-col gap-y-1 p-0 w-full">
                          {message?.replyToId && (
                            <Button
                              variant="ghost"
                              size="lg"
                              onClick={() => {
                                const messageId = chat.find(
                                  (msg) => msg.id === message.replyToId,
                                )?.id;

                                setHighlightedMessageId(messageId);

                                requestAnimationFrame(() => {
                                  document
                                    .getElementById(`message-${messageId}`)
                                    ?.scrollIntoView({
                                      behavior: "smooth",
                                      block: "center",
                                    });
                                });

                                setTimeout(() => {
                                  setHighlightedMessageId(null);
                                }, 3000);
                              }}
                              className="flex flex-col justify-center items-start gap-y-0 py-0 pr-6 pl-11 w-full"
                            >
                              <span className="flex flex-row gap-x-1 w-full text-neutral-500 items">
                                <BsReplyAllFill className="" />{" "}
                                <span className="flex flex-row justify-between items-start w-full font-sans font-semibold text-xs tracking-wide">
                                  <p>
                                    {sender?.name} replied to{" "}
                                    {
                                      findRepliedTo(message?.replyToId)?.sender
                                        ?.name
                                    }
                                  </p>
                                </span>
                              </span>

                              <p className="bg-neutral-700 p-1 rounded-md max-w-4/5 font-sans text-neutral-500 text-sm truncate tracking-wide">
                                {findRepliedTo(message?.replyToId)?.content}
                              </p>
                            </Button>
                          )}
                          <div className="flex flex-row items-center gap-2">
                            <Card
                              key={message.id}
                              className={`flex p-0 flex-row gap-x-9 w-full border-none bg-neutral-800 pt-2${
                                sender?.id === currentUserId
                                  ? ""
                                  : "bg-accent shadow-none"
                              }`}
                            >
                              <CardHeader className="px-1 py-0">
                                <Avatar>
                                  <AvatarImage
                                    src="https://github.com/shadcn.png" // fix here and put the image
                                    alt="@shadcn"
                                  />
                                  <AvatarFallback className="bg-white/30">
                                    {sender?.name
                                      ?.split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                              </CardHeader>
                              <CardContent className="flex flex-col gap-0 bg-neutral-900 m-0 p-0 rounded-xl w-full text-sm tracking-wide">
                                <span
                                  className={`flex flex-row  justify-between items-center 
                        `}
                                >
                                  {!message.replyToId && (
                                    <div className="flex flex-row justify-between bg-neutral-950/35 px-3 py-0.5 rounded-r-lg rounded-b-none rounded-l-lg w-full text-amber-500">
                                      <Link
                                        href="#"
                                        className="font-sans font-normal text-xs hover:underline tracking-wide"
                                      >
                                        {`${sender?.name}`}
                                      </Link>
                                    </div>
                                  )}
                                </span>
                                <span className="flex flex-col justify-center items-center gap-y-2 bg-neutral-900 px-3 py-1 rounded-2xl">
                                  <span className="flex flex-row justify-between items-center p-0 w-full">
                                    <p className="p-0 pr-10 font-sans text-sm">
                                      {message.content}
                                    </p>
                                    {!(message?.reactions?.length > 0) && (
                                      <p className="font-sans font-light text-neutral-500 text-xs">
                                        {timeFormat(message.createdAt)}
                                      </p>
                                    )}
                                  </span>
                                  {message?.reactions?.length > 0 && (
                                    <div className="flex flex-row justify-between items-end w-full">
                                      <div className="flex flex-row justify-between items-end gap-2 w-full">
                                        <div
                                          className={`flex flex-row justify-start items-center w-auto p-1 rounded-lg ${
                                            message.reactions.length > 0
                                              ? "border-1"
                                              : ""
                                          }`}
                                        >
                                          {message?.reactions?.length > 0 && (
                                            <div className="flex flex-row flex-nowrap items-center gap-1">
                                              {Object.entries(
                                                reducedReactionsPerMessage(
                                                  message,
                                                ),
                                              ).map(
                                                ([emoji, count], idx: number) =>
                                                  idx < 4 && (
                                                    <span
                                                      key={emoji}
                                                      className="flex flex-row items-center bg-neutral-700 hover:bg-neutral-600 p-0.5 pr-1 rounded-md text-sm cursor-pointer"
                                                    >
                                                      {emoji}
                                                      <p className="font-sans text-xs">
                                                        {count}
                                                      </p>
                                                    </span>
                                                  ),
                                              )}
                                              {Object.entries(
                                                reducedReactionsPerMessage(
                                                  message,
                                                ),
                                              ).length > 4 && (
                                                <Button
                                                  size="icon"
                                                  variant="secondary"
                                                  className="size-6"
                                                >
                                                  <FaPlus />
                                                </Button>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                        <p className="font-sans font-light text-neutral-500 text-xs">
                                          {timeFormat(message.createdAt)}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </span>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent
                        side="right"
                        align="center"
                        sideOffset={8}
                        className="z-10 p-0 border-0 w-0"
                      >
                        <LuSmilePlus
                          className="bg-neutral-700 hover:bg-neutral-600 p-1 rounded-md text-2xl cursor-pointer"
                          onClick={() =>
                            setReactionPickerMessageId((prev) =>
                              prev === message.id ? null : message.id,
                            )
                          }
                        />
                      </HoverCardContent>
                    </HoverCard>

                    {/* reaction picker component */}
                    {reactionPickerMessageId === message.id && (
                      <div className="bottom-42 left-90 z-50">
                        <ReactionPicker
                          onSelectEmoji={(emoji: string) => {
                            sendReaction({
                              emoji,
                              messageId: reactionPickerMessageId,
                              chatId: activeChatId,
                            });
                            setReactionPickerMessageId(null);
                          }}
                        />
                      </div>
                    )}
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuGroup>
                      <ContextMenuItem>Reply</ContextMenuItem>
                      <ContextMenuItem
                        onClick={() => {
                          setOpenEditMessage(true);
                        }}
                      >
                        Edit message
                      </ContextMenuItem>
                      <ContextMenuItem
                        variant="destructive"
                        onClick={() => setOpenDeleteDialog(true)}
                      >
                        Delete{" "}
                      </ContextMenuItem>
                    </ContextMenuGroup>
                    <ContextMenuSeparator />
                    <ContextMenuGroup>
                      <ContextMenuItem>Star </ContextMenuItem>
                      <ContextMenuItem>Pin</ContextMenuItem>
                    </ContextMenuGroup>
                  </ContextMenuContent>
                </ContextMenu>
              )}
            </Fragment>
          );
        })}
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

      {messageNotification[activeChatId]?.unreadCount > 0 && (
        <div
          onClick={() => {
            scrollToMessage();
          }}
          className="right-10 bottom-10 z-50 flex flex-row abosulute"
        >
          <FaAngleDoubleDown />
          {messageNotification[activeChatId]?.unreadCount}
        </div>
      )}

      <MessageInput />
    </section>
  );
}

// [
//     {
//         "chatId": "1",
//         "course": "Data Structures",
//         "type": "course",
//         "lastMessage": "okay",
//         "lastMessageCreatedAt": "2026-01-29T16:16:37.227Z",
//         "unreadMessageCount": 1,
//         "chatName": "",
//         "avatarUrl": "",
//         "chatMemberId": "1"
//     }
// ]
