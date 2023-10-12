import { useQuery } from "@apollo/client";
import { GET_CHAT_ROOMS } from "../../gql/queries/GET_CHAT_ROOMS";

export default function useGetChatRooms() {
  const { loading, error, data } = useQuery(GET_CHAT_ROOMS, {
    fetchPolicy: "network-only", // ignore cache
  });

  return {
    loading,
    error,
    data,
  };
}
