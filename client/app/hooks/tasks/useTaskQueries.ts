import { useLazyQuery } from "@apollo/client/react";
import {
  FETCH_DASHBOARD_DATA,
  FETCH_ASSIGNMENTS_DATA,
} from "@/app/dashboard/tasks/queries-mutations";
import { useEffect } from "react";

export type TaskQueriesArgs = {};

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
      console.log("error in fetching datasbhoard data: ", dashboardError);
    }
  }, [dashboardError]);

  useEffect(() => {
    if (dashboardData) {
      console.log("lading in fetching datasbhoard data: ", dashboardData);
    }
  }, [dashboardData]);

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
