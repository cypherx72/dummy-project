"use client";

import { useContext, createContext } from "react";
import { TaskUIContextType } from "@/app/dashboard/tasks/types-args";

export const TaskUIContext = createContext<undefined | TaskUIContextType>(
  undefined,
);

export const useTaskUI = () => {
  const ctx = useContext(TaskUIContext);

  if (!ctx) {
    throw new Error("Cannot ....");
  }
  return ctx;
};
