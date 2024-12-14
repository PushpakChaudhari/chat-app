import React from 'react';
import PropTypes from 'prop-types';

const UserWindow = ({ users, currentUser, onSelectRecipient = null }) => {

  
  return (
    <div className="w-64 bg-blue-400 p-4 space-y-4 border-r-2 rounded-lg">
      <h2 className="text-xl font-semibold text-center text-white">Users</h2>
      <div className="space-y-2">
        {users.map((user, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg hover:bg-yellow-100 hover:shadow-lg text-sm uppercase flex justify-between items-center cursor-pointer ${
              user === currentUser
                ? 'bg-green-500 text-yellow-800 font-bold'
                : 'bg-white text-gray-800'
            }`}
            onClick={() => {
              if (onSelectRecipient && user !== currentUser) {
                console.log(users[currentUser])
                onSelectRecipient(user);
              }
            }}
          >
            <span>{user}</span>
            {user === currentUser && (
              <span className="text-xs font-normal text-red-800 italic">Active</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

UserWindow.propTypes = {
  users: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentUser: PropTypes.string.isRequired,
  onSelectRecipient: PropTypes.func, // Make this optional
};

export default UserWindow;
