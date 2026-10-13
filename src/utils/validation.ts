import { convertBengaliNumerals } from './beneficiaryHealer';

/**
 * Result of validating an Aadhaar or Mobile number
 */
export interface FieldValidationResult {
  isValid: boolean;
  hasInvalidChars: boolean;
  length: number;
  expectedLength: number;
  cleanValue: string;
  errorType?: 'EMPTY' | 'INVALID_CHARS' | 'TOO_SHORT' | 'TOO_LONG' | 'INVALID_PREFIX';
  message?: string;
  warning?: string;
}

/**
 * Helper function to validate Aadhaar (12-digit numeric) format.
 * - Detects invalid non-numeric characters (letters, punctuation)
 * - Converts Bengali numerals (০-৯) to standard digits
 * - Verifies exact 12-digit length
 */
export function validateAadhaarFormat(value: string | null | undefined): FieldValidationResult {
  const raw = String(value || '').trim();
  if (!raw) {
    return {
      isValid: true,
      hasInvalidChars: false,
      length: 0,
      expectedLength: 12,
      cleanValue: '',
      errorType: 'EMPTY'
    };
  }

  // Convert Bengali numerals if any
  const converted = convertBengaliNumerals(raw);

  // Check for non-numeric characters (spaces and hyphens are acceptable delimiters, anything else is invalid)
  const hasInvalidChars = /[^\d\s-]/.test(converted);
  const cleanDigits = converted.replace(/\D/g, '');
  const len = cleanDigits.length;

  if (hasInvalidChars) {
    return {
      isValid: false,
      hasInvalidChars: true,
      length: len,
      expectedLength: 12,
      cleanValue: cleanDigits,
      errorType: 'INVALID_CHARS',
      message: 'আধার নম্বরে অগ্রহণযোগ্য অক্ষর রয়েছে (কেবলমাত্র ০-৯ সংখ্যা গ্রহণযোগ্য)।',
      warning: 'Invalid characters (numbers only)'
    };
  }

  if (len === 0) {
    return {
      isValid: true,
      hasInvalidChars: false,
      length: 0,
      expectedLength: 12,
      cleanValue: '',
      errorType: 'EMPTY'
    };
  }

  if (len < 12) {
    return {
      isValid: false,
      hasInvalidChars: false,
      length: len,
      expectedLength: 12,
      cleanValue: cleanDigits,
      errorType: 'TOO_SHORT',
      message: `আধার নম্বর অসম্পূর্ণ: ১২টির মধ্যে ${len}টি সংখ্যা দেওয়া হয়েছে (আরও ${12 - len}টি প্রয়োজন)।`,
      warning: `Incomplete (${len}/12 digits)`
    };
  }

  if (len > 12) {
    return {
      isValid: false,
      hasInvalidChars: false,
      length: len,
      expectedLength: 12,
      cleanValue: cleanDigits,
      errorType: 'TOO_LONG',
      message: `আধার নম্বরের সীমা অতিক্রম করেছে: ${len}টি সংখ্যা (১২টি থাকা আবশ্যক, ${len - 12}টি অতিরিক্ত)।`,
      warning: `Too long (${len}/12 digits)`
    };
  }

  return {
    isValid: true,
    hasInvalidChars: false,
    length: 12,
    expectedLength: 12,
    cleanValue: cleanDigits,
    message: 'সঠিক ১২ সংখ্যার আধার নম্বর (Valid 12-digit Aadhaar UID).'
  };
}

/**
 * Helper function to validate Mobile (10-digit numeric) format.
 * - Detects invalid non-numeric characters
 * - Normalizes +91, 91, or leading 0 prefixes
 * - Converts Bengali numerals (০-৯) to standard digits
 * - Verifies exact 10-digit length and Indian mobile prefix (6, 7, 8, 9)
 */
export function validateMobileFormat(value: string | null | undefined): FieldValidationResult {
  const raw = String(value || '').trim();
  if (!raw) {
    return {
      isValid: true,
      hasInvalidChars: false,
      length: 0,
      expectedLength: 10,
      cleanValue: '',
      errorType: 'EMPTY'
    };
  }

  // Convert Bengali numerals if any
  const converted = convertBengaliNumerals(raw);

  // Check for invalid characters (letters or unusual symbols)
  // Allow common phone formatting characters: +, (, ), -, space
  const hasInvalidChars = /[^\d\s+()-]/.test(converted);

  // Extract clean 10-digit mobile
  let cleanDigits = converted.replace(/\D/g, '');
  if (cleanDigits.length === 12 && cleanDigits.startsWith('91')) {
    cleanDigits = cleanDigits.slice(2);
  } else if (cleanDigits.length === 11 && cleanDigits.startsWith('0')) {
    cleanDigits = cleanDigits.slice(1);
  }

  const len = cleanDigits.length;

  if (hasInvalidChars) {
    return {
      isValid: false,
      hasInvalidChars: true,
      length: len,
      expectedLength: 10,
      cleanValue: cleanDigits,
      errorType: 'INVALID_CHARS',
      message: 'মোবাইল নম্বরে অগ্রহণযোগ্য অক্ষর রয়েছে (কেবলমাত্র ০-৯ সংখ্যা গ্রহণযোগ্য)।',
      warning: 'Invalid characters (numbers only)'
    };
  }

  if (len === 0) {
    return {
      isValid: true,
      hasInvalidChars: false,
      length: 0,
      expectedLength: 10,
      cleanValue: '',
      errorType: 'EMPTY'
    };
  }

  if (len < 10) {
    return {
      isValid: false,
      hasInvalidChars: false,
      length: len,
      expectedLength: 10,
      cleanValue: cleanDigits,
      errorType: 'TOO_SHORT',
      message: `মোবাইল নম্বর অসম্পূর্ণ: ১০টির মধ্যে ${len}টি সংখ্যা দেওয়া হয়েছে (আরও ${10 - len}টি প্রয়োজন)।`,
      warning: `Incomplete (${len}/10 digits)`
    };
  }

  if (len > 10) {
    return {
      isValid: false,
      hasInvalidChars: false,
      length: len,
      expectedLength: 10,
      cleanValue: cleanDigits,
      errorType: 'TOO_LONG',
      message: `মোবাইল নম্বরের সীমা অতিক্রম করেছে: ${len}টি সংখ্যা (১০টি থাকা আবশ্যক, ${len - 10}টি অতিরিক্ত)।`,
      warning: `Too long (${len}/10 digits)`
    };
  }

  // Indian mobile numbers must start with 6, 7, 8, or 9
  if (!/^[6-9]/.test(cleanDigits)) {
    return {
      isValid: false,
      hasInvalidChars: false,
      length: 10,
      expectedLength: 10,
      cleanValue: cleanDigits,
      errorType: 'INVALID_PREFIX',
      message: `মোবাইল নম্বরটি ৬, ৭, ৮ অথবা ৯ দিয়ে শুরু হওয়া আবশ্যক (প্রথম সংখ্যা '${cleanDigits.charAt(0)}')।`,
      warning: 'Must start with 6, 7, 8, or 9'
    };
  }

  return {
    isValid: true,
    hasInvalidChars: false,
    length: 10,
    expectedLength: 10,
    cleanValue: cleanDigits,
    message: 'সঠিক ১০ সংখ্যার মোবাইল নম্বর (Valid 10-digit Mobile).'
  };
}

// Convenient aliases
export const validateAadhaar = validateAadhaarFormat;
export const validateMobile = validateMobileFormat;
