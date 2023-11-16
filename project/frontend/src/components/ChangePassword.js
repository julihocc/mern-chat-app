import React, {useState} from "react";
import {useChangePassword} from "../hooks/mutations/useChangePassword";
import {Box, Button, TextField, Typography} from "@mui/material";
import logger from "../utils/logger";

export const ChangePassword = () => {
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const {changePassword} = useChangePassword();

	const handlePasswordChange = async () => {
		try {
			if (newPassword !== confirmPassword) {
				logger.error("Password and its confirmation do not match");
				throw new Error("Passwords do not match");
			} else {
				logger.debug(`Changing password to ${newPassword}`);
			}
			await changePassword({
				variables: {oldPassword: currentPassword, newPassword},
			});
		} catch (error) {
			throw new Error(`Could not change password: ${error.message}`);
		}
	};

	return (<Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
		<Typography variant="h6">Change Password</Typography>
		<TextField
			type="password"
			label="Current Password"
			variant="outlined"
			value={currentPassword}
			onChange={(e) => setCurrentPassword(e.target.value)}
			margin="normal"
		/>
		<TextField
			type="password"
			label="New Password"
			variant="outlined"
			value={newPassword}
			onChange={(e) => setNewPassword(e.target.value)}
			margin="normal"
		/>
		<TextField
			type="password"
			label="Confirm New Password"
			variant="outlined"
			value={confirmPassword}
			onChange={(e) => setConfirmPassword(e.target.value)}
			margin="normal"
		/>
		<Button variant="contained" color="primary" onClick={handlePasswordChange}>
			Change Password
		</Button>
	</Box>);
};
