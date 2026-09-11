export interface BeneficiaryRow {
  rowIndex: number;
  colA: string; // Sheet Sl No
  colB: string; // Sansad Name
  colC: string; // Sl No
  colD: string; // District
  colE: string; // Block
  colF: string; // Gram Panchayat
  colG?: string;
  colH: string; // Job Card Number
  colI: string; // Applicant No
  colJ: string; // Applicant Name
  colK: string; // Gender
  colL: string; // Name as per ID
  colM: string; // Aadhaar Seeded in NREGASoft
  colN: string; // Demographic Auth Done
  colO: string; // Enables for ABPS
  colP: string; // Aadhaar / ID Number
  colQ: string; // Worker Phone Number
  colR: string; // E-KYC Done (Yes/No)
  colS: string; // Date of e-KYC Done
  colT: string; // Error shown during e-KYC
  colU: string; // e-KYC Process done by
  colV: string; // Village Name
  colW: string; // Job Card Submitted to Office
  colX: string; // Remark
  colY?: string; // Job Card Book Delivered (Yes/No)
  colAF: string; // Father/Husband Name of HH
  colAG: string; // Head of Household
  colAO: string; // Bank Name
  colAP: string; // IFSC Code
  colAQ: string; // Branch Name
  colAR: string; // Account Number
}

export interface BankMasterItem {
  bank: string;
  branch: string;
  ifsc: string;
  district?: string;
  isMerged?: boolean;
  mergedBank?: string;
  legacyIfsc?: string;
}

export interface AppUser {
  sl?: number;
  mobile: string;
  userId?: string;
  phone?: string;
  name: string;
  fullName?: string;
  role: 'ADMIN' | 'OFFICER' | 'VLE' | 'GRS' | 'SAHAYAK' | 'SECRETARY';
  designation?: string;
  password?: string;
  gender?: string;
  fatherName?: string;
  husbandName?: string;
  email?: string;
  supervisorId?: string;
  assignedVillages?: string;
  totalUpdates?: number;
  updatedAt?: string;
  status?: string;
  sansad?: string;
  village?: string;
  lastLogin?: string;
}

export interface AuditLog {
  timestamp: string;
  jobCardNumber: string;
  beneficiaryName: string;
  updatedBy: string;
}

export interface AnalyticsData {
  total: number;
  uniqueJobCards?: number;
  done: number;
  pending: number;
  death: number;
  donePct: number;
  pendingPct: number;
  deathPct: number;
  abpsActive: number;
  aadhaarSeeded: number;
}

export interface VillageStat {
  village: string;
  sansad: string;
  total: number;
  done: number;
  pending: number;
  death: number;
}

export type ReportCategoryFilter = 'ALL' | 'TOTAL' | 'DONE' | 'PENDING' | 'DEATH' | 'UNIQUE_CARDS';

export interface GoogleSheetConfig {
  sheetUrl: string;
  autoSync: boolean;
  appsScriptUrl?: string;
  lastSyncTimestamp?: string;
  totalRecords?: number;
  villagesCount?: number;
  sansadsCount?: number;
  savedAt?: string;
  updatedAt?: string;
  savedBy?: string;
  lastSyncStatus?: string;
}
