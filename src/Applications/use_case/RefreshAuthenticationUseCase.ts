/**
 * @typedef {import('../../Domains/authentications/AuthenticationRepository')
 * } AuthenticationRepository
 * @typedef {import('../../Applications/security/AuthenticationTokenManager')
 * } AuthenticationTokenManager
 */
/**
 *
 *
 * @class RefreshAuthenticationUseCase
 */
class RefreshAuthenticationUseCase {
  /**
   * Creates an instance of RefreshAuthenticationUseCase.
   * @param {{
   *  authenticationRepository: AuthenticationRepository,
   *  authenticationTokenManager: AuthenticationTokenManager,
   * }} params
   * @memberof RefreshAuthenticationUseCase
   */
  constructor({
    authenticationRepository,
    authenticationTokenManager,
  }) {
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
  async execute(useCasePayload) {
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
   *
   *
   * @param {*} payload
   * @memberof RefreshAuthenticationUseCase
   */
  _verifyPayload(payload) {
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

module.exports = RefreshAuthenticationUseCase;
