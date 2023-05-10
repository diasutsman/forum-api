/**
 * @typedef {import('../../../../Infrastructures/container')} Container
 * @typedef {import('@hapi/hapi').Request} Request
 * @typedef {import('@hapi/hapi').ResponseToolkit} ResponseToolkit
 * @typedef {import('@hapi/hapi').ResponseObject} ResponseObject
 */
import LoginUserUseCase from '../../../../Applications/use_case/LoginUserUseCase';
import RefreshAuthenticationUseCase from '../../../../Applications/use_case/RefreshAuthenticationUseCase';
import LogoutUserUseCase from '../../../../Applications/use_case/LogoutUserUseCase';
import autoBind from 'auto-bind';
import { Container } from 'src/Infrastructures/container';
import { Request, ResponseToolkit, ResponseObject } from '@hapi/hapi';

/**
 * @class AuthenticationsHandler
 */
class AuthenticationsHandler {
  private _container: Container;
  /**
   * Creates an instance of AuthenticationsHandler.
   * @param {Container} container
   * @memberof AuthenticationsHandler
   */
  constructor(container: Container) {
    this._container = container;

    autoBind(this);
  }

  /**
   * @param {Request} request
   * @param {ResponseToolkit} h
   * @return {ResponseObject}
   * @memberof AuthenticationsHandler
   */
  async postAuthenticationHandler(request: Request, h: ResponseToolkit): Promise<ResponseObject> {
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
  async putAuthenticationHandler(request: Request): Promise<ResponseObject | {}> {
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
  async deleteAuthenticationHandler(request: Request): Promise<ResponseObject | {}> {
    const logoutUserUseCase = this._container
        .getInstance(LogoutUserUseCase.name);
    await logoutUserUseCase.execute(request.payload);
    return {
      status: 'success',
    };
  }
}

export default AuthenticationsHandler;
