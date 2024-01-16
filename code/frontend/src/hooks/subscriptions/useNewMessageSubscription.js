import { useSubscription } from "@apollo/client";
import { NEW_MESSAGE_SUBSCRIPTION } from "../../gql/subscriptions/NEW_MESSAGE_SUBSCRIPTION";

export default function useNewMessageSubscription(id) {
  const { data: newMessageData } = useSubscription(NEW_MESSAGE_SUBSCRIPTION, {
    variables: { chatRoomId: id },
  });
  return { newMessageData };
}
