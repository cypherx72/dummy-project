import { useQuery, useLazyQuery } from "@apollo/client/react";
import { FETCH_DASHBOARD_DATA } from "@/app/dashboard/tasks/queries-mutations";

export type TaskQueriesArgs = {};

export const useTaskQueries = ({}: TaskQueriesArgs) => {
  const {
    data: dashboardData,
    loading: dashboardLoading,
    error: dashboardError,
    refetch: refetchDashboard,
  } = useQuery(FETCH_DASHBOARD_DATA);

  return {
    dashboardData,
    dashboardError,
    dashboardLoading,
    refetchDashboard,
  };
};
