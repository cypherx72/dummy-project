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
  name: String!
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
  
input CreateTaskInput{ 
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
  title: String!
  code: String!
  description: String
  departmentId: ID
  teacherId: ID
  createdAt: String
}

type Assignment {
  id: ID!
  title: String!
  description: String
  dueDate: String!
  courseId: ID!
  createdBy: ID!
  createdAt: String!
  course: DashboardCourse!
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
}

type RecentActivity {
  id: ID!
  activity: String!
  userId: ID!
  description: String!
  type: String!
  courseId: ID
  createdAt: String!
}

type UploadSignatureResponse { 
  signature: String!
  timestamp: Int!
  apiKey: String!
  cloudName: String!
  folder: String!
}

type Task {
  id: ID!
  userId: ID!
  title: String!
  dueTime: String
  completed: Boolean!
  createdAt: String!
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
  tasks: [Task!]!
}

#########################
# ROOT TYPES
#########################

type Query {
  CursorPagination(input: CursorPaginationInput!) : CursorPaginationResponse!
  chatSummary: ChatSummaryResponse!
  chatMessages(input: chatMessagesInput! ): ChatMessagesResponse!
  GetDashboardData: DashboardResponse!


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
  CreateTask(input: CreateTaskInput!): DefaultResponse!
}
`;
