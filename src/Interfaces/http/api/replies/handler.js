const ReplyUseCase = require('../../../../Applications/use_case/ReplyUseCase');
const autoBind = require('auto-bind');
/**
 * @class ThreadCommentsHandler
 */
class RepliesHandler {
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

module.exports = RepliesHandler;
