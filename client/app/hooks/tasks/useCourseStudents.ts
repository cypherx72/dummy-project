/**
 * Per-course enrolled students hook.
 * Each CourseCard instance gets its own isolated query state so
 * multiple expanded cards don't share/overwrite the same data.
 */
import { useLazyQuery } from "@apollo/client";
import { GET_ENROLLED_STUDENTS } from "@/app/dashboard/tasks/enrollment-queries";

export const useCourseStudents = (courseId: string) => {
  const [fetch, { data, loading, error }] = useLazyQuery(
    GET_ENROLLED_STUDENTS,
    { variables: { courseId } },
  );

  return {
    fetchStudents: () => fetch({ variables: { courseId } }),
    students: data?.GetEnrolledStudents?.enrollments ?? [],
    loading,
    error,
  };
};
