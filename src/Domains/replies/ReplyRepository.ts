import AddReply from './entities/AddReply';
import AddedReply from './entities/AddedReply';
import DeleteReply from './entities/DeleteReply';

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
  async addReply(addReply: AddReply): Promise<AddedReply> {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  /**
   * @param {DeleteReply} deleteReply
   * @memberof ReplyRepository
   */
  async deleteReply(deleteReply: DeleteReply): Promise<void> {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  /**
   * @param {string} commentId
   * @memberof ReplyRepository
   */
  async getCommentReplies(commentId: string): Promise<any[]> {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  /**
   * @param {string} commentId
   * @param {string} owner
   * @memberof ReplyRepository
   */
  async verifyReplyOwner(commentId: string, owner: string) {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}
export default ReplyRepository;
