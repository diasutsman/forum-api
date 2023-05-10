import ClientError from './ClientError';

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
  constructor(message: string) {
    super(message);
    this.name = 'InvariantError';
  }
}

export default InvariantError;
