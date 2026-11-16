import {apolloClient} from "../apolloClient.ts";
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
		const {data}: any = await apolloClient.query({
			query: GET_CURRENT_USER, fetchPolicy: "network-only",
		});
		const profile = data.getCurrentUser;
		logger.debug("rehydrated user:", profile.email);
		return {
			user: {
				user: profile,
				_id: profile._id,
				email: profile.email,
				username: profile.username,
				isLoggedIn: true,
				loading: false,
				error: null,
			},
		};
	} catch (err: any) {
		console.error("Error retrieving current user:", err.message);
	}

	return {};
};
