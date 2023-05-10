import { Container } from 'src/Infrastructures/container';
import AddUserUseCase from '../../../../Applications/use_case/AddUserUseCase';
import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';

/**
 * @class UsersHandler
 */
class UsersHandler {
  private _container: any;
  /**
   * Creates an instance of UsersHandler.
   * @param {Container} container
   * @memberof UsersHandler
   */
  constructor(container: Container) {
    this._container = container;

    this.postUserHandler = this.postUserHandler.bind(this);
  }

  /**
   * @param {Request} request
   * @param {ResponseToolkit} h
   * @return {ResponseObject}
   * @memberof UsersHandler
   */
  async postUserHandler(request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    const addUserUseCase = this._container.getInstance(AddUserUseCase.name);
    const addedUser = await addUserUseCase.execute(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        addedUser,
      },
    });
    response.code(201);
    return response;
  }
}

export default UsersHandler;
