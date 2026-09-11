import { INITIAL_BANK_MASTER, BANK_MERGER_MAP, normalizeBankName } from '../data/bankMaster';
import { BankMasterItem } from '../types';

/**
 * Intelligent RBI Bank Resolver & Internal Search Engine
 * Grounded in Reserve Bank of India (RBI) National IFSC Master Database
 * Tailored for Purba Medinipur, West Bengal & mega-bank mergers.
 */

// Legacy IFSC to Modern Merger Map
export const LEGACY_IFSC_TO_NEW: Record<string, { ifsc: string; bank: string; branch: string }> = {
  // United Bank of India -> Punjab National Bank
  'UTBI0EGR276': { ifsc: 'PUNB0019020', bank: 'PUNJAB NATIONAL BANK', branch: 'EGRA' },
  'UTBI0BATB06': { ifsc: 'PUNB0145220', bank: 'PUNJAB NATIONAL BANK', branch: 'BATHUARY' },
  'UTBI0CNT240': { ifsc: 'PUNB0018220', bank: 'PUNJAB NATIONAL BANK', branch: 'CONTAI' },
  'UTBI0PPR937': { ifsc: 'PUNB0182410', bank: 'PUNJAB NATIONAL BANK', branch: 'PATASPUR' },
  'UTBI0RNR931': { ifsc: 'PUNB0182610', bank: 'PUNJAB NATIONAL BANK', branch: 'RAMNAGAR' },
  'UTBI0BLD231': { ifsc: 'PUNB0121400', bank: 'PUNJAB NATIONAL BANK', branch: 'BELDA' },
  'UTBI0LBB772': { ifsc: 'PUNB0118620', bank: 'PUNJAB NATIONAL BANK', branch: 'LABANYA BAZAR' },

  // Allahabad Bank -> Indian Bank
  'ALLA0210344': { ifsc: 'IDIB000E503', bank: 'INDIAN BANK', branch: 'EGRA' },
  'ALLA0212824': { ifsc: 'IDIB000E503', bank: 'INDIAN BANK', branch: 'EGRA' },
  'ALLA0210214': { ifsc: 'IDIB000C640', bank: 'INDIAN BANK', branch: 'CONTAI' },
  'ALLA0210606': { ifsc: 'IDIB000B571', bank: 'INDIAN BANK', branch: 'BALIGHAI' },
  'ALLA0211686': { ifsc: 'IDIB000D582', bank: 'INDIAN BANK', branch: 'DUBDA' },
  'ALLA0211285': { ifsc: 'IDIB000A521', bank: 'INDIAN BANK', branch: 'ALANKARPUR' },
  'ALLA0213349': { ifsc: 'IDIB000B615', bank: 'INDIAN BANK', branch: 'BARDABAR' },

  // Syndicate Bank -> Canara Bank
  'SYNB0009553': { ifsc: 'CNRB0019553', bank: 'CANARA BANK', branch: 'RAMNAGAR' },
  'SYNB0009780': { ifsc: 'CNRB0019780', bank: 'CANARA BANK', branch: 'SATMILE' }
};

/**
 * Clean and normalize an IFSC string (fix letter O instead of 0, trim, uppercase)
 */
export function cleanIfscCode(rawIfsc: string): string {
  if (!rawIfsc) return '';
  let cleaned = rawIfsc.trim().toUpperCase().replace(/[\s\-_]/g, '');

  // If 5th character is 'O', RBI IFSC standard requires the 5th character to be '0' (zero)
  if (cleaned.length >= 5 && cleaned[4] === 'O') {
    cleaned = cleaned.substring(0, 4) + '0' + cleaned.substring(5);
  }

  return cleaned;
}

/**
 * Intelligent Search Engine querying RBI Bank Master
 */
