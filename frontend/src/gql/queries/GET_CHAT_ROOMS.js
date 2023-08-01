import gql from "graphql-tag";

export const GET_CHAT_ROOMS = gql`
    query GetChatRooms {
        getChatRooms{
            id
            participantIds
            messageIds
        }
    }
`;
