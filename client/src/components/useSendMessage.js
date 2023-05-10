// useSendMessage.js
import { useMutation, gql } from '@apollo/client';
import { SEND_MESSAGE } from './graphql';
import {useState} from "react";

const useSendMessage = () => {
    const [messageBody, setMessageBody] = useState('');
    const [sendMessageMutation, {
        loading: sendMessageLoading,
        error: sendMessageError,
        data: sendMessageData,
    }] = useMutation(SEND_MESSAGE, {
        update(cache, { data: { sendMessage } }) {
            cache.modify({
                fields: {
                    getMessagesByChatRoomId(existingMessagesRefs = [], { readField }) {
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
                            `,
                        });
                        if (
                            existingMessagesRefs.some(
                                (ref) => readField('id', ref) === sendMessage.id
                            )
                        ) {
                            return existingMessagesRefs;
                        }
                        return [...existingMessagesRefs, newMessageRef];
                    },
                },
            });
        },
    });

    const sendMessage = async (senderId, chatRoomId) => {
        try {
            await sendMessageMutation({
                variables: { senderId, chatRoomId, body: messageBody },
            });

            setMessageBody('');
        } catch (err) {
            console.log('err: ', err);
        }
    };

    return {
        messageBody,
        setMessageBody,
        sendMessage,
        sendMessageLoading,
        sendMessageError,
    };
};

export default useSendMessage;
