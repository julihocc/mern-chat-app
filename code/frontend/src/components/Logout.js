import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {logoutUser} from '../redux/slices/userSlice';
import {useLogoutMutation} from "../hooks/mutations/useLogoutMutation";

const Logout = () => {

	const {logoutMutation, loading, error} = useLogoutMutation();

	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		logoutMutation()
			.then(() => {
				document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
				dispatch(logoutUser());
				navigate('/login');
			})
			.catch((error) => {
				console.error('Logout error:', error);
			});
	}, [logoutMutation, dispatch, navigate]);

	if (loading) return <p>Logging out...</p>;
	if (error) return <p>Error during logout!</p>;

	return null;
};

export default Logout;
