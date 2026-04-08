import { useLazyQuery } from "@apollo/client/react";
import {
  FETCH_DASHBOARD_DATA,
  FETCH_ASSIGNMENTS_DATA,
} from "@/app/dashboard/tasks/queries-mutations";

export type TaskQueriesArgs = {};

export const useTaskQueries = ({}: TaskQueriesArgs) => {
  const [fetchDashboardData] = useLazyQuery(FETCH_DASHBOARD_DATA);

  const [
    fetchAssignments,
    {
      data: fetchAssignmentsData,
      loading: fetchAssignmentsLoading,
      error: fetchAssignmentsError,
    },
  ] = useLazyQuery(FETCH_ASSIGNMENTS_DATA);

  return {
    fetchDashboardData,
    fetchAssignments,
    fetchAssignmentsData,
    fetchAssignmentsError,
    fetchAssignmentsLoading,
  };
};
