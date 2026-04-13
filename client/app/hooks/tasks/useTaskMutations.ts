import {
  GET_UPLOAD_SIGNATURE,
  CREATE_TASK,
  SUBMIT_ASSIGNMENT,
} from "@/app/dashboard/tasks/queries-mutations";
import { useMutation } from "@apollo/client/react";
import React, { useEffect } from "react";
import {
  GetUploadSignatureResponse,
  UploadUrlConfigType,
} from "@/app/dashboard/tasks/types-args";

export type useTaskMutationsTypes = {
  setUploadConfig: React.Dispatch<React.SetStateAction<UploadUrlConfigType>>;
};

export const useTaskMutations = ({
  setUploadConfig,
}: useTaskMutationsTypes) => {
  const [
    getUploadSignature,
    {
      data: getUploadSignatureData,
      loading: getUploadSignatureLoading,
      error: getUploadSignatureError,
    },
  ] = useMutation<GetUploadSignatureResponse>(GET_UPLOAD_SIGNATURE);

  useEffect(() => {
    const config = getUploadSignatureData?.data?.GetUploadSignature;

    if (config) {
      setUploadConfig(config);
    }
  }, [getUploadSignatureData, setUploadConfig]);

  const [createTask, { data, loading, error }] = useMutation(CREATE_TASK);

  const [
    submitAssignment,
    {
      data: submitAssignmentResponse,
      loading: submitAssignmentLoading,
      error: submitAssignmentError,
    },
  ] = useMutation(SUBMIT_ASSIGNMENT);

  useEffect(() => {
    console.log("submitAssignmentError", submitAssignmentError);
    console.log("submitAssignmnetData... : ", submitAssignmentResponse);

    console.log();
  }, [
    submitAssignmentError,
    submitAssignmentResponse,
    submitAssignmentLoading,
  ]);

  useEffect(() => {
    console.log(data, loading, error);
  }, [data, loading, error]);

  return {
    getUploadSignature,
    getUploadSignatureData,
    getUploadSignatureError,
    getUploadSignatureLoading,
    createTask,

    submitAssignment,
    submitAssignmentError,
    submitAssignmentLoading,
    submitAssignmentResponse,
  };
};
