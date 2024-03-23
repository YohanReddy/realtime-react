import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import MessageList from './messageList';
import TypingIndicator from './typingIndicator';
import MessageInputForm from './messageInputForm';
import SummarySection from './summarySection';

const Chat = () => {
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [typingMessage, setTypingMessage] = useState('');
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io('https://server-realtime-chat-phqj.onrender.com');

    socket.current.on('chat message', (data) => {
      setMessages(prevMessages => [...prevMessages, data]);
      setTypingMessage('');
    });

    socket.current.on('user joined', (data) => {
      addSystemMessage(`${data.username} has joined the chat!`);
    });

    socket.current.on('typing', (data) => {
      setTypingMessage(`${data.username}: ${data.inputValue}`);
    });

    socket.current.on('disconnect', () => {
      addSystemMessage('Disconnected from server. Please refresh the page to reconnect.');
    });

    socket.current.on('connect_error', (error) => {
      addSystemMessage(`Connection error: ${error.message}`);
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

    document.getElementById('messages').style.display = 'block';
    document.getElementById('form').style.display = 'flex';
    document.getElementById('username-container').style.display = 'none';
  };

  const sendMessage = () => {
    if (!username) {
      alert('Please enter a username!');
      return;
    }
    if (!inputValue) {
      alert('Please enter a message!');
      return;
    }

    const msg = inputValue.trim();
    setInputValue('');
    setTypingMessage('');

    socket.current.emit('chat message', { username, message: msg });
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    socket.current.emit('typing', { username, inputValue: newValue });
  };

  const addSystemMessage = (message) => {
    setMessages(prevMessages => [...prevMessages, { systemMessage: true, message }]);
  };

  return (
    <div className="chat-container">
      <div id="username-container">
        <h1>Welcome!</h1>
        <p>Enter your username to join the chat:</p>
        <input id="username" type="text" placeholder="Enter Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <button id="join-button" onClick={joinChat}>Join</button>
      </div>
      <MessageList messages={messages} typingMessage={typingMessage} /> {/* Pass typingMessage to MessageList */}
      <MessageInputForm sendMessage={sendMessage} handleInputChange={handleInputChange} inputValue={inputValue} />
      <SummarySection messages={messages} />
    </div>
  );
};

export default Chat;
