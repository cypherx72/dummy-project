"use client";

import { useContext, createContext } from "react";
import { TaskUIContextType } from "@/app/tasks/_utils/taskTypes";

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
