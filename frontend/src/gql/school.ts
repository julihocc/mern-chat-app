import gql from "graphql-tag";

export const SCHOOL_GROUPS = gql`
  query SchoolGroups {
    schoolGroups {
      _id
      name
      kind
    }
    myExpertGroups {
      _id
      name
      kind
    }
    canCreateSchoolGroup
  }
`;

export const WAITING_CONVERSATIONS = gql`
  query WaitingConversations($groupId: ID!) {
    waitingConversations(groupId: $groupId) {
      _id
      groupId
      question
      username
      open
    }
  }
`;

export const WAITING_CONVERSATION_SUBSCRIPTION = gql`
  subscription WaitingConversation($groupId: ID!) {
    waitingConversation(groupId: $groupId) {
      _id
      open
    }
  }
`;

export const CREATE_SCHOOL_GROUP = gql`
  mutation CreateSchoolGroup($name: String!, $kind: String!) {
    createSchoolGroup(name: $name, kind: $kind) {
      _id
      name
      kind
    }
  }
`;

export const ADD_EXPERT = gql`
  mutation AddExpert($groupId: ID!, $email: String!) {
    addExpert(groupId: $groupId, email: $email) {
      _id
      name
    }
  }
`;

export const START_SCHOOL_CONVERSATION = gql`
  mutation StartSchoolConversation($groupId: ID!, $body: String!) {
    startSchoolConversation(groupId: $groupId, body: $body) {
      _id
    }
  }
`;

export const TAKE_SCHOOL_CONVERSATION = gql`
  mutation TakeSchoolConversation($chatRoomId: ID!) {
    takeSchoolConversation(chatRoomId: $chatRoomId) {
      _id
    }
  }
`;

export const SUGGEST_QUESTION_WORDING = gql`
  mutation SuggestQuestionWording($groupId: ID!, $draft: String!) {
    suggestQuestionWording(groupId: $groupId, draft: $draft)
  }
`;

export const SUGGEST_REPLY = gql`
  mutation SuggestReply($chatRoomId: ID!) {
    suggestReply(chatRoomId: $chatRoomId) {
      proposal
      nothingToSuggest
      excerpts
    }
  }
`;

export const UPLOAD_SCHOOL_DOCUMENT = gql`
  mutation UploadSchoolDocument(
    $groupId: ID
    $schoolWide: Boolean!
    $filename: String!
    $file: String!
  ) {
    uploadSchoolDocument(
      groupId: $groupId
      schoolWide: $schoolWide
      filename: $filename
      file: $file
    )
  }
`;

export const MARK_ANSWER = gql`
  mutation MarkAnswer($messageId: ID!) {
    markAnswer(messageId: $messageId)
  }
`;
