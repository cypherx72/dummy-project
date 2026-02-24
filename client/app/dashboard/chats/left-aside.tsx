"use client";
import { useChatUI } from "./layout";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { timeFormat } from "@/lib/general-utils";
import { Input } from "@/components/ui/input";

export default function LeftChatAside() {
  const { chatSummaries, setActiveChatId, activeChatId } = useChatUI();

  console.log(chatSummaries);

  return (
    <aside className="flex flex-col gap-5 p-4 w-full">
      <Input type="text" placeholder="Ask EduAI or Search" />

      <section className="flex flex-col gap-3 border-none overflow-y-auto no-scrollbar">
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
