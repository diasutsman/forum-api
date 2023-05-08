const ClientError = require('./ClientError');

/**
 * @class InvariantError
 * @extends {ClientError}
 */
class InvariantError extends ClientError {
  /**
   * Creates an instance of InvariantError.
   * @param {string} message
   * @memberof InvariantError
   */
  constructor(message) {
    super(message);
    this.name = 'InvariantError';
  }
}

module.exports = InvariantError;
