/**
 * @typedef {import('@hapi/jwt')} Jwt
 */
const AuthenticationTokenManager =
require('../../Applications/security/AuthenticationTokenManager');
const InvariantError = require('../../Commons/exceptions/InvariantError');

/**
 * @class JwtTokenManager
 * @extends {AuthenticationTokenManager}
 */
class JwtTokenManager extends AuthenticationTokenManager {
  /**
   * Creates an instance of JwtTokenManager.
   * @param {Jwt} jwt
   * @memberof JwtTokenManager
   */
  constructor(jwt) {
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
  async createAccessToken(payload) {
    return this._jwt.generate(payload, process.env.ACCESS_TOKEN_KEY);
  }

  /**
   * @param {{
   *  id: string,
   *  username: string,
   * }} payload
   * @return {string}
   * @memberof JwtTokenManager
   */
  async createRefreshToken(payload) {
    return this._jwt.generate(payload, process.env.REFRESH_TOKEN_KEY);
  }

  /**
   * @param {string} token
   * @memberof JwtTokenManager
   */
  async verifyRefreshToken(token) {
    try {
      const artifacts = this._jwt.decode(token);
      this._jwt.verify(artifacts, process.env.REFRESH_TOKEN_KEY);
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
  async decodePayload(token) {
    const artifacts = this._jwt.decode(token);
    return artifacts.decoded.payload;
  }
}

module.exports = JwtTokenManager;
