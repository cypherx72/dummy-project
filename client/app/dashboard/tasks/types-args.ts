export type TaskUIContextType = {
  selectedTaskId?: string;
  setSelectedTaskId: (id: string) => void;

  openCreateTask: boolean;
  setOpenCreateTask: (v: boolean) => void;

  openEditTask: boolean;
  setOpenEditTask: (v: boolean) => void;

  getUploadSignature: any;
  getUploadSignatureData: any;
  uploadConfig: any;
  setUploadConfig: any;
  fetchDashboardData: any;
  createTask: any;
  fetchAssignments: any;

  fetchAssignmentsData: any;
  fetchAssignmentsError: any;
  fetchAssignmentsLoading: any;

  dashboardData: any;
  dashboardLoading: boolean;
  dashboardError: any;
  submitAssignment: any;
  submitAssignmentError: any;
  submitAssignmentLoading: any;
  submitAssignmentResponse: any;
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
