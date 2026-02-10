import React from "react";

// Microphone icon component
const MicrophoneIcon = ({ className = "" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

export default function AboutPage({ onClose }) {
  const [expandedFAQ, setExpandedFAQ] = React.useState(null);

  const features = [
    {
      icon: "🎤",
      title: "Voice Input",
      desc: "Record your voice messages with a single click",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: "🔊",
      title: "Whisper Transcription",
      desc: "AI-powered speech-to-text using OpenAI's Whisper",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: "🤖",
      title: "Intelligent Responses",
      desc: "Get thoughtful AI-powered responses to your queries",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: "💬",
      title: "Chat History",
      desc: "All your conversations are saved locally",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: "📱",
      title: "Mobile Friendly",
      desc: "Works seamlessly on any device",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: "🔒",
      title: "Privacy First",
      desc: "Your data stays on your device",
      gradient: "from-purple-500 to-pink-500"
    }
  ];

  const faqs = [
    {
      question: "How do I record a voice message?",
      answer: "Simply click the microphone button at the bottom of the chat window. Click again to stop recording. Your voice will be transcribed and sent automatically."
    },
    {
      question: "What audio formats are supported?",
      answer: "Adizoon supports WAV, MP3, M4A, and most common audio formats through the Whisper transcription model."
    },
    {
      question: "Is my data private?",
      answer: "Yes! Your chat history is stored locally in your browser. Audio is processed on the server but not permanently stored."
    },
    {
      question: "How accurate is the transcription?",
      answer: "Adizoon uses OpenAI's Whisper model which provides high-quality transcription for most languages and accents."
    },
    {
      question: "Can I delete my chat history?",
      answer: "Yes, you can delete individual chats or clear all history using the options in the sidebar."
    }
  ];

  return (
    <div className="min-h-screen bg-[#161616] overflow-y-auto">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 text-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Logo */}
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
            <MicrophoneIcon className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">Adizoon</h1>
          <p className="text-lg sm:text-xl md:text-2xl text-purple-100 max-w-2xl mx-auto leading-relaxed mb-8">
            Your AI-Powered Voice Assistant 🎤
          </p>
          
          {onClose && (
            <button
              onClick={onClose}
              className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Back to Chat
            </button>
          )}
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
        
        {/* About Section */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">About Adizoon</h2>
          <div className="bg-[#1e1e1e] rounded-2xl p-6 sm:p-8 md:p-12 border border-[#2a2a2a]">
            <p className="text-gray-300 leading-relaxed mb-6 text-lg">
              Adizoon is an intelligent voice assistant that combines the power of OpenAI's Whisper 
              speech recognition with advanced AI language models. Simply speak your question or 
              message, and Adizoon will transcribe your voice and provide thoughtful, helpful responses.
            </p>
            <p className="text-gray-300 leading-relaxed text-lg">
              Whether you need help with research, want to brainstorm ideas, or just want to have 
              a conversation, Adizoon makes it as easy as speaking naturally. No typing required!
            </p>
          </div>
        </section>

        {/* Key Features */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-[#1e1e1e] rounded-2xl p-6 border border-[#2a2a2a] hover:border-purple-500/50 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">How It Works</h2>
          <div className="bg-[#1e1e1e] rounded-2xl p-6 sm:p-8 border border-[#2a2a2a]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold text-white">
                  1
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Record</h3>
                <p className="text-gray-400">Click the microphone button and speak your message naturally</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold text-white">
                  2
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Transcribe</h3>
                <p className="text-gray-400">Whisper AI converts your speech to text with high accuracy</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold text-white">
                  3
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Respond</h3>
                <p className="text-gray-400">Get intelligent AI-powered responses to your queries</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-[#1e1e1e] rounded-xl border border-[#2a2a2a] overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#252525] transition-colors"
                >
                  <span className="text-white font-medium">{faq.question}</span>
                  <svg 
                    className={`w-5 h-5 text-gray-400 transition-transform ${expandedFAQ === index ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedFAQ === index && (
                  <div className="px-6 pb-4 text-gray-400">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section className="pb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Technology Stack</h2>
          <div className="bg-[#1e1e1e] rounded-2xl p-6 sm:p-8 border border-[#2a2a2a]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4">
                <div className="text-3xl mb-2">⚛️</div>
                <p className="text-white font-medium">React</p>
                <p className="text-gray-500 text-sm">Frontend</p>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl mb-2">⚡</div>
                <p className="text-white font-medium">FastAPI</p>
                <p className="text-gray-500 text-sm">Backend</p>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl mb-2">🎤</div>
                <p className="text-white font-medium">Whisper</p>
                <p className="text-gray-500 text-sm">Transcription</p>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl mb-2">🤖</div>
                <p className="text-white font-medium">Perplexity AI</p>
                <p className="text-gray-500 text-sm">Responses</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-[#1e1e1e] border-t border-[#2a2a2a] py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-gray-500">
            Adizoon © {new Date().getFullYear()} • AI-Powered Voice Assistant
          </p>
        </div>
      </footer>
    </div>
  );
}
