// frontend/src/redux/rehydrateState.js

import apolloClient from "../apolloClient"; // Import Apollo client if needed
import gql from "graphql-tag";

const GET_CURRENT_USER = gql`
    query GetCurrentUser {
        getCurrentUser {
            id
            email
            username
        }
    }
`;

export const rehydrateState = async () => {
  const token = localStorage.getItem("authToken");

  if (token) {
    try {
      const { data } = await apolloClient.query({
        query: GET_CURRENT_USER,
        fetchPolicy: "network-only",
      });

      return {
        user: data.getCurrentUser, // Initial state for user slice
        // Add other slices' initial state if needed
      };
    } catch (err) {
      console.error("Error retrieving current user:", err.message);
    }
  }

  return {}; // Return an empty object if no token found
};
