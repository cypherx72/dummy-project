import {
  GET_UPLOAD_SIGNATURE,
  CREATE_TASK,
  SUBMIT_ASSIGNMENT,
} from "@/app/tasks/_mutations/taskMutations";
import { useMutation } from "@apollo/client/react";
import React, { useEffect } from "react";
import {
  GetUploadSignatureResponse,
  UploadUrlConfigType,
} from "@/app/tasks/_utils/taskTypes";
import { showToast, errorToast } from "@/components/ui/toast";

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

  useEffect(() => {
    if (getUploadSignatureError) {
      errorToast("Failed to retrieve upload credentials. Please try again.");
    }
  }, [getUploadSignatureError]);

  const [createAssignment, { data, loading, error }] = useMutation(CREATE_TASK);

  const [
    submitAssignment,
    {
      data: submitAssignmentResponse,
      loading: submitAssignmentLoading,
      error: submitAssignmentError,
    },
  ] = useMutation(SUBMIT_ASSIGNMENT);

  useEffect(() => {
    if (submitAssignmentError) {
      errorToast("Failed to submit assignment. Please try again.");
    }
    if (submitAssignmentResponse?.SubmitAssignment?.status === 200) {
      showToast("Assignment submitted!", "Your work has been submitted successfully.", "success");
    }
  }, [submitAssignmentError, submitAssignmentResponse, submitAssignmentLoading]);

  useEffect(() => {
    if (error) {
      errorToast("Failed to create assignment. Please try again.");
    }
    if (data?.CreateAssignment?.status === 200) {
      showToast("Assignment created!", "The assignment has been posted to students.", "success");
    }
  }, [data, loading, error]);

  return {
    getUploadSignature,
    getUploadSignatureData,
    getUploadSignatureError,
    getUploadSignatureLoading,
    createAssignment,
    createTask: createAssignment,

    submitAssignment,
    submitAssignmentError,
    submitAssignmentLoading,
    submitAssignmentResponse,
  };
};
