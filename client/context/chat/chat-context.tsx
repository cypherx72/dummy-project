"use client";
import { createContext, useContext } from "react";
import { ChatUIContextType } from "@/app/dashboard/types-args";

export const ChatUIContext = createContext<ChatUIContextType | undefined>(
  undefined,
);

export const useChatUI = () => {
  const ctx = useContext(ChatUIContext);
  if (!ctx) {
    throw new Error("useChatUI must be used within ChatProvider");
  }
  return ctx;
};