export function searchRbiBankMaster(
  query: string, 
  preferredBank?: string,
  limit: number = 20
): BankMasterItem[] {
  const q = query.trim().toUpperCase();
  if (!q) {
    if (preferredBank) {
      const pBank = normalizeBankName(preferredBank);
      return INITIAL_BANK_MASTER.filter(b => b.bank === pBank).slice(0, limit);
    }
    return INITIAL_BANK_MASTER.slice(0, limit);
  }

  const cleanQ = cleanIfscCode(q);
  const results: { item: BankMasterItem; score: number }[] = [];

  for (const item of INITIAL_BANK_MASTER) {
    let score = 0;
    const itemIfsc = item.ifsc.toUpperCase();
    const itemBranch = item.branch.toUpperCase();
    const itemBank = item.bank.toUpperCase();

    // Exact IFSC match
    if (itemIfsc === cleanQ || itemIfsc === q) {
      score += 100;
    } else if (itemIfsc.startsWith(cleanQ)) {
      score += 60;
    } else if (itemIfsc.includes(cleanQ)) {
      score += 40;
    }

    // Exact Branch match
    if (itemBranch === q) {
      score += 80;
    } else if (itemBranch.startsWith(q)) {
      score += 50;
    } else if (itemBranch.includes(q)) {
      score += 30;
    }

    // Bank match
    if (preferredBank && itemBank === normalizeBankName(preferredBank)) {
      score += 25;
    } else if (itemBank.includes(q)) {
      score += 20;
    }

    // Purba Medinipur prioritization
    if (item.district === 'PURBA MEDINIPUR') {
      score += 10;
    }

    if (score > 0) {
      results.push({ item, score });
    }
  }

  // Sort by relevance score descending
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit).map(r => r.item);
}

/**
 * Auto-detect and fix incorrect Bank Name, IFSC code, and Branch Name
 */
export function autoFixBankDetails(
  inputBank: string = '',
  inputIfsc: string = '',
  inputBranch: string = ''
): {
  bank: string;
  ifsc: string;
  branch: string;
  isFixed: boolean;
  reason?: string;
} {
  let bank = inputBank.trim().toUpperCase();
  let ifsc = cleanIfscCode(inputIfsc);
  let branch = inputBranch.trim().toUpperCase();
  let isFixed = false;
  const reasons: string[] = [];

  // 1. Swap check: Did someone put IFSC in Branch and Branch in IFSC?
  const isBranchLookingLikeIfsc = /^[A-Z]{4}0[A-Z0-9]{6}$/.test(branch);
  const isIfscLookingLikeBranch = /^(BRANCH|MAIN|BAZAR|VILL|PO|RURAL|HAT)/.test(ifsc);
  if (isBranchLookingLikeIfsc || isIfscLookingLikeBranch) {
    const temp = ifsc;
    ifsc = branch;
    branch = temp;
    isFixed = true;
    reasons.push("Swapped IFSC and Branch fields corrected.");
  }

  // 2. Check Legacy Merged IFSC
  if (LEGACY_IFSC_TO_NEW[ifsc]) {
    const modern = LEGACY_IFSC_TO_NEW[ifsc];
    ifsc = modern.ifsc;
    bank = modern.bank;
    branch = modern.branch;
    isFixed = true;
    reasons.push(`Merged Bank IFSC automatically updated to RBI current standard (${modern.bank} - ${modern.ifsc}).`);
    return { bank, ifsc, branch, isFixed, reason: reasons.join(' ') };
  }

  // 3. Exact IFSC Lookup in RBI Bank Master
  if (ifsc) {
    const match = INITIAL_BANK_MASTER.find(b => b.ifsc === ifsc);
    if (match) {
      if (bank !== match.bank) {
        bank = match.bank;
        isFixed = true;
        reasons.push(`Bank name updated to '${match.bank}'.`);
      }
      if (!branch || branch === '—' || branch !== match.branch) {
        // If current branch is empty or inconsistent with RBI IFSC
        branch = match.branch;
        isFixed = true;
        reasons.push(`Branch name verified with RBI as '${match.branch}'.`);
      }
      return { bank, ifsc, branch, isFixed, reason: reasons.join(' ') };
    }
  }

  // 4. Reverse Lookup: Branch name given, but IFSC is missing or wrong
  if (branch && (!ifsc || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc))) {
    const candidates = searchRbiBankMaster(branch, bank, 5);
    if (candidates.length > 0) {
      const best = candidates[0];
      ifsc = best.ifsc;
      bank = best.bank;
      branch = best.branch;
      isFixed = true;
      reasons.push(`Resolved missing/invalid IFSC to RBI official code ${best.ifsc} (${best.branch}).`);
      return { bank, ifsc, branch, isFixed, reason: reasons.join(' ') };
    }
  }

  // 5. Normalize Bank Name if colloquial
  const normBank = normalizeBankName(bank);
  if (normBank !== bank && normBank) {
    bank = normBank;
    isFixed = true;
  }

  return { 
    bank, 
    ifsc, 
    branch, 
    isFixed, 
    reason: reasons.length > 0 ? reasons.join(' ') : undefined 
  };
}
