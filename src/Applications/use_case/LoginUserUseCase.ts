import UserLogin from '../../Domains/users/entities/UserLogin';
import NewAuthentication from '../../Domains/authentications/entities/NewAuth';
import UserRepository from 'src/Domains/users/UserRepository';
import AuthenticationRepository
  from 'src/Domains/authentications/AuthenticationRepository';
import AuthenticationTokenManager from '../security/AuthenticationTokenManager';
import PasswordHash from '../security/PasswordHash';

type Dependencies = {
  userRepository: UserRepository;
  authenticationRepository: AuthenticationRepository;
  authenticationTokenManager: AuthenticationTokenManager;
  passwordHash: PasswordHash;
};
type LoginPayload = {
  username: string;
  password: string;
};

/**
 * LoginUserUseCase
 */
class LoginUserUseCase {
  private _userRepository: UserRepository;
  private _authenticationRepository: AuthenticationRepository;
  private _authenticationTokenManager: AuthenticationTokenManager;
  private _passwordHash: PasswordHash;
  /**
   * @param {Dependencies} params
   */
  constructor({
    userRepository,
    authenticationRepository,
    authenticationTokenManager,
    passwordHash,
  }: Dependencies) {
    this._userRepository = userRepository;
    this._authenticationRepository = authenticationRepository;
    this._authenticationTokenManager = authenticationTokenManager;
    this._passwordHash = passwordHash;
  }

  /**
   * @param {{
   *  username: string,
   *  password: string
   * }} useCasePayload
   * @return {Promise<NewAuthentication>}
   * @memberof LoginUserUseCase
   */
  async execute(useCasePayload: LoginPayload) {
    const {username, password} = new UserLogin(useCasePayload);

    const encryptedPassword =
    await this._userRepository.getPasswordByUsername(username);

    await this._passwordHash.comparePassword(password, encryptedPassword);

    const id = await this._userRepository.getIdByUsername(username);

    const accessToken = await this._authenticationTokenManager
        .createAccessToken({username, id});
    const refreshToken = await this._authenticationTokenManager
        .createRefreshToken({username, id});

    const newAuthentication = new NewAuthentication({
      accessToken,
      refreshToken,
    });

    await this._authenticationRepository.addToken(
        newAuthentication.refreshToken,
    );

    return newAuthentication;
  }
}

export default LoginUserUseCase;
