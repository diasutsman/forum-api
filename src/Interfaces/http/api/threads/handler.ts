/**
 * @typedef {import('../../../../Infrastructures/container')} Container
 * @typedef {import('@hapi/hapi').Request} Request
 * @typedef {import('@hapi/hapi').ResponseToolkit} ResponseToolkit
 * @typedef {import('@hapi/hapi').ResponseObject} ResponseObject
 */
const AddThreadUseCase =
require('../../../../Applications/use_case/ThreadUseCase');
const CommentUseCase =
require('../../../../Applications/use_case/CommentUseCase');
const ThreadUseCase =
require('../../../../Applications/use_case/ThreadUseCase');
const autoBind = require('auto-bind');
const ReplyUseCase = require('../../../../Applications/use_case/ReplyUseCase');

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

  /**
   * @param {Request} request
   * @return {ResponseObject}
   * @memberof ThreadsHandler
   */
  async deleteThreadCommentByIdHandler(request) {
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

  /**
   * @param {Request} request
   * @param {ResponseToolkit} h
   * @return {ResponseObject}
   * @memberof ThreadsHandler
   */
  async postReplyHandler(request, h) {
    const {threadId, commentId} = request.params;
    const {id: credentialId} = request.auth.credentials;

    /** @type {ReplyUseCase} */
    const replyUseCase = this._container.getInstance(ReplyUseCase.name);
    const addedReply = await replyUseCase.addReply({
      ...request.payload,
      owner: credentialId,
      threadId,
      commentId,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
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
  async deleteReplyHandler(request) {
    const {threadId, commentId, replyId} = request.params;
    const {id: credentialId} = request.auth.credentials;

    /** @type {ReplyUseCase} */
    const replyUseCase = this._container.getInstance(ReplyUseCase.name);
    await replyUseCase.deleteReply({
      threadId,
      commentId,
      replyId,
      owner: credentialId,
    });

    return {
      status: 'success',
      message: 'berhasil menghapus balasan',
    };
  }
}
module.exports = ThreadsHandler;
