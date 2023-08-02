import {useQuery} from "@apollo/client";
import {GET_USERS_BY_ID} from "../../gql/queries/GET_USERS_BY_ID";
import logger from "loglevel";

export function useGetUsersById(participantIds) {
    logger.debug("useGetUsersById");
    logger.debug(participantIds);
    const { loading, error, data } = useQuery(GET_USERS_BY_ID, {
        variables: { userIds: participantIds }
    });
    return { loading, error, data };
}
