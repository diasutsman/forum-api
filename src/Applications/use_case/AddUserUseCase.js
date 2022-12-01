const RegisterUser = require('../../Domains/users/entities/RegisterUser');

/**
 * AddUserUseCase
 */
class AddUserUseCase {
  /**
   * @param {{userRepository: import('../../Domains/users/UserRepository'), passwordHash: import('../../Applications/security/PasswordHash')}} obj
   */
  constructor({ userRepository, passwordHash }) {
    this._userRepository = userRepository;
    this._passwordHash = passwordHash;
  }

  async execute(useCasePayload) {
    const registerUser = new RegisterUser(useCasePayload);
    await this._userRepository.verifyAvailableUsername(registerUser.username);
    registerUser.password = await this._passwordHash.hash(registerUser.password);
    return this._userRepository.addUser(registerUser);
  }
}

module.exports = AddUserUseCase;
