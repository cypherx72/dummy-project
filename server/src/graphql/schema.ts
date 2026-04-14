export const typeDefs = `
  scalar Date

  type DefaultResponse{
    status: Int!
    message: String!
    code: String!
  }

enum ChatType {
  course
  thread
  dm
}

type Course { 
  id: ID!
  name: String!
  code: String
}

type Chat { 
  id: String!
  type: ChatType!
  courseId: String
  createdAt: Date!
  updatedAt: Date!
  course: Course!
  messages: [Message!]!
  chatMembers: [ChatMember!]!
}

enum MediaType {
  image
  video
  pdf
  text
}

type PinnedMessage { 
  id: String!
  messageId: String!, 
  pinnedById: String!
  pinnedAt: Date!
}

type StarredMessage { 
  id: String!
  senderId: String!
  messageId: String!
  createdAt: Date!
}

type MessageReceipt{ 
  id: String!
  messageId: String!
  chatMemberId: String!
  deliveredAt: Date!
  readAt: Date
}

type Message {
  id: String!
  chatId: String!
  content: String
  createdAt: Date!
  edited: Boolean!
  replyToId: String

  sender: Sender!
  pinnedMessages: [PinnedMessage!]
  messageReceipts: [MessageReceipt!]
  starredMessages: [StarredMessage!]
  media: Media
  reactions: [Reaction!]
}

enum UserRole {
  student
  teacher
}

type ChatMember { 
  id: String!
  chatId: String!
  userId: String!
  role: UserRole!
  isMuted: Boolean!
  unreadMessageCount: Int!
  joinedAt: Date!
  sender: Sender!
}

input DeleteMessageInput{ 
  chatId: String!
  messageId: String!
}

input PinMessageInput{ 
  chatId: String!
  messageId: String!
}

type User { 
  email: String!
  name: String!
  image: String
  role: UserRole!
  id: String!
}

type Sender {
  id:String!
  user: User!
}

enum FileStatus {
  pending
  completed
  cancelled
}

enum FileAssociate {
  task
  chat
  threaded
}

type Reaction { 
  id: String!
  messageId: String!
  chatMemberId: String!
  createdAt: Date!
  emoji: String!
}

type Media {
  id: String!
  cloudinary_url: String!
  size: String!
  name: String!
  file_extension: String!
  resource_type: String!
  public_id: String!
  status: FileStatus!
  associate: FileAssociate!
  createdAt: Date!
}

type CursorPaginationResponse {
  chatId: String!
  unreadMessageCount: Int!
  messages: [Message!]!
  nextCursor: String
}

type ChatSummaryResponse {
  chats: [ChatSummary!]!
}

type MarkChatAsReadResponse{ 
  chatId: String!
  unreadMessageCount: Int!
  id: String!
}

type ChatSummary {
  id: String!
  imageUrl: String
  courseName: String!
  unreadMessageCount: Int!
  lastMessage: LastMessagePreview
}

type LastMessagePreview {
  content: String
  createdAt: Date!
  senderId: String!
}

input SendMessageInput { 
  replyToId: String
  content: String
  media: String
  chatId: String!
}

input EditMessageInput { 
  content: String!
  messageId: String!
  chatId: String!
}

input SendReactionInput { 
  messageId: String!
  emoji: String!
  chatId: String!
}

input StarMessageInput { 
  messageId: String!
  chatId: String!
}

input MarkChatAsReadInput { 
  chatId: String!
}

input CursorPaginationInput { 
  myCursor: String
  chatId: String!
}

type UnreadMessageCount { 
  unreadMessageCount: Int!
}

type ChatMessagesResponse {
  chatId: String!
  unreadMessageCount: Int!
  messages: [Message!]!
  nextCursor: String
}

input chatMessagesInput { 
  chatId: String!
}

input AttachmentInput {
  bytes: Int!
  resourceType:String!
  publicId:String!
  name: String!
cloudinaryUrl: String!
fileExtension: String!

}
  

input SubmitAssignmentInput { 
   attachments: [AttachmentInput]
   textEntry: String
   websiteUrl: String
}


input CreateAssignmentInput{ 
  courseId: String!
    time: String!
    title: String!
    description: String!
    priorityStatus: PriorityStatus!
    maxPoints: Int!
    submissionType:SubmissionType!
    dueDate: Date!
    extendDate: Boolean!
    instructions: String 
    attachments: [AttachmentInput]
    comments: String 
}

enum PriorityStatus { 
low 
medium 
high}

enum SubmissionType { 
fileUpload 
textEntry
websiteUrl }


#########################
# DASHBOARD TYPES
#########################

type DashboardCourse {
  id: ID!
  name: String!
  code: String!
  description: String
  departmentId: ID
  teacherId: ID
  createdAt: String
}

type Submission {
  id: ID!
  submittedText: String
  marksObtained: Int
  feedback: String
  submittedAt: String
  status: String
  attachments: [Media!]
}

type Assignment {
  id: ID!
  title: String!
  description: String
  instructions: String
  dueDate: String!

  courseId: ID!
  createdById: ID!

  maxMarks: Int
  allowLateSubmission: Boolean
  submissionType: String
  priority: String

  postedDate: String
  updatedAt: String

  course: Course!
  teacher: User!
  submissions: [Submission!]!
}

type Notification {
  id: ID!
  userId: ID!
  title: String!
  message: String!
  type: String
  isRead: Boolean!
  createdAt: String!
}

type Event {
  id: ID!
  title: String!
  location: String
  startDate: String!
  startTime: String!
}

type ActivityUser {
  id: String!
  name: String
}

type ActivityCourse {
  id: String!
  name: String!
  code: String!
}

type RecentActivity {
  id: ID!
  activity: String
  userId: ID!
  description: String!
  type: String!
  courseId: ID
  createdAt: String!
  user: ActivityUser
  course: ActivityCourse
}

type UploadSignatureResponse { 
  signature: String!
  timestamp: Int!
  apiKey: String!
  cloudName: String!
  folder: String!
}

type TodayAssignment {
  id: ID!
  userId: ID!
  title: String!
  dueTime: String
  completed: Boolean!
  createdAt: String!
}


type GetAssignmentsResponse { 

status: Int!
  message: String!
  code: String!

   assignments: [Assignment!]!
}

type DashboardResponse {
  status: Int!
  message: String!
  code: String!

  courses: [DashboardCourse!]!
  activities: [RecentActivity!]!
  assignments: [Assignment!]!
  notifications: [Notification!]!
  events: [Event!]!
  todayAssignments: [TodayAssignment!]!
}

#########################
# ENROLLMENT TYPES
#########################

type Department {
  id: ID!
  name: String!
  code: String!
  createdAt: String!
  courses: [EnrollmentCourse!]!
}

# Full course shape used in enrollment queries (richer than DashboardCourse)
type EnrollmentCourse {
  id: ID!
  name: String!
  code: String!
  description: String
  departmentId: ID!
  teacherId: ID!
  createdAt: String!
  department: Department
  teacher: EnrollmentUser!
  enrolledStudents: [EnrollmentRecord!]!
  enrolledCount: Int!
}

type EnrollmentUser {
  id: ID!
  name: String
  email: String
  image: String
  role: UserRole!
}

type EnrollmentRecord {
  id: ID!
  enrolledAt: String!
  user: EnrollmentUser!
}

input EnrollStudentInput {
  courseId: String!
  # Optional: admins/teachers can enroll another user by id.
  # If omitted, the current user enrolls themselves (student flow).
  userId: String
}

input UnenrollStudentInput {
  courseId: String!
  userId: String
}

type EnrollmentResponse {
  status: Int!
  message: String!
  code: String!
  enrollment: EnrollmentRecord
}

type GetDepartmentsResponse {
  status: Int!
  message: String!
  code: String!
  departments: [Department!]!
}

type GetCourseResponse {
  status: Int!
  message: String!
  code: String!
  course: EnrollmentCourse
}

type GetEnrolledStudentsResponse {
  status: Int!
  message: String!
  code: String!
  enrollments: [EnrollmentRecord!]!
}

type GetTeacherCoursesResponse {
  status: Int!
  message: String!
  code: String!
  courses: [EnrollmentCourse!]!
}

#########################
# ROOT TYPES
#########################

type Query {
  CursorPagination(input: CursorPaginationInput!) : CursorPaginationResponse!
  chatSummary: ChatSummaryResponse!
  chatMessages(input: chatMessagesInput! ): ChatMessagesResponse!
  GetDashboardData: DashboardResponse!
  GetAssignments: GetAssignmentsResponse!

  # Enrollment queries
  GetDepartments: GetDepartmentsResponse!
  GetCourseById(id: ID!): GetCourseResponse!
  GetTeacherCourses: GetTeacherCoursesResponse!
  GetEnrolledStudents(courseId: ID!): GetEnrolledStudentsResponse!

  # Attendance
  GetCourseAttendance(courseId: ID!, date: String): GetCourseAttendanceResponse!

  # Quiz
  GetQuizzes(courseId: ID): GetQuizzesResponse!

  # Remarks
  GetRemarks(courseId: ID!): GetRemarksResponse!

  # Communication
  GetAnnouncements: GetAnnouncementsResponse!
  GetMeetings: GetMeetingsResponse!
}

type Mutation {

  PinMessage(input: PinMessageInput!): DefaultResponse!
  StarMessage(input: StarMessageInput!): DefaultResponse!
  SendMessage(input: SendMessageInput! ): DefaultResponse!
  DeleteMessage(input: DeleteMessageInput!): DefaultResponse!
  EditMessage(input: EditMessageInput! ): DefaultResponse!
  SendReaction(input: SendReactionInput! ): DefaultResponse!
  MarkChatAsRead(input: MarkChatAsReadInput!): MarkChatAsReadResponse!

  GetUploadSignature: UploadSignatureResponse!
  CreateAssignment(input: CreateAssignmentInput!): DefaultResponse!
  SubmitAssignment(input: SubmitAssignmentInput!): DefaultResponse!

  # Enrollment mutations
  EnrollStudent(input: EnrollStudentInput!): EnrollmentResponse!
  UnenrollStudent(input: UnenrollStudentInput!): DefaultResponse!

  # Attendance
  SaveAttendance(input: SaveAttendanceInput!): DefaultResponse!

  # Quiz
  CreateQuiz(input: CreateQuizInput!): CreateQuizResponse!

  # Remarks
  SaveRemark(input: SaveRemarkInput!): SaveRemarkResponse!

  # Communication
  CreateAnnouncement(input: CreateAnnouncementInput!): AnnouncementResponse!
  ScheduleMeeting(input: ScheduleMeetingInput!): MeetingResponse!

  # Grading
  GradeSubmissions(input: GradeSubmissionsInput!): DefaultResponse!
}

#########################
# ATTENDANCE TYPES
#########################

type AttendanceStudent {
  userId: ID!
  name: String
  email: String
  image: String
  status: String!
  note: String
  recordId: ID
}

type GetCourseAttendanceResponse {
  status: Int!
  message: String!
  code: String!
  students: [AttendanceStudent!]!
  date: String!
}

input AttendanceEntryInput {
  studentId: ID!
  status: String!
  note: String
}

input SaveAttendanceInput {
  courseId: ID!
  date: String!
  entries: [AttendanceEntryInput!]!
}

#########################
# QUIZ TYPES
#########################

type QuizQuestionType {
  id: ID!
  type: String!
  text: String!
  marks: Float!
  options: String
  correctAnswer: String
  explanation: String
  order: Int!
}

type QuizType {
  id: ID!
  title: String!
  description: String
  courseId: ID!
  createdById: ID!
  timeLimit: Int
  dueDate: String
  shuffleQuestions: Boolean!
  isPublished: Boolean!
  createdAt: String!
  questions: [QuizQuestionType!]!
  course: Course
}

type GetQuizzesResponse {
  status: Int!
  message: String!
  code: String!
  quizzes: [QuizType!]!
}

type CreateQuizResponse {
  status: Int!
  message: String!
  code: String!
  quiz: QuizType
}

input QuizQuestionInput {
  type: String!
  text: String!
  marks: Float
  options: String
  correctAnswer: String
  explanation: String
}

input CreateQuizInput {
  title: String!
  description: String
  courseId: ID!
  timeLimit: Int
  dueDate: String
  shuffleQuestions: Boolean
  isPublished: Boolean
  questions: [QuizQuestionInput!]!
}

#########################
# REMARKS TYPES
#########################

type RemarkStudent {
  id: ID!
  name: String
  email: String
  image: String
}

type RemarkType {
  id: ID!
  courseId: ID!
  studentId: ID!
  teacherId: ID!
  content: String!
  remarkDate: String!
  category: String!
  createdAt: String!
  student: RemarkStudent
}

type GetRemarksResponse {
  status: Int!
  message: String!
  code: String!
  remarks: [RemarkType!]!
}

type SaveRemarkResponse {
  status: Int!
  message: String!
  code: String!
  remark: RemarkType
}

input SaveRemarkInput {
  courseId: ID!
  studentId: ID!
  content: String!
  category: String
  remarkId: ID
}

#########################
# COMMUNICATION TYPES
#########################

type AnnouncementCreator {
  id: ID!
  name: String
  image: String
}

type AnnouncementType {
  id: ID!
  title: String!
  content: String!
  priority: String!
  courseId: ID
  createdAt: String!
  course: Course
  creator: AnnouncementCreator
}

type AnnouncementResponse {
  status: Int!
  message: String!
  code: String!
  announcement: AnnouncementType
}

type GetAnnouncementsResponse {
  status: Int!
  message: String!
  code: String!
  announcements: [AnnouncementType!]!
}

type MeetingType {
  id: ID!
  title: String!
  description: String
  courseId: ID
  startTime: String!
  endTime: String
  location: String
  meetingLink: String
  type: String!
  createdAt: String!
  course: Course
  creator: AnnouncementCreator
}

type MeetingResponse {
  status: Int!
  message: String!
  code: String!
  meeting: MeetingType
}

type GetMeetingsResponse {
  status: Int!
  message: String!
  code: String!
  meetings: [MeetingType!]!
}

input CreateAnnouncementInput {
  title: String!
  content: String!
  courseId: ID
  priority: String
}

input ScheduleMeetingInput {
  title: String!
  description: String
  courseId: ID
  startTime: String!
  endTime: String
  location: String
  meetingLink: String
  type: String
}

#########################
# GRADING TYPES
#########################

input GradeEntryInput {
  studentId: ID!
  gradeValue: String!
  feedback: String
}

input GradeSubmissionsInput {
  assignmentId: ID!
  gradingMode: String!
  grades: [GradeEntryInput!]!
}
`;

// Appended: Attendance, Quiz, Remarks, Communication, Grading types
