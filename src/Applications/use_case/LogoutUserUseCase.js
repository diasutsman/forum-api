
/**
 * @typedef {import('../../Domains/authentications/AuthenticationRepository')
 * } AuthenticationRepository
 */
/**
 *
 *
 * @class LogoutUserUseCase
 *
 */
class LogoutUserUseCase {
  /**
   * Creates an instance of LogoutUserUseCase.
   * @param {{
   *  authenticationRepository: AuthenticationRepository
   * }} params
   * @memberof LogoutUserUseCase
   */
  constructor({
    authenticationRepository,
  }) {
    this._authenticationRepository = authenticationRepository;
  }

  /**
   * @param {{
   *  refreshToken: string
   * }} useCasePayload
   * @memberof LogoutUserUseCase
   */
  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    const {refreshToken} = useCasePayload;
    await this._authenticationRepository.checkAvailabilityToken(refreshToken);
    await this._authenticationRepository.deleteToken(refreshToken);
  }

  /**
   * @param {{
   *  refreshToken: string
   * }} payload
   * @memberof LogoutUserUseCase
   */
  _validatePayload(payload) {
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

module.exports = LogoutUserUseCase;
