import { SEND_MESSAGE } from "../../gql/mutations/SEND_MESSAGE";
import { GET_MESSAGES_BY_CHATROOM_ID } from "../../gql/queries/GET_MESSAGES_BY_CHATROOM_ID";
import { useMutation } from "@apollo/client/react";
import logger from "../../utils/logger";

export const useSendMessage = (chatRoomId: any) => {
  const [sendMessageMutation, { loading, error }] = (useMutation as any)(SEND_MESSAGE, {
    refetchQueries: [
      { query: GET_MESSAGES_BY_CHATROOM_ID, variables: { chatRoomId } },
    ],
    onCompleted: (data: any) => {
      logger.debug("Message sent successfully:", data);
    },
    onError: (error: any) => {
      logger.error("Error sending message:", error);
    },
  });

  return {
    sendMessageMutation,
    loading,
    error,
  };
};
