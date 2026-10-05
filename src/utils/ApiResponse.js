/**
 * Unified API Response Formatter Envelope
 */
export class ApiResponse {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Human-readable success message
   * @param {any} data - Response payload data
   * @param {object} [meta] - Optional pagination or query metadata
   */
  constructor(statusCode, message = 'Success', data = null, meta = undefined) {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
    if (meta) {
      this.meta = meta;
    }
  }

  /**
   * Static helper for sending standard responses directly from controllers
   * @param {import('express').Response} res
   * @param {number} statusCode
   * @param {string} message
   * @param {any} data
   * @param {object} [meta]
   */
  static send(res, statusCode, message, data = null, meta = undefined) {
    const payload = {
      success: statusCode < 400,
      message,
      data,
    };
    if (meta) {
      payload.meta = meta;
    }
    return res.status(statusCode).json(payload);
  }
}
