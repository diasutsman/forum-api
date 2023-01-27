/**
 * @typedef {import('./../../Domains/comments/entities/AddComment')} AddComment
 * @typedef {import('./../../Domains/comments/entities/DeleteComment')
 * } DeleteComment
 */

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
  async addComment(addComment) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  /**
   * @param {DeleteComment} deleteComment
   * @memberof CommentRepository
   */
  async deleteComment(deleteComment) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  /**
   * @param {string} threadId
   * @memberof CommentRepository
   */
  async getThreadComments(threadId) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  /**
   * @param {string} id
   * @memberof CommentRepository
   */
  async verifyCommentExists(id) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  /**
   * @param {string} payload
   * @memberof CommentRepository
   */
  async toggleLike(payload) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  /**
   * @param {string} commentId
   * @param {string} owner
   * @memberof CommentRepository
   */
  async verifyCommentOwner(commentId, owner) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = CommentRepository;
