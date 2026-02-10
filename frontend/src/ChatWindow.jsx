import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "katex/dist/katex.min.css";
import logoImg from "../assets/logo_2.png";

// Copy icon
const CopyIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

// Check icon
const CheckIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

// Microphone icon
const MicrophoneIcon = ({ className = "" }) => (
  <svg className={`h-6 w-6 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

// Stop icon
const StopIcon = () => (
  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
    <rect x="6" y="6" width="12" height="12" rx="2" />
  </svg>
);

const copyToClipboard = (text) => {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).catch(() => {
      fallbackCopyToClipboard(text);
    });
  } else {
    fallbackCopyToClipboard(text);
  }
};

const fallbackCopyToClipboard = (text) => {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Fallback: Could not copy text', err);
  }
  document.body.removeChild(textArea);
};

// Edit icon
const EditIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

// Send icon
const SendIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

export default function ChatWindow({ chat, onSendAudio, onSendText, onEditMessage, loading, isHidden = false, onOpenSidebar, onNewChat }) {
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [textInput, setTextInput] = useState("");
  const [loadingType, setLoadingType] = useState(null); // 'voice' or 'text'
  const [editingIdx, setEditingIdx] = useState(null);
  const [editText, setEditText] = useState("");
  const textInputRef = useRef(null);
  const editInputRef = useRef(null);

  // Auto-resize textarea
  const autoResize = () => {
    const el = textInputRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 200) + 'px';
    }
  };

  const chatWindowRef = useRef(null);
  const chatEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat, loading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set up audio analyzer for visualization
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;
      
      // Start level monitoring
      const updateLevel = () => {
        if (analyserRef.current) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(average / 255);
        }
        animationRef.current = requestAnimationFrame(updateLevel);
      };
      updateLevel();
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        
        // Stop level monitoring
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        if (audioBlob.size > 0) {
          setLoadingType('voice');
          onSendAudio(audioBlob);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please ensure microphone permissions are granted.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setAudioLevel(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#161616] overflow-hidden">
      {/* Mobile Header - ChatGPT style */}
      <div className="md:hidden flex items-center justify-between px-3 py-3 bg-[#161616] border-b border-[#2a2a2a]">
        {/* Left - Menu button and hide sidebar */}
        <div className="flex items-center gap-1">
          <button
            onClick={onOpenSidebar}
            className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-lg transition-colors"
            title="Open sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Center - App name with logo */}
        <div className="flex items-center gap-2">
          <img src={logoImg} alt="Adizoon" className="h-6 object-contain" />
        </div>
        
        {/* Right - New chat button */}
        <button
          onClick={onNewChat}
          className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-lg transition-colors"
          title="New chat"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>

      {/* Main content area */}
      <div
        ref={chatWindowRef}
        className="chat-window flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-3 sm:px-4 md:px-8 pt-4 sm:pt-8 pb-6"
      >
        {/* Welcome screen */}
        {chat.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center min-h-full px-4">
            <img src={logoImg} alt="Adizoon" className="h-12 sm:h-16 mb-4 sm:mb-6 object-contain" />
            <h1 className="text-xl sm:text-2xl font-semibold text-white mb-2 sm:mb-4">What can I help with?</h1>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-4 sm:mt-6 max-w-lg">
              {/* Quick action buttons */}
              <button
                onClick={() => {
                  setTextInput("Summarize this text: ");
                  textInputRef.current?.focus();
                }}
                className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-transparent border border-[#3a3a3a] rounded-full text-white text-xs sm:text-sm hover:bg-[#2a2a2a] transition-colors"
              >
                <svg className="w-4 h-4 text-[#EE9225]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Summarize text</span>
              </button>
              <button
                onClick={() => {
                  setTextInput("Surprise me with something interesting");
                  textInputRef.current?.focus();
                }}
                className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-transparent border border-[#3a3a3a] rounded-full text-white text-xs sm:text-sm hover:bg-[#2a2a2a] transition-colors"
              >
                <svg className="w-4 h-4 text-[#EE9225]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
                <span>Surprise me</span>
              </button>
              <button
                onClick={() => {
                  setTextInput("Give me advice about ");
                  textInputRef.current?.focus();
                }}
                className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-transparent border border-[#3a3a3a] rounded-full text-white text-xs sm:text-sm hover:bg-[#2a2a2a] transition-colors"
              >
                <svg className="w-4 h-4 text-[#EE9225]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Get advice</span>
              </button>
            </div>
          </div>
        )}

        {/* Chat messages */}
        {chat.map((m, i) => (
          <div key={i} className="max-w-3xl mx-auto mb-4 sm:mb-6">
            {m.sender === "user" ? (
              /* User message */
              <div className="flex justify-end items-start gap-2">
                {editingIdx === i ? (
                  /* Edit mode */
                  <div className="flex flex-col gap-2 max-w-[90%] sm:max-w-[85%] w-full">
                    <textarea
                      ref={editInputRef}
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="bg-[#303030] text-white rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-[15px] w-full resize-none focus:outline-none focus:ring-2 focus:ring-[#EE9225]"
                      rows={3}
                      autoFocus
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingIdx(null);
                          setEditText("");
                        }}
                        className="px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          if (editText.trim() && onEditMessage) {
                            onEditMessage(i, editText.trim());
                            setEditingIdx(null);
                            setEditText("");
                          }
                        }}
                        disabled={!editText.trim() || loading}
                        className="px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm bg-[#EE9225] text-white rounded-lg hover:bg-[#d68320] transition-colors disabled:opacity-50"
                      >
                        Save & Submit
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Normal view */
                  <div className="max-w-[90%] sm:max-w-[85%] flex flex-col items-end">
                    <div className="bg-[#303030] text-white rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-[15px] overflow-hidden">
                      {m.type === "audio" && m.audioUrl && (
                        <div className="text-[#EE9225] text-xs mb-1 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                          </svg>
                          Voice Message
                        </div>
                      )}
                      <div style={{ wordBreak: 'break-all', overflowWrap: 'anywhere' }}>{m.text}</div>
                    </div>
                    {/* Action icons - below bubble, right aligned (hide during recording) */}
                    {m.text !== "Recording..." && (
                    <div className="flex items-center gap-1 mt-1">
                      {/* Copy icon */}
                      <button 
                        className="p-1 sm:p-1.5 text-gray-500 hover:text-[#EE9225] transition-colors"
                        onClick={() => {
                          copyToClipboard(m.text);
                          setCopiedIdx(i);
                          setTimeout(() => setCopiedIdx(null), 1000);
                        }}
                        title="Copy message"
                      >
                        {copiedIdx === i ? <CheckIcon /> : <CopyIcon />}
                      </button>
                      {/* Edit icon */}
                      <button 
                        className="p-1 sm:p-1.5 text-gray-500 hover:text-[#EE9225] transition-colors"
                        onClick={() => {
                          setEditingIdx(i);
                          setEditText(m.text);
                        }}
                        title="Edit message"
                      >
                        <EditIcon />
                      </button>
                    </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Bot message */
              <div>
                {/* Model label */}
                <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                  <img src="/assets/logo.png" alt="Adizoon" className="w-4 h-4 sm:w-5 sm:h-5 rounded-full object-cover" />
                  <span className="text-gray-400 text-xs sm:text-sm">Adizoon</span>
                </div>
                {/* Message content */}
                <div className="text-white text-sm sm:text-[15px] leading-relaxed">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => <p className="my-2">{children}</p>,
                      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                      ul: ({ children }) => <ul className="list-disc list-inside my-2 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside my-2 space-y-1">{children}</ol>,
                      li: ({ children }) => <li>{children}</li>,
                      code: ({ inline, children }) => 
                        inline ? (
                          <code className="bg-[#2a2a2a] px-1.5 py-0.5 rounded text-sm text-[#EE9225]">{children}</code>
                        ) : (
                          <code className="block bg-[#2a2a2a] p-3 rounded-lg my-2 text-sm overflow-x-auto">{children}</code>
                        ),
                      table: ({ children }) => (
                        <div className="overflow-x-auto my-4">
                          <table className="min-w-full border-collapse border border-[#3a3a3a] rounded-lg">
                            {children}
                          </table>
                        </div>
                      ),
                      thead: ({ children }) => (
                        <thead className="bg-[#2a2a2a]">{children}</thead>
                      ),
                      tbody: ({ children }) => (
                        <tbody className="divide-y divide-[#3a3a3a]">{children}</tbody>
                      ),
                      tr: ({ children }) => (
                        <tr className="hover:bg-[#252525] transition-colors">{children}</tr>
                      ),
                      th: ({ children }) => (
                        <th className="px-4 py-2 text-left text-sm font-semibold text-[#EE9225] border border-[#3a3a3a]">{children}</th>
                      ),
                      td: ({ children }) => (
                        <td className="px-4 py-2 text-sm text-gray-300 border border-[#3a3a3a]">{children}</td>
                      ),
                    }}
                  >
                    {m.text}
                  </ReactMarkdown>
                </div>

                {/* Action icons row */}
                <div className="flex items-center gap-1 mt-3">
                  {/* Copy */}
                  <button 
                    className="p-2 text-gray-500 hover:text-[#EE9225] transition-colors rounded-lg hover:bg-[#2a2a2a]"
                    onClick={() => {
                      copyToClipboard(m.text);
                      setCopiedIdx(i);
                      setTimeout(() => setCopiedIdx(null), 1000);
                    }}
                  >
                    {copiedIdx === i ? <CheckIcon /> : <CopyIcon />}
                  </button>
                  {/* Share */}
                  <button 
                    className="p-2 text-gray-500 hover:text-[#EE9225] transition-colors rounded-lg hover:bg-[#2a2a2a]"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: 'Adizoon Response',
                          text: m.text,
                        }).catch(() => {});
                      } else {
                        copyToClipboard(m.text);
                        alert('Response copied to clipboard!');
                      }
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Loading indicator - ChatGPT style animated dots */}
        {loading && (
          <div className="max-w-3xl mx-auto mb-4 sm:mb-6">
            <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
              <img src="/assets/logo.png" alt="Adizoon" className="w-4 h-4 sm:w-5 sm:h-5 rounded-full object-cover" />
              <span className="text-gray-400 text-xs sm:text-sm">Adizoon</span>
            </div>
            <div className="flex items-center gap-1 py-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input section */}
      <div className="shrink-0 px-3 sm:px-4 md:px-8 pb-3 sm:pb-4 pt-2">
        <div className="max-w-3xl mx-auto">
          {/* Recording indicator */}
          {isRecording && (
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3 py-1.5 sm:py-2 px-3 sm:px-4 bg-[#EE9225]/10 rounded-full w-fit mx-auto">
              <div className="relative">
                <div 
                  className="w-2 h-2 bg-[#EE9225] rounded-full"
                  style={{ transform: `scale(${1 + audioLevel * 0.5})` }}
                />
              </div>
              <span className="text-[#EE9225] text-xs sm:text-sm font-medium">{formatTime(recordingTime)}</span>
              <span className="text-gray-400 text-xs sm:text-sm">Recording</span>
            </div>
          )}

          {/* Input container*/}
          <div className="relative flex items-end bg-[#2f2f2f] rounded-3xl border border-[#424242] py-2 px-2 sm:px-3 gap-2">
            {/* Textarea */}
            <textarea
              ref={textInputRef}
              value={textInput}
              onChange={(e) => {
                setTextInput(e.target.value);
                autoResize();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (textInput.trim() && !loading) {
                    setLoadingType('text');
                    onSendText(textInput);
                    setTextInput("");
                    // Reset textarea height
                    if (textInputRef.current) textInputRef.current.style.height = 'auto';
                  }
                }
              }}
              placeholder="Ask anything"
              disabled={isRecording}
              readOnly={loading}
              rows={1}
              className="flex-1 bg-transparent text-white resize-none focus:outline-none placeholder-gray-500 text-sm sm:text-base leading-6 max-h-[200px] py-1 pl-2 scrollbar-thin"
              style={{ height: 'auto' }}
            />

            {/* Right action buttons */}
            <div className="flex items-center gap-1 shrink-0 mb-0.5">
              {/* Voice button */}
              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={loading}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200
                  ${isRecording 
                    ? 'bg-[#EE9225] hover:bg-[#d68320] text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-[#424242]'
                  }
                  ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                title={isRecording ? "Stop recording" : "Voice input"}
              >
                {isRecording ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="6" width="12" height="12" rx="1" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                )}
              </button>
              
              {/* Send button */}
              <button
                onClick={() => {
                  if (textInput.trim() && !loading) {
                    setLoadingType('text');
                    onSendText(textInput);
                    setTextInput("");
                    if (textInputRef.current) textInputRef.current.style.height = 'auto';
                  }
                }}
                disabled={!textInput.trim() || loading || isRecording}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200
                  ${loading
                    ? 'bg-[#EE9225] text-white'
                    : textInput.trim() && !isRecording
                      ? 'bg-[#EE9225] text-white hover:bg-[#d68320]'
                      : 'bg-[#676767] text-[#2f2f2f] cursor-not-allowed'
                  }
                `}
                title={loading ? "Processing..." : "Send message"}
              >
                {loading ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Disclaimer - ChatGPT style */}
          <p className="hidden sm:block text-center text-gray-500 text-[11px] mt-2">
            Adizoon can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </div>
  );
}
