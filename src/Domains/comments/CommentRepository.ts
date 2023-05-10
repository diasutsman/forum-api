import { CommentLikePayload } from 'src/Commons/types';
import AddComment from './entities/AddComment';
import AddedComment from './entities/AddedComment';
import DeleteComment from './entities/DeleteComment';

/**
 *
 *
 * @class CommentRepository
 */
class CommentRepository {
  /**
   * @param {AddComment} addComment
   * @memberof CommentRepository
   */
  async addComment(addComment: AddComment): Promise<AddedComment> {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  /**
   * @param {DeleteComment} deleteComment
   * @memberof CommentRepository
   */
  async deleteComment(deleteComment: DeleteComment) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  /**
   * @param {string} threadId
   * @memberof CommentRepository
   */
  async getThreadComments(threadId: string): Promise<any[]> {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  /**
   * @param {string} id
   * @memberof CommentRepository
   */
  async verifyCommentExists(id: string): Promise<any> {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  /**
   * @param {string} payload
   * @memberof CommentRepository
   */
  async toggleLike(payload: CommentLikePayload) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  /**
   * @param {string} commentId
   * @param {string} owner
   * @memberof CommentRepository
   */
  async verifyCommentOwner(commentId: string, owner: string) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

export default CommentRepository;
