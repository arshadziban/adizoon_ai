import React, { useState } from "react";
import logoImg from "../assets/logo.png";

const isGmail = (email) => /^[^@\s]+@gmail\.com$/i.test(email.trim());

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [demoCode, setDemoCode] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const handleSendCode = () => {
    setError("");
    setStatus("");

    if (!isGmail(email)) {
      setError("Please enter a valid Gmail address.");
      return;
    }

    const newCode = String(Math.floor(100000 + Math.random() * 900000));
    setDemoCode(newCode);
    setCodeSent(true);
    setStatus("OTP generated. Check the code below.");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setStatus("");

    if (!isGmail(email)) {
      setError("Please enter a valid Gmail address.");
      return;
    }

    if (!codeSent) {
      setError("Please request an OTP code first.");
      return;
    }

    if (!otp.trim() || otp.trim() !== demoCode) {
      setError("Invalid OTP code.");
      return;
    }

    onLogin(email.trim());
  };

  return (
    <div className="min-h-screen w-full bg-[#161616] flex flex-col items-center justify-center px-4">
      {/* Logo + Title */}
      <div className="mb-8 flex flex-col items-center">
        <div className="h-18 w-18 rounded-full flex items-center justify-center mb-3">
          <img src={logoImg} alt="Adizoon" className="h-18 w-18 object-contain" />
        </div>
        <h1 className="text-[28px] font-semibold text-white">Welcome back</h1>
      </div>

      {/* Card */}
      <div className="w-full max-w-[400px] bg-[#1e1e1e] border border-[#2a2a2a] rounded-2xl p-6 sm:p-8">
        <form className="space-y-4" onSubmit={handleLogin}>
          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-sm text-gray-400">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@gmail.com"
              autoComplete="email"
              className="w-full rounded-lg bg-[#161616] border border-[#3a3a3a] px-3.5 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#5a5a5a] transition-colors"
            />
          </div>

          {/* OTP */}
          <div className="space-y-1.5">
            <label className="block text-sm text-gray-400">OTP code</label>
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="6-digit code"
                className="flex-1 rounded-lg bg-[#161616] border border-[#3a3a3a] px-3.5 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#5a5a5a] transition-colors"
              />
              <button
                type="button"
                onClick={handleSendCode}
                className="rounded-lg border border-[#3a3a3a] bg-[#2a2a2a] px-4 py-2.5 text-sm text-white hover:bg-[#3a3a3a] transition-colors whitespace-nowrap"
              >
                {codeSent ? "Resend" : "Send code"}
              </button>
            </div>
          </div>

          {/* Status */}
          {status && (
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-sm text-emerald-400">
              {status}
            </div>
          )}

          {/* Demo OTP display */}
          {codeSent && demoCode && (
            <div className="rounded-lg bg-[#2a2a2a] border border-[#3a3a3a] px-3 py-2 text-sm text-gray-400 text-center">
              Demo OTP: <span className="text-white font-mono font-semibold tracking-[0.25em]">{demoCode}</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!otp.trim() || !codeSent}
            className={`w-full rounded-lg font-medium py-2.5 text-sm transition-colors ${
              otp.trim() && codeSent
                ? "bg-[#EE9225] text-white hover:bg-[#d6831f] cursor-pointer"
                : "bg-[#2a2a2a] text-gray-500 cursor-not-allowed"
            }`}
          >
            Continue
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[#2a2a2a]" />
          <span className="text-xs text-gray-600">OR</span>
          <div className="flex-1 h-px bg-[#2a2a2a]" />
        </div>

        {/* Google button placeholder */}
        <button
          type="button"
          disabled
          className="w-full rounded-lg border border-[#3a3a3a] bg-[#161616] px-4 py-2.5 text-sm text-white flex items-center justify-center gap-3 hover:bg-[#2a2a2a] transition-colors opacity-50 cursor-not-allowed"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google (coming soon)
        </button>
      </div>
    </div>
  );
}
