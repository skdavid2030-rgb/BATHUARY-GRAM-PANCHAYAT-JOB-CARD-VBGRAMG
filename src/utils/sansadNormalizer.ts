import { SANSAD_LIST } from '../data/bankMaster';

/**
 * The 16 Official Sansads of Bathuary Gram Panchayat, Egra-II Development Block, Purba Medinipur
 * BATHUARY 1 to BATHUARY 16
 */
export const CANONICAL_16_SANSADS: readonly string[] = SANSAD_LIST;

const NUMBER_TO_SANSAD: Record<number, string> = {
  1: 'BATHUARY 1', 2: 'BATHUARY 2', 3: 'BATHUARY 3', 4: 'BATHUARY 4',
  5: 'BATHUARY 5', 6: 'BATHUARY 6', 7: 'BATHUARY 7', 8: 'BATHUARY 8',
  9: 'BATHUARY 9', 10: 'BATHUARY 10', 11: 'BATHUARY 11', 12: 'BATHUARY 12',
  13: 'BATHUARY 13', 14: 'BATHUARY 14', 15: 'BATHUARY 15', 16: 'BATHUARY 16'
};

const ROMAN_MAP: Record<string, number> = {
  'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5,
  'VI': 6, 'VII': 7, 'VIII': 8, 'IX': 9, 'X': 10,
  'XI': 11, 'XII': 12, 'XIII': 13, 'XIV': 14, 'XV': 15, 'XVI': 16
};

/**
 * Extracts a 1-based number (1..16) from any sansad representation.
 * Supports: "1", "01", "BATHUARY 1", "BATHUARY-1", "SANSAD 1", "SANSAD-1", "SANSAD-I", "I", "Part 2", etc.
 */
export function extractSansadNumber(val?: string): number | null {
  if (!val || typeof val !== 'string') return null;
  const cleaned = val.trim().toUpperCase().replace(/[._]/g, '-').replace(/\s+/g, ' ');

  // Direct Roman lookup (e.g. "I", "XVI")
  if (ROMAN_MAP[cleaned]) {
    return ROMAN_MAP[cleaned];
  }

  // Prefix stripped lookup (e.g. "BATHUARY 1", "BATHUARY-I", "SANSAD-I", "SANSAD 1", "WARD 1")
  const stripped = cleaned.replace(/^(?:BATHUARY|SANSAD|WARD|PART|NO)[\s\-_:]*/i, '').trim();
  if (ROMAN_MAP[stripped]) {
    return ROMAN_MAP[stripped];
  }

  const strippedNum = parseInt(stripped, 10);
  if (!isNaN(strippedNum) && strippedNum >= 1 && strippedNum <= 16) {
    return strippedNum;
  }

  // Decimal number match anywhere
  const numMatch = cleaned.match(/(?:BATHUARY|SANSAD|WARD|PART|NO)?[\s\-_:]*0*([1-9]|1[0-6])\b/i);
  if (numMatch && numMatch[1]) {
    const n = parseInt(numMatch[1], 10);
    if (n >= 1 && n <= 16) return n;
  }

  return null;
}

/**
 * Checks if a string is a column header or non-data text rather than an actual Sansad.
 */
export function isHeaderOrJunkSansad(val?: string): boolean {
  if (!val || typeof val !== 'string') return true;
  const s = val.trim().toUpperCase();
  if (!s) return true;
  return [
    'SANSAD',
    'NAME OF SANSAD',
    'SANSAD NAME',
    'SANSAD NO',
    'PART NO',
    'WARD NO',
    'SL NO',
    'TOTAL',
    'BENEFICIARY',
    'VILLAGE',
    'GRAM PANCHAYAT'
  ].includes(s);
}

/**
 * Normalizes any Sansad string into one of the 16 official Sansads of Bathuary GP (BATHUARY 1 .. BATHUARY 16).
 * If the input is a header label, returns empty string so callers can identify it.
 */
export function normalizeSansadName(rawSansad?: string, fallbackVillage?: string): string {
  if (!rawSansad || typeof rawSansad !== 'string') {
    return 'BATHUARY 1';
  }

  const cleaned = rawSansad.trim().toUpperCase();
  if (isHeaderOrJunkSansad(cleaned)) {
    return '';
  }

  // Direct match with canonical 16
  if ((CANONICAL_16_SANSADS as readonly string[]).includes(cleaned)) {
    return cleaned;
  }

  // Check extractable number (1..16) -> maps to "BATHUARY X"
  const num = extractSansadNumber(cleaned);
  if (num && NUMBER_TO_SANSAD[num]) {
    return NUMBER_TO_SANSAD[num];
  }

  return 'BATHUARY 1';
}

/**
 * Naturally sorts a list of Sansads in 1 to 16 order (BATHUARY 1, BATHUARY 2, ..., BATHUARY 16)
 */
export function sortSansads(list: string[]): string[] {
  return [...list].sort((a, b) => {
    const numA = extractSansadNumber(a);
    const numB = extractSansadNumber(b);
    if (numA !== null && numB !== null) {
      return numA - numB;
    }
    if (numA !== null) return -1;
    if (numB !== null) return 1;
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
  });
}

