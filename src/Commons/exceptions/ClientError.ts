/**
 *
 *
 * @class ClientError
 * @extends {Error}
 */
class ClientError extends Error {
  /**
   * Creates an instance of ClientError.
   * @param {string} message
   * @param {number} [statusCode=400]
   * @memberof ClientError
   */
  constructor(message, statusCode = 400) {
    super(message);

    if (this.constructor.name === 'ClientError') {
      throw new Error('cannot instantiate abstract class');
    }

    this.statusCode = statusCode;
    this.name = 'ClientError';
  }
}

module.exports = ClientError;
