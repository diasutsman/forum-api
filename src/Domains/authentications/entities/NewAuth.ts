type Payload = {
    accessToken: string;
    refreshToken: string;
}

/**
 * @class NewAuth
 */
class NewAuth {
  accessToken: string;
  refreshToken: string;
  /**
   * Creates an instance of NewAuth.
   * @param {Payload} payload
   * @memberof NewAuth
   */
  constructor(payload: Payload) {
    NewAuth._verifyPayload(payload);

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
  private static _verifyPayload(payload: Payload) {
    const {accessToken, refreshToken} = payload;

    if (!accessToken || !refreshToken) {
      throw new Error('NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
      throw new Error('NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default NewAuth;
