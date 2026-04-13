import { useLazyQuery, useMutation } from "@apollo/client";
import {
  GET_DEPARTMENTS,
  GET_COURSE_BY_ID,
  GET_TEACHER_COURSES,
  GET_ENROLLED_STUDENTS,
  ENROLL_STUDENT,
  UNENROLL_STUDENT,
} from "@/app/dashboard/tasks/enrollment-queries";
import { toast } from "sonner";

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
        toast.success(data.EnrollStudent.message);
      },
      onError: (err) => {
        toast.error(err.message ?? "Enrollment failed.");
      },
      // Refetch both teacher courses and departments after enrollment
      refetchQueries: [GET_TEACHER_COURSES, GET_DEPARTMENTS],
    },
  );

  const [unenrollStudentMutation, { loading: unenrolling }] = useMutation(
    UNENROLL_STUDENT,
    {
      onCompleted: (data) => {
        toast.success(data.UnenrollStudent.message);
      },
      onError: (err) => {
        toast.error(err.message ?? "Unenrollment failed.");
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
