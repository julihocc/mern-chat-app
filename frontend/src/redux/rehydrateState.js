// frontend/src/redux/rehydrateState.js

import apolloClient from "../apolloClient";
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
  // Retrieve the auth token from local storage
  const token = localStorage.getItem("authToken");

  // If a token exists, try to fetch the current user
  if (token) {
    try {
      const { data } = await apolloClient.query({
        query: GET_CURRENT_USER,
        fetchPolicy: "network-only",
      });

      return {
        user: {
          user: data.getCurrentUser, // Setting the user object
          isLoggedIn: true, // Assuming the user is logged in
          loading: false, // No loading since data is fetched
          error: null, // No errors
        },
        // Add other slices' initial state if needed
      };
    } catch (err) {
      console.error("Error retrieving current user:", err.message);
    }
  }

  // If no token is found, return an empty object
  return {};
};
