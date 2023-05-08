/**
 * @typedef {import('../../../../Infrastructures/container')} Container
 * @typedef {import('@hapi/hapi').Request} Request
 * @typedef {import('@hapi/hapi').ResponseToolkit} ResponseToolkit
 * @typedef {import('@hapi/hapi').ResponseObject} ResponseObject
 */
const LoginUserUseCase =
  require('../../../../Applications/use_case/LoginUserUseCase');
const RefreshAuthenticationUseCase =
  require('../../../../Applications/use_case/RefreshAuthenticationUseCase');
const LogoutUserUseCase =
  require('../../../../Applications/use_case/LogoutUserUseCase');
const autoBind = require('auto-bind');

/**
 * @class AuthenticationsHandler
 */
class AuthenticationsHandler {
  /**
   * Creates an instance of AuthenticationsHandler.
   * @param {Container} container
   * @memberof AuthenticationsHandler
   */
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  /**
   * @param {Request} request
   * @param {ResponseToolkit} h
   * @return {ResponseObject}
   * @memberof AuthenticationsHandler
   */
  async postAuthenticationHandler(request, h) {
    const loginUserUseCase = this._container.getInstance(LoginUserUseCase.name);
    const {
      accessToken,
      refreshToken,
    } = await loginUserUseCase.execute(request.payload);
    const response = h.response({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  /**
   * @param {Request} request
   * @return {ResponseObject}
   * @memberof AuthenticationsHandler
   */
  async putAuthenticationHandler(request) {
    const refreshAuthenticationUseCase = this._container
        .getInstance(RefreshAuthenticationUseCase.name);
    const accessToken =
        await refreshAuthenticationUseCase.execute(request.payload);

    return {
      status: 'success',
      data: {
        accessToken,
      },
    };
  }

  /**
   * @param {Request} request
   * @return {ResponseObject}
   * @memberof AuthenticationsHandler
   */
  async deleteAuthenticationHandler(request) {
    const logoutUserUseCase = this._container
        .getInstance(LogoutUserUseCase.name);
    await logoutUserUseCase.execute(request.payload);
    return {
      status: 'success',
    };
  }
}

module.exports = AuthenticationsHandler;
