/**
 * @typedef {import('../../Domains/authentications/AuthenticationRepository')
 * } AuthenticationRepository
 */
/**
 * DeleteAuthenticationUseCase
 */
class DeleteAuthenticationUseCase {
  /**
   * @param {AuthenticationRepository} params
   */
  constructor({authenticationRepository}) {
    this._authenticationRepository = authenticationRepository;
  }

  /**
   * @param {{
   *  refreshToken: string
   * }} useCasePayload
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

module.exports = DeleteAuthenticationUseCase;
