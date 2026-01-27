"use client";

import { useState } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
  CornerDownRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

/* ===================== TYPES ===================== */

interface Comment {
  id: string;
  content: string;
  timeAgo: string;
  likes: number;
  author: {
    name: string;
    username: string;
    avatar?: string;
  };
  replies?: Comment[];
}

/* ===================== DUMMY DATA ===================== */

const commentsData: Comment[] = [
  {
    id: "1",
    content:
      "This forest view brings back nostalgic camping vibes, but I’m a bit bothered by the rocks looking too geometric.",
    timeAgo: "1 hour ago",
    likes: 23,
    author: {
      name: "Ziyech",
      username: "zi",
    },
    replies: [
      {
        id: "1-1",
        content:
          "Totally agree. If the shapes were rounder, it would feel more natural.",
        timeAgo: "23 minutes ago",
        likes: 15,
        author: {
          name: "Shakira",
          username: "sh",
        },
      },
    ],
  },
  {
    id: "2",
    content:
      "I love the color palette here. The contrast between the cabin and trees works really well.",
    timeAgo: "3 hours ago",
    likes: 18,
    author: {
      name: "McTominay",
      username: "mc",
    },
  },
];

/* ===================== COMMENT ITEM ===================== */

function CommentItem({
  comment,
  isReply = false,
}: {
  comment: Comment;
  isReply?: boolean;
}) {
  const [isReplying, setIsReplying] = useState(false);

  return (
    <div className={`group flex gap-4 ${isReply ? "mt-4 relative" : "mt-8"}`}>
      {isReply && (
        <div className="top-[-92px] -left-15 absolute border-border/70 border-b-[1.5px] border-l-[1.5px] rounded-bl-4xl w-16 h-28" />
      )}

      <div className="flex flex-col items-center">
        <Avatar
          className={`border border-gray-700 bg-white  ${
            isReply ? "h-8 w-8" : "h-10 w-10"
          }`}
        >
          <AvatarImage src="https://github.com/maxleiter.png" />
          <AvatarFallback>
            {comment.author.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-2">
            <span className="font-bold hover:text-primary text-sm md:text-base cursor-pointer">
              {comment.author.name}
            </span>
            <span className="text-[11px] text-muted-foreground md:text-xs">
              {comment.timeAgo}
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 w-6 h-6"
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>

        <p className="mb-2 text-foreground/85 md:text-[15px] text-sm leading-relaxed whitespace-pre-wrap">
          {comment.content}
        </p>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-muted/40 px-1 py-0.5 border border-border/10 rounded-full">
            <Button
              variant="ghost"
              size="sm"
              className="px-2 rounded-full h-6 text-muted-foreground hover:text-primary"
            >
              <ThumbsUp className="mr-1 w-3.5 h-3.5" />
              <span className="font-bold text-[11px]">{comment.likes}</span>
            </Button>

            <Separator orientation="vertical" className="h-3" />

            <Button
              variant="ghost"
              size="sm"
              className="px-1.5 rounded-full h-6 text-muted-foreground hover:text-destructive"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsReplying(!isReplying)}
            className="h-7 font-bold text-[11px] text-primary/80 hover:text-primary"
          >
            Reply
            {comment.replies && (
              <span className="flex items-center gap-0.5 ml-1 text-muted-foreground">
                ({comment.replies.length})
                <CornerDownRight className="w-3 h-3" />
              </span>
            )}
          </Button>
        </div>

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-1 pl-5 border-transparent border-l-2">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} isReply />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ===================== PAGE ===================== */

export default function DiscussionPage() {
  return (
    <main className="mx-auto px-4 py-10 max-w-3xl">
      <h1 className="mb-6 font-bold text-2xl">Discussion</h1>

      {commentsData.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </main>
  );
}
