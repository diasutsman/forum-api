import ClientError from './ClientError';

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
  constructor(message: string) {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

export default AuthorizationError;
