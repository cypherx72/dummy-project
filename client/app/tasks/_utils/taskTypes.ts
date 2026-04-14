export type TaskUIContextType = {
  selectedTaskId?: string;
  setSelectedTaskId: (id: string) => void;

  openCreateTask: boolean;
  setOpenCreateTask: (v: boolean) => void;

  openEditTask: boolean;
  setOpenEditTask: (v: boolean) => void;

  getUploadSignature : unknown;
  getUploadSignatureData : unknown;
  uploadConfig : unknown;
  setUploadConfig : unknown;
  fetchDashboardData : unknown;
  createTask : unknown;
  fetchAssignments : unknown;

  fetchAssignmentsData : unknown;
  fetchAssignmentsError : unknown;
  fetchAssignmentsLoading : unknown;

  dashboardData : unknown;
  dashboardLoading: boolean;
  dashboardError : unknown;
  submitAssignment : unknown;
  submitAssignmentError : unknown;
  submitAssignmentLoading : unknown;
  submitAssignmentResponse : unknown;
};

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
