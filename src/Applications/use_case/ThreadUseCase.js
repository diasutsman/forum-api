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
    const comments = await this._commentRepository.getThreadComments(id);
    return {
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.date,
      username: thread.username,
      comments: await Promise.all(comments.map(
          async (comment) => {
            const replies = await this._replyRepository
                .getCommentReplies(comment.id);
            return {
              id: comment.id,
              content: comment.is_delete ?
              '**komentar telah dihapus**' :
              comment.content,
              date: comment.date.toISOString(),
              username: comment.username,
              replies: replies.map((reply) => ({
                id: reply.id,
                content: reply.is_delete ?
              '**balasan telah dihapus**' :
              reply.content,
                date: reply.date.toISOString(),
                username: reply.username,
              }),
              ).sort((a, b) => a.date.localeCompare(b.date)),
            };
          }),
      ),
    };
  }
}

module.exports = ThreadUseCase;
