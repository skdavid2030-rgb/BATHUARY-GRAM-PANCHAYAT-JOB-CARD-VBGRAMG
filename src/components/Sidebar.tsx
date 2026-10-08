import React from 'react';
import { 
  BarChart3,
  Search, 
  UserCheck, 
  FileText, 
  Sparkles, 
  Rocket, 
  X,
  ShieldCheck
} from 'lucide-react';
import { NationalEmblemLogo, VbGramGActLogo } from './Emblems';
import { AppLanguage } from '../utils/i18n';

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
  language?: AppLanguage;
  onLanguageChange?: (lang: AppLanguage) => void;
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
  isPermanentlySaved,
  language = 'bn',
  onLanguageChange = () => {}
}) => {
  const isBn = language === 'bn';

  const navItems = [
    {
      id: 'dashboard',
      label: isBn ? 'অ্যানালিটিক্স ড্যাশবোর্ড' : 'Analytics Dashboard',
      sublabel: isBn ? 'সারসংক্ষেপ ও ২৯টি গ্রাম' : 'Overview & 29 Villages',
      icon: BarChart3,
      badge: 'Live',
      activeGradient: 'from-amber-600 to-orange-600 border-amber-400/50 shadow-amber-950/60',
      iconColor: 'text-amber-400',
      activeIconBg: 'bg-amber-700/90 text-white',
      badgeColor: 'bg-amber-500/30 text-amber-200 border-amber-400/40'
    },
    {
      id: 'search',
      label: isBn ? 'নাগরিক অনুসন্ধান কর্নার' : 'Citizen Search Corner',
      sublabel: isBn ? 'জব কার্ড ও আধার অনুসন্ধান' : 'Job Card & Aadhaar Search',
      icon: Search,
      badge: 'Search',
      activeGradient: 'from-blue-600 to-indigo-600 border-blue-400/50 shadow-blue-950/60',
      iconColor: 'text-blue-400',
      activeIconBg: 'bg-blue-700/90 text-white',
      badgeColor: 'bg-blue-500/30 text-blue-200 border-blue-400/40'
    },
    {
      id: 'dataForm',
      label: isBn ? 'ডাটা আপডেট ফর্ম' : 'Data Update Form',
      sublabel: isBn ? 'ফিল্ড অফিসার e-KYC এন্ট্রি' : 'Field Officer e-KYC Entry',
      icon: UserCheck,
      badge: 'e-KYC',
      activeGradient: 'from-teal-600 to-emerald-600 border-teal-400/50 shadow-teal-950/60',
      iconColor: 'text-teal-400',
      activeIconBg: 'bg-teal-700/90 text-white',
      badgeColor: 'bg-teal-500/30 text-teal-200 border-teal-400/40'
    },
    {
      id: 'reports',
      label: isBn ? 'গ্রাম রিপোর্ট ও PDF' : 'Village Report & PDF',
      sublabel: isBn ? 'অফিসিয়াল PDF স্লিপ ও তালিকা' : 'Official PDF Slips & Lists',
      icon: FileText,
      badge: 'A4 Print',
      activeGradient: 'from-indigo-600 to-purple-600 border-indigo-400/50 shadow-indigo-950/60',
      iconColor: 'text-indigo-400',
      activeIconBg: 'bg-indigo-700/90 text-white',
      badgeColor: 'bg-indigo-500/30 text-indigo-200 border-indigo-400/40'
    },
    {
      id: 'ai',
      label: isBn ? 'AI ভেরিফায়ার সহকারী' : 'AI Verifier Assistant',
      sublabel: isBn ? 'অডিট ও যোগ্যতা যাচাই' : 'Audit & Eligibility Check',
      icon: Sparkles,
      badge: 'AI Smart',
      activeGradient: 'from-fuchsia-600 to-pink-600 border-fuchsia-400/50 shadow-fuchsia-950/60',
      iconColor: 'text-fuchsia-400',
      activeIconBg: 'bg-fuchsia-700/90 text-white',
      badgeColor: 'bg-fuchsia-500/30 text-fuchsia-200 border-fuchsia-400/40'
    },
    {
      id: 'deploy',
      label: isBn ? 'ডেপ্লয়মেন্ট গাইড' : 'Deployment Guide',
      sublabel: isBn ? 'হোস্টিং ও সার্ভার নির্দেশিকা' : 'Production & Server Hosting',
      icon: Rocket,
      badge: 'Setup',
      activeGradient: 'from-rose-600 to-orange-600 border-rose-400/50 shadow-rose-950/60',
      iconColor: 'text-rose-400',
      activeIconBg: 'bg-rose-700/90 text-white',
      badgeColor: 'bg-rose-500/30 text-rose-200 border-rose-400/40'
    },
    {
      id: 'security',
      label: isBn ? 'নিরাপত্তা ও প্রাইভেসি' : 'Security & Privacy',
      sublabel: isBn ? 'আধার ও তথ্য সুরক্ষা' : 'Aadhaar & Data Protection',
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
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-gradient-to-b from-[#501503] via-[#380E02] to-[#200601] text-amber-50 flex flex-col border-r border-amber-800/80 shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 no-print ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header with Uploaded Official Logos (Logo 1 & Logo 2) */}
        <div className="p-4 border-b border-amber-700/80 bg-gradient-to-r from-[#601904] to-[#481102]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Official Logos: State Emblem of India & VB-GRAM G Act */}
              <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl shadow-md border border-amber-200/80">
                <NationalEmblemLogo className="w-6 h-8 text-slate-900 drop-shadow-xs" />
                <div className="w-[1px] h-7 bg-slate-200" />
                <VbGramGActLogo className="w-10 h-7 drop-shadow-xs" />
              </div>

              <div>
                <span className="text-[10px] font-bold tracking-wider text-amber-300 uppercase">
                  {isBn ? 'পশ্চিমবঙ্গ সরকার' : 'Govt. of West Bengal'}
                </span>
                <h1 className="text-xs font-black text-white leading-tight uppercase drop-shadow-xs">
                  {isBn ? 'বাথুয়ারী গ্রাম পঞ্চায়েত' : 'Bathuary Gram Panchayat'}
                </h1>
                <p className="text-[10px] text-amber-200 font-bold leading-none mt-0.5 tracking-tight">
                  {isBn ? '১২৫ দিনের কাজ • আধার e-KYC' : '125 Days Work • e-KYC'}
                </p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button 
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-md text-amber-300 hover:text-white hover:bg-amber-900/80 cursor-pointer"
              aria-label="Close Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] px-2.5 py-1.5 rounded-lg bg-[#2A0D04]/90 border border-amber-700/60 text-amber-200 shadow-inner">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-emerald-300">29 Canonical Villages</span>
            </span>
            <span className="text-amber-200/90 font-mono text-[10px]">Egra-II Development Block</span>
          </div>
        </div>

        {/* Scrollable Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-amber-900">
          <div className="flex items-center justify-between px-3 pb-2 pt-0.5">
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-300/90 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              MAIN NAVIGATION
            </p>
            <span className="text-[9px] font-bold text-amber-400/80 uppercase tracking-wider bg-amber-950/70 px-1.5 py-0.5 rounded border border-amber-800/60">
              PORTAL
            </span>
          </div>

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
                    : 'text-amber-100/90 hover:text-white hover:bg-amber-900/40 border border-transparent hover:border-amber-700/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg transition-transform group-hover:scale-110 ${isActive ? item.activeIconBg : `bg-amber-950/70 border border-amber-800/50 ${item.iconColor}`}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold leading-tight">
                      {item.label}
                    </span>
                    <span className={`block text-[10px] ${isActive ? 'text-white/95 font-medium' : 'text-amber-200/70'}`}>
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
      </aside>
    </>
  );
};
