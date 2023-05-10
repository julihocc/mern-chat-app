// Message.js
import React from 'react';

const Message = ({ message }) => <li>{message.senderId}: {message.body}</li>;

export default Message;
