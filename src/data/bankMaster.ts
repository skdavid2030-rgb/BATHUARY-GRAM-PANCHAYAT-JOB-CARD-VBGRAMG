import { BankMasterItem } from '../types';

/**
 * Official Bank Master Database for Bathuary Gram Panchayat, Egra-II Development Block,
 * Purba Medinipur, and West Bengal.
 *
 * Grounded in:
 * 1. Reserve Bank of India (RBI) official IFSC & RTGS/NEFT database
 * 2. Mega-bank amalgamations (Allahabad Bank -> Indian Bank, United Bank of India -> PNB,
 *    Syndicate Bank -> Canara Bank, Andhra/Corporation -> Union Bank, Dena/Vijaya -> BOB)
 * 3. India Post Payments Bank (IPPB) unified network code IPOS0000001
 * 4. West Bengal state & district cooperative bank gateways
 */

export const INITIAL_BANK_MASTER: BankMasterItem[] = [
  // ==========================================
  // INDIA POST PAYMENTS BANK (IPPB)
  // Unified RBI Centralized IFSC: IPOS0000001
  // Branches/Access Points in Purba Medinipur & Bengal
  // ==========================================
  { bank: "INDIA POST PAYMENTS BANK", branch: "EGRA SO", ifsc: "IPOS0000001", district: "PURBA MEDINIPUR" },
  { bank: "INDIA POST PAYMENTS BANK", branch: "BATHUARY BO", ifsc: "IPOS0000001", district: "PURBA MEDINIPUR" },
  { bank: "INDIA POST PAYMENTS BANK", branch: "CONTAI HO", ifsc: "IPOS0000001", district: "PURBA MEDINIPUR" },
  { bank: "INDIA POST PAYMENTS BANK", branch: "TAMLUK HO", ifsc: "IPOS0000001", district: "PURBA MEDINIPUR" },
  { bank: "INDIA POST PAYMENTS BANK", branch: "PANIPARUL SO", ifsc: "IPOS0000001", district: "PURBA MEDINIPUR" },
  { bank: "INDIA POST PAYMENTS BANK", branch: "PATASHPUR SO", ifsc: "IPOS0000001", district: "PURBA MEDINIPUR" },
  { bank: "INDIA POST PAYMENTS BANK", branch: "RAMNAGAR SO", ifsc: "IPOS0000001", district: "PURBA MEDINIPUR" },
  { bank: "INDIA POST PAYMENTS BANK", branch: "DIGHA SO", ifsc: "IPOS0000001", district: "PURBA MEDINIPUR" },
  { bank: "INDIA POST PAYMENTS BANK", branch: "BELDA SO", ifsc: "IPOS0000001", district: "PASCHIM MEDINIPUR" },
  { bank: "INDIA POST PAYMENTS BANK", branch: "MOHANPUR SO", ifsc: "IPOS0000001", district: "PASCHIM MEDINIPUR" },
  { bank: "INDIA POST PAYMENTS BANK", branch: "KHARAGPUR HO", ifsc: "IPOS0000001", district: "PASCHIM MEDINIPUR" },
  { bank: "INDIA POST PAYMENTS BANK", branch: "MIDNAPORE HO", ifsc: "IPOS0000001", district: "PASCHIM MEDINIPUR" },
  { bank: "INDIA POST PAYMENTS BANK", branch: "KOLKATA GPO", ifsc: "IPOS0000001", district: "KOLKATA" },
  { bank: "INDIA POST PAYMENTS BANK", branch: "CENTRAL PROCESSING CENTRE", ifsc: "IPOS0000001", district: "ALL DISTRICTS" },

  // ==========================================
  // STATE BANK OF INDIA (SBI)
  // Verified with RBI Master Database & PDF Records
  // ==========================================
  { bank: "STATE BANK OF INDIA", branch: "EGRA BAZAR", ifsc: "SBIN0010424", district: "PURBA MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "EGRA", ifsc: "SBIN0010424", district: "PURBA MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "CONTAI", ifsc: "SBIN0000057", district: "PURBA MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "CONTAI BAZAR", ifsc: "SBIN0012453", district: "PURBA MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "ALANGIRI S.A.B.", ifsc: "SBIN0008207", district: "PURBA MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "PANCHET (PATASPUR)", ifsc: "SBIN0009712", district: "PURBA MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "PATASHPUR", ifsc: "SBIN0009712", district: "PURBA MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "BAJKUL", ifsc: "SBIN0012452", district: "PURBA MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "BASUDEVPUR S.A.B.", ifsc: "SBIN0008226", district: "PURBA MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "RAMNAGAR", ifsc: "SBIN0012454", district: "PURBA MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "PICHHABONI", ifsc: "SBIN0008714", district: "PURBA MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "NACHINDA", ifsc: "SBIN0012456", district: "PURBA MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "SABAJPUT", ifsc: "SBIN0009713", district: "PURBA MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "TELAMI", ifsc: "SBIN0009890", district: "PURBA MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "THAKURCHAK S.A.B.", ifsc: "SBIN0008111", district: "PURBA MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "DALPARA", ifsc: "SBIN0008916", district: "PURBA MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "BARATALA", ifsc: "SBIN0009455", district: "PURBA MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "BAICHBERIA", ifsc: "SBIN0008431", district: "PURBA MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "AMGACHIA", ifsc: "SBIN0009844", district: "PURBA MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "KHEJURI", ifsc: "SBIN0008915", district: "PURBA MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "KHODAMBARI", ifsc: "SBIN0008839", district: "PURBA MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "KANKTIA BAZAR", ifsc: "SBIN0012455", district: "PURBA MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "KHANCHI", ifsc: "SBIN0006698", district: "PURBA MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "KALAGACHIA", ifsc: "SBIN0009706", district: "PURBA MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "KALYANPUR", ifsc: "SBIN0008372", district: "PURBA MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "JAMKI", ifsc: "SBIN0009711", district: "PURBA MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "ISMALICHAWK", ifsc: "SBIN0008917", district: "PURBA MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "HERIA BAZAR", ifsc: "SBIN0014103", district: "PURBA MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "HAUR", ifsc: "SBIN0014100", district: "PURBA MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "CHANDIPUR", ifsc: "SBIN0011387", district: "PURBA MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "CHAITANYAPUR", ifsc: "SBIN0010422", district: "PURBA MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "NANDIGRAM", ifsc: "SBIN0001555", district: "PURBA MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "MAHISHADAL", ifsc: "SBIN0001298", district: "PURBA MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "MOYNA", ifsc: "SBIN0003949", district: "PURBA MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "PANSKURA STN BAZAR", ifsc: "SBIN0010423", district: "PURBA MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "KOLAGHAT", ifsc: "SBIN0014102", district: "PURBA MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "MECHADA", ifsc: "SBIN0003695", district: "PURBA MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "TAMLUK", ifsc: "SBIN0000193", district: "PURBA MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "TAMLUK RLY STN", ifsc: "SBIN0008745", district: "PURBA MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "HALDIA PORT", ifsc: "SBIN0001360", district: "PURBA MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "HALDIA PETRO CHEMICAL", ifsc: "SBIN0009390", district: "PURBA MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "HALDIA-I.O.C.TOWNSHIP", ifsc: "SBIN0007089", district: "PURBA MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "DIGHA", ifsc: "SBIN0001514", district: "PURBA MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "BELDA", ifsc: "SBIN0002017", district: "PASCHIM MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "MOHANPUR", ifsc: "SBIN0015274", district: "PASCHIM MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "DANTAN", ifsc: "SBIN0004782", district: "PASCHIM MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "KESHIARY", ifsc: "SBIN0012439", district: "PASCHIM MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "KHARAGPUR", ifsc: "SBIN0000202", district: "PASCHIM MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "KHARAGPUR-RLY.STATION", ifsc: "SBIN0003332", district: "PASCHIM MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "MIDNAPORE", ifsc: "SBIN0000132", district: "PASCHIM MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "MIDNAPORE TOWN", ifsc: "SBIN0011385", district: "PASCHIM MEDINIPUR" },
  { bank: "STATE BANK OF INDIA", branch: "KOLKATA MAIN", ifsc: "SBIN0000001", district: "KOLKATA" },

  // ==========================================
  // BANK OF INDIA (BOI)
  // Local branches around Egra / Bathuary
  // ==========================================
  { bank: "BANK OF INDIA", branch: "BATHUARY", ifsc: "BKID0004316", district: "PURBA MEDINIPUR" },
  { bank: "BANK OF INDIA", branch: "EGRA", ifsc: "BKID0004315", district: "PURBA MEDINIPUR" },
  { bank: "BANK OF INDIA", branch: "CONTAI", ifsc: "BKID0004182", district: "PURBA MEDINIPUR" },
  { bank: "BANK OF INDIA", branch: "SATMILE", ifsc: "BKID0004313", district: "PURBA MEDINIPUR" },
  { bank: "BANK OF INDIA", branch: "NIKASHI BAZAR", ifsc: "BKID0004314", district: "PURBA MEDINIPUR" },
  { bank: "BANK OF INDIA", branch: "BALISAI", ifsc: "BKID0004385", district: "PURBA MEDINIPUR" },
  { bank: "BANK OF INDIA", branch: "BASUDEVPUR", ifsc: "BKID0004194", district: "PURBA MEDINIPUR" },
  { bank: "BANK OF INDIA", branch: "CHHATRI", ifsc: "BKID0004393", district: "PURBA MEDINIPUR" },
  { bank: "BANK OF INDIA", branch: "NEHARI", ifsc: "BKID0004372", district: "PURBA MEDINIPUR" },
  { bank: "BANK OF INDIA", branch: "TAMLUK", ifsc: "BKID0004309", district: "PURBA MEDINIPUR" },
  { bank: "BANK OF INDIA", branch: "MECHEDA", ifsc: "BKID0004171", district: "PURBA MEDINIPUR" },
  { bank: "BANK OF INDIA", branch: "MECHOGRAM", ifsc: "BKID0004386", district: "PURBA MEDINIPUR" },
  { bank: "BANK OF INDIA", branch: "HALDIA PORT TOWN", ifsc: "BKID0004373", district: "PURBA MEDINIPUR" },
  { bank: "BANK OF INDIA", branch: "BELDA", ifsc: "BKID0004260", district: "PASCHIM MEDINIPUR" },
  { bank: "BANK OF INDIA", branch: "MIDNAPORE", ifsc: "BKID0004310", district: "PASCHIM MEDINIPUR" },
  { bank: "BANK OF INDIA", branch: "KHARAGPUR", ifsc: "BKID0004311", district: "PASCHIM MEDINIPUR" },

  // ==========================================
  // PUNJAB NATIONAL BANK (PNB)
  // Includes merged United Bank of India & Oriental Bank of Commerce
  // ==========================================
  { bank: "PUNJAB NATIONAL BANK", branch: "EGRA", ifsc: "PUNB0019020", district: "PURBA MEDINIPUR", legacyIfsc: "UTBI0EGR276" },
  { bank: "PUNJAB NATIONAL BANK", branch: "EGRA BAZAR", ifsc: "PUNB0024720", district: "PURBA MEDINIPUR" },
  { bank: "PUNJAB NATIONAL BANK", branch: "BATHUARY", ifsc: "PUNB0145220", district: "PURBA MEDINIPUR" },
  { bank: "PUNJAB NATIONAL BANK", branch: "LABANYA BAZAR", ifsc: "PUNB0118620", district: "PURBA MEDINIPUR", legacyIfsc: "UTBI0LBB772" },
  { bank: "PUNJAB NATIONAL BANK", branch: "CONTAI", ifsc: "PUNB0018220", district: "PURBA MEDINIPUR", legacyIfsc: "UTBI0CNT240" },
  { bank: "PUNJAB NATIONAL BANK", branch: "CONTAI MAJNA ROAD", ifsc: "PUNB0220420", district: "PURBA MEDINIPUR" },
  { bank: "PUNJAB NATIONAL BANK", branch: "CONTAI NEW CINEMA ROAD", ifsc: "PUNB0141100", district: "PURBA MEDINIPUR" },
  { bank: "PUNJAB NATIONAL BANK", branch: "PATASPUR (KASBA)", ifsc: "PUNB0182410", district: "PURBA MEDINIPUR", legacyIfsc: "UTBI0PPR937" },
  { bank: "PUNJAB NATIONAL BANK", branch: "RAMNAGAR", ifsc: "PUNB0182610", district: "PURBA MEDINIPUR", legacyIfsc: "UTBI0RNR931" },
  { bank: "PUNJAB NATIONAL BANK", branch: "BHAGWANPUR", ifsc: "PUNB0281100", district: "PURBA MEDINIPUR" },
  { bank: "PUNJAB NATIONAL BANK", branch: "BIBHISANPUR", ifsc: "PUNB0201700", district: "PURBA MEDINIPUR" },
  { bank: "PUNJAB NATIONAL BANK", branch: "BILASPUR", ifsc: "PUNB0259300", district: "PURBA MEDINIPUR" },
  { bank: "PUNJAB NATIONAL BANK", branch: "BOYAL", ifsc: "PUNB0147600", district: "PURBA MEDINIPUR" },
  { bank: "PUNJAB NATIONAL BANK", branch: "AMRITBERIA", ifsc: "PUNB0913600", district: "PURBA MEDINIPUR" },
  { bank: "PUNJAB NATIONAL BANK", branch: "BULAKIPUR", ifsc: "PUNB0259700", district: "PURBA MEDINIPUR" },
  { bank: "PUNJAB NATIONAL BANK", branch: "CHAK RASUL", ifsc: "PUNB0260000", district: "PURBA MEDINIPUR" },
  { bank: "PUNJAB NATIONAL BANK", branch: "DEULIHUT", ifsc: "PUNB0155700", district: "PURBA MEDINIPUR" },
  { bank: "PUNJAB NATIONAL BANK", branch: "HERIA", ifsc: "PUNB0261200", district: "PURBA MEDINIPUR" },
  { bank: "PUNJAB NATIONAL BANK", branch: "KALIKAPUR", ifsc: "PUNB0320600", district: "PURBA MEDINIPUR" },
  { bank: "PUNJAB NATIONAL BANK", branch: "MANGLAMARO", ifsc: "PUNB0213000", district: "PURBA MEDINIPUR" },
  { bank: "PUNJAB NATIONAL BANK", branch: "MECHEDA", ifsc: "PUNB0252100", district: "PURBA MEDINIPUR" },
  { bank: "PUNJAB NATIONAL BANK", branch: "NANDIGRAM", ifsc: "PUNB0320500", district: "PURBA MEDINIPUR" },
  { bank: "PUNJAB NATIONAL BANK", branch: "NONAKURI BAZAR", ifsc: "PUNB0206600", district: "PURBA MEDINIPUR" },
  { bank: "PUNJAB NATIONAL BANK", branch: "PANSKURA", ifsc: "PUNB0280900", district: "PURBA MEDINIPUR" },
  { bank: "PUNJAB NATIONAL BANK", branch: "PURUSATTAMPUR", ifsc: "PUNB0295400", district: "PURBA MEDINIPUR" },
  { bank: "PUNJAB NATIONAL BANK", branch: "RATULIA", ifsc: "PUNB0301000", district: "PURBA MEDINIPUR" },
  { bank: "PUNJAB NATIONAL BANK", branch: "SHANKARPUR", ifsc: "PUNB0214600", district: "PURBA MEDINIPUR" },
  { bank: "PUNJAB NATIONAL BANK", branch: "SRIRAMPUR", ifsc: "PUNB0317000", district: "PURBA MEDINIPUR" },
  { bank: "PUNJAB NATIONAL BANK", branch: "TAMLUK", ifsc: "PUNB0330500", district: "PURBA MEDINIPUR" },
  { bank: "PUNJAB NATIONAL BANK", branch: "TEKHALI BAZAR", ifsc: "PUNB0202000", district: "PURBA MEDINIPUR" },
  { bank: "PUNJAB NATIONAL BANK", branch: "HALDIA", ifsc: "PUNB0231400", district: "PURBA MEDINIPUR" },
  { bank: "PUNJAB NATIONAL BANK", branch: "BELDA", ifsc: "PUNB0121400", district: "PASCHIM MEDINIPUR" },
  { bank: "PUNJAB NATIONAL BANK", branch: "MIDNAPORE", ifsc: "PUNB0035000", district: "PASCHIM MEDINIPUR" },
  { bank: "PUNJAB NATIONAL BANK", branch: "KHARAGPUR", ifsc: "PUNB0028000", district: "PASCHIM MEDINIPUR" },

  // ==========================================
  // BANGIYA GRAMIN VIKASH BANK (BGVB)
  // Sponsored by Punjab National Bank (RRB)
  // ==========================================
  { bank: "BANGIYA GRAMIN VIKASH BANK", branch: "BATHUARY", ifsc: "PUNB0BGVB01", district: "PURBA MEDINIPUR" },
  { bank: "BANGIYA GRAMIN VIKASH BANK", branch: "EGRA", ifsc: "PUNB0BGVB03", district: "PURBA MEDINIPUR" },
  { bank: "BANGIYA GRAMIN VIKASH BANK", branch: "HATBAINCHA", ifsc: "PUNB0BGVB02", district: "PURBA MEDINIPUR" },
  { bank: "BANGIYA GRAMIN VIKASH BANK", branch: "PANIPARUL", ifsc: "PUNB0BGVB04", district: "PURBA MEDINIPUR" },
  { bank: "BANGIYA GRAMIN VIKASH BANK", branch: "CONTAI", ifsc: "PUNB0BGVB05", district: "PURBA MEDINIPUR" },
  { bank: "BANGIYA GRAMIN VIKASH BANK", branch: "PRATAPDIGHI", ifsc: "PUNB0RRBBGB", district: "PURBA MEDINIPUR" },
  { bank: "BANGIYA GRAMIN VIKASH BANK", branch: "MIRGODA", ifsc: "PUNB0RRBBGB", district: "PURBA MEDINIPUR" },
  { bank: "BANGIYA GRAMIN VIKASH BANK", branch: "BALISHAI", ifsc: "PUNB0RRBBGB", district: "PURBA MEDINIPUR" },
  { bank: "BANGIYA GRAMIN VIKASH BANK", branch: "BHAGWANPUR", ifsc: "PUNB0RRBBGB", district: "PURBA MEDINIPUR" },
  { bank: "BANGIYA GRAMIN VIKASH BANK", branch: "BHAWANICHAK", ifsc: "PUNB0RRBBGB", district: "PURBA MEDINIPUR" },
  { bank: "BANGIYA GRAMIN VIKASH BANK", branch: "DEULIABAZAR", ifsc: "PUNB0RRBBGB", district: "PURBA MEDINIPUR" },
  { bank: "BANGIYA GRAMIN VIKASH BANK", branch: "HERIA", ifsc: "PUNB0RRBBGB", district: "PURBA MEDINIPUR" },
  { bank: "BANGIYA GRAMIN VIKASH BANK", branch: "JUKHIABAZAR", ifsc: "PUNB0RRBBGB", district: "PURBA MEDINIPUR" },
  { bank: "BANGIYA GRAMIN VIKASH BANK", branch: "JUNPUT", ifsc: "PUNB0RRBBGB", district: "PURBA MEDINIPUR" },
  { bank: "BANGIYA GRAMIN VIKASH BANK", branch: "KAKTIABAZAR", ifsc: "PUNB0RRBBGB", district: "PURBA MEDINIPUR" },
  { bank: "BANGIYA GRAMIN VIKASH BANK", branch: "KALABERIA", ifsc: "PUNB0RRBBGB", district: "PURBA MEDINIPUR" },
  { bank: "BANGIYA GRAMIN VIKASH BANK", branch: "KALINDI", ifsc: "PUNB0RRBBGB", district: "PURBA MEDINIPUR" },
  { bank: "BANGIYA GRAMIN VIKASH BANK", branch: "KAPASERIA", ifsc: "PUNB0RRBBGB", district: "PURBA MEDINIPUR" },
  { bank: "BANGIYA GRAMIN VIKASH BANK", branch: "NANDIGRAM", ifsc: "PUNB0RRBBGB", district: "PURBA MEDINIPUR" },
  { bank: "BANGIYA GRAMIN VIKASH BANK", branch: "NAZIRBAZAR", ifsc: "PUNB0RRBBGB", district: "PURBA MEDINIPUR" },
  { bank: "BANGIYA GRAMIN VIKASH BANK", branch: "PAUSI BAZAR", ifsc: "PUNB0RRBBGB", district: "PURBA MEDINIPUR" },
  { bank: "BANGIYA GRAMIN VIKASH BANK", branch: "RAMTARAKHAT", ifsc: "PUNB0RRBBGB", district: "PURBA MEDINIPUR" },
  { bank: "BANGIYA GRAMIN VIKASH BANK", branch: "SIDDHA", ifsc: "PUNB0RRBBGB", district: "PURBA MEDINIPUR" },
  { bank: "BANGIYA GRAMIN VIKASH BANK", branch: "TAMLUK", ifsc: "PUNB0RRBBGB", district: "PURBA MEDINIPUR" },
  { bank: "BANGIYA GRAMIN VIKASH BANK", branch: "THEKUCHAK", ifsc: "PUNB0RRBBGB", district: "PURBA MEDINIPUR" },

  // ==========================================
  // INDIAN BANK
  // Includes merged Allahabad Bank (ALLA -> IDIB)
  // ==========================================
  { bank: "INDIAN BANK", branch: "EGRA", ifsc: "IDIB000E503", district: "PURBA MEDINIPUR", legacyIfsc: "ALLA0212824" },
  { bank: "INDIAN BANK", branch: "EGRA TOWN", ifsc: "IDIB000E009", district: "PURBA MEDINIPUR" },
  { bank: "INDIAN BANK", branch: "BATHUARY", ifsc: "IDIB000B102", district: "PURBA MEDINIPUR" },
  { bank: "INDIAN BANK", branch: "CONTAI", ifsc: "IDIB000C640", district: "PURBA MEDINIPUR", legacyIfsc: "ALLA0210606" },
  { bank: "INDIAN BANK", branch: "CONTAI TOWN", ifsc: "IDIB000C070", district: "PURBA MEDINIPUR" },
  { bank: "INDIAN BANK", branch: "DUBDA", ifsc: "IDIB000D582", district: "PURBA MEDINIPUR", legacyIfsc: "ALLA0211686" },
  { bank: "INDIAN BANK", branch: "ALANKARPUR", ifsc: "IDIB000A521", district: "PURBA MEDINIPUR", legacyIfsc: "ALLA0211285" },
  { bank: "INDIAN BANK", branch: "BALIGHAI", ifsc: "IDIB000B571", district: "PURBA MEDINIPUR", legacyIfsc: "ALLA0210606" },
  { bank: "INDIAN BANK", branch: "BALIGHAI", ifsc: "IDIB000B612", district: "PURBA MEDINIPUR", legacyIfsc: "ALLA0210606" },
  { bank: "INDIAN BANK", branch: "BARDABAR", ifsc: "IDIB000B615", district: "PURBA MEDINIPUR", legacyIfsc: "ALLA0213349" },
  { bank: "INDIAN BANK", branch: "BIDYAPITH (AJANBARI)", ifsc: "IDIB000B616", district: "PURBA MEDINIPUR", legacyIfsc: "ALLA0211579" },
  { bank: "INDIAN BANK", branch: "BURARIHAT", ifsc: "IDIB000B617", district: "PURBA MEDINIPUR", legacyIfsc: "ALLA0211447" },
  { bank: "INDIAN BANK", branch: "CHAIPURA BAZAR", ifsc: "IDIB000C621", district: "PURBA MEDINIPUR", legacyIfsc: "ALLA0211495" },
  { bank: "INDIAN BANK", branch: "CHOWKHALI", ifsc: "IDIB000C622", district: "PURBA MEDINIPUR", legacyIfsc: "ALLA0211493" },
  { bank: "INDIAN BANK", branch: "DAKSHIN KALAMDAN", ifsc: "IDIB000D583", district: "PURBA MEDINIPUR", legacyIfsc: "ALLA0211846" },
  { bank: "INDIAN BANK", branch: "DHOLMARI", ifsc: "IDIB000D584", district: "PURBA MEDINIPUR", legacyIfsc: "ALLA0211098" },
  { bank: "INDIAN BANK", branch: "GOPALNAGAR", ifsc: "IDIB000G591", district: "PURBA MEDINIPUR", legacyIfsc: "ALLA0210861" },
  { bank: "INDIAN BANK", branch: "GOPALPUR", ifsc: "IDIB000G592", district: "PURBA MEDINIPUR", legacyIfsc: "ALLA0211185" },
  { bank: "INDIAN BANK", branch: "HALDIA", ifsc: "IDIB000H029", district: "PURBA MEDINIPUR" },
  { bank: "INDIAN BANK", branch: "HALDIA BASUDEVPUR", ifsc: "IDIB000H541", district: "PURBA MEDINIPUR", legacyIfsc: "ALLA0211910" },
  { bank: "INDIAN BANK", branch: "HANSCHARA", ifsc: "IDIB000H542", district: "PURBA MEDINIPUR", legacyIfsc: "ALLA0211375" },
  { bank: "INDIAN BANK", branch: "ILLASPUR", ifsc: "IDIB000I532", district: "PURBA MEDINIPUR", legacyIfsc: "ALLA0211565" },
  { bank: "INDIAN BANK", branch: "JAHANABAD", ifsc: "IDIB000J531", district: "PURBA MEDINIPUR", legacyIfsc: "ALLA0212811" },
  { bank: "INDIAN BANK", branch: "KAMARDAH", ifsc: "IDIB000K612", district: "PURBA MEDINIPUR", legacyIfsc: "ALLA0211824" },
  { bank: "INDIAN BANK", branch: "KHATIAL", ifsc: "IDIB000K146", district: "PURBA MEDINIPUR" },
  { bank: "INDIAN BANK", branch: "KOLAGHAT", ifsc: "IDIB000K613", district: "PURBA MEDINIPUR", legacyIfsc: "ALLA0210539" },
  { bank: "INDIAN BANK", branch: "KUMARGANJ", ifsc: "IDIB000K614", district: "PURBA MEDINIPUR", legacyIfsc: "ALLA0211221" },
  { bank: "INDIAN BANK", branch: "MECHEDA", ifsc: "IDIB000M632", district: "PURBA MEDINIPUR", legacyIfsc: "ALLA0213423" },
  { bank: "INDIAN BANK", branch: "PARAMANANDAPUR", ifsc: "IDIB000P621", district: "PURBA MEDINIPUR", legacyIfsc: "ALLA0212810" },
  { bank: "INDIAN BANK", branch: "RASULPUR", ifsc: "IDIB000R044", district: "PURBA MEDINIPUR" },
  { bank: "INDIAN BANK", branch: "SITALPUR", ifsc: "IDIB000S632", district: "PURBA MEDINIPUR", legacyIfsc: "ALLA0211410" },
  { bank: "INDIAN BANK", branch: "SRIKRISHNAPUR", ifsc: "IDIB000S633", district: "PURBA MEDINIPUR", legacyIfsc: "ALLA0211550" },
  { bank: "INDIAN BANK", branch: "SULOCHANA", ifsc: "IDIB000S634", district: "PURBA MEDINIPUR", legacyIfsc: "ALLA0211618" },
  { bank: "INDIAN BANK", branch: "TAMLUK", ifsc: "IDIB000T168", district: "PURBA MEDINIPUR", legacyIfsc: "ALLA0211831" },
  { bank: "INDIAN BANK", branch: "TARAPAKHIA", ifsc: "IDIB000T612", district: "PURBA MEDINIPUR", legacyIfsc: "ALLA0210886" },
  { bank: "INDIAN BANK", branch: "UDBAADAL", ifsc: "IDIB000U017", district: "PURBA MEDINIPUR" },
  { bank: "INDIAN BANK", branch: "KHARAGPUR", ifsc: "IDIB000K069", district: "PASCHIM MEDINIPUR" },
  { bank: "INDIAN BANK", branch: "MIDNAPORE", ifsc: "IDIB000M037", district: "PASCHIM MEDINIPUR" },

  // ==========================================
  // CANARA BANK
  // Includes merged Syndicate Bank (SYNB -> CNRB)
  // ==========================================
  { bank: "CANARA BANK", branch: "EGRA", ifsc: "CNRB0004095", district: "PURBA MEDINIPUR" },
  { bank: "CANARA BANK", branch: "KASBA-EGRA", ifsc: "CNRB0005191", district: "PURBA MEDINIPUR" },
  { bank: "CANARA BANK", branch: "CONTAI", ifsc: "CNRB0004093", district: "PURBA MEDINIPUR" },
  { bank: "CANARA BANK", branch: "AMTALIA", ifsc: "CNRB0005192", district: "PURBA MEDINIPUR" },
  { bank: "CANARA BANK", branch: "ARJUN NAGAR", ifsc: "CNRB0005823", district: "PURBA MEDINIPUR" },
  { bank: "CANARA BANK", branch: "BHIMTALA (PRATAPPUR)", ifsc: "CNRB0001804", district: "PURBA MEDINIPUR" },
  { bank: "CANARA BANK", branch: "BRINDABAN CHAK", ifsc: "CNRB0005726", district: "PURBA MEDINIPUR" },
  { bank: "CANARA BANK", branch: "CHHOTA DAULATPUR", ifsc: "CNRB0004418", district: "PURBA MEDINIPUR" },
  { bank: "CANARA BANK", branch: "GHOSHPUR", ifsc: "CNRB0005727", district: "PURBA MEDINIPUR" },
  { bank: "CANARA BANK", branch: "PASCHIMSAI", ifsc: "CNRB0005822", district: "PURBA MEDINIPUR" },
  { bank: "CANARA BANK", branch: "HALDIA", ifsc: "CNRB0002938", district: "PURBA MEDINIPUR" },
  { bank: "CANARA BANK", branch: "RAMNAGAR", ifsc: "CNRB0019553", district: "PURBA MEDINIPUR", legacyIfsc: "SYNB0009553" },
  { bank: "CANARA BANK", branch: "SATMILE", ifsc: "CNRB0019780", district: "PURBA MEDINIPUR", legacyIfsc: "SYNB0009780" },
  { bank: "CANARA BANK", branch: "TAMLUK", ifsc: "CNRB0003403", district: "PURBA MEDINIPUR" },
  { bank: "CANARA BANK", branch: "KHARAGPUR", ifsc: "CNRB0000190", district: "PASCHIM MEDINIPUR" },
  { bank: "CANARA BANK", branch: "MIDNAPORE", ifsc: "CNRB0003714", district: "PASCHIM MEDINIPUR" },

  // ==========================================
  // UNION BANK OF INDIA
  // Includes merged Andhra Bank & Corporation Bank
  // ==========================================
  { bank: "UNION BANK OF INDIA", branch: "EGRA", ifsc: "UBIN0536415", district: "PURBA MEDINIPUR" },
  { bank: "UNION BANK OF INDIA", branch: "CONTAI", ifsc: "UBIN0570737", district: "PURBA MEDINIPUR" },
  { bank: "UNION BANK OF INDIA", branch: "CONTAI BAZAR", ifsc: "UBIN0812401", district: "PURBA MEDINIPUR" },
  { bank: "UNION BANK OF INDIA", branch: "BHOGPUR", ifsc: "UBIN0570753", district: "PURBA MEDINIPUR" },
  { bank: "UNION BANK OF INDIA", branch: "DHOBABERYA", ifsc: "UBIN0574180", district: "PURBA MEDINIPUR" },
  { bank: "UNION BANK OF INDIA", branch: "HAUR", ifsc: "UBIN0566772", district: "PURBA MEDINIPUR" },
  { bank: "UNION BANK OF INDIA", branch: "PATASHPUR KASBA", ifsc: "UBIN0546585", district: "PURBA MEDINIPUR" },
  { bank: "UNION BANK OF INDIA", branch: "SHYAMSUNDARPUR-PATNA", ifsc: "UBIN0546585", district: "PURBA MEDINIPUR" },
  { bank: "UNION BANK OF INDIA", branch: "TAMLUK", ifsc: "UBIN0561843", district: "PURBA MEDINIPUR" },
  { bank: "UNION BANK OF INDIA", branch: "HALDIA", ifsc: "UBIN0554821", district: "PURBA MEDINIPUR" },
  { bank: "UNION BANK OF INDIA", branch: "DEULIA BAZAR", ifsc: "UBIN0901900", district: "PURBA MEDINIPUR", legacyIfsc: "CORP0001900" },
  { bank: "UNION BANK OF INDIA", branch: "RAGHUNATHBARI", ifsc: "UBIN0802490", district: "PURBA MEDINIPUR", legacyIfsc: "ANDB0002490" },
  { bank: "UNION BANK OF INDIA", branch: "KHARAGPUR", ifsc: "UBIN0561983", district: "PASCHIM MEDINIPUR" },
  { bank: "UNION BANK OF INDIA", branch: "MIDNAPORE", ifsc: "UBIN0561860", district: "PASCHIM MEDINIPUR" },

  // ==========================================
  // BANK OF BARODA
  // Includes merged Dena Bank & Vijaya Bank
  // ==========================================
  { bank: "BANK OF BARODA", branch: "EGRA", ifsc: "BARB0DBEGRA", district: "PURBA MEDINIPUR" },
  { bank: "BANK OF BARODA", branch: "CONTAI", ifsc: "BARB0CONTAI", district: "PURBA MEDINIPUR" },
  { bank: "BANK OF BARODA", branch: "DURGACHAK", ifsc: "BARB0DURHAL", district: "PURBA MEDINIPUR" },
  { bank: "BANK OF BARODA", branch: "PANSKURA", ifsc: "BARB0PANSKU", district: "PURBA MEDINIPUR" },
  { bank: "BANK OF BARODA", branch: "TAMLUK", ifsc: "BARB0TAMLUK", district: "PURBA MEDINIPUR" },
  { bank: "BANK OF BARODA", branch: "GOBRA", ifsc: "BARB0DBGOBR", district: "PURBA MEDINIPUR", legacyIfsc: "BKDN0911532" },
  { bank: "BANK OF BARODA", branch: "HALDIA", ifsc: "BARB0VJHHAL", district: "PURBA MEDINIPUR", legacyIfsc: "VIJB0007249" },
  { bank: "BANK OF BARODA", branch: "KHARAGPUR", ifsc: "BARB0KHARAG", district: "PASCHIM MEDINIPUR" },
  { bank: "BANK OF BARODA", branch: "MEDINIPUR", ifsc: "BARB0MEDINI", district: "PASCHIM MEDINIPUR" },

  // ==========================================
  // UCO BANK
  // ==========================================
  { bank: "UCO BANK", branch: "EGRA", ifsc: "UCBA0001089", district: "PURBA MEDINIPUR" },
  { bank: "UCO BANK", branch: "CONTAI", ifsc: "UCBA0002382", district: "PURBA MEDINIPUR" },
  { bank: "UCO BANK", branch: "TAMLUK", ifsc: "UCBA0002076", district: "PURBA MEDINIPUR" },
  { bank: "UCO BANK", branch: "PANSKURA", ifsc: "UCBA0003266", district: "PURBA MEDINIPUR" },
  { bank: "UCO BANK", branch: "MECHEDA", ifsc: "UCBA0000800", district: "PURBA MEDINIPUR" },
  { bank: "UCO BANK", branch: "HALDIA", ifsc: "UCBA0001064", district: "PURBA MEDINIPUR" },
  { bank: "UCO BANK", branch: "DERYIACHAK", ifsc: "UCBA0002672", district: "PURBA MEDINIPUR" },
  { bank: "UCO BANK", branch: "KESHAPAT", ifsc: "UCBA0002980", district: "PURBA MEDINIPUR" },
  { bank: "UCO BANK", branch: "KOLAGHAT T.P. TOWNSHIP", ifsc: "UCBA0001671", district: "PURBA MEDINIPUR" },
  { bank: "UCO BANK", branch: "MIDNAPORE", ifsc: "UCBA0000827", district: "PASCHIM MEDINIPUR" },
  { bank: "UCO BANK", branch: "KHARAGPUR", ifsc: "UCBA0001532", district: "PASCHIM MEDINIPUR" },

  // ==========================================
  // CENTRAL BANK OF INDIA
  // ==========================================
  { bank: "CENTRAL BANK OF INDIA", branch: "EGRA", ifsc: "CBIN0281245", district: "PURBA MEDINIPUR" },
  { bank: "CENTRAL BANK OF INDIA", branch: "CONTAI", ifsc: "CBIN0283426", district: "PURBA MEDINIPUR" },
  { bank: "CENTRAL BANK OF INDIA", branch: "DAULATPUR", ifsc: "CBIN0282822", district: "PURBA MEDINIPUR" },
  { bank: "CENTRAL BANK OF INDIA", branch: "HALDIA", ifsc: "CBIN0281500", district: "PURBA MEDINIPUR" },
  { bank: "CENTRAL BANK OF INDIA", branch: "KAJLAGARH", ifsc: "CBIN0282636", district: "PURBA MEDINIPUR" },
  { bank: "CENTRAL BANK OF INDIA", branch: "MOTILAL CHAK", ifsc: "CBIN0282750", district: "PURBA MEDINIPUR" },
  { bank: "CENTRAL BANK OF INDIA", branch: "REYAPARA", ifsc: "CBIN0281600", district: "PURBA MEDINIPUR" },
  { bank: "CENTRAL BANK OF INDIA", branch: "TAMLUK", ifsc: "CBIN0283425", district: "PURBA MEDINIPUR" },
  { bank: "CENTRAL BANK OF INDIA", branch: "MIDNAPORE", ifsc: "CBIN0281308", district: "PASCHIM MEDINIPUR" },

  // ==========================================
  // BALAGERIA CENTRAL CO-OPERATIVE BANK LTD
  // Gateway IFSC: IBKL0752BCB
  // ==========================================
  { bank: "BALAGERIA CENTRAL CO-OPERATIVE BANK", branch: "BALAGERIA", ifsc: "IBKL0752BCB", district: "PURBA MEDINIPUR" },
  { bank: "BALAGERIA CENTRAL CO-OPERATIVE BANK", branch: "EGRA EVENING", ifsc: "IBKL0752BCB", district: "PURBA MEDINIPUR" },
  { bank: "BALAGERIA CENTRAL CO-OPERATIVE BANK", branch: "EGRA", ifsc: "IBKL0752BCB", district: "PURBA MEDINIPUR" },
  { bank: "BALAGERIA CENTRAL CO-OPERATIVE BANK", branch: "CONTAI", ifsc: "IBKL0752BCB", district: "PURBA MEDINIPUR" },
  { bank: "BALAGERIA CENTRAL CO-OPERATIVE BANK", branch: "PANIPARUL", ifsc: "IBKL0752BCB", district: "PURBA MEDINIPUR" },
  { bank: "BALAGERIA CENTRAL CO-OPERATIVE BANK", branch: "RAMNAGAR", ifsc: "IBKL0752BCB", district: "PURBA MEDINIPUR" },
  { bank: "BALAGERIA CENTRAL CO-OPERATIVE BANK", branch: "SATMILE", ifsc: "IBKL0752BCB", district: "PURBA MEDINIPUR" },
  { bank: "BALAGERIA CENTRAL CO-OPERATIVE BANK", branch: "BALIGHAI", ifsc: "IBKL0752BCB", district: "PURBA MEDINIPUR" },
  { bank: "BALAGERIA CENTRAL CO-OPERATIVE BANK", branch: "DEULIHAT", ifsc: "IBKL0752BCB", district: "PURBA MEDINIPUR" },
  { bank: "BALAGERIA CENTRAL CO-OPERATIVE BANK", branch: "DIGHA", ifsc: "IBKL0752BCB", district: "PURBA MEDINIPUR" },
  { bank: "BALAGERIA CENTRAL CO-OPERATIVE BANK", branch: "NACHINDA", ifsc: "IBKL0752BCB", district: "PURBA MEDINIPUR" },

  // ==========================================
  // MUGBERIA CENTRAL CO-OPERATIVE BANK LTD
  // ==========================================
  { bank: "MUGBERIA CENTRAL CO-OPERATIVE BANK", branch: "EGRA", ifsc: "WBSC0MGCB14", district: "PURBA MEDINIPUR" },
  { bank: "MUGBERIA CENTRAL CO-OPERATIVE BANK", branch: "BATHUARY", ifsc: "WBSC0MCCB02", district: "PURBA MEDINIPUR" },
  { bank: "MUGBERIA CENTRAL CO-OPERATIVE BANK", branch: "CONTAI", ifsc: "WBSC0MGCB02", district: "PURBA MEDINIPUR" },
  { bank: "MUGBERIA CENTRAL CO-OPERATIVE BANK", branch: "MAIN", ifsc: "WBSC0MGCB01", district: "PURBA MEDINIPUR" },
  { bank: "MUGBERIA CENTRAL CO-OPERATIVE BANK", branch: "KALAGACHHIA", ifsc: "WBSC0MGCB03", district: "PURBA MEDINIPUR" },
  { bank: "MUGBERIA CENTRAL CO-OPERATIVE BANK", branch: "BHAGWANPUR", ifsc: "WBSC0MGCB04", district: "PURBA MEDINIPUR" },
  { bank: "MUGBERIA CENTRAL CO-OPERATIVE BANK", branch: "BHAGWANPUR EVENING", ifsc: "WBSC0MGCB11", district: "PURBA MEDINIPUR" },
  { bank: "MUGBERIA CENTRAL CO-OPERATIVE BANK", branch: "BAJKUL", ifsc: "WBSC0MGCB05", district: "PURBA MEDINIPUR" },
  { bank: "MUGBERIA CENTRAL CO-OPERATIVE BANK", branch: "ITABERIA", ifsc: "WBSC0MGCB06", district: "PURBA MEDINIPUR" },
  { bank: "MUGBERIA CENTRAL CO-OPERATIVE BANK", branch: "JANKA", ifsc: "WBSC0MGCB07", district: "PURBA MEDINIPUR" },
  { bank: "MUGBERIA CENTRAL CO-OPERATIVE BANK", branch: "MADHAKHALI EVE", ifsc: "WBSC0MGCB08", district: "PURBA MEDINIPUR" },
  { bank: "MUGBERIA CENTRAL CO-OPERATIVE BANK", branch: "HARIA", ifsc: "WBSC0MGCB09", district: "PURBA MEDINIPUR" },
  { bank: "MUGBERIA CENTRAL CO-OPERATIVE BANK", branch: "CONTAI MOR EVE", ifsc: "WBSC0MGCB10", district: "PURBA MEDINIPUR" },
  { bank: "MUGBERIA CENTRAL CO-OPERATIVE BANK", branch: "RAMNAGAR", ifsc: "WBSC0MGCB12", district: "PURBA MEDINIPUR" },

  // ==========================================
  // PASCHIM BANGA GRAMIN BANK (PBGB)
  // ==========================================
  { bank: "PASCHIM BANGA GRAMIN BANK", branch: "EGRA", ifsc: "UCBA0RRBPBG", district: "PURBA MEDINIPUR" },
  { bank: "PASCHIM BANGA GRAMIN BANK", branch: "PURBA MEDINIPUR", ifsc: "UCBA0RRBPBG", district: "PURBA MEDINIPUR" },
  { bank: "PASCHIM BANGA GRAMIN BANK", branch: "PASCHIM MEDINIPUR", ifsc: "UCBA0RRBPBG", district: "PASCHIM MEDINIPUR" },

  // ==========================================
  // AXIS BANK
  // ==========================================
  { bank: "AXIS BANK", branch: "EGRA", ifsc: "UTIB0001254", district: "PURBA MEDINIPUR" },
  { bank: "AXIS BANK", branch: "CONTAI", ifsc: "UTIB0001087", district: "PURBA MEDINIPUR" },
  { bank: "AXIS BANK", branch: "PANSKURA", ifsc: "UTIB0001300", district: "PURBA MEDINIPUR" },
  { bank: "AXIS BANK", branch: "TAMLUK", ifsc: "UTIB0000803", district: "PURBA MEDINIPUR" },
  { bank: "AXIS BANK", branch: "HALDIA", ifsc: "UTIB0000208", district: "PURBA MEDINIPUR" },
  { bank: "AXIS BANK", branch: "KHARAGPUR", ifsc: "UTIB0000305", district: "PASCHIM MEDINIPUR" },
  { bank: "AXIS BANK", branch: "MIDNAPORE", ifsc: "UTIB0000547", district: "PASCHIM MEDINIPUR" },

  // ==========================================
  // HDFC BANK
  // ==========================================
  { bank: "HDFC BANK", branch: "EGRA", ifsc: "HDFC0002278", district: "PURBA MEDINIPUR" },
  { bank: "HDFC BANK", branch: "CONTAI", ifsc: "HDFC0000848", district: "PURBA MEDINIPUR" },
  { bank: "HDFC BANK", branch: "TAMLUK", ifsc: "HDFC0001930", district: "PURBA MEDINIPUR" },
  { bank: "HDFC BANK", branch: "HALDIA", ifsc: "HDFC0000451", district: "PURBA MEDINIPUR" },
  { bank: "HDFC BANK", branch: "RANGIBASAN", ifsc: "HDFC0003907", district: "PURBA MEDINIPUR" },
  { bank: "HDFC BANK", branch: "KHARAGPUR", ifsc: "HDFC0001065", district: "PASCHIM MEDINIPUR" },
  { bank: "HDFC BANK", branch: "MIDNAPORE", ifsc: "HDFC0000450", district: "PASCHIM MEDINIPUR" },

  // ==========================================
  // ICICI BANK
  // ==========================================
  { bank: "ICICI BANK", branch: "EGRA", ifsc: "ICIC0002171", district: "PURBA MEDINIPUR" },
  { bank: "ICICI BANK", branch: "CONTAI", ifsc: "ICIC0000900", district: "PURBA MEDINIPUR" },
  { bank: "ICICI BANK", branch: "TAMLUK", ifsc: "ICIC0000903", district: "PURBA MEDINIPUR" },
  { bank: "ICICI BANK", branch: "HALDIA", ifsc: "ICIC0000624", district: "PURBA MEDINIPUR" },
  { bank: "ICICI BANK", branch: "KHARAGPUR", ifsc: "ICIC0000834", district: "PASCHIM MEDINIPUR" },
  { bank: "ICICI BANK", branch: "MIDNAPORE", ifsc: "ICIC0000597", district: "PASCHIM MEDINIPUR" },

  // ==========================================
  // IDBI BANK
  // ==========================================
  { bank: "IDBI BANK", branch: "CONTAI", ifsc: "IBKL0001138", district: "PURBA MEDINIPUR" },
  { bank: "IDBI BANK", branch: "MECHEDA", ifsc: "IBKL0000752", district: "PURBA MEDINIPUR" },
  { bank: "IDBI BANK", branch: "TAMLUK", ifsc: "IBKL0000761", district: "PURBA MEDINIPUR" },
  { bank: "IDBI BANK", branch: "HALDIA", ifsc: "IBKL0000287", district: "PURBA MEDINIPUR" },
  { bank: "IDBI BANK", branch: "KHARAGPUR", ifsc: "IBKL0000405", district: "PASCHIM MEDINIPUR" },
  { bank: "IDBI BANK", branch: "MEDINIPUR", ifsc: "IBKL0000420", district: "PASCHIM MEDINIPUR" },

  // ==========================================
  // BANDHAN BANK
  // ==========================================
  { bank: "BANDHAN BANK", branch: "EGRA", ifsc: "BDBL0001420", district: "PURBA MEDINIPUR" },
  { bank: "BANDHAN BANK", branch: "KANTHI (CONTAI)", ifsc: "BDBL0001411", district: "PURBA MEDINIPUR" },
  { bank: "BANDHAN BANK", branch: "TAMLUK", ifsc: "BDBL0001418", district: "PURBA MEDINIPUR" },
  { bank: "BANDHAN BANK", branch: "HALDIA", ifsc: "BDBL0001409", district: "PURBA MEDINIPUR" },
  { bank: "BANDHAN BANK", branch: "MOHAMMADPUR", ifsc: "BDBL0001414", district: "PURBA MEDINIPUR" },
  { bank: "BANDHAN BANK", branch: "BAGHADARI", ifsc: "BDBL0001034", district: "PURBA MEDINIPUR" },
  { bank: "BANDHAN BANK", branch: "KHARAGPUR", ifsc: "BDBL0001532", district: "PASCHIM MEDINIPUR" },
  { bank: "BANDHAN BANK", branch: "MIDNAPUR", ifsc: "BDBL0001044", district: "PASCHIM MEDINIPUR" },

  // ==========================================
  // INDIAN OVERSEAS BANK
  // ==========================================
  { bank: "INDIAN OVERSEAS BANK", branch: "CONTAI", ifsc: "IOBA0003621", district: "PURBA MEDINIPUR" },
  { bank: "INDIAN OVERSEAS BANK", branch: "CHAULKHOLA", ifsc: "IOBA0001105", district: "PURBA MEDINIPUR" },
  { bank: "INDIAN OVERSEAS BANK", branch: "DEMARIHAT", ifsc: "IOBA0001164", district: "PURBA MEDINIPUR" },
  { bank: "INDIAN OVERSEAS BANK", branch: "HALDIA", ifsc: "IOBA0001483", district: "PURBA MEDINIPUR" },
  { bank: "INDIAN OVERSEAS BANK", branch: "MACHHNAN", ifsc: "IOBA0001209", district: "PURBA MEDINIPUR" },

  // ==========================================
  // AIRTEL PAYMENTS BANK
  // ==========================================
  { bank: "AIRTEL PAYMENTS BANK", branch: "EGRA", ifsc: "AIRP0000001", district: "ALL DISTRICTS" },
  { bank: "AIRTEL PAYMENTS BANK", branch: "ALL ACCESS POINTS", ifsc: "AIRP0000001", district: "ALL DISTRICTS" },

  // ==========================================
  // ERSTWHILE MERGED ENTITIES
  // Included for seamless backward compatibility & auto-upgrade
  // ==========================================
  // Allahabad Bank (Merged into Indian Bank)
  { bank: "ALLAHABAD BANK (NOW INDIAN BANK)", branch: "EGRA", ifsc: "IDIB000E503", legacyIfsc: "ALLA0212824", isMerged: true, mergedBank: "INDIAN BANK", district: "PURBA MEDINIPUR" },
  { bank: "ALLAHABAD BANK (NOW INDIAN BANK)", branch: "CONTAI", ifsc: "IDIB000C640", legacyIfsc: "ALLA0210606", isMerged: true, mergedBank: "INDIAN BANK", district: "PURBA MEDINIPUR" },
  { bank: "ALLAHABAD BANK (NOW INDIAN BANK)", branch: "DUBDA", ifsc: "IDIB000D582", legacyIfsc: "ALLA0211686", isMerged: true, mergedBank: "INDIAN BANK", district: "PURBA MEDINIPUR" },
  { bank: "ALLAHABAD BANK (NOW INDIAN BANK)", branch: "ALANKARPUR", ifsc: "IDIB000A521", legacyIfsc: "ALLA0211285", isMerged: true, mergedBank: "INDIAN BANK", district: "PURBA MEDINIPUR" },

  // United Bank of India (Merged into Punjab National Bank)
  { bank: "UNITED BANK OF INDIA (NOW PNB)", branch: "EGRA", ifsc: "PUNB0019020", legacyIfsc: "UTBI0EGR276", isMerged: true, mergedBank: "PUNJAB NATIONAL BANK", district: "PURBA MEDINIPUR" },
  { bank: "UNITED BANK OF INDIA (NOW PNB)", branch: "CONTAI", ifsc: "PUNB0018220", legacyIfsc: "UTBI0CNT240", isMerged: true, mergedBank: "PUNJAB NATIONAL BANK", district: "PURBA MEDINIPUR" },
  { bank: "UNITED BANK OF INDIA (NOW PNB)", branch: "PATASPUR", ifsc: "PUNB0182410", legacyIfsc: "UTBI0PPR937", isMerged: true, mergedBank: "PUNJAB NATIONAL BANK", district: "PURBA MEDINIPUR" },
  { bank: "UNITED BANK OF INDIA (NOW PNB)", branch: "RAMNAGAR", ifsc: "PUNB0182610", legacyIfsc: "UTBI0RNR931", isMerged: true, mergedBank: "PUNJAB NATIONAL BANK", district: "PURBA MEDINIPUR" },

  // Syndicate Bank (Merged into Canara Bank)
  { bank: "SYNDICATE BANK (NOW CANARA BANK)", branch: "RAMNAGAR", ifsc: "CNRB0019553", legacyIfsc: "SYNB0009553", isMerged: true, mergedBank: "CANARA BANK", district: "PURBA MEDINIPUR" },
  { bank: "SYNDICATE BANK (NOW CANARA BANK)", branch: "SATMILE", ifsc: "CNRB0019780", legacyIfsc: "SYNB0009780", isMerged: true, mergedBank: "CANARA BANK", district: "PURBA MEDINIPUR" },
  { bank: "SYNDICATE BANK (NOW CANARA BANK)", branch: "HALDIA", ifsc: "CNRB0019526", legacyIfsc: "SYNB0009526", isMerged: true, mergedBank: "CANARA BANK", district: "PURBA MEDINIPUR" }
];

