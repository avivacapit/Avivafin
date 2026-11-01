import React, { useState, useRef, useEffect } from 'react';
import { ClientApplication, AppView, DashboardTab } from '../types';
import {
  User,
  Wallet,
  BarChart3,
  LogOut,
  ShieldAlert,
  Hash,
  CheckCircle2,
  Clock,
  LayoutDashboard,
} from 'lucide-react';

interface HeaderProps {
  currentView: AppView;
  activeClient: ClientApplication | null;
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  onGoHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  activeClient,
  activeTab,
  onSelectTab,
  onOpenLogin,
  onLogout,
  onGoHome,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white text-[#0369a1] sticky top-0 z-50 shadow-[0_4px_20px_rgba(3,105,161,0.06)] border-b border-[#e0f2fe]">
      <div className="max-w-[1200px] mx-auto px-6 py-3.5 flex justify-between items-center relative">
        {/* Brand Group */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
        >
          <div className="h-10 w-10 rounded-[10px] bg-gradient-to-br from-[#0284c7] to-[#0369a1] flex items-center justify-center text-white font-black text-lg border-[1.5px] border-[#38bdf8]/60 shadow-sm transition-transform group-hover:scale-105">
            AC
          </div>
          <div>
            <div className="text-[1.3rem] font-black text-[#072545] leading-none tracking-tight">
              AVIVA <span className="text-[#0284c7]">CAPITAL</span>
            </div>
            <div className="text-[0.68rem] text-slate-500 uppercase tracking-wider font-bold mt-1">
              Institutional Credit &amp; Finance
            </div>
          </div>
        </button>

        {/* Right Action Area */}
        <div className="flex items-center gap-3">
          {currentView === 'admin' ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-300">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                Staff Admin Portal
              </span>
              <button
                onClick={onGoHome}
                className="px-3 py-1.5 rounded-lg text-xs font-bold border border-[#bae6fd] text-[#0369a1] bg-white hover:bg-[#f0f9ff] transition cursor-pointer"
              >
                Client Portal / Home
              </button>
            </div>
          ) : currentView === 'client-dashboard' && activeClient ? (
            <div className="flex items-center gap-3" ref={dropdownRef}>
              {/* Client Info pill */}
              <div className="hidden sm:flex items-center gap-2.5 bg-[#f0f9ff] border border-[#bae6fd] py-1.5 px-3.5 rounded-full text-xs shadow-sm">
                <span className="font-extrabold text-[#072545] truncate max-w-[150px]">
                  {activeClient.fullName}
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-500 border-l border-[#bae6fd] pl-2 flex items-center gap-1">
                  <Hash className="w-3 h-3 text-[#0284c7]" />
                  <span>ID: #{activeClient.id}</span>
                </span>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    activeClient.status === 'Approved'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  {activeClient.status === 'Approved' ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Clock className="w-3 h-3 text-amber-600" />
                  )}
                  <span>
                    {activeClient.status === 'Approved' ? '🟢 Loan Consolidation Approval' : 'Finance Approval Pending'}
                  </span>
                </span>
              </div>

              {/* 3 Lines Menu Toggle Button */}
              <button
                id="header-menu-btn"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="bg-[#0369a1] hover:bg-[#0284c7] transition text-white rounded-lg w-[42px] h-[42px] flex flex-col items-center justify-center gap-[5px] cursor-pointer shadow-sm active:scale-95"
                aria-label="Toggle navigation menu"
                title="Client Menu"
              >
                <span className="block w-[22px] h-[3px] bg-white rounded-[2px]" />
                <span className="block w-[22px] h-[3px] bg-white rounded-[2px]" />
                <span className="block w-[22px] h-[3px] bg-white rounded-[2px]" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div
                  id="nav-dropdown-menu"
                  className="absolute right-6 top-[65px] bg-white border border-[#bae6fd] rounded-2xl shadow-[0_16px_40px_rgba(3,105,161,0.18)] flex flex-col w-64 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  {/* Menu Header with Client ID */}
                  <div className="px-4 py-3 bg-gradient-to-r from-[#e0f2fe] to-[#f0f9ff] border-b border-[#bae6fd]">
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-[#0369a1] mb-0.5">
                      <span className="flex items-center gap-1">
                        <Hash className="w-3 h-3 text-[#0284c7]" />
                        <span>Client ID: #{activeClient.id}</span>
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          activeClient.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {activeClient.status === 'Approved' ? '🟢 Loan Consolidation Approval' : 'Pending Approval'}
                      </span>
                    </div>
                    <div className="text-xs font-black text-[#072545] truncate">
                      {activeClient.fullName}
                    </div>
                  </div>

                  {/* 0. Go to Dashboard */}
                  <button
                    onClick={() => {
                      onSelectTab('emi');
                      setDropdownOpen(false);
                    }}
                    className={`flex items-center gap-2.5 px-4 py-3 text-left font-bold text-xs border-b border-slate-100 transition cursor-pointer ${
                      activeTab === 'emi'
                        ? 'bg-[#e0f2fe] text-[#0369a1]'
                        : 'text-slate-800 hover:bg-[#f0f9ff] hover:text-[#0369a1]'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4 text-[#0284c7]" />
                    <span>🏠 Go to Dashboard</span>
                  </button>

                  {/* 1. Personal Information */}
                  <button
                    onClick={() => {
                      onSelectTab('profile');
                      setDropdownOpen(false);
                    }}
                    className={`flex items-center gap-2.5 px-4 py-3 text-left font-bold text-xs border-b border-slate-100 transition cursor-pointer ${
                      activeTab === 'profile'
                        ? 'bg-[#e0f2fe] text-[#0369a1]'
                        : 'text-slate-800 hover:bg-[#f0f9ff] hover:text-[#0369a1]'
                    }`}
                  >
                    <User className="w-4 h-4 text-[#0284c7]" />
                    <span>📋 Personal Information</span>
                  </button>

                  {/* 2. Wallet */}
                  <button
                    onClick={() => {
                      onSelectTab('wallet');
                      setDropdownOpen(false);
                    }}
                    className={`flex items-center gap-2.5 px-4 py-3 text-left font-bold text-xs border-b border-slate-100 transition cursor-pointer ${
                      activeTab === 'wallet'
                        ? 'bg-[#e0f2fe] text-[#0369a1]'
                        : 'text-slate-800 hover:bg-[#f0f9ff] hover:text-[#0369a1]'
                    }`}
                  >
                    <Wallet className="w-4 h-4 text-[#0284c7]" />
                    <span>💰 Wallet</span>
                  </button>

                  {/* 3. EMI Details */}
                  <button
                    onClick={() => {
                      onSelectTab('emi');
                      setDropdownOpen(false);
                    }}
                    className={`flex items-center gap-2.5 px-4 py-3 text-left font-bold text-xs border-b border-slate-100 transition cursor-pointer ${
                      activeTab === 'emi'
                        ? 'bg-[#e0f2fe] text-[#0369a1]'
                        : 'text-slate-800 hover:bg-[#f0f9ff] hover:text-[#0369a1]'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4 text-[#0284c7]" />
                    <span>📊 EMI Details</span>
                  </button>

                  {/* 4. Logout */}
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onLogout();
                    }}
                    className="flex items-center gap-2.5 px-4 py-3 text-left font-bold text-xs text-red-600 hover:bg-red-50 transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span>🔒 Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="header-login-btn"
                onClick={onOpenLogin}
                className="px-4 py-2 text-[0.85rem] font-bold rounded-lg border-[1.5px] border-[#bae6fd] text-[#0369a1] bg-white hover:bg-[#f0f9ff] hover:border-[#0284c7] transition cursor-pointer shadow-sm"
              >
                Client Login
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
