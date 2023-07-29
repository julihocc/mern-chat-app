// useMessageSender.js is a custom hook that is used to send messages to the chat room.
// Path: frontend\src\components\utils\useMessageSender.js
import useSendMessage from './useSendMessage';
export default function useMessageSender() {
    const {
        messageBody,
        setMessageBody,
        file,
        setFile,
        handleFileChange,
        sendMessage,
        sendMessageLoading,
        sendMessageError,
    } = useSendMessage();

    const handleSendMessage = async (e, senderId, chatRoomId) => {  // Removed 'file' from the argument list
        e.preventDefault();
        if (messageBody.trim() !== '') {
            try {
                // Check if there's a file.
                // If there's not, it will be sent as 'undefined' which GraphQL interprets as a null value
                await sendMessage(senderId, chatRoomId, messageBody, file);
                setMessageBody('');
                setFile(null);  // Clear the file state after sending the message
            } catch (err) {
                console.error('Failed to send message:', err);
            }
        }
    };

    return {
        messageBody,
        setMessageBody,
        file,
        setFile,
        handleFileChange,
        handleSendMessage,
        sendMessageLoading,
        sendMessageError
    };
}
