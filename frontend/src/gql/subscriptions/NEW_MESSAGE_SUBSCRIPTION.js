// path: src/graphql/subscriptions/NEW_MESSAGE_SUBSCRIPTION.js
import gql from "graphql-tag";

export const NEW_MESSAGE_SUBSCRIPTION = gql`
    subscription NewMessageSubscription($chatRoomId: ID!) {
        newMessage(chatRoomId: $chatRoomId) {
            _id
            sender{
                _id
            }
            chatRoom{
                _id
            }
            body
            fileContent
            createdAt
        }
    }
`;
