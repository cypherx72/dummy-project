"use client";

import { Fragment, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BsReplyAllFill } from "react-icons/bs";
import { timeFormat } from "@/lib/general-utils";
import { LuSmilePlus } from "react-icons/lu";
import { FaPlus } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
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
import { ContextMenuSeparator } from "@radix-ui/react-context-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { ReactionPicker } from "./reaction-picker";
import { Message, Reaction } from "../types";

interface ChatMessageProps {
  message: Message;
  sender: any;
  currentUserId: string;
  showDateSeparator: boolean;
  dateString: string;
  findRepliedTo: (id: string) => Message | undefined;
  onContextMenu: (message: Message) => void;
  onOpenEditMessage: () => void;
  onOpenDeleteDialog: () => void;
  onSendReaction: (emoji: string, messageId: string, chatId: string) => void;
  onScrollToMessage: (messageId: string) => void;
  highlightedMessageId: string | null;
  setHighlightedMessageId: (id: string | null) => void;
  reactionPickerMessageId: string | null;
  setReactionPickerMessageId: (id: string | null) => void;
  chatId: string;
  messageId: string;
}

export function ChatMessage({
  message,
  sender,
  currentUserId,
  showDateSeparator,
  dateString,
  findRepliedTo,
  onContextMenu,
  onOpenEditMessage,
  onOpenDeleteDialog,
  onSendReaction,
  onScrollToMessage,
  highlightedMessageId,
  setHighlightedMessageId,
  reactionPickerMessageId,
  setReactionPickerMessageId,
  chatId,
}: ChatMessageProps) {
  // Helper function to reduce reactions
  const reducedReactionsPerMessage = (msg: Message) =>
    msg.reactions.reduce((acc: any, reaction) => {
      if (acc[reaction.emoji]) {
        acc[reaction.emoji] += 1;
      } else {
        acc[reaction.emoji] = 1;
      }
      return acc;
    }, {});

  // Render reactions display section
  const renderReactions = () => {
    if (!message.reactions || message.reactions.length === 0) return null;

    return (
      <div className="flex flex-row justify-between items-end w-full">
        <div className="flex flex-row justify-between items-end gap-2 w-full">
          <div
            className={`flex flex-row justify-start items-center w-auto p-1 rounded-lg ${
              message.reactions.length > 0 ? "border-1" : ""
            }`}
          >
            <div className="flex flex-row flex-nowrap items-center gap-1">
              {Object.entries(reducedReactionsPerMessage(message)).map(
                ([emoji, count], idx: number) =>
                  idx < 4 && (
                    <span
                      key={emoji}
                      className="flex flex-row items-center bg-neutral-700 hover:bg-neutral-600 p-0.5 pr-1 rounded-md text-sm cursor-pointer"
                    >
                      {emoji}
                      <p className="font-sans text-xs">{count}</p>
                    </span>
                  ),
              )}
              {Object.entries(reducedReactionsPerMessage(message)).length >
                4 && (
                <Button size="icon" variant="secondary" className="size-6">
                  <FaPlus />
                </Button>
              )}
            </div>
          </div>
          <p className="font-sans font-light text-neutral-500 text-xs">
            {timeFormat(message.createdAt)}
          </p>
        </div>
      </div>
    );
  };

  // Render reply section
  const renderReplySection = () => {
    if (!message.replyToId) return null;

    const repliedToMessage = findRepliedTo(message.replyToId);

    return (
      <Button
        variant="ghost"
        size="lg"
        onClick={() => {
          setHighlightedMessageId(repliedToMessage?.id || null);
          requestAnimationFrame(() => {
            document
              .getElementById(`message-${repliedToMessage?.id}`)
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
          <BsReplyAllFill className="" />
          <span className="flex flex-row justify-between items-start w-full font-sans font-semibold text-xs tracking-wide">
            <p>
              {sender?.name} replied to {repliedToMessage?.sender?.name}
            </p>
          </span>
        </span>
        <p className="bg-neutral-700 p-1 rounded-md max-w-4/5 font-sans text-neutral-500 text-sm truncate tracking-wide">
          {repliedToMessage?.content}
        </p>
      </Button>
    );
  };

  // Render media message
  if (message.media) {
    return (
      <Fragment>
        {showDateSeparator && (
          <div className="my-4 text-neutral-500 text-xs text-center">
            {dateString}
          </div>
        )}
        <ContextMenu>
          <ContextMenuTrigger>
            <HoverCard openDelay={10} closeDelay={100}>
              <HoverCardTrigger asChild>
                <div className="flex flex-col gap-0 pl-11 w-3/5">
                  {renderReplySection()}
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
                  {message.media && (
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
                  {message.content && (
                    <span className="flex flex-col justify-center items-center gap-y-2 bg-neutral-900 px-3 py-1 rounded-2xl rounded-t-none">
                      <span className="flex flex-row justify-between items-center p-0 w-full">
                        <p className="p-0 pr-10 font-sans text-sm">
                          {message.content}
                        </p>
                        {!message.reactions?.length && (
                          <p className="font-sans font-light text-neutral-500 text-xs">
                            {timeFormat(message.createdAt)}
                          </p>
                        )}
                      </span>
                      {message.reactions?.length > 0 && renderReactions()}
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
                  onClick={() => setReactionPickerMessageId(message.id)}
                />
              </HoverCardContent>
            </HoverCard>
            {reactionPickerMessageId === message.id && (
              <div className="bottom-42 left-90 z-50">
                <ReactionPicker
                  onSelectEmoji={(emoji: string) => {
                    onSendReaction(emoji, message.id, chatId);
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
      </Fragment>
    );
  }

  // Render text message
  return (
    <Fragment>
      {showDateSeparator && (
        <div className="my-4 text-neutral-500 text-xs text-center">
          {dateString}
        </div>
      )}
      <ContextMenu>
        <ContextMenuTrigger
          onContextMenu={() => onContextMenu(message)}
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
                {renderReplySection()}
                <div className="flex flex-row items-center gap-2">
                  <Card
                    className={`flex p-0 flex-row gap-x-9 w-full border-none bg-neutral-800 pt-2${
                      sender?.id === currentUserId
                        ? ""
                        : "bg-accent shadow-none"
                    }`}
                  >
                    <CardHeader className="px-1 py-0">
                      <Avatar>
                        <AvatarImage
                          src="https://github.com/shadcn.png"
                          alt="@shadcn"
                        />
                        <AvatarFallback className="bg-white/30">
                          {sender?.name
                            ?.split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-0 bg-neutral-900 m-0 p-0 rounded-xl w-full text-sm tracking-wide">
                      <span className="flex flex-row justify-between items-center">
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
                          {!message.reactions?.length && (
                            <p className="font-sans font-light text-neutral-500 text-xs">
                              {timeFormat(message.createdAt)}
                            </p>
                          )}
                        </span>
                        {message.reactions?.length > 0 && renderReactions()}
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

          {reactionPickerMessageId === message.id && (
            <div className="bottom-42 left-90 z-50">
              <ReactionPicker
                onSelectEmoji={(emoji: string) => {
                  onSendReaction(emoji, message.id, chatId);
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
                onContextMenu(message);
                onOpenEditMessage();
              }}
            >
              Edit message
            </ContextMenuItem>
            <ContextMenuItem
              variant="destructive"
              onClick={() => {
                onContextMenu(message);
                onOpenDeleteDialog();
              }}
            >
              Delete
            </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuItem>Star </ContextMenuItem>
            <ContextMenuItem>Pin</ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
    </Fragment>
  );
}
