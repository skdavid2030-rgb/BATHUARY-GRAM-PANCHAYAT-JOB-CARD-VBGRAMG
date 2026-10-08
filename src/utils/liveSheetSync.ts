import * as XLSX from 'xlsx';
import { BeneficiaryRow, PERMANENT_BATHUARY_SHEET_URL, PERMANENT_APPS_SCRIPT_URL } from '../types';
import { normalizeVillageName } from './villageNormalizer';
import { normalizeSansadName, sortSansads, isHeaderOrJunkSansad } from './sansadNormalizer';
import { normalizeJobCardBookDelivered, normalizeJobCardSubmitted } from './jobCardDeliveryNormalizer';
import { healBeneficiaryRecord } from './beneficiaryHealer';
import { formatKycDate } from './dateFormatter';
import { safeStorage } from './safeStorage';
import {
  loadCachedBeneficiaries,
  saveCachedBeneficiaries,
  loadSyncMetadata,
  saveSyncMetadata
} from './beneficiaryStorage';

export interface LiveSyncResult {
  success: boolean;
  beneficiaries: BeneficiaryRow[];
  total: number;
  villagesCount: number;
  sansadsCount: number;
  source: 'api' | 'gviz' | 'apps_script' | 'cache' | 'export_csv';
  message: string;
  isNewData: boolean;
  timestamp: string;
}

// Compute lightweight fingerprint to detect any live edits in Google Sheet
export function computeDatasetFingerprint(records: BeneficiaryRow[]): string {
  if (!records || records.length === 0) return '0_0_0_0';
  let kycCount = 0;
  let deliveredCount = 0;
  let abpsCount = 0;
  let bankAccountsCount = 0;
  let quickHash = 0;

  for (let i = 0; i < records.length; i++) {
    const r = records[i];
    if (r.colR && (r.colR.toUpperCase() === 'YES' || r.colR.toUpperCase() === 'Y')) kycCount++;
    if (r.colY && normalizeJobCardBookDelivered(r.colY) === 'Yes') deliveredCount++;
    if (r.colO && (r.colO.toUpperCase() === 'YES' || r.colO.toUpperCase() === 'Y')) abpsCount++;
    if (r.colAR && r.colAR.trim()) bankAccountsCount++;

    // Sample char codes from critical fields to detect in-place text edits across sheet
    const sample = (r.colH || '') + (r.colJ || '') + (r.colY || '') + (r.colR || '') + (r.colQ || '') + (r.colP || '') + (r.colAO || '') + (r.colAP || '') + (r.colAR || '');
    for (let j = 0; j < sample.length; j += 5) {
      quickHash = (quickHash * 31 + sample.charCodeAt(j)) | 0;
    }
  }

  return `${records.length}_${kycCount}_${deliveredCount}_${abpsCount}_${bankAccountsCount}_${quickHash}`;
}

/**
 * Parses raw 2D array from Google Sheet into canonical BeneficiaryRow[]
 */
