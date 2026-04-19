import {
  FETCH_DASHBOARD_DATA,
  FETCH_ASSIGNMENTS_DATA,
  FETCH_UPCOMING_EVENTS,
  FETCH_NOTIFICATIONS,
  FETCH_ENROLLED_COURSES,
  FETCH_ALARMS,
  FETCH_RECENT_EMAILS,
  SEARCH_ASSIGNMENTS,
  FETCH_TEACHING_COURSES,
  FETCH_TEACHER_ASSIGNMENTS,
  FETCH_TEACHER_DASHBOARD_DATA,
} from "@/app/assignments/_queries/taskQueries";
import { useLazyQuery } from "@apollo/client/react";
import { useEffect, useMemo } from "react";
import { errorToast } from "@/components/ui/toast";

function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

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

  const [
    fetchUpcomingEvents,
    {
      data: upcomingEventsData,
      loading: upcomingEventsLoading,
      error: upcomingEventsError,
    },
  ] = useLazyQuery(FETCH_UPCOMING_EVENTS);

  const [
    fetchNotifications,
    {
      data: notificationsData,
      loading: notificationsLoading,
      error: notificationsError,
    },
  ] = useLazyQuery(FETCH_NOTIFICATIONS);

  const [
    fetchEnrolledCourses,
    {
      data: enrolledCoursesData,
      loading: enrolledCoursesLoading,
      error: enrolledCoursesError,
    },
  ] = useLazyQuery(FETCH_ENROLLED_COURSES);

  const [
    fetchAlarms,
    { data: alarmsData, loading: alarmsLoading, error: alarmsError },
  ] = useLazyQuery(FETCH_ALARMS);

  const [
    fetchRecentEmails,
    {
      data: recentEmailsData,
      loading: recentEmailsLoading,
      error: recentEmailsError,
    },
  ] = useLazyQuery(FETCH_RECENT_EMAILS);

  const [
    searchAssignmentsQuery,
    {
      data: searchAssignmentsData,
      loading: searchAssignmentsLoading,
      error: searchAssignmentsError,
    },
  ] = useLazyQuery(SEARCH_ASSIGNMENTS);

  // ── Teacher-specific ──────────────────────────────────────────────────────
  const [
    fetchTeachingCourses,
    {
      data: teachingCoursesData,
      loading: teachingCoursesLoading,
      error: teachingCoursesError,
    },
  ] = useLazyQuery(FETCH_TEACHING_COURSES);

  const [
    fetchTeacherAssignments,
    {
      data: teacherAssignmentsData,
      loading: teacherAssignmentsLoading,
      error: teacherAssignmentsError,
    },
  ] = useLazyQuery(FETCH_TEACHER_ASSIGNMENTS);

  const [
    fetchTeacherDashboardData,
    {
      data: teacherDashboardData,
      loading: teacherDashboardLoading,
      error: teacherDashboardError,
    },
  ] = useLazyQuery(FETCH_TEACHER_DASHBOARD_DATA);
  // ─────────────────────────────────────────────────────────────────────────

  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        if (!query.trim()) return;
        searchAssignmentsQuery({ variables: { query } });
      }, 500),
    [searchAssignmentsQuery],
  );

  useEffect(() => {
    if (dashboardError)
      errorToast("Failed to load dashboard data. Please refresh.");
  }, [dashboardError]);

  useEffect(() => {
    if (fetchAssignmentsError)
      errorToast("Failed to load assignments. Please refresh.");
  }, [fetchAssignmentsError]);

  useEffect(() => {
    if (upcomingEventsError)
      errorToast("Failed to load upcoming events. Please refresh.");
  }, [upcomingEventsError]);

  useEffect(() => {
    if (notificationsError)
      errorToast("Failed to load notifications. Please refresh.");
  }, [notificationsError]);

  useEffect(() => {
    if (enrolledCoursesError)
      errorToast("Failed to load courses. Please refresh.");
  }, [enrolledCoursesError]);

  useEffect(() => {
    if (alarmsError) errorToast("Failed to load alerts. Please refresh.");
  }, [alarmsError]);

  useEffect(() => {
    if (recentEmailsError) errorToast("Failed to load emails. Please refresh.");
  }, [recentEmailsError]);

  useEffect(() => {
    if (teachingCoursesError)
      errorToast("Failed to load teaching courses. Please refresh.");
  }, [teachingCoursesError]);

  useEffect(() => {
    if (teacherAssignmentsError)
      errorToast("Failed to load teacher assignments. Please refresh.");
  }, [teacherAssignmentsError]);

  useEffect(() => {
    if (teacherDashboardError)
      errorToast("Failed to load teacher dashboard. Please refresh.");
  }, [teacherDashboardError]);

  return {
    fetchDashboardData,
    dashboardData,
    dashboardLoading,
    dashboardError,

    fetchAssignments,
    fetchAssignmentsData,
    fetchAssignmentsLoading,
    fetchAssignmentsError,

    fetchUpcomingEvents,
    upcomingEventsData,
    upcomingEventsLoading,
    upcomingEventsError,

    fetchNotifications,
    notificationsData,
    notificationsLoading,
    notificationsError,

    fetchEnrolledCourses,
    enrolledCoursesData,
    enrolledCoursesLoading,
    enrolledCoursesError,

    fetchAlarms,
    alarmsData,
    alarmsLoading,
    alarmsError,

    fetchRecentEmails,
    recentEmailsData,
    recentEmailsLoading,
    recentEmailsError,

    debouncedSearch,
    searchAssignmentsData,
    searchAssignmentsLoading,
    searchAssignmentsError,

    // Teacher-specific
    fetchTeachingCourses,
    teachingCoursesData,
    teachingCoursesLoading,
    teachingCoursesError,

    fetchTeacherAssignments,
    teacherAssignmentsData,
    teacherAssignmentsLoading,
    teacherAssignmentsError,

    fetchTeacherDashboardData,
    teacherDashboardData,
    teacherDashboardLoading,
    teacherDashboardError,
  };
};
