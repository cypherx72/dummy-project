export type TaskUIContextType = {
  selectedTaskId?: string;
  setSelectedTaskId: (id: string) => void;

  openCreateTask: boolean;
  setOpenCreateTask: (v: boolean) => void;

  openEditTask: boolean;
  setOpenEditTask: (v: boolean) => void;

  dashboardData?: any;
  dashboardLoading: boolean;
  dashboardError?: any;
  refetchDashboard: any;

  getUploadSignature: any;
  uploadConfig: any;
  setUploadConfig: any;

  createTask: any;
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
