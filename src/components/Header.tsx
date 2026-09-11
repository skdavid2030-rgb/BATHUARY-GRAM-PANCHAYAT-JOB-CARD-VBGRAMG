import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  RefreshCw, 
  FileSpreadsheet, 
  ShieldCheck, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  Clock,
  Home,
  BarChart3,
  Search,
  UserCheck,
  FileText,
  Bot,
  Users,
  Rocket
} from 'lucide-react';
import { NationalEmblemLogo, VbGramGActLogo } from './Emblems';
import { AppUser } from '../types';

interface HeaderProps {
  currentTab: string;
  onOpenSidebar: () => void;
  isSyncing: boolean;
  onRefreshData: () => void;
  onOpenSyncModal: () => void;
  syncedSheetInfo?: {
    totalRecords: number;
    villagesCount: number;
  };
  isPermanentlySaved?: boolean;
  currentUser?: AppUser;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenSidebar,
  isSyncing,
  onRefreshData,
  onOpenSyncModal,
  syncedSheetInfo,
  isPermanentlySaved,
  currentUser,
  onLogout
}) => {
  // Live Clock & Date state
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
      setCurrentDate(now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // English title & badge color based on active tab
  const getTabConfig = (tab: string) => {
    switch (tab) {
      case 'dashboard': 
        return { title: 'Dashboard & Analytics (29 Villages & 16 Sansads)', icon: BarChart3, color: 'text-amber-600 bg-amber-50 border-amber-200' };
      case 'search': 
        return { title: 'Citizen Search Corner', icon: Search, color: 'text-blue-600 bg-blue-50 border-blue-200' };
      case 'dataForm': 
        return { title: 'Data Update Form', icon: UserCheck, color: 'text-teal-600 bg-teal-50 border-teal-200' };
      case 'reports': 
        return { title: 'Village Report & PDF Generator', icon: FileText, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' };
      case 'ai': 
        return { title: 'AI Verifier & Assistant', icon: Bot, color: 'text-fuchsia-600 bg-fuchsia-50 border-fuchsia-200' };
      case 'deploy': 
      case 'deployment': 
        return { title: 'Deployment & Hosting Guide', icon: Rocket, color: 'text-rose-600 bg-rose-50 border-rose-200' };
      case 'security': 
      case 'policy': 
        return { title: 'Security & Privacy Policy', icon: ShieldCheck, color: 'text-purple-600 bg-purple-50 border-purple-200' };
      default: 
        return { title: 'Bathuary Gram Panchayat Portal', icon: Sparkles, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    }
  };

  const tabConfig = getTabConfig(currentTab);
  const TabIcon = tabConfig.icon;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm transition-all no-print">
      {/* Top Colorful Animated Shimmer Strip */}
      <div className="h-1 w-full bg-gradient-to-r from-emerald-400 via-teal-400 via-sky-400 via-indigo-500 via-purple-500 via-pink-500 to-amber-400 animate-gradient-shift" />

      {/* Top Deep Blue Government Banner */}
      <div className="bg-gradient-to-r from-[#070D1E] via-[#0B132B] to-[#141E3C] px-4 sm:px-6 py-2.5 text-xs text-slate-200 border-b border-slate-800 relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute -top-6 -left-6 w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-6 right-1/4 w-40 h-40 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap justify-between items-center gap-2">
          {/* Left Brand Identifier with Official Logos (Logo 1 & Logo 2) */}
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Toggle for Left Sidebar */}
            <button
              id="mobile-sidebar-toggle-btn"
              onClick={onOpenSidebar}
              className="lg:hidden p-1.5 rounded-xl bg-slate-800/90 hover:bg-emerald-600 text-emerald-400 hover:text-white transition-all cursor-pointer shadow-xs"
              title="Open Navigation Menu"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Official Logos: State Emblem of India (Logo 1) & VB-GRAM G Act (Logo 2) */}
            <div className="flex items-center gap-2.5">
              <div className="p-1 bg-white rounded-xl shadow-md border border-slate-200/80 transition-transform hover:scale-105">
                <NationalEmblemLogo className="w-5 h-7 text-slate-900 drop-shadow-xs" />
              </div>
              <div className="p-1 bg-white rounded-xl shadow-md border border-slate-200/80 transition-transform hover:scale-105">
                <VbGramGActLogo className="w-12 h-7 drop-shadow-xs" />
              </div>

              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-black text-white tracking-wide uppercase leading-tight">
                    Govt. of West Bengal
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.2 rounded bg-gradient-to-r from-emerald-500/30 to-teal-500/30 border border-emerald-400/40 text-[9px] font-bold text-emerald-300">
                    Live Portal
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-emerald-400 leading-tight mt-0.5">
                  <span>Panchayats & Rural Development</span>
                  <span className="text-slate-400 hidden sm:inline">• Bathuary Gram Panchayat, Egra-II Development Block</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Action Bar (Enhanced 3D Buttons & Realtime Clock) */}
          <div className="flex items-center gap-2 sm:gap-3 text-[11px]">
            {/* Live Real-time Clock Badge */}
            <div className="hidden xl:flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 px-3 py-1.5 rounded-xl shadow-inner text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono font-bold text-emerald-300 text-xs">{currentTime || "Live"}</span>
              <span className="text-slate-500">|</span>
              <span className="text-[10px] text-slate-400 font-medium">{currentDate}</span>
            </div>

            <button
              id="header-link-sheet-btn"
              onClick={onOpenSyncModal}
              className="flex items-center gap-1.5 text-white btn-3d-save px-3.5 py-1.5 rounded-xl font-black cursor-pointer shadow-md"
              title={isPermanentlySaved ? "Google Sheet permanently saved in server" : "Auto-Link Google Sheet or upload master Excel"}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-white animate-pulse" />
              <span className="hidden sm:inline">
                {isPermanentlySaved ? "💾 SHEET SAVED (PERMANENT)" : "⚡ LINK GOOGLE SHEET"}
              </span>
              <span className="sm:hidden">
                {isPermanentlySaved ? "💾 PERMANENT" : "LINK SHEET"}
              </span>
            </button>

            <button
              id="header-refresh-btn"
              onClick={onRefreshData}
              disabled={isSyncing}
              className="flex items-center gap-1.5 text-white btn-3d-sync px-3.5 py-1.5 rounded-xl font-black cursor-pointer disabled:opacity-50 shadow-md"
              title="Refresh and re-synchronize records"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-200' : ''}`} />
              <span className="hidden sm:inline">{isSyncing ? "SYNCING..." : "SYNC"}</span>
            </button>

            {onLogout && (
              <button
                id="header-logout-btn"
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-rose-950/80 border border-slate-700 hover:border-rose-500/50 text-slate-300 hover:text-rose-200 font-bold text-xs transition-all shadow-md cursor-pointer"
                title={`Logged in as ${currentUser?.name || 'BATHUARY_002'}. Click to logout.`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse hidden sm:inline" />
                <span className="font-mono text-emerald-300 text-[11px] hidden md:inline">{currentUser?.name || 'BATHUARY_002'}</span>
                <span className="text-rose-400 hover:text-rose-200 text-xs font-semibold">Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Bar: Vibrant Header with Breadcrumb & Village Stats */}
      <div className="px-4 sm:px-6 py-2.5 bg-gradient-to-r from-slate-50 via-emerald-50/20 to-blue-50/30 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Trigger */}
          <button
            onClick={onOpenSidebar}
            className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-md cursor-pointer hover:bg-emerald-700 transition-colors"
          >
            <Menu className="w-4 h-4 text-emerald-400" />
            <span>Menu</span>
          </button>

          {/* Active Section Breadcrumbs with Colorful Badge */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-700 hover:text-emerald-700 transition-colors">Bathuary GP</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-black shadow-2xs ${tabConfig.color}`}>
              <TabIcon className="w-3.5 h-3.5" />
              <span>{tabConfig.title}</span>
            </div>
          </div>
        </div>

        {/* Master 29 Villages Badge & Sync Indicator */}
        <div className="flex items-center gap-2">
          {syncedSheetInfo && syncedSheetInfo.totalRecords > 0 ? (
            <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 text-emerald-900 px-3.5 py-1 rounded-full text-xs font-black shadow-xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span>{syncedSheetInfo.totalRecords.toLocaleString()} Verified Citizens</span>
              <span className="text-emerald-300">•</span>
              <span className="text-emerald-700 font-extrabold">29 Canonical Villages</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 text-amber-900 px-3.5 py-1 rounded-full text-xs font-black shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span>Master Database</span>
              <span className="text-amber-300">•</span>
              <span className="text-amber-900">29 Canonical Villages</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
