// path: frontend/src/components/PendingContactRequestsList.js
import React, { useEffect, useState } from "react";
import { useGetContactRequestsByContext } from "../hooks/queries/useGetContactRequestsByContext";
import { useAcceptContactRequest } from "../hooks/mutations/useAcceptContactRequest";
import { useRejectContactRequest } from "../hooks/mutations/useRejectContactRequest";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import logger from "../utils/logger";
import { useSubscription } from "@apollo/client";
import { NEW_CONTACT_REQUEST } from "../gql/subscriptions/NEW_CONTACT_REQUEST";
import Alert from "@mui/material/Alert";

const PendingContactRequestsList = () => {
  const { _id } = useSelector((state) => state.user);
  const userId = _id;
  const { t } = useTranslation();
  const { loading, error, data, refetch } = useGetContactRequestsByContext();
  const acceptContactRequestHandler = useAcceptContactRequest(userId);
  const rejectContactRequestHandler = useRejectContactRequest(userId);
  const [refreshKey, setRefreshKey] = useState(0);

  const [pendingRequests, setPendingRequests] = useState([]);

  const {
    data: newContactRequestData,
    error: newContactRequestError,
    loading: newContactRequestLoading,
  } = useSubscription(NEW_CONTACT_REQUEST, {
    onComplete: () => {
      // logger.debug("New contact request subscription completed");
      const pendingRequestsUpdated = data.getContactRequestsByContext.filter(
        (request) => request.status === "pending"
      );
      setPendingRequests(pendingRequestsUpdated);
      // setPendingRequests(newContactRequestData.newContactRequest);
    },
    onError: (err) => {
      logger.error("*Error in new contact request subscription:", err);
    },
  });

  useEffect(() => {
    if (newContactRequestLoading) {
      logger.debug("Subscribing to new contact requests...");
    }
    if (newContactRequestData) {
      logger.debug("New contact request data received:", newContactRequestData);
    }
    if (newContactRequestError) {
      logger.error(
        "Error in new contact request subscription:",
        newContactRequestError
      );
    }
    if (data) {
      const pendingRequestsUpdated = data.getContactRequestsByContext.filter(
        (request) => request.status === "pending"
      );
      setPendingRequests(pendingRequestsUpdated);
    }
  }, [
    newContactRequestData,
    newContactRequestError,
    newContactRequestLoading,
    data,
  ]);

  const forceUpdate = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };

  useEffect(() => {
    refetch();
  }, [refreshKey, refetch]);

  // if (newContactRequestLoading) return <p>Loading (Subscriptions)...</p>;

  if (loading) return <p>Loading...</p>;
  // if (newContactRequestLoading) return <p>New Contact Request Loading...</p>;
  if (error) return <p>Error : {error.message} </p>;

  // if (pendingRequests.length === 0) return null;

  return (
    <div>
      <h1>Pending contact requests</h1>
      {newContactRequestData && (
        <Alert severity="info">You have a new contact request</Alert>
      )}
      <h3> {t("contactRequest")} </h3>
      <ul>
        {pendingRequests.map(({ _id, senderId, status, createdAt }) => (
          <li key={_id}>
            <p>sender: {senderId.email}</p>
            <p>status: {status}</p>
            <p>createdAt: {Date(createdAt)}</p>
            <div>
              <button
                onClick={async () => {
                  try {
                    await acceptContactRequestHandler({
                      variables: { requestId: _id },
                    });
                    forceUpdate();
                  } catch (error) {
                    logger.error("Error accepting contact request:", error);
                  }
                }}
              >
                Accept
              </button>
              <button
                onClick={async () => {
                  try {
                    await rejectContactRequestHandler({
                      variables: { requestId: _id },
                    });
                    forceUpdate();
                  } catch (error) {
                    logger.error("Error rejecting contact request:", error);
                  }
                }}
              >
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PendingContactRequestsList;
