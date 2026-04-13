"use client";

import { useState, useEffect } from "react";
import { TaskUIContext } from "./task-context";
import { useTaskQueries } from "@/app/hooks/tasks/useTaskQueries";
import { useTaskMutations } from "@/app/hooks/tasks/useTaskMutations";
import { UploadUrlConfigType } from "@/app/dashboard/tasks/types-args";

export const TaskUIProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>(
    undefined,
  );
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [openEditTask, setOpenEditTask] = useState(false);

  const [uploadConfig, setUploadConfig] = useState<UploadUrlConfigType>(
    {} as UploadUrlConfigType,
  );

  // Initialize hooks
  const {
    fetchDashboardData,
    dashboardData,
    dashboardLoading,
    dashboardError,
    fetchAssignments,
    fetchAssignmentsData,
    fetchAssignmentsError,
    fetchAssignmentsLoading,
  } = useTaskQueries({});

  const {
    getUploadSignature,
    createTask,
    getUploadSignatureData,
    submitAssignment,
    submitAssignmentError,
    submitAssignmentLoading,
    submitAssignmentResponse,
  } = useTaskMutations({
    setUploadConfig,
  });

  return (
    <TaskUIContext
      value={{
        selectedTaskId,
        setSelectedTaskId,
        openCreateTask,
        setOpenCreateTask,
        openEditTask,
        setOpenEditTask,

        getUploadSignature,
        getUploadSignatureData,
        uploadConfig,
        setUploadConfig,

        createTask,
        fetchDashboardData,
        dashboardData,
        dashboardLoading,
        dashboardError,
        fetchAssignments,
        fetchAssignmentsData,
        fetchAssignmentsError,
        fetchAssignmentsLoading,

        submitAssignment,
        submitAssignmentError,
        submitAssignmentLoading,
        submitAssignmentResponse,
      }}
    >
      {children}
    </TaskUIContext>
  );
};