export function parseSheetRowsToBeneficiaries(rawData: any[][]): BeneficiaryRow[] {
  if (!Array.isArray(rawData) || rawData.length === 0) return [];

  let headerRowIdx = -1;
  const colMap: Record<string, number> = {};

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

        // Priority 1: Col Y - Job Card Book Delivered (Must check BEFORE generic Job Card)
        if (
          val.includes('book') ||
          val.includes('deliver') ||
          val.includes('deliv') ||
          val.includes('বই') ||
          val.includes('বিতরণ') ||
          val.includes('বিলি') ||
          val === 'jc book' ||
          val === 'book delivered' ||
          val === 'job card book delivered' ||
          val.startsWith('job card book deliver')
        ) {
          colMap['colY'] = colIdx;
        }
        // Priority 2: Col W - Job Card Submitted to Office (Exclude deletion columns)
        else if (
          (val.includes('submitted') || val.includes('submission') || val.includes('জমা')) &&
          !val.includes('deletion') && !val.includes('বাতিল')
        ) {
          colMap['colW'] = colIdx;
        }
        // Priority 3: Col H - Job Card Number
        else if (
          val === 'job card number' ||
          val === 'job card no' ||
          val === 'job card no.' ||
          val === 'job card' ||
          val === 'reg no' ||
          ((val.includes('job') || val.includes('কার্ড')) && (val.includes('card') || val.includes('no') || val.includes('num') || val.includes('নম্বর')) && !val.includes('name') && !val.includes('applicant'))
        ) {
          colMap['colH'] = colIdx;
        }
        // Priority 4: Col Q - Phone / Mobile
        else if (val.includes('mobile') || val.includes('phone') || val.includes('contact') || val.includes('ফোন')) {
          colMap['colQ'] = colIdx;
        }
        // Priority 5: Col P - Aadhaar Number
        else if (
          (val.includes('aadhaar') || val.includes('uid')) &&
          !val.includes('name') &&
          !val.includes('seeded') &&
          !val.includes('auth') &&
          !val.includes('demographic')
        ) {
          colMap['colP'] = colIdx;
        }
        // Priority 6: Col L - Name as per Aadhaar
        else if (val.includes('name as per') || (val.includes('aadhaar') && val.includes('name'))) {
          colMap['colL'] = colIdx;
        }
        // Priority 7: Family Relations
        else if (val.includes('father') || val.includes('husband')) colMap['colAF'] = colIdx;
        else if (val.includes('head') || val.includes('hoh')) colMap['colAG'] = colIdx;
        // Priority 8: Admin Units
        else if (val.includes('sansad') || val.includes('ward') || val.includes('part')) colMap['colB'] = colIdx;
        else if (val.includes('village') || val.includes('gram') || val.includes('mouza')) colMap['colV'] = colIdx;
        // Priority 9: Col J - Applicant Name
        else if (
          !val.includes('phone') && !val.includes('mobile') && !val.includes('contact') &&
          !val.includes('aadhaar') && !val.includes('uid') && !val.includes('card') &&
          !val.includes('father') && !val.includes('husband') && !val.includes('head') && !val.includes('hoh') &&
          !val.includes('date') && !val.includes('status') && !val.includes('error') &&
          (val === 'applicant name' || val === 'name of applicant' || val === 'beneficiary name' || val === 'worker name' || val === 'name' || (val.includes('applicant') && val.includes('name')))
        ) {
          if (colMap['colJ'] === undefined || colIdx < colMap['colJ']) {
            colMap['colJ'] = colIdx;
          }
        }
        else if (val.includes('kyc') && (val.includes('date') || val.includes('dt') || val.includes('time') || val.includes('done on') || val.includes('day'))) colMap['colS'] = colIdx;
        else if (val.includes('kyc') || val.includes('e-kyc')) colMap['colR'] = colIdx;
        else if (val.includes('abps')) colMap['colO'] = colIdx;
        else if (val.includes('bank') && !val.includes('branch') && !val.includes('ifsc') && !val.includes('account')) colMap['colAO'] = colIdx;
        else if (val.includes('ifsc')) colMap['colAP'] = colIdx;
        else if (val.includes('branch')) colMap['colAQ'] = colIdx;
        else if (val.includes('account') || val.includes('a/c') || val.includes('ac no') || val.includes('acc no')) colMap['colAR'] = colIdx;
        else if (val.includes('remark') || val.includes('error') || val.includes('reason')) colMap['colT'] = colIdx;
        else if (val.includes('vle') || val.includes('officer') || val.includes('grs')) colMap['colU'] = colIdx;
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

    const rawVillage = get('colV', 21) || '';
    const normalizedVillage = normalizeVillageName(rawVillage, rawSansad);
    const normalizedSansad = normalizeSansadName(rawSansad, normalizedVillage) || 'BATHUARY 1';

    const rawKyc = get('colR', 17).toUpperCase();
    const isKycDone = rawKyc === 'YES' || rawKyc === 'Y' || rawKyc === 'DONE' || rawKyc === 'SUCCESS' || rawKyc === '1';

    const rawAbps = get('colO', 14).toUpperCase();
    const isAbpsActive = rawAbps === 'YES' || rawAbps === 'Y' || rawAbps === 'ENABLED' || rawAbps === '1';

    let aadhaarClean = get('colP', 15).replace(/\D/g, '');
    if (aadhaarClean.length === 11) {
      aadhaarClean = '0' + aadhaarClean;
    }
    const mobileClean = get('colQ', 16).replace(/\D/g, '');

    const record: BeneficiaryRow = {
      rowIndex: parsed.length + 2,
      colA: get('colA', 0) || String(parsed.length + 1),
      colB: normalizedSansad,
      colC: get('colC', 2) || String(parsed.length + 1),
      colD: get('colD', 3) || 'PURBA MEDINIPUR',
      colE: get('colE', 4) || 'EGRA-II DEVELOPMENT BLOCK',
      colF: get('colF', 5) || 'BATHUARY',
      colH: jobCard || `WB-14-012-005-001/${10000 + parsed.length}`,
      colI: get('colI', 8) || '1',
      colJ: (name || 'BENEFICIARY').toUpperCase(),
      colK: get('colK', 10) || 'MALE',
      colL: get('colL', 11) || name || '',
      colM: get('colM', 12) || 'Yes',
      colN: get('colN', 13) || 'Yes',
      colO: isAbpsActive ? 'Yes' : 'No',
      colP: aadhaarClean,
      colQ: mobileClean,
      colR: isKycDone ? 'Yes' : 'No',
      colS: formatKycDate(get('colS', 18)) || '',
      colT: get('colT', 19) || '',
      colU: get('colU', 20) || 'SK DAVID, VLE',
      colV: normalizedVillage,
      colW: normalizeJobCardSubmitted(get('colW', 22) || 'Yes'),
      colX: get('colX', 23) || '',
      colY: normalizeJobCardBookDelivered(get('colY', 24)),
      colAF: get('colAF', 31).toUpperCase(),
      colAG: get('colAG', 32).toUpperCase() || (name || '').toUpperCase(),
      colAO: get('colAO', 40).trim(),
      colAP: get('colAP', 41).trim(),
      colAQ: get('colAQ', 42).trim(),
      colAR: get('colAR', 43).trim()
    };

    parsed.push(healBeneficiaryRecord(record));
  }

  return parsed;
}

