"use client";

import { useContext, createContext } from "react";
import { TaskUIContextType } from "@/app/tasks/_utils/taskTypes";

export const AssignmentUIContext = createContext<undefined | AssignmentUIContextType>(
  undefined,
);

export const useAssignmentUI = () => {
  const ctx = useContext(AssignmentUIContext);

  if (!ctx) {
    throw new Error("Cannot ....");
  }
  return ctx;
};


export const TaskUIContext = AssignmentUIContext;
export const useTaskUI = useAssignmentUI;
