import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  FileEdit, 
  Save, 
  Printer, 
  FileCheck,
  CheckCircle2, 
  AlertCircle, 
  CreditCard, 
  User, 
  IdCard, 
  Phone,
  HelpCircle,
  Search,
  X,
  ChevronDown,
  Zap,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BeneficiaryRow, BankMasterItem, AppUser } from '../types';
import { VILLAGES_LIST, OFFICERS_LIST, canonicalizeBankName, LEGACY_IFSC_UPGRADE_MAP } from '../data/bankMaster';
import { formatKycDate } from '../utils/dateFormatter';

interface DataUpdateFormProps {
  beneficiaries: BeneficiaryRow[];
  bankMaster: BankMasterItem[];
  currentUser?: AppUser | null;
  onSaveRecord: (data: Partial<BeneficiaryRow>) => Promise<{ success: boolean; googleSheetSynced?: boolean; googleSheetMessage?: string } | boolean>;
  onPrintSlip: (row: BeneficiaryRow) => void;
  onPrintA5Slip: (row: BeneficiaryRow) => void;
  onOpenSyncModal?: (mode?: 'sheetLink' | 'paste' | 'upload') => void;
  language?: 'bn' | 'en';
}

export const DataUpdateForm: React.FC<DataUpdateFormProps> = ({
  beneficiaries,
  bankMaster,
  currentUser,
  onSaveRecord,
  onPrintSlip,
  onPrintA5Slip,
  onOpenSyncModal
}) => {
  // Selection states
  const [selectedAadhaar, setSelectedAadhaar] = useState<string>('');
  const [selectedJobCard, setSelectedJobCard] = useState<string>('');
  const [selectedApplicant, setSelectedApplicant] = useState<string>('');

  // Search Combobox states for Aadhaar and Job Card
  const [jobCardSearch, setJobCardSearch] = useState<string>('');
  const [isJobCardOpen, setIsJobCardOpen] = useState<boolean>(false);
  const [aadhaarSearch, setAadhaarSearch] = useState<string>('');
  const [isAadhaarOpen, setIsAadhaarOpen] = useState<boolean>(false);

  const jobCardDropdownRef = useRef<HTMLDivElement>(null);
  const aadhaarDropdownRef = useRef<HTMLDivElement>(null);

  // Close search dropdowns when clicking outside
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (jobCardDropdownRef.current && !jobCardDropdownRef.current.contains(e.target as Node)) {
        setIsJobCardOpen(false);
      }
      if (aadhaarDropdownRef.current && !aadhaarDropdownRef.current.contains(e.target as Node)) {
        setIsAadhaarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleDocumentClick);
    return () => document.removeEventListener('mousedown', handleDocumentClick);
  }, []);

  // Active loaded record state
  const [activeRow, setActiveRow] = useState<BeneficiaryRow | null>(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    colP: '', // Aadhaar
    colQ: '', // Phone
    colR: '', // eKYC (Yes/No)
    colS: '', // Date
    colT: '', // Error / Death
    colU: '', // Processed by
    colV: '', // Village
    colW: '', // Submitted to office
    colX: '', // Remarks
    colY: '', // Job Card Book Delivered (Yes/No)
    colAO: '', // Bank Name
    colAP: '', // IFSC
    colAQ: '', // Branch
    colAR: '', // Account
    colAR_confirm: '' // Confirm Account
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [mergerNotice, setMergerNotice] = useState<string>('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Array<{ key: string; label: string; value: string }>>([]);

  // Filtered Job Cards & Applicants
  const uniqueJobCards = Array.from(new Set(beneficiaries.map(b => b.colH).filter(Boolean))).sort();
  const availableApplicants = selectedJobCard 
    ? Array.from(new Set(beneficiaries.filter(b => b.colH === selectedJobCard).map(b => b.colJ).filter(Boolean)))
    : [];

  // Live filtered suggestions for Job Card Number Search
  const filteredJobCards = useMemo(() => {
    const q = jobCardSearch.trim().toLowerCase();
    if (!q) return [];
    const qDigits = q.replace(/\D/g, '');
    return beneficiaries
      .filter(b => {
        if (b.colH && String(b.colH).toLowerCase().includes(q)) return true;
        if (b.colJ && String(b.colJ).toLowerCase().includes(q)) return true;
        if (b.colB && String(b.colB).toLowerCase().includes(q)) return true;
        if (qDigits.length >= 4 && b.colP && b.colP.replace(/\D/g, '').includes(qDigits)) return true;
        return false;
      })
      .slice(0, 30);
  }, [beneficiaries, jobCardSearch]);

  // Live filtered suggestions for Aadhaar & Mobile Number Search
  const filteredAadhaarRecords = useMemo(() => {
    const raw = aadhaarSearch.trim();
    if (!raw) return [];
    
    const digitsOnly = raw.replace(/\D/g, '');
    const lower = raw.toLowerCase();

    // Collect matching items with priority scoring
    const scored: Array<{ record: BeneficiaryRow; score: number }> = [];

    for (let i = 0; i < beneficiaries.length; i++) {
      const b = beneficiaries[i];
      let score = 0;
      const aadhaarClean = (b.colP || '').replace(/\D/g, '');
      const phoneClean = (b.colQ || '').replace(/\D/g, '');
      const name = (b.colJ || '').toLowerCase();
      const jc = (b.colH || '').toLowerCase();
      const village = (b.colV || '').toLowerCase();
      const sansad = (b.colB || '').toLowerCase();

      // 1. Aadhaar matching (Top priority)
      if (digitsOnly.length > 0 && aadhaarClean.length > 0) {
        if (aadhaarClean === digitsOnly) {
          score = 100; // Exact 12-digit Aadhaar match
        } else if (aadhaarClean.startsWith(digitsOnly)) {
          score = 85;  // Starts with typed Aadhaar digits
        } else if (aadhaarClean.endsWith(digitsOnly)) {
          score = 75;  // Ends with typed digits (e.g. searching last 4 digits)
        } else if (aadhaarClean.includes(digitsOnly)) {
          score = 65;  // Substring match
        }
      }

      // 2. Mobile Phone matching
      if (digitsOnly.length > 0 && phoneClean.length > 0) {
        if (phoneClean === digitsOnly) {
          score = Math.max(score, 70); // Exact phone
        } else if (phoneClean.startsWith(digitsOnly)) {
          score = Math.max(score, 55);
        } else if (phoneClean.endsWith(digitsOnly)) {
          score = Math.max(score, 50);
        } else if (phoneClean.includes(digitsOnly)) {
          score = Math.max(score, 45);
        }
      }

      // 3. Name or Job Card or Village text matching (if query contains letters)
      if (lower.length > 0) {
        if (name === lower) {
          score = Math.max(score, 60);
        } else if (name.startsWith(lower)) {
          score = Math.max(score, 45);
        } else if (name.includes(lower)) {
          score = Math.max(score, 35);
        } else if (jc.includes(lower)) {
          score = Math.max(score, 30);
        } else if (village.includes(lower) || sansad.includes(lower)) {
          score = Math.max(score, 20);
        }
      }

      if (score > 0) {
        scored.push({ record: b, score });
      }
    }

    // Sort descending by score, then by row index
    scored.sort((a, b) => b.score - a.score || a.record.rowIndex - b.record.rowIndex);

    return scored.slice(0, 50).map(s => s.record);
  }, [beneficiaries, aadhaarSearch]);

  // Standard RBI 4-letter IFSC Bank Map for instant auto-resolution (includes merged entities)
  const RBI_BANK_PREFIX_MAP: Record<string, string> = {
    BKID: 'BANK OF INDIA',
    SBIN: 'STATE BANK OF INDIA',
    PUNB: 'PUNJAB NATIONAL BANK',
    UBIN: 'UNION BANK OF INDIA',
    IDIB: 'INDIAN BANK',
    CNRB: 'CANARA BANK',
    BARB: 'BANK OF BARODA',
    UCBA: 'UCO BANK',
    CBIN: 'CENTRAL BANK OF INDIA',
    UTIB: 'AXIS BANK',
    HDFC: 'HDFC BANK',
    ICIC: 'ICICI BANK',
    IOBA: 'INDIAN OVERSEAS BANK',
    BDBL: 'BANDHAN BANK',
    KKBK: 'KOTAK MAHINDRA BANK',
    WBSC: 'WEST BENGAL STATE COOP BANK',
    AIRP: 'AIRTEL PAYMENTS BANK',
    IPOS: 'INDIA POST PAYMENTS BANK',
    IBKL: 'IDBI BANK',
    ALLA: 'INDIAN BANK',
    UTBI: 'PUNJAB NATIONAL BANK',
    ORBC: 'PUNJAB NATIONAL BANK',
    SYNB: 'CANARA BANK',
    ANDB: 'UNION BANK OF INDIA',
    CORP: 'UNION BANK OF INDIA',
    BKDN: 'BANK OF BARODA',
    VIJB: 'BANK OF BARODA'
  };

  // Bank master lists (canonicalized and sorted)
  const uniqueBanks = useMemo(() => {
    const rawList = [
      'STATE BANK OF INDIA',
      'INDIA POST PAYMENTS BANK',
      'BANK OF INDIA',
      'PUNJAB NATIONAL BANK',
      'BANGIYA GRAMIN VIKASH BANK',
      'INDIAN BANK',
      'CANARA BANK',
      'UNION BANK OF INDIA',
      'BANK OF BARODA',
      'BALAGERIA CENTRAL CO-OPERATIVE BANK',
      'MUGBERIA CENTRAL CO-OPERATIVE BANK',
      'PASCHIM BANGA GRAMIN BANK',
      'UCO BANK',
      'CENTRAL BANK OF INDIA',
      'AXIS BANK',
      'HDFC BANK',
      'ICICI BANK',
      'IDBI BANK',
      'BANDHAN BANK',
      'INDIAN OVERSEAS BANK',
      'AIRTEL PAYMENTS BANK',
      ...bankMaster.map(b => b.bank),
      formData.colAO
    ].filter(Boolean);

    return Array.from(new Set(rawList.map(b => canonicalizeBankName(b)))).sort();
  }, [bankMaster, formData.colAO]);

  const availableIfscs = useMemo(() => {
    if (!formData.colAO) return bankMaster.map(b => b.ifsc);
    const canonical = canonicalizeBankName(formData.colAO);
    return bankMaster
      .filter(b => canonicalizeBankName(b.bank) === canonical || b.bank.toUpperCase() === formData.colAO.toUpperCase())
      .map(b => b.ifsc);
  }, [bankMaster, formData.colAO]);

  const availableBranches = useMemo(() => {
    if (!formData.colAO) return [];
    const canonical = canonicalizeBankName(formData.colAO);
    return bankMaster.filter(b => {
      const bCanonical = canonicalizeBankName(b.bank);
      return bCanonical === canonical || b.bank.toUpperCase() === formData.colAO.toUpperCase();
    });
  }, [bankMaster, formData.colAO]);

  // Populate Form Fields and Normalize Banking from a Selected Beneficiary Record
  const populateRecordToForm = useCallback((match: BeneficiaryRow) => {
    setActiveRow(match);
    setSelectedJobCard(match.colH);
    setJobCardSearch(match.colH);
    setSelectedApplicant(match.colJ);
    setSelectedAadhaar(match.colP || '');
    setAadhaarSearch(match.colP || match.colQ || match.colH || '');
    setIsAadhaarOpen(false);

    // Normalize Bank details (fix branch vs IFSC if inverted)
    let resolvedIfsc = (match.colAP || '').trim().toUpperCase();
    let resolvedBranch = (match.colAQ || '').trim().toUpperCase();
    let resolvedBank = (match.colAO || '').trim().toUpperCase();

    const isBranchAnIfsc = /^[A-Z]{4}0[A-Z0-9]{6}$/.test(resolvedBranch) || bankMaster.some(b => b.ifsc.toUpperCase() === resolvedBranch);
    const isIfscABranch = resolvedIfsc.includes('BRANCH') || resolvedIfsc.includes('MAIN') || resolvedIfsc.includes('BAZAR') || resolvedIfsc.includes('RURAL') || resolvedIfsc.includes('MIDNAPORE');

    if (isBranchAnIfsc || isIfscABranch) {
      const temp = resolvedIfsc;
      resolvedIfsc = resolvedBranch;
      resolvedBranch = temp;
    }

    // Auto-upgrade legacy merged IFSC (e.g. ALLA0212824 -> IDIB000E503, UTBI0EGR276 -> PUNB0019020)
    if (LEGACY_IFSC_UPGRADE_MAP[resolvedIfsc]) {
      const up = LEGACY_IFSC_UPGRADE_MAP[resolvedIfsc];
      resolvedIfsc = up.newIfsc;
      resolvedBank = up.newBank;
      if (!resolvedBranch || resolvedBranch === '—') resolvedBranch = up.branch;
      setMergerNotice(`Legacy IFSC recognized (${up.reason}): Auto-updated to ${up.newBank} (IFSC: ${up.newIfsc}, Branch: ${up.branch})`);
    } else {
      setMergerNotice('');
    }

    // Canonicalize Bank name (e.g. IPPB / INDIAN POST -> INDIA POST PAYMENTS BANK, SBI -> STATE BANK OF INDIA)
    if (resolvedBank) {
      resolvedBank = canonicalizeBankName(resolvedBank);
    }

    // Auto-fill from bankMaster if IFSC is recognized
    const matchedBank = bankMaster.find(b => b.ifsc.toUpperCase() === resolvedIfsc);
    if (matchedBank) {
      if (!resolvedBank || resolvedBank === '—') resolvedBank = matchedBank.bank;
      if (!resolvedBranch || resolvedBranch === '—') {
        resolvedBranch = matchedBank.branch;
      }
    }

    // If IPPB and branch is missing, set default Bathuary/Egra branch
    if (resolvedBank === 'INDIA POST PAYMENTS BANK' && (!resolvedBranch || resolvedBranch === '—' || resolvedBranch.includes('PROCESSING'))) {
      resolvedBranch = 'BATHUARY BO';
    }

    const formattedKyc = formatKycDate(match.colS);

    setFormData({
      colP: match.colP || '',
      colQ: match.colQ || '',
      colR: match.colR || '',
      colS: formattedKyc || '',
      colT: match.colT || '',
      colU: match.colU || (currentUser ? `${currentUser.name}, ${currentUser.role}` : ''),
      colV: match.colV || '',
      colW: match.colW || '',
      colX: match.colX || '',
      colY: match.colY || '',
      colAO: resolvedBank,
      colAP: resolvedIfsc,
      colAQ: resolvedBranch,
      colAR: match.colAR || '',
      colAR_confirm: match.colAR || ''
    });
  }, [bankMaster, currentUser]);

  // Sync selected record when Applicant changes
  useEffect(() => {
    if (selectedJobCard && selectedApplicant) {
      const match = beneficiaries.find(b => b.colH === selectedJobCard && b.colJ === selectedApplicant);
      if (match) {
        populateRecordToForm(match);
      }
    } else if (!activeRow) {
      setActiveRow(null);
    }
  }, [selectedJobCard, selectedApplicant, beneficiaries, populateRecordToForm, activeRow]);

  // Selection handlers
  const handleSelectJobCardMatch = (cardNo: string, applicantName?: string) => {
    setSelectedJobCard(cardNo);
    setJobCardSearch(cardNo);
    setIsJobCardOpen(false);
    const applicants = Array.from(new Set(beneficiaries.filter(b => b.colH === cardNo).map(b => b.colJ).filter(Boolean)));
    if (applicantName) {
      setSelectedApplicant(applicantName);
    } else if (applicants.length === 1) {
      setSelectedApplicant(applicants[0]);
    } else {
      setSelectedApplicant('');
    }
  };

  const handleSelectAadhaarMatch = (b: BeneficiaryRow) => {
    populateRecordToForm(b);
  };

  const handleAadhaarInputChange = (val: string) => {
    setAadhaarSearch(val);
    setIsAadhaarOpen(true);
    const cleanDigits = val.replace(/\D/g, '');
    setSelectedAadhaar(cleanDigits);

    // Auto-populate immediately if user types or pastes all 12 digits of an existing Aadhaar
    if (cleanDigits.length === 12) {
      const exactMatch = beneficiaries.find(b => (b.colP || '').replace(/\D/g, '') === cleanDigits);
      if (exactMatch) {
        populateRecordToForm(exactMatch);
      }
    }
  };

  const handleAadhaarKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredAadhaarRecords.length > 0) {
        populateRecordToForm(filteredAadhaarRecords[0]);
      }
    } else if (e.key === 'Escape') {
      setIsAadhaarOpen(false);
    }
  };

  const handleJobCardInputChange = (val: string) => {
    setJobCardSearch(val);
    setIsJobCardOpen(true);
    const exact = beneficiaries.find(b => b.colH && b.colH.toUpperCase() === val.trim().toUpperCase());
    if (exact) {
      setSelectedJobCard(exact.colH);
      const applicants = Array.from(new Set(beneficiaries.filter(b => b.colH === exact.colH).map(b => b.colJ).filter(Boolean)));
      if (applicants.length === 1) {
        setSelectedApplicant(applicants[0]);
      }
    }
  };

  // IFSC Change -> Auto Fill Bank & Branch (Merged Banks + Master + RBI 4-letter prefix + Razorpay API)
  const handleIfscChange = (ifsc: string) => {
    const clean = ifsc.trim().toUpperCase();
    setMergerNotice('');

    // 0. Check legacy merged IFSC mapping (e.g. ALLA0212824 -> IDIB000E503, UTBI0EGR276 -> PUNB0019020)
    if (LEGACY_IFSC_UPGRADE_MAP[clean]) {
      const upgrade = LEGACY_IFSC_UPGRADE_MAP[clean];
      setFormData(prev => ({
        ...prev,
        colAP: upgrade.newIfsc,
        colAO: upgrade.newBank,
        colAQ: upgrade.branch
      }));
      setMergerNotice(`Legacy IFSC recognized: ${clean} (${upgrade.reason}). Auto-updated to ${upgrade.newBank} (IFSC: ${upgrade.newIfsc}, Branch: ${upgrade.branch}).`);
      return;
    }

    // Special handling for IPPB (IPOS0000001) to preserve valid postal branch
    if (clean === 'IPOS0000001') {
      setFormData(prev => {
        const keepBranch = prev.colAQ && prev.colAQ !== '—' && !prev.colAQ.includes('PROCESSING') ? prev.colAQ : 'BATHUARY BO';
        return {
          ...prev,
          colAP: 'IPOS0000001',
          colAO: 'INDIA POST PAYMENTS BANK',
          colAQ: keepBranch
        };
      });
      return;
    }

    // 1. Check local bankMaster
    const item = bankMaster.find(b => b.ifsc.toUpperCase() === clean);
    if (item) {
      setFormData(prev => ({
        ...prev,
        colAP: item.ifsc,
        colAO: item.bank,
        colAQ: item.branch
      }));
      return;
    }

    // 2. Immediate RBI 4-letter Bank Prefix resolution
    const prefix = clean.slice(0, 4);
    const resolvedBank = RBI_BANK_PREFIX_MAP[prefix] || '';

    setFormData(prev => ({
      ...prev,
      colAP: clean,
      colAO: resolvedBank ? canonicalizeBankName(resolvedBank) : prev.colAO
    }));

    // 3. Live open IFSC lookup when 11 characters are entered
    if (clean.length === 11) {
      fetch(`https://ifsc.razorpay.com/${clean}`)
        .then(res => (res.ok ? res.json() : null))
        .then(data => {
          if (data && data.BANK) {
            const isIppb = clean === 'IPOS0000001' || String(data.BANK).toUpperCase().includes('POST');
            setFormData(prev => ({
              ...prev,
              colAP: clean,
              colAO: canonicalizeBankName(data.BANK ? String(data.BANK).toUpperCase() : (resolvedBank || prev.colAO)),
              colAQ: isIppb ? (prev.colAQ || 'BATHUARY BO') : (data.BRANCH ? String(data.BRANCH).toUpperCase() : prev.colAQ)
            }));
          }
        })
        .catch(() => {});
    }
  };

  // Bank Change -> Auto select IFSC & Branch if available
  const handleBankChange = (bank: string) => {
    const canonical = canonicalizeBankName(bank);
    const matches = bankMaster.filter(b => canonicalizeBankName(b.bank) === canonical);
    const existingBranchMatch = matches.find(m => m.branch.toUpperCase() === (formData.colAQ || '').toUpperCase());

    let defaultBranch = existingBranchMatch ? existingBranchMatch.branch : (matches.length > 0 ? matches[0].branch : (formData.colAQ || ''));
    let defaultIfsc = existingBranchMatch ? existingBranchMatch.ifsc : (matches.length > 0 ? matches[0].ifsc : formData.colAP);

    if (canonical === 'INDIA POST PAYMENTS BANK') {
      defaultIfsc = 'IPOS0000001';
      if (!existingBranchMatch) {
        defaultBranch = formData.colAQ && formData.colAQ !== '—' && !formData.colAQ.includes('PROCESSING') ? formData.colAQ : 'BATHUARY BO';
      }
    }

    setFormData(prev => ({
      ...prev,
      colAO: canonical,
      colAP: defaultIfsc,
      colAQ: defaultBranch
    }));
  };

  // Branch Change -> Auto select matching verified IFSC
  const handleBranchChange = (branch: string) => {
    const cleanBranch = branch.trim().toUpperCase();
    const canonical = canonicalizeBankName(formData.colAO);
    const bankMatches = bankMaster.filter(b => canonicalizeBankName(b.bank) === canonical);
    const match = bankMatches.find(b => b.branch.toUpperCase() === cleanBranch) || bankMaster.find(b => b.branch.toUpperCase() === cleanBranch);

    setFormData(prev => ({
      ...prev,
      colAQ: cleanBranch,
      colAP: match ? match.ifsc : (canonical === 'INDIA POST PAYMENTS BANK' ? 'IPOS0000001' : prev.colAP),
      colAO: match ? canonicalizeBankName(match.bank) : (canonical || prev.colAO)
    }));
  };

  // e-KYC Toggle -> auto date
  const handleEkycChange = (val: string) => {
    const today = new Date().toLocaleDateString('en-GB'); // DD/MM/YYYY
    setFormData(prev => ({
      ...prev,
      colR: val,
      colS: val === 'Yes' ? (formatKycDate(prev.colS) || today) : ''
    }));
  };

  // Validations
  const isAadhaarValid = formData.colP ? /^\d{12}$/.test(formData.colP) : true;
  const isPhoneValid = formData.colQ ? /^\d{10}$/.test(formData.colQ) : true;
  const isAccountMatching = formData.colAR && formData.colAR_confirm 
    ? formData.colAR === formData.colAR_confirm 
    : true;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus(null);

    if (!isAadhaarValid) {
      setSaveStatus({
        type: 'error',
        message: "Please enter a valid 12-digit Aadhaar number."
      });
      return;
    }
    if (!isPhoneValid) {
      setSaveStatus({
        type: 'error',
        message: "Please enter a valid 10-digit mobile phone number."
      });
      return;
    }
    if (formData.colAR && !isAccountMatching) {
      setSaveStatus({
        type: 'error',
        message: "Account number and confirm account number do not match."
      });
      return;
    }

    // Calculate which fields have actually been modified compared to activeRow
    const fieldDefinitions: Array<{ key: keyof typeof formData; label: string }> = [
      { key: 'colP', label: 'Aadhaar / ID Number (Col P)' },
      { key: 'colQ', label: 'Phone Number (Col Q)' },
      { key: 'colR', label: 'e-KYC Done (Col R)' },
      { key: 'colS', label: 'Date of e-KYC Done (Col S)' },
      { key: 'colT', label: 'Error / Death Remark (Col T)' },
      { key: 'colU', label: 'e-KYC Processed by (Col U)' },
      { key: 'colV', label: 'Village Name (Col V)' },
      { key: 'colW', label: 'Job Card Submitted (Col W)' },
      { key: 'colX', label: 'Remarks (Col X)' },
      { key: 'colY', label: 'Job Card Book Delivered (Col Y)' },
      { key: 'colAO', label: 'Bank Name (Col AO)' },
      { key: 'colAP', label: 'IFSC Code (Col AP)' },
      { key: 'colAQ', label: 'Branch Name (Col AQ)' },
      { key: 'colAR', label: 'Account Number (Col AR)' }
    ];

    const detectedChanges: Array<{ key: string; label: string; value: string }> = [];
    fieldDefinitions.forEach(({ key, label }) => {
      const currentVal = (formData[key] || '').toString().trim();
      const originalVal = ((activeRow as any)[key] || '').toString().trim();
      if (currentVal !== originalVal) {
        detectedChanges.push({ key, label, value: currentVal });
      }
    });

    setPendingChanges(detectedChanges);
    setShowConfirmModal(true);
  };

  const handleConfirmSave = async () => {
    setShowConfirmModal(false);
    if (!activeRow) return;

    const changedKeys = pendingChanges.map(c => c.key);
    const fieldUpdates: Record<string, any> = {};
    changedKeys.forEach(k => {
      fieldUpdates[k] = (formData as any)[k];
    });

    setIsSaving(true);
    const saveRes = await onSaveRecord({
      rowIndex: activeRow.rowIndex,
      ...formData,
      changedFields: changedKeys,
      fieldUpdates
    } as any);
    setIsSaving(false);

    const isSuccess = typeof saveRes === 'boolean' ? saveRes : saveRes?.success;
    const isGoogleSheetSynced = typeof saveRes === 'object' ? saveRes?.googleSheetSynced : false;
    const gasMessage = typeof saveRes === 'object' ? saveRes?.googleSheetMessage : '';

    if (isSuccess) {
      try {
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      } catch (err) {
        console.warn('Confetti effect skipped:', err);
      }

      if (isGoogleSheetSynced) {
        setSaveStatus({
          type: 'success',
          message: `✓ Saved locally & Live Auto-Synced to Google Sheet! (${gasMessage || 'Row updated'})`
        });
      } else if (gasMessage) {
        setSaveStatus({
          type: 'info',
          message: `✓ Record updated locally. Google Sheet sync: ${gasMessage}`
        });
      } else {
        setSaveStatus({
          type: 'success',
          message: "Data saved and verified successfully!"
        });
      }
    } else {
      setSaveStatus({
        type: 'error',
        message: "Failed to save record. Please check permissions."
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Search & Select Controls with Colorful Gradient Border */}
      <div className="rounded-3xl bg-gradient-to-br from-white via-slate-50 to-emerald-50/20 border-2 border-slate-200 p-6 sm:p-8 shadow-sm relative overflow-visible">
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 absolute top-0 left-0 rounded-t-3xl" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-200/80 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
              <FileEdit className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  Job Card Data Update & Verification
                </h3>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                  Live Editor
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Search Aadhaar UID or Mobile Number, or select Job Card to load and update records with live Google Sheet sync.
              </p>
            </div>
          </div>

          {/* 2-Way Live Auto-Sync Status / Quick Open */}
          {onOpenSyncModal && (
            <button
              type="button"
              onClick={() => onOpenSyncModal('sheetLink')}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 text-emerald-800 text-xs font-black transition-all cursor-pointer self-start sm:self-auto shadow-xs hover:shadow-md"
              title="Click to check or configure Google Sheet Live Sync"
            >
              <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              <span>Google Sheet Live Sync</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Aadhaar & Mobile Fast Search & Combobox */}
          <div ref={aadhaarDropdownRef} className="relative bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs z-30">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <IdCard className="w-4 h-4 text-emerald-600" />
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span>Aadhaar / Mobile (Col P & Q):</span>
              </label>
              {aadhaarSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setAadhaarSearch('');
                    setSelectedAadhaar('');
                    setIsAadhaarOpen(false);
                  }}
                  className="text-[11px] text-slate-400 hover:text-rose-600 font-bold flex items-center gap-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" /> Clear
                </button>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search 12-digit Aadhaar, Mobile, or Name..."
                value={aadhaarSearch}
                onFocus={() => setIsAadhaarOpen(true)}
                onChange={(e) => handleAadhaarInputChange(e.target.value)}
                onKeyDown={handleAadhaarKeyDown}
                className="w-full bg-slate-50 text-slate-900 text-xs sm:text-sm font-bold rounded-xl pl-9 pr-8 py-2 border-2 border-slate-200 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all shadow-2xs"
              />
              <button
                type="button"
                onClick={() => setIsAadhaarOpen(!isAadhaarOpen)}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${isAadhaarOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Aadhaar & Mobile Live Search Dropdown */}
            {isAadhaarOpen && (
              <div 
                onMouseDown={(e) => e.stopPropagation()}
                className="absolute z-[100] left-0 right-0 mt-2 bg-white rounded-2xl border-2 border-emerald-500 shadow-2xl max-h-80 overflow-y-auto divide-y divide-slate-100"
              >
                {filteredAadhaarRecords.length > 0 ? (
                  <>
                    <div className="px-3.5 py-2 bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 text-[11px] font-bold text-emerald-950 flex justify-between items-center sticky top-0 z-10 border-b border-emerald-200/80">
                      <span>Found {filteredAadhaarRecords.length} citizen match(es)</span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-black">
                        Click to load
                      </span>
                    </div>
                    {filteredAadhaarRecords.map((item, idx) => (
                      <button
                        key={`${item.colH}-${item.colJ}-${idx}`}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSelectAadhaarMatch(item);
                        }}
                        onClick={() => handleSelectAadhaarMatch(item)}
                        className="w-full text-left px-3.5 py-2.5 hover:bg-emerald-50/80 transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <div className="space-y-1 pr-2">
                          <div className="font-sans font-black text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                            <span>{item.colJ}</span>
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                              JC: {item.colH}
                            </span>
                            {item.colR === 'Yes' || item.colR === 'Y' ? (
                              <span className="text-[9px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-full">
                                e-KYC Done
                              </span>
                            ) : (
                              <span className="text-[9px] font-black text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded-full">
                                Pending
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                            <span className="font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                              🆔 {item.colP ? (item.colP.length === 12 ? `${item.colP.slice(0, 4)} ${item.colP.slice(4, 8)} ${item.colP.slice(8, 12)}` : item.colP) : 'No Aadhaar'}
                            </span>
                            <span className="font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
                              📱 {item.colQ ? item.colQ : 'No Mobile'}
                            </span>
                            <span className="text-slate-500 font-medium">
                              • {item.colV} • {item.colB}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Select →
                        </span>
                      </button>
                    ))}
                  </>
                ) : (
                  <div className="px-4 py-4 text-xs text-slate-500 text-center">
                    {aadhaarSearch.trim() 
                      ? `No citizen found matching "${aadhaarSearch}". Try searching other digits or name.` 
                      : "Type Aadhaar digits, Mobile number, or Name to search"}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Job Card Fast Search & Combobox */}
          <div ref={jobCardDropdownRef} className="relative bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs z-20">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-indigo-600" />
                <span>Job Card Number (Col H):</span>
              </label>
              {jobCardSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setJobCardSearch('');
                    setSelectedJobCard('');
                    setSelectedApplicant('');
                    setIsJobCardOpen(false);
                  }}
                  className="text-[11px] text-slate-400 hover:text-rose-600 font-bold flex items-center gap-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" /> Clear
                </button>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search Job Card, Name, or Sansad..."
                value={jobCardSearch}
                onFocus={() => setIsJobCardOpen(true)}
                onChange={(e) => handleJobCardInputChange(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-xs sm:text-sm font-bold rounded-xl pl-9 pr-8 py-2 border-2 border-slate-200 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all shadow-2xs"
              />
              <button
                type="button"
                onClick={() => setIsJobCardOpen(!isJobCardOpen)}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${isJobCardOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Job Card Live Search Dropdown */}
            {isJobCardOpen && (
              <div 
                onMouseDown={(e) => e.stopPropagation()}
                className="absolute z-[100] left-0 right-0 mt-2 bg-white rounded-2xl border-2 border-indigo-500 shadow-2xl max-h-80 overflow-y-auto divide-y divide-slate-100"
              >
                {filteredJobCards.length > 0 ? (
                  <>
                    <div className="px-3.5 py-2 bg-indigo-50 text-[11px] font-bold text-indigo-900 flex justify-between items-center sticky top-0 z-10 border-b border-indigo-200/80">
                      <span>Found {filteredJobCards.length} match(es)</span>
                      <span className="text-[10px] text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full font-black">
                        Click to select
                      </span>
                    </div>
                    {filteredJobCards.map((b, idx) => (
                      <button
                        key={`${b.colH}-${b.colJ}-${idx}`}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSelectJobCardMatch(b.colH, b.colJ);
                        }}
                        onClick={() => handleSelectJobCardMatch(b.colH, b.colJ)}
                        className="w-full text-left px-3.5 py-2.5 hover:bg-indigo-50/80 transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <div className="space-y-0.5 pr-2">
                          <div className="font-mono font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                            <span className="text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded text-[11px] font-mono border border-indigo-200">
                              {b.colH}
                            </span>
                            <span className="font-sans font-bold text-slate-800">{b.colJ}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5 flex flex-wrap gap-2">
                            <span>🆔 Aadhaar: {b.colP ? `•••• ${b.colP.slice(-4)}` : 'Not linked'}</span>
                            <span>📱 {b.colQ ? b.colQ : 'No phone'}</span>
                            <span>• {b.colV}</span>
                            <span>• {b.colB}</span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Select →
                        </span>
                      </button>
                    ))}
                  </>
                ) : (
                  <div className="px-4 py-4 text-xs text-slate-500 text-center">
                    {jobCardSearch.trim() ? "No matching Job Card found." : "Type to search by Job Card, Name, or Sansad"}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Applicant Select */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <User className="w-4 h-4 text-amber-600" />
                <span>Applicant Name (Col J):</span>
              </label>
              {selectedApplicant && (
                <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Active
                </span>
              )}
            </div>
            <select
              value={selectedApplicant}
              disabled={!selectedJobCard}
              onChange={(e) => setSelectedApplicant(e.target.value)}
              className={`w-full bg-slate-50 text-slate-900 text-xs sm:text-sm font-bold rounded-xl px-3 py-2 border-2 border-slate-200 focus:border-amber-500 focus:bg-white focus:outline-none transition-all cursor-pointer shadow-2xs ${
                !selectedJobCard ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <option value="">
                {selectedJobCard ? "-- Select Applicant from Card --" : "-- First Search Job Card or Aadhaar --"}
              </option>
              {availableApplicants.map(app => (
                <option key={app} value={app}>{app}</option>
              ))}
            </select>
          </div>
        </div>

        {saveStatus && (
          <div className={`mt-4 p-3 rounded-xl flex items-center gap-2 text-xs font-bold ${
            saveStatus.type === 'success' 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
              : saveStatus.type === 'info'
              ? 'bg-sky-50 text-sky-700 border border-sky-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}>
            {saveStatus.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{saveStatus.message}</span>
          </div>
        )}
      </div>

      {/* Main Data Form */}
      {activeRow ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dynamic Active Citizen Summary Bar */}
          <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shrink-0">
                {(activeRow.colJ || 'C').charAt(0)}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-black text-white tracking-wide uppercase">
                    {activeRow.colJ}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    (formData.colR || '').toUpperCase() === 'YES' || (formData.colR || '').toUpperCase() === 'Y'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-amber-400 text-slate-950'
                  }`}>
                    {(formData.colR || '').toUpperCase() === 'YES' || (formData.colR || '').toUpperCase() === 'Y' ? "✓ e-KYC Done" : "⏳ e-KYC Pending"}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-1 font-medium">
                  <span className="font-mono text-emerald-300 font-bold">JC: {activeRow.colH}</span>
                  <span>• Sansad: <b className="text-white">{activeRow.colB}</b></span>
                  <span>• Village: <b className="text-white">{activeRow.colV}</b></span>
                  <span>• Row #{activeRow.rowIndex}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  setActiveRow(null);
                  setSelectedJobCard('');
                  setSelectedApplicant('');
                  setSelectedAadhaar('');
                  setJobCardSearch('');
                  setAadhaarSearch('');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 cursor-pointer"
              >
                Change Record
              </button>
            </div>
          </div>

          {/* Section 1: Read Only Information (Col A - Col O, AF, AG) */}
          <div className="rounded-3xl bg-gradient-to-br from-white to-blue-50/20 border-2 border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-indigo-100" />
                <h4 className="text-sm sm:text-base font-black text-slate-900">
                  Official Master Records (Col A - O, AF, AG) [Read Only]
                </h4>
              </div>
              <span className="text-[11px] font-black text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                Row #{activeRow.rowIndex}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <ReadOnlyField label="Sheet Sl No (A)" value={activeRow.colA} />
              <ReadOnlyField label="Sansad Name (B)" value={activeRow.colB} highlight />
              <ReadOnlyField label="District (D)" value={activeRow.colD} />
              <ReadOnlyField label="Block (E)" value={activeRow.colE} />
              <ReadOnlyField label="Gram Panchayat (F)" value={activeRow.colF} />
              <ReadOnlyField label="Job Card Number (H)" value={activeRow.colH} highlight />
              <ReadOnlyField label="Applicant No (I)" value={activeRow.colI} />
              <ReadOnlyField label="Applicant Name (J)" value={activeRow.colJ} highlight />
              <ReadOnlyField label="Gender (K)" value={activeRow.colK} />
              <ReadOnlyField label="Name as per ID (L)" value={activeRow.colL} />
              <ReadOnlyField label="Head of Household (AG)" value={activeRow.colAG} />
              <ReadOnlyField label="Father/Husband Name of HH (AF)" value={activeRow.colAF} />
              <ReadOnlyField label="Aadhaar Seeded in NREGASoft (M)" value={activeRow.colM} />
              <ReadOnlyField label="Demographic Auth Done (N)" value={activeRow.colN} />
              <ReadOnlyField label="Enables for ABPS? (O)" value={activeRow.colO} highlight />
            </div>
          </div>

          {/* Section 2: Editable e-KYC Data (Col P - Col Y) */}
          <div className="rounded-3xl bg-gradient-to-br from-white to-emerald-50/20 border-2 border-emerald-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-emerald-100 pb-3">
              <span className="w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-emerald-100" />
              <h4 className="text-sm sm:text-base font-black text-slate-900">
                Data Entry & e-KYC Verification (Col P - Col Y)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Col P: Aadhaar */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Aadhaar / ID Number (Col P):</span>
                  <span className={`text-[10px] ${formData.colP.length === 12 ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}>
                    {formData.colP.length}/12
                  </span>
                </label>
                <input
                  type="text"
                  maxLength={12}
                  placeholder="12 Digit Aadhaar Number"
                  value={formData.colP}
                  onChange={(e) => setFormData({ ...formData, colP: e.target.value.replace(/\D/g, '') })}
                  className={`w-full bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl px-3.5 py-2.5 border focus:outline-none transition-all ${
                    formData.colP && !isAadhaarValid 
                      ? 'border-rose-400 bg-rose-50 text-rose-900' 
                      : formData.colP.length === 12 
                        ? 'border-emerald-500 bg-emerald-50/50' 
                        : 'border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                  }`}
                />
              </div>

              {/* Col Q: Phone */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Worker Phone Number (Col Q):</span>
                  <span className={`text-[10px] ${formData.colQ.length === 10 ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}>
                    {formData.colQ.length}/10
                  </span>
                </label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="10 Digit Mobile Number"
                  value={formData.colQ}
                  onChange={(e) => setFormData({ ...formData, colQ: e.target.value.replace(/\D/g, '') })}
                  className={`w-full bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl px-3.5 py-2.5 border focus:outline-none transition-all ${
                    formData.colQ && !isPhoneValid 
                      ? 'border-rose-400 bg-rose-50 text-rose-900' 
                      : formData.colQ.length === 10 
                        ? 'border-emerald-500 bg-emerald-50/50' 
                        : 'border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                  }`}
                />
              </div>

              {/* Col R: e-KYC Done */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">
                  e-KYC Successfully Done (Col R):
                </label>
                <select
                  value={formData.colR}
                  onChange={(e) => handleEkycChange(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl px-3.5 py-2.5 border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all cursor-pointer"
                >
                  <option value="">-- Select --</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Col S: Date of e-KYC Done */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Date of e-KYC Done (Col S):</span>
                  {formData.colR === 'Yes' && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, colS: new Date().toLocaleDateString('en-GB') })}
                      className="text-[10px] text-emerald-700 font-bold hover:underline cursor-pointer"
                    >
                      Set Today
                    </button>
                  )}
                </label>
                <input
                  type="text"
                  placeholder="DD/MM/YYYY"
                  value={formData.colS ? formatKycDate(formData.colS) : ''}
                  onChange={(e) => setFormData({ ...formData, colS: e.target.value })}
                  className="w-full bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl px-3.5 py-2.5 border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all font-mono"
                />
              </div>

              {/* Col T: Error shown */}
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 mb-1 block">
                  Error shown during e-KYC / Death (Col T):
                </label>
                <input
                  type="text"
                  placeholder="Enter Error Message or Death / Expired"
                  value={formData.colT}
                  onChange={(e) => setFormData({ ...formData, colT: e.target.value })}
                  className="w-full bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl px-3.5 py-2.5 border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all"
                />
              </div>

              {/* Col U: e-KYC Processed by */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">
                  e-KYC Process done by (Col U):
                </label>
                <select
                  value={formData.colU}
                  onChange={(e) => setFormData({ ...formData, colU: e.target.value })}
                  className="w-full bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl px-3.5 py-2.5 border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all cursor-pointer"
                >
                  <option value="">-- Select Officer --</option>
                  {OFFICERS_LIST.map(officer => (
                    <option key={officer} value={officer}>{officer}</option>
                  ))}
                </select>
              </div>

              {/* Col V: Village Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">
                  Village Name (Col V):
                </label>
                <select
                  value={formData.colV}
                  onChange={(e) => setFormData({ ...formData, colV: e.target.value })}
                  className="w-full bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl px-3.5 py-2.5 border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all cursor-pointer"
                >
                  <option value="">-- Select Village --</option>
                  <option value="No Village Name">No Village Name (Unassigned)</option>
                  {VILLAGES_LIST.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              {/* Col W: Job Card Submitted */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">
                  Job Card Submitted to Office? (Col W):
                </label>
                <select
                  value={formData.colW}
                  onChange={(e) => setFormData({ ...formData, colW: e.target.value })}
                  className="w-full bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl px-3.5 py-2.5 border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all cursor-pointer"
                >
                  <option value="">-- Select --</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Col X: Remark */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">
                  Remarks (Col X):
                </label>
                <input
                  type="text"
                  placeholder="Enter remarks..."
                  value={formData.colX}
                  onChange={(e) => setFormData({ ...formData, colX: e.target.value })}
                  className="w-full bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl px-3.5 py-2.5 border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all"
                />
              </div>

              {/* Col Y: Job Card Book Delivered (Yes/No) */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">
                  Job Card Book Delivered? (Yes/No) (Col Y):
                </label>
                <select
                  value={formData.colY}
                  onChange={(e) => setFormData({ ...formData, colY: e.target.value })}
                  className="w-full bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl px-3.5 py-2.5 border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all cursor-pointer"
                >
                  <option value="">-- Select --</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Bank Details (Col AO - Col AR) with Merger Normalization */}
          <div className="rounded-3xl bg-gradient-to-br from-white to-amber-50/20 border-2 border-amber-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-amber-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 ring-4 ring-amber-100" />
                <h4 className="text-sm sm:text-base font-black text-slate-900">
                  Bank Account & ABPS Details (Col AO - Col AR)
                </h4>
              </div>
              <span className="text-[11px] font-black text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full border border-amber-300">
                RBI & WB Master Verified
              </span>
            </div>

            {mergerNotice && (
              <div className="mb-4 flex items-start gap-2.5 p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 text-xs shadow-xs">
                <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="font-semibold leading-relaxed">
                  <span className="font-black text-amber-900">RBI Bank Merger / Code Resolution:</span> {mergerNotice}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Col AP: IFSC Code (Auto-fills Bank and Branch) */}
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>IFSC Code (Col AP) — Select to auto-fill Bank & Branch:</span>
                  {formData.colAP && bankMaster.some(b => b.ifsc.toUpperCase() === formData.colAP.toUpperCase()) && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      ✓ Master IFSC Matched
                    </span>
                  )}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <select
                    value={formData.colAP}
                    onChange={(e) => handleIfscChange(e.target.value)}
                    className="sm:col-span-2 bg-slate-50 text-slate-900 text-xs sm:text-sm font-semibold rounded-xl px-3.5 py-2.5 border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all cursor-pointer font-mono"
                  >
                    <option value="">-- Choose IFSC Code (Auto-fills Bank & Branch) --</option>
                    {formData.colAP && !bankMaster.some(b => b.ifsc.toUpperCase() === formData.colAP.toUpperCase()) && (
                      <option value={formData.colAP}>{formData.colAP} — Current Record IFSC</option>
                    )}
                    {bankMaster.map(item => (
                      <option key={`${item.bank}-${item.branch}-${item.ifsc}`} value={item.ifsc}>
                        {item.ifsc} — {item.bank} ({item.branch})
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Or type/paste IFSC..."
                    value={formData.colAP}
                    onChange={(e) => handleIfscChange(e.target.value.toUpperCase())}
                    className="w-full bg-slate-50 text-slate-900 text-xs sm:text-sm font-semibold rounded-xl px-3.5 py-2.5 border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all font-mono uppercase"
                  />
                </div>
              </div>

              {/* Col AO: Bank Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Bank Name (Col AO):</span>
                  {formData.colAO && (
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      ✓ Auto-synced
                    </span>
                  )}
                </label>
                <div className="space-y-1.5">
                  <select
                    value={formData.colAO}
                    onChange={(e) => handleBankChange(e.target.value)}
                    className="w-full bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl px-3.5 py-2.5 border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all cursor-pointer"
                  >
                    <option value="">-- Select Bank --</option>
                    {uniqueBanks.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={formData.colAO}
                    onChange={(e) => setFormData({ ...formData, colAO: e.target.value.toUpperCase() })}
                    placeholder="Or type Bank Name..."
                    className="w-full bg-slate-50 text-slate-800 text-xs font-semibold rounded-xl px-3.5 py-1.5 border border-slate-200 focus:border-emerald-500 focus:outline-none uppercase"
                  />
                </div>
              </div>

              {/* Col AQ: Branch Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Branch Name (Col AQ):</span>
                  {formData.colAQ && (
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      ✓ Verified Branch
                    </span>
                  )}
                </label>
                <div className="space-y-1.5">
                  {availableBranches.length > 0 && (
                    <select
                      value={formData.colAQ}
                      onChange={(e) => handleBranchChange(e.target.value)}
                      className="w-full bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl px-3.5 py-2.5 border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all cursor-pointer"
                    >
                      <option value="">-- Choose Branch ({availableBranches.length} verified) --</option>
                      {availableBranches.map(b => (
                        <option key={`${b.bank}-${b.branch}-${b.ifsc}`} value={b.branch}>
                          {b.branch} — (IFSC: {b.ifsc})
                        </option>
                      ))}
                    </select>
                  )}
                  <input
                    type="text"
                    value={formData.colAQ}
                    onChange={(e) => handleBranchChange(e.target.value.toUpperCase())}
                    placeholder="Auto-filled on IFSC select or type branch"
                    className="w-full bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl px-3.5 py-2 border border-slate-300 focus:bg-white focus:border-emerald-500 focus:outline-none transition-all uppercase"
                  />
                </div>
              </div>

              {/* Col AR: Account Number */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">
                  Account Number (Col AR):
                </label>
                <input
                  type="text"
                  placeholder="Enter Account Number"
                  value={formData.colAR}
                  onChange={(e) => setFormData({ ...formData, colAR: e.target.value.trim() })}
                  className={`w-full bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl px-3.5 py-2.5 border focus:outline-none transition-all ${
                    formData.colAR && formData.colAR_confirm && !isAccountMatching
                      ? 'border-rose-400 bg-rose-50'
                      : formData.colAR && isAccountMatching
                        ? 'border-emerald-500 bg-emerald-50/40'
                        : 'border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                  }`}
                />
              </div>

              {/* Col AR Confirm */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Confirm Account Number:</span>
                  {formData.colAR && formData.colAR_confirm && (
                    <span className={`text-[10px] font-bold ${isAccountMatching ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {isAccountMatching ? "Matched ✓" : "Mismatch ✕"}
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  placeholder="Confirm Account Number"
                  value={formData.colAR_confirm}
                  onChange={(e) => setFormData({ ...formData, colAR_confirm: e.target.value.trim() })}
                  className={`w-full bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl px-3.5 py-2.5 border focus:outline-none transition-all ${
                    formData.colAR && formData.colAR_confirm && !isAccountMatching
                      ? 'border-rose-400 bg-rose-50'
                      : formData.colAR && isAccountMatching
                        ? 'border-emerald-500 bg-emerald-50/40'
                        : 'border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons (3D Tactile & Dynamic) */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              id="saveData3dBtn"
              className="flex-1 min-w-[170px] py-3.5 px-6 rounded-2xl btn-3d-save text-white font-black text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-lg hover:shadow-xl transition-all"
            >
              <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
              <span>{isSaving ? "Saving to Database..." : "Save Record"}</span>
            </button>

            <button
              type="button"
              id="printSlip3dBtn"
              onClick={() => onPrintSlip({ ...activeRow, ...formData } as BeneficiaryRow)}
              className="py-3.5 px-6 rounded-2xl btn-3d-slip text-white font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all"
              title="Print Citizen Acknowledgement Slip"
            >
              <Printer className="w-4 h-4" />
              <span>Print Slip</span>
            </button>

            <button
              type="button"
              id="jobCardPrint3dBtn"
              onClick={() => onPrintA5Slip({ ...activeRow, ...formData } as BeneficiaryRow)}
              className="py-3.5 px-6 rounded-2xl btn-3d-jobcard text-white font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all"
              title="Official Job Card & Family e-KYC Print (Enhanced A5 Certificate)"
            >
              <FileCheck className="w-4 h-4" />
              <span>Job Card Print</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (activeRow) {
                  setFormData({
                    colP: activeRow.colP || '',
                    colQ: activeRow.colQ || '',
                    colR: activeRow.colR || '',
                    colS: activeRow.colS || '',
                    colT: activeRow.colT || '',
                    colU: activeRow.colU || '',
                    colV: activeRow.colV || '',
                    colW: activeRow.colW || '',
                    colX: activeRow.colX || '',
                    colY: activeRow.colY || '',
                    colAO: activeRow.colAO || '',
                    colAP: activeRow.colAP || '',
                    colAQ: activeRow.colAQ || '',
                    colAR: activeRow.colAR || '',
                    colAR_confirm: activeRow.colAR || '',
                  });
                }
              }}
              className="py-3.5 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-sm border-2 border-slate-300 flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xs"
              title="Revert form to saved values"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>Reset</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="rounded-3xl bg-white border border-dashed border-slate-300 p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-3">
            <IdCard className="w-8 h-8" />
          </div>
          <h4 className="text-base sm:text-lg font-bold text-slate-800">
            No Beneficiary Selected
          </h4>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Please select an Aadhaar number or Job Card & Applicant name above to view details.
          </p>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="rounded-3xl bg-white border border-slate-200 p-6 max-w-sm w-full shadow-2xl text-center animate-in fade-in zoom-in duration-200">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-4">
              <HelpCircle className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-black text-slate-900">
              Confirm Save?
            </h4>
            <p className="text-xs text-slate-600 mt-2">
              Only the modified fields below will be updated in the Google Sheet:
            </p>

            {pendingChanges.length > 0 ? (
              <div className="my-3 p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-left max-h-48 overflow-y-auto">
                <div className="text-[11px] font-black text-emerald-900 mb-1.5 flex items-center justify-between">
                  <span>Modified Fields to Sync:</span>
                  <span className="bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full text-[10px]">
                    {pendingChanges.length} field{pendingChanges.length > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="space-y-1">
                  {pendingChanges.map(c => (
                    <div key={c.key} className="text-[11px] flex items-center justify-between gap-2 text-slate-700 border-b border-emerald-100/60 pb-1">
                      <span className="font-semibold text-slate-900 truncate">{c.label}:</span>
                      <span className="font-mono text-emerald-800 font-bold shrink-0">{c.value || '<Empty>'}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="my-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 font-medium">
                No fields were changed.
              </div>
            )}

            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSave}
                className="flex-1 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-md cursor-pointer"
              >
                Yes, Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ReadOnlyField = ({ label, value, highlight = false }: { label: string; value?: string; highlight?: boolean }) => (
  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
    <span className="block text-[10px] text-slate-500 font-semibold truncate">{label}</span>
    <span className={`block font-bold truncate mt-0.5 ${highlight ? 'text-emerald-700' : 'text-slate-800'}`}>
      {value || "—"}
    </span>
  </div>
);
