import React, { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../redux/slices/userSlice';
import { LOGOUT_MUTATION } from '../gql/mutations/LOGOUT_MUTATION';

const Logout = () => {
	const [logoutMutation, { loading, error }] = useMutation(LOGOUT_MUTATION);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		logoutMutation()
			.then(() => {
				// Clear the token
				document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
				// Dispatch logout action
				dispatch(logoutUser());
				// Redirect to login page
				navigate('/login');
			})
			.catch((error) => {
				console.error('Logout error:', error);
				// Handle logout error (show message or log)
			});
	}, [logoutMutation, dispatch, navigate]);

	if (loading) return <p>Logging out...</p>;
	if (error) return <p>Error during logout!</p>;

	return null; // or a spinner/loading indicator
};

export default Logout;
