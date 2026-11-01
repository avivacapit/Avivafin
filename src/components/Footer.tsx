import React from 'react';
import { ShieldCheck, Lock, Building2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#072545] text-white pt-10 pb-7 border-t-4 border-[#38bdf8] text-sm mt-auto">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-slate-700/60 text-xs">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 rounded bg-[#0284c7] flex items-center justify-center font-black text-xs text-white">
                AC
              </div>
              <span className="font-extrabold text-sm tracking-wide">AVIVA CAPITAL FINANCE LTD.</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Non-Banking Financial Company (NBFC) registered with the Reserve Bank of India (RBI). Fast-track institutional credit, personal loans, and business financing solutions.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#38bdf8]" /> Regulatory &amp; Compliance
            </h4>
            <p className="text-slate-300 leading-relaxed">
              RBI Registration No: B-14.02981. All credit underwriting adheres to Fair Practices Code (FPC) and Digital Lending Guidelines.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-[#38bdf8]" /> Data Protection
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Protected by 256-bit SSL encryption. Aadhaar e-KYC documents are securely verified under UIDAI authentication protocols.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>© 2026 Aviva Capital Finance Ltd. All Rights Reserved.</div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Grievance Redressal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
