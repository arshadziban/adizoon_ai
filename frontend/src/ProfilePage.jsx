import React, { useState } from "react";

export default function ProfilePage({ userEmail, displayName, onDisplayNameChange, onClose, onSignOut }) {
  const userName = userEmail ? userEmail.split("@")[0] : "User";
  const joinDate = localStorage.getItem("adizoonJoinDate") || new Date().toLocaleDateString();

  // Store join date on first visit
  if (!localStorage.getItem("adizoonJoinDate")) {
    localStorage.setItem("adizoonJoinDate", new Date().toLocaleDateString());
  }

  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(displayName);

  const handleSave = () => {
    const trimmed = editValue.trim();
    if (trimmed) {
      onDisplayNameChange(trimmed);
    }
    setEditing(false);
  };

  const chatCount = (() => {
    try {
      const stored = localStorage.getItem("adizoonChatHistory");
      return stored ? JSON.parse(stored).length : 0;
    } catch { return 0; }
  })();

  const messageCount = (() => {
    try {
      const stored = localStorage.getItem("adizoonChatHistory");
      if (!stored) return 0;
      return JSON.parse(stored).reduce((sum, c) => sum + (c.messages?.length || 0), 0);
    } catch { return 0; }
  })();

  return (
    <div className="h-full w-full bg-[#161616] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[#2a2a2a]">
        <h2 className="text-lg font-semibold text-white">Profile</h2>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="max-w-lg mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Avatar + Name */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-[#2a2a2a] border border-[#3a3a3a] flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
            </svg>
          </div>
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                autoFocus
                className="bg-[#1e1e1e] border border-[#3a3a3a] rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#5a5a5a]"
              />
              <button
                onClick={handleSave}
                className="text-[#EE9225] hover:text-[#d6831f] text-sm font-medium"
              >
                Save
              </button>
              <button
                onClick={() => { setEditing(false); setEditValue(displayName); }}
                className="text-gray-500 hover:text-gray-300 text-sm"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold text-white">{displayName}</h3>
              <button
                onClick={() => { setEditing(true); setEditValue(displayName); }}
                className="p-1 text-gray-500 hover:text-white rounded transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
          )}
          <p className="text-sm text-gray-500 mt-1">{userEmail}</p>
        </div>

        {/* Info Card */}
        <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl divide-y divide-[#2a2a2a]">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-gray-400">Email</span>
            <span className="text-sm text-white">{userEmail}</span>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-gray-400">Plan</span>
            <span className="text-xs font-medium text-[#EE9225] bg-[#EE9225]/10 px-2.5 py-1 rounded-full">Free</span>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-gray-400">Member since</span>
            <span className="text-sm text-white">{joinDate}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl px-4 py-4 text-center">
            <div className="text-2xl font-bold text-white">{chatCount}</div>
            <div className="text-xs text-gray-500 mt-1">Chats</div>
          </div>
          <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl px-4 py-4 text-center">
            <div className="text-2xl font-bold text-white">{messageCount}</div>
            <div className="text-xs text-gray-500 mt-1">Messages</div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl divide-y divide-[#2a2a2a]">
          <button
            onClick={() => {
              localStorage.removeItem("adizoonChatHistory");
              window.location.reload();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-[#2a2a2a] hover:text-white transition-colors rounded-t-xl"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear all chat history
          </button>
          <button
            onClick={onSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-[#2a2a2a] hover:text-red-300 transition-colors rounded-b-xl"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
