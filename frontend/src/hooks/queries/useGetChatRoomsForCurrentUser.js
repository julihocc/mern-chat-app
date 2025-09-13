import { GET_CHAT_ROOMS_FOR_CURRENT_USER } from "../../gql/queries/GET_CHAT_ROOMS_FOR_CURRENT_USER";
import { useQuery } from "@apollo/react-hooks";

export const useGetChatRoomsForCurrentUser = () => {
  const { data, loading, error } = useQuery(GET_CHAT_ROOMS_FOR_CURRENT_USER, {
    fetchPolicy: "cache-and-network",
  });

  return {
    data,
    loading,
    error,
  };
};
