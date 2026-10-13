import { BeneficiaryRow } from '../types';

/**
 * Converts Bengali and Devanagari numeral characters to standard ASCII digits (0-9)
 */
export function convertBengaliNumerals(str: any): string {
  if (str === null || str === undefined) return '';
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const devanagariDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  let res = String(str);
  for (let i = 0; i <= 9; i++) {
    res = res.replaceAll(bengaliDigits[i], String(i)).replaceAll(devanagariDigits[i], String(i));
  }
  return res;
}

/**
 * Cleans scientific notation (e.g. 7.74E+11), float suffixes (.0), and localized numerals
 */
export function cleanRawNumber(val: any): string {
  if (val === null || val === undefined) return '';
  let str = convertBengaliNumerals(val).trim();
  // Strip trailing float zeroes like .0, .00
  str = str.replace(/\.0+$/, '');

  // Handle scientific exponential notation from Google Sheets / Excel
  if (/^[+-]?\d+(\.\d+)?[eE][+-]?\d+$/.test(str)) {
    try {
      const num = Number(str);
      if (!isNaN(num) && isFinite(num)) {
        str = BigInt(Math.round(num)).toString();
      }
    } catch {}
  }
  return str;
}

/**
 * Intelligently extracts a canonical 10-digit Indian mobile number
 * Handles +91, 91 prefix, leading 0, multiple phones separated by slash or comma, and formatting artifacts
 */
export function extractCleanMobile(raw: any): string {
  if (!raw) return '';
  const cleaned = cleanRawNumber(raw);

  // If multiple phones separated by / , & or space, check for the first valid 10-digit mobile
  const match = cleaned.match(/\b([6-9]\d{9})\b/);
  if (match) {
    return match[1];
  }

  // Strip non-digits
  const digits = cleaned.replace(/\D/g, '');
  if (!digits) return '';

  // 12-digit starting with 91 and standard mobile prefix [6-9]
  if (digits.length === 12 && digits.startsWith('91') && /^[6-9]/.test(digits.slice(2))) {
    return digits.slice(2);
  }

  // 11-digit starting with 0 and standard mobile prefix [6-9]
  if (digits.length === 11 && digits.startsWith('0') && /^[6-9]/.test(digits.slice(1))) {
    return digits.slice(1);
  }

  // Standard 10 digits
  if (digits.length === 10) {
    return digits;
  }

  // If 11 digits with repeated digit at end, or 9 digits, preserve digits for review
  return digits;
}

/**
 * Intelligently extracts and normalizes an Aadhaar number
 * Handles scientific notation, dropped leading zeros, and formatting artifacts
 */
export function extractCleanAadhaar(raw: any): string {
  if (!raw) return '';
  const cleaned = cleanRawNumber(raw);
  let digits = cleaned.replace(/\D/g, '');

  if (!digits) return '';

  // 11 digits: Excel dropped 1 leading zero -> auto pad with 0
  if (digits.length === 11) {
    digits = '0' + digits;
  }
  // 10 digits not matching mobile prefix: Excel dropped 2 leading zeros -> auto pad with 00
  else if (digits.length === 10 && !/^[6-9]/.test(digits)) {
    digits = '00' + digits;
  }

  return digits;
}

/**
 * AI Auto-Healing Engine for Beneficiary Records
 * Automatically detects and repairs:
 * 1. Swapped or misaligned fields (e.g. Aadhaar or Phone number in Applicant Name, or Mobile in Aadhaar field)
 * 2. Missing names by recovering from Name as per Aadhaar (colL), Head of Household (colAG), or Father/Husband (colAF)
 * 3. 11-digit / 10-digit Aadhaar numbers padded with leading zeros
 * 4. Mobile numbers formatted with +91, 0, or exponential formats
 * 5. Bengali and Devanagari numerals
 */
export function healBeneficiaryRecord(b: BeneficiaryRow): BeneficiaryRow {
  if (!b) return b;

  let name = String(b.colJ || '').trim();
  let aadhaar = extractCleanAadhaar(b.colP);
  let mobile = extractCleanMobile(b.colQ);
  const aadhaarName = String(b.colL || '').trim();
  const hohName = String(b.colAG || '').trim();
  const fatherName = String(b.colAF || '').trim();

  // 1. Inspect if Name (colJ) mistakenly contains purely digits (phone or Aadhaar)
  const cleanNameOnly = convertBengaliNumerals(name).replace(/[\s-]/g, '');
  const nameDigits = cleanNameOnly.replace(/\D/g, '');
  const isNameDigitsOnly = nameDigits.length >= 8 && (cleanNameOnly === nameDigits);

  if (isNameDigitsOnly) {
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

  // 2. What if text mistakenly appears in Aadhaar field and Name contains digits?
  if (b.colP && /[a-zA-Z]/.test(String(b.colP)) && !/^\d+$/.test(String(b.colP).replace(/[\s-]/g, ''))) {
    const textInAadhaar = String(b.colP).trim();
    if (isNameDigitsOnly) {
      aadhaar = nameDigits;
      name = textInAadhaar.toUpperCase();
    }
  }

  // 3. Check for SWAPPED Aadhaar (colP) and Mobile (colQ)
  // If colP is a 10-digit number starting with 6,7,8,9 (an Indian mobile number):
  if (aadhaar.length === 10 && /^[6-9]/.test(aadhaar)) {
    if (!mobile || mobile.length === 0) {
      // Mobile was typed into Aadhaar field! Move to mobile and leave Aadhaar blank
      mobile = aadhaar;
      aadhaar = '';
    } else if (mobile.length === 12) {
      // Both were swapped!
      const temp = mobile;
      mobile = aadhaar;
      aadhaar = temp;
    }
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
