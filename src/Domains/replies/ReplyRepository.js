/**
 * @typedef {import('./../../Domains/replies/entities/AddReply')} AddReply
 * @typedef {import('./../../Domains/replies/entities/DeleteReply')} DeleteReply
 */

/**
 *
 *
 * @class ReplyRepository
 */
class ReplyRepository {
  /**
   * @param {AddReply} addReply
   * @memberof ReplyRepository
   */
  async addReply(addReply) {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  /**
   * @param {DeleteReply} deleteReply
   * @memberof ReplyRepository
   */
  async deleteReply(deleteReply) {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  /**
   * @param {string} commentId
   * @memberof ReplyRepository
   */
  async getCommentReplies(commentId) {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  /**
   * @param {string} commentId
   * @param {string} owner
   * @memberof ReplyRepository
   */
  async verifyReplyOwner(commentId, owner) {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}
module.exports = ReplyRepository;
