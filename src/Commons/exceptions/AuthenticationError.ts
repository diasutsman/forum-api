const ClientError = require('./ClientError');


/**
 * @class AuthenticationError
 * @extends {ClientError}
 */
class AuthenticationError extends ClientError {
  /**
   * Creates an instance of AuthenticationError.
   * @param {string} message
   * @memberof AuthenticationError
   */
  constructor(message) {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

module.exports = AuthenticationError;
