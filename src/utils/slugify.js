import slugifyLib from 'slugify';

/**
 * Generate a clean, collision-resistant slug
 * @param {string} text - The input string
 * @param {boolean} [addSuffix=false] - Whether to append a short random hex suffix
 * @returns {string}
 */
export const createSlug = (text, addSuffix = false) => {
  if (!text) return '';
  const baseSlug = slugifyLib(text, {
    lower: true,
    strict: true,
    trim: true,
  });

  if (addSuffix) {
    const randomHex = Math.random().toString(36).substring(2, 7);
    return `${baseSlug}-${randomHex}`;
  }
  return baseSlug;
};