/**
 * Mapping of legacy IFSC codes to their official post-merger RBI IFSC codes and banks
 */
export const LEGACY_IFSC_UPGRADE_MAP: Record<string, { newIfsc: string; newBank: string; branch: string; reason: string }> = {
  // Allahabad Bank -> Indian Bank
  ALLA0212824: { newIfsc: "IDIB000E503", newBank: "INDIAN BANK", branch: "EGRA", reason: "Allahabad Bank merged into Indian Bank" },
  ALLA0210606: { newIfsc: "IDIB000C640", newBank: "INDIAN BANK", branch: "CONTAI", reason: "Allahabad Bank merged into Indian Bank" },
  ALLA0211686: { newIfsc: "IDIB000D582", newBank: "INDIAN BANK", branch: "DUBDA", reason: "Allahabad Bank merged into Indian Bank" },
  ALLA0211285: { newIfsc: "IDIB000A521", newBank: "INDIAN BANK", branch: "ALANKARPUR", reason: "Allahabad Bank merged into Indian Bank" },
  ALLA0210546: { newIfsc: "IDIB000H029", newBank: "INDIAN BANK", branch: "HALDIA", reason: "Allahabad Bank merged into Indian Bank" },
  ALLA0211831: { newIfsc: "IDIB000T168", newBank: "INDIAN BANK", branch: "TAMLUK", reason: "Allahabad Bank merged into Indian Bank" },
  ALLA0210047: { newIfsc: "IDIB000B867", newBank: "INDIAN BANK", branch: "BURDWAN", reason: "Allahabad Bank merged into Indian Bank" },

  // United Bank of India -> Punjab National Bank
  UTBI0EGR276: { newIfsc: "PUNB0019020", newBank: "PUNJAB NATIONAL BANK", branch: "EGRA", reason: "United Bank of India merged into Punjab National Bank" },
  UTBI0CNT240: { newIfsc: "PUNB0018220", newBank: "PUNJAB NATIONAL BANK", branch: "CONTAI", reason: "United Bank of India merged into Punjab National Bank" },
  UTBI0PPR937: { newIfsc: "PUNB0182410", newBank: "PUNJAB NATIONAL BANK", branch: "PATASPUR", reason: "United Bank of India merged into Punjab National Bank" },
  UTBI0RNR931: { newIfsc: "PUNB0182610", newBank: "PUNJAB NATIONAL BANK", branch: "RAMNAGAR", reason: "United Bank of India merged into Punjab National Bank" },
  UTBI0TAM281: { newIfsc: "PUNB0019120", newBank: "PUNJAB NATIONAL BANK", branch: "TAMLUK", reason: "United Bank of India merged into Punjab National Bank" },
  UTBI0BLC289: { newIfsc: "PUNB0018520", newBank: "PUNJAB NATIONAL BANK", branch: "BALICHAK", reason: "United Bank of India merged into Punjab National Bank" },

  // Syndicate Bank -> Canara Bank
  SYNB0009553: { newIfsc: "CNRB0019553", newBank: "CANARA BANK", branch: "RAMNAGAR", reason: "Syndicate Bank merged into Canara Bank" },
  SYNB0009780: { newIfsc: "CNRB0019780", newBank: "CANARA BANK", branch: "SATMILE", reason: "Syndicate Bank merged into Canara Bank" },
  SYNB0009526: { newIfsc: "CNRB0019526", newBank: "CANARA BANK", branch: "HALDIA", reason: "Syndicate Bank merged into Canara Bank" },

  // Oriental Bank of Commerce -> Punjab National Bank
  ORBC0101823: { newIfsc: "PUNB0018220", newBank: "PUNJAB NATIONAL BANK", branch: "CONTAI", reason: "Oriental Bank of Commerce merged into PNB" },
  ORBC0102183: { newIfsc: "PUNB0330500", newBank: "PUNJAB NATIONAL BANK", branch: "TAMLUK", reason: "Oriental Bank of Commerce merged into PNB" },

  // Dena Bank / Vijaya Bank -> Bank of Baroda
  BKDN0911532: { newIfsc: "BARB0DBGOBR", newBank: "BANK OF BARODA", branch: "GOBRA", reason: "Dena Bank merged into Bank of Baroda" },
  VIJB0007249: { newIfsc: "BARB0VJHHAL", newBank: "BANK OF BARODA", branch: "HALDIA", reason: "Vijaya Bank merged into Bank of Baroda" },

  // Andhra Bank / Corporation Bank -> Union Bank of India
  ANDB0001376: { newIfsc: "UBIN0801376", newBank: "UNION BANK OF INDIA", branch: "HALDIA", reason: "Andhra Bank merged into Union Bank of India" },
  ANDB0002490: { newIfsc: "UBIN0802490", newBank: "UNION BANK OF INDIA", branch: "RAGHUNATHBARI", reason: "Andhra Bank merged into Union Bank of India" },
  ANDB0002808: { newIfsc: "UBIN0802808", newBank: "UNION BANK OF INDIA", branch: "TAMLUK", reason: "Andhra Bank merged into Union Bank of India" },
  CORP0001900: { newIfsc: "UBIN0901900", newBank: "UNION BANK OF INDIA", branch: "DEULIA BAZAR", reason: "Corporation Bank merged into Union Bank of India" },
  CORP0001448: { newIfsc: "UBIN0901448", newBank: "UNION BANK OF INDIA", branch: "TAMLUK", reason: "Corporation Bank merged into Union Bank of India" }
};