/**
 * Direct Live Google Sheet Fetcher via Google's ultra-fast global GViz CSV endpoint
 */
async function fetchFromGoogleSheetGViz(sheetUrl: string): Promise<BeneficiaryRow[]> {
  const pubMatch = sheetUrl.match(/\/spreadsheets\/d\/e\/([a-zA-Z0-9-_]+)/);
  const docMatch = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  const gidMatch = sheetUrl.match(/[#&?]gid=([0-9]+)/);
  const gid = gidMatch ? gidMatch[1] : '0';
  const sheetId = pubMatch ? pubMatch[1] : (docMatch ? docMatch[1] : '');

  if (!sheetId) {
    throw new Error('Invalid Google Sheet URL format.');
  }

  const timestampBuster = Date.now();
  const candidateUrls = pubMatch
    ? [
        `https://docs.google.com/spreadsheets/d/e/${sheetId}/pub?output=csv&gid=${gid}&_t=${timestampBuster}`,
        `https://docs.google.com/spreadsheets/d/e/${sheetId}/pub?output=csv&_t=${timestampBuster}`
      ]
    : [
        `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${gid}&_t=${timestampBuster}`,
        `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}&_t=${timestampBuster}`,
        `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&_t=${timestampBuster}`
      ];

  let csvContent = '';
  for (const url of candidateUrls) {
    try {
      const res = await fetch(url, {
        cache: 'no-store',
        headers: { 'Accept': 'text/csv, text/plain, */*' }
      });
      if (res.ok) {
        const text = await res.text();
        if (text && !text.includes('<!DOCTYPE') && !text.includes('<html') && text.trim().length > 50) {
          csvContent = text;
          break;
        }
      }
    } catch {
      // try next candidate
    }
  }

  if (!csvContent) {
    throw new Error('Google Sheet GViz endpoint unreachable or permissions restricted.');
  }

  const workbook = XLSX.read(csvContent, { type: 'string' });
  const firstSheetName = workbook.SheetNames[0];
  const rawRows: any[][] = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName], { header: 1 });

  return parseSheetRowsToBeneficiaries(rawRows);
}

