// messageList.js

import React from 'react';
import Message from './message';
import TypingIndicator from './typingIndicator';

const MessageList = ({ messages, typingMessage }) => (
  <ul id="messages">
    {messages.map((message, index) => (
      <Message key={index} message={message} />
    ))}
    {typingMessage && <TypingIndicator typingMessage={typingMessage} />} {/* Render TypingIndicator if typingMessage is present */}
  </ul>
);

export default MessageList;
