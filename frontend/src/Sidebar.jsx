import React, { useState, useRef, useEffect } from "react";

// Logo Component
const MicrophoneLogo = () => (
  <img src="/assets/logo.png" alt="Adizoon" className="w-7 h-7 rounded-full object-cover" />
);

export default function Sidebar({
  history = [],
  selectedId,
  onSelectChat,
  onNewChat,
  onClearAll,
  onDeleteChat,
  onRenameChat,
  userName,
  onSignOut,
  onOpenProfile,
  onOpenUpgrade,
  onOpenSettings,
  isOpen = true,
  onToggle = () => {},
  isHidden = false,
  onHiddenToggle = () => {}
}) {
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [hoveredId, setHoveredId] = useState(null);
  const menuRef = useRef(null);
  const inputRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus input when editing
  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const handleEditClick = (chat, e) => {
    e.stopPropagation();
    setEditingId(chat.id);
    setEditingTitle(chat.title);
    setMenuOpenId(null);
  };

  const handleEditSave = (id) => {
    if (editingTitle.trim()) {
      onRenameChat && onRenameChat(id, editingTitle.trim());
    }
    setEditingId(null);
    setEditingTitle("");
  };

  const handleEditKeyDown = (e, id) => {
    if (e.key === "Enter") {
      handleEditSave(id);
    } else if (e.key === "Escape") {
      setEditingId(null);
      setEditingTitle("");
    }
  };
  // Collapsed sidebar (icon bar) for desktop
  if (isHidden) {
    return (
      <div className="hidden md:flex bg-[#1e1e1e] border-r border-[#2a2a2a] w-14 h-screen flex-col items-center py-4">
        {/* Logo */}
        <img src="/assets/logo.png" alt="Adizoon" className="w-6 h-6 rounded-full object-cover mb-4" />
        
        {/* Expand button */}
        <button
          className="text-gray-400 hover:text-white hover:bg-[#2a2a2a] p-2 rounded-full transition-colors mb-4 group relative"
          onClick={onHiddenToggle}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-white bg-[#2a2a2a] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Expand sidebar
          </span>
        </button>

        {/* New Chat button */}
        <button
          className="group relative text-gray-400 hover:text-white p-2 hover:bg-[#2a2a2a] rounded-full transition-colors mb-2"
          onClick={onNewChat}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-white bg-[#2a2a2a] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            New Chat
          </span>
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Profile icon */}
        <div className="relative">
          <button
            className="group relative p-1 mb-2"
            onClick={() => setMenuOpenId(menuOpenId === 'profile' ? null : 'profile')}
          >
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
            </svg>
          </button>

          {/* Profile dropdown menu */}
          {menuOpenId === 'profile' && (
            <div
              ref={menuRef}
              className="absolute bottom-full left-0 mb-2 w-48 bg-[#2a2a2a] rounded-lg shadow-lg border border-[#3a3a3a] py-1 z-50"
            >
              <button
                className="w-full px-3 py-2.5 text-left text-sm text-gray-300 hover:bg-[#3a3a3a] hover:text-white flex items-center gap-3 transition-colors"
                onClick={() => { setMenuOpenId(null); onOpenProfile && onOpenProfile(); }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </button>
              <button
                className="w-full px-3 py-2.5 text-left text-sm text-gray-300 hover:bg-[#3a3a3a] hover:text-white flex items-center gap-3 transition-colors"
                onClick={() => { setMenuOpenId(null); onOpenUpgrade && onOpenUpgrade(); }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Upgrade plan
              </button>
              <button
                className="w-full px-3 py-2.5 text-left text-sm text-gray-300 hover:bg-[#3a3a3a] hover:text-white flex items-center gap-3 transition-colors"
                onClick={() => { setMenuOpenId(null); onOpenSettings && onOpenSettings(); }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.11 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </button>
              <div className="border-t border-[#3a3a3a] my-1"></div>
              <button
                className="w-full px-3 py-2.5 text-left text-sm text-gray-300 hover:bg-[#3a3a3a] hover:text-red-400 flex items-center gap-3 transition-colors"
                onClick={() => { setMenuOpenId(null); onSignOut && onSignOut(); }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={onToggle}
        />
      )}

      <div
        className={`
          bg-[#1e1e1e] border-r border-[#2a2a2a] box-border pt-5 pb-4
          flex flex-col
          fixed md:static left-0 top-0 bottom-0 z-40
          w-70
          h-screen
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        `}
      >
        {/* Header with Logo and Collapse */}
        <div className="px-4 flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
            <MicrophoneLogo />
            <span className="text-white font-semibold text-lg">Adizoon</span>
          </div>
          {/* Hide sidebar button - shown on both mobile and desktop */}
          <button
            className="text-gray-400 hover:text-white hover:bg-[#2a2a2a] p-2 rounded-full transition-colors group relative"
            onClick={() => {
              // On mobile, close the sidebar overlay
              if (window.innerWidth < 768) {
                onToggle();
              } else {
                // On desktop, collapse the sidebar
                onHiddenToggle();
              }
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 text-xs text-white bg-[#2a2a2a] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Hide sidebar
            </span>
          </button>
        </div>

        {/* New Chat Button */}
        <div className="px-3 mb-2">
          <button
            className="w-full py-2.5 px-4 rounded-lg text-white text-sm font-medium
              flex items-center gap-3 hover:bg-[#2a2a2a] transition-colors"
            onClick={onNewChat}
          >
            <span className="text-lg">+</span>
            <span>New Chat</span>
          </button>
        </div>

        {/* Conversations list */}
        <div className="flex-1 overflow-y-auto px-3 mt-2">
          {history.length > 0 && (
            <div className="flex items-center justify-between mb-2 px-2">
              <span className="text-gray-500 text-xs uppercase tracking-wider">
                Recent
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('Are you sure you want to delete all chat history?')) {
                    onClearAll && onClearAll();
                  }
                }}
                className="text-gray-500 hover:text-red-500 text-xs uppercase tracking-wider transition-colors"
              >
                Delete All
              </button>
            </div>
          )}
          {history.map(chat => (
            <div
              key={chat.id}
              onClick={() => !editingId && onSelectChat(chat.id)}
              onMouseEnter={() => setHoveredId(chat.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`
                mb-1 flex items-center py-2.5 px-3 rounded-lg
                text-sm cursor-pointer transition-colors relative
                ${
                  chat.id === selectedId
                    ? "bg-[#2a2a2a] text-white"
                    : "text-gray-400 hover:bg-[#252525] hover:text-white"
                }
              `}
            >
              <svg className="w-4 h-4 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              
              {editingId === chat.id ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onKeyDown={(e) => handleEditKeyDown(e, chat.id)}
                  onBlur={() => handleEditSave(chat.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 bg-[#3a3a3a] text-white text-sm px-2 py-1 rounded outline-none border border-[#4a6cf7]"
                />
              ) : (
                <span className="flex-1 truncate">{chat.title}</span>
              )}

              {/* 3-dot menu - always present but opacity changes on hover */}
              {!editingId && (
                <div className="relative" ref={menuOpenId === chat.id ? menuRef : null}>
                  <button
                    className={`ml-2 p-1 text-gray-500 hover:text-white hover:bg-[#3a3a3a] rounded transition-all ${
                      hoveredId === chat.id || menuOpenId === chat.id ? 'opacity-100' : 'opacity-0'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpenId(menuOpenId === chat.id ? null : chat.id);
                    }}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="5" r="2" />
                      <circle cx="12" cy="12" r="2" />
                      <circle cx="12" cy="19" r="2" />
                    </svg>
                  </button>

                  {/* Dropdown menu */}
                  {menuOpenId === chat.id && (
                    <div className="absolute right-0 top-full mt-1 bg-[#2a2a2a] rounded-lg shadow-lg border border-[#3a3a3a] py-1 z-50 min-w-30">
                      <button
                        className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-[#3a3a3a] hover:text-white flex items-center gap-2 transition-colors"
                        onClick={(e) => handleEditClick(chat, e)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-[#3a3a3a] hover:text-red-400 flex items-center gap-2 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpenId(null);
                          onDeleteChat(chat.id);
                        }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom section - ChatGPT style profile */}
        <div className="px-3 mt-auto border-t border-[#2a2a2a] pt-2 relative">
          <button
            onClick={() => setMenuOpenId(menuOpenId === 'profile' ? null : 'profile')}
            className="w-full py-3 px-3 rounded-lg text-sm
              flex items-center gap-3 hover:bg-[#2a2a2a] transition-colors group"
          >
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
              </svg>
            <div className="flex-1 text-left">
              <span className="text-white text-sm font-medium truncate block">
                {userName || 'User'}
              </span>
              <span className="text-gray-500 text-xs">
                Free plan
              </span>
            </div>
          </button>

          {/* Profile dropdown menu */}
          {menuOpenId === 'profile' && (
            <div 
              ref={menuRef}
              className="absolute bottom-full left-3 right-3 mb-2 bg-[#2a2a2a] rounded-lg shadow-lg border border-[#3a3a3a] py-1 z-50"
            >
              <button
                className="w-full px-3 py-2.5 text-left text-sm text-gray-300 hover:bg-[#3a3a3a] hover:text-white flex items-center gap-3 transition-colors"
                onClick={() => {
                  setMenuOpenId(null);
                  onToggle();
                  onOpenProfile && onOpenProfile();
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </button>
              <button
                className="w-full px-3 py-2.5 text-left text-sm text-gray-300 hover:bg-[#3a3a3a] hover:text-white flex items-center gap-3 transition-colors"
                onClick={() => {
                  setMenuOpenId(null);
                  onToggle();
                  onOpenUpgrade && onOpenUpgrade();
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Upgrade plan
              </button>
              <button
                className="w-full px-3 py-2.5 text-left text-sm text-gray-300 hover:bg-[#3a3a3a] hover:text-white flex items-center gap-3 transition-colors"
                onClick={() => {
                  setMenuOpenId(null);
                  onToggle();
                  onOpenSettings && onOpenSettings();
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </button>
              <div className="border-t border-[#3a3a3a] my-1"></div>
              <button
                className="w-full px-3 py-2.5 text-left text-sm text-gray-300 hover:bg-[#3a3a3a] hover:text-red-400 flex items-center gap-3 transition-colors"
                onClick={() => {
                  setMenuOpenId(null);
                  onToggle();
                  onSignOut && onSignOut();
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
