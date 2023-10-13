// Importing required dependencies and configurations
// frontend/src/redux/rehydrateState.js
import apolloClient from "../apolloClient";
import gql from "graphql-tag";

// Defining GraphQL query to get the current user
const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    getCurrentUser {
      id
      email
      username
    }
  }
`;

// Async function to rehydrate state from the Apollo client
export const rehydrateState = async () => {
  // Attempt to fetch the token from local storage
  // TODO: Remove localStorage and use only cookies
  // const token = localStorage.getItem("authToken");

  // Check if the token exists
  // if (token) {
    try {
      // Perform Apollo client query to fetch current user data
      const { data } = await apolloClient.query({
        query: GET_CURRENT_USER,
        fetchPolicy: "network-only",
      });

      // Populate initial state for the 'user' slice using the fetched data
      return {
        user: data.getCurrentUser,
        // Add other slices' initial state here if needed
      };
    } catch (err) {
      // Log any errors that occur during the fetch operation
      console.error("Error retrieving current user:", err.message);
    }
  // }

  // Return an empty object if no token is found, effectively initializing the store with empty state
  return {};
};
