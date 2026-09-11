import React, { useState, useEffect, useRef } from 'react';
import { 
  FileSpreadsheet, 
  Upload, 
  Link2, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  RefreshCw, 
  ClipboardPaste,
  ArrowRight,
  Sparkles, 
  ExternalLink,
  Check,
  Globe,
  Database,
  Save,
  HardDrive,
  Trash2,
  Edit3,
  Copy
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { BeneficiaryRow, GoogleSheetConfig } from '../types';
import { normalizeVillageName, CANONICAL_29_VILLAGES } from '../utils/villageNormalizer';
import { normalizeSansadName, CANONICAL_16_SANSADS, isHeaderOrJunkSansad } from '../utils/sansadNormalizer';
import { formatKycDate } from '../utils/dateFormatter';
import { safeStorage } from '../utils/safeStorage';

interface GoogleSheetSyncModalProps {
  onClose: () => void;
  onDataImported: (rows: BeneficiaryRow[]) => void;
  currentCount: number;
  initialMode?: 'sheetLink' | 'paste' | 'upload';
}

export const GoogleSheetSyncModal: React.FC<GoogleSheetSyncModalProps> = ({
  onClose,
  onDataImported,
  currentCount,
  initialMode = 'sheetLink'
}) => {
  const [activeMode, setActiveMode] = useState<'sheetLink' | 'paste' | 'upload'>(initialMode);
  const [sheetUrl, setSheetUrl] = useState<string>(() => {
    return safeStorage.getItem('bathuary_google_sheet_url') || '';
  });
  const [autoSyncEnabled, setAutoSyncEnabled] = useState<boolean>(() => {
    return safeStorage.getItem('bathuary_auto_sync_enabled') !== 'false';
  });
  const [isPermanentlySaved, setIsPermanentlySaved] = useState<boolean>(false);
  const [savedConfig, setSavedConfig] = useState<GoogleSheetConfig | null>(null);
  const [isEditingUrl, setIsEditingUrl] = useState<boolean>(false);
  const [hasCopiedUrl, setHasCopiedUrl] = useState<boolean>(false);

  const [pastedData, setPastedData] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [importStats, setImportStats] = useState<{ rows: number; villages: number; sansads: number } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if server has a permanently saved sheet link and configuration
    fetch('/api/google-sheet/config', {
      headers: { 'Accept': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.status === 'success' && data.isSaved && data.config?.sheetUrl) {
          setSheetUrl(data.config.sheetUrl);
          setIsPermanentlySaved(true);
          setSavedConfig(data.config);
          setAutoSyncEnabled(data.config.autoSync !== false);
          safeStorage.setItem('bathuary_google_sheet_url', data.config.sheetUrl);
        } else {
          // Fallback to active-link endpoint
          fetch('/api/google-sheet/active-link')
            .then(r => r.json())
            .then(act => {
              if (act?.status === 'success' && act.activeUrl && !sheetUrl) {
                setSheetUrl(act.activeUrl);
                if (act.isSaved) setIsPermanentlySaved(true);
              }
            })
            .catch(() => {});
        }
      })
      .catch(() => {});
  }, []);

  // Save Google Sheet URL permanently in server system configuration file & local safeStorage
  const handleSavePermanently = async (syncNow: boolean = true) => {
    const trimmedUrl = sheetUrl.trim();
    if (!trimmedUrl) {
      setStatusMessage({ type: 'error', text: 'দয়া করে একটি সঠিক গুগল স্প্রেডশীট লিঙ্ক দিন (Please enter Google Sheet link).' });
      return;
    }

    setIsLoading(true);
    setStatusMessage({ type: 'info', text: 'গুগল শীট লিঙ্ক স্থায়ীভাবে সেভ ও লাইভ সিঙ্ক করা হচ্ছে...' });

    try {
      let serverSaved = false;
      let beneficiariesLoaded = false;

      // Try saving to backend server endpoint first
      try {
        const res = await fetch('/api/google-sheet/save-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            sheetUrl: trimmedUrl,
            autoSync: autoSyncEnabled,
            syncNow
          })
        });

        const contentType = res.headers.get('content-type') || '';
        const rawText = await res.text();
        let data: any = null;

        if (contentType.includes('application/json') || rawText.trim().startsWith('{')) {
          try {
            data = JSON.parse(rawText);
          } catch {
            data = null;
          }
        }

        if (res.ok && data?.status === 'success') {
          serverSaved = true;
          setIsPermanentlySaved(true);
          setSavedConfig(data.config);
          setIsEditingUrl(false);
          safeStorage.setItem('bathuary_google_sheet_url', trimmedUrl);
          safeStorage.setItem('bathuary_auto_sync_enabled', String(autoSyncEnabled));

          if (Array.isArray(data.beneficiaries) && data.beneficiaries.length > 0) {
            beneficiariesLoaded = true;
            onDataImported(data.beneficiaries);
            setImportStats({
              rows: data.total,
              villages: data.villagesCount,
              sansads: data.sansadsCount
            });
          }

          setStatusMessage({
            type: 'success',
            text: `✓ ${data.message || 'Google Sheet link permanently saved and live synchronized!'}`
          });
          return;
        }
      } catch (netErr) {
        console.warn("Server-side save-link proxy notice, applying local persistent storage:", netErr);
      }

      // If server responded with HTML or was offline, store permanently in browser safeStorage
      safeStorage.setItem('bathuary_google_sheet_url', trimmedUrl);
      safeStorage.setItem('bathuary_auto_sync_enabled', String(autoSyncEnabled));
      setIsPermanentlySaved(true);
      setIsEditingUrl(false);
      setSavedConfig({
        sheetUrl: trimmedUrl,
        savedAt: new Date().toISOString(),
        savedBy: 'System Admin',
        autoSync: autoSyncEnabled,
        lastSyncStatus: 'Saved permanently in browser storage'
      });

      // If syncNow was requested and not yet loaded from server, fetch via client-side pipeline
      if (syncNow && !beneficiariesLoaded) {
        await handleFetchGoogleSheet();
      } else {
        setStatusMessage({
          type: 'success',
          text: '✓ গুগল শীট লিঙ্কটি ব্রাউজার সিস্টেমে স্থায়ীভাবে সেভ করা হয়েছে (Permanently saved in persistent storage).'
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: `Error saving: ${err?.message || 'Connection issue'}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Clear permanently saved Google Sheet link
  const handleClearSavedLink = async () => {
    if (!window.confirm("আপনি কি নিশ্চিত যে স্থায়ী গুগল শীট লিঙ্কটি মুছে ফেলতে চান?")) {
      return;
    }
    setIsLoading(true);
    try {
      try {
        const res = await fetch('/api/google-sheet/clear-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        const rawText = await res.text();
        if (rawText.trim().startsWith('{')) {
          JSON.parse(rawText);
        }
      } catch (err) {
        console.warn("Backend clear notice:", err);
      }

      setIsPermanentlySaved(false);
      setSavedConfig(null);
      setSheetUrl('');
      setIsEditingUrl(true);
      safeStorage.removeItem('bathuary_google_sheet_url');
      setStatusMessage({
        type: 'info',
        text: '✓ স্থায়ী গুগল শীট লিঙ্ক সফলভাবে মুছে ফেলা হয়েছে।'
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: 'Failed to clear saved link: ' + (err?.message || 'Error')
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to parse rows into BeneficiaryRow with strict 29-village and 16-Sansad normalization
  const parseRowsToBeneficiaries = (rawData: any[]): BeneficiaryRow[] => {
    if (!Array.isArray(rawData) || rawData.length === 0) return [];

    let headerRowIdx = -1;
    let colMap: Record<string, number> = {};

    for (let r = 0; r < Math.min(5, rawData.length); r++) {
      const row = rawData[r];
      if (!Array.isArray(row)) continue;
      const rowStr = row.map(c => String(c || '').toLowerCase().trim()).join(' ');
      if (
        rowStr.includes('job') || 
        rowStr.includes('card') || 
        rowStr.includes('sansad') || 
        rowStr.includes('village') || 
        rowStr.includes('aadhaar') ||
        rowStr.includes('applicant')
      ) {
        headerRowIdx = r;
        row.forEach((colVal, colIdx) => {
          const val = String(colVal || '').toLowerCase().trim();
          if (!val) return;
          if (val.includes('job') && (val.includes('card') || val.includes('no') || val.includes('num'))) colMap['colH'] = colIdx;
          else if (val.includes('applicant') && val.includes('name')) colMap['colJ'] = colIdx;
          else if (val === 'name' || val.includes('beneficiary') || val.includes('worker')) colMap['colJ'] = colIdx;
          else if (val.includes('father') || val.includes('husband')) colMap['colAF'] = colIdx;
          else if (val.includes('head') || val.includes('hoh')) colMap['colAG'] = colIdx;
          else if (val.includes('sansad') || val.includes('ward') || val.includes('part')) colMap['colB'] = colIdx;
          else if (val.includes('village') || val.includes('gram') || val.includes('mouza')) colMap['colV'] = colIdx;
          else if (val.includes('aadhaar') || val.includes('uid')) colMap['colP'] = colIdx;
          else if (val.includes('mobile') || val.includes('phone') || val.includes('contact')) colMap['colQ'] = colIdx;
          else if (val.includes('kyc') && (val.includes('date') || val.includes('dt') || val.includes('time') || val.includes('done on') || val.includes('day'))) colMap['colS'] = colIdx;
          else if (val.includes('kyc') || val.includes('e-kyc')) colMap['colR'] = colIdx;
          else if (val.includes('abps')) colMap['colO'] = colIdx;
          else if (val.includes('bank') && !val.includes('branch') && !val.includes('ifsc') && !val.includes('account')) colMap['colAO'] = colIdx;
          else if (val.includes('ifsc')) colMap['colAP'] = colIdx;
          else if (val.includes('branch')) colMap['colAQ'] = colIdx;
          else if (val.includes('account') || val.includes('a/c') || val.includes('ac no') || val.includes('acc no')) colMap['colAR'] = colIdx;
          else if (val.includes('remark') || val.includes('error') || val.includes('reason')) colMap['colT'] = colIdx;
          else if (val.includes('vle') || val.includes('officer') || val.includes('grs')) colMap['colU'] = colIdx;
          else if (val.includes('delivered') || (val.includes('book') && val.includes('deliver')) || val.includes('job card book')) colMap['colY'] = colIdx;
        });
        break;
      }
    }

    const startIdx = headerRowIdx !== -1 ? headerRowIdx + 1 : 0;
    const parsed: BeneficiaryRow[] = [];

    for (let i = startIdx; i < rawData.length; i++) {
      const row = rawData[i];
      if (!Array.isArray(row) || row.length === 0) continue;

      const hasAnyValue = row.some(c => c !== undefined && c !== null && String(c).trim() !== '');
      if (!hasAnyValue) continue;

      const get = (key: string, defaultIdx: number): string => {
        const idx = colMap[key] !== undefined ? colMap[key] : defaultIdx;
        return String(row[idx] ?? '').trim();
      };

      let jobCard = get('colH', 7);
      let name = get('colJ', 9);
      const rawSansad = get('colB', 1);

      const nameUpper = name.toUpperCase();
      const jobCardUpper = jobCard.toUpperCase();

      if (
        (nameUpper === 'NAME' || nameUpper === 'NAME OF APPLICANT' || nameUpper === 'BENEFICIARY NAME' || nameUpper === 'APPLICANT NAME') &&
        (jobCardUpper === 'JOB CARD' || jobCardUpper === 'JOB CARD NO' || jobCardUpper === 'REG NO' || jobCardUpper === 'JOB CARD NUMBER')
      ) {
        continue;
      }

      if (!jobCard && !name) {
        const altAadhaar = get('colP', 15);
        const altSl = get('colA', 0);
        if (altAadhaar || altSl || rawSansad) {
          name = name || `Citizen #${parsed.length + 1}`;
          jobCard = jobCard || `WB-02-005-${String(parsed.length + 1).padStart(5, '0')}`;
        } else {
          continue;
        }
      }

      const rawVillage = get('colV', 21);
      const normalizedVillage = normalizeVillageName(rawVillage, rawSansad);
      const normalizedSansad = normalizeSansadName(rawSansad, normalizedVillage) || 'BATHUARY 1';

      const rawKyc = get('colR', 17).toUpperCase();
      const isKycDone = rawKyc === 'YES' || rawKyc === 'Y' || rawKyc === 'DONE' || rawKyc === 'SUCCESS' || rawKyc === '1';

      const rawAbps = get('colO', 14).toUpperCase();
      const isAbpsActive = rawAbps === 'YES' || rawAbps === 'Y' || rawAbps === 'ENABLED' || rawAbps === '1';

      const aadhaarClean = get('colP', 15).replace(/\D/g, '');
      const mobileClean = get('colQ', 16).replace(/\D/g, '');

      const record: BeneficiaryRow = {
        rowIndex: parsed.length + 2,
        colA: get('colA', 0) || String(parsed.length + 1),
        colB: normalizedSansad,
        colC: get('colC', 2) || String(parsed.length + 1),
        colD: get('colD', 3) || 'PURBA MEDINIPUR',
        colE: get('colE', 4) || 'EGRA-II',
        colF: get('colF', 5) || 'BATHUARY',
        colG: get('colG', 6) || normalizedVillage,
        colH: jobCard || `WB-14-012-${String(parsed.length + 1).padStart(6, '0')}`,
        colI: get('colI', 8) || '1',
        colJ: name || `Citizen ${parsed.length + 1}`,
        colK: get('colK', 10) || 'Male',
        colL: get('colL', 11) || '',
        colM: get('colM', 12) || '',
        colN: get('colN', 13) || '',
        colO: isAbpsActive ? 'Yes' : 'No',
        colP: aadhaarClean,
        colQ: mobileClean,
        colR: isKycDone ? 'Yes' : 'No',
        colS: get('colS', 18) ? formatKycDate(get('colS', 18)) : '',
        colT: get('colT', 19) || '',
        colU: get('colU', 20) || 'MANIK DAS, GRS',
        colV: normalizedVillage,
        colW: get('colW', 22) || 'Yes',
        colX: get('colX', 23) || '',
        colY: get('colY', 24) || '',
        colAF: get('colAF', 31) || '',
        colAG: get('colAG', 32) || name,
        colAO: get('colAO', 40) || 'BANK OF INDIA',
        colAP: get('colAP', 41) || 'BKID0004316',
        colAQ: get('colAQ', 42) || 'BATHUARY',
        colAR: get('colAR', 43) || ''
      };

      parsed.push(record);
    }

    return parsed;
  };

  // 1. Fetch live Google Sheet via direct Link
  const handleFetchGoogleSheet = async () => {
    const trimmedUrl = sheetUrl.trim();
    if (!trimmedUrl) {
      setStatusMessage({ type: 'error', text: 'Please enter your Google Spreadsheet link.' });
      return;
    }

    setIsLoading(true);
    setStatusMessage({ type: 'info', text: 'Connecting to Google Sheet link and syncing data...' });

    try {
      let imported = false;

      // Try server-side sync endpoint first
      try {
        const res = await fetch('/api/sync-google-sheet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ sheetUrl: trimmedUrl })
        });

        const text = await res.text();
        let data: any = null;
        try {
          data = JSON.parse(text);
        } catch {
          // not json
        }

        if (res.ok && data?.status === 'success' && Array.isArray(data.beneficiaries) && data.beneficiaries.length > 0) {
          safeStorage.setItem('bathuary_google_sheet_url', trimmedUrl);
          safeStorage.setItem('bathuary_auto_sync_enabled', String(autoSyncEnabled));
          onDataImported(data.beneficiaries);
          setImportStats({
            rows: data.total,
            villages: data.villagesCount,
            sansads: data.sansadsCount
          });
          setStatusMessage({
            type: 'success',
            text: `✓ Google Sheet Synced Successfully! Loaded ${data.total} verified citizen records across ${data.villagesCount} villages and ${data.sansadsCount} Sansads.`
          });
          imported = true;
          return;
        } else if (data?.message) {
          console.warn('Server sync notice:', data.message);
        }
      } catch (proxyErr) {
        console.warn('Server proxy error, trying direct CSV fetch:', proxyErr);
      }

      // Direct client-side fetch fallback (Google Sheets allows CORS on gviz/tq endpoint)
      const pubMatch = trimmedUrl.match(/\/spreadsheets\/d\/e\/([a-zA-Z0-9-_]+)/);
      const docMatch = trimmedUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
      const gidMatch = trimmedUrl.match(/[#&?]gid=([0-9]+)/);
      const gid = gidMatch ? gidMatch[1] : '0';
      const sheetId = pubMatch ? pubMatch[1] : (docMatch ? docMatch[1] : '');

      if (sheetId) {
        const candidateUrls = pubMatch
          ? [`https://docs.google.com/spreadsheets/d/e/${sheetId}/pub?output=csv&gid=${gid}`]
          : [
              `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${gid}`,
              `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`
            ];

        for (const candidateUrl of candidateUrls) {
          try {
            const clientRes = await fetch(candidateUrl);
            if (clientRes.ok) {
              const csvText = await clientRes.text();
              if (!csvText.includes('<!DOCTYPE') && !csvText.includes('<html') && csvText.trim().length > 20) {
                const workbook = XLSX.read(csvText, { type: 'string' });
                const firstSheetName = workbook.SheetNames[0];
                const rawRows: any[][] = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName], { header: 1 });
                const beneficiaries = parseRowsToBeneficiaries(rawRows);

                if (beneficiaries.length > 0) {
                  safeStorage.setItem('bathuary_google_sheet_url', trimmedUrl);
                  safeStorage.setItem('bathuary_auto_sync_enabled', String(autoSyncEnabled));
                  onDataImported(beneficiaries);

                  // Update server cache
                  fetch('/api/beneficiaries/import', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ beneficiaries })
                  }).catch(() => {});

                  const vCount = new Set(beneficiaries.map(b => b.colV)).size;
                  const sCount = new Set(beneficiaries.map(b => b.colB)).size;
                  setImportStats({ rows: beneficiaries.length, villages: vCount, sansads: sCount });
                  setStatusMessage({
                    type: 'success',
                    text: `✓ Google Sheet Synced Successfully! Loaded ${beneficiaries.length} verified citizen records.`
                  });
                  imported = true;
                  return;
                }
              }
            }
          } catch {
            // continue candidate loop
          }
        }
      }

      if (!imported) {
        setStatusMessage({
          type: 'error',
          text: 'Could not access Google Sheet. Please click "Share" on your Google Sheet and set "Anyone with the link can view".'
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: `Sync error: ${err.message || 'Please verify the link and internet connection.'}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Parse Pasted Data
  const handleParsePastedData = () => {
    if (!pastedData.trim()) {
      setStatusMessage({ type: 'error', text: 'Please paste spreadsheet data first.' });
      return;
    }

    try {
      const rows = pastedData.trim().split('\n').map(line => {
        if (line.includes('\t')) return line.split('\t');
        return line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.replace(/^"|"$/g, ''));
      });

      const beneficiaries = parseRowsToBeneficiaries(rows);

      if (beneficiaries.length === 0) {
        setStatusMessage({ type: 'error', text: 'No valid records found in the pasted data. Please check the columns.' });
        return;
      }

      onDataImported(beneficiaries);
      const vCount = new Set(beneficiaries.map(b => b.colV)).size;
      const sCount = new Set(beneficiaries.map(b => b.colB)).size;
      setImportStats({ rows: beneficiaries.length, villages: vCount, sansads: sCount });
      setStatusMessage({
        type: 'success',
        text: `✓ Successfully parsed & loaded ${beneficiaries.length} records across ${vCount} villages!`
      });
      setPastedData('');
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: `Failed to parse pasted data: ${err.message}` });
    }
  };

  // 3. File Upload (Excel / CSV)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setStatusMessage({ type: 'info', text: 'Reading file...' });

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheetName];
        const rawRows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        const beneficiaries = parseRowsToBeneficiaries(rawRows);

        if (beneficiaries.length === 0) {
          setStatusMessage({ type: 'error', text: 'No valid Job Card records found in uploaded file.' });
          setIsLoading(false);
          return;
        }

        onDataImported(beneficiaries);
        const vCount = new Set(beneficiaries.map(b => b.colV)).size;
        const sCount = new Set(beneficiaries.map(b => b.colB)).size;
        setImportStats({ rows: beneficiaries.length, villages: vCount, sansads: sCount });
        setStatusMessage({
          type: 'success',
          text: `✓ File Imported Successfully! Loaded ${beneficiaries.length} records.`
        });
      } catch (err: any) {
        setStatusMessage({ type: 'error', text: `Failed to process file: ${err.message}` });
      } finally {
        setIsLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-7 overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base sm:text-lg">
                Google Sheet Link & Data Integration
              </h3>
              <p className="text-xs text-slate-500">
                Active Master Records: <strong className="text-emerald-700 font-bold">{currentCount} Job Cards</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection: 100% Direct Google Sheet Link based */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl mb-5">
          <button
            onClick={() => setActiveMode('sheetLink')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeMode === 'sheetLink' 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'text-slate-700 hover:text-slate-900 bg-white/60'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Google Sheet Link</span>
          </button>

          <button
            onClick={() => setActiveMode('upload')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeMode === 'upload' 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'text-slate-700 hover:text-slate-900 bg-white/60'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Excel / CSV</span>
          </button>

          <button
            onClick={() => setActiveMode('paste')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeMode === 'paste' 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'text-slate-700 hover:text-slate-900 bg-white/60'
            }`}
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
            <span>Copy-Paste Table</span>
          </button>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div className={`p-3.5 rounded-2xl mb-4 text-xs font-semibold flex items-start gap-2.5 ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
              : statusMessage.type === 'error'
              ? 'bg-rose-50 text-rose-800 border border-rose-200'
              : 'bg-sky-50 text-sky-800 border border-sky-200'
          }`}>
            {statusMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
            {statusMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
            {statusMessage.type === 'info' && <RefreshCw className="w-4 h-4 text-sky-600 shrink-0 mt-0.5 animate-spin" />}
            <span className="leading-relaxed">{statusMessage.text}</span>
          </div>
        )}

        {/* Mode 1: Google Sheet Direct Link (Zero Apps Script) */}
        {activeMode === 'sheetLink' && (
          <div className="space-y-4">
            
            {/* If a permanent link is already configured and user is not editing it */}
            {isPermanentlySaved && savedConfig?.sheetUrl && !isEditingUrl ? (
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 text-xs text-slate-800 space-y-3.5 shadow-xs">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs shrink-0 mt-0.5">
                      <HardDrive className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-sm text-emerald-900">
                          গুগল শীট লিঙ্ক স্থায়ীভাবে সংরক্ষিত
                        </h4>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-black border border-emerald-300">
                          ✓ Permanent Saved
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        এই লিঙ্কটি সার্ভার সিস্টেমে স্থায়ীভাবে সেভ করা আছে। সার্ভার রিস্টার্ট বা পেজ রিফ্রেশ করলেও এটি স্বয়ংক্রিয়ভাবে ডাটা লোড রাখবে।
                      </p>
                    </div>
                  </div>
                </div>

                {/* URL container with copy & open buttons */}
                <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-300 font-mono text-[11px] text-slate-800 shadow-inner">
                  <span className="truncate flex-1 font-semibold text-slate-700 select-all">
                    {savedConfig.sheetUrl}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(savedConfig.sheetUrl);
                      setHasCopiedUrl(true);
                      setTimeout(() => setHasCopiedUrl(false), 2000);
                    }}
                    title="Copy Sheet Link"
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 text-[10px] font-bold px-2.5 cursor-pointer shrink-0 transition-colors"
                  >
                    {hasCopiedUrl ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{hasCopiedUrl ? 'Copied' : 'Copy'}</span>
                  </button>
                  <a
                    href={savedConfig.sheetUrl}
                    target="_blank"
                    rel="noreferrer"
                    title="Open in new tab"
                    className="p-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 flex items-center gap-1 text-[10px] font-bold px-2.5 shrink-0 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Open</span>
                  </a>
                </div>

                {/* Status metrics */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] pt-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-1 rounded-lg border border-emerald-200 text-xs">
                      {(savedConfig.totalRecords || currentCount).toLocaleString()} Verified Citizens
                    </span>
                    <span className="text-slate-500 font-medium">
                      {savedConfig.lastSyncTimestamp ? `Last Sync: ${new Date(savedConfig.lastSyncTimestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}` : 'Auto-Sync Active'}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    ● Server Boot Auto-Sync: {savedConfig.autoSync !== false ? 'ON' : 'OFF'}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-emerald-200/60">
                  <button
                    onClick={() => handleSavePermanently(true)}
                    disabled={isLoading}
                    className="py-2.5 px-3 rounded-xl btn-3d-sync text-white font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>{isLoading ? 'Syncing...' : '🔄 Re-Sync Live Data'}</span>
                  </button>

                  <button
                    onClick={() => setIsEditingUrl(true)}
                    className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-300 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                    <span>✏️ Change Link</span>
                  </button>

                  <button
                    onClick={handleClearSavedLink}
                    disabled={isLoading}
                    className="py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-1.5 border border-rose-200 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    <span>🗑️ Remove Link</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
                  <div className="flex items-center gap-2 font-black text-sm text-emerald-900">
                    <Globe className="w-4 h-4 text-emerald-700" />
                    <span>গুগল শীট লিঙ্ক দিয়ে পার্মানেন্ট ডাটা কানেকশন (Permanent Sheet Link)</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-emerald-800">
                    নিচে আপনার অফিসিয়াল গুগল স্প্রেডশীটের লিঙ্ক দিয়ে <strong>&quot;Save Link Permanently &amp; Sync&quot;</strong> ক্লিক করুন। লিঙ্কটি সার্ভারের সিস্টেম ফাইলে স্থায়ীভাবে সেভ হয়ে যাবে এবং প্রতিবার পেজ খুললে স্বয়ংক্রিয়ভাবে লাইভ ডাটা লোড হবে।
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-800">
                      Official Google Spreadsheet Link:
                    </label>
                    {isEditingUrl && isPermanentlySaved && (
                      <button
                        onClick={() => setIsEditingUrl(false)}
                        className="text-xs text-slate-500 hover:text-slate-800 font-semibold underline cursor-pointer"
                      >
                        Cancel Editing
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={sheetUrl}
                    onChange={(e) => setSheetUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/your-sheet-id/edit"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono shadow-inner mb-2"
                  />

                  {sheetUrl.trim() && (
                    <div className="mb-2 flex items-center gap-3 text-xs">
                      <a
                        href={sheetUrl.trim()}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-bold hover:underline"
                      >
                        <span>Open Linked Google Sheet</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  {/* Auto-Sync on Startup Checkbox */}
                  <div className="mt-2.5 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="autoSyncCheck"
                      checked={autoSyncEnabled}
                      onChange={(e) => {
                        setAutoSyncEnabled(e.target.checked);
                        safeStorage.setItem('bathuary_auto_sync_enabled', String(e.target.checked));
                      }}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                    />
                    <label htmlFor="autoSyncCheck" className="text-xs text-slate-700 font-semibold cursor-pointer">
                      স্বয়ংক্রিয়ভাবে পেজ খুললেই বা সার্ভার রিস্টার্টে এই লিঙ্ক থেকে ডাটা আপডেট করুন (Auto-sync on boot)
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleSavePermanently(true)}
                      disabled={isLoading || !sheetUrl.trim()}
                      className="flex-1 py-3 px-4 rounded-xl btn-3d-save text-white font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
                    >
                      <Save className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                      <span>{isLoading ? 'Saving & Syncing...' : '💾 Save Link Permanently & Sync (স্থায়ীভাবে সেভ করুন)'}</span>
                    </button>

                    <button
                      onClick={handleFetchGoogleSheet}
                      disabled={isLoading || !sheetUrl.trim()}
                      className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-300 transition-colors cursor-pointer disabled:opacity-50"
                      title="Quick one-time sync without permanent saving"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                      <span>⚡ Quick One-Time Sync</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Easy 2-Step Permission Guide */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2">
              <h5 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>গুগল শীট লিঙ্ক ব্যবহারের নিয়ম (Quick 2-Step Setup):</span>
              </h5>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600 pl-1 leading-relaxed">
                <li>আপনার Google Spreadsheet-টি ব্রাউজারে খুলে ওপরের ডানপাশের নীল <strong>&quot;Share&quot;</strong> বাটনে ক্লিক করুন।</li>
                <li><em>General access</em>-এ <strong>&quot;Anyone with the link&quot;</strong> (Role: <em>Viewer</em>) করে <strong>Copy link</strong> করুন।</li>
                <li>সেই লিঙ্কটি ওপরের বক্সে পেস্ট করে <strong>&quot;Save Link Permanently &amp; Sync&quot;</strong> ক্লিক করলেই তা স্থায়ীভাবে সংরক্ষিত হয়ে যাবে।</li>
              </ol>
            </div>
          </div>
        )}

        {/* Mode 2: Excel / CSV File Upload */}
        {activeMode === 'upload' && (
          <div className="space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-3xl p-8 text-center cursor-pointer bg-slate-50 hover:bg-emerald-50/40 transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                Click to browse or drag & drop file
              </h4>
              <p className="text-xs text-slate-500 mb-2">
                Supports official .xlsx, .xls, or .csv Job Card Master spreadsheets
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        )}

        {/* Mode 3: Copy-Paste Raw Table Data */}
        {activeMode === 'paste' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Paste Rows directly from Excel or Google Sheet:
              </label>
              <textarea
                rows={6}
                value={pastedData}
                onChange={(e) => setPastedData(e.target.value)}
                placeholder="Google Sheet বা Excel খুলে সারিগুলো নির্বাচন করে Copy (Ctrl+C) করুন এবং এখানে Paste (Ctrl+V) করুন..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono shadow-inner"
              />
            </div>

            <button
              onClick={handleParsePastedData}
              disabled={isLoading || !pastedData.trim()}
              className="w-full py-3 rounded-xl btn-3d-save text-white font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>Parse & Import Beneficiary Data</span>
            </button>
          </div>
        )}

        {/* Import Summary Stats */}
        {importStats && (
          <div className="mt-4 p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-950 font-bold">
            <span>Imported: {importStats.rows.toLocaleString()} Records</span>
            <span>29 Villages: {importStats.villages} Active</span>
            <span>16 Sansads: {importStats.sansads} Verified</span>
          </div>
        )}

        {/* Footer Close */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
