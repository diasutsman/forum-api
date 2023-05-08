/**
 * @class AuthenticationRepository
 */
class AuthenticationRepository {
  /**
   * @param {string} token
   * @memberof AuthenticationRepository
   */
  async addToken(token) {
    throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  /**
   * @param {string} token
   * @memberof AuthenticationRepository
   */
  async checkAvailabilityToken(token) {
    throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  /**
   * @param {string} token
   * @memberof AuthenticationRepository
   */
  async deleteToken(token) {
    throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = AuthenticationRepository;
