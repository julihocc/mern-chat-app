import gql from 'graphql-tag'

export const GET_CHAT_ROOMS_FOR_CURRENT_USER = gql`
  query GetChatRoomsForCurrentUser {
    getChatRoomsForCurrentUser {
      id, 
      participantIds,
      messageIds,
    }
  }
`
