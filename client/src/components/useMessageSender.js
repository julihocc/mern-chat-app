import useSendMessage from './useSendMessage';

export default function useMessageSender() {
    const {
        messageBody,
        setMessageBody,
        sendMessage,
        sendMessageLoading,
        sendMessageError,
    } = useSendMessage();

    const handleSendMessage = async (e, senderId, chatRoomId) => {
        e.preventDefault();
        if (messageBody.trim() !== '') {
            try {
                await sendMessage({
                    variables: {
                        senderId,
                        chatRoomId,
                        body: messageBody,
                    },
                });
                setMessageBody('');
            } catch (err) {
                console.error('Failed to send message:', err);
            }
        }
    };

    return { messageBody, setMessageBody, handleSendMessage, sendMessageLoading, sendMessageError };
}
