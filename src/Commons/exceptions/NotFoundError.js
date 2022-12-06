const ClientError = require('./ClientError');

/**
 * @class NotFoundError
 * @extends {ClientError}
 */
class NotFoundError extends ClientError {
  /**
   * Creates an instance of NotFoundError.
   * @param {string} message
   * @memberof NotFoundError
   */
  constructor(message) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

module.exports = NotFoundError;
