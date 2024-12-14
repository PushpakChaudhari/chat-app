import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io('http://localhost:8000');

const PrivateChat = () => {
  const { recipient } = useParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('private-message', { message, to: recipient });
      setMessages((prev) => [...prev, { name: "You", message }]);
      setMessage('');
    }
  };

  useEffect(() => {
    socket.on('receive-private', ({ name, message }) => {
      setMessages((prev) => [...prev, { name, message }]);
    });

    return () => {
      socket.off('receive-private');
    };
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <h1 className="p-4 bg-gray-200">Private Chat with {recipient}</h1>
      <div className="flex-1 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.name === "You" ? "text-right" : "text-left"}>
            <strong>{msg.name}: </strong>{msg.message}
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="p-4 bg-white shadow-md">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 border rounded-lg"
          placeholder="Type a message"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Send
        </button>
      </form>
    </div>
  );
};

export default PrivateChat;
