import React, { useState, useMemo } from 'react';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  UserX, 
  Building, 
  CreditCard, 
  Fingerprint, 
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  Search,
  Sparkles,
  Zap,
  Filter,
  BarChart3,
  Layers,
  ExternalLink,
  X,
  Download,
  Printer
} from 'lucide-react';
import { AnalyticsData, VillageStat, BeneficiaryRow, ReportCategoryFilter } from '../types';

interface DashboardProps {
  analytics: AnalyticsData;
  beneficiaries?: BeneficiaryRow[];
  villageStats: VillageStat[];
  sansadList: string[];
  selectedSansad: string;
  onSansadChange: (sansad: string) => void;
  onSelectCategoryReport: (type: 'TOTAL' | 'DONE' | 'PENDING' | 'DEATH' | 'UNIQUE_CARDS') => void;
  onOpenSyncModal?: () => void;
  language?: 'bn' | 'en';
}

export const DashboardAnalytics: React.FC<DashboardProps> = ({
  analytics,
  beneficiaries = [],
  villageStats,
  sansadList,
  selectedSansad,
  onSansadChange,
  onSelectCategoryReport,
  onOpenSyncModal
}) => {
  const [villageSearch, setVillageSearch] = useState('');
  const [sortBy, setSortBy] = useState<'total' | 'progress' | 'name'>('total');
  const [showUniqueCardsModal, setShowUniqueCardsModal] = useState(false);
  const [modalSearch, setModalSearch] = useState('');

  // Deduplicate unique job cards
  const uniqueJobCardList = useMemo(() => {
    const map = new Map<string, BeneficiaryRow>();
    for (const b of beneficiaries) {
      const jc = (b.colH || '').trim();
      if (jc && !map.has(jc)) {
        map.set(jc, b);
      }
    }
    return Array.from(map.values());
  }, [beneficiaries]);

  const uniqueJobCardCount = analytics.uniqueJobCards ?? uniqueJobCardList.length;

  // Filtered unique cards for the drill-down modal
  const filteredModalCards = useMemo(() => {
    if (!modalSearch.trim()) return uniqueJobCardList;
    const q = modalSearch.toLowerCase().trim();
    return uniqueJobCardList.filter(r => 
      (r.colH && r.colH.toLowerCase().includes(q)) ||
      (r.colAG && r.colAG.toLowerCase().includes(q)) ||
      (r.colAF && r.colAF.toLowerCase().includes(q)) ||
      (r.colV && r.colV.toLowerCase().includes(q)) ||
      (r.colB && r.colB.toLowerCase().includes(q))
    );
  }, [uniqueJobCardList, modalSearch]);

  const filteredVillages = useMemo(() => {
    let list = villageStats.filter(v => 
      v.village.toLowerCase().includes(villageSearch.toLowerCase())
    );

    if (sortBy === 'progress') {
      list = [...list].sort((a, b) => {
        const pctA = a.total ? a.done / a.total : 0;
        const pctB = b.total ? b.done / b.total : 0;
        return pctB - pctA;
      });
    } else if (sortBy === 'name') {
      list = [...list].sort((a, b) => a.village.localeCompare(b.village));
    } else {
      list = [...list].sort((a, b) => b.total - a.total);
    }
    return list;
  }, [villageStats, villageSearch, sortBy]);

  return (
    <div className="space-y-6">

      {/* Top Banner with Sansad Selector */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-900/50 relative overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 absolute top-0 left-0" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black mb-2.5 shadow-xs">
              <Building className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Bathuary Gram Panchayat • Egra-II Development Block • Purba Medinipur</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span>Job Card & e-KYC Analytics Dashboard</span>
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
              </span>
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed font-medium">
              Real-time monitoring of Aadhaar seeding, biometric e-KYC progress, and ABPS payment compliance across all 29 villages and 16 Sansads (BATHUARY 1 to BATHUARY 16).
            </p>
          </div>

          {/* Action Area: Sansad Filter Dropdown (Strictly BATHUARY 1..16) */}
          <div className="flex items-center gap-3 self-start lg:self-auto">
            <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md p-2.5 rounded-2xl border border-white/20 shadow-lg">
              <label className="text-xs font-black text-emerald-300 flex items-center gap-1.5 whitespace-nowrap pl-1">
                <Filter className="w-4 h-4 text-emerald-400" />
                <span>Sansad Filter:</span>
              </label>
              <select
                value={selectedSansad}
                onChange={(e) => onSansadChange(e.target.value)}
                className="bg-slate-900 text-white text-xs sm:text-sm font-black rounded-xl px-3.5 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all cursor-pointer min-w-[190px] shadow-xs"
              >
                <option value="ALL">-- ALL 16 SANSADS --</option>
                {sansadList.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Mini Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10 text-xs">
          <div className="bg-white/5 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Active Sansad</span>
            <span className="text-sm font-black text-emerald-300 font-mono">{selectedSansad}</span>
          </div>
          <div className="bg-white/5 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Completion Rate</span>
            <span className="text-sm font-black text-teal-300 font-mono">{analytics.donePct}% Verified</span>
          </div>
          <div className="bg-white/5 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Villages Count</span>
            <span className="text-sm font-black text-indigo-300 font-mono">29 Mouzas</span>
          </div>
          <div className="bg-white/5 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Beneficiaries</span>
            <span className="text-sm font-black text-amber-300 font-mono">{analytics.total} Records</span>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid (5 High-Contrast Vivid Badges: Total Job Card, Total Job Card Workers, e-KYC Completed, Pending e-KYC, Deceased / Inactive) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* 1. Total Job Card (Unique Job Cards with Drill-down) */}
        <div 
          onClick={() => onSelectCategoryReport('UNIQUE_CARDS')}
          className="rounded-3xl bg-gradient-to-br from-white via-purple-50/40 to-indigo-50/60 border-2 border-purple-200 hover:border-purple-500 p-4 sm:p-5 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-400/10 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-purple-950 uppercase tracking-wider">Total Job Card</span>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-500/30 group-hover:rotate-6 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3.5 flex items-baseline justify-between">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight font-mono">{uniqueJobCardCount}</h3>
            <span className="text-[10px] sm:text-xs font-black text-purple-800 bg-purple-100/90 px-2.5 py-1 rounded-full border border-purple-300 flex items-center gap-1 group-hover:bg-purple-600 group-hover:text-white transition-colors shadow-2xs">
              Unique <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
          <p className="text-[10.5px] text-slate-600 mt-1.5 font-semibold">Total unique household cards</p>
          <div className="w-full bg-purple-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 h-full rounded-full w-full" />
          </div>
          <div className="mt-2.5 pt-2 border-t border-purple-100/80 flex items-center justify-between text-[10px] text-purple-700 font-bold">
            <span 
              onClick={(e) => {
                e.stopPropagation();
                setShowUniqueCardsModal(true);
              }}
              className="hover:underline flex items-center gap-1 hover:text-purple-900"
            >
              <Search className="w-3 h-3" /> Quick View
            </span>
            <span className="text-slate-400 font-mono font-medium">Col H unique</span>
          </div>
        </div>

        {/* 2. Total Job Card Workers (Renamed from Total Job Cards) */}
        <div 
          onClick={() => onSelectCategoryReport('TOTAL')}
          className="rounded-3xl bg-gradient-to-br from-white via-blue-50/40 to-indigo-50/60 border-2 border-blue-200 hover:border-blue-500 p-4 sm:p-5 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-400/10 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-blue-950 uppercase tracking-wider">Total Job Card Workers</span>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30 group-hover:rotate-6 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3.5 flex items-baseline justify-between">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight font-mono">{analytics.total}</h3>
            <span className="text-[10px] sm:text-xs font-black text-blue-800 bg-blue-100/90 px-2.5 py-1 rounded-full border border-blue-300 flex items-center gap-1 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-2xs">
              List <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
          <p className="text-[10.5px] text-slate-600 mt-1.5 font-semibold">All worker members in database</p>
          <div className="w-full bg-blue-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full w-full" />
          </div>
          <div className="mt-2.5 pt-2 border-t border-blue-100/80 flex items-center justify-between text-[10px] text-blue-700 font-bold">
            <span>All Members</span>
            <span className="text-slate-400 font-mono font-medium">Col J active</span>
          </div>
        </div>

        {/* 3. e-KYC Done */}
        <div 
          onClick={() => onSelectCategoryReport('DONE')}
          className="rounded-3xl bg-gradient-to-br from-white via-emerald-50/50 to-teal-50/60 border-2 border-emerald-300 hover:border-emerald-600 p-4 sm:p-5 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-400/15 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-emerald-950 uppercase tracking-wider">e-KYC Completed</span>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/30 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3.5 flex items-baseline justify-between">
            <h3 className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight font-mono">{analytics.done}</h3>
            <span className="text-[10px] sm:text-xs font-black text-emerald-950 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-400 shadow-2xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
              {analytics.donePct}%
            </span>
          </div>
          <p className="text-[10.5px] text-slate-600 mt-1.5 font-semibold">Biometric verified by officers</p>
          <div className="w-full bg-emerald-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full transition-all duration-500" style={{ width: `${analytics.donePct}%` }} />
          </div>
          <div className="mt-2.5 pt-2 border-t border-emerald-100/80 flex items-center justify-between text-[10px] text-emerald-800 font-bold">
            <span>Verified</span>
            <span className="text-slate-400 font-mono font-medium">Col R = Yes</span>
          </div>
        </div>

        {/* 4. e-KYC Pending */}
        <div 
          onClick={() => onSelectCategoryReport('PENDING')}
          className="rounded-3xl bg-gradient-to-br from-white via-amber-50/50 to-orange-50/60 border-2 border-amber-300 hover:border-amber-500 p-4 sm:p-5 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/15 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-amber-950 uppercase tracking-wider">Pending e-KYC</span>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/30 group-hover:rotate-12 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3.5 flex items-baseline justify-between">
            <h3 className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight font-mono">{analytics.pending}</h3>
            <span className="text-[10px] sm:text-xs font-black text-amber-950 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-400 shadow-2xs">
              {analytics.pendingPct}%
            </span>
          </div>
          <p className="text-[10.5px] text-slate-600 mt-1.5 font-semibold">Awaiting biometric auth</p>
          <div className="w-full bg-amber-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500" style={{ width: `${analytics.pendingPct}%` }} />
          </div>
          <div className="mt-2.5 pt-2 border-t border-amber-100/80 flex items-center justify-between text-[10px] text-amber-800 font-bold">
            <span>Action required</span>
            <span className="text-slate-400 font-mono font-medium">To be done</span>
          </div>
        </div>

        {/* 5. Deceased / Errors */}
        <div 
          onClick={() => onSelectCategoryReport('DEATH')}
          className="rounded-3xl bg-gradient-to-br from-white via-rose-50/50 to-red-50/60 border-2 border-rose-200 hover:border-rose-500 p-4 sm:p-5 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-400/15 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-rose-950 uppercase tracking-wider">Deceased / Inactive</span>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-rose-600 to-red-600 text-white flex items-center justify-center shadow-md shadow-rose-500/30 group-hover:scale-110 transition-transform">
              <UserX className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3.5 flex items-baseline justify-between">
            <h3 className="text-2xl sm:text-3xl font-black text-rose-950 tracking-tight font-mono">{analytics.death}</h3>
            <span className="text-[10px] sm:text-xs font-black text-rose-950 bg-rose-100 px-2.5 py-1 rounded-full border border-rose-300 shadow-2xs">
              {analytics.deathPct}%
            </span>
          </div>
          <p className="text-[10.5px] text-slate-600 mt-1.5 font-semibold">Deceased / cancelled</p>
          <div className="w-full bg-rose-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-gradient-to-r from-rose-500 to-red-600 h-full rounded-full transition-all duration-500" style={{ width: `${analytics.deathPct}%` }} />
          </div>
          <div className="mt-2.5 pt-2 border-t border-rose-100/80 flex items-center justify-between text-[10px] text-rose-800 font-bold">
            <span>Inactive</span>
            <span className="text-slate-400 font-mono font-medium">Col T flagged</span>
          </div>
        </div>
      </div>

      {/* Secondary Compliance Cards: ABPS & Aadhaar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ABPS Payment Compliance */}
        <div className="rounded-3xl bg-gradient-to-br from-white via-indigo-50/40 to-purple-50/40 border-2 border-indigo-200 hover:border-indigo-400 p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-purple-600 absolute top-0 left-0" />
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-slate-950 text-base">ABPS Payment Enabled (Col O)</h4>
                <p className="text-xs text-slate-600 font-medium">Aadhaar Based Payment System Active for direct bank credit</p>
              </div>
            </div>
            <span className="text-2xl font-black text-indigo-950 font-mono">{analytics.abpsActive}</span>
          </div>
          <div className="mt-5 flex items-center justify-between text-xs">
            <span className="text-slate-700 font-black">ABPS Compliance Rate</span>
            <span className="text-xs font-black text-indigo-950 bg-indigo-100 px-3 py-1 rounded-full border border-indigo-300 shadow-2xs">
              {analytics.total ? Math.round((analytics.abpsActive / analytics.total) * 100) : 0}% Active
            </span>
          </div>
          <div className="w-full bg-indigo-100 h-2.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${analytics.total ? Math.round((analytics.abpsActive / analytics.total) * 100) : 0}%` }}
            />
          </div>
        </div>

        {/* Aadhaar Seeding Compliance */}
        <div className="rounded-3xl bg-gradient-to-br from-white via-sky-50/40 to-cyan-50/40 border-2 border-sky-200 hover:border-sky-400 p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 to-cyan-500 absolute top-0 left-0" />
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-600 to-cyan-600 text-white flex items-center justify-center shadow-md shadow-sky-500/20">
                <Fingerprint className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-slate-950 text-base">Aadhaar Seeded (Col P)</h4>
                <p className="text-xs text-slate-600 font-medium">12-Digit Unique Aadhaar UID Seeded & Verified</p>
              </div>
            </div>
            <span className="text-2xl font-black text-sky-950 font-mono">{analytics.aadhaarSeeded}</span>
          </div>
          <div className="mt-5 flex items-center justify-between text-xs">
            <span className="text-slate-700 font-black">Aadhaar Seeding Rate</span>
            <span className="text-xs font-black text-sky-950 bg-sky-100 px-3 py-1 rounded-full border border-sky-300 shadow-2xs">
              {analytics.total ? Math.round((analytics.aadhaarSeeded / analytics.total) * 100) : 0}% Seeded
            </span>
          </div>
          <div className="w-full bg-sky-100 h-2.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-sky-500 to-cyan-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${analytics.total ? Math.round((analytics.aadhaarSeeded / analytics.total) * 100) : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Village Breakdown Grid (Showing all 29 Villages) */}
      <div className="rounded-3xl bg-white border-2 border-slate-200/80 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Village-wise Progress & Statistics (Col V)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Live breakdown of e-KYC compliance across all 29 Mouzas.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search filter for villages */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search village name..."
                value={villageSearch}
                onChange={(e) => setVillageSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-bold focus:outline-none focus:border-emerald-500 focus:bg-white transition-all w-48 shadow-2xs"
              />
            </div>

            {/* Sort toggle */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setSortBy('total')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${sortBy === 'total' ? 'bg-white text-emerald-800 shadow-2xs font-black' : 'text-slate-600'}`}
              >
                Cards
              </button>
              <button
                type="button"
                onClick={() => setSortBy('progress')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${sortBy === 'progress' ? 'bg-white text-emerald-800 shadow-2xs font-black' : 'text-slate-600'}`}
              >
                Progress %
              </button>
              <button
                type="button"
                onClick={() => setSortBy('name')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${sortBy === 'name' ? 'bg-white text-emerald-800 shadow-2xs font-black' : 'text-slate-600'}`}
              >
                A-Z
              </button>
            </div>

            <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 shadow-2xs">
              {filteredVillages.some(v => v.village === 'No Village Name') 
                ? `${filteredVillages.filter(v => v.village !== 'No Village Name').length} Villages + Unassigned`
                : `${filteredVillages.length} of 29 Villages`}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[550px] overflow-y-auto pr-1">
          {filteredVillages.map(vs => {
            const isNoVillage = vs.village === 'No Village Name';
            const vDonePct = vs.total ? Math.round((vs.done / vs.total) * 100) : 0;
            const isHigh = vDonePct >= 75;
            const isMed = vDonePct >= 40 && vDonePct < 75;

            return (
              <div 
                key={vs.village} 
                className={`p-4 rounded-2xl border-2 transition-all duration-200 relative overflow-hidden group ${
                  isNoVillage 
                    ? 'bg-amber-50/50 border-amber-300 hover:border-amber-500 hover:shadow-lg' 
                    : 'bg-gradient-to-br from-white via-slate-50 to-emerald-50/20 border-slate-200 hover:border-emerald-500 hover:shadow-lg'
                }`}
              >
                <div className={`h-1.5 w-full absolute top-0 left-0 ${
                  isNoVillage 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500' 
                    : isHigh 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                      : isMed 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500' 
                        : 'bg-gradient-to-r from-rose-500 to-red-500'
                }`} />
                <div className="flex items-center justify-between">
                  <div className="truncate max-w-[190px]">
                    <h4 className={`font-black text-xs sm:text-sm truncate uppercase transition-colors ${
                      isNoVillage ? 'text-amber-950 group-hover:text-amber-800' : 'text-slate-900 group-hover:text-emerald-700'
                    }`}>
                      {isNoVillage ? '⚠️ No Village Name' : vs.village}
                    </h4>
                    {isNoVillage && (
                      <span className="text-[9px] font-bold text-amber-700 block">
                        Missing in Sheet (Needs Update)
                      </span>
                    )}
                  </div>
                  <span className={`text-xs font-black px-2.5 py-0.5 rounded-full border shadow-2xs font-mono ${
                    isNoVillage ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-white text-slate-800 border-slate-200'
                  }`}>
                    {vs.total} Cards
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] mt-2.5 font-black">
                  <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Done: {vs.done} ({vDonePct}%)
                  </span>
                  <span className="text-amber-950 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    Pending: {vs.pending}
                  </span>
                  {vs.death > 0 && (
                    <span className="text-rose-950 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                      Inactive: {vs.death}
                    </span>
                  )}
                </div>
                <div className="w-full bg-slate-200/80 h-2 rounded-full mt-3 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${isHigh ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : isMed ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-rose-500 to-red-600'}`}
                    style={{ width: `${vDonePct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick View Drill-down Modal for Total Job Card */}
      {showUniqueCardsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border-2 border-purple-500 shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-slate-900 text-white p-5 flex items-center justify-between border-b border-purple-600">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-purple-200">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black tracking-tight">
                    Total Unique Job Cards ({uniqueJobCardCount})
                  </h3>
                  <p className="text-xs text-purple-200 font-medium">
                    Bathuary Gram Panchayat • Egra-II Development Block • Unique Household Cards
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowUniqueCardsModal(false);
                    onSelectCategoryReport('UNIQUE_CARDS');
                  }}
                  className="px-3.5 py-1.5 bg-white/20 hover:bg-white text-white hover:text-purple-900 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Full Report View</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowUniqueCardsModal(false)}
                  className="p-1.5 rounded-xl hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Search & Stats Filter */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search Job Card, Head of Household, Father/Husband, Village..."
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                  className="w-full bg-white text-slate-900 text-xs sm:text-sm font-bold rounded-xl pl-9 pr-3 py-2 border-2 border-slate-200 focus:border-purple-500 focus:outline-none transition-all"
                />
              </div>
              <div className="flex items-center gap-2 text-xs font-black text-purple-900 bg-purple-100 px-3 py-1.5 rounded-xl border border-purple-200">
                <span>Displaying {filteredModalCards.length} unique cards</span>
              </div>
            </div>

            {/* Table with the 6 requested fields: Sl No, Sansad Name & No, Job Card Number, Head Of House Hold, Father's/Husband's Name of HH, Village Name */}
            <div className="overflow-auto flex-1 p-4">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-900 text-white sticky top-0 z-10 font-sans">
                  <tr>
                    <th className="p-2.5 sm:p-3 text-[10px] font-black uppercase tracking-wider border-r border-slate-800 w-14 text-center">Sl No</th>
                    <th className="p-2.5 sm:p-3 text-[10px] font-black uppercase tracking-wider border-r border-slate-800 w-28">Sansad Name & No</th>
                    <th className="p-2.5 sm:p-3 text-[10px] font-black uppercase tracking-wider border-r border-slate-800 w-44">Job Card Number</th>
                    <th className="p-2.5 sm:p-3 text-[10px] font-black uppercase tracking-wider border-r border-slate-800">Head Of House Hold</th>
                    <th className="p-2.5 sm:p-3 text-[10px] font-black uppercase tracking-wider border-r border-slate-800">Father's/Husband's Name of HH</th>
                    <th className="p-2.5 sm:p-3 text-[10px] font-black uppercase tracking-wider w-36">Village Name</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {filteredModalCards.slice(0, 200).map((row, idx) => (
                    <tr key={`${row.colH}-${idx}`} className="hover:bg-purple-50/60 transition-colors">
                      <td className="p-2.5 sm:p-3 font-mono text-center font-bold text-slate-500">{idx + 1}</td>
                      <td className="p-2.5 sm:p-3 font-bold text-slate-800">{row.colB || '—'}</td>
                      <td className="p-2.5 sm:p-3 font-mono font-black text-purple-700">{row.colH}</td>
                      <td className="p-2.5 sm:p-3 font-black text-slate-900">{row.colAG || '—'}</td>
                      <td className="p-2.5 sm:p-3 font-semibold text-slate-700">{row.colAF || '—'}</td>
                      <td className="p-2.5 sm:p-3 font-bold text-slate-800">{row.colV || '—'}</td>
                    </tr>
                  ))}
                  {filteredModalCards.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500 font-medium">
                        No Job Card matching &quot;{modalSearch}&quot; found in active Sansad.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {filteredModalCards.length > 200 && (
                <div className="p-3 text-center text-xs text-slate-500 font-bold bg-slate-50 border-t border-slate-200 mt-2 rounded-xl">
                  Showing top 200 cards in quick view. Click &quot;Full Report View&quot; above to paginate or print all {filteredModalCards.length} cards.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Official NREGA Job Card Register • Egra-II Development Block
              </span>
              <button
                type="button"
                onClick={() => setShowUniqueCardsModal(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-black text-xs rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
