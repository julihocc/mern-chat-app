import { useQuery } from "@apollo/client/react";
import { GET_CURRENT_USER } from "../../gql/queries/GET_CURRENT_USER";

export const useGetCurrentUser = () => {
  const { loading, error, data } = (useQuery as any)(GET_CURRENT_USER, {
    fetchPolicy: "network-only",
  });

  return { loading, error, data };
};
