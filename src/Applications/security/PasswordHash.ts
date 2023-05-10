/**
 * PasswordHash
 */
class PasswordHash {
  /**
   * @param {string} password
   */
  async hash(password:string): Promise<string> {
    throw new Error('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
  }

  /**
   * @param {string} plain
   * @param {string} encrypted
   */
  async comparePassword(plain:string, encrypted:string): Promise<void> {
    throw new Error('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
  }
}

export default PasswordHash;
