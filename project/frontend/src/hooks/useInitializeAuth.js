import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useApolloClient } from "@apollo/client";
import gql from "graphql-tag";
import { setUser } from "../redux/slices/userSlice";
import { contactServiceApolloClient } from "../apolloClient";

const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    getCurrentUser {
      id
      email
    }
  }
`;

const useInitializeAuth = () => {
  const dispatch = useDispatch();
  // const client = useApolloClient();
  const client = contactServiceApolloClient;

  useEffect(() => {
    // TODO: Remove localStorage and use only cookies
    // const token = localStorage.getItem("authToken");

    // if (token) {
      client
        .query({
          query: GET_CURRENT_USER,
          fetchPolicy: "network-only",
        })
        .then(({ data }) => {
          // Dispatching the setUser action with the retrieved user data
          dispatch(setUser(data.getCurrentUser));
        })
        .catch((err) => {
          // Handle the error if needed
          console.error("Error retrieving current user:", err.message);
        });
    // }
  }, [dispatch, client]);
};

export default useInitializeAuth;
