import CommentRepository from '../../Domains/comments/CommentRepository';
import AddComment from '../../Domains/comments/entities/AddComment';
import ThreadRepository from '../../Domains/threads/ThreadRepository';
import DeleteComment from '../../Domains/comments/entities/DeleteComment';
import ToggleLikeComment from "../../Domains/comments/entities/ToggleLikeComment";
import { CommentLikePayload } from 'src/Commons/types';

type Dependencies = {
  commentRepository: CommentRepository;
  threadRepository: ThreadRepository;
}

type AddPayload = {
  content: string;
  owner: string;
  threadId: string;
  date: string | null | undefined;
}

type DeletePayload = {
  threadId: string;
  commentId: string;
  owner: string;
}

/**
 * CommentUseCase
 */
class CommentUseCase {
  private _commentRepository: CommentRepository;
  private _threadRepository: ThreadRepository;
  /**
   * @param {Dependencies} params
   */
  constructor({commentRepository, threadRepository}: Dependencies) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  /**
   * @param {AddPayload} useCasePayload
   * @return {Promise<AddedComment>}
   */
  async addComment(useCasePayload: AddPayload) {
    await this._threadRepository.verifyThreadAvailability(
        useCasePayload.threadId,
    );

    const addedComment =
      await this._commentRepository.addComment(new AddComment(useCasePayload));

    return addedComment;
  }

  /**
   * @param {DeletePayload} useCasePayload
   */
  async deleteComment(useCasePayload: DeletePayload) {
    const validatePayload = new DeleteComment(useCasePayload);
    await this._threadRepository.verifyThreadAvailability(
        useCasePayload.threadId,
    );

    await this._commentRepository.deleteComment(validatePayload);
  }

	/**
	 * @param {{
	 *  threadId: string,
	 *  commentId: string,
	 *  userId: string,
	 * }} useCasePayload
	 */
	async toggleLike(useCasePayload: CommentLikePayload) {
		const toggleLikeComment = new ToggleLikeComment(useCasePayload);
		await this._threadRepository.verifyThreadAvailability(
			toggleLikeComment.threadId
		);

		await this._commentRepository.verifyCommentExists(
			toggleLikeComment.commentId
		);

		await this._commentRepository.toggleLike(toggleLikeComment);
	}
}

export default CommentUseCase;
