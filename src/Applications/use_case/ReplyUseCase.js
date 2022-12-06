/**
 * @typedef {import('../../Domains/comments/CommentRepository')
 * } CommentRepository
 * @typedef {import('../../Domains/threads/ThreadRepository')
 * } ThreadRepository
 * @typedef {import('../../Domains/replies/ReplyRepository')
 * } ReplyRepository
 * @typedef {import('../../Domains/replies/entities/AddedReply')
 * } AddedReply
 */
const AddReply = require('../../Domains/replies/entities/AddReply');
const DeleteReply = require('../../Domains/replies/entities/DeleteReply');

/**
 * @class ReplyUseCase
 */
class ReplyUseCase {
  /**
   * @param {{
   *  commentRepository: CommentRepository,
   *  threadRepository: ThreadRepository,
   *  replyRepository: ReplyRepository,
   * }} params
   */
  constructor({commentRepository, threadRepository, replyRepository}) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._replyRepository = replyRepository;
  }

  /**
   * @param {{
   *  threadId: string,
   *  commentId: string,
   *  content: string,
   *  owner: string,
   *  date: string,
   * }} useCasePayload
   * @return {Promise<AddedReply>}
   * @memberof ReplyUseCase
   */
  async addReply(useCasePayload) {
    const addReply = new AddReply(useCasePayload);
    await this._threadRepository.getThreadById(addReply.threadId);
    await this._commentRepository.verifyCommentExists(addReply.commentId);
    const addedReply = await this._replyRepository.addReply(addReply);
    return addedReply;
  }

  /**
   * @param {{
   *  threadId: string,
   *  commentId: string,
   *  replyId: string,
   *  owner: string,
   * }} useCasePayload
   * @memberof ReplyUseCase
   */
  async deleteReply(useCasePayload) {
    const deleteReply = new DeleteReply(useCasePayload);
    await this._threadRepository.getThreadById(deleteReply.threadId);
    await this._commentRepository.verifyCommentExists(deleteReply.commentId);
    await this._replyRepository.deleteReply(deleteReply);
  }
}
module.exports = ReplyUseCase;
