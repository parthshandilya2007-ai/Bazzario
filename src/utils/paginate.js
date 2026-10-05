/**
 * Standard pagination parser and metadata builder
 * @param {object} query - Express req.query
 * @param {object} [defaults]
 * @returns {{ page: number, limit: number, skip: number, sort: object, fields: string }}
 */
export const getPaginationOptions = (query = {}, defaults = {}) => {
  const defaultPage = defaults.page || 1;
  const defaultLimit = defaults.limit || 20;
  const maxLimit = defaults.maxLimit || 100;

  let page = parseInt(query.page, 10) || defaultPage;
  if (page < 1) page = 1;

  let limit = parseInt(query.limit, 10) || defaultLimit;
  if (limit < 1) limit = defaultLimit;
  if (limit > maxLimit) limit = maxLimit;

  const skip = (page - 1) * limit;

  // Sorting parser: e.g. sort=-createdAt,price -> { createdAt: -1, price: 1 }
  let sort = defaults.sort || { createdAt: -1 };
  if (query.sort && typeof query.sort === 'string') {
    const sortFields = query.sort.split(',');
    sort = {};
    for (const field of sortFields) {
      const trimmed = field.trim();
      if (trimmed.startsWith('-')) {
        sort[trimmed.substring(1)] = -1;
      } else {
        sort[trimmed] = 1;
      }
    }
  }

  // Field selection parser
  const fields = query.fields ? query.fields.split(',').join(' ') : '';

  return { page, limit, skip, sort, fields };
};

/**
 * Builds metadata for paginated responses
 * @param {number} total
 * @param {number} page
 * @param {number} limit
 */
export const buildPaginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit) || 1;
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};
