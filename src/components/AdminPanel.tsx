import React, { useState } from 'react';
import { ClientApplication } from '../types';
import {
  ShieldAlert,
  KeyRound,
  Save,
  CheckCircle,
  Clock,
  Eye,
  CreditCard,
  UserCheck,
  RotateCcw,
  RefreshCw,
  Search,
  ExternalLink,
  LockOpen,
} from 'lucide-react';

interface AdminPanelProps {
  applications: ClientApplication[];
  onUpdateApplication: (index: number, updated: ClientApplication) => void;
  onViewDocuments: (app: ClientApplication) => void;
  onViewPortal: (app: ClientApplication) => void;
  onResetData: () => void;
  onExitAdmin?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  applications,
  onUpdateApplication,
  onViewDocuments,
  onViewPortal,
  onResetData,
  onExitAdmin,
}) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [saveToast, setSaveToast] = useState('');

  // Local editing drafts for each application
  const [drafts, setDrafts] = useState<{ [key: number]: ClientApplication }>(() => {
    const initial: { [key: number]: ClientApplication } = {};
    applications.forEach((app) => {
      initial[app.id] = { ...app };
    });
    return initial;
  });

  // Keep drafts synced if applications change
  React.useEffect(() => {
    setDrafts((prev) => {
      const next = { ...prev };
      applications.forEach((app) => {
        if (!next[app.id]) {
          next[app.id] = { ...app };
        }
      });
      return next;
    });
  }, [applications]);

  const handleAdminLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError('');
    if (adminUser.trim() === 'Ramadmin' && adminPass.trim() === 'Ram1233') {
      setIsAdminLoggedIn(true);
    } else {
      setLoginError('⚠️ Invalid Username or Password!');
    }
  };

  const autofillAdmin = () => {
    setAdminUser('Ramadmin');
    setAdminPass('Ram1233');
    setLoginError('');
  };

  const handleDraftChange = (
    id: number,
    field: keyof ClientApplication,
    value: string | number
  ) => {
    setDrafts((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSaveDetails = (index: number, id: number) => {
    const draft = drafts[id];
    if (draft) {
      onUpdateApplication(index, draft);
      setSaveToast(`✓ Saved changes and wallet balance for ${draft.fullName}`);
      setTimeout(() => setSaveToast(''), 3000);
    }
  };

  const toggleApproval = (index: number, app: ClientApplication) => {
    const newStatus = app.status === 'Approved' ? 'Pending' : 'Approved';
    const updated: ClientApplication = { ...app, status: newStatus };
    onUpdateApplication(index, updated);
    setDrafts((prev) => ({ ...prev, [app.id]: updated }));
  };

  const unblockWallet = (index: number, app: ClientApplication) => {
    const updated: ClientApplication = { ...app, withdrawalState: 'none' };
    onUpdateApplication(index, updated);
    setDrafts((prev) => ({ ...prev, [app.id]: updated }));
    setSaveToast(`✓ Unblocked wallet for ${app.fullName}`);
    setTimeout(() => setSaveToast(''), 3000);
  };

  const filteredApplications = applications.filter(
    (app) =>
      app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone.includes(searchTerm) ||
      app.bankAcc.includes(searchTerm)
  );

  return (
    <div className="bg-[#f0f7ff] flex-1 py-10 px-4 sm:px-6">
      <div className="max-w-[1100px] mx-auto">
        {!isAdminLoggedIn ? (
          /* Admin Login Screen */
          <div
            id="admin-login-box"
            className="max-w-[420px] mx-auto bg-white border-[1.5px] border-[#bae6fd] rounded-2xl p-7 sm:p-8 shadow-[0_16px_40px_rgba(3,105,161,0.12)] text-center animate-in fade-in duration-200"
          >
            <div className="w-14 h-14 mx-auto mb-3.5 rounded-xl bg-gradient-to-br from-[#0284c7] to-[#0369a1] flex items-center justify-center text-white shadow-md shadow-[#0369a1]/20">
              <KeyRound className="w-7 h-7 text-white" />
            </div>

            <h2 className="text-xl font-black text-[#0369a1] mb-1">
              Staff Admin Login
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Authorized Aviva Capital Credit Officers Only
            </p>

            {loginError && (
              <div
                id="admin-login-error"
                className="bg-[#fee2e2] text-[#b91c1c] border border-red-300 rounded-lg p-2.5 mb-4 text-xs font-bold"
              >
                {loginError}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-3.5 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="input-admin-user"
                  value={adminUser}
                  onChange={(e) => setAdminUser(e.target.value)}
                  placeholder="Ramadmin"
                  className="w-full p-2.5 text-xs border-[1.5px] border-[#bae6fd] rounded-lg bg-[#f8fbfe] outline-none focus:border-[#0284c7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="input-admin-pass"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 text-xs border-[1.5px] border-[#bae6fd] rounded-lg bg-[#f8fbfe] outline-none focus:border-[#0284c7]"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 px-4 rounded-lg font-bold text-xs bg-[#0369a1] hover:bg-[#0284c7] text-white shadow-md shadow-[#0369a1]/20 transition cursor-pointer"
              >
                Login as Staff Admin
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
              <button
                type="button"
                onClick={autofillAdmin}
                className="text-[11px] font-bold text-[#0284c7] hover:underline cursor-pointer block w-full"
              >
                ⚡ Click to Autofill Credentials (Ramadmin / Ram1233)
              </button>
              {onExitAdmin && (
                <button
                  type="button"
                  onClick={onExitAdmin}
                  className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 hover:underline cursor-pointer block w-full pt-1"
                >
                  ← Exit to Public Portal
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Admin Dashboard */
          <div id="admin-dashboard-box" className="animate-in fade-in duration-200">
            {/* Header row */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-white p-5 rounded-2xl border border-[#bae6fd] shadow-sm">
              <div>
                <h1 className="text-2xl font-black text-[#0369a1] flex items-center gap-2">
                  <ShieldAlert className="w-6 h-6 text-[#0284c7]" />
                  <span>Applications &amp; Wallet Manager</span>
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Review applicant KYC, credit verification, update loan wallets, and approve disbursements.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={onResetData}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-300 text-slate-700 bg-slate-50 hover:bg-slate-100 transition cursor-pointer flex items-center gap-1.5"
                  title="Reset to default initial applicant"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo Data</span>
                </button>
                <button
                  onClick={() => setIsAdminLoggedIn(false)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition cursor-pointer"
                >
                  Staff Logout
                </button>
                {onExitAdmin && (
                  <button
                    onClick={onExitAdmin}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 transition cursor-pointer"
                  >
                    ← Exit Admin
                  </button>
                )}
              </div>
            </div>

            {/* Quick Metrics & Search */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
              <div className="bg-white p-4 rounded-xl border border-[#bae6fd] shadow-sm">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Total Applications
                </div>
                <div className="text-2xl font-black text-[#072545] mt-1">
                  {applications.length}
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm">
                <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                  Approved
                </div>
                <div className="text-2xl font-black text-emerald-700 mt-1">
                  {applications.filter((a) => a.status === 'Approved').length}
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm">
                <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                  Pending Review
                </div>
                <div className="text-2xl font-black text-amber-700 mt-1">
                  {applications.filter((a) => a.status === 'Pending').length}
                </div>
              </div>
            </div>

            {/* Search Filter */}
            <div className="mb-4 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search applicants by name, email, phone, or bank account..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs font-medium bg-white border border-[#bae6fd] rounded-xl outline-none focus:border-[#0284c7] shadow-sm"
              />
            </div>

            {/* Toast feedback */}
            {saveToast && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 animate-in fade-in duration-150">
                {saveToast}
              </div>
            )}

            {/* Applications Cards List */}
            <div id="admin-applications-list" className="space-y-4">
              {filteredApplications.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl text-center text-slate-500 text-xs border border-dashed border-[#bae6fd]">
                  No applications found matching &quot;{searchTerm}&quot;
                </div>
              ) : (
                filteredApplications.map((app) => {
                  const originalIndex = applications.findIndex((a) => a.id === app.id);
                  const draft = drafts[app.id] || app;

                  return (
                    <div
                      key={app.id}
                      className="bg-[#f0f9ff] p-5 rounded-2xl border-[1.5px] border-[#bae6fd] shadow-sm hover:shadow-md transition"
                    >
                      {/* Card Header */}
                      <div className="flex flex-wrap justify-between items-center gap-2 mb-3.5 pb-2.5 border-b border-[#e0f2fe]">
                        <div className="flex items-center gap-2">
                          <b className="text-slate-900 text-sm">
                            #{app.id} - {app.fullName}
                          </b>
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              app.status === 'Approved'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}
                          >
                            {app.status}
                          </span>
                          {app.withdrawalState === 'blocked' && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-300">
                              Wallet Blocked
                            </span>
                          )}
                          {app.withdrawalState === 'pending' && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                              Withdrawal Pending
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-slate-500">
                          Employment: {app.employment}
                        </span>
                      </div>

                      {/* 2-Column Editable Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        <div>
                          <label className="block text-[0.75rem] font-bold text-slate-700 mb-1">
                            Full Name:
                          </label>
                          <input
                            type="text"
                            id={`admin-name-${originalIndex}`}
                            value={draft.fullName || ''}
                            onChange={(e) =>
                              handleDraftChange(app.id, 'fullName', e.target.value)
                            }
                            className="w-full p-2 text-xs border border-[#bae6fd] rounded-lg bg-white outline-none focus:border-[#0284c7]"
                          />
                        </div>

                        <div>
                          <label className="block text-[0.75rem] font-bold text-slate-700 mb-1">
                            Email / User ID:
                          </label>
                          <input
                            type="email"
                            id={`admin-email-${originalIndex}`}
                            value={draft.email || ''}
                            onChange={(e) =>
                              handleDraftChange(app.id, 'email', e.target.value)
                            }
                            className="w-full p-2 text-xs border border-[#bae6fd] rounded-lg bg-white outline-none focus:border-[#0284c7]"
                          />
                        </div>

                        <div>
                          <label className="block text-[0.75rem] font-bold text-slate-700 mb-1">
                            Phone:
                          </label>
                          <input
                            type="text"
                            id={`admin-phone-${originalIndex}`}
                            value={draft.phone || ''}
                            onChange={(e) =>
                              handleDraftChange(app.id, 'phone', e.target.value)
                            }
                            className="w-full p-2 text-xs border border-[#bae6fd] rounded-lg bg-white outline-none focus:border-[#0284c7]"
                          />
                        </div>

                        <div>
                          <label className="block text-[0.75rem] font-bold text-slate-700 mb-1">
                            Date of Birth:
                          </label>
                          <input
                            type="text"
                            value={draft.dob || '14/08/1990'}
                            onChange={(e) =>
                              handleDraftChange(app.id, 'dob', e.target.value)
                            }
                            className="w-full p-2 text-xs border border-[#bae6fd] rounded-lg bg-white outline-none focus:border-[#0284c7]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[0.75rem] font-bold text-slate-700 mb-1">
                            Registered Address:
                          </label>
                          <input
                            type="text"
                            value={draft.address || 'Plot 42, Green Avenue, Bandra West, Mumbai, MH - 400050'}
                            onChange={(e) =>
                              handleDraftChange(app.id, 'address', e.target.value)
                            }
                            className="w-full p-2 text-xs border border-[#bae6fd] rounded-lg bg-white outline-none focus:border-[#0284c7]"
                          />
                        </div>

                        <div>
                          <label className="block text-[0.75rem] font-bold text-slate-700 mb-1">
                            Loan Amount:
                          </label>
                          <input
                            type="text"
                            id={`admin-loanamt-${originalIndex}`}
                            value={draft.loanAmount || ''}
                            onChange={(e) =>
                              handleDraftChange(app.id, 'loanAmount', e.target.value)
                            }
                            className="w-full p-2 text-xs border border-[#bae6fd] rounded-lg bg-white outline-none focus:border-[#0284c7]"
                          />
                        </div>

                        <div>
                          <label className="block text-[0.75rem] font-bold text-slate-700 mb-1">
                            Bank Name:
                          </label>
                          <input
                            type="text"
                            id={`admin-bank-${originalIndex}`}
                            value={draft.bankName || ''}
                            onChange={(e) =>
                              handleDraftChange(app.id, 'bankName', e.target.value)
                            }
                            className="w-full p-2 text-xs border border-[#bae6fd] rounded-lg bg-white outline-none focus:border-[#0284c7]"
                          />
                        </div>

                        <div>
                          <label className="block text-[0.75rem] font-bold text-slate-700 mb-1">
                            Account Number:
                          </label>
                          <input
                            type="text"
                            id={`admin-acc-${originalIndex}`}
                            value={draft.bankAcc || ''}
                            onChange={(e) =>
                              handleDraftChange(app.id, 'bankAcc', e.target.value)
                            }
                            className="w-full p-2 text-xs border border-[#bae6fd] rounded-lg bg-white outline-none focus:border-[#0284c7]"
                          />
                        </div>
                      </div>

                      {/* Admin Actions Bar */}
                      <div className="flex flex-wrap gap-2.5 items-center justify-between pt-3 border-t border-[#e0f2fe]">
                        <div className="flex items-center gap-2">
                          <label className="text-[0.78rem] font-bold text-slate-700">
                            Wallet (₹):
                          </label>
                          <input
                            type="number"
                            id={`admin-wallet-${originalIndex}`}
                            value={draft.walletBalance ?? 0}
                            onChange={(e) =>
                              handleDraftChange(
                                app.id,
                                'walletBalance',
                                Number(e.target.value) || 0
                              )
                            }
                            className="w-24 p-1.5 text-xs font-bold border border-[#bae6fd] rounded-lg bg-white outline-none focus:border-[#0284c7]"
                          />
                        </div>

                        <div className="flex flex-wrap gap-2 items-center">
                          <button
                            type="button"
                            onClick={() => handleSaveDetails(originalIndex, app.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#0369a1] hover:bg-[#0284c7] text-white shadow-sm transition cursor-pointer flex items-center gap-1"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Save Details</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleApproval(originalIndex, app)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                              app.status === 'Approved'
                                ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                            }`}
                          >
                            {app.status === 'Approved' ? 'Mark Pending' : 'Approve Application'}
                          </button>

                          <button
                            type="button"
                            onClick={() => onViewDocuments(app)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#e0f2fe] text-[#0369a1] border border-[#bae6fd] hover:bg-[#bae6fd]/50 transition cursor-pointer flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#0284c7]" />
                            <span>📁 View Documents</span>
                          </button>

                          {app.withdrawalState === 'blocked' && (
                            <button
                              type="button"
                              onClick={() => unblockWallet(originalIndex, app)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-green-50 text-green-700 border border-green-300 hover:bg-green-100 transition cursor-pointer flex items-center gap-1"
                            >
                              <LockOpen className="w-3.5 h-3.5" />
                              <span>Unblock Wallet</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => onViewPortal(app)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-[#0369a1] border border-[#bae6fd] hover:bg-[#f0f9ff] transition cursor-pointer flex items-center gap-1"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>View Portal</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
