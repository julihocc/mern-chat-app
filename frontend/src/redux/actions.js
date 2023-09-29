// frontend/src/redux/actions.js
// Action to initiate saga for fetching the current user
export const initiateFetchCurrentUser = () => {
    return { type: 'FETCH_CURRENT_USER_SAGA' };
};
