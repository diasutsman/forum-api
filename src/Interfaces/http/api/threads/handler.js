/**
 * @typedef {import('../../../../Infrastructures/container')} Container
 * @typedef {import('@hapi/hapi').Request} Request
 * @typedef {import('@hapi/hapi').ResponseToolkit} ResponseToolkit
 * @typedef {import('@hapi/hapi').ResponseObject} ResponseObject
 */
const AddThreadUseCase =
require('../../../../Applications/use_case/ThreadUseCase');
const ThreadUseCase =
require('../../../../Applications/use_case/ThreadUseCase');
const autoBind = require('auto-bind');

/**
 * @class ThreadsHandler
 */
class ThreadsHandler {
  /**
   * @param {Container} container
   */
  constructor(container) {
    this._container = container;
    autoBind(this);
  }

  /**
   * @param {Request} request
   * @param {ResponseToolkit} h
   * @return {ResponseObject}
   * @memberof ThreadsHandler
   */
  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.addThread({
      ...request.payload,
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
  async getThreadByIdHandler(request) {
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
module.exports = ThreadsHandler;
