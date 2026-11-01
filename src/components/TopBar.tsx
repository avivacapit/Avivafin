import React from 'react';
import { ShieldCheck, Phone } from 'lucide-react';

export const TopBar: React.FC = () => {
  return (
    <div className="bg-[#e0f2fe] border-b border-[#bae6fd] py-1.5 px-4 text-xs">
      <div className="max-w-[1200px] mx-auto flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2 text-[#0369a1] font-bold">
          <ShieldCheck className="w-4 h-4 text-[#0284c7]" />
          <span>Aviva Capital Finance Ltd. | RBI Registered NBFC Portal</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-semibold text-[#0369a1]">
            <Phone className="w-3.5 h-3.5" />
            <span>Toll Free: 1800-425-9900</span>
          </div>
        </div>
      </div>
    </div>
  );
};
