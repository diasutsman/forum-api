/**
 * @typedef {import('../../Domains/threads/ThreadRepository')} ThreadRepository
 * @typedef {import('../../Domains/comments/CommentRepository')
 * } CommentRepository
 * @typedef {import('../../Domains/replies/ReplyRepository')} ReplyRepository
 * @typedef {import('../../Domains/threads/entities/AddedThread')} AddedThread
*/
const AddThread = require('../../Domains/threads/entities/AddThread');

/**
 * @class ThreadUseCase
 */
class ThreadUseCase {
  /**
   * @param {{
   *  threadRepository: ThreadRepository,
   *  commentRepository: CommentRepository,
   *  replyRepository: ReplyRepository,
   * }} params
   */
  constructor({threadRepository, commentRepository, replyRepository}) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  /**
   * @param {{
   *  title: string,
   *  body: string,
   *  date: string,
   *  owner: string,
   * }} useCasePayload
   * @return {Promise<AddedThread>}
   * @memberof ThreadUseCase
   */
  async addThread(useCasePayload) {
    const addedThread = await this._threadRepository.addThread(new AddThread({
      ...useCasePayload,
    }));
    return addedThread;
  }

  /**
   * @param {string} id
   * @return {Promise<{
   *  id: string,
   *  title: string,
   *  body: string,
   *  date: string,
   *  username: string,
   *  comments: Array<{}>
   * }>}
   * @memberof ThreadUseCase
   */
  async getThreadById(id) {
    const thread = await this._threadRepository.getThreadById(id);
    thread.comments = await this._commentRepository.getThreadComments(id);
    for (const comment of thread.comments) {
      comment.replies =
        await this._replyRepository.getCommentReplies(comment.id);
    }
    return thread;
  }
}

module.exports = ThreadUseCase;
