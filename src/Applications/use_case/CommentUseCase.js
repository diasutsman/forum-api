const AddComment = require("../../Domains/comments/entities/AddComment");

class CommentUseCase {

  /**
   * @param {{
   *  commentRepository: import('../../Domains/comments/CommentRepository'),
   * threadRepository: import('../../Domains/threads/ThreadRepository')
   * }} params
   */
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async addComment(useCasePayload) {
    await this._threadRepository.getThreadById(useCasePayload.threadId);

    const addedComment = await this._commentRepository.addComment(new AddComment(useCasePayload));

    return addedComment;
  }

  async deleteComment(useCasePayload) {
    await this._threadRepository.getThreadById(useCasePayload.threadId);

    await this._commentRepository.deleteComment(useCasePayload);
  }
}

module.exports = CommentUseCase;
