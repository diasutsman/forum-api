/**
 * @typedef {import('../../Domains/users/entities/RegisterUser')} RegisterUser
 */
/**
 * @class UserRepository
 */
class UserRepository {
  /**
   * @param {RegisterUser} registerUser
   * @memberof UserRepository
   */
  async addUser(registerUser) {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  /**
   * @param {string} username
   * @memberof UserRepository
   */
  async verifyAvailableUsername(username) {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  /**
   * @param {string} username
   * @memberof UserRepository
   */
  async getPasswordByUsername(username) {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  /**
   * @param {string} username
   * @memberof UserRepository
   */
  async getIdByUsername(username) {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = UserRepository;
