import React from 'react';
import { 
  Home,
  LayoutDashboard,
  BarChart3,
  Search, 
  UserCheck, 
  FileText, 
  Sparkles, 
  Users, 
  Rocket, 
  FileSpreadsheet, 
  RefreshCw, 
  X,
  ExternalLink,
  Layers,
  Database,
  ShieldCheck,
  Link2
} from 'lucide-react';
import { NationalEmblemLogo, VbGramGActLogo } from './Emblems';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
  isSyncing: boolean;
  onRefreshData: () => void;
  onOpenSyncModal: () => void;
  syncedSheetInfo?: {
    totalRecords: number;
    villagesCount: number;
    lastSyncTimestamp?: string;
  };
  isPermanentlySaved?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  isOpen,
  onClose,
  isSyncing,
  onRefreshData,
  onOpenSyncModal,
  syncedSheetInfo,
  isPermanentlySaved
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Analytics Dashboard',
      sublabel: 'Overview & 29 Villages',
      icon: BarChart3,
      badge: 'Live',
      activeGradient: 'from-amber-600 to-orange-600 border-amber-400/50 shadow-amber-950/60',
      iconColor: 'text-amber-400',
      activeIconBg: 'bg-amber-700/90 text-white',
      badgeColor: 'bg-amber-500/30 text-amber-200 border-amber-400/40'
    },
    {
      id: 'search',
      label: 'Citizen Search Corner',
      sublabel: 'Job Card & Aadhaar Search',
      icon: Search,
      badge: 'Search',
      activeGradient: 'from-blue-600 to-indigo-600 border-blue-400/50 shadow-blue-950/60',
      iconColor: 'text-blue-400',
      activeIconBg: 'bg-blue-700/90 text-white',
      badgeColor: 'bg-blue-500/30 text-blue-200 border-blue-400/40'
    },
    {
      id: 'dataForm',
      label: 'Data Update Form',
      sublabel: 'Field Officer e-KYC Entry',
      icon: UserCheck,
      badge: 'e-KYC',
      activeGradient: 'from-teal-600 to-emerald-600 border-teal-400/50 shadow-teal-950/60',
      iconColor: 'text-teal-400',
      activeIconBg: 'bg-teal-700/90 text-white',
      badgeColor: 'bg-teal-500/30 text-teal-200 border-teal-400/40'
    },
    {
      id: 'reports',
      label: 'Village Report & PDF',
      sublabel: 'Official PDF Slips & Lists',
      icon: FileText,
      badge: 'A4 Print',
      activeGradient: 'from-indigo-600 to-purple-600 border-indigo-400/50 shadow-indigo-950/60',
      iconColor: 'text-indigo-400',
      activeIconBg: 'bg-indigo-700/90 text-white',
      badgeColor: 'bg-indigo-500/30 text-indigo-200 border-indigo-400/40'
    },
    {
      id: 'ai',
      label: 'AI Verifier Assistant',
      sublabel: 'Audit & Eligibility Check',
      icon: Sparkles,
      badge: 'AI Smart',
      activeGradient: 'from-fuchsia-600 to-pink-600 border-fuchsia-400/50 shadow-fuchsia-950/60',
      iconColor: 'text-fuchsia-400',
      activeIconBg: 'bg-fuchsia-700/90 text-white',
      badgeColor: 'bg-fuchsia-500/30 text-fuchsia-200 border-fuchsia-400/40'
    },
    {
      id: 'deploy',
      label: 'Deployment Guide',
      sublabel: 'Production & Server Hosting',
      icon: Rocket,
      badge: 'Setup',
      activeGradient: 'from-rose-600 to-orange-600 border-rose-400/50 shadow-rose-950/60',
      iconColor: 'text-rose-400',
      activeIconBg: 'bg-rose-700/90 text-white',
      badgeColor: 'bg-rose-500/30 text-rose-200 border-rose-400/40'
    },
    {
      id: 'security',
      label: 'Security & Privacy',
      sublabel: 'Aadhaar & Data Protection',
      icon: ShieldCheck,
      badge: 'ISO',
      activeGradient: 'from-slate-700 to-purple-800 border-purple-400/50 shadow-purple-950/60',
      iconColor: 'text-purple-400',
      activeIconBg: 'bg-purple-700/90 text-white',
      badgeColor: 'bg-purple-500/30 text-purple-200 border-purple-400/40'
    }
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs lg:hidden transition-opacity no-print"
        />
      )}

      {/* Main Sidebar Container - strictly w-72 matching workspace lg:pl-72 */}
      <aside 
        id="app-left-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0B132B] text-slate-100 flex flex-col border-r border-slate-800 shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 no-print ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header with Uploaded Official Logos (Logo 1 & Logo 2) */}
        <div className="p-4 border-b border-slate-800/80 bg-[#070D1E]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo 1: State Emblem of India & Logo 2: VB-GRAM G Act */}
              <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl shadow-xs border border-slate-700">
                <NationalEmblemLogo className="w-8 h-10 text-slate-900 drop-shadow-xs" />
                <div className="w-[1px] h-8 bg-slate-300 mx-0.5" />
                <VbGramGActLogo className="w-14 h-8 drop-shadow-xs" />
              </div>

              <div>
                <span className="text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
                  Govt. of West Bengal
                </span>
                <h1 className="text-sm font-black text-white leading-tight uppercase">
                  Bathuary Gram Panchayat
                </h1>
                <p className="text-[10px] text-amber-400 font-bold leading-none mt-0.5 tracking-tight">
                  VB-GRAM G Act • Viksit Bharat 2047
                </p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button 
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              aria-label="Close Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] px-2.5 py-1 rounded-lg bg-emerald-950/50 border border-emerald-800/50 text-emerald-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold">29 Canonical Villages</span>
            </span>
            <span className="text-slate-300 font-mono text-[10px]">Egra-II Development Block</span>
          </div>
        </div>

        {/* Scrollable Navigation Menu (100% English) */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-1">
            MAIN NAVIGATION
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id || (item.id === 'deploy' && currentTab === 'deployment') || (item.id === 'security' && currentTab === 'policy');
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => {
                  setCurrentTab(item.id);
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer group ${
                  isActive
                    ? `bg-gradient-to-r ${item.activeGradient} text-white font-bold shadow-lg border`
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg transition-transform group-hover:scale-110 ${isActive ? item.activeIconBg : `bg-slate-800/90 ${item.iconColor}`}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold leading-tight">
                      {item.label}
                    </span>
                    <span className={`block text-[10px] ${isActive ? 'text-white/90 font-medium' : 'text-slate-400'}`}>
                      {item.sublabel}
                    </span>
                  </div>
                </div>

                {item.badge && (
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    isActive 
                      ? 'bg-white/20 text-white border border-white/30 backdrop-blur-xs' 
                      : `${item.badgeColor} border`
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Google Sheet Live Status & Sync Box */}
        <div className="p-3 mx-3 mb-3 rounded-xl bg-slate-900/90 border border-slate-800/90 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span className="text-[11px] font-bold text-slate-200">Google Sheet Status</span>
            </div>
            {isPermanentlySaved ? (
              <span className="text-[9px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-600/70 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Permanent Live
              </span>
            ) : syncedSheetInfo && syncedSheetInfo.totalRecords > 0 ? (
              <span className="text-[9px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/60 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            ) : (
              <span className="text-[9px] font-bold bg-amber-950/60 text-amber-300 border border-amber-800/50 px-1.5 py-0.5 rounded-full">
                Pending
              </span>
            )}
          </div>

          <div className="text-[11px] text-slate-300 mb-2.5">
            {syncedSheetInfo && syncedSheetInfo.totalRecords > 0 ? (
              <div className="space-y-0.5">
                <p className="text-emerald-300 font-bold text-xs">
                  {syncedSheetInfo.totalRecords.toLocaleString()} Verified Citizens
                </p>
                <p className="text-[10px] text-slate-400">
                  {syncedSheetInfo.villagesCount} of 29 Villages Synced
                </p>
                {isPermanentlySaved && (
                  <p className="text-[9px] text-emerald-400/90 font-medium pt-0.5">
                    ✓ Permanent Server Config Active
                  </p>
                )}
              </div>
            ) : (
              <p className="text-slate-400 text-[10px] leading-relaxed">
                Connect your official Google Sheet to display live citizen records.
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <button
              id="sidebar-refresh-btn"
              onClick={onRefreshData}
              disabled={isSyncing}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl btn-3d-sync text-white font-bold text-xs cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-200' : ''}`} />
              <span>{isSyncing ? 'Syncing Live Sheet...' : 'Refresh Sheet Data'}</span>
            </button>
            <button
              id="sidebar-sheet-link-btn"
              onClick={onOpenSyncModal}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-emerald-300 font-bold text-[11px] border border-slate-700/80 transition-colors cursor-pointer"
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>Connect / Update Sheet Link</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
