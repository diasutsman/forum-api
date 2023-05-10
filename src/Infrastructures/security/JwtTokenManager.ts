import { TokenPayload } from 'src/Commons/types';
import AuthenticationTokenManager from '../../Applications/security/AuthenticationTokenManager';
import InvariantError from '../../Commons/exceptions/InvariantError';
import * as Jwt from '@hapi/jwt';
type JwtToken = typeof Jwt.token;

/**
 * @class JwtTokenManager
 * @extends {AuthenticationTokenManager}
 */
class JwtTokenManager extends AuthenticationTokenManager {
  private _jwt: JwtToken;
  /**
   * Creates an instance of JwtTokenManager.
   * @param {JwtToken} jwt
   * @memberof JwtTokenManager
   */
  constructor(jwt: JwtToken) {
    super();
    this._jwt = jwt;
  }

  /**
   * @param {{
   *  id: string,
   *  username: string,
   * }} payload
   * @return {string}
   * @memberof JwtTokenManager
   */
  async createAccessToken(payload: TokenPayload): Promise<string> {
    return this._jwt.generate(payload, process.env.ACCESS_TOKEN_KEY as string);
  }

  /**
   * @param {{
   *  id: string,
   *  username: string,
   * }} payload
   * @return {string}
   * @memberof JwtTokenManager
   */
  async createRefreshToken(payload: TokenPayload): Promise<string> {
    return this._jwt.generate(payload, process.env.REFRESH_TOKEN_KEY as string);
  }

  /**
   * @param {string} token
   * @memberof JwtTokenManager
   */
  async verifyRefreshToken(token: string) {
    try {
      const artifacts = this._jwt.decode(token);
      this._jwt.verify(artifacts, process.env.REFRESH_TOKEN_KEY as string);
    } catch (error) {
      throw new InvariantError('refresh token tidak valid');
    }
  }

  /**
   * @param {string} token
   * @return {{
   *  id: string,
   *  username: string,
   * }}
   * @memberof JwtTokenManager
   */
  async decodePayload(token: string): Promise<TokenPayload> {
    const artifacts = this._jwt.decode(token);
    return artifacts.decoded.payload;
  }
}

export default JwtTokenManager;
