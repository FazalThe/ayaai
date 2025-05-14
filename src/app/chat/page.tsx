import React from 'react';

export default function ChatPage() {
  return (
    <div className="flex flex-col h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">AyaAI Chat</h1>
      {/* Chat interface components will go here */}
      <div className="flex-grow border rounded p-2 mb-4">
        {/* Message display area */}
        <p className="text-gray-500">Chat messages will appear here...</p>
      </div>
      <div className="flex">
        <input
          type="text"
          placeholder="Ask AyaAI..."
          className="flex-grow border rounded-l p-2"
        />
        <button className="bg-green-700 text-white p-2 rounded-r hover:bg-green-800">
          Send
        </button>
      </div>
    </div>
  );
}
