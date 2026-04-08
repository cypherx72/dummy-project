export type TaskUIContextType = {
  selectedTaskId?: string;
  setSelectedTaskId: (id: string) => void;

  openCreateTask: boolean;
  setOpenCreateTask: (v: boolean) => void;

  openEditTask: boolean;
  setOpenEditTask: (v: boolean) => void;

  getUploadSignature: any;
  uploadConfig: any;
  setUploadConfig: any;
  fetchDashboardData: any;
  createTask: any;
  fetchAssignments: any;

  fetchAssignmentsData: any;
  fetchAssignmentsError: any;
  fetchAssignmentsLoading: any;
};

export type UploadUrlConfigType = {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
};

export type GetUploadSignature = {
  GetUploadSignature: UploadUrlConfigType;
};
