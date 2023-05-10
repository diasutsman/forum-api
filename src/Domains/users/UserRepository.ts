import RegisterUser from './entities/RegisterUser';
import RegisteredUser from './entities/RegisteredUser';

/**
 * @class UserRepository
 */
class UserRepository {
  /**
   * @param {RegisterUser} registerUser
   * @memberof UserRepository
   */
  async addUser(registerUser: RegisterUser): Promise<RegisteredUser> {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  /**
   * @param {string} username
   * @memberof UserRepository
   */
  async verifyAvailableUsername(username: string) {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  /**
   * @param {string} username
   * @memberof UserRepository
   */
  async getPasswordByUsername(username: string): Promise<string> {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  /**
   * @param {string} username
   * @memberof UserRepository
   */
  async getIdByUsername(username: string): Promise<string> {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

export default UserRepository;
