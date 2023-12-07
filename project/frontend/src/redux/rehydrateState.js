// frontend/src/redux/rehydrateState.js
import {apolloClient} from "../apolloClient";
import gql from "graphql-tag";
import logger from "../utils/logger";

const GET_CURRENT_USER = gql`
    query GetCurrentUser {
        getCurrentUser {
            _id
            email
            username
        }
    }
`;

export const rehydrateState = async () => {

	try {
		const {data} = await apolloClient.query({
			query: GET_CURRENT_USER, fetchPolicy: "network-only",
		});
		logger.debug("rehydrated user:", data.getCurrentUser);
		return {
			user: data.getCurrentUser,
		};
	} catch (err) {
		console.error("Error retrieving current user:", err.message);
	}

	return {};
};
