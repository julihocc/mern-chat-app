import { GET_CHAT_ROOMS } from '../../gql/queries/GET_CHAT_ROOMS'
import {useQuery} from "@apollo/react-hooks";

export const useGetChatRooms = () => {
  const { data, loading, error } = useQuery(GET_CHAT_ROOMS, {
    fetchPolicy: 'cache-and-network',
  })

  return {
    data,
    loading,
    error,
  }
}
