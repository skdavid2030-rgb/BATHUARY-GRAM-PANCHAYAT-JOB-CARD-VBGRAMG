import React, { useState, useMemo, useEffect } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  FileCheck,
  Building2,
  SlidersHorizontal,
  CheckCircle2,
  Clock,
  UserX,
  Users,
  Loader2
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { BeneficiaryRow } from '../types';
import { VILLAGES_LIST, SANSAD_LIST } from '../data/bankMaster';
import { NationalEmblemLogo, VbGramGActLogo } from './Emblems';
import { formatKycDate } from '../utils/dateFormatter';

interface VillagePdfReportProps {
  beneficiaries: BeneficiaryRow[];
  initialCategoryFilter?: 'ALL' | 'TOTAL' | 'DONE' | 'PENDING' | 'DEATH' | 'UNIQUE_CARDS' | null;
  initialSansadFilter?: string;
  onPrintSlip: (row: BeneficiaryRow) => void;
  onPrintA5Slip: (row: BeneficiaryRow) => void;
  language?: 'bn' | 'en';
}

export const VillagePdfReport: React.FC<VillagePdfReportProps> = ({
  beneficiaries,
  initialCategoryFilter,
  initialSansadFilter,
  onPrintSlip,
  onPrintA5Slip
}) => {
  const [selectedVillage, setSelectedVillage] = useState<string>('');
  const [selectedSansad, setSelectedSansad] = useState<string>(initialSansadFilter || '');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'TOTAL' | 'DONE' | 'PENDING' | 'DEATH' | 'UNIQUE_CARDS'>(
    initialCategoryFilter || 'ALL'
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);
  const [printScope, setPrintScope] = useState<'PAGE' | 'ALL'>('PAGE');
  const [printOrientation, setPrintOrientation] = useState<'PORTRAIT' | 'LANDSCAPE'>('LANDSCAPE');
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [isPreparingPrint, setIsPreparingPrint] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforePrint = () => setIsPrinting(true);
    const handleAfterPrint = () => {
      setIsPrinting(false);
      setIsPreparingPrint(false);
    };

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

  // Fast memoized filtering for thousands of rows
  const filteredRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    let rows = beneficiaries.filter(row => {
      // Village filter
      if (selectedVillage && row.colV !== selectedVillage) {
        return false;
      }

      // Sansad filter (e.g. BATHUARY 1 to BATHUARY 16)
      if (selectedSansad && (row.colB || '').toUpperCase() !== selectedSansad.toUpperCase()) {
        return false;
      }

      // Category filter
      const kyc = (row.colR || '').toUpperCase();
      const err = (row.colT || '').toLowerCase();

      if (selectedCategory === 'DONE') {
        if (kyc !== 'YES' && kyc !== 'Y') return false;
      } else if (selectedCategory === 'DEATH') {
        if (!err.includes('death') && !err.includes('expired') && !err.includes('died')) return false;
      } else if (selectedCategory === 'PENDING') {
        if (kyc === 'YES' || kyc === 'Y' || err.includes('death') || err.includes('expired') || err.includes('died')) {
          return false;
        }
      }

      // Text search inside filtered view
      if (term) {
        const jc = (row.colH || '').toLowerCase();
        const name = (row.colJ || '').toLowerCase();
        const aadh = (row.colP || '').toLowerCase();
        const hoh = (row.colAG || '').toLowerCase();
        const foh = (row.colAF || '').toLowerCase();
        const vill = (row.colV || '').toLowerCase();
        if (!jc.includes(term) && !name.includes(term) && !aadh.includes(term) && !hoh.includes(term) && !foh.includes(term) && !vill.includes(term)) {
          return false;
        }
      }

      return true;
    });

    if (selectedCategory === 'UNIQUE_CARDS') {
      const seen = new Set<string>();
      rows = rows.filter(r => {
        const jc = (r.colH || '').trim();
        if (!jc || seen.has(jc)) return false;
        seen.add(jc);
        return true;
      });
    }

    return rows;
  }, [beneficiaries, selectedVillage, selectedSansad, selectedCategory, searchTerm]);

  // Total pages
  const totalPages = pageSize === -1 ? 1 : Math.ceil(filteredRows.length / pageSize) || 1;

  // Paginated slice for screen rendering
  const paginatedRows = useMemo(() => {
    if (pageSize === -1) return filteredRows;
    const start = (currentPage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, currentPage, pageSize]);

  // Rows to print: If printScope === 'ALL', prints all filtered rows; if 'PAGE', prints current paginated slice
  const rowsToPrint = printScope === 'ALL' ? filteredRows : paginatedRows;

  // Reset page when filters change
  const handleFilterChange = (setter: () => void) => {
    setter();
    setCurrentPage(1);
  };

  const handlePrint = () => {
    setIsPreparingPrint(true);
    setIsPrinting(true);

    // Give browser 50ms to mount print DOM before triggering window.print()
    setTimeout(() => {
      const originalTitle = document.title;
      const orientationStyle = document.createElement('style');
      orientationStyle.id = 'print-orientation-override';
      orientationStyle.innerHTML = `@page { size: A4 ${printOrientation.toLowerCase()}; margin: 8mm 8mm 10mm 8mm; }`;
      document.head.appendChild(orientationStyle);

      try {
        document.title = `Bathuary_GP_Report_${selectedSansad || selectedVillage || 'All'}_${selectedCategory}`;
        window.print();
      } catch (err) {
        console.warn('Print blocked or unavailable:', err);
      } finally {
        setTimeout(() => {
          document.title = originalTitle;
          const el = document.getElementById('print-orientation-override');
          if (el) el.remove();
          setIsPrinting(false);
          setIsPreparingPrint(false);
        }, 800);
      }
    }, 60);
  };

  const handleExportExcel = () => {
    const data = filteredRows.map((r, i) => ({
      "SL No": i + 1,
      "Sansad": r.colB,
      "Job Card Number": r.colH,
      "Applicant Name": r.colJ,
      "Gender": r.colK,
      "Head of Household": r.colAG,
      "Father/Husband Name of HH": r.colAF,
      "Village": r.colV,
      "Aadhaar Number": r.colP,
      "Mobile Number": r.colQ,
      "e-KYC Done": r.colR,
      "e-KYC Date": r.colS,
      "Error / Death": r.colT,
      "Bank Name": r.colAO,
      "IFSC Code": r.colAP,
      "Account No": r.colAR
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Job_Card_Report");
    XLSX.writeFile(wb, `Bathuary_GP_Report_${selectedSansad || selectedVillage || 'ALL'}.xlsx`);
  };

  const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  // Quick category statistics for the currently filtered set
  const stats = useMemo(() => {
    let done = 0;
    let pending = 0;
    let death = 0;
    filteredRows.forEach(r => {
      const kyc = (r.colR || '').toUpperCase();
      const err = (r.colT || '').toLowerCase();
      if (err.includes('death') || err.includes('expired') || err.includes('died')) {
        death++;
      } else if (kyc === 'YES' || kyc === 'Y') {
        done++;
      } else {
        pending++;
      }
    });
    const total = filteredRows.length;
    const rate = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, done, pending, death, rate };
  }, [filteredRows]);

  return (
    <div className="space-y-6">
      {/* Top Filter & Control Card (Hidden when printing) */}
      <div className="rounded-3xl bg-gradient-to-br from-white via-slate-50 to-indigo-50/20 border-2 border-slate-200 p-6 sm:p-7 shadow-sm no-print relative overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 absolute top-0 left-0" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4 mb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  Village & Sansad Analytical Report
                </h3>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-black uppercase tracking-wider">
                  Official Register
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Multi-criteria filter across all 29 villages & 16 Sansads with export-ready A4 PDF and Excel options.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleExportExcel}
              className="px-4 py-2.5 bg-white hover:bg-emerald-50 text-emerald-800 font-black text-xs rounded-xl border-2 border-emerald-300 hover:border-emerald-500 flex items-center gap-2 transition-all cursor-pointer shadow-xs hover:shadow-md hover:-translate-y-0.5"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Export Excel ({filteredRows.length.toLocaleString()})</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              disabled={isPreparingPrint}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-xl shadow-md hover:shadow-lg flex items-center gap-2 transition-all cursor-pointer hover:-translate-y-0.5 disabled:opacity-75"
            >
              {isPreparingPrint ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Printer className="w-4 h-4" />
              )}
              <span>{isPreparingPrint ? 'Preparing PDF...' : 'Print A4 Report'}</span>
            </button>
          </div>
        </div>

        {/* Filter Dropdowns Grid with Dynamic Colorful Borders */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
          {/* Sansad Filter */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <label className="text-xs font-black text-slate-800 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <span>Filter by Sansad:</span>
              </span>
              {selectedSansad && (
                <button
                  type="button"
                  onClick={() => handleFilterChange(() => setSelectedSansad(''))}
                  className="text-[10px] text-rose-600 hover:underline font-bold"
                >
                  Clear
                </button>
              )}
            </label>
            <select
              value={selectedSansad}
              onChange={(e) => handleFilterChange(() => setSelectedSansad(e.target.value))}
              className="w-full bg-slate-50 text-slate-900 text-xs sm:text-sm font-bold rounded-xl px-3 py-2 border-2 border-slate-200 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all cursor-pointer"
            >
              <option value="">-- ALL SANSADS (1-16) --</option>
              {SANSAD_LIST.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Village Filter */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <label className="text-xs font-black text-slate-800 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Filter by Village:</span>
              </span>
              {selectedVillage && (
                <button
                  type="button"
                  onClick={() => handleFilterChange(() => setSelectedVillage(''))}
                  className="text-[10px] text-rose-600 hover:underline font-bold"
                >
                  Clear
                </button>
              )}
            </label>
            <select
              value={selectedVillage}
              onChange={(e) => handleFilterChange(() => setSelectedVillage(e.target.value))}
              className="w-full bg-slate-50 text-slate-900 text-xs sm:text-sm font-bold rounded-xl px-3 py-2 border-2 border-slate-200 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all cursor-pointer"
            >
              <option value="">-- ALL 29 VILLAGES --</option>
              <option value="No Village Name">⚠️ No Village Name (Unassigned)</option>
              {VILLAGES_LIST.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <label className="text-xs font-black text-slate-800 mb-1.5 block">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Filter by Status:</span>
              </span>
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => handleFilterChange(() => setSelectedCategory(e.target.value as any))}
              className="w-full bg-slate-50 text-slate-900 text-xs sm:text-sm font-bold rounded-xl px-3 py-2 border-2 border-slate-200 focus:border-amber-500 focus:bg-white focus:outline-none transition-all cursor-pointer"
            >
              <option value="ALL">All Records ({beneficiaries.length})</option>
              <option value="UNIQUE_CARDS">💳 Total Job Card (Unique Cards)</option>
              <option value="TOTAL">👥 Total Job Card Workers</option>
              <option value="DONE">✓ e-KYC Completed</option>
              <option value="PENDING">⏳ e-KYC Pending</option>
              <option value="DEATH">✕ Expired / Deceased</option>
            </select>
          </div>

          {/* Search Filter */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <label className="text-xs font-black text-slate-800 mb-1.5 block">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Search Inside Results:</span>
              </span>
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Job Card, Name, Aadhaar..."
                value={searchTerm}
                onChange={(e) => handleFilterChange(() => setSearchTerm(e.target.value))}
                className="w-full bg-slate-50 text-slate-900 text-xs sm:text-sm font-bold rounded-xl pl-9 pr-3 py-2 border-2 border-slate-200 focus:border-blue-500 focus:bg-white focus:outline-none transition-all shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Mini-Metrics Bar for the Active Filtered Slice */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-4">
          <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center shadow-2xs">
            <span className="text-[10px] font-bold text-slate-500 block uppercase">Total Selected</span>
            <span className="text-base sm:text-lg font-black text-slate-900">{stats.total.toLocaleString()}</span>
          </div>
          <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200 text-center shadow-2xs">
            <span className="text-[10px] font-bold text-emerald-700 block uppercase">e-KYC Done</span>
            <span className="text-base sm:text-lg font-black text-emerald-800">✓ {stats.done.toLocaleString()}</span>
          </div>
          <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200 text-center shadow-2xs">
            <span className="text-[10px] font-bold text-amber-700 block uppercase">e-KYC Pending</span>
            <span className="text-base sm:text-lg font-black text-amber-800">⏳ {stats.pending.toLocaleString()}</span>
          </div>
          <div className="bg-rose-50/70 p-2.5 rounded-xl border border-rose-200 text-center shadow-2xs">
            <span className="text-[10px] font-bold text-rose-700 block uppercase">Deceased / Death</span>
            <span className="text-base sm:text-lg font-black text-rose-800">✕ {stats.death.toLocaleString()}</span>
          </div>
          <div className="col-span-2 sm:col-span-1 bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-200 text-center shadow-2xs flex flex-col justify-center">
            <span className="text-[10px] font-bold text-indigo-700 block uppercase">Completion Rate</span>
            <div className="flex items-center justify-center gap-1.5 mt-0.5">
              <span className="text-base sm:text-lg font-black text-indigo-900">{stats.rate}%</span>
              <div className="w-12 bg-indigo-200 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${stats.rate}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* A4 Print Setup Preferences Bar */}
        <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
            <span className="font-black text-slate-900">A4 Print Setup:</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Orientation */}
            <div className="flex items-center gap-2">
              <span className="text-slate-600 font-bold">Orientation:</span>
              <div className="inline-flex rounded-lg p-0.5 bg-slate-100 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setPrintOrientation('LANDSCAPE')}
                  className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                    printOrientation === 'LANDSCAPE' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Landscape (Recommended)
                </button>
                <button
                  type="button"
                  onClick={() => setPrintOrientation('PORTRAIT')}
                  className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                    printOrientation === 'PORTRAIT' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Portrait
                </button>
              </div>
            </div>

            {/* Print Scope */}
            <div className="flex items-center gap-2">
              <span className="text-slate-600 font-bold">Print Scope:</span>
              <div className="inline-flex rounded-lg p-0.5 bg-slate-100 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setPrintScope('ALL')}
                  className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                    printScope === 'ALL' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Filtered ({filteredRows.length.toLocaleString()})
                </button>
                <button
                  type="button"
                  onClick={() => setPrintScope('PAGE')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                    printScope === 'PAGE' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Current Page Only ({paginatedRows.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Printable Report Container (A4 Optimized) */}
      <div id="printableVillageReport" className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col print:border-none print:shadow-none print:rounded-none">
        
        {/* OFFICIAL A4 PRINT HEADER (Visible only in Print) - 100% Center Aligned as Requested */}
        <div className="hidden print:block mb-4 pb-3 border-b-2 border-slate-900">
          <div className="flex items-center justify-between">
            {/* Left Insignia: State Emblem */}
            <div className="w-16 flex justify-start">
              <NationalEmblemLogo className="w-9 h-12 text-slate-950" />
            </div>

            {/* Center Aligned Official Government Header */}
            <div className="text-center flex-1 px-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-950 leading-tight">
                Govt. of West Bengal
              </h4>
              <p className="text-[11px] font-extrabold text-emerald-900 uppercase tracking-wide leading-tight mt-0.5">
                Panchayats & Rural Development
              </p>
              <h2 className="text-base font-black text-slate-950 uppercase tracking-tight leading-snug mt-0.5">
                BATHUARY GRAM PANCHAYAT
              </h2>
              <p className="text-[11px] font-bold text-slate-700 tracking-wide mt-0.5">
                Egra-II Development Block • Purba Medinipur
              </p>
              <div className="inline-block mt-1 px-3 py-0.5 bg-slate-950 text-white font-black text-[10px] uppercase tracking-wider rounded">
                Official Citizen Verification & e-KYC Register
              </div>
            </div>

            {/* Right Insignia: VB-GRAM G Act */}
            <div className="w-16 flex justify-end">
              <VbGramGActLogo className="w-14 h-10" />
            </div>
          </div>

          {/* Filter Metadata Sub-Banner */}
          <div className="mt-2 pt-1.5 border-t border-slate-300 flex items-center justify-between text-[9px] font-bold text-slate-800 uppercase">
            <span>Sansad: {selectedSansad || 'ALL 16 SANSADS'}</span>
            <span>Village: {selectedVillage || 'ALL 29 VILLAGES'}</span>
            <span>Status: {selectedCategory}</span>
            <span>Date: {todayStr}</span>
            <span>Total Records: {rowsToPrint.length}</span>
          </div>
        </div>

        {/* Screen Table Controls & Pagination Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/80 no-print">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <h4 className="font-black text-slate-900 text-xs sm:text-sm">
              Live Beneficiary Register
              <span className="text-xs font-normal text-slate-500 ml-2">
                (Showing {paginatedRows.length} of {filteredRows.length.toLocaleString()} matching records)
              </span>
            </h4>
          </div>

          {/* Rows Per Page & Pagination Nav */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
              <span>Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 cursor-pointer"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
                <option value={-1}>All ({filteredRows.length})</option>
              </select>
            </div>

            {pageSize !== -1 && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-black text-slate-800 px-2">
                  {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="p-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Master Table - Perfectly Sized for Screen & Print */}
        <div className="overflow-x-auto print:overflow-visible">
          <table className="w-full text-left border-collapse print:text-black">
            <thead className="bg-slate-900 text-white sticky top-0 z-10 font-sans print:bg-slate-100 print:text-black print:table-header-group">
              {selectedCategory === 'UNIQUE_CARDS' ? (
                <tr className="print:border-b-2 print:border-slate-900">
                  <th className="p-2.5 sm:p-3 text-[10px] font-black uppercase tracking-wider border-r border-slate-800 w-12 text-center print:border-slate-800 print:text-[8pt] print:p-1.5">Sl No</th>
                  <th className="p-2.5 sm:p-3 text-[10px] font-black uppercase tracking-wider border-r border-slate-800 w-28 print:border-slate-800 print:text-[8pt] print:p-1.5">Sansad Name & No</th>
                  <th className="p-2.5 sm:p-3 text-[10px] font-black uppercase tracking-wider border-r border-slate-800 w-44 print:border-slate-800 print:text-[8pt] print:p-1.5">Job Card Number</th>
                  <th className="p-2.5 sm:p-3 text-[10px] font-black uppercase tracking-wider border-r border-slate-800 print:border-slate-800 print:text-[8pt] print:p-1.5">Head Of House Hold</th>
                  <th className="p-2.5 sm:p-3 text-[10px] font-black uppercase tracking-wider border-r border-slate-800 print:border-slate-800 print:text-[8pt] print:p-1.5">Father&apos;s/Husband&apos;s Name of HH</th>
                  <th className="p-2.5 sm:p-3 text-[10px] font-black uppercase tracking-wider border-r border-slate-800 w-36 print:border-slate-800 print:text-[8pt] print:p-1.5">Village Name</th>
                  <th className="p-2.5 sm:p-3 text-[10px] font-black uppercase tracking-wider text-center no-print w-32">Action</th>
                </tr>
              ) : (
                <tr className="print:border-b-2 print:border-slate-900">
                  <th className="p-2.5 sm:p-3 text-[10px] font-black uppercase tracking-wider border-r border-slate-800 w-10 text-center print:border-slate-800 print:text-[8pt] print:p-1.5">Sl</th>
                  <th className="p-2.5 sm:p-3 text-[10px] font-black uppercase tracking-wider border-r border-slate-800 w-24 print:border-slate-800 print:text-[8pt] print:p-1.5">Sansad</th>
                  <th className="p-2.5 sm:p-3 text-[10px] font-black uppercase tracking-wider border-r border-slate-800 w-44 print:border-slate-800 print:text-[8pt] print:p-1.5">Job Card No</th>
                  <th className="p-2.5 sm:p-3 text-[10px] font-black uppercase tracking-wider border-r border-slate-800 print:border-slate-800 print:text-[8pt] print:p-1.5">Applicant Name</th>
                  <th className="p-2.5 sm:p-3 text-[10px] font-black uppercase tracking-wider border-r border-slate-800 print:border-slate-800 print:text-[8pt] print:p-1.5">Head of Household</th>
                  <th className="p-2.5 sm:p-3 text-[10px] font-black uppercase tracking-wider border-r border-slate-800 w-32 print:border-slate-800 print:text-[8pt] print:p-1.5">Village</th>
                  <th className="p-2.5 sm:p-3 text-[10px] font-black uppercase tracking-wider border-r border-slate-800 w-28 print:border-slate-800 print:text-[8pt] print:p-1.5">Aadhaar</th>
                  <th className="p-2.5 sm:p-3 text-[10px] font-black uppercase tracking-wider border-r border-slate-800 text-center w-24 print:border-slate-800 print:text-[8pt] print:p-1.5">e-KYC</th>
                  <th className="p-2.5 sm:p-3 text-[10px] font-black uppercase tracking-wider text-center no-print w-36">Action</th>
                </tr>
              )}
            </thead>
            {/* SCREEN VIEW TBODY: Always renders paginatedRows for instant, ultra-fast tab switching */}
            <tbody className="divide-y divide-slate-200 text-xs print:hidden">
              {paginatedRows.map((row, idx) => {
                const absoluteIndex = pageSize === -1 ? idx + 1 : (currentPage - 1) * pageSize + idx + 1;
                const isDone = (row.colR || '').toUpperCase() === 'YES' || (row.colR || '').toUpperCase() === 'Y';
                const isDead = (row.colT || '').toLowerCase().includes('death') || (row.colT || '').toLowerCase().includes('expired');

                if (selectedCategory === 'UNIQUE_CARDS') {
                  return (
                    <tr key={`${row.colH}-${idx}`} className="hover:bg-purple-50/60 bg-white transition-colors">
                      <td className="p-2.5 sm:p-3 text-center font-bold text-slate-600 border-r border-slate-200">{absoluteIndex}</td>
                      <td className="p-2.5 sm:p-3 font-black text-slate-900 border-r border-slate-200 whitespace-nowrap">{row.colB || '—'}</td>
                      <td className="p-2.5 sm:p-3 font-mono font-black text-purple-700 border-r border-slate-200 whitespace-nowrap">{row.colH}</td>
                      <td className="p-2.5 sm:p-3 font-black text-slate-950 uppercase border-r border-slate-200">{row.colAG || '—'}</td>
                      <td className="p-2.5 sm:p-3 text-slate-700 uppercase font-medium border-r border-slate-200">{row.colAF || '—'}</td>
                      <td className="p-2.5 sm:p-3 text-slate-800 font-bold border-r border-slate-200 whitespace-nowrap">{row.colV || '—'}</td>
                      <td className="p-2.5 sm:p-3 text-center">
                        <button
                          type="button"
                          onClick={() => onPrintA5Slip(row)}
                          className="px-3 py-1.5 rounded-xl btn-3d-jobcard text-white font-black text-[11px] flex items-center justify-center gap-1 mx-auto cursor-pointer shadow-xs hover:shadow-md transition-all whitespace-nowrap"
                          title="Official Job Card Print"
                        >
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>Job Card</span>
                        </button>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr 
                    key={`${row.colH}-${row.colJ}-${idx}`} 
                    className={`${
                      isDone 
                        ? 'hover:bg-emerald-50/50 bg-white' 
                        : isDead 
                          ? 'hover:bg-rose-50/50 bg-rose-50/20' 
                          : 'hover:bg-amber-50/50 bg-amber-50/10'
                    } transition-colors`}
                  >
                    <td className="p-2.5 sm:p-3 text-center font-bold text-slate-600 border-r border-slate-200">{absoluteIndex}</td>
                    <td className="p-2.5 sm:p-3 font-black text-slate-900 border-r border-slate-200 whitespace-nowrap">{row.colB}</td>
                    <td className="p-2.5 sm:p-3 font-mono font-black text-blue-900 border-r border-slate-200 whitespace-nowrap">{row.colH}</td>
                    <td className="p-2.5 sm:p-3 font-black text-slate-950 uppercase border-r border-slate-200">{row.colJ}</td>
                    <td className="p-2.5 sm:p-3 text-slate-700 uppercase font-medium border-r border-slate-200">{row.colAG || "—"}</td>
                    <td className="p-2.5 sm:p-3 text-slate-800 font-bold border-r border-slate-200 whitespace-nowrap">{row.colV}</td>
                    <td className="p-2.5 sm:p-3 font-mono text-slate-700 font-bold border-r border-slate-200 whitespace-nowrap">
                      {row.colP ? `•••• ${row.colP.slice(-4)}` : "—"}
                    </td>
                    <td className="p-2.5 sm:p-3 text-center border-r border-slate-200 whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase shadow-2xs ${
                        isDone 
                          ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                          : isDead 
                            ? 'bg-rose-100 text-rose-950 border border-rose-300'
                            : 'bg-amber-100 text-amber-950 border border-amber-300'
                      }`}>
                        {isDone ? "✓ Done" : isDead ? "Expired" : "Pending"}
                      </span>
                    </td>
                    <td className="p-2.5 sm:p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onPrintSlip(row)}
                          className="px-2.5 py-1.5 rounded-xl btn-3d-slip text-white font-black text-[10px] flex items-center justify-center gap-1 cursor-pointer shadow-xs hover:shadow-md transition-all whitespace-nowrap"
                          title="Print Citizen Acknowledgement Slip"
                        >
                          <Printer className="w-3 h-3" />
                          <span>Print Slip</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onPrintA5Slip(row)}
                          className="px-3 py-1.5 rounded-xl btn-3d-jobcard text-white font-black text-[11px] flex items-center justify-center gap-1 cursor-pointer shadow-xs hover:shadow-md transition-all whitespace-nowrap"
                          title="Official Job Card Print (A5 Verification Certificate)"
                        >
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>Job Card</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan={selectedCategory === 'UNIQUE_CARDS' ? 7 : 9} className="p-10 text-center text-slate-500 font-semibold">
                    No beneficiary records found matching the selected filters.
                  </td>
                </tr>
              )}
            </tbody>

            {/* PRINT VIEW TBODY: Only mounted when user triggers print to guarantee instant tab switching */}
            {isPrinting && (
              <tbody className="hidden print:table-row-group divide-y divide-slate-400 text-[8pt] print:text-black">
                {rowsToPrint.map((row, idx) => {
                  const absoluteIndex = printScope === 'ALL' ? idx + 1 : ((currentPage - 1) * pageSize + idx + 1);
                  const isDone = (row.colR || '').toUpperCase() === 'YES' || (row.colR || '').toUpperCase() === 'Y';
                  const isDead = (row.colT || '').toLowerCase().includes('death') || (row.colT || '').toLowerCase().includes('expired');

                  if (selectedCategory === 'UNIQUE_CARDS') {
                    return (
                      <tr key={`print-uc-${row.colH}-${idx}`} className="print:bg-transparent print:break-inside-avoid">
                        <td className="p-1.5 text-center font-bold text-black border-r border-slate-300">{absoluteIndex}</td>
                        <td className="p-1.5 font-bold text-black border-r border-slate-300 whitespace-nowrap">{row.colB}</td>
                        <td className="p-1.5 font-mono font-bold text-black border-r border-slate-300 whitespace-nowrap">{row.colH}</td>
                        <td className="p-1.5 font-bold text-black uppercase border-r border-slate-300">{row.colAG || '—'}</td>
                        <td className="p-1.5 text-black uppercase border-r border-slate-300">{row.colAF || '—'}</td>
                        <td className="p-1.5 text-black font-bold border-r border-slate-300 whitespace-nowrap">{row.colV}</td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={`print-${row.colH}-${idx}`} className="print:bg-transparent print:break-inside-avoid">
                      <td className="p-1.5 text-center font-bold text-black border-r border-slate-300">{absoluteIndex}</td>
                      <td className="p-1.5 font-bold text-black border-r border-slate-300 whitespace-nowrap">{row.colB}</td>
                      <td className="p-1.5 font-mono font-bold text-black border-r border-slate-300 whitespace-nowrap">{row.colH}</td>
                      <td className="p-1.5 font-bold text-black uppercase border-r border-slate-300">{row.colJ}</td>
                      <td className="p-1.5 text-black uppercase border-r border-slate-300">{row.colAG || "—"}</td>
                      <td className="p-1.5 text-black font-bold border-r border-slate-300 whitespace-nowrap">{row.colV}</td>
                      <td className="p-1.5 font-mono text-black border-r border-slate-300 whitespace-nowrap">
                        {row.colP ? `•••• ${row.colP.slice(-4)}` : "—"}
                      </td>
                      <td className="p-1.5 text-center border-r border-slate-300 whitespace-nowrap">
                        <span className="inline-block px-1.5 py-0.5 border border-black font-bold uppercase text-[7pt]">
                          {isDone ? "Done" : isDead ? "Expired" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            )}
          </table>
        </div>

        {/* OFFICIAL A4 PRINT FOOTER: Signature Block for Pradhan, GRS, and VLE */}
        <div className="hidden print:block mt-6 pt-4 border-t-2 border-slate-900 report-sign-block">
          <div className="grid grid-cols-3 gap-6 text-center text-[10px]">
            <div className="border-t border-slate-400 pt-2">
              <p className="font-bold text-slate-800">Prepared by:</p>
              <p className="text-[9px] text-slate-600 mt-0.5">Computer Assistant / VLE</p>
              <p className="text-[9px] font-semibold text-slate-900 mt-6">Signature with Date</p>
            </div>
            <div className="border-t border-slate-400 pt-2">
              <p className="font-bold text-slate-800">Verified by:</p>
              <p className="text-[9px] text-slate-600 mt-0.5">GRS / Nirman Sahayak</p>
              <p className="text-[9px] font-semibold text-slate-900 mt-6">Signature & Official Stamp</p>
            </div>
            <div className="border-t border-slate-400 pt-2">
              <p className="font-bold text-slate-800">Certified & Approved by:</p>
              <p className="text-[9px] text-slate-600 mt-0.5">Pradhan / Executive Assistant</p>
              <p className="text-[9px] font-semibold text-slate-900 mt-6">Bathuary Gram Panchayat</p>
            </div>
          </div>
          <div className="mt-4 text-center text-[8px] text-slate-500">
            Generated via Bathuary Gram Panchayat e-Governance Portal • VB-GRAM G ACT • Purba Medinipur
          </div>
        </div>

        {/* Bottom Pagination Controls (Screen Only) */}
        {totalPages > 1 && pageSize !== -1 && (
          <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/80 no-print">
            <span className="text-xs text-slate-500">
              Showing page {currentPage} of {totalPages} ({filteredRows.length.toLocaleString()} total beneficiaries)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-xs font-bold hover:bg-slate-100 disabled:opacity-40 cursor-pointer shadow-xs"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-xs font-bold hover:bg-slate-100 disabled:opacity-40 cursor-pointer shadow-xs"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
