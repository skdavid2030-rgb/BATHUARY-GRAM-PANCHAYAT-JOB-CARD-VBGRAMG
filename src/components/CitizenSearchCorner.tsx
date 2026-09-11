import React, { useState } from 'react';
import { Search, IdCard, CheckCircle2, Clock, Printer, FileCheck, MapPin, Building, CreditCard, User, X, Sparkles, AlertCircle } from 'lucide-react';
import { BeneficiaryRow } from '../types';
import { formatKycDate } from '../utils/dateFormatter';

interface CitizenSearchCornerProps {
  beneficiaries: BeneficiaryRow[];
  onPrintSlip: (row: BeneficiaryRow) => void;
  onPrintA5Slip: (row: BeneficiaryRow) => void;
}

export const CitizenSearchCorner: React.FC<CitizenSearchCornerProps> = ({
  beneficiaries,
  onPrintSlip,
  onPrintA5Slip
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const trimmed = searchTerm.trim().toLowerCase();
  const digitsOnly = trimmed.replace(/\D/g, '');
  const searchResults = trimmed
    ? beneficiaries.filter(b => 
        (b.colH && String(b.colH).toLowerCase().includes(trimmed)) ||
        (b.colJ && String(b.colJ).toLowerCase().includes(trimmed)) ||
        (b.colAF && String(b.colAF).toLowerCase().includes(trimmed)) ||
        (b.colAG && String(b.colAG).toLowerCase().includes(trimmed)) ||
        (b.colP && String(b.colP).toLowerCase().includes(trimmed)) ||
        (digitsOnly.length >= 4 && b.colP && b.colP.replace(/\D/g, '').includes(digitsOnly)) ||
        (b.colQ && String(b.colQ).toLowerCase().includes(trimmed)) ||
        (digitsOnly.length >= 5 && b.colQ && b.colQ.replace(/\D/g, '').includes(digitsOnly)) ||
        (b.colV && String(b.colV).toLowerCase().includes(trimmed))
      ).slice(0, 30)
    : [];

  const quickFilterChips = [
    { label: 'e-KYC Done', query: 'YES' },
    { label: 'Pending e-KYC', query: 'NO' },
    { label: 'Bathuary', query: 'BATHUARY' },
    { label: 'Hatbaincha', query: 'HATBAINCHA' },
    { label: 'Deceased/Death', query: 'DEATH' }
  ];

  return (
    <div className="space-y-6">
      {/* Search Hero Box with Vibrant Gradient Accents */}
      <div className="relative rounded-3xl bg-gradient-to-br from-white via-blue-50/20 to-emerald-50/20 border-2 border-slate-200 p-6 sm:p-8 shadow-sm text-center overflow-hidden">
        {/* Decorative background blurs */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-blue-500/15 to-emerald-500/15 border border-blue-300/60 text-blue-800 text-xs font-black shadow-2xs">
            <IdCard className="w-4 h-4 text-blue-600 animate-pulse" />
            <span>Official Citizen Search & Verification Corner</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Check Your Job Card & e-KYC Status
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Search using Job Card Number, Applicant Name, Head of Household, Aadhaar Number, or Village Name.
          </p>

          {/* Search Input Bar */}
          <div className="relative mt-4">
            <input
              type="text"
              placeholder="Type Job Card (e.g. WB-16-003...), Name, Aadhaar or Village..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white text-slate-900 text-sm sm:text-base font-semibold rounded-2xl pl-12 pr-10 py-3.5 border-2 border-slate-300 hover:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 shadow-sm transition-all"
            />
            <Search className="w-5 h-5 text-blue-600 absolute left-4 top-1/2 -translate-y-1/2" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 cursor-pointer transition-colors"
                title="Clear Search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filter Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-[11px] font-bold text-slate-400">Quick Filters:</span>
            {quickFilterChips.map(chip => (
              <button
                key={chip.label}
                onClick={() => setSearchTerm(chip.query)}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-600 hover:text-white border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer hover:-translate-y-0.5"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Section */}
      {trimmed ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-black text-slate-700 px-2">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span>Search Results: {searchResults.length} records found</span>
            </span>
            <span className="text-slate-400 font-medium">Showing top matches</span>
          </div>

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map((row, idx) => {
                const isDone = (row.colR || '').toUpperCase() === 'YES' || (row.colR || '').toUpperCase() === 'Y';
                const isDead = (row.colT || '').toLowerCase().includes('death');

                return (
                  <div
                    key={`${row.colH}-${row.colJ}-${idx}`}
                    className={`rounded-2xl bg-white border-2 ${
                      isDone 
                        ? 'border-emerald-200 hover:border-emerald-500' 
                        : isDead 
                          ? 'border-rose-200 hover:border-rose-500' 
                          : 'border-amber-200 hover:border-amber-500'
                    } p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-200 hover-lift group relative overflow-hidden`}
                  >
                    {/* Top colored accent line */}
                    <div className={`h-1.5 w-full absolute top-0 left-0 ${
                      isDone 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                        : isDead 
                          ? 'bg-gradient-to-r from-rose-500 to-red-600' 
                          : 'bg-gradient-to-r from-amber-400 to-orange-500'
                    }`} />

                    {/* Top Card Bar */}
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                          <Building className="w-3 h-3 text-slate-400" />
                          <span>{row.colF || 'BATHUARY'} GP • {row.colB}</span>
                        </span>
                        <h4 className="text-base sm:text-lg font-black text-slate-900 mt-1 tracking-tight group-hover:text-blue-700 transition-colors">
                          {row.colJ}
                        </h4>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-black flex items-center gap-1.5 shadow-2xs ${
                        isDone 
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : isDead 
                            ? 'bg-rose-100 text-rose-900 border border-rose-300'
                            : 'bg-amber-100 text-amber-950 border border-amber-300'
                      }`}>
                        {isDone ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> : <Clock className="w-3.5 h-3.5 text-amber-700" />}
                        <span>{isDone ? "e-KYC Completed" : isDead ? "Deceased / Inactive" : "e-KYC Pending"}</span>
                      </span>
                    </div>

                    {/* Card Body Details with Col AG, AF, H, B, V, W */}
                    <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block">Job Card Number:</span>
                        <span className="font-mono font-black text-blue-900 truncate block text-xs">{row.colH}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block">Head of Household:</span>
                        <span className="font-bold text-slate-900 truncate block">{row.colAG || row.colJ || "—"}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block">Father/Husband Name:</span>
                        <span className="text-slate-700 font-semibold truncate block">{row.colAF || "—"}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block">Village Name:</span>
                        <span className="font-black text-emerald-800 truncate block flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-600" />
                          <span>{row.colV || "—"}</span>
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block">Sansad Name:</span>
                        <span className="font-bold text-slate-700 truncate block">{row.colB || "—"}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block">Job Card Submitted:</span>
                        <span className="font-black text-emerald-700 truncate block">{row.colW || "Yes"}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block">Book Delivered (Col Y):</span>
                        <span className={`font-black truncate block ${row.colY === 'Yes' ? 'text-emerald-700' : 'text-slate-600'}`}>{row.colY || "—"}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block">ABPS Status:</span>
                        <span className={`font-black text-[11px] ${row.colO === 'Yes' ? 'text-emerald-700' : 'text-slate-500'}`}>
                          {row.colO === 'Yes' ? "Active (Direct DBT)" : "Pending"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block">Aadhaar (Masked):</span>
                        <span className="font-mono font-bold text-slate-700 truncate block">
                          {row.colP ? `•••• •••• ${row.colP.slice(-4)}` : "Not Seeded"}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Action Buttons: Print Slip + Job Card Print (3D & Dynamic) */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-500 font-bold">
                        {isDone ? `Verified: ${formatKycDate(row.colS) || "Done"}` : (row.colT || "e-KYC Pending")}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onPrintSlip(row)}
                          className="px-3.5 py-2 rounded-xl btn-3d-slip text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow-md transition-all"
                          title="Print Citizen Acknowledgement Slip"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Print Slip</span>
                        </button>

                        <button
                          onClick={() => onPrintA5Slip(row)}
                          className="px-4 py-2 rounded-xl btn-3d-jobcard text-white font-black text-xs flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all"
                          title="Official Job Card Print (Family Verification Certificate)"
                        >
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>Job Card Print</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl bg-white border-2 border-dashed border-slate-300 p-10 text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No matching citizen records found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Please check the spelling or try searching with just the 3-digit serial number or last 4 digits of Aadhaar.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Empty State Guide with Colorful Tips */
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-black text-slate-900">How to Search Citizen Records</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200">
              <span className="font-black text-blue-900 block mb-1">1. By Job Card ID</span>
              <p className="text-slate-600">Enter full or partial Job Card code, e.g. <span className="font-mono font-bold text-blue-800">WB-14-012</span> or <span className="font-mono font-bold text-blue-800">003-014</span>.</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200">
              <span className="font-black text-emerald-900 block mb-1">2. By Citizen Name</span>
              <p className="text-slate-600">Type applicant name or household head name, e.g. <span className="font-bold text-emerald-800">MANAS</span> or <span className="font-bold text-emerald-800">PRADHAN</span>.</p>
            </div>
            <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200">
              <span className="font-black text-purple-900 block mb-1">3. By Village Name</span>
              <p className="text-slate-600">Search by any of the 29 canonical villages, e.g. <span className="font-bold text-purple-800">HATBAINCHA</span> or <span className="font-bold text-purple-800">BATHUARY</span>.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
