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
