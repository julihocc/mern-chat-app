import gql from 'graphql-tag'

export const GET_CHAT_ROOMS = gql`
  query GetChatRooms {
    getChatRooms {
      _id, 
      participants{
        email
      },
      messages{
        body
      },
    }
  }
`
