/**
 * @typedef {import('bcrypt')} bcrypt
 */
import EncryptionHelper from '../../Applications/security/PasswordHash';
import AuthenticationError from '../../Commons/exceptions/AuthenticationError';
import bcrypt from 'bcrypt';

type Bcrypt = typeof bcrypt;

/**
 * @class BcryptPasswordHash
 * @extends {EncryptionHelper}
 */
class BcryptPasswordHash extends EncryptionHelper {
  private _bcrypt: Bcrypt;
  private _saltRound: number;
  /**
   * Creates an instance of BcryptPasswordHash.
   * @param {Bcrypt} bcrypt
   * @param {number} [saltRound=10]
   * @memberof BcryptPasswordHash
   */
  constructor(bcrypt: Bcrypt, saltRound = 10) {
    super();
    this._bcrypt = bcrypt;
    this._saltRound = saltRound;
  }

  /**
   * @param {string} password
   * @return {string}
   * @memberof BcryptPasswordHash
   */
  async hash(password: string) {
    return this._bcrypt.hash(password, this._saltRound);
  }

  /**
   * @param {string} password
   * @param {string} hashedPassword
   * @memberof BcryptPasswordHash
   */
  async comparePassword(password: string, hashedPassword: string) {
    const result = await this._bcrypt.compare(password, hashedPassword);

    if (!result) {
      throw new AuthenticationError('kredensial yang Anda masukkan salah');
    }
  }
}

export default BcryptPasswordHash;
