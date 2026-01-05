// Context for managing chat-related state and actions in the dashboard
"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { connectSocket } from "@/lib/socketIO";
import { Socket } from "socket.io-client";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

const FETCH_META_DATA = gql`
  query FetchChatMetadata($userId: String!) {
    chatMetadata: FetchChatMetadata(input: { userId: $userId }) {
      chats {
        id
        type
        title
        courseId
        createdAt
        updatedAt

        messages {
          id
          chatId
          senderId
          type
          content
          createdAt
          replyToId
        }

        chatMembers {
          id
          chatId
          userId
          role
          isMuted
          joinedAt

          user {
            id
            email
            name
          }
        }
      }
    }
  }
`;

const ChatUIContext = createContext(null);

export default function ChatProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log("SESSION STATUS:", status);
    console.log("SESSION DATA:", session);
    if (status === "unauthenticated") {
      redirect("/auth/login");
    }
  }, [status, session]);

  const [chatMetadata, setChatMetadata] = useState();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loadingChatMetadata, setLoadingChatMetadata] = useState(false);

  useEffect(() => {
    const socket = connectSocket();
    if (!socket) return;

    setSocket(socket);

    socket.on("connect", () => {
      console.log("socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("socket disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const userId = "1";

  const {
    loading: fetchingMetadata,
    data,
    error,
  } = useQuery(FETCH_META_DATA, {
    skip: !userId,
    variables: { userId },
  });
  useEffect(() => {
    console.log("loading:", fetchingMetadata);
    console.log("error:", error);
    console.log("data:", data);
  }, [fetchingMetadata, error, data]);

  // if (fetchingMetadata) setLoadingChatMetadata(true);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg: string) => {
      console.log("📩 New message received:", msg);
      //   setChatMetadata((prev) => [...prev, msg]);
    };

    socket.on("message:new", handleNewMessage);

    return () => {
      socket.off("message:new", handleNewMessage);
    };
  }, [socket]);

  // todo: type of message must be either file, string or emoji
  function sendMessage(message: string) {
    if (!socket) return;

    socket.emit("message:send", {
      chatId: "1",
      content: message,
      type: "text",
    });
  }

  // Attaching session to context value for access in child components
  return (
    <ChatUIContext.Provider
      value={{
        chatMetadata,
        setChatMetadata,
        sendMessage,
        loadingChatMetadata,
        data,
      }}
    >
      {children}
    </ChatUIContext.Provider>
  );
}

export const useChatUI = () => useContext(ChatUIContext);

/* 
  logs after userMetadata:  

  {
  chatMembers: [
    {
      id: '1',
      chatId: '1',
      userId: '1',
      role: 'student',
      isMuted: false,
      joinedAt: 2026-01-01T16:58:14.755Z,
      chat: [Object]
    }
  ]
}

  userMetadata.chatMembers[0].chat

  {
  id: '1',
  type: 'course',
  title: 'data structures',
  courseId: '1',
  createdAt: 2026-01-01T16:57:08.533Z,
  updatedAt: 2026-01-01T16:57:08.533Z,
  messages: [
    {
      id: '1',
      chatId: '1',
      senderId: '1',
      type: 'text',
      content: 'hello everyone, tavonga here',
      createdAt: 2026-01-01T16:57:44.774Z,
      replyToId: null
    }
  ],
  chatMembers: [
    {
      id: '1',
      chatId: '1',
      userId: '1',
      role: 'student',
      isMuted: false,
      joinedAt: 2026-01-01T16:58:14.755Z,
      user: [Object]
    },
    {
      id: '2',
      chatId: '1',
      userId: '2',
      role: 'student',
      isMuted: false,
      joinedAt: 2026-01-02T07:16:16.300Z,
      user: [Object]
    }
  ]
}

userMetadata.chatMembers[0].chat.chatMembers[1].user

{ id: '2', email: '31242198@vupune.ac.in', name: 'Blessed Mazambani' }

*/
