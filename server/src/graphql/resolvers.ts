import { chatSummary } from "./chat/chat-summary.js";
import { chatMessages } from "./chat/chat-messages.js";
import { SendMessage } from "./chat/send-message.js";
import { SendReaction } from "./chat/reactions.js";
import { MarkChatAsRead } from "./chat/mark-chat-as-read.js";
import { dateScalar } from "./custom-types.js";
import { EditMessage } from "./chat/edit-message.js";
import { CursorPagination } from "./chat/pagination.js";
import { DeleteMessage } from "./chat/delete-message.js";
import { PinMessage } from "./chat/pin-message.js";
import { StarMessage } from "./chat/star-message.js";
import { CreateAssignment } from "./tasks/createTask.js";
import { GetDashboardData } from "./tasks/getDashboardData.js";
import { GetUploadSignature } from "./tasks/getUploadSignature.js";
import { GetAssignments } from "./tasks/getAssignmentsDue.js";
import { GradeSubmissions } from "./tasks/gradeSubmissions.js";

// Enrollment
import { GetDepartments } from "./enrollment/getDepartments.js";
import { GetCourseById } from "./enrollment/getCourseById.js";
import { GetTeacherCourses } from "./enrollment/getTeacherCourses.js";
import { GetEnrolledStudents } from "./enrollment/getEnrolledStudents.js";
import { EnrollStudent } from "./enrollment/enrollStudent.js";
import { UnenrollStudent } from "./enrollment/unenrollStudent.js";
import { SubmitAssignment } from "./tasks/submitAssignment.js";

// Attendance
import { GetCourseAttendance } from "./attendance/getAttendance.js";
import { SaveAttendance } from "./attendance/saveAttendance.js";

// Quiz
import { CreateQuiz } from "./quiz/createQuiz.js";
import { GetQuizzes } from "./quiz/getQuizzes.js";

// Remarks
import { SaveRemark } from "./remarks/saveRemark.js";
import { GetRemarks } from "./remarks/getRemarks.js";

// Communication
import { CreateAnnouncement } from "./communication/createAnnouncement.js";
import { GetAnnouncements } from "./communication/getAnnouncements.js";
import { ScheduleMeeting } from "./communication/scheduleMeeting.js";
import { GetMeetings } from "./communication/getMeetings.js";

export const resolvers = {
  Date: dateScalar,
  Query: {
    CursorPagination,
    chatMessages,
    GetAssignments,
    GetDashboardData,
    chatSummary,

    // Enrollment
    GetDepartments,
    GetCourseById,
    GetTeacherCourses,
    GetEnrolledStudents,

    // Attendance
    GetCourseAttendance,

    // Quiz
    GetQuizzes,

    // Remarks
    GetRemarks,

    // Communication
    GetAnnouncements,
    GetMeetings,
  },
  Mutation: {
    EditMessage,
    PinMessage,
    StarMessage,
    SendMessage,
    DeleteMessage,
    SendReaction,
    MarkChatAsRead,

    GetUploadSignature,
    CreateAssignment,
    SubmitAssignment,
    GradeSubmissions,

    // Enrollment
    EnrollStudent,
    UnenrollStudent,

    // Attendance
    SaveAttendance,

    // Quiz
    CreateQuiz,

    // Remarks
    SaveRemark,

    // Communication
    CreateAnnouncement,
    ScheduleMeeting,
  },
};
