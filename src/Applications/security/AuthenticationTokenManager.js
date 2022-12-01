/**
 * AuthenticationTokenManager
 */
class AuthenticationTokenManager {
  /**
   * Create refresh token
   * @param {{id: String}} payload
   */
  async createRefreshToken(payload) {
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }

  /**
   * Create access token
   * @param {{id: String}} payload
   */
  async createAccessToken(payload) {
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }

  /**
   * Verify refresh token
   * @param {{id: String}} token
   */
  async verifyRefreshToken(token) {
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }

  /**
   * Decode token payload
   * @param {{id: String}} token
   */
  async decodePayload() {
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = AuthenticationTokenManager;
