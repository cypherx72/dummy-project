export type TaskUIContextType = {
  selectedTaskId?: string;
  setSelectedTaskId: (id: string) => void;

  openCreateTask: boolean;
  setOpenCreateTask: (v: boolean) => void;

  openEditTask: boolean;
  setOpenEditTask: (v: boolean) => void;

  getUploadSignature: unknown;
  getUploadSignatureData: unknown;
  uploadConfig: unknown;
  setUploadConfig: unknown;

  createTask: unknown;
  createAssignment: unknown;

  // Dashboard (composite)
  fetchDashboardData: unknown;
  dashboardData: unknown;
  dashboardLoading: boolean;
  dashboardError: unknown;

  // Assignments list
  fetchAssignments: unknown;
  fetchAssignmentsData: unknown;
  fetchAssignmentsLoading: boolean;
  fetchAssignmentsError: unknown;

  // Upcoming events
  fetchUpcomingEvents: unknown;
  upcomingEventsData: unknown;
  upcomingEventsLoading: boolean;
  upcomingEventsError: unknown;

  // Notifications
  fetchNotifications: unknown;
  notificationsData: unknown;
  notificationsLoading: boolean;
  notificationsError: unknown;

  // Enrolled courses
  fetchEnrolledCourses: unknown;
  enrolledCoursesData: unknown;
  enrolledCoursesLoading: boolean;
  enrolledCoursesError: unknown;

  // Alarms
  fetchAlarms: unknown;
  alarmsData: unknown;
  alarmsLoading: boolean;
  alarmsError: unknown;

  // Recent emails
  fetchRecentEmails: unknown;
  recentEmailsData: unknown;
  recentEmailsLoading: boolean;
  recentEmailsError: unknown;

  // Search (debounced)
  debouncedSearch: (query: string) => void;
  searchAssignmentsData: unknown;
  searchAssignmentsLoading: boolean;
  searchAssignmentsError: unknown;

  submitAssignment: unknown;
  submitAssignmentError: unknown;
  submitAssignmentLoading: unknown;
  submitAssignmentResponse: unknown;
};

// Alias so existing imports of AssignmentUIContextType continue to work
export type AssignmentUIContextType = TaskUIContextType;

export type UploadUrlConfigType = {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
};

export type GetUploadSignatureResponse = {
  data: {
    GetUploadSignature: UploadUrlConfigType;
  };
};
