// ChatWindow.js
import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import Message from './Message';

const ChatWindow = ({ messages }) => {
  return (
    <div className="flex-1 bg-green-300 p-4 overflow-y-auto" style={{ height: '60vh', backgroundColor: 'aquamarine' }}>
      <div className="space-y-4">
        {messages.map((msg, index) => (
          <Message key={index} message={msg.message} position={msg.position} />
        ))}
      </div>
    </div>
  );
};

// Prop validation for 'messages' prop
ChatWindow.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      message: PropTypes.string.isRequired,  // Each message should be a string
      position: PropTypes.oneOf(['left', 'right']).isRequired,  // 'position' should be either 'left' or 'right'
    })
  ).isRequired,  // 'messages' should be an array of objects and is required
};

export default ChatWindow;
