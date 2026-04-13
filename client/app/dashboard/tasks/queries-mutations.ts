/**
 * NAMING CONVENTION (resolved)
 * ─────────────────────────────
 * Server / Prisma model : Assignment
 * GraphQL mutation name : CreateTask  (legacy – kept to avoid schema churn)
 * Client GQL constant   : CREATE_ASSIGNMENT (re-exported as CREATE_TASK for
 *                         backward-compat with context/hooks that use it)
 *
 * All NEW code should use the `Assignment` vocabulary. The `CREATE_TASK` alias
 * will be removed in a future cleanup once every caller is migrated.
 */
import { gql } from "@apollo/client";

export const FETCH_DASHBOARD_DATA = gql`
  query GetDashboardData {
    GetDashboardData {
      status
      message
      code

      courses {
        id
        name
        code
        createdAt
      }

      assignments {
        id
        title
        dueDate
        course {
          id
          name
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
        user {
          id
          name
        }
        course {
          id
          name
          code
        }
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

export const FETCH_ASSIGNMENTS_DATA = gql`
  query GetAssignments {
    GetAssignments {
      status
      message
      code

      assignments {
        id
        title
        description
        dueDate

        maxMarks
        submissionType
        priority

        postedDate
        updatedAt

        course {
          id
          name
        }

        teacher {
          id
          name
        }

        submissions {
          id
          status
          submittedAt
          feedback
          submittedText
          marksObtained

          attachments {
            id
            cloudinary_url
            size
            name
            file_extension
            resource_type
            public_id
            status
            associate
            createdAt
          }
        }
      }
    }
  }
`;

/** Creates an Assignment on the server. Named CreateTask in the GraphQL schema for legacy reasons. */
export const CREATE_ASSIGNMENT = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    CreateTask(input: $input) {
      code
      message
      status
    }
  }
`;

/** @deprecated Use CREATE_ASSIGNMENT */
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
