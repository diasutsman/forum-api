import {RefreshPayload} from 'src/Commons/types';
import AuthenticationRepository
  from 'src/Domains/authentications/AuthenticationRepository';
import AuthenticationTokenManager from '../security/AuthenticationTokenManager';

type Dependencies = {
  authenticationRepository: AuthenticationRepository;
  authenticationTokenManager: AuthenticationTokenManager;
}

/**
 *
 *
 * @class RefreshAuthenticationUseCase
 */
class RefreshAuthenticationUseCase {
  private _authenticationRepository: AuthenticationRepository;
  private _authenticationTokenManager: AuthenticationTokenManager;
  /**
   * Creates an instance of RefreshAuthenticationUseCase.
   * @param {Dependencies} params
   * @memberof RefreshAuthenticationUseCase
   */
  constructor({
    authenticationRepository,
    authenticationTokenManager,
  }: Dependencies) {
    this._authenticationRepository = authenticationRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  /**
   * @param {{
   *  refreshToken: string
   * }} useCasePayload
   * @return {Promise<string>}
   * @memberof RefreshAuthenticationUseCase
   */
  async execute(useCasePayload: RefreshPayload) {
    this._verifyPayload(useCasePayload);
    const {refreshToken} = useCasePayload;

    await this._authenticationTokenManager.verifyRefreshToken(refreshToken);
    await this._authenticationRepository.checkAvailabilityToken(refreshToken);

    const {
      username, id,
    } = await this._authenticationTokenManager.decodePayload(refreshToken);

    return this._authenticationTokenManager.createAccessToken({username, id});
  }

  /**
   * @param {RefreshPayload} payload
   * @memberof RefreshAuthenticationUseCase
   */
  _verifyPayload(payload: RefreshPayload) {
    const {refreshToken} = payload;

    if (!refreshToken) {
      throw new Error(
          'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN',
      );
    }

    if (typeof refreshToken !== 'string') {
      throw new Error(
          'REFRESH_AUTHENTICATION_USE_CASE.'+
          'PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
    }
  }
}

export default RefreshAuthenticationUseCase;
