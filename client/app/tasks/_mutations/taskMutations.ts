import { gql } from "@apollo/client";

export const CREATE_ASSIGNMENT = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    CreateTask(input: $input) {
      code
      message
      status
    }
  }
`;

export const CREATE_TASK = CREATE_ASSIGNMENT;

export const SUBMIT_ASSIGNMENT = gql`
  mutation SubmitAssignment($input: SubmitAssignmentInput!) {
    SubmitAssignment(input: $input) {
      code
      message
      status
    }
  }
`;

export const GET_UPLOAD_SIGNATURE = gql`
  mutation GetUploadSignature {
    GetUploadSignature {
      signature
      timestamp
      apiKey
      cloudName
      folder
    }
  }
`;
