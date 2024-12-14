// src/App.jsx
import React, { useState } from "react";
import Chat from "./Chat";
import Login from "./components/Login";
import "./App.css";
import "./index.css";

const App = () => {
  const [username, setUsername] = useState("");

  // Handle login by setting the username
  const handleLogin = (userName) => {
    setUsername(userName);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200 border">
      {/* Conditional Rendering: Show Login or Chat */}
      {username ? (
        <Chat username={username} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
