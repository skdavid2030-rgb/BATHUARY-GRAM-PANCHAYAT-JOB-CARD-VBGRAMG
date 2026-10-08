import React from 'react';
import { 
  Building, 
  Search, 
  UserCheck, 
  FileText, 
  BarChart3, 
  FileSpreadsheet, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  Sparkles,
  Zap,
  CheckCircle
} from 'lucide-react';
import { AnalyticsData, VillageStat } from '../types';
import { NationalEmblemLogo, VbGramGActLogo } from './Emblems';
import { SANSAD_LIST } from '../data/bankMaster';

interface HomeOverviewProps {
  analytics: AnalyticsData;
  villageStats: VillageStat[];
  onNavigateTab: (tab: string, extra?: any) => void;
  onOpenSyncModal: () => void;
  language?: 'bn' | 'en';
}

export const HomeOverview: React.FC<HomeOverviewProps> = ({
  analytics,
  villageStats,
  onNavigateTab,
  onOpenSyncModal,
  language = 'bn'
}) => {
  const isBn = language === 'bn';

  return (
    <div className="space-y-6">
      {/* 0. Dynamic Government Notice Ticker */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800 text-white shadow-xl p-0.5">
        <div className="bg-gradient-to-r from-[#501503] via-[#380E02] to-[#200601] backdrop-blur-md rounded-[14px] px-4 py-2 flex items-center gap-3 border border-amber-600/50">
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 px-2.5 py-1 rounded-lg font-black text-[11px] shrink-0 shadow-sm uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            <span>{isBn ? 'লাইভ নোটিশ' : 'LIVE NOTICE'}</span>
          </div>
          <div className="overflow-hidden whitespace-nowrap text-xs text-amber-100 font-medium flex-1">
            <div className="inline-block animate-pulse">
              📢 <strong className="text-amber-300 font-black">বাথুয়ারী গ্রাম পঞ্চায়েত (এগরা-২ ব্লক)</strong>: ১০০% আধার বায়োমেট্রিক e-KYC ও ABPS ব্যাংক যাচাইকরণ ২৯টি গ্রামে সরাসরি সক্রিয়। অফিসিয়াল পার্মানেন্ট গুগল শিট লিঙ্ক লাইভ।
            </div>
          </div>
          <button 
            onClick={() => onNavigateTab('search')}
            className="shrink-0 text-[11px] font-bold text-amber-200 hover:text-white bg-amber-950/90 hover:bg-orange-950 border border-amber-600/70 px-3 py-1 rounded-lg transition-colors cursor-pointer hidden sm:flex items-center gap-1 shadow-sm"
          >
            <span>{isBn ? 'নাগরিক অনুসন্ধান' : 'Search Citizen'}</span>
            <ArrowRight className="w-3 h-3 text-amber-300" />
          </button>
        </div>
      </div>

      {/* 1. Official Government & Panchayat Hero Banner (Deep Royal Garua Palette) */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#551603] via-[#3D0E02] to-[#240701] text-amber-50 p-6 sm:p-7 shadow-2xl border-2 border-amber-600/80 overflow-hidden">
        {/* Saffron & Amber Animated Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-12 left-1/3 w-64 h-64 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3.5 max-w-3xl">
            {/* Top Official Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/90 text-emerald-300 text-xs font-black border border-emerald-500/60 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span>{isBn ? 'অফিসিয়াল ই-গভর্ন্যান্স পোর্টাল' : 'Official e-Governance Portal'}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/90 text-amber-300 text-xs font-bold border border-amber-600/70 shadow-sm">
                <Building className="w-3.5 h-3.5 text-amber-400" />
                <span>{isBn ? '২৯টি মৌজা গ্রাম • ১৬টি সংসদ' : '29 Villages • 16 Sansads'}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-950/90 text-orange-300 text-xs font-bold border border-orange-600/70 shadow-sm">
                <Award className="w-3.5 h-3.5 text-orange-400" />
                <span>VB-GRAM G ACT • VIKSIT BHARAT</span>
              </span>
            </div>

            {/* Official Headings */}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black tracking-wider uppercase bg-gradient-to-r from-amber-300 via-orange-200 to-amber-400 bg-clip-text text-transparent">
                  {isBn ? 'পশ্চিমবঙ্গ সরকার • পঞ্চায়েত ও গ্রামীণ উন্নয়ন দপ্তর' : 'Govt. of West Bengal • Panchayats & Rural Development'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mt-1 drop-shadow-md">
                {isBn ? 'বাথুয়ারী গ্রাম পঞ্চায়েত' : 'BATHUARY GRAM PANCHAYAT'}
              </h1>
              <p className="text-sm sm:text-base font-bold text-amber-200/90 mt-1 flex flex-wrap items-center gap-2">
                <span>{isBn ? 'এগরা-২ পঞ্চায়েত সমিতি • পূর্ব মেদিনীপুর' : 'Egra-II Development Block • Purba Medinipur'}</span>
                <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-amber-300 text-xs font-semibold">{isBn ? 'পঞ্চায়েত কোড: ১৬-০০৩' : 'Panchayat Code: 16-003'}</span>
              </p>
            </div>

            <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed max-w-2xl font-medium">
              {isBn 
                ? 'বাথুয়ারী গ্রাম পঞ্চায়েতের জব কার্ড, আধার e-KYC ও ABPS ব্যাংক ভ্যালিডেশন সংক্রান্ত অফিসিয়াল তথ্য কেন্দ্র। পার্মানেন্ট গুগল শিটের সাথে লাইভ সংযুক্ত।'
                : 'Official Job Card & e-KYC Service Portal of Bathuary Gram Panchayat. Manage citizen records, track biometric authentication, verify ABPS bank credit eligibility, and print certificates with direct Google Sheet linkage.'}
            </p>

            {/* Quick Micro-Stats Ticker in Deep Garua Box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1.5">
              <div className="bg-[#330C01]/95 border border-amber-600/70 rounded-xl px-3 py-2 shadow-inner">
                <span className="text-[10px] text-amber-300/90 uppercase font-bold block">{isBn ? 'মৌজা গ্রাম' : 'Villages'}</span>
                <span className="text-base font-black text-emerald-400">{isBn ? '২৯টি গ্রাম' : '29 Active'}</span>
              </div>
              <div className="bg-[#330C01]/95 border border-amber-600/70 rounded-xl px-3 py-2 shadow-inner">
                <span className="text-[10px] text-amber-300/90 uppercase font-bold block">{isBn ? 'গ্রাম সংসদ' : 'Sansads'}</span>
                <span className="text-base font-black text-amber-300">{isBn ? '১৬টি সংসদ' : '16 Wards'}</span>
              </div>
              <div className="bg-[#330C01]/95 border border-amber-600/70 rounded-xl px-3 py-2 shadow-inner">
                <span className="text-[10px] text-amber-300/90 uppercase font-bold block">{isBn ? 'পেমেন্ট ব্যবস্থা' : 'Payments'}</span>
                <span className="text-base font-black text-orange-400">ABPS {isBn ? 'সক্রিয়' : 'Active'}</span>
              </div>
              <div className="bg-[#330C01]/95 border border-amber-600/70 rounded-xl px-3 py-2 shadow-inner">
                <span className="text-[10px] text-amber-300/90 uppercase font-bold block">{isBn ? 'শিট সংযোগ' : 'Sheet Sync'}</span>
                <span className="text-base font-black text-emerald-400">{isBn ? 'পার্মানেন্ট লাইভ' : 'Permanent Live'}</span>
              </div>
            </div>
          </div>

          {/* Right Emblem Showcase & Quick Actions */}
          <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#330C01]/95 backdrop-blur-md rounded-2xl border border-amber-600/70 shadow-xl transition-transform hover:scale-105">
                <NationalEmblemLogo className="w-8 h-12 text-white drop-shadow-md" />
              </div>
              <div className="p-2.5 bg-[#330C01]/95 backdrop-blur-md rounded-2xl border border-amber-600/70 shadow-xl transition-transform hover:scale-105">
                <VbGramGActLogo className="w-16 h-12 drop-shadow-md" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
              <div 
                onClick={onOpenSyncModal}
                className="px-4 py-2.5 rounded-xl bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-500/70 text-emerald-200 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
                title="গুগল শিট পার্মানেন্ট সংযুক্ত আছে"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
                <span>{isBn ? 'গুগল শিট লাইভ (অটো-সিঙ্ক)' : 'Google Sheet Live Sync'}</span>
              </div>
              <button 
                type="button"
                onClick={() => onNavigateTab('dashboard')}
                className="px-4 py-2.5 rounded-xl bg-[#521703] hover:bg-[#681C04] text-amber-100 hover:text-white font-bold text-xs border border-amber-500/70 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:border-amber-300"
              >
                <BarChart3 className="w-4 h-4 text-amber-300" />
                <span>{isBn ? 'সম্পূর্ণ অ্যানালিটিক্স' : 'Full Analytics'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Overview (Deep Garua Themed Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Job Cards */}
        <div 
          onClick={() => onNavigateTab('reports')}
          className="rounded-2xl bg-gradient-to-br from-[#4D1302] via-[#360D01] to-[#200600] border-2 border-amber-600/70 hover:border-amber-400 p-4 sm:p-5 shadow-xl hover:shadow-2xl hover:shadow-orange-950/70 transition-all duration-200 cursor-pointer group hover-lift relative overflow-hidden"
        >
          <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 to-orange-500 absolute top-0 left-0" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-black uppercase text-amber-200 tracking-wider">
              {isBn ? 'মোট জব কার্ড' : 'Total Job Cards'}
            </span>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-950/60 group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white mt-2">{analytics.total}</h3>
          
          {/* Progress Visual */}
          <div className="mt-3">
            <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden border border-amber-900/60">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-1.5 rounded-full w-full" />
            </div>
            <p className="text-[11px] text-amber-200/80 mt-1.5 font-bold flex items-center justify-between">
              <span>{isBn ? 'বাথুয়ারী পঞ্চায়েত মোট' : 'Bathuary GP Total'}</span>
              <span className="text-amber-300 font-extrabold">100%</span>
            </p>
          </div>
        </div>

        {/* Metric 2: e-KYC Done */}
        <div 
          onClick={() => onNavigateTab('reports')}
          className="rounded-2xl bg-gradient-to-br from-[#4D1302] via-[#360D01] to-[#200600] border-2 border-amber-600/70 hover:border-amber-400 p-4 sm:p-5 shadow-xl hover:shadow-2xl hover:shadow-orange-950/70 transition-all duration-200 cursor-pointer group hover-lift relative overflow-hidden"
        >
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-teal-500 absolute top-0 left-0" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-black uppercase text-emerald-300 tracking-wider">
              {isBn ? 'e-KYC সম্পন্ন' : 'e-KYC Verified'}
            </span>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-950/60 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-2xl sm:text-3xl font-black text-emerald-100">{analytics.done}</h3>
            <span className="text-xs font-black text-emerald-300 bg-emerald-950/90 border border-emerald-500/60 px-2 py-0.5 rounded-full shadow-2xs">
              {analytics.donePct}%
            </span>
          </div>

          {/* Progress Visual */}
          <div className="mt-3">
            <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden border border-emerald-900/60">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, Math.max(0, analytics.donePct))}%` }}
              />
            </div>
            <p className="text-[11px] text-emerald-300/80 mt-1.5 font-bold flex items-center justify-between">
              <span>{isBn ? 'বায়োমেট্রিক সফল' : 'Biometric Verified'}</span>
              <span className="text-emerald-200 font-extrabold">{analytics.donePct}% {isBn ? 'হার' : 'Rate'}</span>
            </p>
          </div>
        </div>

        {/* Metric 3: Pending e-KYC */}
        <div 
          onClick={() => onNavigateTab('reports')}
          className="rounded-2xl bg-gradient-to-br from-[#4D1302] via-[#360D01] to-[#200600] border-2 border-amber-600/70 hover:border-amber-400 p-4 sm:p-5 shadow-xl hover:shadow-2xl hover:shadow-orange-950/70 transition-all duration-200 cursor-pointer group hover-lift relative overflow-hidden"
        >
          <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 to-orange-500 absolute top-0 left-0" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-black uppercase text-amber-300 tracking-wider">
              {isBn ? 'e-KYC বাকি' : 'Pending e-KYC'}
            </span>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-amber-950/60 group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-2xl sm:text-3xl font-black text-amber-100">{analytics.pending}</h3>
            <span className="text-xs font-black text-amber-300 bg-amber-950/90 border border-amber-500/60 px-2 py-0.5 rounded-full shadow-2xs">
              {analytics.pendingPct}%
            </span>
          </div>

          {/* Progress Visual */}
          <div className="mt-3">
            <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden border border-amber-900/60">
              <div 
                className="bg-gradient-to-r from-amber-400 to-orange-500 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, Math.max(0, analytics.pendingPct))}%` }}
              />
            </div>
            <p className="text-[11px] text-amber-300/80 mt-1.5 font-bold flex items-center justify-between">
              <span>{isBn ? 'বায়োমেট্রিক অপেক্ষমান' : 'Awaiting Biometrics'}</span>
              <span className="text-amber-200 font-extrabold">{analytics.pendingPct}%</span>
            </p>
          </div>
        </div>

        {/* Metric 4: ABPS Enabled */}
        <div 
          onClick={() => onNavigateTab('dashboard')}
          className="rounded-2xl bg-gradient-to-br from-[#4D1302] via-[#360D01] to-[#200600] border-2 border-amber-600/70 hover:border-amber-400 p-4 sm:p-5 shadow-xl hover:shadow-2xl hover:shadow-orange-950/70 transition-all duration-200 cursor-pointer group hover-lift relative overflow-hidden"
        >
          <div className="h-1.5 w-full bg-gradient-to-r from-purple-500 to-amber-500 absolute top-0 left-0" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-black uppercase text-purple-300 tracking-wider">
              {isBn ? 'ABPS ব্যাংক ক্রেডিট' : 'ABPS Payment'}
            </span>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-950/60 group-hover:scale-110 transition-transform">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-2xl sm:text-3xl font-black text-purple-100">{analytics.abpsActive}</h3>
            <span className="text-xs font-black text-purple-300 bg-purple-950/90 border border-purple-500/60 px-2 py-0.5 rounded-full shadow-2xs">
              {analytics.total ? Math.round((analytics.abpsActive / analytics.total) * 100) : 0}%
            </span>
          </div>

          {/* Progress Visual */}
          <div className="mt-3">
            <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden border border-purple-900/60">
              <div 
                className="bg-gradient-to-r from-purple-500 to-amber-500 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${analytics.total ? Math.round((analytics.abpsActive / analytics.total) * 100) : 0}%` }}
              />
            </div>
            <p className="text-[11px] text-purple-300/80 mt-1.5 font-bold flex items-center justify-between">
              <span>{isBn ? 'সরাসরি ব্যাংক ডিবিটি' : 'Direct Bank DBT'}</span>
              <span className="text-purple-200 font-extrabold">{analytics.total ? Math.round((analytics.abpsActive / analytics.total) * 100) : 0}%</span>
            </p>
          </div>
        </div>
      </div>

      {/* 3. Primary Core Service Hub (Deep Royal Garua) */}
      <div className="rounded-3xl bg-gradient-to-br from-[#481202] via-[#330C01] to-[#1D0500] border-2 border-amber-600/80 p-6 sm:p-7 shadow-2xl">
        <div className="flex items-center justify-between border-b border-amber-700/70 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-bold shadow-md shadow-amber-950/60">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <span>{isBn ? 'পঞ্চায়েত সেবা হাব ও অ্যাকশন' : 'Panchayat Service Hub & Quick Actions'}</span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-amber-950/90 text-amber-300 border border-amber-600/70 text-[10px] font-black uppercase tracking-wider">
                  {isBn ? '৬টি প্রধান মডিউল' : '6 Core Modules'}
                </span>
              </h2>
              <p className="text-xs text-amber-200/80 font-medium">
                {isBn ? 'এক ক্লিকে যে কোনো ই-গভর্ন্যান্স মডিউলে প্রবেশ করুন।' : 'Access any e-governance service module directly in one click with real-time sync.'}
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-amber-300 bg-amber-950/90 border border-amber-600/70 px-3.5 py-1 rounded-full hidden sm:inline shadow-sm">
            ⚡ {isBn ? 'দ্রুত নেভিগেশন' : 'Fast Navigation'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Citizen Search Corner */}
          <div 
            onClick={() => onNavigateTab('search')}
            className="rounded-2xl p-5 bg-gradient-to-br from-[#531503] via-[#3B0E01] to-[#230600] border-2 border-amber-700/70 hover:border-amber-400 hover:shadow-2xl hover:shadow-orange-950/70 transition-all duration-200 cursor-pointer group flex flex-col justify-between hover-lift relative overflow-hidden"
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-500 absolute top-0 left-0" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-950/60 group-hover:scale-110 transition-transform">
                  <Search className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black text-blue-300 bg-blue-950/90 px-2.5 py-0.5 rounded-full border border-blue-600/60 shadow-xs">
                  {isBn ? 'নাগরিক অনুসন্ধান' : 'Instant Search'}
                </span>
              </div>
              <h3 className="text-base font-black text-amber-100 group-hover:text-amber-300 transition-colors">
                {isBn ? 'নাগরিক তথ্য অনুসন্ধান' : 'Citizen Search Corner'}
              </h3>
              <p className="text-xs text-amber-200/80 mt-1.5 leading-relaxed font-medium">
                {isBn 
                  ? 'জব কার্ড নম্বর (WB-16-003...), ১২ ডিজিটের আধার বা নাম দিয়ে তাৎক্ষণিক অনুসন্ধান ও ভেরিফিকেশন স্লিপ ডাউনলোড।' 
                  : 'Instant lookup by Job Card Number (WB-16-003...), 12-digit Aadhaar, or Applicant Name with official verification badge.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-900/70 flex items-center justify-between text-xs font-black text-amber-300 group-hover:text-amber-200">
              <span>{isBn ? 'অনুসন্ধান পেজে যান' : 'Open Search Corner'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Card 2: Data Update & e-KYC Form */}
          <div 
            onClick={() => onNavigateTab('dataForm')}
            className="rounded-2xl p-5 bg-gradient-to-br from-[#531503] via-[#3B0E01] to-[#230600] border-2 border-amber-700/70 hover:border-amber-400 hover:shadow-2xl hover:shadow-orange-950/70 transition-all duration-200 cursor-pointer group flex flex-col justify-between hover-lift relative overflow-hidden"
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-teal-500 absolute top-0 left-0" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-950/60 group-hover:scale-110 transition-transform">
                  <UserCheck className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black text-emerald-300 bg-emerald-950/90 px-2.5 py-0.5 rounded-full border border-emerald-600/60 shadow-xs">
                  {isBn ? 'e-KYC ও ব্যাংক' : 'e-KYC & Bank'}
                </span>
              </div>
              <h3 className="text-base font-black text-amber-100 group-hover:text-amber-300 transition-colors">
                {isBn ? 'ডাটা আপডেট ও e-KYC ফর্ম' : 'Data Update Form'}
              </h3>
              <p className="text-xs text-amber-200/80 mt-1.5 leading-relaxed font-medium">
                {isBn 
                  ? 'আধার নম্বর, মোবাইল, ব্যাংক অ্যাকাউন্ট (IPPB, SBI, BGVB) এবং বায়োমেট্রিক স্ট্যাটাস এন্ট্রি ও সরাসরি গুগল শিটে সেভ।' 
                  : 'Authorized entry of Aadhaar, Mobile, biometric e-KYC verification, and normalized Bank details (IPPB, SBI, BGVB, etc.).'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-900/70 flex items-center justify-between text-xs font-black text-emerald-300 group-hover:text-emerald-200">
              <span>{isBn ? 'ফর্ম ওপেন করুন' : 'Open Update Form'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Card 3: Village & Sansad Analytical Report */}
          <div 
            onClick={() => onNavigateTab('reports')}
            className="rounded-2xl p-5 bg-gradient-to-br from-[#531503] via-[#3B0E01] to-[#230600] border-2 border-amber-700/70 hover:border-amber-400 hover:shadow-2xl hover:shadow-orange-950/70 transition-all duration-200 cursor-pointer group flex flex-col justify-between hover-lift relative overflow-hidden"
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 to-purple-500 absolute top-0 left-0" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-950/60 group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black text-indigo-300 bg-indigo-950/90 px-2.5 py-0.5 rounded-full border border-indigo-600/60 shadow-xs">
                  {isBn ? 'A4 PDF / প্রিন্ট' : 'A4 PDF / Slip'}
                </span>
              </div>
              <h3 className="text-base font-black text-amber-100 group-hover:text-amber-300 transition-colors">
                {isBn ? 'মৌজা গ্রাম ও সংসদ রিপোর্ট' : 'Village & Sansad Report'}
              </h3>
              <p className="text-xs text-amber-200/80 mt-1.5 leading-relaxed font-medium">
                {isBn 
                  ? '১৬টি সংসদ এবং ২৯টি মৌজার সম্পূর্ণ উপভোক্তা তালিকা। অপ্টিমাইজড A4 প্রিন্ট, এক্সেল ডাউনলোড ও স্বীকৃতি স্লিপ।' 
                  : 'Full list filterable by Sansad (1 to 16) and 29 villages. Optimized A4 Print layout, Excel download, and Acknowledgement Slips.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-900/70 flex items-center justify-between text-xs font-black text-indigo-300 group-hover:text-indigo-200">
              <span>{isBn ? 'A4 রিপোর্ট দেখুন' : 'Generate A4 Report'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Card 4: Analytics Dashboard */}
          <div 
            onClick={() => onNavigateTab('dashboard')}
            className="rounded-2xl p-5 bg-gradient-to-br from-[#531503] via-[#3B0E01] to-[#230600] border-2 border-amber-700/70 hover:border-amber-400 hover:shadow-2xl hover:shadow-orange-950/70 transition-all duration-200 cursor-pointer group flex flex-col justify-between hover-lift relative overflow-hidden"
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 to-orange-500 absolute top-0 left-0" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-amber-950/60 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black text-amber-300 bg-amber-950/90 px-2.5 py-0.5 rounded-full border border-amber-600/60 shadow-xs">
                  {isBn ? 'লাইভ গ্রাফ' : 'Live Charts'}
                </span>
              </div>
              <h3 className="text-base font-black text-amber-100 group-hover:text-amber-300 transition-colors">
                {isBn ? 'অ্যানালিটিক্স ও ২৯ মৌজা' : 'Analytics & 29 Villages'}
              </h3>
              <p className="text-xs text-amber-200/80 mt-1.5 leading-relaxed font-medium">
                {isBn 
                  ? '২৯টি মৌজার পৃথক চার্ট, ভেরিফিকেশন অগ্রগতি, মৃত ব্যক্তি ফিল্টার এবং ১৬টি সংসদের তুলনামূলক পরিসংখ্যান।' 
                  : 'Detailed charts for each of the 29 canonical villages, compliance gauges, deceased filtering, and Sansad breakdown.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-900/70 flex items-center justify-between text-xs font-black text-amber-300 group-hover:text-amber-200">
              <span>{isBn ? 'অ্যানালিটিক্স ওপেন করুন' : 'View Full Analytics'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Card 5: Direct Google Sheet Link */}
          <div 
            onClick={onOpenSyncModal}
            className="rounded-2xl p-5 bg-gradient-to-br from-[#531503] via-[#3B0E01] to-[#230600] border-2 border-amber-700/70 hover:border-amber-400 hover:shadow-2xl hover:shadow-orange-950/70 transition-all duration-200 cursor-pointer group flex flex-col justify-between hover-lift relative overflow-hidden"
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-teal-500 to-emerald-500 absolute top-0 left-0" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-600 text-white flex items-center justify-center shadow-lg shadow-teal-950/60 group-hover:scale-110 transition-transform">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black text-emerald-300 bg-emerald-950/90 px-2.5 py-0.5 rounded-full border border-emerald-600/60 shadow-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  {isBn ? 'অটো-সিঙ্ক সক্রিয়' : 'Auto-Sync Active'}
                </span>
              </div>
              <h3 className="text-base font-black text-amber-100 group-hover:text-amber-300 transition-colors">
                {isBn ? 'গুগল শিট পার্মানেন্ট অটো-সিঙ্ক' : 'Google Sheet Live Auto-Sync'}
              </h3>
              <p className="text-xs text-amber-200/80 mt-1.5 leading-relaxed font-medium">
                {isBn 
                  ? 'বাথুয়ারী গ্রাম পঞ্চায়েতের অফিসিয়াল গুগল স্প্রেডশীট পার্মানেন্টলি যুক্ত। ওয়েবসাইট ওপেন হলেই সমস্ত ডাটা নিজে থেকে সিঙ্ক হয়ে যায়।' 
                  : 'Official Bathuary GP Google Spreadsheet is permanently linked. All citizen records automatically synchronize in real time.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-900/70 flex items-center justify-between text-xs font-black text-emerald-300 group-hover:text-emerald-200">
              <span>{isBn ? 'সিঙ্ক স্ট্যাটাস দেখুন' : 'View Sync Status & Settings'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Card 6: Security & ISO Standards */}
          <div 
            onClick={() => onNavigateTab('security')}
            className="rounded-2xl p-5 bg-gradient-to-br from-[#531503] via-[#3B0E01] to-[#230600] border-2 border-amber-700/70 hover:border-amber-400 hover:shadow-2xl hover:shadow-orange-950/70 transition-all duration-200 cursor-pointer group flex flex-col justify-between hover-lift relative overflow-hidden"
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-purple-500 to-violet-500 absolute top-0 left-0" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-600 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-purple-950/60 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black text-purple-300 bg-purple-950/90 px-2.5 py-0.5 rounded-full border border-purple-600/60 shadow-xs">
                  {isBn ? 'ডাটা সিকিউরিটি' : 'Data Security'}
                </span>
              </div>
              <h3 className="text-base font-black text-amber-100 group-hover:text-amber-300 transition-colors">
                {isBn ? 'নিরাপত্তা ও আধার সুরক্ষা নীতি' : 'Security & Aadhaar Policy'}
              </h3>
              <p className="text-xs text-amber-200/80 mt-1.5 leading-relaxed font-medium">
                {isBn 
                  ? 'ISO স্ট্যান্ডার্ড রোল-বেসড সিকিউরিটি, ১২ ডিজিট UID মাস্কিং, সুরক্ষা অডিট ও সরকারি DPDP আইনসম্মত এনক্রিপশন।' 
                  : 'ISO compliant role-based authentication, 12-digit UID masking, audit logs, and strict DPDP Act compliance.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-900/70 flex items-center justify-between text-xs font-black text-purple-300 group-hover:text-purple-200">
              <span>{isBn ? 'সিকিউরিটি প্রোটোকল' : 'View Security Protocol'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Quick Sansad Directory (Deep Royal Garua) */}
      <div className="rounded-3xl bg-gradient-to-br from-[#481202] via-[#330C01] to-[#1D0500] border-2 border-amber-600/80 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4 border-b border-amber-700/70 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div>
              <h3 className="text-base font-black text-white">
                {isBn ? 'সংসদ অনুযায়ী দ্রুত রিপোর্ট ফিল্টার (বাথুয়ারী ১ থেকে ১৬)' : 'Direct Sansad Quick Filter (BATHUARY 1 to 16)'}
              </h3>
              <p className="text-xs text-amber-200/80 font-medium">
                {isBn ? 'নির্দিষ্ট সংসদে ক্লিক করে সরাসরি সেই সংসদের উপভোক্তা তালিকায় যান।' : 'Click any Sansad ward to jump directly to its complete beneficiary report'}
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-amber-300 bg-amber-950/90 border border-amber-600/70 px-3 py-1 rounded-full hidden sm:inline shadow-xs">
            {isBn ? '১৬টি গ্রাম সংসদ' : '16 Gram Sansads'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5">
          {SANSAD_LIST.map((sansad, idx) => (
            <button
              key={sansad}
              type="button"
              onClick={() => onNavigateTab('reports', { sansad })}
              className="group px-3 py-2.5 rounded-xl bg-[#330C01] hover:bg-gradient-to-br hover:from-[#EA580C] hover:to-[#9A3412] text-amber-100 hover:text-white border-2 border-amber-700/70 hover:border-amber-300 text-xs font-black text-center transition-all duration-150 cursor-pointer shadow-sm hover:shadow-lg hover:-translate-y-0.5 flex flex-col items-center justify-center gap-1"
              title={`${sansad} রিপোর্ট দেখুন`}
            >
              <span className="text-[9px] font-extrabold text-amber-400 group-hover:text-amber-100 uppercase tracking-wider">
                {isBn ? `সংসদ ${idx + 1}` : `WARD ${idx + 1}`}
              </span>
              <span className="text-xs font-black text-white">
                {sansad}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
