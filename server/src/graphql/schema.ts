export const typeDefs = `

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


  type Chat { 
    id: String!
    type: String!
    title: String!
    courseId: String!
    createdAt: String!
    updatedAt: String!
    messages: [Messages]!
    chatMembers: [ChatMembers!]!
  }


  type Messages { 
  id: String!
  chatId: String!
  senderId: String!
  type: String!
  content: String
  createdAt: String!
  replyToId: String
  }

    type ChatMembers { 
    id: String!
    chatId: String!
    userId: String!
    role: String!
    isMuted: Boolean!
    joinedAt: String!
    user: User!
    chat: Chat!
  } 

  type User { 
    id: String!
    email: String!
    name: String!
  }

  type FetchChatMetadataResponse { 
    chats: [Chat!]!
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
  }

`;
