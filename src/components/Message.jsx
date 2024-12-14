// Message.js
import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes

const Message = ({ message, position }) => {
  return (
    <div
      className={`message p-2 rounded-lg max-w-xs ${
        position === 'right' ? 'ml-auto bg-blue-500 text-white' : 'mr-auto bg-blue-50'
      }`}
    >
      {message}
    </div>
  );
};

// Prop validation for 'message' and 'position'
Message.propTypes = {
  message: PropTypes.string.isRequired,  // 'message' should be a string
  position: PropTypes.oneOf(['left', 'right']).isRequired, // 'position' can only be 'left' or 'right'
};

export default Message;
