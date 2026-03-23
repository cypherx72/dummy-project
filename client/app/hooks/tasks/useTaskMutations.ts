import {
  GET_UPLOAD_SIGNATURE,
  CREATE_TASK,
} from "@/app/dashboard/tasks/queries-mutations";
import { useMutation } from "@apollo/client/react";
import React, { useEffect } from "react";
import {
  GetUploadSignature,
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
  ] = useMutation<GetUploadSignature>(GET_UPLOAD_SIGNATURE);

  useEffect(() => {
    console.log(getUploadSignatureData);
    if (getUploadSignatureData) {
      setUploadConfig(getUploadSignatureData.GetUploadSignature);
    }
  }, [getUploadSignatureData, setUploadConfig]);

  const [createTask, { data, loading, error }] = useMutation(CREATE_TASK);

  useEffect(() => {
    console.log(data, loading, error);
  }, [data, loading, error]);

  return {
    getUploadSignature,
    getUploadSignatureError,
    getUploadSignatureLoading,
    createTask,
  };
};
