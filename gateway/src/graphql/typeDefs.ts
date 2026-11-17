// authService/src/graphql/typeDefs.js

const typeDefs = `
  scalar Upload

  type User {
    _id: ID!
    email: String!
    username: String!
  }

  type UserWithChatRoom {
    _id: ID!
    email: String!
    username: String!
    chatRoom: ID!
  }

  type SignupPayload {
    token: String!
    user: User!
  }

  type LoginPayload {
    token: String!
    user: User!
  }

  type LogoutPayload {
    message: String!
  }

  type ChatRoom {
    _id: ID!
    participantIds: [ID!]!
    messageIds: [ID]
    createdAt: String!
    groupId: ID
    status: String
    expertId: ID
  }

  type ChatRoomPopulated {
    _id: ID!
    participantIds: [User!]!
    messageIds: [ID]
    createdAt: String!
    groupId: ID
    status: String
    expertId: ID
  }

  type SchoolGroup {
    _id: ID!
    name: String!
    kind: String!
  }

  type WaitingConversation {
    _id: ID!
    groupId: ID!
    question: String!
    username: String!
    open: Boolean!
  }

  type ReplyProposal {
    proposal: String
    nothingToSuggest: Boolean!
    excerpts: [String!]!
  }

  type Message {
    _id: ID!
    senderId: ID!
    body: String
    createdAt: String!
    chatRoomId: ID!
    fileContent: String # Base64 encoded file content
  }

  type MessagePopulated {
    _id: ID!
    senderId: User!
    body: String
    createdAt: String!
    chatRoomId: ID!
    fileContent: String # Base64 encoded file content
  }

  type ContactRequest {
    _id: ID!
    senderId: ID!
    recipientId: ID!
    status: String!
    createdAt: String!
  }

  type ContactRequestPopulated {
    _id: ID!
    senderId: User
    recipientId: ID!
    status: String!
    createdAt: String!
  }

  type Query {
    # authService
    getCurrentUser: User!
    getContactsWithChatRoom: [UserWithChatRoom]
    getUserById(userId: ID!): User
    # chatService
    getChatRoomById(chatRoomId: ID!): ChatRoomPopulated
    getMessagesByChatRoomId(chatRoomId: ID!): [MessagePopulated]
    getChatRoomsForCurrentUser: [ChatRoom]
    # contactService
    getContactRequestsByContext: [ContactRequestPopulated]
    getContactRequests(userId: ID!): [ContactRequest]
    # testing integration
    getUserByEmail(email: String!): User
    getManyUsersByEmail(emails: [String!]!): [User]
    schoolGroups: [SchoolGroup!]!
    myExpertGroups: [SchoolGroup!]!
    canCreateSchoolGroup: Boolean!
    waitingConversations(groupId: ID!): [WaitingConversation!]!
  }

  type Mutation {
    # authService
    signUp(
      email: String!
      username: String!
      password: String!
      confirmPassword: String!
    ): SignupPayload!
    login(email: String!, password: String!): LoginPayload!
    changePassword(oldPassword: String!, newPassword: String!): User
    changeUsername(newUsername: String!, currentPassword: String!): User
    logout: LogoutPayload!
    # chatService
    # sendMessage(chatRoomId: ID!, body: String, file: Upload): Message!
    sendMessage(chatRoomId: ID!, body: String, file: String): Message!
    createGroupConversationForCurrentUser(additionalEmails: [String]!): ChatRoom
    # contactService
    sendContactRequest(recipientId: ID!): ContactRequest
    acceptContactRequest(requestId: ID!): ContactRequest
    rejectContactRequest(requestId: ID!): ContactRequest
    createSchoolGroup(name: String!, kind: String!): SchoolGroup!
    addExpert(groupId: ID!, email: String!): SchoolGroup!
    startSchoolConversation(groupId: ID!, body: String!): ChatRoom!
    takeSchoolConversation(chatRoomId: ID!): ChatRoom!
    suggestQuestionWording(groupId: ID!, draft: String!): String!
    suggestReply(chatRoomId: ID!): ReplyProposal!
    uploadSchoolDocument(groupId: ID, schoolWide: Boolean!, filename: String!, file: String!): Boolean!
    markAnswer(messageId: ID!): Boolean!
  }

  type Subscription {
    newMessage(chatRoomId: ID!): Message!
    newContactRequest: ContactRequest!
    newContact: ContactRequest!
    newChatRoom: ChatRoom!
    waitingConversation(groupId: ID!): WaitingConversation!
  }
`;

module.exports = { typeDefs };
