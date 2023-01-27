/**
 * @typedef {import('../../../../Infrastructures/container')} Container
 * @typedef {import('@hapi/hapi').Request} Request
 * @typedef {import('@hapi/hapi').ResponseToolkit} ResponseToolkit
 * @typedef {import('@hapi/hapi').ResponseObject} ResponseObject
 */
const CommentUseCase =
require('../../../../Applications/use_case/CommentUseCase');
const autoBind = require('auto-bind');

/**
 * @class ThreadCommentsHandler
 */
class CommentsHandler {
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
  async postCommentHandler(request, h) {
    /** @type {CommentUseCase} */
    const commentUseCase = this._container.getInstance(CommentUseCase.name);
    const addedComment = await commentUseCase.addComment({
      ...request.payload,
      owner: request.auth.credentials.id,
      threadId: request.params.threadId,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
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
  async deleteCommentByIdHandler(request) {
    const {threadId, commentId} = request.params;
    const {id: credentialId} = request.auth.credentials;

    /** @type {CommentUseCase} */
    const commentUseCase = this._container.getInstance(CommentUseCase.name);
    await commentUseCase.deleteComment({
      commentId,
      threadId,
      owner: credentialId,
    });

    return {
      status: 'success',
      message: 'berhasil menghapus komentar',
    };
  }
}

module.exports = CommentsHandler;
