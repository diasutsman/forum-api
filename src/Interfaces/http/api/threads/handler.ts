/**
 * @typedef {import('../../../../Infrastructures/container')} Container
 * @typedef {import('@hapi/hapi').Request} Request
 * @typedef {import('@hapi/hapi').ResponseToolkit} ResponseToolkit
 * @typedef {import('@hapi/hapi').ResponseObject} ResponseObject
 */
import AddThreadUseCase from '../../../../Applications/use_case/ThreadUseCase';
import ThreadUseCase from '../../../../Applications/use_case/ThreadUseCase';
import autoBind from 'auto-bind';
import { Container } from 'src/Infrastructures/container';
import { Request, ResponseToolkit, ResponseObject } from '@hapi/hapi';

/**
 * @class ThreadsHandler
 */
class ThreadsHandler {
  private _container: any;
  /**
   * @param {Container} container
   */
  constructor(container: Container) {
    this._container = container;
    autoBind(this);
  }

  /**
   * @param {Request} request
   * @param {ResponseToolkit} h
   * @return {ResponseObject}
   * @memberof ThreadsHandler
   */
  async postThreadHandler(request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.addThread({
      ...request.payload as object,
      owner: request.auth.credentials.id,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  /**
   * @param {Request} request
   * @return {ResponseObject}
   * @memberof ThreadsHandler
   */
  async getThreadByIdHandler(request: Request): Promise<ResponseObject | object> {
    const {threadId: id} = request.params;
    /** @type {ThreadUseCase} */
    const threadUseCase = this._container.getInstance(ThreadUseCase.name);
    const thread = await threadUseCase.getThreadById(id);

    return {
      status: 'success',
      data: {
        thread,
      },
    };
  }
}
export default ThreadsHandler;
