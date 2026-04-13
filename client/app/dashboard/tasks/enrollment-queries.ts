import { gql } from "@apollo/client";

// ─── Fragments ────────────────────────────────────────────────────────────────

const ENROLLMENT_USER_FRAGMENT = gql`
  fragment EnrollmentUserFields on EnrollmentUser {
    id
    name
    email
    image
    role
  }
`;

const ENROLLMENT_RECORD_FRAGMENT = gql`
  fragment EnrollmentRecordFields on EnrollmentRecord {
    id
    enrolledAt
    user {
      ...EnrollmentUserFields
    }
  }
  ${ENROLLMENT_USER_FRAGMENT}
`;

const ENROLLMENT_COURSE_FRAGMENT = gql`
  fragment EnrollmentCourseFields on EnrollmentCourse {
    id
    name
    code
    description
    departmentId
    teacherId
    createdAt
    enrolledCount
    teacher {
      ...EnrollmentUserFields
    }
    enrolledStudents {
      ...EnrollmentRecordFields
    }
  }
  ${ENROLLMENT_USER_FRAGMENT}
  ${ENROLLMENT_RECORD_FRAGMENT}
`;

// ─── Queries ──────────────────────────────────────────────────────────────────

export const GET_DEPARTMENTS = gql`
  query GetDepartments {
    GetDepartments {
      status
      message
      code
      departments {
        id
        name
        code
        createdAt
        courses {
          ...EnrollmentCourseFields
        }
      }
    }
  }
  ${ENROLLMENT_COURSE_FRAGMENT}
`;

export const GET_COURSE_BY_ID = gql`
  query GetCourseById($id: ID!) {
    GetCourseById(id: $id) {
      status
      message
      code
      course {
        ...EnrollmentCourseFields
        department {
          id
          name
          code
          createdAt
        }
      }
    }
  }
  ${ENROLLMENT_COURSE_FRAGMENT}
`;

export const GET_TEACHER_COURSES = gql`
  query GetTeacherCourses {
    GetTeacherCourses {
      status
      message
      code
      courses {
        ...EnrollmentCourseFields
        department {
          id
          name
          code
          createdAt
        }
      }
    }
  }
  ${ENROLLMENT_COURSE_FRAGMENT}
`;

export const GET_ENROLLED_STUDENTS = gql`
  query GetEnrolledStudents($courseId: ID!) {
    GetEnrolledStudents(courseId: $courseId) {
      status
      message
      code
      enrollments {
        ...EnrollmentRecordFields
      }
    }
  }
  ${ENROLLMENT_RECORD_FRAGMENT}
`;

// ─── Mutations ────────────────────────────────────────────────────────────────

export const ENROLL_STUDENT = gql`
  mutation EnrollStudent($input: EnrollStudentInput!) {
    EnrollStudent(input: $input) {
      status
      message
      code
      enrollment {
        ...EnrollmentRecordFields
      }
    }
  }
  ${ENROLLMENT_RECORD_FRAGMENT}
`;

export const UNENROLL_STUDENT = gql`
  mutation UnenrollStudent($input: UnenrollStudentInput!) {
    UnenrollStudent(input: $input) {
      status
      message
      code
    }
  }
`;
