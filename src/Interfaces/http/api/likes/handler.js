const CommentUseCase =
require('../../../../Applications/use_case/CommentUseCase');
const autoBind = require('auto-bind');

/**
 * @class LikesHandler
 */
class LikesHandler {
  /**
   * @param {Container} container
   */
  constructor(container) {
    this._container = container;
    autoBind(this);
  }

  /**
   * @param {Request} request
   * @memberof ThreadsHandler
   */
  async putLikesHandler(request) {
    const {threadId, commentId} = request.params;
    const {id: userId} = request.auth.credentials;

    /** @type {CommentUseCase} */
    const commentUseCase = this._container.getInstance(CommentUseCase.name);
    await commentUseCase.toggleLike({
      threadId,
      commentId,
      userId,
    });

    return {status: 'success'};
  }
}

module.exports = LikesHandler;
