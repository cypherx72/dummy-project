import { useLazyQuery } from "@apollo/client/react";
import {
  FETCH_DASHBOARD_DATA,
  FETCH_ASSIGNMENTS_DATA,
} from "@/app/tasks/_queries/taskQueries";
import { useEffect } from "react";
import { errorToast } from "@/components/ui/toast";

export type TaskQueriesArgs = Record<string, never>;

export const useTaskQueries = ({}: TaskQueriesArgs) => {
  const [
    fetchDashboardData,
    { data: dashboardData, loading: dashboardLoading, error: dashboardError },
  ] = useLazyQuery(FETCH_DASHBOARD_DATA);

  const [
    fetchAssignments,
    {
      data: fetchAssignmentsData,
      loading: fetchAssignmentsLoading,
      error: fetchAssignmentsError,
    },
  ] = useLazyQuery(FETCH_ASSIGNMENTS_DATA);

  useEffect(() => {
    if (dashboardError) {
      errorToast("Failed to load dashboard data. Please refresh.");
    }
  }, [dashboardError]);

  useEffect(() => {
    if (fetchAssignmentsError) {
      errorToast("Failed to load assignments. Please refresh.");
    }
  }, [fetchAssignmentsError]);

  return {
    fetchDashboardData,
    dashboardData,
    dashboardLoading,
    dashboardError,
    fetchAssignments,
    fetchAssignmentsData,
    fetchAssignmentsError,
    fetchAssignmentsLoading,
  };
};
