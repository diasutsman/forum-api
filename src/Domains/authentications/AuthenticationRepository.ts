/**
 * @class AuthenticationRepository
 */
class AuthenticationRepository {
  /**
   * @param {string} token
   * @memberof AuthenticationRepository
   */
  async addToken(token: string) {
    throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  /**
   * @param {string} token
   * @memberof AuthenticationRepository
   */
  async checkAvailabilityToken(token: string) {
    throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  /**
   * @param {string} token
   * @memberof AuthenticationRepository
   */
  async deleteToken(token: string) {
    throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

export default AuthenticationRepository;