/**
 * Normalizes any variation of a Bank Name to its official Canonical Name
 */
export function canonicalizeBankName(raw: string): string {
  if (!raw) return "";
  const clean = raw.trim().toUpperCase();

  // IPPB / Postal
  if (
    clean.includes("IPPB") ||
    clean.includes("INDIA POST") ||
    clean.includes("INDIAN POST") ||
    clean.includes("POST OFFICE") ||
    clean === "POST"
  ) {
    return "INDIA POST PAYMENTS BANK";
  }

  // SBI
  if (clean === "SBI" || clean.includes("STATE BANK OF INDIA") || clean.includes("STATE BANK")) {
    return "STATE BANK OF INDIA";
  }

  // BOI
  if (clean === "BOI" || clean === "BANK OF INDIA" || clean.includes("BANK OF INDIA")) {
    return "BANK OF INDIA";
  }

  // PNB / UBI / OBC
  if (clean.includes("UNITED BANK OF INDIA") || clean === "UBI") {
    return "PUNJAB NATIONAL BANK (ERSTWHILE UBI)";
  }
  if (clean.includes("ORIENTAL BANK") || clean === "OBC") {
    return "PUNJAB NATIONAL BANK (ERSTWHILE OBC)";
  }
  if (clean === "PNB" || clean.includes("PUNJAB NATIONAL BANK")) {
    return "PUNJAB NATIONAL BANK";
  }

  // BGVB
  if (clean === "BGVB" || clean.includes("BANGIYA GRAMIN")) {
    return "BANGIYA GRAMIN VIKASH BANK";
  }

  // Indian Bank / Allahabad Bank
  if (clean.includes("ALLAHABAD BANK") || clean === "ALB") {
    return "INDIAN BANK (ERSTWHILE ALLAHABAD BANK)";
  }
  if (clean === "IB" || clean.includes("INDIAN BANK")) {
    return "INDIAN BANK";
  }

  // Canara Bank / Syndicate Bank
  if (clean.includes("SYNDICATE BANK")) {
    return "CANARA BANK (ERSTWHILE SYNDICATE BANK)";
  }
  if (clean.includes("CANARA BANK")) {
    return "CANARA BANK";
  }

  // Union Bank / Andhra / Corporation
  if (clean.includes("ANDHRA BANK") || clean.includes("CORPORATION BANK")) {
    return "UNION BANK OF INDIA";
  }
  if (clean.includes("UNION BANK")) {
    return "UNION BANK OF INDIA";
  }

  // Bank of Baroda / Dena / Vijaya
  if (clean.includes("DENA BANK") || clean.includes("VIJAYA BANK")) {
    return "BANK OF BARODA";
  }
  if (clean === "BOB" || clean.includes("BANK OF BARODA")) {
    return "BANK OF BARODA";
  }

  // Balageria CCB
  if (clean.includes("BALAGERIA")) {
    return "BALAGERIA CENTRAL CO-OPERATIVE BANK";
  }

  // Mugberia CCB
  if (clean.includes("MUGBERIA")) {
    return "MUGBERIA CENTRAL CO-OPERATIVE BANK";
  }

  // Paschim Banga Gramin Bank
  if (clean.includes("PASCHIM BANGA GRAMIN") || clean === "PBGB") {
    return "PASCHIM BANGA GRAMIN BANK";
  }

  // UCO Bank
  if (clean.includes("UCO")) {
    return "UCO BANK";
  }

  // Central Bank of India
  if (clean.includes("CENTRAL BANK")) {
    return "CENTRAL BANK OF INDIA";
  }

  // Bandhan Bank
  if (clean.includes("BANDHAN")) {
    return "BANDHAN BANK";
  }

  // Axis Bank
  if (clean.includes("AXIS")) {
    return "AXIS BANK";
  }

  // HDFC Bank
  if (clean.includes("HDFC")) {
    return "HDFC BANK";
  }

  // ICICI Bank
  if (clean.includes("ICICI")) {
    return "ICICI BANK";
  }

  // IDBI Bank
  if (clean.includes("IDBI")) {
    return "IDBI BANK";
  }

  // Indian Overseas Bank
  if (clean.includes("INDIAN OVERSEAS") || clean === "IOB") {
    return "INDIAN OVERSEAS BANK";
  }

  // Airtel Payments Bank
  if (clean.includes("AIRTEL")) {
    return "AIRTEL PAYMENTS BANK";
  }

  return clean;
}

