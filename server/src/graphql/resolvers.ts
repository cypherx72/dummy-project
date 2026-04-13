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
import { CreateTask } from "./tasks/createTask.js";
import { GetDashboardData } from "./tasks/getDashboardData.js";
import { GetUploadSignature } from "./tasks/getUploadSignature.js";
import { GetAssignments } from "./tasks/getAssignmentsDue.js";

// Enrollment
import { GetDepartments } from "./enrollment/getDepartments.js";
import { GetCourseById } from "./enrollment/getCourseById.js";
import { GetTeacherCourses } from "./enrollment/getTeacherCourses.js";
import { GetEnrolledStudents } from "./enrollment/getEnrolledStudents.js";
import { EnrollStudent } from "./enrollment/enrollStudent.js";
import { UnenrollStudent } from "./enrollment/unenrollStudent.js";
import { SubmitAssignment } from "./tasks/submitAssignment.js";

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
    CreateTask,
    SubmitAssignment,

    // Enrollment
    EnrollStudent,
    UnenrollStudent,
  },
};
