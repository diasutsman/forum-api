const AddThread = require("../../Domains/threads/entities/AddThread");

class ThreadUseCase {
  /**
   * @param {{
   *  threadRepository: import('../../Domains/threads/ThreadRepository'),
   *  commentRepository: import('../../Domains/comments/CommentRepository'), 
   * }} params
   */
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async addThread(useCasePayload) {
    const addedThread = await this._threadRepository.addThread(new AddThread({
      ...useCasePayload,
    }));
    return addedThread;
  }

  async getThreadById(id) {
    const thread = await this._threadRepository.getThreadById(id)
    thread.comments = await this._commentRepository.getThreadComments(id)
    console.log(thread)
    return thread;
  }
}

module.exports = ThreadUseCase;
