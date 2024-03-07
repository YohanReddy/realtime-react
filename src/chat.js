import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const Chat = () => {
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io('http://localhost:4000');

    socket.current.on('chat message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.current.on('user joined', (data) => {
      addSystemMessage(`${data.username} has joined the chat!`);
    });

    socket.current.on('typing', (data) => {
      const { username, inputValue } = data;
      showTypingMessage(username, inputValue);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  const joinChat = (e) => {
    e.preventDefault();
    if (!username) {
      alert('Please enter a username!');
      return;
    }

    socket.current.emit('join', { username });

    // Show chat form after joining
    document.getElementById('messages').style.display = 'block';
    document.getElementById('form').style.display = 'flex';
    document.getElementById('username-container').style.display = 'none';
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputValue) {
      alert('Please enter a message!');
      return;
    }

    const msg = inputValue.trim();
    setInputValue('');

    socket.current.emit('chat message', { username, message: msg });
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Notify typing event
    socket.current.emit('typing', { username, inputValue: newValue });
  };

  const addSystemMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, { systemMessage: true, message }]);
  };

  const showTypingMessage = (username, inputValue) => {
    const typingMessage = `${username}: ${inputValue}`;
    setMessages((prevMessages) => {
      const newMessages = [...prevMessages];
      const typingIndex = newMessages.findIndex((msg) => msg.typing && msg.username === username);
      if (typingIndex !== -1) {
        newMessages[typingIndex].message = typingMessage;
      } else {
        newMessages.push({ typing: true, username, message: typingMessage });
      }
      return newMessages;
    });
  };

  return (
    <div>
      <div id="username-container">
        <h1>Welcome!</h1>
        <p>Enter your username to join the chat:</p>
        <input id="username" type="text" placeholder="Enter Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <button id="join-button" onClick={joinChat}>Join</button>
      </div>
      <ul id="messages">
        {messages.map((message, index) => (
          <li key={index}>
            {message.systemMessage ? <span>{message.message}</span> : `${message.username}: ${message.message}`}
          </li>
        ))}
      </ul>
      <form id="form" onSubmit={sendMessage}>
        <input id="inputBox" autoComplete="off" value={inputValue} onChange={handleInputChange} />
        <button id="sendButton">Send</button>
      </form>
    </div>
  );
};

export default Chat;
