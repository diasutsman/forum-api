/**
 * @typedef {import('../../Domains/comments/CommentRepository')
 * } CommentRepository
 * @typedef {import('../../Domains/threads/ThreadRepository')} ThreadRepository
 * @typedef {import('../../Domains/comments/entities/AddedComment')
 * } AddedComment
 */
const AddComment = require('../../Domains/comments/entities/AddComment');

/**
 * CommentUseCase
 */
class CommentUseCase {
  /**
   * @param {{
   *  commentRepository: CommentRepository,
   * threadRepository: ThreadRepository
   * }} params
   */
  constructor({commentRepository, threadRepository}) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  /**
   * @param {{
   *  content: string,
   *  threadId: string,
   *  owner: string,
   *  date: string,
   * }} useCasePayload
   * @return {Promise<AddedComment>}
   */
  async addComment(useCasePayload) {
    await this._threadRepository.verifyThreadAvailability(
        useCasePayload.threadId,
    );

    const addedComment =
      await this._commentRepository.addComment(new AddComment(useCasePayload));

    return addedComment;
  }

  /**
   * @param {{
   *  threadId: string,
   *  commentId: string,
   *  owner: string,
   * }} useCasePayload
   */
  async deleteComment(useCasePayload) {
    await this._threadRepository.verifyThreadAvailability(
        useCasePayload.threadId,
    );

    await this._commentRepository.deleteComment(useCasePayload);
  }
}

module.exports = CommentUseCase;
