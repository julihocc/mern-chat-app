// frontend\src\components\dashboardUtils\CreateGroupConversation.js

import React, {useState} from "react";
import {Alert, Button, CircularProgress, TextField, Typography,} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useGetCurrentUser} from "../hooks/queries/useGetCurrentUser";
import logger from "../utils/logger";
import {useCreateGroupConversation} from "../hooks/mutations/useCreateGroupConversation";


const CreateGroupConversation = () => {
	logger.debug("CreateGroupConversation");
	const {t} = useTranslation();
	const [emailsInput, setEmailsInput] = useState("");


	const {createGroupConversation, loading, error} = useCreateGroupConversation();

	const currentUser = useGetCurrentUser();
	logger.debug("currentUser", currentUser);
	const userEmail = currentUser.email;
	logger.debug("userEmail", userEmail);
	const handleSubmit = async (e) => {
		e.preventDefault();

		const additionalEmails = emailsInput
			.split(",")
			.map((email) => email.trim());

		await createGroupConversation({variables: {additionalEmails}});

		if (!error) {
			setEmailsInput("");
		} else {
			logger.error(error);
			throw new Error(`CREATE_GROUP_CONVERSATION Error: ${error.message}`);
		}
	};

	return (<div>
			<Typography variant="h3">{t("createGroupConversation")}</Typography>
			<form onSubmit={handleSubmit}>
				<TextField
					id="additionalEmails"
					label={t("additionalEmails")}
					placeholder={t("enterCommaSeparatedEmails")}
					variant="outlined"
					value={emailsInput}
					onChange={(e) => setEmailsInput(e.target.value)}
				/>
				<Button
					type="submit"
					variant="contained"
					color="primary"
					disabled={loading}
				>
					{t("create")}
				</Button>
			</form>
			{loading && <CircularProgress/>}
			{error && (<Alert severity="error">
					CREATE_GROUP_CONVERSATION Error: {error.message}
				</Alert>)}
		</div>);
};

export default CreateGroupConversation;
