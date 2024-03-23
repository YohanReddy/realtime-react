import React from 'react';

const Message = ({ message }) => {
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <li>
      {message.systemMessage ? (
        <span>{message.message} - {timestamp}</span>
      ) : (
        <>
          {message.username}: {message.message} - {timestamp}
        </>
      )}
    </li>
  );
};

export default Message;
