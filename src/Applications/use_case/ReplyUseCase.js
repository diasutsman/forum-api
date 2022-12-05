const AddReply = require("../../Domains/replies/entities/AddReply");
const DeleteReply = require("../../Domains/replies/entities/DeleteReply");

class ReplyUseCase {
  /**
   * @param {{
   *  commentRepository: import('../../Domains/comments/CommentRepository'),
   *  threadRepository: import('../../Domains/threads/ThreadRepository'),
   *  replyRepository: import('../../Domains/replies/ReplyRepository'),
   * }} params
   */
  constructor({ commentRepository, threadRepository, replyRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._replyRepository = replyRepository;
  }

  async addReply(useCasePayload) {
    const addReply = new AddReply(useCasePayload);
    await this._threadRepository.getThreadById(addReply.threadId);
    await this._commentRepository.verifyCommentExists(addReply.commentId);
    const addedReply = await this._replyRepository.addReply(addReply);
    return addedReply;
  }

  async deleteReply(useCasePayload) {
    const deleteReply = new DeleteReply(useCasePayload);
    await this._threadRepository.getThreadById(deleteReply.threadId);
    await this._commentRepository.verifyCommentExists(deleteReply.commentId);
    await this._replyRepository.deleteReply(deleteReply);
  }
}
module.exports = ReplyUseCase;
