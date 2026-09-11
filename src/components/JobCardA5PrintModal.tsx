import React, { useEffect, useState } from 'react';
import { Printer, X, FileCheck, Building2, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';
import QRCode from 'qrcode';
import { BeneficiaryRow } from '../types';
import { NationalEmblemLogo, VbGramGActLogo } from './Emblems';
import { formatKycDate } from '../utils/dateFormatter';

interface JobCardA5PrintModalProps {
  row: BeneficiaryRow;
  allBeneficiaries: BeneficiaryRow[];
  onClose: () => void;
}

export const JobCardA5PrintModal: React.FC<JobCardA5PrintModalProps> = ({
  row,
  allBeneficiaries,
  onClose
}) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  // Find all family members under the exact same Job Card Number (Col H)
  const familyMembers = allBeneficiaries.filter(
    b => b.colH && row.colH && b.colH.trim() === row.colH.trim()
  );
  const displayList = familyMembers.length > 0 ? familyMembers : [row];

  useEffect(() => {
    // Add print isolation class to body while modal is open
    document.body.classList.add('print-jobcard-modal-active');
    return () => {
      document.body.classList.remove('print-jobcard-modal-active');
    };
  }, []);

  useEffect(() => {
    // Generate official verification QR Code safely
    try {
      const verifyPayload = `WB-GOVT|BATHUARY-GP|JC:${row.colH || ''}|HOH:${row.colAG || row.colJ || ''}|VILL:${row.colV || ''}|MEMBERS:${displayList.length}|VB-GRAM-G-ACT-VIKSIT-BHARAT`;
      if (QRCode && typeof QRCode.toDataURL === 'function') {
        QRCode.toDataURL(verifyPayload, { width: 130, margin: 1 })
          .then(url => setQrCodeDataUrl(url))
          .catch(() => {});
      }
    } catch (err) {
      console.warn('QR code generation error:', err);
    }
  }, [row, displayList.length]);

  const handlePrint = () => {
    const originalTitle = document.title;
    try {
      document.title = `Bathuary_GP_JobCard_${row.colH || row.colJ || 'Citizen'}`;
      window.print();
    } catch (err) {
      console.warn('Print blocked or unavailable:', err);
    } finally {
      setTimeout(() => {
        document.title = originalTitle;
      }, 1000);
    }
  };

  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-2 sm:p-3 overflow-y-auto print-modal-root print-jobcard-modal-root">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl p-3 sm:p-4 my-auto overflow-hidden print-modal-card">
        
        {/* Modal Top Bar - Hidden during Print */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 no-print">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-xs sm:text-sm">
            <FileCheck className="w-4 h-4 text-sky-600" />
            <span>Job Card Print Preview</span>
            <span className="text-[10px] bg-sky-100 text-sky-800 font-semibold px-2 py-0.5 rounded-full">
              Standard A5 Format
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              id="printJobCardNowBtn"
              className="px-3.5 py-1.5 rounded-xl btn-3d-jobcard text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Job Card Print</span>
            </button>
            <button
              onClick={onClose}
              id="closeA5ModalBtn"
              className="p-1 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Area - Designed mathematically for A5 Portrait (148mm x 210mm) with deep ink contrast */}
        <div 
          id="printableA5SlipArea" 
          className="bg-white text-slate-950 p-3 sm:p-3.5 rounded-xl border-2 border-slate-900 font-sans text-xs shadow-xs"
        >
          {/* Official Govt & GP Header with Logo 1 & Logo 2 */}
          <div className="border-b-2 border-slate-900 pb-1.5 mb-1.5">
            <div className="flex items-center justify-between gap-2">
              {/* Left Insignia: Logo 1 (State Emblem of India) */}
              <div className="p-0.5 bg-white border border-slate-300 rounded shrink-0">
                <NationalEmblemLogo className="w-8 h-11 text-slate-900 drop-shadow-xs" />
              </div>

              {/* Center Title */}
              <div className="text-center flex-1 px-1">
                <div className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-950 leading-tight">
                  Govt. of West Bengal
                </div>
                <div className="text-[10px] font-extrabold text-emerald-900 uppercase tracking-wide leading-tight mt-0.5">
                  Panchayats & Rural Development
                </div>
                <h2 className="font-black text-sm sm:text-base text-slate-950 uppercase tracking-tight leading-snug mt-0.5">
                  BATHUARY GRAM PANCHAYAT
                </h2>
                <h3 className="font-bold text-[9px] text-slate-700 uppercase tracking-wide">
                  Egra-II Development Block • Purba Medinipur
                </h3>
                <div className="inline-block mt-0.5 px-2.5 py-0.5 bg-slate-950 border border-slate-900 rounded font-black text-[10px] uppercase tracking-wider text-white shadow-xs">
                  Job Card Acknowledgement Slip
                </div>
              </div>

              {/* Right: Logo 2 (VB-GRAM G Act) */}
              <div className="flex items-center gap-1 shrink-0">
                <div className="p-0.5 bg-white border border-slate-300 rounded">
                  <VbGramGActLogo className="w-14 h-9 drop-shadow-xs" />
                </div>
              </div>
            </div>
          </div>

          {/* Under Header - Job Card Information Details Box */}
          <div className="bg-slate-50/80 border border-slate-300 rounded p-2 mb-1.5">
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
              
              {/* Row 1: Job Card Number & Head of Household */}
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5">
                <span className="font-bold text-slate-600 whitespace-nowrap min-w-[110px]">
                  Job Card Number:
                </span>
                <span className="font-black text-slate-950 text-xs tracking-wide text-emerald-900">
                  {row.colH || '—'}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5">
                <span className="font-bold text-slate-600 whitespace-nowrap min-w-[110px]">
                  HEAD OF HOUSEHOLD:
                </span>
                <span className="font-black text-slate-900 uppercase">
                  {row.colAG || row.colJ || '—'}
                </span>
              </div>

              {/* Row 2: Father/Husband Name of HH & Sansad Name */}
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5">
                <span className="font-bold text-slate-600 whitespace-nowrap min-w-[110px]">
                  FATHER/HUSBAND NAME OF HH:
                </span>
                <span className="font-semibold text-slate-900 uppercase">
                  {row.colAF || '—'}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5">
                <span className="font-bold text-slate-600 whitespace-nowrap min-w-[110px]">
                  SANSAD NAME:
                </span>
                <span className="font-bold text-slate-900">
                  {row.colB || '—'}
                </span>
              </div>

              {/* Row 3: Village Name & Gram Panchayat */}
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5">
                <span className="font-bold text-slate-600 whitespace-nowrap min-w-[110px]">
                  VILLAGE NAME:
                </span>
                <span className="font-bold text-slate-900 uppercase">
                  {row.colV || '—'}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5">
                <span className="font-bold text-slate-600 whitespace-nowrap min-w-[110px]">
                  GRAM PANCHAYAT:
                </span>
                <span className="font-black text-slate-900 uppercase">
                  BATHUARY
                </span>
              </div>

              {/* Row 4: Job Card Submitted & Book Delivered */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-600 whitespace-nowrap min-w-[110px]">
                  JOB CARD SUBMITTED:
                </span>
                {(() => {
                  const val = (row.colW || 'Yes').trim();
                  const isNo = val.toLowerCase() === 'no' || val === 'না';
                  return (
                    <span
                      className={`inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded border w-fit shrink-0 ${
                        isNo
                          ? 'text-rose-800 bg-rose-50 border-rose-300'
                          : 'text-emerald-800 bg-emerald-50 border-emerald-300'
                      }`}
                    >
                      {isNo ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      )}
                      <span className="whitespace-nowrap">{val || 'Yes'}</span>
                    </span>
                  );
                })()}
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-600 whitespace-nowrap min-w-[110px]">
                  BOOK DELIVERED:
                </span>
                {(() => {
                  const val = (row.colY || '').trim();
                  const isYes = val.toLowerCase() === 'yes' || val === 'হ্যাঁ';
                  return (
                    <span
                      className={`inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded border w-fit shrink-0 ${
                        isYes
                          ? 'text-emerald-800 bg-emerald-50 border-emerald-300'
                          : 'text-slate-600 bg-slate-50 border-slate-300'
                      }`}
                    >
                      {isYes ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 inline-block shrink-0" />
                      )}
                      <span className="whitespace-nowrap">{val || '—'}</span>
                    </span>
                  );
                })()}
              </div>

            </div>
          </div>

          {/* Under Details - Family Members / Applicants Table */}
          <div className="mb-2">
            <div className="flex items-center justify-between mb-1 px-0.5">
              <h5 className="font-bold text-slate-800 text-[10px] uppercase tracking-wider flex items-center gap-1">
                <span>Family Members Registered Under Job Card</span>
                <span className="text-[9px] text-slate-500 font-normal">
                  ({displayList.length} Applicant{displayList.length > 1 ? 's' : ''})
                </span>
              </h5>
              <span className="text-[9px] font-semibold text-slate-500">
                Official Records
              </span>
            </div>

            <div className="overflow-x-auto border-2 border-slate-900 rounded">
              <table className="w-full border-collapse text-left text-[11px]">
                <thead>
                  <tr className="bg-slate-900 border-b-2 border-slate-900 text-white font-black text-[10px]">
                    <th className="py-1 px-2 border-r border-slate-700 w-10 text-center">No</th>
                    <th className="py-1 px-2 border-r border-slate-700">Applicant Name</th>
                    <th className="py-1 px-2 border-r border-slate-700 text-center w-24">ABPS</th>
                    <th className="py-1 px-2 border-r border-slate-700 text-center w-24">e-KYC</th>
                    <th className="py-1 px-2 text-center w-24">e-KYC Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  {displayList.map((member, idx) => {
                    const isKycDone = (member.colR || '').toUpperCase() === 'YES' || (member.colR || '').toUpperCase() === 'Y';
                    const isAbpsDone = (member.colO || '').toUpperCase() === 'YES' || (member.colO || '').toUpperCase() === 'Y';

                    return (
                      <tr key={member.colI || idx} className={idx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'}>
                        {/* Applicant No (Col I) */}
                        <td className="py-1 px-2 border-r border-slate-300 text-center font-bold text-slate-900">
                          {member.colI || idx + 1}
                        </td>

                        {/* Applicant Name (Col J) */}
                        <td className="py-1 px-2 border-r border-slate-300 font-bold text-slate-950 uppercase">
                          <div>{member.colJ || '—'}</div>
                          {member.colK && (
                            <span className="text-[9px] text-slate-500 font-normal">
                              Gender: {member.colK}
                            </span>
                          )}
                        </td>

                        {/* ABPS Status (Col O) */}
                        <td className="py-1 px-2 border-r border-slate-300 text-center">
                          <span className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            isAbpsDone 
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            {member.colO || (isAbpsDone ? 'Yes' : 'Pending')}
                          </span>
                        </td>

                        {/* e-KYC Status (Col R) */}
                        <td className="py-1 px-2 border-r border-slate-300 text-center">
                          <span className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            isKycDone 
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            {isKycDone ? '✓ Completed' : 'Pending'}
                          </span>
                        </td>

                        {/* e-KYC Date (Col S) */}
                        <td className="py-1 px-2 text-center font-mono text-slate-700 text-[10px]">
                          {formatKycDate(member.colS) || (isKycDone ? currentDate : '—')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Under Table - Official Certification Note */}
          <div className="p-1.5 bg-slate-50 border border-slate-200 rounded text-[9px] text-slate-600 leading-tight mb-2">
            <strong>Declaration & Note:</strong> This document certifies that the aforementioned Job Card and Family Members
            are officially registered under Bathuary Gram Panchayat, Egra-II Development Block. The biometric e-KYC verification and ABPS
            statuses are verified through official records.
          </div>

          {/* Bottom Authority Signature & Verification Details */}
          <div className="pt-1.5 border-t-2 border-slate-900">
            <div className="flex items-end justify-between gap-4 pt-3">
              
              {/* Left: QR Code, Date, Place & Reference */}
              <div className="text-left space-y-0.5">
                {qrCodeDataUrl && (
                  <div className="mb-1">
                    <img 
                      src={qrCodeDataUrl} 
                      alt="Verification QR" 
                      className="w-11 h-11 object-contain border border-slate-300 rounded p-0.5 bg-white shadow-2xs"
                    />
                  </div>
                )}
                <p className="text-[11px] font-black text-slate-950">
                  Issue Date: <span className="font-mono font-bold text-slate-900">{new Date().toLocaleDateString('en-GB')}</span>
                </p>
                <p className="text-[10px] font-bold text-slate-700">Office: Bathuary Gram Panchayat, Egra-II Development Block</p>
                <p className="text-[9px] text-slate-500 font-mono">Ref: WB/EGR2/BAT/{row.colA || '001'}</p>
              </div>

              {/* Right: Only Authority Signature without Executive Authority text */}
              <div className="text-center min-w-[180px]">
                <div className="border-b-2 border-slate-900 pb-0.5 mb-1 font-serif italic text-[11px] text-slate-800 tracking-wider">
                  Official Signature & Seal
                </div>
                <p className="font-black text-[11px] uppercase tracking-wide text-slate-950">
                  Authority Signature
                </p>
                <p className="text-[10px] font-bold text-slate-700">
                  Bathuary Gram Panchayat, Egra-II Development Block
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Modal Bottom Footer Controls (Minimal, no scroll needed) */}
        <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-200 no-print">
          <div className="text-[10px] text-slate-500">
            A5 Sheet: 148 × 210 mm (Standard Portrait Print)
          </div>
          <button
            onClick={onClose}
            className="px-3.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
