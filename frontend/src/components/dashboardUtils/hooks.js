// path: frontend\src\components\dashboardUtils\hooks.js
import {useMutation, useQuery} from '@apollo/react-hooks';
import {GET_CONTACT_REQUESTS, ACCEPT_CONTACT_REQUEST, REJECT_CONTACT_REQUEST} from './graphql';

export const useGetContactRequests = (userId) => {
    const {loading, error, data} = useQuery(GET_CONTACT_REQUESTS, {
        variables: {userId}, fetchPolicy: 'network-only',
    });

    return {loading, error, data};
}

export const useAcceptContactRequest = (userId) => {
    const [acceptContactRequest] = useMutation(ACCEPT_CONTACT_REQUEST, {
        refetchQueries: [{query: GET_CONTACT_REQUESTS, variables: {userId}}],
    });

    return acceptContactRequest;
}

export const useRejectContactRequest = (userId) => {
    const [rejectContactRequest] = useMutation(REJECT_CONTACT_REQUEST, {
        refetchQueries: [{query: GET_CONTACT_REQUESTS, variables: {userId}}],
    });

    return rejectContactRequest;
}
