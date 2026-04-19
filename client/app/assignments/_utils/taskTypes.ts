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

  fetchDashboardData: unknown;
  dashboardData: unknown;
  dashboardLoading: boolean;
  dashboardError: unknown;

  fetchAssignments: unknown;
  fetchAssignmentsData: unknown;
  fetchAssignmentsLoading: boolean;
  fetchAssignmentsError: unknown;

  fetchUpcomingEvents: unknown;
  upcomingEventsData: unknown;
  upcomingEventsLoading: boolean;
  upcomingEventsError: unknown;

  fetchNotifications: unknown;
  notificationsData: unknown;
  notificationsLoading: boolean;
  notificationsError: unknown;

  fetchEnrolledCourses: unknown;
  enrolledCoursesData: unknown;
  enrolledCoursesLoading: boolean;
  enrolledCoursesError: unknown;

  fetchAlarms: unknown;
  alarmsData: unknown;
  alarmsLoading: boolean;
  alarmsError: unknown;

  fetchRecentEmails: unknown;
  recentEmailsData: unknown;
  recentEmailsLoading: boolean;
  recentEmailsError: unknown;

  debouncedSearch: (query: string) => void;
  searchAssignmentsData: unknown;
  searchAssignmentsLoading: boolean;
  searchAssignmentsError: unknown;

  submitAssignment: unknown;
  submitAssignmentError: unknown;
  submitAssignmentLoading: unknown;
  submitAssignmentResponse: unknown;

  // Teacher-specific
  fetchTeachingCourses: unknown;
  teachingCoursesData: unknown;
  teachingCoursesLoading: boolean;
  teachingCoursesError: unknown;

  fetchTeacherAssignments: unknown;
  teacherAssignmentsData: unknown;
  teacherAssignmentsLoading: boolean;
  teacherAssignmentsError: unknown;

  fetchTeacherDashboardData: unknown;
  teacherDashboardData: unknown;
  teacherDashboardLoading: boolean;
  teacherDashboardError: unknown;
};

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
