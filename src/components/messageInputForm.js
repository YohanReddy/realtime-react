import React from 'react';

const MessageInputForm = ({ sendMessage, handleInputChange, inputValue }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <form id="form" onSubmit={handleSubmit}>
      <input id="inputBox" autoComplete="off" value={inputValue} onChange={handleInputChange} />
      <button id="sendButton" type="submit">Send</button>
    </form>
  );
};

export default MessageInputForm;
