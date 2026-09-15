/**
 * AI-Assisted Normalizer for "Job Card Book Delivered" (Column Y / Column 25)
 * Handles bilingual inputs (Bengali & English), status aliases, typos, and boolean variations.
 */
export function normalizeJobCardBookDelivered(value: any, allowEmpty: boolean = false): 'Yes' | 'No' {
  if (value === null || value === undefined) return allowEmpty ? ('' as any) : 'No';
  const raw = String(value).trim();
  if (!raw) return allowEmpty ? ('' as any) : 'No';

  const lower = raw.toLowerCase();

  // Affirmative delivery patterns: Yes, Y, 1, Delivered, Deliverd, Completed, ইত্যাদি
  if (
    lower === 'yes' ||
    lower === 'y' ||
    lower === '1' ||
    lower === 'true' ||
    lower.includes('deliver') ||
    lower.includes('deliv') ||
    lower.includes('done') ||
    lower.includes('completed') ||
    lower.includes('success') ||
    lower.includes('হয়েছে') ||
    lower.includes('হয়েছে') ||
    lower.includes('হ্যাঁ') ||
    lower.includes('দেওয়া') ||
    lower.includes('দেওয়া') ||
    lower.includes('বিলি') ||
    lower.includes('বিতরণ') ||
    lower.includes('পায়ছে') ||
    lower.includes('পেয়েছে')
  ) {
    return 'Yes';
  }

  // Negative delivery patterns: No, N, 0, Pending, Not Delivered, ইত্যাদি
  if (
    lower === 'no' ||
    lower === 'n' ||
    lower === '0' ||
    lower === 'false' ||
    lower.includes('not') ||
    lower.includes('pending') ||
    lower.includes('না') ||
    lower.includes('বাকি') ||
    lower.includes('দেওয়া হয়নি') ||
    lower.includes('দেওয়া হয়নি') ||
    lower.includes('হয়নি') ||
    lower.includes('হয়নি') ||
    lower.includes('অসম্পূর্ণ')
  ) {
    return 'No';
  }

  // In MGNREGA register, any other non-affirmative value defaults to 'No'
  return 'No';
}

