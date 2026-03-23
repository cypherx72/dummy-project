"use client";
import { useChatUI } from "@/context/chat/chat-context";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { timeFormat } from "@/lib/general-utils";
import { Input } from "@/components/ui/input";

export default function LeftChatAside() {
  const { chatSummary, setActiveChatId, activeChatId, chatMessages } =
    useChatUI();

  const { loadChatMessages } = useChatUI();
  return (
    <aside className="flex flex-col gap-5 p-4 w-full font-sans">
      <Input type="text" placeholder="Ask EduAI or Search" />

      <section className="flex flex-col gap-3 border-none overflow-y-auto no-scrollbar">
        {chatSummary &&
          chatSummary.map((chat) => {
            return (
              <Card
                onClick={() => {
                  setActiveChatId(chat.id);

                  if (!chatMessages[activeChatId as string]) loadChatMessages();
                }}
                className={`flex flex-row justify-center h-18 items-center gap-0 p-2 border-none w-full ${activeChatId === chat.id ? "bg-neutral-700" : ""}`}
                key={chat.id}
              >
                <Avatar className="size-11">
                  <AvatarImage
                    src={chat.imageUrl || undefined}
                    className="object-cover"
                  />
                  <AvatarFallback>{}</AvatarFallback>
                </Avatar>

                <CardHeader className="flex flex-col items-start p-1 pl-3 w-full h-full tracking-wide">
                  <CardTitle className="flex flex-row justify-between items-center gap-3 w-full">
                    <span className="font-medium text-sm truncate capitalize">
                      {chat.courseName}
                    </span>
                    <span className="font-light text-xs">
                      {timeFormat(chat.lastMessage?.createdAt as string)}
                    </span>
                  </CardTitle>

                  <CardContent className="flex flex-row justify-between p-0 w-full text-xs">
                    <span
                      className={`truncate tracking-wide ${chat.unreadMessageCount === 0 ? "text-neutral-400 italic" : ""}`}
                    >
                      {chat.lastMessage?.content}
                    </span>
                    {chat?.unreadMessageCount !== 0 && (
                      <span>
                        <Badge
                          variant="default"
                          className="rounded-full font-bold"
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
