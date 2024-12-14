import React, { useState } from 'react';
import logo from './chat-svgrepo-com.png'; // Import the logo from the same folder

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username); // Pass the username to the parent
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-r from-blue-300 via-purple-400 to-pink-400 ">
      {/* Logo Section */}
      <img
        src={logo} // Use the imported logo here
        alt="Buddy Chat Logo"
        className="w-24 h-24 mb-6 blink"  // Removed rounded-full and added size styling
      />
      <h1 className="text-3xl font-bold text-white mb-4 sha">Buddy Chat</h1>

      {/* Login Form */}
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-xl w-96">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Enter Your Username</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700 transition duration-200"
        >
          Join Chat
        </button>
      </form>
    </div>
  );
};

export default Login;
