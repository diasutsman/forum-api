import {TokenPayload} from 'src/Commons/types';

/**
 * AuthenticationTokenManager
 */
class AuthenticationTokenManager {
  /**
   * @param {TokenPayload} payload
   */
  async createRefreshToken(payload: TokenPayload): Promise<string> {
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }

  /**
   * @param {TokenPayload} payload
   */
  async createAccessToken(payload: TokenPayload): Promise<string> {
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }

  /**
   * @param {string} token
   */
  async verifyRefreshToken(token: string) {
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }

  /**
   * @param {string} token
   */
  async decodePayload(token: string): Promise<TokenPayload> {
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }
}

export default AuthenticationTokenManager;
