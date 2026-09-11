import React, { useEffect, useState } from 'react';
import { Printer, X, ShieldCheck, CheckCircle2 } from 'lucide-react';
import QRCode from 'qrcode';
import { BeneficiaryRow } from '../types';
import { NationalEmblemLogo, VbGramGActLogo } from './Emblems';
import { formatKycDate } from '../utils/dateFormatter';

interface PrintSlipModalProps {
  row: BeneficiaryRow;
  onClose: () => void;
  language?: 'bn' | 'en';
}

export const PrintSlipModal: React.FC<PrintSlipModalProps> = ({
  row,
  onClose
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    // Add print isolation class to body while modal is open
    document.body.classList.add('print-slip-modal-active');
    return () => {
      document.body.classList.remove('print-slip-modal-active');
    };
  }, []);

  useEffect(() => {
    // Generate official verification QR Code safely
    try {
      const verifyString = `BATHUARY-GP|JC:${row.colH || ''}|NAME:${row.colJ || ''}|KYC:${row.colR || ''}|DATE:${row.colS || 'N/A'}|VB-GRAM-G-ACT-VIKSIT-BHARAT`;
      if (QRCode && typeof QRCode.toDataURL === 'function') {
        QRCode.toDataURL(verifyString, { width: 140, margin: 1 })
          .then(url => setQrDataUrl(url))
          .catch(() => {});
      }
    } catch (err) {
      console.warn('QR code generation error:', err);
    }
  }, [row]);

  const handlePrint = () => {
    const originalTitle = document.title;
    try {
      document.title = `Bathuary_GP_AckSlip_${row.colH || row.colJ || 'Citizen'}`;
      window.print();
    } catch (err) {
      console.warn('Print blocked or unavailable:', err);
    } finally {
      setTimeout(() => {
        document.title = originalTitle;
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto print-modal-root print-slip-modal-root">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 overflow-hidden print-modal-card">
        {/* Top Actions - Hidden during Print */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 no-print">
          <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
            <Printer className="w-4 h-4 text-emerald-600" />
            <span>Official Acknowledgement Slip</span>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              id="printSlipModalBtn"
              className="px-5 py-2 rounded-xl btn-3d-save text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
            <button
              onClick={onClose}
              id="closeSlipModalBtn"
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* The Printable Slip Paper (A5 / 4x6 Layout) */}
        <div id="printableSlipArea" className="bg-white text-slate-900 p-6 rounded-2xl shadow-xs font-sans text-[12px] border border-slate-200">
          {/* Header Banner with Official Govt Logos (Logo 1 & Logo 2) */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-3">
            <div className="flex items-center p-1 bg-white border border-slate-300 rounded-lg">
              <NationalEmblemLogo className="w-8 h-11 text-slate-900 drop-shadow-xs" />
            </div>
            
            <div className="text-center flex-1 px-3">
              <h4 className="font-black text-xs uppercase tracking-wider text-slate-950 leading-tight">
                Govt. of West Bengal
              </h4>
              <p className="font-extrabold text-[11px] text-emerald-800 uppercase tracking-wide leading-tight mt-0.5">
                Panchayats & Rural Development
              </p>
              <h3 className="font-black text-base uppercase tracking-tight text-slate-900 leading-snug mt-0.5">
                BATHUARY GRAM PANCHAYAT
              </h3>
              <p className="text-[11px] font-bold text-slate-600 mt-0.5">
                Egra-II Development Block • Purba Medinipur
              </p>
              <p className="text-[11px] font-black text-slate-900 underline mt-1.5 tracking-wide">
                Job Card e-KYC Acknowledgement Slip
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-1 bg-white border border-slate-300 rounded-lg">
                <VbGramGActLogo className="w-16 h-10 drop-shadow-xs" />
              </div>
            </div>
          </div>

          {/* Details Table */}
          <table className="w-full border-collapse text-left text-xs my-2">
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="py-1.5 font-bold text-slate-600 w-44">Job Card Number:</td>
                <td className="py-1.5 font-black text-emerald-800 text-[13px]">{row.colH}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-1.5 font-bold text-slate-600">Applicant Name:</td>
                <td className="py-1.5 font-bold text-slate-900 text-[13px]">{row.colJ}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-1.5 font-bold text-slate-600">Father/Husband Name of HH:</td>
                <td className="py-1.5 text-slate-800">{row.colAF || "—"}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-1.5 font-bold text-slate-600">Head of Household:</td>
                <td className="py-1.5 text-slate-800">{row.colAG || "—"}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-1.5 font-bold text-slate-600">Gram Panchayat / Sansad:</td>
                <td className="py-1.5 text-slate-800">{row.colF} / {row.colB}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-1.5 font-bold text-slate-600">Village Name:</td>
                <td className="py-1.5 text-slate-800 font-semibold">{row.colV || "—"}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-1.5 font-bold text-slate-600">Worker Mobile No:</td>
                <td className="py-1.5 font-mono text-slate-900">{row.colQ || "—"}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-1.5 font-bold text-slate-600">Aadhaar ID (Masked):</td>
                <td className="py-1.5 font-mono text-slate-800">
                  {row.colP ? `XXXX-XXXX-${row.colP.slice(-4)}` : "—"}
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-1.5 font-bold text-slate-600">e-KYC Status:</td>
                <td className="py-1.5 font-black text-[13px]">
                  <span className={row.colR === 'Yes' || row.colR === 'Y' ? 'text-emerald-700' : 'text-amber-700'}>
                    {row.colR === 'Yes' || row.colR === 'Y' ? "✓ SUCCESSFULLY DONE" : "PENDING / INCOMPLETE"}
                  </span>
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-1.5 font-bold text-slate-600">Date of e-KYC:</td>
                <td className="py-1.5 font-mono text-slate-800">{formatKycDate(row.colS) || "N/A"}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-1.5 font-bold text-slate-600">e-KYC Done By:</td>
                <td className="py-1.5 text-slate-800">{row.colU || "SK DAVID, VLE"}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-1.5 font-bold text-slate-600">Job Card Book Delivered:</td>
                <td className="py-1.5 text-slate-800 font-bold">{row.colY || "—"}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-1.5 font-bold text-slate-600">Remarks:</td>
                <td className="py-1.5 text-slate-700 italic">{row.colX || row.colT || "None"}</td>
              </tr>
            </tbody>
          </table>

          {/* Footer Signature without Helpline */}
          <div className="mt-8 pt-4 flex items-end justify-between text-[11px]">
            <div className="text-slate-500">
              {qrDataUrl && (
                <div className="mb-2">
                  <img src={qrDataUrl} alt="Verification QR" className="w-14 h-14 object-contain border border-slate-300 p-0.5 bg-white rounded" />
                </div>
              )}
              <p className="font-bold text-slate-700">Generated: {new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
              <p>Official Portal: Bathuary Gram Panchayat, Egra-II Development Block</p>
            </div>
            <div className="text-center">
              <div className="w-44 border-t-2 border-dashed border-slate-900 pt-1 font-bold">
                Authorized Signature
              </div>
              <p className="text-[10px] text-slate-500">Bathuary Gram Panchayat</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
