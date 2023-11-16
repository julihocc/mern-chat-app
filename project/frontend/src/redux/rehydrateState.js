// frontend/src/redux/rehydrateState.js
import {contactServiceApolloClient} from "../apolloClient";
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

	try {
		const {data} = await contactServiceApolloClient.query({
			query: GET_CURRENT_USER, fetchPolicy: "network-only",
		});

		return {
			user: data.getCurrentUser,
		};
	} catch (err) {
		console.error("Error retrieving current user:", err.message);
	}

	return {};
};
