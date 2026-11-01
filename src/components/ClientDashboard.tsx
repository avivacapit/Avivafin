import React, { useState, useEffect } from 'react';
import { ClientApplication, DashboardTab } from '../types';
import {
  User,
  Wallet,
  BarChart3,
  Clock,
  AlertCircle,
  Hash,
  ShieldCheck,
  Calendar,
  Percent,
  CreditCard,
  Building,
  Mail,
  Phone,
  FileSpreadsheet,
  CheckCircle2,
  FastForward,
  MapPin,
  ArrowLeft,
  LayoutDashboard,
} from 'lucide-react';

interface ClientDashboardProps {
  client: ClientApplication;
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  onUpdateClient: (updated: ClientApplication) => void;
}

const FIVE_MINUTES_MS = 5 * 60 * 1000; // 5 minutes = 300,000 ms

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  client,
  activeTab,
  onSelectTab,
  onUpdateClient,
}) => {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(300);
  const [withdrawError, setWithdrawError] = useState<string>('');

  // 5-minute timer management for withdrawal
  useEffect(() => {
    if (client.withdrawalState === 'pending') {
      const startTime = client.withdrawalTimestamp || Date.now();
      const checkTimer = () => {
        const elapsed = Date.now() - startTime;
        const leftMs = Math.max(0, FIVE_MINUTES_MS - elapsed);
        const leftSec = Math.ceil(leftMs / 1000);
        setRemainingSeconds(leftSec);

        if (leftMs <= 0) {
          // 5 minutes have elapsed: switch to blocked state
          onUpdateClient({
            ...client,
            withdrawalState: 'blocked',
          });
        }
      };

      checkTimer();
      const interval = setInterval(checkTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [client.withdrawalState, client.withdrawalTimestamp]);

  const handleWithdrawClick = () => {
    setWithdrawError('');
    if (client.walletBalance <= 0) {
      setWithdrawError('Wallet balance is ₹0. Please wait for Admin to credit your wallet.');
      return;
    }

    if (client.withdrawalState === 'blocked') {
      setWithdrawError('Wallet is currently blocked. Please contact customer care.');
      return;
    }

    const now = Date.now();
    // Reset wallet balance to 0 and set state to pending
    const updated: ClientApplication = {
      ...client,
      walletBalance: 0,
      withdrawalState: 'pending',
      withdrawalTimestamp: now,
    };

    onUpdateClient(updated);
    setRemainingSeconds(300);
  };

  // Fast-forward helper for testing so users don't have to wait a full 5 minutes
  const handleFastForwardFiveMinutes = () => {
    onUpdateClient({
      ...client,
      withdrawalState: 'blocked',
      withdrawalTimestamp: Date.now() - FIVE_MINUTES_MS,
    });
  };

  // EMI Calculations
  const numericLoan =
    parseInt(client.loanAmount.replace(/[^0-9]/g, ''), 10) || 500000;
  const annualRate = 0.119;
  const monthlyRate = annualRate / 12;
  const tenureMonths = 24;
  const monthlyEmi = Math.round(
    (numericLoan *
      monthlyRate *
      Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  );
  const totalPayable = monthlyEmi * tenureMonths;
  const totalInterest = Math.max(0, totalPayable - numericLoan);

  const formatTimeRemaining = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  return (
    <div className="bg-[#f0f7ff] flex-1 py-8 px-4 sm:px-6">
      <div className="max-w-[850px] mx-auto space-y-6">
        {/* Top Header Card: Client Name, Client ID, Loan Status */}
        <div className="bg-gradient-to-br from-[#072545] via-[#0369a1] to-[#0284c7] text-white p-6 sm:p-8 rounded-2xl shadow-[0_16px_40px_rgba(3,105,161,0.14)] border border-[#bae6fd]/30">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-white/15">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center font-black text-white text-sm">
                AC
              </div>
              <span className="text-base font-black tracking-tight">
                AVIVA <span className="text-[#38bdf8]">CAPITAL</span>
              </span>
            </div>

            {/* Client ID */}
            <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-[#bae6fd] border border-white/20">
              <Hash className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>Client ID: #{client.id}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider font-extrabold text-[#bae6fd] mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Client Name</span>
              </div>
              <h1
                id="client-welcome-name"
                className="text-2xl sm:text-3xl font-black tracking-tight text-white"
              >
                {client.fullName}
              </h1>
            </div>

            {/* Loan Status & Loan Consolidation Approval */}
            <div className="sm:text-right">
              <div className="text-[11px] uppercase tracking-wider font-extrabold text-[#bae6fd] mb-1.5 sm:text-right">
                Loan Status
              </div>
              <div id="client-approval-badge-container">
                {client.status === 'Approved' ? (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-400 shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>🟢 Loan Consolidation Approval</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-400 shadow-sm">
                    <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                    <span>🟡 Finance approval your loan it&apos;s will be show after admin approval</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Client Details Section in Dashboard: Date of Birth, Phone Number, Address */}
        <div className="bg-white border-[1.5px] border-[#bae6fd] rounded-2xl p-5 sm:p-6 shadow-[0_12px_32px_rgba(3,105,161,0.06)]">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e0f2fe]">
            <h3 className="text-sm font-extrabold text-[#0369a1] flex items-center gap-2">
              <User className="w-4 h-4 text-[#0284c7]" />
              <span>Client Details</span>
            </h3>
            <span className="text-[11px] font-mono font-bold text-slate-500 bg-[#f0f9ff] px-2.5 py-1 rounded-md border border-[#bae6fd]">
              Client ID: #{client.id}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
            {/* Date of Birth */}
            <div className="bg-[#f8fbfe] p-3 rounded-xl border border-[#bae6fd]/70">
              <div className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#0284c7]" />
                <span>Date of Birth</span>
              </div>
              <div className="text-sm font-extrabold text-[#072545]">
                {client.dob || '-'}
              </div>
            </div>

            {/* Phone Number */}
            <div className="bg-[#f8fbfe] p-3 rounded-xl border border-[#bae6fd]/70">
              <div className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#0284c7]" />
                <span>Phone Number</span>
              </div>
              <div className="text-sm font-extrabold text-[#072545]">
                {client.phone || '-'}
              </div>
            </div>

            {/* Email / User ID */}
            <div className="bg-[#f8fbfe] p-3 rounded-xl border border-[#bae6fd]/70">
              <div className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#0284c7]" />
                <span>Email / User ID</span>
              </div>
              <div className="text-sm font-extrabold text-[#072545] truncate">
                {client.email || '-'}
              </div>
            </div>

            {/* Registered Address */}
            <div className="bg-[#f8fbfe] p-3 rounded-xl border border-[#bae6fd]/70 sm:col-span-2 lg:col-span-3">
              <div className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#0284c7]" />
                <span>Registered Address</span>
              </div>
              <div className="text-xs sm:text-sm font-semibold text-[#072545]">
                {client.address || '-'}
              </div>
            </div>
          </div>
        </div>

        {/* Views are navigated separately via the 3-Lines menu */}

        {/* TAB 1: PERSONAL INFORMATION */}
        {activeTab === 'profile' && (
          <div
            id="dash-tab-profile"
            className="bg-white border-[1.5px] border-[#bae6fd] rounded-2xl p-6 sm:p-8 shadow-[0_12px_32px_rgba(3,105,161,0.08)] animate-in fade-in duration-150"
          >
            <button
              type="button"
              onClick={() => onSelectTab('emi')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0369a1] hover:text-[#0284c7] hover:underline mb-4 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← Back to Dashboard</span>
            </button>

            <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#e0f2fe]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#e0f2fe] flex items-center justify-center text-[#0369a1]">
                  <User className="w-5 h-5 text-[#0284c7]" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-[#0369a1]">Personal Information</h2>
                  <p className="text-xs text-slate-500 font-semibold">
                    {client.status === 'Approved'
                      ? 'Finance approval: Your loan has been approved.'
                      : 'Finance approval your loan it\u2019s will be show after admin approval'}
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-[#0369a1] bg-[#f0f9ff] px-3 py-1 rounded-full border border-[#bae6fd]">
                Client ID: #{client.id}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Full Name */}
              <div className="bg-[#f8fbfe] p-3.5 rounded-xl border border-[#bae6fd]/70">
                <div className="font-bold text-slate-500 uppercase tracking-wider text-[11px] mb-1">
                  Full Legal Name
                </div>
                <div id="info-name" className="text-sm font-extrabold text-[#072545]">
                  {client.fullName || '-'}
                </div>
              </div>

              {/* Email / User ID */}
              <div className="bg-[#f8fbfe] p-3.5 rounded-xl border border-[#bae6fd]/70">
                <div className="font-bold text-slate-500 uppercase tracking-wider text-[11px] mb-1">
                  Email / User ID
                </div>
                <div id="info-email" className="text-sm font-extrabold text-[#072545] truncate">
                  {client.email || '-'}
                </div>
              </div>

              {/* Mobile Phone */}
              <div className="bg-[#f8fbfe] p-3.5 rounded-xl border border-[#bae6fd]/70">
                <div className="font-bold text-slate-500 uppercase tracking-wider text-[11px] mb-1">
                  Mobile Phone Number
                </div>
                <div id="info-phone" className="text-sm font-extrabold text-[#072545]">
                  {client.phone || '-'}
                </div>
              </div>

              {/* Date of Birth */}
              <div className="bg-[#f8fbfe] p-3.5 rounded-xl border border-[#bae6fd]/70">
                <div className="font-bold text-slate-500 uppercase tracking-wider text-[11px] mb-1">
                  Date of Birth
                </div>
                <div className="text-sm font-extrabold text-[#072545]">
                  {client.dob || '-'}
                </div>
              </div>

              {/* Registered Address */}
              <div className="bg-[#f8fbfe] p-3.5 rounded-xl border border-[#bae6fd]/70 sm:col-span-2">
                <div className="font-bold text-slate-500 uppercase tracking-wider text-[11px] mb-1">
                  Registered Residential Address
                </div>
                <div className="text-sm font-semibold text-[#072545]">
                  {client.address || '-'}
                </div>
              </div>

              {/* Employment */}
              <div className="bg-[#f8fbfe] p-3.5 rounded-xl border border-[#bae6fd]/70">
                <div className="font-bold text-slate-500 uppercase tracking-wider text-[11px] mb-1">
                  Employment Status
                </div>
                <div id="info-employment" className="text-sm font-extrabold text-[#072545]">
                  {client.employment || '-'}
                </div>
              </div>

              {/* Monthly Salary */}
              <div className="bg-[#f8fbfe] p-3.5 rounded-xl border border-[#bae6fd]/70">
                <div className="font-bold text-slate-500 uppercase tracking-wider text-[11px] mb-1">
                  Monthly Income
                </div>
                <div className="text-sm font-extrabold text-[#072545]">
                  ₹{Number(client.salary || 65000).toLocaleString('en-IN')} / month
                </div>
              </div>

              {/* Loan Amount */}
              <div className="bg-[#f8fbfe] p-3.5 rounded-xl border border-[#bae6fd]/70">
                <div className="font-bold text-slate-500 uppercase tracking-wider text-[11px] mb-1">
                  Sanctioned Loan Amount
                </div>
                <div id="info-loanamt" className="text-sm font-black text-[#0369a1]">
                  {client.loanAmount || '-'}
                </div>
              </div>

              {/* Bank Name */}
              <div className="bg-[#f8fbfe] p-3.5 rounded-xl border border-[#bae6fd]/70">
                <div className="font-bold text-slate-500 uppercase tracking-wider text-[11px] mb-1">
                  Bank Name
                </div>
                <div id="info-bank" className="text-sm font-extrabold text-[#072545]">
                  {client.bankName || '-'}
                </div>
              </div>

              {/* Bank Account Holder */}
              <div className="bg-[#f8fbfe] p-3.5 rounded-xl border border-[#bae6fd]/70">
                <div className="font-bold text-slate-500 uppercase tracking-wider text-[11px] mb-1">
                  A/C Holder Name
                </div>
                <div className="text-sm font-extrabold text-[#072545]">
                  {client.bankHolder || client.fullName || '-'}
                </div>
              </div>

              {/* Account Number */}
              <div className="bg-[#f8fbfe] p-3.5 rounded-xl border border-[#bae6fd]/70">
                <div className="font-bold text-slate-500 uppercase tracking-wider text-[11px] mb-1">
                  Account Number
                </div>
                <div id="info-acc" className="text-sm font-extrabold font-mono text-[#072545]">
                  {client.bankAcc || '-'}
                </div>
              </div>

              {/* IFSC Code */}
              <div className="bg-[#f8fbfe] p-3.5 rounded-xl border border-[#bae6fd]/70">
                <div className="font-bold text-slate-500 uppercase tracking-wider text-[11px] mb-1">
                  IFSC Code
                </div>
                <div id="info-ifsc" className="text-sm font-extrabold font-mono text-[#072545]">
                  {client.bankIfsc || '-'}
                </div>
              </div>

              {/* Nominee Details */}
              <div className="bg-[#f8fbfe] p-3.5 rounded-xl border border-[#bae6fd]/70 sm:col-span-2">
                <div className="font-bold text-slate-500 uppercase tracking-wider text-[11px] mb-1">
                  Nominee Particulars
                </div>
                <div className="text-sm font-semibold text-[#072545] flex flex-wrap gap-4">
                  <span>Name: <strong>{client.nomineeName || 'Not specified'}</strong></span>
                  {client.nomineePhone && (
                    <span>Mobile: <strong>{client.nomineePhone}</strong></span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 p-3.5 bg-[#f0f9ff] border border-[#bae6fd] rounded-xl text-xs text-slate-600 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0284c7] shrink-0" />
              <span>
                {client.status === 'Approved'
                  ? 'Finance approval confirmed: Your loan has been approved.'
                  : 'Finance approval your loan it\u2019s will be show after admin approval'}
              </span>
            </div>
          </div>
        )}

        {/* TAB 2: WALLET */}
        {activeTab === 'wallet' && (
          <div
            id="dash-tab-wallet"
            className="bg-white border-[1.5px] border-[#bae6fd] rounded-2xl p-6 sm:p-8 shadow-[0_12px_32px_rgba(3,105,161,0.08)] animate-in fade-in duration-150 space-y-6"
          >
            <button
              type="button"
              onClick={() => onSelectTab('emi')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0369a1] hover:text-[#0284c7] hover:underline mb-1 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← Back to Dashboard</span>
            </button>

            {/* Wallet Balance Hero Card */}
            <div className="bg-gradient-to-br from-[#072545] via-[#0369a1] to-[#0284c7] text-white rounded-2xl p-7 text-center shadow-[0_16px_40px_rgba(3,105,161,0.18)] border border-white/20">
              <div className="text-xs uppercase tracking-wider font-extrabold text-[#bae6fd] mb-2 flex items-center justify-center gap-1.5">
                <Wallet className="w-4 h-4 text-[#38bdf8]" />
                <span>Wallet Balance</span>
              </div>
              <div
                id="display-wallet-balance"
                className="text-4xl sm:text-5xl font-black text-[#38bdf8] tracking-tight mb-2"
              >
                ₹{client.walletBalance.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-[#bae6fd] max-w-md mx-auto">
                {client.walletBalance === 0
                  ? 'Your wallet balance is ₹0. Once approved, admin will credit your sanctioned credit amount here.'
                  : 'Sanctioned funds ready for bank transfer.'}
              </p>
            </div>

            {/* Error banner if any */}
            {withdrawError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-bold">
                ⚠️ {withdrawError}
              </div>
            )}

            {/* Down side: Withdraw Money Action */}
            <div className="bg-[#f8fbfe] border border-[#bae6fd] rounded-2xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-extrabold text-[#0369a1]">Withdrawal Request</h3>
                  <p className="text-xs text-slate-500">
                    Transfer full available wallet funds to your verified account ({client.bankName})
                  </p>
                </div>
                <div className="text-xs font-mono font-bold text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-[#bae6fd]">
                  Available: ₹{client.walletBalance.toLocaleString('en-IN')}
                </div>
              </div>

              <button
                type="button"
                onClick={handleWithdrawClick}
                disabled={client.walletBalance <= 0 || client.withdrawalState === 'blocked' || client.withdrawalState === 'pending'}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-[#0369a1] hover:bg-[#0284c7] text-white shadow-md shadow-[#0369a1]/25 transition cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
              >
                <Wallet className="w-4 h-4" />
                <span>Withdraw Money</span>
              </button>

              {/* DOWNSIDE NOTICES: As explicitly requested */}
              {/* 1. Pending Notice: "withdrawal pending please wait.." for 5 minutes */}
              {client.withdrawalState === 'pending' && (
                <div
                  id="wallet-status-notice"
                  className="p-4 rounded-xl bg-[#fef3c7] text-[#b45309] border-[1.5px] border-[#f59e0b] shadow-sm animate-in fade-in duration-200"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                    <div className="flex items-center gap-2 font-extrabold text-sm sm:text-base">
                      <Clock className="w-5 h-5 text-[#b45309] animate-spin" />
                      <span>withdrawal pending please wait..</span>
                    </div>
                    <span className="text-xs font-mono font-bold bg-[#fef9c3] px-2.5 py-1 rounded-md border border-[#fde047]">
                      ⏳ {formatTimeRemaining(remainingSeconds)} remaining
                    </span>
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed mb-3">
                    Your withdrawal request has been received by the disbursement gateway. Verification and security clearing in progress.
                  </p>

                  {/* Fast forward helper button for testing */}
                  <div className="pt-2 border-t border-amber-300/60 flex items-center justify-between">
                    <span className="text-[11px] text-amber-700">
                      Standard verification window: 5 minutes
                    </span>
                    <button
                      type="button"
                      onClick={handleFastForwardFiveMinutes}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-200 hover:bg-amber-300 px-2.5 py-1 rounded transition cursor-pointer"
                      title="Fast-forward the 5-minute timer to test blocked state immediately"
                    >
                      <FastForward className="w-3 h-3" />
                      <span>Fast-forward 5 min (test)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 2. Blocked Notice: "incorrect account details wallet blocked please contact customer care executive" */}
              {client.withdrawalState === 'blocked' && (
                <div
                  id="wallet-status-notice"
                  className="p-4 rounded-xl bg-[#fee2e2] text-[#dc2626] border-[1.5px] border-[#ef4444] shadow-sm animate-in fade-in duration-200 space-y-2"
                >
                  <div className="flex items-center gap-2 font-black text-sm sm:text-base text-red-700">
                    <AlertCircle className="w-5 h-5 text-[#dc2626] shrink-0" />
                    <span>incorrect account details wallet blocked please contact customer care executive</span>
                  </div>
                  <p className="text-xs text-red-600 leading-relaxed">
                    Security lock triggered: Bank account name or IFSC discrepancy detected. Your wallet has been placed on hold. Please contact customer care.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: EMI DETAILS */}
        {activeTab === 'emi' && (
          <div
            id="dash-tab-emi"
            className="bg-white border-[1.5px] border-[#bae6fd] rounded-2xl p-6 sm:p-8 shadow-[0_12px_32px_rgba(3,105,161,0.08)] animate-in fade-in duration-150 space-y-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#e0f2fe]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#e0f2fe] flex items-center justify-center text-[#0369a1]">
                  <BarChart3 className="w-5 h-5 text-[#0284c7]" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-[#0369a1]">EMI Details</h2>
                  <p className="text-xs text-slate-500">Repayment breakdown &amp; auto-debit schedule</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-300">
                Fixed Rate
              </span>
            </div>

            {/* Monthly EMI highlight banner */}
            <div className="bg-gradient-to-br from-[#0284c7] to-[#0369a1] text-white p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-wider font-extrabold text-[#bae6fd] mb-1">
                  Monthly Installment (EMI)
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  ₹{monthlyEmi.toLocaleString('en-IN')}{' '}
                  <span className="text-base font-normal text-[#bae6fd]">/ month</span>
                </div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm px-4 py-2 rounded-xl text-xs font-semibold text-white border border-white/20">
                Due on the 5th of every month
              </div>
            </div>

            {/* EMI Parameters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#f8fbfe] p-4 rounded-xl border border-[#bae6fd]">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#0284c7]" />
                  <span>Sanctioned Loan Amount</span>
                </div>
                <div id="emi-loanamt" className="text-2xl font-black text-[#0369a1]">
                  {client.loanAmount || `₹${numericLoan.toLocaleString('en-IN')}`}
                </div>
              </div>

              <div className="bg-[#f8fbfe] p-4 rounded-xl border border-[#bae6fd]">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#0284c7]" />
                  <span>Tenure</span>
                </div>
                <div className="text-2xl font-black text-slate-800">
                  {tenureMonths} Months
                </div>
              </div>

              <div className="bg-[#f8fbfe] p-4 rounded-xl border border-[#bae6fd]">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-[#0284c7]" />
                  <span>Annual Interest Rate</span>
                </div>
                <div className="text-2xl font-black text-slate-800">
                  11.9% p.a.
                </div>
              </div>

              <div className="bg-[#f8fbfe] p-4 rounded-xl border border-[#bae6fd]">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#0284c7]" />
                  <span>Total Interest Payable</span>
                </div>
                <div className="text-2xl font-black text-slate-800">
                  ₹{totalInterest.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Repayment Breakdown Bar */}
            <div className="bg-[#f8fbfe] p-4 rounded-xl border border-[#e0f2fe]">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-2">
                <span>Principal: ₹{numericLoan.toLocaleString('en-IN')}</span>
                <span>Total Repayment: ₹{totalPayable.toLocaleString('en-IN')}</span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex">
                <div
                  className="bg-[#0369a1] h-full"
                  style={{ width: `${(numericLoan / totalPayable) * 100}%` }}
                  title="Principal Amount"
                />
                <div
                  className="bg-[#38bdf8] h-full"
                  style={{ width: `${(totalInterest / totalPayable) * 100}%` }}
                  title="Interest Amount"
                />
              </div>
              <div className="flex items-center gap-4 text-[11px] text-slate-500 mt-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0369a1]"></span>
                  <span>Principal ({Math.round((numericLoan / totalPayable) * 100)}%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8]"></span>
                  <span>Interest ({Math.round((totalInterest / totalPayable) * 100)}%)</span>
                </div>
              </div>
            </div>

            {/* Auto-Debit Details */}
            <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-4 text-xs text-slate-700 space-y-2">
              <div className="font-extrabold text-emerald-900 flex items-center gap-1.5 text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Auto-Debit (NACH / e-Mandate) Information</span>
              </div>
              <p className="leading-relaxed text-slate-600">
                Monthly installment of <strong>₹{monthlyEmi.toLocaleString('en-IN')}</strong> will be debited on the 5th of every month from your registered bank account ({client.bankName || 'Bank'} - {client.bankAcc || '••••••••'}).
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
