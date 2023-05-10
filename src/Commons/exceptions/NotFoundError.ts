import ClientError from './ClientError';

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
  constructor(message: string) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export default NotFoundError;
