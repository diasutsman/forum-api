import UserRepository from 'src/Domains/users/UserRepository';
import RegisterUser from '../../Domains/users/entities/RegisterUser';
import PasswordHash from '../security/PasswordHash';

type Dependencies = {
    userRepository: UserRepository;
    passwordHash: PasswordHash;
};

type NewUser = {
    username: string;
    password: string;
    fullname: string;
};

/**
 * AddUserUseCase
 */
class AddUserUseCase {
  private _userRepository: UserRepository;
  private _passwordHash: PasswordHash;
  /**
   * @param {Dependencies} dependencies
   */
  constructor({userRepository, passwordHash}: Dependencies) {
    this._userRepository = userRepository;
    this._passwordHash = passwordHash;
  }

  /**
   * @param {NewUser} useCasePayload
   * @return {Promise<RegisteredUser>}
   */
  async execute(useCasePayload: NewUser) {
    const registerUser = new RegisterUser(useCasePayload);
    await this._userRepository.verifyAvailableUsername(registerUser.username);
    registerUser.password =
    await this._passwordHash.hash(registerUser.password);
    return this._userRepository.addUser(registerUser);
  }
}

export default AddUserUseCase;
