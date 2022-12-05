const AddThread = require("../../Domains/threads/entities/AddThread");

class ThreadUseCase {
  /**
   * @param {{
   *  threadRepository: import('../../Domains/threads/ThreadRepository'),
   *  commentRepository: import('../../Domains/comments/CommentRepository'), 
   *  replyRepository: import('../../Domains/replies/ReplyRepository'),
   * }} params
   */
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
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
    for (const comment of thread.comments) {
      comment.replies = await this._replyRepository.getCommentReplies(comment.id)
    }
    console.log(JSON.stringify(thread, null, 2))
    return thread;
  }
}

module.exports = ThreadUseCase;
