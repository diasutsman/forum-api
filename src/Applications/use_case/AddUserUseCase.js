/**
 * @typedef {import('../../Domains/users/UserRepository')} UserRepository
 * @typedef {import('../../Applications/security/PasswordHash')} PasswordHash
 */
const RegisterUser = require('../../Domains/users/entities/RegisterUser');

/**
 * AddUserUseCase
 */
class AddUserUseCase {
  /**
   * @param {{userRepository: UserRepository, passwordHash: PasswordHash}
   * } params
   */
  constructor({userRepository, passwordHash}) {
    this._userRepository = userRepository;
    this._passwordHash = passwordHash;
  }

  /**
   * @param {{
   *  username: string,
   *  password: string,
   *  fullname: string
   * }} useCasePayload
   * @return {Promise<RegisteredUser>}
   */
  async execute(useCasePayload) {
    const registerUser = new RegisterUser(useCasePayload);
    await this._userRepository.verifyAvailableUsername(registerUser.username);
    registerUser.password =
      await this._passwordHash.hash(registerUser.password);
    return this._userRepository.addUser(registerUser);
  }
}

module.exports = AddUserUseCase;
