import React, { useState } from 'react';
import { ClientApplication } from '../types';
import { X, ZoomIn, FileText, Image as ImageIcon } from 'lucide-react';

interface DocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: ClientApplication | null;
}

export const DocumentsModal: React.FC<DocumentsModalProps> = ({
  isOpen,
  onClose,
  application,
}) => {
  const [selectedZoom, setSelectedZoom] = useState<{ title: string; src: string } | null>(
    null
  );

  if (!isOpen || !application) return null;

  const docEntries: { key: keyof typeof application.documents; title: string }[] = [
    { key: 'aadharFront', title: 'Aadhaar Front' },
    { key: 'aadharBack', title: 'Aadhaar Back' },
    { key: 'photo', title: 'Client Photo' },
    { key: 'nomineeAadhar', title: 'Nominee Aadhaar' },
  ];

  return (
    <>
      <div
        id="admin-docs-modal"
        className="fixed inset-0 bg-[#072545]/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-150"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl max-w-[620px] w-full p-6 shadow-[0_16px_40px_rgba(3,105,161,0.2)] border border-[#bae6fd] animate-in zoom-in-95 duration-150 relative max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#e0f2fe]">
            <div>
              <h3
                id="admin-docs-title"
                className="text-base sm:text-lg font-black text-[#0369a1] flex items-center gap-2"
              >
                <FileText className="w-5 h-5 text-[#0284c7]" />
                <span>Uploaded Documents: {application.fullName}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                KYC Dossier for Application #{application.id} ({application.status})
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Grid of 4 documents */}
          <div
            id="admin-docs-content"
            className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 overflow-y-auto p-1"
          >
            {docEntries.map(({ key, title }) => {
              const src = application.documents[key];
              return (
                <div
                  key={key}
                  className="bg-[#f8fbfe] border border-[#bae6fd] rounded-xl p-3 text-center flex flex-col justify-between hover:border-[#0284c7] transition"
                >
                  <div className="flex justify-between items-center mb-2 px-1">
                    <span className="text-xs font-bold text-slate-800">{title}</span>
                    {src ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
                        Uploaded
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        Missing
                      </span>
                    )}
                  </div>

                  {src ? (
                    <div
                      className="relative group cursor-pointer overflow-hidden rounded-lg border border-[#bae6fd] bg-slate-50 flex items-center justify-center min-h-[140px]"
                      onClick={() => setSelectedZoom({ title, src })}
                    >
                      <img
                        src={src}
                        alt={title}
                        className="w-full h-36 object-contain p-1 group-hover:scale-105 transition duration-200"
                      />
                      <div className="absolute inset-0 bg-[#072545]/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition text-white text-xs font-bold gap-1">
                        <ZoomIn className="w-4 h-4" />
                        <span>Click to Enlarge</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 py-10 border border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center gap-1.5 bg-slate-50/50">
                      <ImageIcon className="w-6 h-6 text-slate-300" />
                      <span>Not Uploaded</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer Note */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
            <span>Client verification status: <strong>{application.status}</strong></span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-[#0369a1] text-white hover:bg-[#0284c7] transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Document Zoom Modal */}
      {selectedZoom && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-[60] p-4"
          onClick={() => setSelectedZoom(null)}
        >
          <div
            className="max-w-[700px] w-full bg-white rounded-2xl p-4 shadow-2xl overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
              <h4 className="font-black text-sm text-[#0369a1]">{selectedZoom.title}</h4>
              <button
                onClick={() => setSelectedZoom(null)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto flex items-center justify-center p-2 bg-slate-50 rounded-xl">
              <img
                src={selectedZoom.src}
                alt={selectedZoom.title}
                className="max-w-full max-h-[65vh] object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
