import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const CREATE_GROUP_CONVERSATION = gql`
    mutation CreateGroupConversation($emails: [String!]!) {
        createGroupConversation(emails: $emails) {
            id
        }
    }
`;

const CreateGroupConversation = ({ userEmail }) => {
    const [emailsInput, setEmailsInput] = useState('');
    const [createGroupConversation, { data, loading, error }] = useMutation(CREATE_GROUP_CONVERSATION);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const additionalEmails = emailsInput.split(',').map(email => email.trim());
        const emails = [userEmail, ...additionalEmails];

        await createGroupConversation({ variables: { emails } });

        if (!error) {
            setEmailsInput('');  // clear the input field after successful submission
        }
    };

    return (
        <div>
            <h2>Create Group Conversation</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="emails">Emails:</label>
                <input
                    id="emails"
                    type="body"
                    placeholder="Enter comma-separated emails"
                    value={emailsInput}
                    onChange={(e) => setEmailsInput(e.target.value)}
                />
                <button type="submit">Create</button>
            </form>
            {loading && <p>Loading...</p>}
            {error && <p>CREATE_GROUP_CONVERSATION Error: {error.message}</p>}
            {data && <p>Group Conversation ID: {data.createGroupConversation.id}</p>}
        </div>
    );
};

export default CreateGroupConversation;
