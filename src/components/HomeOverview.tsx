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
  Fingerprint, 
  ArrowRight, 
  ExternalLink,
  ShieldCheck,
  Award,
  Sparkles
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
  onOpenSyncModal
}) => {
  return (
    <div className="space-y-6">
      {/* 0. Dynamic Government Notice Ticker */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white shadow-md p-0.5 animate-gradient-shift">
        <div className="bg-slate-950/90 backdrop-blur-md rounded-[14px] px-4 py-2.5 flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 px-2.5 py-1 rounded-lg font-black text-[11px] shrink-0 shadow-xs uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            <span>LIVE NOTICE</span>
          </div>
          <div className="overflow-hidden whitespace-nowrap text-xs text-slate-200 font-medium flex-1">
            <div className="inline-block animate-pulse">
              📢 <strong className="text-emerald-300 font-bold">Bathuary Gram Panchayat (Egra-II Development Block)</strong>: 100% Aadhaar Biometric e-KYC & ABPS validation active across all 29 canonical villages. Permanent Google Sheet sync connected. Instant A4/A5 certificate printing enabled.
            </div>
          </div>
          <button 
            onClick={() => onNavigateTab('search')}
            className="shrink-0 text-[11px] font-bold text-emerald-300 hover:text-white bg-emerald-950/60 hover:bg-emerald-800/80 border border-emerald-500/40 px-2.5 py-1 rounded-lg transition-colors cursor-pointer hidden sm:flex items-center gap-1"
          >
            <span>Search Citizen</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 1. Official Government & Panchayat Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#070D1E] via-[#0F172A] to-[#1E1B4B] text-white p-6 sm:p-8 shadow-2xl border border-slate-800/90 overflow-hidden">
        {/* Colorful Animated Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-12 left-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/25 text-emerald-300 text-xs font-black border border-emerald-400/40 shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Official e-Governance Portal</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/25 text-blue-300 text-xs font-bold border border-blue-400/40 shadow-xs">
                <Building className="w-3.5 h-3.5 text-blue-400" />
                <span>29 Villages • 16 Sansads</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/25 text-amber-300 text-xs font-bold border border-amber-400/40 shadow-xs">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>VB-GRAM G ACT • VIKSIT BHARAT</span>
              </span>
            </div>

            {/* Official Headings */}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black tracking-wider uppercase bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                  Govt. of West Bengal • Panchayats & Rural Development
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mt-1 drop-shadow-sm">
                BATHUARY GRAM PANCHAYAT
              </h1>
              <p className="text-sm sm:text-base font-bold text-slate-300 mt-1 flex items-center gap-2">
                <span>Egra-II Development Block • Purba Medinipur</span>
                <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-emerald-400 text-xs font-semibold hidden sm:inline">Panchayat Code: 16-003</span>
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Welcome to the official Job Card & e-KYC Service Portal of Bathuary Gram Panchayat.
              Manage citizen job card records, track biometric authentication, verify ABPS bank credit eligibility, and generate official A4/A5 certificates with direct Google Sheet linkage.
            </p>

            {/* Quick Micro-Stats Ticker */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl px-3 py-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Canonical Villages</span>
                <span className="text-base font-black text-emerald-400">29 Active</span>
              </div>
              <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl px-3 py-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Sansad Wards</span>
                <span className="text-base font-black text-sky-400">16 Wards</span>
              </div>
              <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl px-3 py-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Payment System</span>
                <span className="text-base font-black text-purple-400">ABPS Enabled</span>
              </div>
              <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl px-3 py-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Sheet Link</span>
                <span className="text-base font-black text-amber-400">Permanent</span>
              </div>
            </div>
          </div>

          {/* Right Emblem Showcase & Quick Sheet Link Button */}
          <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl transition-transform hover:scale-105">
                <NationalEmblemLogo className="w-8 h-12 text-white drop-shadow-md" />
              </div>
              <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl transition-transform hover:scale-105">
                <VbGramGActLogo className="w-16 h-12 drop-shadow-md" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={onOpenSyncModal}
                className="btn-3d-save px-4 py-2.5 rounded-xl text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <FileSpreadsheet className="w-4 h-4 animate-bounce" />
                <span>Link Google Sheet</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('dashboard')}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/30 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:border-emerald-400"
              >
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                <span>Full Analytics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Overview (Vibrant & Dynamic Progress Bars) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Job Cards */}
        <div 
          onClick={() => onNavigateTab('reports')}
          className="rounded-2xl bg-gradient-to-br from-white via-blue-50/30 to-blue-100/20 border-2 border-blue-200 hover:border-blue-500 p-4 sm:p-5 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer group hover-lift relative overflow-hidden"
        >
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-600 absolute top-0 left-0" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-black uppercase text-blue-900 tracking-wider">Total Job Cards</span>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-950 mt-2">{analytics.total}</h3>
          
          {/* Progress Visual */}
          <div className="mt-3">
            <div className="w-full bg-blue-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1.5 rounded-full w-full" />
            </div>
            <p className="text-[11px] text-blue-700/80 mt-1.5 font-bold flex items-center justify-between">
              <span>Bathuary GP Total</span>
              <span className="text-blue-900 font-extrabold">100%</span>
            </p>
          </div>
        </div>

        {/* Metric 2: e-KYC Done */}
        <div 
          onClick={() => onNavigateTab('reports')}
          className="rounded-2xl bg-gradient-to-br from-white via-emerald-50/30 to-emerald-100/20 border-2 border-emerald-300 hover:border-emerald-600 p-4 sm:p-5 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer group hover-lift relative overflow-hidden"
        >
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-teal-500 absolute top-0 left-0" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-black uppercase text-emerald-900 tracking-wider">e-KYC Verified</span>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/30 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-2xl sm:text-3xl font-black text-emerald-900">{analytics.done}</h3>
            <span className="text-xs font-black text-emerald-900 bg-emerald-100/90 border border-emerald-300 px-2 py-0.5 rounded-full shadow-2xs">
              {analytics.donePct}%
            </span>
          </div>

          {/* Progress Visual */}
          <div className="mt-3">
            <div className="w-full bg-emerald-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, Math.max(0, analytics.donePct))}%` }}
              />
            </div>
            <p className="text-[11px] text-emerald-700/80 mt-1.5 font-bold flex items-center justify-between">
              <span>Biometric Verified</span>
              <span className="text-emerald-900 font-extrabold">{analytics.donePct}% Rate</span>
            </p>
          </div>
        </div>

        {/* Metric 3: Pending e-KYC */}
        <div 
          onClick={() => onNavigateTab('reports')}
          className="rounded-2xl bg-gradient-to-br from-white via-amber-50/30 to-amber-100/20 border-2 border-amber-300 hover:border-amber-500 p-4 sm:p-5 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer group hover-lift relative overflow-hidden"
        >
          <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 to-orange-500 absolute top-0 left-0" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-black uppercase text-amber-950 tracking-wider">Pending e-KYC</span>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-amber-500/30 group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-2xl sm:text-3xl font-black text-amber-950">{analytics.pending}</h3>
            <span className="text-xs font-black text-amber-950 bg-amber-100/90 border border-amber-300 px-2 py-0.5 rounded-full shadow-2xs">
              {analytics.pendingPct}%
            </span>
          </div>

          {/* Progress Visual */}
          <div className="mt-3">
            <div className="w-full bg-amber-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-400 to-orange-500 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, Math.max(0, analytics.pendingPct))}%` }}
              />
            </div>
            <p className="text-[11px] text-amber-800 mt-1.5 font-bold flex items-center justify-between">
              <span>Awaiting Biometrics</span>
              <span className="text-amber-950 font-extrabold">{analytics.pendingPct}%</span>
            </p>
          </div>
        </div>

        {/* Metric 4: ABPS Enabled */}
        <div 
          onClick={() => onNavigateTab('dashboard')}
          className="rounded-2xl bg-gradient-to-br from-white via-purple-50/30 to-purple-100/20 border-2 border-purple-200 hover:border-purple-500 p-4 sm:p-5 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer group hover-lift relative overflow-hidden"
        >
          <div className="h-1.5 w-full bg-gradient-to-r from-purple-500 to-violet-600 absolute top-0 left-0" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-black uppercase text-purple-950 tracking-wider">ABPS Payment</span>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-violet-700 text-white flex items-center justify-center shadow-md shadow-purple-500/30 group-hover:scale-110 transition-transform">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-2xl sm:text-3xl font-black text-purple-950">{analytics.abpsActive}</h3>
            <span className="text-xs font-black text-purple-900 bg-purple-100/90 border border-purple-300 px-2 py-0.5 rounded-full shadow-2xs">
              {analytics.total ? Math.round((analytics.abpsActive / analytics.total) * 100) : 0}%
            </span>
          </div>

          {/* Progress Visual */}
          <div className="mt-3">
            <div className="w-full bg-purple-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-violet-600 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${analytics.total ? Math.round((analytics.abpsActive / analytics.total) * 100) : 0}%` }}
              />
            </div>
            <p className="text-[11px] text-purple-800 mt-1.5 font-bold flex items-center justify-between">
              <span>Direct Bank DBT</span>
              <span className="text-purple-950 font-extrabold">{analytics.total ? Math.round((analytics.abpsActive / analytics.total) * 100) : 0}%</span>
            </p>
          </div>
        </div>
      </div>

      {/* 3. Primary Core Service Hub (Large Interactive Navigation Cards) */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-500/20">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                <span>Panchayat Service Hub & Quick Actions</span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                  6 Core Modules
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Access any e-governance service module directly in one click with real-time sync.
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full hidden sm:inline shadow-2xs">
            ⚡ Fast Navigation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Citizen Search Corner */}
          <div 
            onClick={() => onNavigateTab('search')}
            className="rounded-2xl p-5 bg-gradient-to-br from-white via-blue-50/20 to-blue-50/60 border-2 border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all duration-200 cursor-pointer group flex flex-col justify-between hover-lift relative overflow-hidden"
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-600 absolute top-0 left-0" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                  <Search className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black text-blue-700 bg-blue-100/80 px-2.5 py-0.5 rounded-full border border-blue-200 shadow-2xs">
                  Instant Search
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                Citizen Search Corner
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-medium">
                Instant lookup by Job Card Number (WB-16-003...), 12-digit Aadhaar, or Applicant Name with official verification badge.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black text-blue-700">
              <span>Open Search Corner</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Card 2: Data Update & e-KYC Form */}
          <div 
            onClick={() => onNavigateTab('dataForm')}
            className="rounded-2xl p-5 bg-gradient-to-br from-white via-emerald-50/20 to-emerald-50/60 border-2 border-slate-200 hover:border-emerald-500 hover:shadow-xl transition-all duration-200 cursor-pointer group flex flex-col justify-between hover-lift relative overflow-hidden"
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-teal-500 absolute top-0 left-0" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                  <UserCheck className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
                  e-KYC & Bank
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                Data Update Form
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-medium">
                Authorized entry of Aadhaar, Mobile, biometric e-KYC verification, and normalized Bank details (IPPB, SBI, BGVB, etc.).
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black text-emerald-700">
              <span>Open Update Form</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Card 3: Village & Sansad Analytical Report */}
          <div 
            onClick={() => onNavigateTab('reports')}
            className="rounded-2xl p-5 bg-gradient-to-br from-white via-indigo-50/20 to-indigo-50/60 border-2 border-slate-200 hover:border-indigo-500 hover:shadow-xl transition-all duration-200 cursor-pointer group flex flex-col justify-between hover-lift relative overflow-hidden"
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 to-purple-600 absolute top-0 left-0" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black text-indigo-800 bg-indigo-100/80 px-2.5 py-0.5 rounded-full border border-indigo-200 shadow-2xs">
                  A4 PDF / Slip
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900 group-hover:text-indigo-700 transition-colors">
                Village & Sansad Report
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-medium">
                Full list filterable by Sansad (1 to 16) and 29 villages. Optimized A4 Print layout, Excel download, and Acknowledgement Slips.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black text-indigo-700">
              <span>Generate A4 Report</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Card 4: Analytics Dashboard */}
          <div 
            onClick={() => onNavigateTab('dashboard')}
            className="rounded-2xl p-5 bg-gradient-to-br from-white via-amber-50/20 to-amber-50/60 border-2 border-slate-200 hover:border-amber-500 hover:shadow-xl transition-all duration-200 cursor-pointer group flex flex-col justify-between hover-lift relative overflow-hidden"
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 to-orange-500 absolute top-0 left-0" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black text-amber-950 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-200 shadow-2xs">
                  Live Charts
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900 group-hover:text-amber-800 transition-colors">
                Analytics & 29 Villages
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-medium">
                Detailed charts for each of the 29 canonical villages, compliance gauges, deceased filtering, and Sansad breakdown.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black text-amber-900">
              <span>View Full Analytics</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Card 5: Direct Google Sheet Link */}
          <div 
            onClick={onOpenSyncModal}
            className="rounded-2xl p-5 bg-gradient-to-br from-white via-teal-50/20 to-teal-50/60 border-2 border-slate-200 hover:border-teal-500 hover:shadow-xl transition-all duration-200 cursor-pointer group flex flex-col justify-between hover-lift relative overflow-hidden"
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-teal-500 to-emerald-600 absolute top-0 left-0" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-600 text-white flex items-center justify-center shadow-lg shadow-teal-500/30 group-hover:scale-110 transition-transform">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black text-teal-900 bg-teal-100/80 px-2.5 py-0.5 rounded-full border border-teal-200 shadow-2xs">
                  Permanent Sync
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900 group-hover:text-teal-700 transition-colors">
                Google Sheet Connection
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-medium">
                Direct live synchronization via Google Sheet link or file upload. Zero Apps Script dependency, complete data ownership.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black text-teal-800">
              <span>Connect / Update Sheet</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Card 6: Security & ISO Standards */}
          <div 
            onClick={() => onNavigateTab('security')}
            className="rounded-2xl p-5 bg-gradient-to-br from-white via-purple-50/20 to-purple-50/60 border-2 border-slate-200 hover:border-purple-500 hover:shadow-xl transition-all duration-200 cursor-pointer group flex flex-col justify-between hover-lift relative overflow-hidden"
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-purple-500 to-violet-600 absolute top-0 left-0" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-600 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black text-purple-900 bg-purple-100/80 px-2.5 py-0.5 rounded-full border border-purple-200 shadow-2xs">
                  Data Security
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900 group-hover:text-purple-700 transition-colors">
                Security & Aadhaar Policy
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-medium">
                ISO compliant role-based authentication, 12-digit UID masking, audit logs, and strict DPDP Act compliance.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black text-purple-800">
              <span>View Security Protocol</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Quick Sansad Directory (16 Sansads of Bathuary GP) */}
      <div className="rounded-3xl bg-gradient-to-br from-white via-slate-50 to-emerald-50/30 border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 border-b border-slate-200/80 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
            </span>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Direct Sansad Quick Filter (BATHUARY 1 to 16)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Click any Sansad ward to jump directly to its complete beneficiary report
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-3 py-1 rounded-full hidden sm:inline shadow-2xs">
            16 Gram Sansads
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5">
          {SANSAD_LIST.map((sansad, idx) => (
            <button
              key={sansad}
              type="button"
              onClick={() => onNavigateTab('reports', { sansad })}
              className="group px-3 py-2.5 rounded-xl bg-white hover:bg-gradient-to-br hover:from-emerald-600 hover:to-teal-600 hover:text-white border-2 border-slate-200 hover:border-emerald-500 text-slate-800 text-xs font-black text-center transition-all duration-150 cursor-pointer shadow-xs hover:shadow-md hover:-translate-y-0.5 flex flex-col items-center justify-center gap-1"
              title={`View ${sansad} Beneficiary Report`}
            >
              <span className="text-[9px] font-extrabold text-slate-600 group-hover:text-emerald-100 uppercase tracking-wider">
                WARD {idx + 1}
              </span>
              <span className="text-xs font-black">
                {sansad}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
