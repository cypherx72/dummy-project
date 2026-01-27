export const typeDefs = `
  scalar Date

  type DefaultResponse{
    status: Int!
    message: String!
    code: String!
  }

  type SignInResponse{ 
      email : String!
      id: String!
      image: String!
      name: String!
  }

  type SessionData { 
    name: String!
    email: String!
    emailVerified: String
    contactNumber: String!
    registrationId: String!
    image: String
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

type Message {
  id: String!
  chatId: String!
  senderId: String!
  content: String
  createdAt: Date!
  deliveredAt: Date
  readAt: Date
  replyToId: String
  sender: User!
  media: Media
  replies: [Message!]!
  reactions: [Reaction!]!
}

enum UserRole {
  student
  staffMember
}

type ChatMember { 
  id: String!
  chatId: String!
  userId: String!
  role: UserRole!
  isMuted: Boolean!
  joinedAt: Date!
  user: User!
}

type User {
  id: String!
  email: String
  name: String
  image: String
  role: UserRole!
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


  type FetchChatMetadataResponse { 
    chats: [Chat!]!
  }

  type MarkChatAsReadResponse{ 
    chatId: String!
    unreadMessageCount: Int!
    id: String!
  }

  input SendOTPInput {
    contactNumber: String!
    registrationId: String!
  }
    
  input VerifyOTPInput { 
    userOTP: String!
    contactNumber: String!
    registrationId: String!
  }

  input SignInViaProviderInput {
    access_token: String!, 
    scope: String!, 
    token_type: String!, 
    id_token: String!, 
    expires_at: Int!, 
    type: String!, 
    provider: String!, 
    providerAccountId: String!, 
    email: String!,
  }

  input SignInViaPasswordInput{ 
    email: String!, 
    password: String!,
  }

  input FetchSessionDataInput{
  email: String!
  }

    input LogInViaPasswordInput { 
    password: String!
    email: String!
  }

  input ForgotPasswordInput { 
    email: String!
  }
  
  input ResetPasswordInput { 
    token: String!
    password: String!
  }

  input FetchChatMetadataInput { 
    userId: String!
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

  input MarkChatAsReadInput { 
  chatId: String!
  }

  type Query {
    FetchSessionData(input: FetchSessionDataInput!): SessionData!
    LogInViaProvider(input: SignInViaProviderInput!):  SignInResponse!
    LogInViaPassword(input: LogInViaPasswordInput! ):  SignInResponse!
    Middleware: DefaultResponse!
    ForgotPassword(input: ForgotPasswordInput!): DefaultResponse!
    FetchChatMetadata(input: FetchChatMetadataInput!) : FetchChatMetadataResponse! 
  }

  type Mutation {
    SendOTP(input: SendOTPInput!): DefaultResponse!
    VerifyOTP(input: VerifyOTPInput!): DefaultResponse!
    SignInViaProvider(input: SignInViaProviderInput!): SignInResponse!
    SignInViaPassword(input: SignInViaPasswordInput): SignInResponse!
    ResetPassword(input: ResetPasswordInput): DefaultResponse!
    SendMessage(input: SendMessageInput! ): DefaultResponse!
    EditMessage(input: EditMessageInput! ): DefaultResponse!
    SendReaction(input: SendReactionInput! ): DefaultResponse!
    MarkChatAsRead(input: MarkChatAsReadInput!): MarkChatAsReadResponse!
  }

`;