/**
 * Fetch from Google Apps Script Web App (Code.gs)
 */
async function fetchFromAppsScript(appsScriptUrl: string): Promise<BeneficiaryRow[]> {
  const separator = appsScriptUrl.includes('?') ? '&' : '?';
  const fetchUrl = `${appsScriptUrl}${separator}action=read&format=json`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  const res = await fetch(fetchUrl, {
    method: 'GET',
    headers: { 'Accept': 'application/json, text/plain, */*' },
    signal: controller.signal
  });
  clearTimeout(timeoutId);

  if (!res.ok) {
    throw new Error(`Apps Script responded with HTTP ${res.status}`);
  }

  const text = await res.text();
  let json: any = null;
  try {
    json = JSON.parse(text);
  } catch {
    // try csv parsing
  }

  if (json && Array.isArray(json.data) && json.data.length > 0) {
    // Map items from Apps Script
    return json.data.map((item: any, idx: number) => {
      const rawSl = Number(item['Sheet Sl No'] || (idx + 1));
      const rawJc = String(item['Job Card Number'] || item['colH'] || '').trim();
      const rawAadhaar = String(item['Aadhaar Number'] || item['colP'] || '').replace(/\D/g, '');
      const rawPhone = String(item['Worker Phone Number (if available)'] || item['Worker Phone Number'] || item['colQ'] || '').replace(/\D/g, '');
      const rawVillage = String(item['Village Name'] || item['colV'] || '').trim();
      const rawSansad = String(item['Sansad Name & No'] || item['Sansad Name'] || item['colB'] || '').trim();
      const rawDate = item['If Y , then record Date of e-KYC Successfully Done'] || item['eKycDate'] || item['colS'] || '';

      const normVillage = normalizeVillageName(rawVillage, rawSansad);
      const normSansad = normalizeSansadName(rawSansad, normVillage) || 'BATHUARY 1';

      return healBeneficiaryRecord({
        rowIndex: rawSl + 1,
        colA: String(rawSl),
        colB: normSansad,
        colC: String(item['Sl.No'] || item['Sl No'] || rawSl),
        colD: String(item['District'] || 'PURBA MEDINIPUR'),
        colE: String(item['Block'] || 'EGRA - II'),
        colF: String(item['Gram Panchayat'] || 'BATHUARY'),
        colH: rawJc,
        colI: String(item['Applicant No'] || '1'),
        colJ: String(item['Applicant Name'] || '').trim().toUpperCase(),
        colK: String(item['Gender'] || 'MALE').trim().toUpperCase(),
        colL: String(item['Name as per Aadhaar Card'] || item['Applicant Name'] || '').trim(),
        colM: String(item['Aadhaar Seeded in NREGASoft?'] || 'Yes').trim(),
        colN: String(item['Demographic Authentication Done?'] || 'Yes').trim(),
        colO: String(item['Enables for ABPS?'] || 'No').trim(),
        colP: rawAadhaar,
        colQ: rawPhone,
        colR: String(item['E-KYC Sucessfully Done (Y/N)'] || item['e-KYC Done'] || 'No').trim(),
        colS: formatKycDate(rawDate),
        colT: String(item['If N , then record the error shown during e-KYC with the error no'] || item['If N , then Resone/Error Code'] || '').trim(),
        colU: String(item['e-KYC Process done by [Name and Designation]'] || 'SK DAVID, VLE').trim(),
        colV: normVillage,
        colW: normalizeJobCardSubmitted(String(item['Job Card has been Submitted to The Office(Yes/No)'] || 'Yes')),
        colX: String(item['Remark'] || '').trim(),
        colY: (() => {
          const direct = item['Job Card Book Delivered(Y/N)'] ??
            item['Job Card Book Deliverd(Y/N)'] ??
            item['Job Card Book Delivered'] ??
            item['Job Card Book Deliverd'] ??
            item['Job Card Book Delivered (Y/N)'] ??
            item['colY'] ??
            item.colY;
          if (direct !== undefined && direct !== null && String(direct).trim() !== '') {
            return normalizeJobCardBookDelivered(direct);
          }
          for (const k of Object.keys(item)) {
            const lk = k.toLowerCase().trim();
            if ((lk.includes('book') || lk.includes('বই')) && (lk.includes('deliver') || lk.includes('বিতরণ') || lk.includes('বিলি'))) {
              return normalizeJobCardBookDelivered(item[k]);
            }
          }
          return 'No';
        })(),
        colAF: String(item['Father/Husband Name of House Hold'] || '').trim().toUpperCase(),
        colAG: String(item['Head of House Hold'] || item['Applicant Name'] || '').trim().toUpperCase(),
        colAO: String(item['Bank Name'] || '').trim(),
        colAP: String(item['IFSC Code'] || '').trim(),
        colAQ: String(item['Branch Name'] || '').trim(),
        colAR: String(item['Account Number'] || '').trim()
      });
    });
  }

  // Fallback: parse raw CSV
  if (text.trim().length > 50) {
    const workbook = XLSX.read(text, { type: 'string' });
    const sheetData: any[][] = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 });
    return parseSheetRowsToBeneficiaries(sheetData);
  }

  throw new Error('Empty dataset from Apps Script.');
}

