import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardAnalytics } from './components/DashboardAnalytics';
import { DataUpdateForm } from './components/DataUpdateForm';
import { CitizenSearchCorner } from './components/CitizenSearchCorner';
import { VillagePdfReport } from './components/VillagePdfReport';
import { AiAssistant } from './components/AiAssistant';
import { DeploymentGuide } from './components/DeploymentGuide';
import { PolicyAndSecurity } from './components/PolicyAndSecurity';
import { PrintSlipModal } from './components/PrintSlipModal';
import { JobCardA5PrintModal } from './components/JobCardA5PrintModal';
import { GoogleSheetSyncModal } from './components/GoogleSheetSyncModal';
import { LoginPage } from './components/LoginPage';

import { BeneficiaryRow, AppUser, AnalyticsData, VillageStat, BankMasterItem, AuditLog, PERMANENT_BATHUARY_SHEET_URL } from './types';
import { INITIAL_BENEFICIARIES } from './data/initialRecords';
import { INITIAL_USERS } from './data/initialUsers';
import { INITIAL_BANK_MASTER, SANSAD_LIST, VILLAGES_LIST } from './data/bankMaster';
import { CANONICAL_29_VILLAGES, normalizeVillageName } from './utils/villageNormalizer';
import { CANONICAL_16_SANSADS, normalizeSansadName, isHeaderOrJunkSansad, sortSansads, extractSansadNumber } from './utils/sansadNormalizer';
import { safeStorage } from './utils/safeStorage';
import { NationalEmblemLogo, VbGramGActLogo } from './components/Emblems';
import { FileSpreadsheet, AlertCircle, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function App() {
  // Navigation: Default directly to Dashboard Analytics
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const language = 'en';

  // Authentication State (Official login: BATHUARY_002 / Bathuary@2580)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return safeStorage.getItem('bathuary_auth_logged_in') === 'true';
  });

  // Default active staff officer session
  const [currentUser, setCurrentUser] = useState<AppUser>(() => {
    const cachedUser = safeStorage.getItem('bathuary_auth_user');
    if (cachedUser) {
      try {
        return JSON.parse(cachedUser);
      } catch {
        // fallback
      }
    }
    return {
      name: 'BATHUARY_002',
      mobile: '9002736997',
      role: 'ADMIN',
      sansad: 'ALL',
      village: 'HATBAINCHA',
      status: 'ACTIVE',
      lastLogin: new Date().toLocaleDateString('en-IN')
    };
  });

  const handleLoginSuccess = (user: AppUser) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    safeStorage.removeItem('bathuary_auth_logged_in');
    safeStorage.removeItem('bathuary_auth_token');
    safeStorage.removeItem('bathuary_auth_user');
    setIsAuthenticated(false);
  };

  // Data Store
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryRow[]>(INITIAL_BENEFICIARIES);
  const [users, setUsers] = useState<AppUser[]>(INITIAL_USERS);
  const [bankMaster, setBankMaster] = useState<BankMasterItem[]>(INITIAL_BANK_MASTER);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [sansadList, setSansadList] = useState<string[]>(SANSAD_LIST);
  const [selectedSansad, setSelectedSansad] = useState<string>('ALL');

  // Active Category Filter for Reports
  const [categoryFilter, setCategoryFilter] = useState<'TOTAL' | 'DONE' | 'PENDING' | 'DEATH' | 'UNIQUE_CARDS' | null>(null);

  // Modals
  const [printRow, setPrintRow] = useState<BeneficiaryRow | null>(null);
  const [printA5Row, setPrintA5Row] = useState<BeneficiaryRow | null>(null);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState<boolean>(false);
  const [syncModalInitialMode, setSyncModalInitialMode] = useState<'sheetLink' | 'paste' | 'upload'>('sheetLink');
  const [activeAuditRow, setActiveAuditRow] = useState<BeneficiaryRow | null>(null);

  // Syncing state - permanently connected to Bathuary GP Google Sheet
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isSheetPermanentlySaved, setIsSheetPermanentlySaved] = useState<boolean>(true);

  // Helper to extract and sort clean sansads from records
  const updateSansadListFromRecords = (records: BeneficiaryRow[]) => {
    const extracted = sortSansads(
      Array.from(new Set(records.map(b => b.colB ? String(b.colB).trim() : ''))).filter(
        s => s && !isHeaderOrJunkSansad(s)
      )
    );
    if (extracted.length > 0) {
      setSansadList(extracted);
    } else {
      setSansadList(CANONICAL_16_SANSADS as unknown as string[]);
    }
  };

  // Fetch initial data from Express backend with Live Google Sheet check
  const fetchAllData = async (forceLiveSync: boolean = false) => {
    setIsSyncing(true);
    try {
      // Guarantee permanent sheet URL in safeStorage
      if (!safeStorage.getItem('bathuary_google_sheet_url')) {
        safeStorage.setItem('bathuary_google_sheet_url', PERMANENT_BATHUARY_SHEET_URL);
      }

      // Parallel fetch to load data immediately without waterfall latency
      const [cfgRes, bRes, uRes, aRes, bmRes] = await Promise.all([
        fetch('/api/google-sheet/config').catch(() => null),
        fetch(forceLiveSync ? '/api/google-sheet/refresh' : '/api/beneficiaries', {
          method: forceLiveSync ? 'POST' : 'GET',
          headers: forceLiveSync ? { 'Content-Type': 'application/json' } : {}
        }).catch(() => null),
        fetch('/api/users').catch(() => null),
        fetch('/api/audit-logs').catch(() => null),
        fetch('/api/bank-master').catch(() => null)
      ]);

      // 1. Process Google Sheet configuration
      if (cfgRes && cfgRes.ok) {
        try {
          const text = await cfgRes.text();
          if (text && text.trim().length > 0) {
            const cfgData = JSON.parse(text);
            if (cfgData.config?.sheetUrl) {
              setIsSheetPermanentlySaved(true);
              safeStorage.setItem('bathuary_google_sheet_url', cfgData.config.sheetUrl);
            }
          }
        } catch {
          // ignore
        }
      }

      // 2. Process Beneficiaries
      if (bRes && bRes.ok) {
        try {
          const rawText = await bRes.text();
          let bData: any = null;
          if (rawText && rawText.trim().length > 0) {
            bData = JSON.parse(rawText);
          }
          const list = bData?.beneficiaries;
          if (Array.isArray(list) && list.length > 0) {
            const normalized = list.map((b: BeneficiaryRow) => {
              const normVillage = normalizeVillageName(b.colV, b.colB);
              return {
                ...b,
                colV: normVillage,
                colB: normalizeSansadName(b.colB, normVillage) || 'SANSAD-I'
              };
            });
            setBeneficiaries(normalized);

            if (bData.sansadList && Array.isArray(bData.sansadList) && bData.sansadList.length > 0) {
              setSansadList(bData.sansadList);
            } else {
              updateSansadListFromRecords(normalized);
            }
          }
        } catch (e) {
          console.warn("Error parsing beneficiaries:", e);
        }
      }

      // 3. Process Users
      if (uRes && uRes.ok) {
        try {
          const uData = await uRes.json();
          if (uData.users && Array.isArray(uData.users)) {
            setUsers(uData.users);
          }
        } catch {}
      }

      // 4. Process Audit Logs
      if (aRes && aRes.ok) {
        try {
          const aData = await aRes.json();
          if (aData.logs && Array.isArray(aData.logs)) {
            setAuditLogs(aData.logs);
          }
        } catch {}
      }

      // 5. Process Bank Master
      if (bmRes && bmRes.ok) {
        try {
          const bmData = await bmRes.json();
          if (bmData.banks && Array.isArray(bmData.banks)) {
            setBankMaster(bmData.banks);
          }
        } catch {}
      }
    } catch (err) {
      console.warn("Backend API not reachable yet:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Continuous background 30-second live polling for permanent Google Sheet updates
  useEffect(() => {
    let lastKnownSyncTime = '';
    const livePollingInterval = setInterval(async () => {
      try {
        const statusRes = await fetch('/api/google-sheet/status');
        if (statusRes.ok) {
          const text = await statusRes.text();
          let statusData: any = null;
          try {
            statusData = JSON.parse(text);
          } catch {}
          if (statusData && statusData.isSaved) {
            setIsSheetPermanentlySaved(true);
            // Only fetch 4MB full dataset if server has performed a new sync timestamp
            if (statusData.lastSyncTimestamp && statusData.lastSyncTimestamp !== lastKnownSyncTime) {
              lastKnownSyncTime = statusData.lastSyncTimestamp;
              const bRes = await fetch('/api/beneficiaries');
              if (bRes.ok) {
                const bText = await bRes.text();
                let bData: any = null;
                try {
                  bData = JSON.parse(bText);
                } catch {}
                if (bData?.beneficiaries && Array.isArray(bData.beneficiaries) && bData.beneficiaries.length > 0) {
                  const normalized = bData.beneficiaries.map((b: BeneficiaryRow) => {
                    const normVillage = normalizeVillageName(b.colV, b.colB);
                    return {
                      ...b,
                      colV: normVillage,
                      colB: normalizeSansadName(b.colB, normVillage) || 'SANSAD-I'
                    };
                  });
                  setBeneficiaries(normalized);
                }
              }
            }
          }
        }
      } catch {
        // quiet error
      }
    }, 30000);

    return () => clearInterval(livePollingInterval);
  }, []);

  useEffect(() => {
    fetchAllData();
  }, []);

  // Filter Beneficiaries by Sansad (handles exact string as well as Roman/number equivalence)
  const filteredBeneficiaries = useMemo(() => {
    if (!selectedSansad || selectedSansad === 'ALL') return beneficiaries;
    const target = selectedSansad.trim().toUpperCase();
    return beneficiaries.filter(b => {
      const bSansad = (b.colB || '').trim().toUpperCase();
      if (bSansad === target) return true;
      const numB = extractSansadNumber(bSansad);
      const numTarget = extractSansadNumber(target);
      if (numB !== null && numTarget !== null && numB === numTarget) return true;
      return false;
    });
  }, [beneficiaries, selectedSansad]);

  const total = filteredBeneficiaries.length;
  let done = 0;
  let pending = 0;
  let death = 0;
  let abpsActive = 0;
  let aadhaarSeeded = 0;

  // STRICT 29 CANONICAL VILLAGES: Initialize map with exactly the 29 canonical villages
  const villageStatsMap: Record<string, VillageStat> = {};
  CANONICAL_29_VILLAGES.forEach(v => {
    villageStatsMap[v] = { village: v, sansad: '', total: 0, done: 0, pending: 0, death: 0 };
  });

  filteredBeneficiaries.forEach(row => {
    const kyc = (row.colR || '').toUpperCase();
    const err = (row.colT || '').toLowerCase();
    const abps = (row.colO || '').toUpperCase();

    if (kyc === 'YES' || kyc === 'Y') {
      done++;
    } else if (err.includes('death') || err.includes('expired') || err.includes('died')) {
      death++;
    } else {
      pending++;
    }

    if (abps === 'YES' || abps === 'Y') abpsActive++;
    if (row.colP && row.colP.length === 12) aadhaarSeeded++;

    // Strict normalization to 29 canonical villages
    const v = normalizeVillageName(row.colV, row.colB);
    if (!villageStatsMap[v]) {
      villageStatsMap[v] = { village: v, sansad: row.colB, total: 0, done: 0, pending: 0, death: 0 };
    }
    villageStatsMap[v].total++;
    if (kyc === 'YES' || kyc === 'Y') {
      villageStatsMap[v].done++;
    } else if (err.includes('death') || err.includes('expired') || err.includes('died')) {
      villageStatsMap[v].death++;
    } else {
      villageStatsMap[v].pending++;
    }
  });

  const analytics: AnalyticsData = {
    total,
    done,
    pending,
    death,
    donePct: total ? Math.round((done / total) * 100) : 0,
    pendingPct: total ? Math.round((pending / total) * 100) : 0,
    deathPct: total ? Math.round((death / total) * 100) : 0,
    abpsActive,
    aadhaarSeeded
  };

  // Village stats include canonical 29 villages, plus 'No Village Name' if unassigned applicants exist
  const allVillageKeys = [...CANONICAL_29_VILLAGES];
  if (villageStatsMap['No Village Name'] && villageStatsMap['No Village Name'].total > 0) {
    allVillageKeys.push('No Village Name');
  }

  const villageStats: VillageStat[] = allVillageKeys.map(
    vName => villageStatsMap[vName] || { village: vName, sansad: '', total: 0, done: 0, pending: 0, death: 0 }
  ).sort((a, b) => b.total - a.total);

  // Save Record Handler
  const handleSaveRecord = async (formData: Partial<BeneficiaryRow> & { changedFields?: string[]; fieldUpdates?: Record<string, any> }): Promise<{ success: boolean; googleSheetSynced?: boolean; googleSheetMessage?: string }> => {
    try {
      const normalizedColV = formData.colV !== undefined
        ? (formData.colV === 'No Village Name' ? 'No Village Name' : normalizeVillageName(formData.colV || '', formData.colB || ''))
        : undefined;

      const payload: any = {
        ...formData,
        updatedBy: `${currentUser.name} (${currentUser.mobile})`
      };
      if (normalizedColV !== undefined) {
        payload.colV = normalizedColV;
      }

      const res = await fetch('/api/beneficiaries/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setBeneficiaries(prev => prev.map(b => b.rowIndex === formData.rowIndex ? { ...b, ...formData } : b));
        setAuditLogs(prev => [
          {
            timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            jobCardNumber: formData.colH || 'WB-14-012...',
            beneficiaryName: formData.colJ || 'Beneficiary',
            updatedBy: currentUser.name
          },
          ...prev
        ]);
        return {
          success: true,
          googleSheetSynced: data.googleSheetSynced,
          googleSheetMessage: data.googleSheetMessage
        };
      }
    } catch (err) {
      console.error("Save error:", err);
    }
    setBeneficiaries(prev => prev.map(b => b.rowIndex === formData.rowIndex ? { ...b, ...formData } : b));
    return { success: true };
  };

  // Bulk Data Imported from Excel or Google Sheet
  const handleDataImported = async (newRows: BeneficiaryRow[]) => {
    const normalized = newRows.map(r => {
      const v = normalizeVillageName(r.colV, r.colB);
      return {
        ...r,
        colV: v,
        colB: normalizeSansadName(r.colB, v) || 'SANSAD-I'
      };
    });

    setBeneficiaries(normalized);
    updateSansadListFromRecords(normalized);

    try {
      await fetch('/api/beneficiaries/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ beneficiaries: normalized })
      });
    } catch (err) {
      console.warn("Failed to synchronize imported data with server cache:", err);
    }
  };

  // Add User Handler
  const handleAddUser = async (newUser: Partial<AppUser>): Promise<boolean> => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      if (res.ok) {
        setUsers(prev => [...prev, newUser as AppUser]);
        return true;
      }
    } catch (err) {
      console.error("Add user error:", err);
    }
    setUsers(prev => [...prev, newUser as AppUser]);
    return true;
  };

  // Delete User Handler
  const handleDeleteUser = async (mobile: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/users/${mobile}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.mobile !== mobile));
        return true;
      }
    } catch (err) {
      console.error("Delete user error:", err);
    }
    setUsers(prev => prev.filter(u => u.mobile !== mobile));
    return true;
  };

  // Switch to report by category
  const handleSelectCategoryReport = (type: 'TOTAL' | 'DONE' | 'PENDING' | 'DEATH' | 'UNIQUE_CARDS') => {
    setCategoryFilter(type);
    setCurrentTab('reports');
  };

  // If not authenticated, present the Enhanced 3D Official Login Page with Read-Only Badges
  if (!isAuthenticated) {
    return (
      <LoginPage 
        onLoginSuccess={handleLoginSuccess}
        beneficiaries={beneficiaries}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex selection:bg-emerald-600 selection:text-white font-sans antialiased">
      {/* 
        LEFT-ALIGNED SIDEBAR NAVIGATION 
        Dashboard, Citizen Search, Data Update Form, Village Report, AI Helpdesk, Deployment Guide, Policy & Security
      */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isSyncing={isSyncing}
        onRefreshData={fetchAllData}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        syncedSheetInfo={{
          totalRecords: beneficiaries.length,
          villagesCount: new Set(beneficiaries.map(b => b.colV)).size
        }}
        isPermanentlySaved={isSheetPermanentlySaved}
      />

      {/* RIGHT MAIN WORKSPACE (Adjusted for left sidebar) */}
      <div className={`lg:pl-72 flex-1 flex flex-col min-h-screen w-full transition-all duration-300 print:pl-0 print:m-0 print:w-full ${(printRow || printA5Row) ? 'no-print' : ''}`}>
        
        {/* Header with Branding, User Profile and Mobile Sidebar Toggle */}
        <Header
          currentTab={currentTab}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          isSyncing={isSyncing}
          onRefreshData={() => fetchAllData(true)}
          onOpenSyncModal={() => setIsSyncModalOpen(true)}
          syncedSheetInfo={{
            totalRecords: beneficiaries.length,
            villagesCount: new Set(beneficiaries.map(b => b.colV)).size
          }}
          isPermanentlySaved={isSheetPermanentlySaved}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 print:max-w-none print:p-0 print:m-0 print:w-full">
          
          {/* Permanent Google Sheet Connectivity Notice (Shown only during initial load if records array is loading) */}
          {beneficiaries.length === 0 && (
            <div className="mb-6 p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl text-white shadow-xl border border-emerald-500/30 no-print">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span>Google Sheet Permanently Linked • Bathuary GP</span>
                  </div>
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    {isSyncing ? 'গুগল স্প্রেডশীট থেকে লাইভ ডাটা লোড হচ্ছে...' : 'লাইভ গুগল স্প্রেডশীট সংযোগ সক্রিয়'}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    বাথুয়ারী গ্রাম পঞ্চায়েতের অফিসিয়াল গুগল স্প্রেডশীট স্থায়ীভাবে সংযুক্ত রয়েছে (Permanent Link Active)। পুনরায় লিঙ্ক দেওয়ার প্রয়োজন নেই।
                  </p>
                </div>
                <button
                  onClick={() => fetchAllData(true)}
                  disabled={isSyncing}
                  className="px-5 py-3 rounded-2xl btn-3d-sync text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer shrink-0 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Loading Live Data...' : '🔄 Re-Sync Now'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: Dashboard Analytics */}
          {currentTab === 'dashboard' && (
            <DashboardAnalytics
              analytics={analytics}
              villageStats={villageStats}
              sansadList={sansadList}
              selectedSansad={selectedSansad}
              onSansadChange={setSelectedSansad}
              onSelectCategoryReport={handleSelectCategoryReport}
              onOpenSyncModal={() => setIsSyncModalOpen(true)}
              language={language}
              beneficiaries={filteredBeneficiaries}
            />
          )}

          {/* TAB 2: Citizen Search Corner */}
          {currentTab === 'search' && (
            <CitizenSearchCorner
              beneficiaries={beneficiaries}
              onPrintSlip={(row) => setPrintRow(row)}
              onPrintA5Slip={(row) => setPrintA5Row(row)}
            />
          )}

          {/* TAB 3: Data Update Form */}
          {currentTab === 'dataForm' && (
            <DataUpdateForm
              beneficiaries={beneficiaries}
              bankMaster={bankMaster}
              currentUser={currentUser}
              onSaveRecord={handleSaveRecord}
              onPrintSlip={(row) => setPrintRow(row)}
              onPrintA5Slip={(row) => setPrintA5Row(row)}
              onOpenSyncModal={(mode) => {
                setSyncModalInitialMode(mode || 'sheetLink');
                setIsSyncModalOpen(true);
              }}
              language={language}
            />
          )}

          {/* TAB 4: Village PDF Report */}
          {currentTab === 'reports' && (
            <VillagePdfReport
              beneficiaries={beneficiaries}
              initialCategoryFilter={categoryFilter}
              initialSansadFilter={selectedSansad !== 'ALL' ? selectedSansad : undefined}
              onPrintSlip={(row) => setPrintRow(row)}
              onPrintA5Slip={(row) => setPrintA5Row(row)}
              language={language}
            />
          )}

          {/* TAB 5: AI Assistant */}
          {currentTab === 'ai' && (
            <AiAssistant
              beneficiaries={beneficiaries}
              activeAuditRow={activeAuditRow}
              language={language}
            />
          )}

          {/* TAB 6: Deployment Guide */}
          {(currentTab === 'deploy' || currentTab === 'deployment') && (
            <DeploymentGuide language={language} />
          )}

          {/* TAB 8: Security & Privacy */}
          {(currentTab === 'security' || currentTab === 'policy') && (
            <PolicyAndSecurity language={language} />
          )}
        </main>

        {/* Official Footer without Helpline Number */}
        <footer className="bg-white border-t border-slate-200 py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 no-print mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 p-1 bg-white rounded-lg border border-slate-200 shadow-2xs">
                <NationalEmblemLogo className="w-5 h-7 text-slate-900" />
                <div className="w-[1px] h-6 bg-slate-200" />
                <VbGramGActLogo className="w-12 h-6" />
              </div>
              <div>
                <span className="font-bold text-slate-800">
                  Bathuary Gram Panchayat • VB-GRAM G Act Field Unit
                </span>
                <span className="text-slate-300 mx-2 hidden sm:inline">•</span>
                <span className="text-slate-500 hidden sm:inline">Hatbaincha, Egra-II Development Block, Purba Medinipur</span>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <p className="font-semibold text-slate-700">
                © 2026 Bathuary Gram Panchayat, Dept. of Panchayats & Rural Development, Govt. of West Bengal.
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Portal: <span className="font-mono text-emerald-700 font-bold">29 Canonical Villages Normalized</span> • Viksit Bharat 2047
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* Standard Print Slip Modal */}
      {printRow && (
        <PrintSlipModal
          row={printRow}
          onClose={() => setPrintRow(null)}
          language={language}
        />
      )}

      {/* A5 Job Card & e-KYC Print Certificate Modal */}
      {printA5Row && (
        <JobCardA5PrintModal
          row={printA5Row}
          allBeneficiaries={beneficiaries}
          onClose={() => setPrintA5Row(null)}
        />
      )}

      {/* Google Sheet & Excel Data Sync Modal */}
      {isSyncModalOpen && (
        <GoogleSheetSyncModal
          onClose={() => setIsSyncModalOpen(false)}
          onDataImported={handleDataImported}
          currentCount={beneficiaries.length}
          initialMode={syncModalInitialMode}
        />
      )}
    </div>
  );
}
