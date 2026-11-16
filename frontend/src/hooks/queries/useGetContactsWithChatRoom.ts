import { useQuery } from "@apollo/client/react";
import { GET_CONTACTS_WITH_CHATROOM } from "../../gql/queries/GET_CONTACTS_WITH_CHATROOM";

export const useGetContactsWithChatRoom = () => {
  const { data, loading, error } = (useQuery as any)(GET_CONTACTS_WITH_CHATROOM, {
    fetchPolicy: "cache-and-network",
  });

  return {
    data,
    loading,
    error,
  };
};
