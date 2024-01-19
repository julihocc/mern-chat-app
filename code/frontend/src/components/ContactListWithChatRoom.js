// frontend\src\components\ContactListWithChatRoom.js
import React, { useEffect } from "react";
import { useGetContactsWithChatRoom } from "../hooks/queries/useGetContactsWithChatRoom";
import { Alert, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useSubscription } from "@apollo/client";
import log from "../utils/logger";
import { useState } from "react";
import { NEW_CONTACT } from "../gql/subscriptions/NEW_CONTACT";

export const ContactListWithChatRoom = () => {
  const { t } = useTranslation();
  const { loading, error, data } = useGetContactsWithChatRoom();
  const [contacts, setContacts] = useState([]);

  const {
    loading: loadingNewContact,
    error: errorNewContact,
    data: dataNewContact,
  } = useSubscription(NEW_CONTACT, {
    onComplete: () => {
      if (data) {
        const contactsUpdated = data.getContactsWithChatRoom;
        setContacts(contactsUpdated);
      }
    },
    onError: (err) => {
      log.error("*Error in new contact subscription:", err);
    },
  });

  useEffect(() => {
    if (loadingNewContact) {
      log.debug("Subscribing to new contact...");
    }
    if (dataNewContact) {
      log.debug("New contact data received:", dataNewContact);
    }
    if (errorNewContact) {
      log.error("Error in new contact subscription:", errorNewContact);
    }
    if (data) {
      const contactsUpdated = data.getContactsWithChatRoom;
      setContacts(contactsUpdated);
    }
  }, [loadingNewContact, errorNewContact, dataNewContact, data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  // const contacts = data.getContactsWithChatRoom;

  return (
    <div>
      <Typography variant="h3">{t("contacts")}</Typography>
      {dataNewContact && (
        <Alert severity="info">
          New contact: {dataNewContact.newContact.email}
        </Alert>
      )}
      <ul>
        {contacts &&
          contacts.map((contact) => (
            <li key={contact._id}>
              <Link to={`/chat/${contact.chatRoom}`} key={contact._id}>
                Chat: {contact.email}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
};
