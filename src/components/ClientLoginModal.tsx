import React, { useState } from 'react';
import { ClientApplication } from '../types';
import { KeyRound, X, Sparkles } from 'lucide-react';

interface ClientLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  applications: ClientApplication[];
  onLoginSuccess: (client: ClientApplication) => void;
}

export const ClientLoginModal: React.FC<ClientLoginModalProps> = ({
  isOpen,
  onClose,
  applications,
  onLoginSuccess,
}) => {
  const [emailUser, setEmailUser] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const trimmedUser = emailUser.trim().toLowerCase();
    const trimmedPass = password.trim();

    const matched = applications.find(
      (app) => app.email.trim().toLowerCase() === trimmedUser && app.password === trimmedPass
    );

    if (matched) {
      onLoginSuccess(matched);
      onClose();
    } else {
      setErrorMsg('⚠️ Invalid User ID or Password!');
    }
  };

  const autofillDemoClient = () => {
    // Pick first application or Ram Kumar
    const demo = applications[0];
    if (demo) {
      setEmailUser(demo.email);
      setPassword(demo.password);
      setErrorMsg('');
    } else {
      setEmailUser('ram@example.com');
      setPassword('password123');
    }
  };

  return (
    <div
      id="client-login-modal"
      className="fixed inset-0 bg-[#072545]/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-[500px] w-full p-6 sm:p-7 shadow-[0_16px_40px_rgba(3,105,161,0.2)] border border-[#bae6fd] animate-in zoom-in-95 duration-150 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#e0f2fe]">
          <h3 className="text-lg font-black text-[#0369a1] flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-[#0284c7]" />
            <span>Client Portal Login</span>
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error notice */}
        {errorMsg && (
          <div
            id="modal-login-error"
            className="bg-[#fee2e2] text-[#b91c1c] border border-red-300 rounded-lg p-2.5 mb-4 text-xs font-bold"
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[0.78rem] font-bold text-slate-700 mb-1">
              User ID / Email *
            </label>
            <input
              type="email"
              id="login-input-user"
              value={emailUser}
              onChange={(e) => setEmailUser(e.target.value)}
              placeholder="e.g. ram@example.com"
              className="w-full p-2.5 text-xs border-[1.5px] border-[#bae6fd] rounded-lg bg-[#f8fbfe] outline-none focus:border-[#0284c7]"
              required
            />
          </div>

          <div>
            <label className="block text-[0.78rem] font-bold text-slate-700 mb-1">
              Password *
            </label>
            <input
              type="password"
              id="login-input-pass"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-2.5 text-xs border-[1.5px] border-[#bae6fd] rounded-lg bg-[#f8fbfe] outline-none focus:border-[#0284c7]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-lg font-bold text-xs bg-[#0369a1] hover:bg-[#0284c7] text-white shadow-md shadow-[#0369a1]/20 transition cursor-pointer"
          >
            Login to Client Portal
          </button>
        </form>

        <div className="mt-4 pt-3.5 border-t border-slate-100 flex justify-between items-center text-xs">
          <button
            type="button"
            onClick={autofillDemoClient}
            className="text-[#0284c7] hover:underline font-bold flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autofill Demo Client</span>
          </button>
          <span className="text-slate-400 text-[11px]">User: ram@example.com / Pass: password123</span>
        </div>
      </div>
    </div>
  );
};
