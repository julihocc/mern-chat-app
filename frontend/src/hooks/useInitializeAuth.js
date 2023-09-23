// frontend/src/hooks/useInitializeAuth.js

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useApolloClient } from "@apollo/client";
import gql from "graphql-tag";
import { setUser } from "../redux/slices/userSlice"; // Import the setUser action from the userSlice

const GET_CURRENT_USER = gql`
    query GetCurrentUser {
        getCurrentUser {
            _id
            email
        }
    }
`;

const useInitializeAuth = () => {
  const dispatch = useDispatch();
  const client = useApolloClient();

  useEffect(() => {
    // Fetching the token from local storage
    const token = localStorage.getItem("authToken");

    // If the token exists, set it in your app state
    if (token) {
      // Querying current user using the token
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
    }
  }, [dispatch, client]);
};

export default useInitializeAuth;