/**
 * Universal Dual-Mode Live Sync Engine
 * Guaranteed to work on Netlify (client-side GViz live sync) AND local/cloud Node servers (/api/*).
 * Automatically detects changes in Google Sheet and updates IndexedDB and React state.
 */
export async function syncLiveGoogleSheet(options?: {
  force?: boolean;
  sheetUrl?: string;
  appsScriptUrl?: string;
}): Promise<LiveSyncResult> {
  const targetSheetUrl = options?.sheetUrl || safeStorage.getItem('bathuary_google_sheet_url') || PERMANENT_BATHUARY_SHEET_URL;
  const targetAppsScriptUrl = options?.appsScriptUrl || safeStorage.getItem('gp_apps_script_url') || PERMANENT_APPS_SCRIPT_URL;

  let beneficiaries: BeneficiaryRow[] = [];
  let source: 'api' | 'gviz' | 'apps_script' | 'cache' | 'export_csv' = 'gviz';
  let syncMessage = '';

  // Check if running on static host (e.g. Netlify)
  const isStaticHost = typeof window !== 'undefined' && (
    window.location.hostname.includes('netlify.app') ||
    window.location.hostname.includes('web.app') ||
    window.location.hostname.includes('firebaseapp.com') ||
    window.location.protocol === 'file:'
  );

  // -------------------------------------------------------------
  // STRATEGY 1: Check Express backend API if active (Dev / Container)
  // -------------------------------------------------------------
  let apiSucceeded = false;
  if (!isStaticHost) {
    try {
      const apiEndpoint = options?.force ? '/api/google-sheet/refresh' : '/api/beneficiaries';
      const apiRes = await fetch(apiEndpoint, {
        method: options?.force ? 'POST' : 'GET',
        headers: { 'Accept': 'application/json', ...(options?.force ? { 'Content-Type': 'application/json' } : {}) }
      });

      if (apiRes.ok) {
        const contentType = apiRes.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await apiRes.json();
          if (data && Array.isArray(data.beneficiaries) && data.beneficiaries.length > 0) {
            beneficiaries = data.beneficiaries;
            source = 'api';
            syncMessage = data.message || `API Sync: ${beneficiaries.length} records`;
            apiSucceeded = true;
          }
        }
      }
    } catch {
      // API not reachable (e.g. running on Netlify or static host)
    }
  }

  // -------------------------------------------------------------
  // STRATEGY 2: Ultra-fast Google Sheet GViz CSV (Real-Time Live on Netlify)
  // -------------------------------------------------------------
  if (!apiSucceeded) {
    try {
      const gvizRows = await fetchFromGoogleSheetGViz(targetSheetUrl);
      if (gvizRows && gvizRows.length > 0) {
        beneficiaries = gvizRows;
        source = 'gviz';
        syncMessage = `Live Google Sheet: ${beneficiaries.length} records synchronized`;
      }
    } catch (gvizErr: any) {
      console.warn('[LiveSync] GViz sync notice, trying Apps Script:', gvizErr?.message);
    }
  }

  // -------------------------------------------------------------
  // STRATEGY 3: Google Apps Script Webhook Fallback
  // -------------------------------------------------------------
  if (beneficiaries.length === 0 && targetAppsScriptUrl) {
    try {
      const gasRows = await fetchFromAppsScript(targetAppsScriptUrl);
      if (gasRows && gasRows.length > 0) {
        beneficiaries = gasRows;
        source = 'apps_script';
        syncMessage = `Apps Script: ${beneficiaries.length} records synchronized`;
      }
    } catch (gasErr: any) {
      console.warn('[LiveSync] Apps Script notice:', gasErr?.message);
    }
  }

  // -------------------------------------------------------------
  // STRATEGY 4: Local IndexedDB Cache Fallback (Zero-Data Safety)
  // -------------------------------------------------------------
  if (beneficiaries.length === 0) {
    const cached = await loadCachedBeneficiaries();
    if (cached && cached.length > 0) {
      beneficiaries = cached;
      source = 'cache';
      syncMessage = `Offline Cache: Loaded ${beneficiaries.length} records`;
    }
  }

  if (beneficiaries.length === 0) {
    return {
      success: false,
      beneficiaries: [],
      total: 0,
      villagesCount: 0,
      sansadsCount: 0,
      source: 'cache',
      message: 'গুগল শীট থেকে ডাটা সিঙ্ক করা সম্ভব হয়নি। ইন্টারনেট সংযোগ পরীক্ষা করুন।',
      isNewData: false,
      timestamp: new Date().toISOString()
    };
  }

  // Normalize all villages and sansads
  const cleanBeneficiaries = beneficiaries.map(rawB => {
    const b = healBeneficiaryRecord(rawB);
    const normVillage = normalizeVillageName(b.colV, b.colB);
    return {
      ...b,
      colV: normVillage,
      colB: normalizeSansadName(b.colB, normVillage) || 'BATHUARY 1',
      colY: normalizeJobCardBookDelivered(b.colY)
    };
  });

  // Check fingerprint to detect live sheet changes
  const newFingerprint = computeDatasetFingerprint(cleanBeneficiaries);
  const oldMeta = await loadSyncMetadata();
  const isNewData = !oldMeta || oldMeta.fingerprint !== newFingerprint;

  const timestamp = new Date().toISOString();

  // Save to persistent IndexedDB
  await saveCachedBeneficiaries(cleanBeneficiaries);
  await saveSyncMetadata({
    lastSyncTime: timestamp,
    totalRecords: cleanBeneficiaries.length,
    fingerprint: newFingerprint,
    source
  });

  // Calculate unique stats
  const uniqueVillages = new Set(cleanBeneficiaries.map(b => b.colV).filter(Boolean));
  const uniqueSansads = new Set(cleanBeneficiaries.map(b => b.colB).filter(s => s && !isHeaderOrJunkSansad(s)));

  return {
    success: true,
    beneficiaries: cleanBeneficiaries,
    total: cleanBeneficiaries.length,
    villagesCount: uniqueVillages.size,
    sansadsCount: uniqueSansads.size,
    source,
    message: syncMessage || `Synced ${cleanBeneficiaries.length} records.`,
    isNewData,
    timestamp
  };
}
