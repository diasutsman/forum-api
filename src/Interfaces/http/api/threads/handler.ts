/**
 * @typedef {import('../../../../Infrastructures/container')} Container
 * @typedef {import('@hapi/hapi').Request} Request
 * @typedef {import('@hapi/hapi').ResponseToolkit} ResponseToolkit
 * @typedef {import('@hapi/hapi').ResponseObject} ResponseObject
 */
import AddThreadUseCase from '../../../../Applications/use_case/ThreadUseCase';
import CommentUseCase from '../../../../Applications/use_case/CommentUseCase';
import ThreadUseCase from '../../../../Applications/use_case/ThreadUseCase';
import autoBind from 'auto-bind';
import ReplyUseCase from '../../../../Applications/use_case/ReplyUseCase';
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
   * @param {ResponseToolkit} h
   * @return {ResponseObject}
   * @memberof ThreadsHandler
   */
  async postCommentHandler(request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    /** @type {CommentUseCase} */
    const commentUseCase = this._container.getInstance(CommentUseCase.name);
    const addedComment = await commentUseCase.addComment({
      ...request.payload as object,
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

  /**
   * @param {Request} request
   * @return {ResponseObject}
   * @memberof ThreadsHandler
   */
  async deleteThreadCommentByIdHandler(request: Request): Promise<ResponseObject | object> {
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
  async postReplyHandler(request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    const {threadId, commentId} = request.params;
    const {id: credentialId} = request.auth.credentials;

    /** @type {ReplyUseCase} */
    const replyUseCase = this._container.getInstance(ReplyUseCase.name);
    const addedReply = await replyUseCase.addReply({
      ...request.payload as object,
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
  async deleteReplyHandler(request: Request): Promise<ResponseObject | object> {
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
export default ThreadsHandler;
