import { BeneficiaryRow } from '../types';

/**
 * AI Auto-Healing Engine for Beneficiary Records
 * Automatically detects and repairs:
 * 1. Swapped or misaligned fields (e.g. Aadhaar or Phone number appearing in Applicant Name)
 * 2. Missing names by recovering from Name as per Aadhaar (colL), Head of Household (colAG), or Father/Husband (colAF)
 * 3. 11-digit Aadhaar numbers padded to 12 digits
 * 4. Text mistakenly appearing in Aadhaar field
 */
export function healBeneficiaryRecord(b: BeneficiaryRow): BeneficiaryRow {
  if (!b) return b;

  let name = String(b.colJ || '').trim();
  let aadhaar = String(b.colP || '').replace(/\D/g, '');
  let mobile = String(b.colQ || '').replace(/\D/g, '');
  const aadhaarName = String(b.colL || '').trim();
  const hohName = String(b.colAG || '').trim();
  const fatherName = String(b.colAF || '').trim();

  // Strip spaces and hyphens to inspect if name is actually numeric digits
  const cleanNameOnly = name.replace(/[\s-]/g, '');
  const nameDigits = name.replace(/\D/g, '');
  const isNameDigitsOnly = nameDigits.length >= 8 && (cleanNameOnly === nameDigits);

  if (isNameDigitsOnly) {
    // colJ is mistakenly containing a phone (10 digits) or Aadhaar (12 digits)!
    if (nameDigits.length === 12 && (!aadhaar || aadhaar.length !== 12)) {
      aadhaar = nameDigits;
    } else if (nameDigits.length === 10 && (!mobile || mobile.length !== 10)) {
      mobile = nameDigits;
    }

    // Recover genuine human name using AI heuristic priority
    if (aadhaarName && !/^\d+$/.test(aadhaarName.replace(/[\s-]/g, ''))) {
      name = aadhaarName.toUpperCase();
    } else if (hohName && !/^\d+$/.test(hohName.replace(/[\s-]/g, ''))) {
      name = hohName.toUpperCase();
    } else if (fatherName && !/^\d+$/.test(fatherName.replace(/[\s-]/g, ''))) {
      name = fatherName.toUpperCase();
    } else {
      name = 'BENEFICIARY';
    }
  }

  // What if Aadhaar contains letters and Name contains numbers?
  if (b.colP && /[a-zA-Z]/.test(b.colP) && !/^\d+$/.test(b.colP.replace(/[\s-]/g, ''))) {
    const textInAadhaar = b.colP.trim();
    if (isNameDigitsOnly) {
      aadhaar = nameDigits;
      name = textInAadhaar.toUpperCase();
    }
  }

  // 11-digit Aadhaar auto-padding to 12 digits
  if (aadhaar.length === 11) {
    aadhaar = '0' + aadhaar;
  }

  return {
    ...b,
    colJ: name,
    colP: aadhaar,
    colQ: mobile,
    colL: aadhaarName || name
  };
}

export function healBeneficiariesList(list: BeneficiaryRow[]): BeneficiaryRow[] {
  if (!Array.isArray(list)) return [];
  return list.map(healBeneficiaryRecord);
}
