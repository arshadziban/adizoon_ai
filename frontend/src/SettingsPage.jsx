import React, { useState, useEffect } from "react";

export default function SettingsPage({ onClose }) {
  // Voice auto-send
  const [voiceAutoSend, setVoiceAutoSend] = useState(
    () => localStorage.getItem("adizoonVoiceAutoSend") === "true"
  );

  // Sound effects
  const [soundEffects, setSoundEffects] = useState(
    () => localStorage.getItem("adizoonSoundEffects") !== "false"
  );

  // Notifications
  const [notifications, setNotifications] = useState(
    () => localStorage.getItem("adizoonNotifications") !== "false"
  );

  // Save all settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem("adizoonVoiceAutoSend", voiceAutoSend);
  }, [voiceAutoSend]);

  useEffect(() => {
    localStorage.setItem("adizoonSoundEffects", soundEffects);
  }, [soundEffects]);

  useEffect(() => {
    localStorage.setItem("adizoonNotifications", notifications);
  }, [notifications]);

  const handleDeleteAllData = () => {
    if (window.confirm("Are you sure? This will delete all your data and sign you out.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const Toggle = ({ enabled, onChange }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? "bg-[#EE9225]" : "bg-[#3a3a3a]"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  return (
    <div className="h-full w-full bg-[#161616] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[#2a2a2a] sticky top-0 bg-[#161616] z-10">
        <h2 className="text-lg font-semibold text-white">Settings</h2>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Voice & Audio */}
        <section>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Voice & Audio</h3>
          <div className="space-y-1">
            {/* Voice auto-send */}
            <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-[#1e1e1e]">
              <div>
                <p className="text-sm font-medium text-white">Auto-send voice messages</p>
                <p className="text-xs text-gray-500 mt-0.5">Automatically send after recording stops</p>
              </div>
              <Toggle enabled={voiceAutoSend} onChange={setVoiceAutoSend} />
            </div>

            {/* Sound effects */}
            <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-[#1e1e1e]">
              <div>
                <p className="text-sm font-medium text-white">Sound effects</p>
                <p className="text-xs text-gray-500 mt-0.5">Play sounds for messages and actions</p>
              </div>
              <Toggle enabled={soundEffects} onChange={setSoundEffects} />
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Notifications</h3>
          <div className="space-y-1">
            <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-[#1e1e1e]">
              <div>
                <p className="text-sm font-medium text-white">Push notifications</p>
                <p className="text-xs text-gray-500 mt-0.5">Get notified about new responses</p>
              </div>
              <Toggle enabled={notifications} onChange={setNotifications} />
            </div>
          </div>
        </section>

        {/* Data & Privacy */}
        <section>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Data & Privacy</h3>
          <div className="space-y-1">
            {/* Export data */}
            <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-[#1e1e1e]">
              <div>
                <p className="text-sm font-medium text-white">Export data</p>
                <p className="text-xs text-gray-500 mt-0.5">Download all your chat history</p>
              </div>
              <button
                onClick={() => {
                  const data = localStorage.getItem("adizoonChatHistory") || "[]";
                  const blob = new Blob([data], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "adizoon-chat-export.json";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="text-sm text-[#EE9225] hover:text-[#d6831f] font-medium transition-colors"
              >
                Export
              </button>
            </div>

            {/* Delete all data */}
            <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-[#1e1e1e]">
              <div>
                <p className="text-sm font-medium text-white">Delete all data</p>
                <p className="text-xs text-gray-500 mt-0.5">Permanently remove all data and sign out</p>
              </div>
              <button
                onClick={handleDeleteAllData}
                className="text-sm text-red-500 hover:text-red-400 font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </section>

        {/* About */}
        <section>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">About</h3>
          <div className="space-y-1">
            <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-[#1e1e1e]">
              <p className="text-sm text-gray-300">Version</p>
              <p className="text-sm text-gray-500">1.0.0</p>
            </div>
            <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-[#1e1e1e]">
              <p className="text-sm text-gray-300">App name</p>
              <p className="text-sm text-gray-500">Adizoon</p>
            </div>
          </div>
        </section>
      </div>
      </div>
    </div>
  );
}
