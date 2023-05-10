import ClientError from './ClientError';


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
  constructor(message: string) {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export default AuthenticationError;
