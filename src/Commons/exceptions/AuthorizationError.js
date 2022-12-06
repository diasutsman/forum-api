const ClientError = require('./ClientError');

/**
 * @class AuthorizationError
 * @extends {ClientError}
 */
class AuthorizationError extends ClientError {
  /**
   * Creates an instance of AuthorizationError.
   * @param {string} message
   * @memberof AuthorizationError
   */
  constructor(message) {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

module.exports = AuthorizationError;
