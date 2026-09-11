import { VILLAGES_LIST } from '../data/bankMaster';
export { normalizeSansadName, CANONICAL_16_SANSADS } from './sansadNormalizer';

/**
 * 29 Canonical Villages of Bathuary Gram Panchayat, Egra-II Development Block, Purba Medinipur
 */
export const CANONICAL_29_VILLAGES: readonly string[] = VILLAGES_LIST;

/**
 * Map of common spelling variations, abbreviations, and formatting discrepancies
 * found in NREGASoft and field sheets to their canonical 29 village counterpart.
 */
const VILLAGE_ALIAS_MAP: Record<string, string> = {
  // BAR BATHUARY
  "BAR-BATHUARY": "BAR BATHUARY",
  "BARBATHUARY": "BAR BATHUARY",
  "BARA BATHUARY": "BAR BATHUARY",
  "BORO BATHUARY": "BAR BATHUARY",

  // KISMAT BATHUARY
  "KISMAT-BATHUARY": "KISMAT BATHUARY",
  "KISMATBATHUARY": "KISMAT BATHUARY",
  "KISMATH BATHUARY": "KISMAT BATHUARY",

  // DAKSHIN CHOUMUKH
  "DAKSHIN CHOWMUKH": "DAKSHIN CHOUMUKH",
  "DAKSHIN-CHOUMUKH": "DAKSHIN CHOUMUKH",
  "DAKSHINCHOWMUKH": "DAKSHIN CHOUMUKH",
  "CHOUMUKH": "DAKSHIN CHOUMUKH",

  // DAKSHIN PADMA & UTTAR PADMA
  "DAKSHIN-PADMA": "DAKSHIN PADMA",
  "DAKSHINPADMA": "DAKSHIN PADMA",
  "UTTAR-PADMA": "UTTAR PADMA",
  "UTTARPADMA": "UTTAR PADMA",

  // NARUBHUNIYACHAK
  "NARU BHUNIYA CHAK": "NARUBHUNIYACHAK",
  "NARUBHUNIACHAK": "NARUBHUNIYACHAK",
  "NARU BHUNIYACHAK": "NARUBHUNIYACHAK",

  // JAGANNATHKARBAR
  "JAGANNATH KARBAR": "JAGANNATHKARBAR",
  "JAGANNATH-KARBAR": "JAGANNATHKARBAR",

  // DARBARKHANBAR
  "DARBAR KHANBAR": "DARBARKHANBAR",
  "DARBAR-KHANBAR": "DARBARKHANBAR",

  // PIRIJKHANBAR
  "PIRIJ KHANBAR": "PIRIJKHANBAR",
  "PIRIJKHAN BAR": "PIRIJKHANBAR",

  // KUMBHADHARBAR
  "KUMBHA DHARBAR": "KUMBHADHARBAR",
  "KUMBHADHAR BAR": "KUMBHADHARBAR",

  // GANGADHARBAR
  "GANGADHAR BAR": "GANGADHARBAR",
  "GANGADHAR-BAR": "GANGADHARBAR",

  // BAMUNIABAR
  "BAMUNIA BAR": "BAMUNIABAR",
  "BAMUNIABARH": "BAMUNIABAR",

  // MACHHALBAR
  "MACHALBAR": "MACHHALBAR",
  "MACHHAL BAR": "MACHHALBAR",

  // JAMUALACHHIMPUR
  "JAMUA LACHHIMPUR": "JAMUALACHHIMPUR",
  "JAMUA LAXMIPUR": "JAMUALACHHIMPUR",

  // KANTHGANJ
  "KANTH GANJ": "KANTHGANJ",
  "KANTHAGANJ": "KANTHGANJ",

  // UTTARKUNRI
  "UTTAR KUNRI": "UTTARKUNRI",
  "UTTAR-KUNRI": "UTTARKUNRI",

  // BHANDERBERIA
  "BHANDER BERIA": "BHANDERBERIA",
  "BHANDERBARIA": "BHANDERBERIA",

  // DHALGODA
  "DHAL GODA": "DHALGODA",

  // HATBAINCHA
  "HAT BAINCHA": "HATBAINCHA",
  "HATBAICHA": "HATBAINCHA",

  // KOTBAR
  "KOT BAR": "KOTBAR",

  // PAIKBAR
  "PAIK BAR": "PAIKBAR",

  // NALBAR
  "NAL BAR": "NALBAR",

  // DAKSHINBAR
  "DAKSHIN BAR": "DAKSHINBAR",

  // BARABHAGIA
  "BARA BHAGIA": "BARABHAGIA"
};

/**
 * Normalizes any raw village input into one of the 29 canonical Bathuary GP villages.
 * If unrecognized, blank, or missing, assigns to "No Village Name" as per official requirement.
 * When the village name is updated in the Google Sheet, it dynamically reflects under that village.
 */
export function normalizeVillageName(rawVillage?: string, fallbackSansad?: string): string {
  if (!rawVillage || typeof rawVillage !== 'string') {
    return 'No Village Name';
  }

  const cleaned = rawVillage
    .trim()
    .toUpperCase()
    .replace(/[._\-]/g, ' ')
    .replace(/\s+/g, ' ');

  if (!cleaned || cleaned === '—' || cleaned === '-' || cleaned === 'NA' || cleaned === 'N/A' || cleaned === 'NONE' || cleaned === 'NULL' || cleaned === 'NO VILLAGE' || cleaned === 'NO VILLAGE NAME') {
    return 'No Village Name';
  }

  // 1. Direct match with canonical list
  if (CANONICAL_29_VILLAGES.includes(cleaned)) {
    return cleaned;
  }

  // 2. Check in alias map
  if (VILLAGE_ALIAS_MAP[cleaned]) {
    return VILLAGE_ALIAS_MAP[cleaned];
  }

  // 3. Substring / Fuzzy match with canonical list (minimum 4 characters for safe matching)
  for (const canon of CANONICAL_29_VILLAGES) {
    if (cleaned === canon.replace(/\s+/g, '')) {
      return canon;
    }
    if (cleaned.length >= 4 && (cleaned.includes(canon) || (cleaned.length >= 5 && canon.includes(cleaned)))) {
      return canon;
    }
  }

  // 4. If invalid, blank, or unrecognized, return 'No Village Name'
  return 'No Village Name';
}
