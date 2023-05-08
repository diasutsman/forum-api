/**
 * PasswordHash
 */
class PasswordHash {
  /**
   * @param {String} password
   */
  async hash(password) {
    throw new Error('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
  }

  /**
   * @param {String} plain
   * @param {String} encrypted
   */
  async comparePassword(plain, encrypted) {
    throw new Error('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = PasswordHash;