export const normalizeBankName = canonicalizeBankName;

export const BANK_MERGER_MAP: Record<string, { oldBank: string; newBank: string; newIfscPrefix: string }> = {
  UTBI: { oldBank: "United Bank of India", newBank: "Punjab National Bank", newIfscPrefix: "PUNB" },
  ALLA: { oldBank: "Allahabad Bank", newBank: "Indian Bank", newIfscPrefix: "IDIB" },
  SYNB: { oldBank: "Syndicate Bank", newBank: "Canara Bank", newIfscPrefix: "CNRB" },
  ORBC: { oldBank: "Oriental Bank of Commerce", newBank: "Punjab National Bank", newIfscPrefix: "PUNB" },
  ANDB: { oldBank: "Andhra Bank", newBank: "Union Bank of India", newIfscPrefix: "UBIN" },
  CORP: { oldBank: "Corporation Bank", newBank: "Union Bank of India", newIfscPrefix: "UBIN" },
  VIJB: { oldBank: "Vijaya Bank", newBank: "Bank of Baroda", newIfscPrefix: "BARB" },
  BKDN: { oldBank: "Dena Bank", newBank: "Bank of Baroda", newIfscPrefix: "BARB" }
};

export const VILLAGES_LIST = [
  "ASTICHAK", "BAMUNIABAR", "BARABHAGIA", "BAR BATHUARY", "BATHUARY",
  "BHANDERBERIA", "DAKSHINBAR", "DAKSHIN CHOUMUKH", "DAKSHIN PADMA",
  "DARBARKHANBAR", "DHALGODA", "GAGNA", "GANGADHARBAR", "HATBAINCHA",
  "JAGANNATHKARBAR", "JAMUALACHHIMPUR", "KASHMILI", "KANTHGANJ",
  "KISMAT BATHUARY", "KOTBAR", "KUMBHADHARBAR", "MACHHALBAR", "NALBAR",
  "NARUBHUNIYACHAK", "PAIKBAR", "PIRIJKHANBAR", "RAMCHAK", "UTTARKUNRI",
  "UTTAR PADMA"
];

export const SANSAD_LIST = [
  "BATHUARY 1", "BATHUARY 2", "BATHUARY 3", "BATHUARY 4", "BATHUARY 5",
  "BATHUARY 6", "BATHUARY 7", "BATHUARY 8", "BATHUARY 9", "BATHUARY 10",
  "BATHUARY 11", "BATHUARY 12", "BATHUARY 13", "BATHUARY 14", "BATHUARY 15", "BATHUARY 16"
];

export const OFFICERS_LIST = [
  "SUPRABHAT PARUA, SECRETARY",
  "MANIK DAS, GRS",
  "SK DAVID, VLE",
  "BIPLAB DAS MAHAPATRA, SAHAYAK",
  "BARUN KUMAR MANDAL, SAHAYAK"
];
