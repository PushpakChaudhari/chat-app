import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import ChatWindow from './components/ChatWIndow';
import UserWindow from './components/UserWindow';

const socket = io('http://localhost:8000');

const Chat = ({ username }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUser, setTypingUser] = useState('');
  const [recipient, setRecipient] = useState('');
  var notificationAudio = new Audio('play.wav');
  useEffect(() => {

    



    socket.emit('new-user-joined', username);

    socket.emit('get-users', (existingUsers) => {
      setUsers(existingUsers);
    });

    // Add socket listeners here
    socket.on('user-joined', (newUser) => {
      setUsers((prev) => [...prev, newUser]);
      appendMessage(`${newUser} joined the chat`, 'left');
    });

    socket.on('user-left', (leftUser) => {
      setUsers((prev) => prev.filter((user) => user !== leftUser));
      appendMessage(`${leftUser} left the chat`, 'left');
    });

    socket.on('receive', (data) => {
      appendMessage(`${data.name}: ${data.message}`, 'left');
    });

    socket.on('private-message', (data) => {
      appendMessage(`${data.from} (private): ${data.message}`, 'left');
    });

    socket.on('typing', (userName) => {
      setTypingUser(userName);
    });

    socket.on('stop-typing', () => {
      setTypingUser('');
    });

    return () => {
      socket.off('user-joined');
      socket.off('user-left');
      socket.off('receive');
      socket.off('private-message');
      socket.off('typing');
      socket.off('stop-typing');
    };
  }, [username]);

  const appendMessage = (message, position) => {
    if(position=='left'){
      notificationAudio.play();
      }
    setMessages((prev) => [...prev, { message, position }]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      if (recipient) {
        appendMessage(`You (to ${recipient}): ${message}`, 'right');
        socket.emit('private-message', { message, to: recipient });
      } else {
        appendMessage(`You: ${message}`, 'right');
        socket.emit('send', message);
      }
      setMessage('');
    }
  };

  const handleTyping = () => {
    socket.emit('typing', username);
    setTimeout(() => socket.emit('stop-typing'), 1000);
  };

  return (
    <div className="flex h-screen bg-gray-100 text-center w-[80%] lg:w-[60%] py-2 mt-2 rounded-sm shadow-2xl">
      <UserWindow users={users} currentUser={username} onSelectRecipient={setRecipient} />

      <div className="flex-1 flex flex-col">
        <nav className="text-blue-400 font-extrabold p-4 bg-white shadow-2xl " >
          <h1>{recipient ? `Chat with ${recipient}` : 'Group Chat'}</h1>
        </nav>

        <ChatWindow messages={messages} />

        {typingUser && (
          <div className="flex justify-end p-2">
            <div className="bg-gray-200 text-black mr-auto px-4 py-2 rounded-lg text-sm italic animate-pulse">
              {typingUser} is typing...
            </div>
          </div>
        )}

        <div className="p-4 bg-white shadow-md">
          {recipient && (
            <div className="text-sm text-gray-700 italic mb-2">
              Messaging: <span className="font-bold">{recipient}</span>
              <button
                onClick={() => setRecipient('')}
                className="ml-2 text-xs text-red-500 underline"
              >
                Cancel
              </button>
            </div>
          )}
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleTyping();
              }}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Type a message"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
