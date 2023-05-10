import {RefreshPayload} from 'src/Commons/types';
import AuthenticationRepository
  from 'src/Domains/authentications/AuthenticationRepository';

type Dependencies = {
  authenticationRepository: AuthenticationRepository;
};

/**
 *
 *
 * @class LogoutUserUseCase
 *
 */
class LogoutUserUseCase {
  private _authenticationRepository: AuthenticationRepository;
  /**
   * Creates an instance of LogoutUserUseCase.
   * @param {Dependencies} params
   * @memberof LogoutUserUseCase
   */
  constructor({
    authenticationRepository,
  }: Dependencies) {
    this._authenticationRepository = authenticationRepository;
  }

  /**
   * @param {RefreshPayload} useCasePayload
   * @memberof LogoutUserUseCase
   */
  async execute(useCasePayload: RefreshPayload) {
    this._validatePayload(useCasePayload);
    const {refreshToken} = useCasePayload;
    await this._authenticationRepository.checkAvailabilityToken(refreshToken);
    await this._authenticationRepository.deleteToken(refreshToken);
  }

  /**
   * @param {RefreshPayload} payload
   * @memberof LogoutUserUseCase
   */
  _validatePayload(payload: RefreshPayload) {
    const {refreshToken} = payload;
    if (!refreshToken) {
      throw new Error(
          'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN',
      );
    }

    if (typeof refreshToken !== 'string') {
      throw new Error(
          'DELETE_AUTHENTICATION_USE_CASE.'+
          'PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
    }
  }
}

export default LogoutUserUseCase;
