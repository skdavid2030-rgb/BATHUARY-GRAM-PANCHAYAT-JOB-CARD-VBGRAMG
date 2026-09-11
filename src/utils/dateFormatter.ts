/**
 * Universal Date Formatter for Google Sheets & Excel
 * Converts numeric Excel date serials (e.g. 45234), timestamps, and ISO strings to standard DD/MM/YYYY.
 */
export function formatKycDate(val: string | number | undefined | null): string {
  if (!val && val !== 0) return '';
  const str = String(val).trim();
  if (!str) return '';

  // 1. Check if it is an Excel / Google Sheets serial date number (typically between 30000 and 65000)
  const num = Number(str);
  if (!isNaN(num) && num > 20000 && num < 80000) {
    try {
      // Excel base date: Dec 30 1899 (accounting for 1900 leap bug) -> 25569 days to 1970-01-01
      const utcDays = Math.round((num - 25569) * 86400 * 1000);
      const date = new Date(utcDays);
      if (!isNaN(date.getTime())) {
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();
        return `${day}/${month}/${year}`;
      }
    } catch {
      // ignore
    }
  }

  // 2. Epoch timestamp in milliseconds (e.g., 1708214400000)
  if (!isNaN(num) && num > 1000000000000) {
    try {
      const date = new Date(num);
      if (!isNaN(date.getTime())) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      }
    } catch {
      // ignore
    }
  }

  // 3. ISO Date format YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    const parts = str.split('T')[0].split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  }

  // 4. Standard DD/MM/YYYY or DD-MM-YYYY format
  if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(str)) {
    const parts = str.split(/[\/\-]/);
    if (parts.length >= 3) {
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      let year = parts[2];
      if (year.length === 2) year = `20${year}`;
      return `${day}/${month}/${year}`;
    }
  }

  return str;
}
