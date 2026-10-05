/**
 * Formats a monetary amount into standard Indian Rupee notation (₹)
 * Handles both rupee amounts and integer paise amounts.
 * @param amountInRupees - The amount in INR (e.g. 499)
 * @returns Formatted string (e.g. "₹499" or "₹1,299")
 */
export const formatPrice = (amountInRupees: number): string => {
  if (isNaN(amountInRupees)) return '₹0';
  return `₹${Math.round(amountInRupees).toLocaleString('en-IN')}`;
};

/**
 * Formats paise integer to INR (e.g. 49900 paise -> "₹499")
 */
export const formatPaise = (paise: number): string => {
  if (isNaN(paise)) return '₹0';
  return formatPrice(paise / 100);
};

/**
 * Formats standard dates into human-readable Indian format (e.g. "20 Sep 2026")
 */
export const formatDate = (dateString: string | Date): string => {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Truncates text with ellipsis
 */
export const truncate = (text: string, length: number): string => {
  if (!text) return '';
  if (text.length <= length) return text;
  return `${text.slice(0, length)}...`;
};
