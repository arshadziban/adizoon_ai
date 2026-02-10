import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import LoginPage from "./LoginPage";
import ProfilePage from "./ProfilePage";
import UpgradePage from "./UpgradePage";
import SettingsPage from "./SettingsPage";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("adizoonLoggedIn") === "true"
  );
  const [userEmail, setUserEmail] = useState(
    () => localStorage.getItem("adizoonUserEmail") || ""
  );

  // Load from localStorage or create initial chat
  const getInitialState = () => {
    const stored = localStorage.getItem("adizoonChatHistory");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse stored chat history:", e);
      }
    }
    return [{ id: Date.now(), title: "New Chat", messages: [] }];
  };

  const initialChat = getInitialState()[0];
  const [chatHistory, setChatHistory] = useState(getInitialState());
  const [selectedId, setSelectedId] = useState(initialChat.id);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [displayName, setDisplayName] = useState(
    () => localStorage.getItem("adizoonDisplayName") || (userEmail ? userEmail.split("@")[0] : "User")
  );

  const handleDisplayNameChange = (newName) => {
    setDisplayName(newName);
    localStorage.setItem("adizoonDisplayName", newName);
  };

  const handleLogin = (email) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    localStorage.setItem("adizoonLoggedIn", "true");
    localStorage.setItem("adizoonUserEmail", email);
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setUserEmail("");
    localStorage.removeItem("adizoonLoggedIn");
    localStorage.removeItem("adizoonUserEmail");
  };

  // Save to localStorage whenever chatHistory changes
  useEffect(() => {
    localStorage.setItem("adizoonChatHistory", JSON.stringify(chatHistory));
  }, [chatHistory]);

  // API base URL - backend runs on port 8000
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // Send audio for transcription and get AI response
  const handleSendAudio = async (audioBlob) => {
    if (loading || !audioBlob) return;
    setLoading(true);
    const idx = chatHistory.findIndex(c => c.id === selectedId);
    if (idx === -1) {
      setLoading(false);
      return;
    }
    const allChats = [...chatHistory];
    
    // Add user audio message placeholder
    allChats[idx].messages.push({ 
      sender: "user", 
      text: "Recording...", 
      type: "audio",
      audioUrl: URL.createObjectURL(audioBlob)
    });
    setChatHistory([...allChats]);
    
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.wav');
      
      // Build conversation history for context (exclude the recording placeholder)
      const history = allChats[idx].messages
        .slice(0, -1)
        .filter(m => m.text && m.text !== "Recording...")
        .map(m => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.text
        }));
      formData.append('history', JSON.stringify(history));
      
      const response = await fetch(`${API_BASE_URL}/transcribe`, {
        method: "POST",
        body: formData
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Update user message with transcription
      const lastUserMsgIdx = allChats[idx].messages.length - 1;
      allChats[idx].messages[lastUserMsgIdx].text = data.transcribed_text || "Voice message";
      allChats[idx].messages[lastUserMsgIdx].transcription = data.transcribed_text;
      
      // Add bot response
      allChats[idx].messages.push({
        sender: "bot",
        text: data.chatbot_response,
        type: "text"
      });
      
      // Update chat title from first transcription
      if (allChats[idx].title === "New Chat" && data.transcribed_text) {
        allChats[idx].title = data.transcribed_text.slice(0, 28) || "Voice Chat";
      }
      
      setChatHistory([...allChats]);
    } catch (error) {
      console.error("API Error:", error);
      // Update the placeholder message with error
      const lastUserMsgIdx = allChats[idx].messages.length - 1;
      allChats[idx].messages[lastUserMsgIdx].text = "Voice message (failed to transcribe)";
      
      allChats[idx].messages.push({
        sender: "bot",
        text: "Something went wrong. Please try again later."
      });
      setChatHistory([...allChats]);
    } finally {
      setLoading(false);
    }
  };

  // Send text message
  const handleSendText = async (text) => {
    if (loading || !text.trim()) return;
    setLoading(true);
    const idx = chatHistory.findIndex(c => c.id === selectedId);
    if (idx === -1) {
      setLoading(false);
      return;
    }
    const allChats = [...chatHistory];
    
    // Add user text message
    allChats[idx].messages.push({ 
      sender: "user", 
      text: text.trim(), 
      type: "text"
    });
    setChatHistory([...allChats]);
    
    try {
      // Build conversation history for context (exclude the message we just added)
      const history = allChats[idx].messages
        .slice(0, -1)
        .filter(m => m.text && m.text !== "Recording...")
        .map(m => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.text
        }));

      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: text.trim(), history })
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Add bot response
      allChats[idx].messages.push({
        sender: "bot",
        text: data.chatbot_response,
        type: "text"
      });
      
      // Update chat title from first message
      if (allChats[idx].title === "New Chat" && text.trim()) {
        allChats[idx].title = text.trim().slice(0, 28) || "Chat";
      }
      
      setChatHistory([...allChats]);
    } catch (error) {
      console.error("API Error:", error);
      allChats[idx].messages.push({
        sender: "bot",
        text: "Something went wrong. Please try again later."
      });
      setChatHistory([...allChats]);
    } finally {
      setLoading(false);
    }
  };

  // New chat
  const handleNewChat = () => {
    const newChat = { id: Date.now(), title: "New Chat", messages: [] };
    setChatHistory(prev => [newChat, ...prev]);
    setSelectedId(newChat.id);
    setSidebarOpen(false);
  };

  // Select chat
  const handleSelectChat = (id) => {
    setSelectedId(id);
    setSidebarOpen(false);
  };

  // Clear all
  const handleClearAll = () => {
    setChatHistory([]);
    handleNewChat();
  };

  // Delete chat
  const handleDeleteChat = (id) => {
    const updatedHistory = chatHistory.filter(chat => chat.id !== id);
    if (updatedHistory.length === 0) {
      const newChat = { id: Date.now(), title: "New Chat", messages: [] };
      setChatHistory([newChat]);
      setSelectedId(newChat.id);
    } else {
      setChatHistory(updatedHistory);
      if (selectedId === id) {
        setSelectedId(updatedHistory[0].id);
      }
    }
  };

  // Rename chat
  const handleRenameChat = (id, newTitle) => {
    setChatHistory(prev => prev.map(chat => 
      chat.id === id ? { ...chat, title: newTitle } : chat
    ));
  };

  // Edit message and regenerate response
  const handleEditMessage = async (messageIndex, newText) => {
    if (loading || !newText.trim()) return;
    setLoading(true);
    const idx = chatHistory.findIndex(c => c.id === selectedId);
    if (idx === -1) {
      setLoading(false);
      return;
    }
    const allChats = [...chatHistory];
    
    // Update the user message and remove all messages after it
    allChats[idx].messages = allChats[idx].messages.slice(0, messageIndex);
    allChats[idx].messages.push({ 
      sender: "user", 
      text: newText.trim(), 
      type: "text"
    });
    setChatHistory([...allChats]);
    
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: newText.trim() })
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Add bot response
      allChats[idx].messages.push({
        sender: "bot",
        text: data.chatbot_response,
        type: "text"
      });
      
      setChatHistory([...allChats]);
    } catch (error) {
      console.error("API Error:", error);
      allChats[idx].messages.push({
        sender: "bot",
        text: `Sorry, there was an error: ${error.message}. Please make sure the backend server is running on port 8000.`
      });
      setChatHistory([...allChats]);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const userName = displayName || (userEmail ? userEmail.split("@")[0] : "User");

  return (
    <div className="h-screen bg-[#161616] flex flex-row overflow-hidden">
      <Sidebar
        history={chatHistory}
        selectedId={selectedId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onClearAll={handleClearAll}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
        userName={userName}
        onSignOut={handleSignOut}
        onOpenProfile={() => { setShowProfile(true); setShowUpgrade(false); setShowSettings(false); }}
        onOpenUpgrade={() => { setShowUpgrade(true); setShowProfile(false); setShowSettings(false); }}
        onOpenSettings={() => { setShowSettings(true); setShowProfile(false); setShowUpgrade(false); }}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        isHidden={sidebarHidden}
        onHiddenToggle={() => setSidebarHidden(!sidebarHidden)}
      />
      <main className="flex-1 min-h-0 bg-[#161616] overflow-hidden">
        {showProfile ? (
          <ProfilePage
            userEmail={userEmail}
            displayName={displayName}
            onDisplayNameChange={handleDisplayNameChange}
            onClose={() => setShowProfile(false)}
            onSignOut={handleSignOut}
          />
        ) : showUpgrade ? (
          <UpgradePage onClose={() => setShowUpgrade(false)} />
        ) : showSettings ? (
          <SettingsPage onClose={() => setShowSettings(false)} />
        ) : (
          <ChatWindow
            chat={(chatHistory.find(c => c.id === selectedId)?.messages) || []}
            onSendAudio={handleSendAudio}
            onSendText={handleSendText}
            onEditMessage={handleEditMessage}
            loading={loading}
            isHidden={sidebarHidden}
            onOpenSidebar={() => setSidebarOpen(true)}
            onNewChat={handleNewChat}
          />
        )}
      </main>
    </div>
  );
}
