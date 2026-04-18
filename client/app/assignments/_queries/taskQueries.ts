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
        type
        isRead
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
      todayAssignments {
        id
        userId
        title
        dueTime
        completed
        createdAt
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

export const FETCH_UPCOMING_EVENTS = gql`
  query GetUpcomingEvents {
    GetUpcomingEvents {
      status
      message
      code
      events {
        id
        title
        location
        startDate
        startTime
      }
    }
  }
`;

export const FETCH_NOTIFICATIONS = gql`
  query GetNotifications {
    GetNotifications {
      status
      message
      code
      notifications {
        id
        title
        message
        type
        isRead
        createdAt
      }
    }
  }
`;

export const FETCH_ENROLLED_COURSES = gql`
  query GetEnrolledCourses {
    GetEnrolledCourses {
      status
      message
      code
      courses {
        id
        name
        code
        description
        createdAt
        teacher {
          id
          name
        }
      }
    }
  }
`;

export const FETCH_ALARMS = gql`
  query GetAlarms {
    GetAlarms {
      status
      message
      code
      alarms {
        id
        title
        message
        type
        isRead
        createdAt
      }
    }
  }
`;

export const FETCH_RECENT_EMAILS = gql`
  query GetRecentEmails {
    GetRecentEmails {
      status
      message
      code
      emails {
        id
        subject
        senderName
        senderEmail
        preview
        isRead
        createdAt
      }
    }
  }
`;

export const SEARCH_ASSIGNMENTS = gql`
  query SearchAssignments($query: String!) {
    SearchAssignments(query: $query) {
      status
      message
      code
      assignments {
        id
        title
        description
        dueDate
        priority
        course {
          id
          name
        }
      }
    }
  }
`;
