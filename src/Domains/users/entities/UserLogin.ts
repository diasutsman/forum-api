type Payload = {
  username: string;
  password: string;
}

/**
 * @class UserLogin
 */
class UserLogin {
  username: any;
  password: any;
  /**
   * Creates an instance of UserLogin.
   * @param {Payload} payload
   * @memberof UserLogin
   */
  constructor(payload: Payload) {
    UserLogin._verifyPayload(payload);

    this.username = payload.username;
    this.password = payload.password;
  }

  /**
   * @param {Payload} payload
   * @memberof UserLogin
   */
  private static _verifyPayload(payload: Payload) {
    const {username, password} = payload;

    if (!username || !password) {
      throw new Error('USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
      throw new Error('USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default UserLogin;
