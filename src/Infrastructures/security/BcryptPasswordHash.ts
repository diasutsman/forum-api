/**
 * @typedef {import('bcrypt')} bcrypt
 */
const EncryptionHelper = require('../../Applications/security/PasswordHash');
const AuthenticationError =
require('../../Commons/exceptions/AuthenticationError');

/**
 * @class BcryptPasswordHash
 * @extends {EncryptionHelper}
 */
class BcryptPasswordHash extends EncryptionHelper {
  /**
   * Creates an instance of BcryptPasswordHash.
   * @param {bcrypt} bcrypt
   * @param {number} [saltRound=10]
   * @memberof BcryptPasswordHash
   */
  constructor(bcrypt, saltRound = 10) {
    super();
    this._bcrypt = bcrypt;
    this._saltRound = saltRound;
  }

  /**
   * @param {string} password
   * @return {string}
   * @memberof BcryptPasswordHash
   */
  async hash(password) {
    return this._bcrypt.hash(password, this._saltRound);
  }

  /**
   * @param {string} password
   * @param {string} hashedPassword
   * @memberof BcryptPasswordHash
   */
  async comparePassword(password, hashedPassword) {
    const result = await this._bcrypt.compare(password, hashedPassword);

    if (!result) {
      throw new AuthenticationError('kredensial yang Anda masukkan salah');
    }
  }
}

module.exports = BcryptPasswordHash;
