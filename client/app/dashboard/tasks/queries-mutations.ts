import { gql } from "@apollo/client";

export const FETCH_DASHBOARD_DATA = gql`
  query GetDashboardData {
    GetDashboardData {
      status
      message
      code

      courses {
        id
        title
        code
        createdAt
      }

      assignments {
        id
        title
        dueDate
        course {
          id
          title
        }
      }

      notifications {
        id
        title
        message
        createdAt
      }

      events {
        id
        title
        location
        startDate
      }

      activities {
        id
        description
        userId
        type
        activity
        createdAt
      }

      tasks {
        id
        title
        dueTime
        completed
      }
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    CreateTask(input: $input) {
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
