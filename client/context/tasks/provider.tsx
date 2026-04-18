"use client";

import { useState } from "react";
import { AssignmentUIContext } from "./task-context";
import { useTaskQueries } from "@/app/hooks/tasks/useTaskQueries";
import { useTaskMutations } from "@/app/hooks/tasks/useTaskMutations";
import { UploadUrlConfigType } from "@/app/assignments/_utils/taskTypes";

export const AssignmentProvider = ({ children }: { children: React.ReactNode }) => {
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
    createAssignment,
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
    <AssignmentUIContext
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

        createAssignment,
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
    </AssignmentUIContext>
  );
};


export const TaskUIProvider = AssignmentProvider;
