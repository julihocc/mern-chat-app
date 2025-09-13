import { useQuery } from "@apollo/react-hooks";
import { GET_CONTACTS_WITH_CHATROOM } from "../../gql/queries/GET_CONTACTS_WITH_CHATROOM";

export const useGetContactsWithChatRoom = () => {
  const { data, loading, error } = useQuery(GET_CONTACTS_WITH_CHATROOM, {
    fetchPolicy: "cache-and-network",
  });

  return {
    data,
    loading,
    error,
  };
};
