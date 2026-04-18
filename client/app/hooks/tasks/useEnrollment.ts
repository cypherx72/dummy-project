import { useLazyQuery, useMutation } from "@apollo/client/react";
import {
  GET_DEPARTMENTS,
  GET_COURSE_BY_ID,
  GET_TEACHER_COURSES,
  GET_ENROLLED_STUDENTS,
  ENROLL_STUDENT,
  UNENROLL_STUDENT,
} from "@/app/dashboard/tasks/enrollment-queries";
import { showToast, errorToast } from "@/components/ui/toast";

export const useEnrollment = () => {
  // ── Queries ──────────────────────────────────────────────────────────────

  const [
    fetchDepartments,
    {
      data: departmentsData,
      loading: departmentsLoading,
      error: departmentsError,
    },
  ] = useLazyQuery(GET_DEPARTMENTS);

  const [
    fetchCourseById,
    { data: courseData, loading: courseLoading, error: courseError },
  ] = useLazyQuery(GET_COURSE_BY_ID);

  const [
    fetchTeacherCourses,
    {
      data: teacherCoursesData,
      loading: teacherCoursesLoading,
      error: teacherCoursesError,
    },
  ] = useLazyQuery(GET_TEACHER_COURSES);

  const [
    fetchEnrolledStudents,
    {
      data: enrolledStudentsData,
      loading: enrolledStudentsLoading,
      error: enrolledStudentsError,
    },
  ] = useLazyQuery(GET_ENROLLED_STUDENTS);

  // ── Mutations ─────────────────────────────────────────────────────────────

  const [enrollStudentMutation, { loading: enrolling }] = useMutation(
    ENROLL_STUDENT,
    {
      onCompleted: (data) => {
        showToast("Student enrolled", data.EnrollStudent.message, "success");
      },
      onError: (err) => {
        errorToast(err.message ?? "Enrollment failed. Please try again.");
      },
      refetchQueries: [GET_TEACHER_COURSES, GET_DEPARTMENTS],
    },
  );

  const [unenrollStudentMutation, { loading: unenrolling }] = useMutation(
    UNENROLL_STUDENT,
    {
      onCompleted: (data) => {
        showToast("Student unenrolled", data.UnenrollStudent.message, "info");
      },
      onError: (err) => {
        errorToast(err.message ?? "Unenrollment failed. Please try again.");
      },
      refetchQueries: [GET_TEACHER_COURSES, GET_DEPARTMENTS],
    },
  );

  // ── Convenience wrappers ──────────────────────────────────────────────────

  const enrollStudent = (courseId: string, userId?: string) =>
    enrollStudentMutation({ variables: { input: { courseId, userId } } });

  const unenrollStudent = (courseId: string, userId?: string) =>
    unenrollStudentMutation({ variables: { input: { courseId, userId } } });

  return {
    // Departments
    fetchDepartments,
    departments: departmentsData?.GetDepartments?.departments ?? [],
    departmentsLoading,
    departmentsError,

    // Single course
    fetchCourseById,
    course: courseData?.GetCourseById?.course ?? null,
    courseLoading,
    courseError,

    // Teacher's courses
    fetchTeacherCourses,
    teacherCourses: teacherCoursesData?.GetTeacherCourses?.courses ?? [],
    teacherCoursesLoading,
    teacherCoursesError,

    // Enrolled students
    fetchEnrolledStudents,
    enrolledStudents:
      enrolledStudentsData?.GetEnrolledStudents?.enrollments ?? [],
    enrolledStudentsLoading,
    enrolledStudentsError,

    // Mutations
    enrollStudent,
    enrolling,
    unenrollStudent,
    unenrolling,
  };
};
