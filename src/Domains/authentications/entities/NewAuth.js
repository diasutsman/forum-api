/**
 * @class NewAuth
 */
class NewAuth {
  /**
   * Creates an instance of NewAuth.
   * @param {{
   *  accessToken: string,
   *  refreshToken: string
   * }} payload
   * @memberof NewAuth
   */
  constructor(payload) {
    this._verifyPayload(payload);

    this.accessToken = payload.accessToken;
    this.refreshToken = payload.refreshToken;
  }

  /**
   * @param {{
   *  accessToken: string,
   *  refreshToken: string
   * }} payload
   * @memberof NewAuth
   */
  _verifyPayload(payload) {
    const {accessToken, refreshToken} = payload;

    if (!accessToken || !refreshToken) {
      throw new Error('NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
      throw new Error('NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewAuth;
