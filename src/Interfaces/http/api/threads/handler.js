const AddThreadUseCase = require('../../../../Applications/use_case/ThreadUseCase');
const CommentUseCase = require('../../../../Applications/use_case/CommentUseCase');
const ThreadUseCase = require('../../../../Applications/use_case/ThreadUseCase');

class ThreadsHandler {
  /**
   * @param {import('../../../../Infrastructures/container')} container
   */
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
    this.deleteThreadCommentByIdHandler = this.deleteThreadCommentByIdHandler.bind(this)
  }

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

  async postCommentHandler(request, h) {
    /** @type {CommentUseCase} */
    const commentUseCase = this._container.getInstance(CommentUseCase.name);
    const addedComment = await commentUseCase.addComment({
      ...request.payload,
      owner: request.auth.credentials.id,
      threadId: request.params.threadId,
    })

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
   * @param {import('@hapi/hapi').Request} request 
   * @param {import('@hapi/hapi').ResponseToolkit} h 
   */
  async getThreadByIdHandler(request) {

    const { threadId: id } = request.params
    /** @type {ThreadUseCase} */
    const threadUseCase = this._container.getInstance(ThreadUseCase.name)
    const thread = await threadUseCase.getThreadById(id)

    return {
      status: 'success',
      data: {
        thread,
      },
    }
  }

  /**
   * @param {import('@hapi/hapi').Request} request 
   * @param {import('@hapi/hapi').ResponseToolkit} h 
   */
  async deleteThreadCommentByIdHandler(request) {
    const { threadId, commentId } = request.params;
    const { id: credentialId } = request.auth.credentials
    console.log({ commentId, threadId, credentialId })

    /** @type {CommentUseCase} */
    const commentUseCase = this._container.getInstance(CommentUseCase.name);
    await commentUseCase.deleteComment({ commentId, threadId, owner: credentialId })

    return {
      status: 'success',
      message: 'berhasil menghapus komentar',
    }
  }
}
module.exports = ThreadsHandler;
