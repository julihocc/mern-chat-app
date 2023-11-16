// frontend\src\components\ContactListWithChatRoom.js
import React from "react";
import {useGetContactsWithChatRoom} from "../hooks/queries/useGetContactsWithChatRoom";
import {Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";

export const ContactListWithChatRoom = () => {
	const {t} = useTranslation();
	const {loading, error, data} = useGetContactsWithChatRoom();
	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error : {error.message}</p>;

	const contacts = data.getContactsWithChatRoom;
	return (
		<div>
			<Typography variant="h3">{t("contacts")}</Typography>
			<ul>
				{contacts &&
					contacts.map((contact) => (
						<li key={contact.id}>
							<Link to={`/chat/${contact.chatRoom}`} key={contact.id}>
								Chat: {contact.email}
							</Link>
						</li>
					))}
			</ul>
		</div>
	);
};
