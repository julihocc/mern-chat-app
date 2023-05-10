import React from 'react';
import { useParams } from 'react-router-dom';
import Loading from './Loading';
import Error from './Error';
import useChatRoomQuery from './useChatRoomQuery';
import useMessageSender from './useMessageSender';

const ChatRoom = () => {
    const { id } = useParams();
    const { chatRoom, messages, currentUser } = useChatRoomQuery(id);
    const { messageBody, setMessageBody, handleSendMessage, sendMessageLoading, sendMessageError } = useMessageSender();

    const isLoading = chatRoom.loading || messages.loading || currentUser.loading || sendMessageLoading;
    const error = chatRoom.error || messages.error || currentUser.error || sendMessageError;

    if (isLoading) {
        return <Loading queryName="Loading" />;
    }

    if (error) {
        return <Error queryName="Error" message={error.message} />;
    }

    return (
        <div>
            <h2>Chat Room: {chatRoom.data.getChatRoom.id}</h2>
            <ul>
                {messages.data.getMessagesByChatRoomId.map((message) => (
                    <li key={message.id}>
                        {message.senderId}: {message.body}
                    </li>
                ))}
            </ul>
            <form onSubmit={(e) => handleSendMessage(e, currentUser.data.getCurrentUser.id, chatRoom.data.getChatRoom.id)}>
                <input
                    type="text"
                    placeholder="New Message"
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                />
                <button type="submit">Send Message</button>
            </form>
        </div>
    );
};

export default ChatRoom;
