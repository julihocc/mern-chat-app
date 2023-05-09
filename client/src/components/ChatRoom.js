import React, {useState} from 'react';
import {useParams} from 'react-router-dom';
import {useMutation, useQuery, InMemoryCache, Reference} from '@apollo/client';
import gql from 'graphql-tag';

const GET_CHAT_ROOM = gql`
    query GetChatRoom($chatRoomId: ID!) {
        getChatRoom(chatRoomId: $chatRoomId) {
            id
            messagesIds
            participantIds
        }
    }
`;

const GET_MESSAGES_BY_CHAT_ROOM_ID = gql`
    query GetMessagesByChatRoomId($chatRoomId: ID!) {
        getMessagesByChatRoomId(chatRoomId: $chatRoomId) {
            id
            senderId
            chatRoomId
            body
            createdAt
        }
    }
`;

const SEND_MESSAGE = gql`
    mutation SendMessage($senderId: ID!, $chatRoomId: ID!, $body: String!) {
        sendMessage(senderId: $senderId, chatRoomId: $chatRoomId, body: $body) {
            id
            senderId
            chatRoomId
            body
            createdAt
        }
    }
`;

export const GET_CURRENT_USER = gql`
    query GetCurrentUser {
        getCurrentUser {
            id
            email
        }
    }
`;


const ChatRoom = () => {
    console.log('ChatRoom');
    const {id} = useParams();
    console.log('id: ', id);

    const {
        loading: chatRoomLoading, error: chatRoomError, data: chatRoomData
    } = useQuery(GET_CHAT_ROOM, {variables: {chatRoomId: id}});

    const {
        loading: messagesLoading, error: messagesError, data: messagesData
    } = useQuery(GET_MESSAGES_BY_CHAT_ROOM_ID, {variables: {chatRoomId: id}});

    const {
        loading: currentUserLoading,
        error: currentUserError,
        data: currentUserData
    } = useQuery(GET_CURRENT_USER);

    const [messageBody, setMessageBody] = useState('');
    const [sendMessage, {
        loading: sendMessageLoading,
        error: sendMessageError,
        data: sendMessageData
    }] = useMutation(SEND_MESSAGE, {
        update(cache, {data: {sendMessage}}) {
            cache.modify({
                fields:{
                    getMessagesByChatRoomId(existingMessagesRefs = [], {readField}){
                        const newMessageRef = cache.writeFragment({
                            data: sendMessage,
                            fragment: gql`
                                fragment NewMessage on Message {
                                    id
                                    senderId
                                    chatRoomId
                                    body
                                    createdAt
                                }
                            `
                        });
                        if (
                            existingMessagesRefs.some(
                                ref => readField('id', ref) === sendMessage.id
                            )
                        ) {
                            return existingMessagesRefs;
                        }
                        return [...existingMessagesRefs, newMessageRef];
                    }
                }
            })
        }
    });


    if (chatRoomLoading) return <p>GET_CHAT_ROOM Loading...</p>;
    if (chatRoomError) return <p>GET_CHAT_ROOM
        Error: {chatRoomError.message}</p>;

    const chatRoom = chatRoomData.getChatRoom;

    if (messagesLoading) return <p>GET_MESSAGES_BY_CHAT_ROOM_ID Loading...</p>;
    if (messagesError) return <p>GET_MESSAGES_BY_CHAT_ROOM_ID
        Error: {messagesError.message}</p>;

    const messages = messagesData.getMessagesByChatRoomId;
    console.log('messages: ', messages);

    if (currentUserLoading) return <p>GET_CURRENT_USER Loading...</p>;
    if (currentUserError) return <p>GET_CURRENT_USER
        Error: {currentUserError.message}</p>;

    const currentUser = currentUserData.getCurrentUser;
    console.log('currentUser: ', currentUser);

    if (sendMessageLoading) return <p>SEND_MESSAGE Loading...</p>;
    if (sendMessageError) return <p>SEND_MESSAGE
        Error: {sendMessageError.message}</p>;

    // send message functionality

    const handleSendMessage = async (e) => {
        e.preventDefault();
        console.log('handleSendMessage');

        const senderId = currentUser.id;
        const chatRoomId = chatRoom.id;

        try {
            await sendMessage({
                variables: {senderId, chatRoomId, body: messageBody}
            });

            setMessageBody('');
        } catch (err) {
            console.log('err: ', err);
        }
    }

    return (<div>
        <h2>Chat Room: {chatRoom.id}</h2>
        <ul>
            {messages.map((message) => (<li key={message.id}>
                {message.senderId}: {message.body}
            </li>))}
        </ul>
        <form onSubmit={handleSendMessage}>
            <input
                type="text"
                placeholder="New Message"
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
            />
            <button type="submit">Send Message</button>
        </form>
    </div>);
};

export default ChatRoom;
