import React, { useState } from 'react';
import {
  ClientApplication,
  ClientDocuments,
  EmploymentType,
  AccountType,
} from '../types';
import {
  sampleAadhaarFront,
  sampleAadhaarBack,
  samplePhoto,
  sampleNomineeAadhaar,
} from '../mockData';
import {
  CheckCircle2,
  Upload,
  User,
  Mail,
  Phone,
  Building,
  CreditCard,
  Lock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  FileCheck,
} from 'lucide-react';

interface RegistrationFlowProps {
  onComplete: (newApp: ClientApplication) => void;
  onOpenDashboard: (app: ClientApplication) => void;
}

export const RegistrationFlow: React.FC<RegistrationFlowProps> = ({
  onComplete,
  onOpenDashboard,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [createdClient, setCreatedClient] = useState<ClientApplication | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState<string>('');
  const [dob, setDob] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  // KYC Docs
  const [documents, setDocuments] = useState<ClientDocuments>({
    aadharFront: '',
    aadharBack: '',
    photo: '',
    nomineeAadhar: '',
  });

  const [documentFileNames, setDocumentFileNames] = useState<{ [key: string]: string }>({
    aadharFront: '',
    aadharBack: '',
    photo: '',
    nomineeAadhar: '',
  });

  // Nominee
  const [nomineeName, setNomineeName] = useState<string>('');
  const [nomineePhone, setNomineePhone] = useState<string>('');

  // Step 3
  const [employmentType, setEmploymentType] = useState<EmploymentType>('Salaried');
  const [salary, setSalary] = useState<number>(65000);
  const [loanAmount, setLoanAmount] = useState<number>(500000);

  // Bank
  const [bankName, setBankName] = useState<string>('');
  const [bankHolder, setBankHolder] = useState<string>('');
  const [bankAcc, setBankAcc] = useState<string>('');
  const [bankIfsc, setBankIfsc] = useState<string>('');
  const [bankType, setBankType] = useState<AccountType>('Savings');

  // Credentials
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, key: keyof ClientDocuments) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setDocuments((prev) => ({ ...prev, [key]: result }));
        setDocumentFileNames((prev) => ({ ...prev, [key]: file.name }));
      };
      reader.readAsDataURL(file);
    }
  };

  const autofillDemoDocs = () => {
    setDocuments({
      aadharFront: sampleAadhaarFront,
      aadharBack: sampleAadhaarBack,
      photo: samplePhoto,
      nomineeAadhar: sampleNomineeAadhaar,
    });
    setDocumentFileNames({
      aadharFront: 'aadhaar_front_sample.svg',
      aadharBack: 'aadhaar_back_sample.svg',
      photo: 'passport_photo_sample.svg',
      nomineeAadhar: 'nominee_aadhaar_sample.svg',
    });
    if (!nomineeName) setNomineeName('Sunita Sharma');
    if (!nomineePhone) setNomineePhone('+91 98765 22334');
    setErrorMessage('');
  };

  const handleStep1Submit = () => {
    setErrorMessage('');
    if (!fullName.trim()) {
      setErrorMessage('Please enter Full Legal Name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid Email Address.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Please enter Mobile Phone Number.');
      return;
    }
    // Set default bank holder name if not set
    if (!bankHolder) {
      setBankHolder(fullName.trim());
    }
    setStep(2);
  };

  const handleStep2Submit = () => {
    setErrorMessage('');
    // Optional check or soft requirement
    setStep(3);
  };

  const handleStep3Submit = () => {
    setErrorMessage('');
    if (!bankName.trim() || !bankAcc.trim() || !bankIfsc.trim()) {
      setErrorMessage('Please fill in complete Bank Details (Bank Name, Account Number, IFSC).');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    const formattedLoan = `₹${Number(loanAmount || 500000).toLocaleString('en-IN')}`;

    const newApp: ClientApplication = {
      id: Date.now(),
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      dob: dob.trim() || '14/08/1990',
      address: address.trim() || 'Not specified',
      employment: employmentType,
      salary: Number(salary) || 65000,
      loanAmount: formattedLoan,
      bankName: bankName.trim(),
      bankHolder: bankHolder.trim() || fullName.trim(),
      bankAcc: bankAcc.trim(),
      bankIfsc: bankIfsc.trim().toUpperCase(),
      bankType,
      nomineeName: nomineeName.trim() || 'Not specified',
      nomineePhone: nomineePhone.trim() || '',
      password,
      status: 'Pending',
      walletBalance: 0,
      withdrawalState: 'none',
      documents: { ...documents },
      createdAt: new Date().toISOString(),
    };

    setCreatedClient(newApp);
    setIsSuccess(true);
    onComplete(newApp);
  };

  return (
    <div className="bg-[#f0f7ff] flex-1 py-10 px-4 sm:px-6">
      <div className="max-w-[1200px] mx-auto">
        <div
          id="main-portal-card"
          className="bg-white rounded-[24px] border-[1.5px] border-[#bae6fd] shadow-[0_16px_40px_rgba(3,105,161,0.12)] overflow-hidden grid grid-cols-1 lg:grid-cols-[360px_1fr]"
        >
          {/* Left Hero Panel */}
          <div
            id="hero-panel-side"
            className="bg-gradient-to-br from-[#072545] via-[#0369a1] to-[#0284c7] text-white p-8 sm:p-9 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2.5 mb-6">
                <div className="h-9 w-9 rounded-lg bg-white/20 flex items-center justify-center font-black text-white text-base">
                  AC
                </div>
                <span className="text-[1.15rem] font-black tracking-tight">
                  AVIVA <span className="text-[#38bdf8]">CAPITAL</span>
                </span>
              </div>

              <h2 className="text-2xl sm:text-[1.6rem] font-black leading-snug mb-3">
                Paperless Instant Credit Registration
              </h2>
              <p className="text-sm text-[#bae6fd] mb-7 leading-relaxed">
                Fast-track institutional verification with Aadhaar-linked e-KYC.
              </p>

              {/* Progress Checklist Steps */}
              <div id="registration-checklist-group" className="space-y-3">
                <div
                  className={`flex items-center gap-3 p-2.5 px-3.5 rounded-lg transition-all ${
                    step === 1
                      ? 'bg-[#38bdf8]/20 border-l-4 border-[#38bdf8]'
                      : step > 1
                      ? 'bg-white/10'
                      : 'bg-white/[0.06] opacity-70'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${
                      step === 1
                        ? 'bg-[#38bdf8] text-[#072545]'
                        : step > 1
                        ? 'bg-emerald-400 text-slate-900'
                        : 'bg-white/20 text-white'
                    }`}
                  >
                    {step > 1 ? '✓' : '1'}
                  </span>
                  <div>
                    <div className="text-xs sm:text-[0.85rem] font-extrabold text-white">
                      Contact &amp; Identity
                    </div>
                    <div className="text-[0.72rem] text-[#bae6fd]">Name, Phone &amp; Email</div>
                  </div>
                </div>

                <div
                  className={`flex items-center gap-3 p-2.5 px-3.5 rounded-lg transition-all ${
                    step === 2
                      ? 'bg-[#38bdf8]/20 border-l-4 border-[#38bdf8]'
                      : step > 2
                      ? 'bg-white/10'
                      : 'bg-white/[0.06] opacity-70'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${
                      step === 2
                        ? 'bg-[#38bdf8] text-[#072545]'
                        : step > 2
                        ? 'bg-emerald-400 text-slate-900'
                        : 'bg-white/20 text-white'
                    }`}
                  >
                    {step > 2 ? '✓' : '2'}
                  </span>
                  <div>
                    <div className="text-xs sm:text-[0.85rem] font-extrabold text-white">
                      Aadhaar &amp; Nominee KYC
                    </div>
                    <div className="text-[0.72rem] text-[#bae6fd]">Upload all documents</div>
                  </div>
                </div>

                <div
                  className={`flex items-center gap-3 p-2.5 px-3.5 rounded-lg transition-all ${
                    step === 3
                      ? 'bg-[#38bdf8]/20 border-l-4 border-[#38bdf8]'
                      : 'bg-white/[0.06] opacity-70'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${
                      step === 3
                        ? 'bg-[#38bdf8] text-[#072545]'
                        : 'bg-white/20 text-white'
                    }`}
                  >
                    3
                  </span>
                  <div>
                    <div className="text-xs sm:text-[0.85rem] font-extrabold text-white">
                      Loan Spec &amp; Bank
                    </div>
                    <div className="text-[0.72rem] text-[#bae6fd]">Loan amount &amp; bank info</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-8 border-t border-white/15 text-xs text-[#bae6fd] flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>256-bit Bank Grade Encrypted</span>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="p-8 sm:p-10 bg-white">
            {isSuccess && createdClient ? (
              <div
                id="registration-success-card"
                className="bg-[#f0fdf4] border-[1.5px] border-[#22c55e] rounded-2xl p-8 sm:p-10 text-center animate-in fade-in zoom-in-95 duration-200"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center text-[#16a34a] text-3xl font-black">
                  ✓
                </div>
                <h4 className="text-2xl font-black text-[#15803d] mb-2">
                  Application Submitted Successfully!
                </h4>
                <p className="text-sm text-slate-700 mb-6 max-w-md mx-auto">
                  Client application for <strong>{createdClient.fullName}</strong> received with Application ID{' '}
                  <span className="font-mono font-bold text-slate-900">#{createdClient.id}</span> (Status:{' '}
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    Pending Approval
                  </span>
                  ).
                </p>
                <button
                  onClick={() => onOpenDashboard(createdClient)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-bold text-sm bg-[#0369a1] hover:bg-[#0284c7] text-white shadow-md shadow-[#0369a1]/25 transition cursor-pointer"
                >
                  <span>Open Client Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div>
                {/* Step Header */}
                <div className="mb-5">
                  <div className="flex justify-between items-center mb-1.5 flex-wrap gap-2">
                    <h1
                      id="step-title-display"
                      className="text-2xl sm:text-[1.6rem] font-black text-[#0369a1]"
                    >
                      Client Registration
                    </h1>
                    <span
                      id="step-pill-display"
                      className="text-[0.78rem] font-extrabold text-[#0369a1] bg-[#f0f9ff] px-3 py-1 rounded-full border border-[#bae6fd]"
                    >
                      Step {step} of 3
                    </span>
                  </div>
                  <p id="step-desc-display" className="text-slate-600 text-[0.88rem]">
                    {step === 1 && "Enter the client's basic contact details to get started."}
                    {step === 2 && 'Upload identity KYC documents and provide nominee details.'}
                    {step === 3 && 'Specify loan requirement, disbursal bank account, and client portal login.'}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-[#e0f2fe] rounded-full mb-6 overflow-hidden">
                  <div
                    id="progress-bar-inner"
                    className="h-full bg-[#0369a1] transition-all duration-300 ease-in-out"
                    style={{
                      width: step === 1 ? '33.33%' : step === 2 ? '66.66%' : '100%',
                    }}
                  />
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div
                    id="form-error-alert"
                    className="bg-[#fee2e2] text-[#b91c1c] border border-[#f87171] rounded-lg p-3 px-4 mb-5 text-sm font-semibold flex items-center gap-2"
                  >
                    <span>⚠️</span>
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* STEP 1 */}
                {step === 1 && (
                  <div id="step-1-container" className="space-y-4">
                    <div>
                      <label className="block text-xs font-extrabold text-[#0f172a] mb-1.5">
                        👤 Full Legal Name *
                      </label>
                      <input
                        type="text"
                        id="input-full-name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter client's legal name (e.g. Ram Kumar)"
                        className="w-full p-3 px-3.5 text-sm border-[1.5px] border-[#bae6fd] rounded-lg outline-none bg-[#f8fbfe] focus:bg-white focus:border-[#0284c7] transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-[#0f172a] mb-1.5">
                        ✉️ Email Address (User ID / Username) *
                      </label>
                      <input
                        type="email"
                        id="input-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="client@example.com"
                        className="w-full p-3 px-3.5 text-sm border-[1.5px] border-[#bae6fd] rounded-lg outline-none bg-[#f8fbfe] focus:bg-white focus:border-[#0284c7] transition"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-extrabold text-[#0f172a] mb-1.5">
                          📱 Mobile Phone Number *
                        </label>
                        <input
                          type="tel"
                          id="input-phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full p-3 px-3.5 text-sm border-[1.5px] border-[#bae6fd] rounded-lg outline-none bg-[#f8fbfe] focus:bg-white focus:border-[#0284c7] transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-extrabold text-[#0f172a] mb-1.5">
                          🎂 Date of Birth
                        </label>
                        <input
                          type="text"
                          id="input-dob"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          placeholder="DD/MM/YYYY (e.g. 14/08/1990)"
                          className="w-full p-3 px-3.5 text-sm border-[1.5px] border-[#bae6fd] rounded-lg outline-none bg-[#f8fbfe] focus:bg-white focus:border-[#0284c7] transition"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-xs font-extrabold text-[#0f172a] mb-1.5">
                        📍 Registered Residential Address *
                      </label>
                      <input
                        type="text"
                        id="input-address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Flat / House No., Street, City, State, Pincode"
                        className="w-full p-3 px-3.5 text-sm border-[1.5px] border-[#bae6fd] rounded-lg outline-none bg-[#f8fbfe] focus:bg-white focus:border-[#0284c7] transition"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleStep1Submit}
                        className="w-full p-3.5 rounded-lg font-bold text-sm bg-[#0369a1] hover:bg-[#0284c7] text-white shadow-md shadow-[#0369a1]/20 transition cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>Continue to Step 2 (KYC &amp; Nominee)</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <div id="step-2-container" className="space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-extrabold text-[#0369a1] flex items-center gap-1.5">
                        <FileCheck className="w-4 h-4 text-[#0284c7]" />
                        <span>Identity &amp; Nominee Uploads</span>
                      </h3>
                      <button
                        type="button"
                        onClick={autofillDemoDocs}
                        className="text-[11px] font-bold text-[#0284c7] hover:text-[#0369a1] bg-[#e0f2fe] px-2.5 py-1 rounded border border-[#bae6fd] transition cursor-pointer flex items-center gap-1"
                        title="Quickly fill sample documents for quick testing"
                      >
                        <Sparkles className="w-3 h-3 text-[#0284c7]" />
                        <span>Demo KYC Docs</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* Aadhaar Front */}
                      <div className="border-[1.5px] border-dashed border-[#bae6fd] rounded-xl p-3 bg-[#f0f9ff] flex flex-col justify-between min-h-[105px]">
                        <div className="flex justify-between items-start">
                          <span className="text-[0.78rem] font-bold text-slate-800">
                            Aadhaar Front *
                          </span>
                          {documents.aadharFront && (
                            <img
                              src={documents.aadharFront}
                              alt="Front thumbnail"
                              className="w-7 h-7 object-cover rounded border border-[#bae6fd]"
                            />
                          )}
                        </div>
                        <span
                          id="text-aadharFront"
                          className={`text-[0.75rem] font-bold truncate ${
                            documents.aadharFront ? 'text-[#16a34a]' : 'text-[#0284c7]'
                          }`}
                        >
                          {documentFileNames.aadharFront
                            ? `✓ ${documentFileNames.aadharFront}`
                            : 'Not Uploaded'}
                        </span>
                        <label className="cursor-pointer flex items-center justify-center gap-1 bg-white p-1.5 rounded border border-[#bae6fd] hover:bg-[#e0f2fe] transition mt-1.5">
                          <Upload className="w-3.5 h-3.5 text-[#0369a1]" />
                          <span className="text-[0.75rem] text-[#0369a1] font-bold">Choose File</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, 'aadharFront')}
                          />
                        </label>
                      </div>

                      {/* Aadhaar Back */}
                      <div className="border-[1.5px] border-dashed border-[#bae6fd] rounded-xl p-3 bg-[#f0f9ff] flex flex-col justify-between min-h-[105px]">
                        <div className="flex justify-between items-start">
                          <span className="text-[0.78rem] font-bold text-slate-800">
                            Aadhaar Back *
                          </span>
                          {documents.aadharBack && (
                            <img
                              src={documents.aadharBack}
                              alt="Back thumbnail"
                              className="w-7 h-7 object-cover rounded border border-[#bae6fd]"
                            />
                          )}
                        </div>
                        <span
                          id="text-aadharBack"
                          className={`text-[0.75rem] font-bold truncate ${
                            documents.aadharBack ? 'text-[#16a34a]' : 'text-[#0284c7]'
                          }`}
                        >
                          {documentFileNames.aadharBack
                            ? `✓ ${documentFileNames.aadharBack}`
                            : 'Not Uploaded'}
                        </span>
                        <label className="cursor-pointer flex items-center justify-center gap-1 bg-white p-1.5 rounded border border-[#bae6fd] hover:bg-[#e0f2fe] transition mt-1.5">
                          <Upload className="w-3.5 h-3.5 text-[#0369a1]" />
                          <span className="text-[0.75rem] text-[#0369a1] font-bold">Choose File</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, 'aadharBack')}
                          />
                        </label>
                      </div>

                      {/* Client Photo */}
                      <div className="border-[1.5px] border-dashed border-[#bae6fd] rounded-xl p-3 bg-[#f0f9ff] flex flex-col justify-between min-h-[105px]">
                        <div className="flex justify-between items-start">
                          <span className="text-[0.78rem] font-bold text-slate-800">
                            👤 Client Photo *
                          </span>
                          {documents.photo && (
                            <img
                              src={documents.photo}
                              alt="Photo thumbnail"
                              className="w-7 h-7 object-cover rounded-full border border-[#bae6fd]"
                            />
                          )}
                        </div>
                        <span
                          id="text-photo"
                          className={`text-[0.75rem] font-bold truncate ${
                            documents.photo ? 'text-[#16a34a]' : 'text-[#0284c7]'
                          }`}
                        >
                          {documentFileNames.photo ? `✓ ${documentFileNames.photo}` : 'Not Uploaded'}
                        </span>
                        <label className="cursor-pointer flex items-center justify-center gap-1 bg-white p-1.5 rounded border border-[#bae6fd] hover:bg-[#e0f2fe] transition mt-1.5">
                          <Upload className="w-3.5 h-3.5 text-[#0369a1]" />
                          <span className="text-[0.75rem] text-[#0369a1] font-bold">Choose File</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, 'photo')}
                          />
                        </label>
                      </div>

                      {/* Nominee Aadhaar */}
                      <div className="border-[1.5px] border-dashed border-[#bae6fd] rounded-xl p-3 bg-[#f0f9ff] flex flex-col justify-between min-h-[105px]">
                        <div className="flex justify-between items-start">
                          <span className="text-[0.78rem] font-bold text-slate-800">
                            👥 Nominee Aadhaar *
                          </span>
                          {documents.nomineeAadhar && (
                            <img
                              src={documents.nomineeAadhar}
                              alt="Nominee thumbnail"
                              className="w-7 h-7 object-cover rounded border border-[#bae6fd]"
                            />
                          )}
                        </div>
                        <span
                          id="text-nomineeAadhar"
                          className={`text-[0.75rem] font-bold truncate ${
                            documents.nomineeAadhar ? 'text-[#16a34a]' : 'text-[#0284c7]'
                          }`}
                        >
                          {documentFileNames.nomineeAadhar
                            ? `✓ ${documentFileNames.nomineeAadhar}`
                            : 'Not Uploaded'}
                        </span>
                        <label className="cursor-pointer flex items-center justify-center gap-1 bg-white p-1.5 rounded border border-[#bae6fd] hover:bg-[#e0f2fe] transition mt-1.5">
                          <Upload className="w-3.5 h-3.5 text-[#0369a1]" />
                          <span className="text-[0.75rem] text-[#0369a1] font-bold">Choose File</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, 'nomineeAadhar')}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Nominee Details Card */}
                    <div className="bg-[#f0f9ff] border-[1.5px] border-[#bae6fd] rounded-xl p-3.5 mt-3">
                      <h4 className="text-[0.88rem] font-extrabold text-[#0369a1] mb-2.5">
                        👥 Nominee Particulars
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[0.78rem] font-bold text-slate-700 mb-1">
                            Nominee Name *
                          </label>
                          <input
                            type="text"
                            id="input-nominee-name"
                            value={nomineeName}
                            onChange={(e) => setNomineeName(e.target.value)}
                            placeholder="e.g. Priya Kumar (Spouse)"
                            className="w-full p-2.5 text-xs border-[1.5px] border-[#bae6fd] rounded-lg bg-white outline-none focus:border-[#0284c7]"
                          />
                        </div>
                        <div>
                          <label className="block text-[0.78rem] font-bold text-slate-700 mb-1">
                            Nominee Mobile *
                          </label>
                          <input
                            type="tel"
                            id="input-nominee-phone"
                            value={nomineePhone}
                            onChange={(e) => setNomineePhone(e.target.value)}
                            placeholder="+91 98765 11223"
                            className="w-full p-2.5 text-xs border-[1.5px] border-[#bae6fd] rounded-lg bg-white outline-none focus:border-[#0284c7]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2.5 pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 p-3 rounded-lg font-bold text-xs border-[1.5px] border-[#bae6fd] text-[#0369a1] bg-white hover:bg-[#f0f9ff] transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleStep2Submit}
                        className="flex-[2] p-3 rounded-lg font-bold text-xs bg-[#0369a1] hover:bg-[#0284c7] text-white transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span>Continue to Step 3</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                  <div id="step-3-container" className="space-y-4">
                    <h3 className="text-sm font-extrabold text-[#0369a1] mb-2 flex items-center gap-1.5">
                      <Building className="w-4 h-4 text-[#0284c7]" />
                      <span>Employment, Loan &amp; Bank Details</span>
                    </h3>

                    {/* Employment Toggle */}
                    <div>
                      <label className="block text-xs font-extrabold text-[#0f172a] mb-1.5">
                        Employee Status *
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          id="btn-salaried"
                          onClick={() => setEmploymentType('Salaried')}
                          className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                            employmentType === 'Salaried'
                              ? 'bg-[#0369a1] text-white shadow-sm'
                              : 'bg-white border-[1.5px] border-[#bae6fd] text-[#0369a1] hover:bg-[#f0f9ff]'
                          }`}
                        >
                          Salaried
                        </button>
                        <button
                          type="button"
                          id="btn-self-employed"
                          onClick={() => setEmploymentType('Self-Employed')}
                          className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                            employmentType === 'Self-Employed'
                              ? 'bg-[#0369a1] text-white shadow-sm'
                              : 'bg-white border-[1.5px] border-[#bae6fd] text-[#0369a1] hover:bg-[#f0f9ff]'
                          }`}
                        >
                          Self-Employed
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-extrabold text-[#0f172a] mb-1">
                          Monthly Income (₹) *
                        </label>
                        <input
                          type="number"
                          id="input-salary"
                          value={salary}
                          onChange={(e) => setSalary(Number(e.target.value))}
                          className="w-full p-2.5 text-xs border-[1.5px] border-[#bae6fd] rounded-lg bg-[#f8fbfe] outline-none focus:border-[#0284c7]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-extrabold text-[#0f172a] mb-1">
                          Loan Amount (₹) *
                        </label>
                        <input
                          type="number"
                          id="input-loan-amount"
                          value={loanAmount}
                          onChange={(e) => setLoanAmount(Number(e.target.value))}
                          className="w-full p-2.5 text-xs border-[1.5px] border-[#bae6fd] rounded-lg bg-[#f8fbfe] outline-none focus:border-[#0284c7]"
                        />
                      </div>
                    </div>

                    {/* Bank Details Card */}
                    <div className="bg-[#f0f9ff] border-[1.5px] border-[#bae6fd] rounded-xl p-3.5">
                      <h4 className="text-[0.88rem] font-extrabold text-[#0369a1] mb-2.5 flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-[#0284c7]" />
                        <span>Bank Account Details</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2.5">
                        <div>
                          <label className="block text-[0.78rem] font-bold text-slate-700 mb-1">
                            Bank Name *
                          </label>
                          <input
                            type="text"
                            id="input-bank-name"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            placeholder="e.g. HDFC Bank / SBI / ICICI"
                            className="w-full p-2.5 text-xs border-[1.5px] border-[#bae6fd] rounded-lg bg-white outline-none focus:border-[#0284c7]"
                          />
                        </div>
                        <div>
                          <label className="block text-[0.78rem] font-bold text-slate-700 mb-1">
                            A/C Holder Name *
                          </label>
                          <input
                            type="text"
                            id="input-bank-holder"
                            value={bankHolder}
                            onChange={(e) => setBankHolder(e.target.value)}
                            placeholder="Account holder name"
                            className="w-full p-2.5 text-xs border-[1.5px] border-[#bae6fd] rounded-lg bg-white outline-none focus:border-[#0284c7]"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2.5">
                        <div>
                          <label className="block text-[0.78rem] font-bold text-slate-700 mb-1">
                            Account Number *
                          </label>
                          <input
                            type="text"
                            id="input-bank-acc"
                            value={bankAcc}
                            onChange={(e) => setBankAcc(e.target.value)}
                            placeholder="50100XXXXXXXX"
                            className="w-full p-2.5 text-xs border-[1.5px] border-[#bae6fd] rounded-lg bg-white outline-none focus:border-[#0284c7]"
                          />
                        </div>
                        <div>
                          <label className="block text-[0.78rem] font-bold text-slate-700 mb-1">
                            IFSC Code *
                          </label>
                          <input
                            type="text"
                            id="input-bank-ifsc"
                            value={bankIfsc}
                            onChange={(e) => setBankIfsc(e.target.value.toUpperCase())}
                            placeholder="HDFC0001234"
                            className="w-full p-2.5 text-xs border-[1.5px] border-[#bae6fd] rounded-lg bg-white outline-none focus:border-[#0284c7]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[0.78rem] font-bold text-slate-700 mb-1">
                          Account Type *
                        </label>
                        <select
                          id="input-bank-type"
                          value={bankType}
                          onChange={(e) => setBankType(e.target.value as AccountType)}
                          className="w-full p-2.5 text-xs border-[1.5px] border-[#bae6fd] rounded-lg bg-white outline-none focus:border-[#0284c7]"
                        >
                          <option value="Savings">Savings Account</option>
                          <option value="Current">Current Account</option>
                        </select>
                      </div>
                    </div>

                    {/* Credentials Card */}
                    <div className="bg-white border-[1.5px] border-[#bae6fd] rounded-xl p-3.5">
                      <h4 className="text-[0.88rem] font-extrabold text-[#0369a1] mb-2.5 flex items-center gap-1.5">
                        <Lock className="w-4 h-4 text-[#0284c7]" />
                        <span>Create Client Credentials</span>
                      </h4>
                      <div className="mb-2.5">
                        <label className="block text-[0.78rem] font-bold text-slate-700 mb-1">
                          User ID / Email Username
                        </label>
                        <input
                          type="email"
                          id="input-synced-email"
                          value={email || 'client@example.com'}
                          readOnly
                          className="w-full p-2.5 text-xs border-[1.5px] border-[#bae6fd] rounded-lg bg-[#e0f2fe] font-bold text-[#072545] cursor-not-allowed outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[0.78rem] font-bold text-slate-700 mb-1">
                            Create Password *
                          </label>
                          <input
                            type="password"
                            id="input-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Min 6 characters"
                            className="w-full p-2.5 text-xs border-[1.5px] border-[#bae6fd] rounded-lg bg-[#f8fbfe] outline-none focus:border-[#0284c7]"
                          />
                        </div>
                        <div>
                          <label className="block text-[0.78rem] font-bold text-slate-700 mb-1">
                            Confirm Password *
                          </label>
                          <input
                            type="password"
                            id="input-confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your password"
                            className="w-full p-2.5 text-xs border-[1.5px] border-[#bae6fd] rounded-lg bg-[#f8fbfe] outline-none focus:border-[#0284c7]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2.5 pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="flex-1 p-3 rounded-lg font-bold text-xs border-[1.5px] border-[#bae6fd] text-[#0369a1] bg-white hover:bg-[#f0f9ff] transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleStep3Submit}
                        className="flex-[2] p-3 rounded-lg font-bold text-xs bg-[#0369a1] hover:bg-[#0284c7] text-white transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-[#0369a1]/20"
                      >
                        <span>Complete Registration ✓</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
