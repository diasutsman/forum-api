import CommentRepository from 'src/Domains/comments/CommentRepository';
import AddReply from '../../Domains/replies/entities/AddReply';
import DeleteReply from '../../Domains/replies/entities/DeleteReply';
import ThreadRepository from 'src/Domains/threads/ThreadRepository';
import ReplyRepository from 'src/Domains/replies/ReplyRepository';

type Dependencies = {
  commentRepository: CommentRepository;
  threadRepository: ThreadRepository;
  replyRepository: ReplyRepository;
}

type NewReply = {
  threadId: string;
  commentId: string;
  content: string;
  owner: string;
  date?: string;
}

type DeleteReplyPayload = {
  threadId: string;
  commentId: string;
  replyId: string;
  owner: string;
}

/**
 * @class ReplyUseCase
 */
class ReplyUseCase {
  private _commentRepository: CommentRepository;
  private _threadRepository: ThreadRepository;
  private _replyRepository: ReplyRepository;
  /**
   * @param {Dependencies} params
   */
  constructor({commentRepository,
    threadRepository,
    replyRepository,
  }: Dependencies) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._replyRepository = replyRepository;
  }

  /**
   * @param {NewReply} useCasePayload
   * @return {Promise<AddedReply>}
   * @memberof ReplyUseCase
   */
  async addReply(useCasePayload: NewReply) {
    const addReply = new AddReply(useCasePayload);
    await this._threadRepository.verifyThreadAvailability(addReply.threadId);
    await this._commentRepository.verifyCommentExists(addReply.commentId);
    const addedReply = await this._replyRepository.addReply(addReply);
    return addedReply;
  }

  /**
   * @param {DeleteReplyPayload} useCasePayload
   * @memberof ReplyUseCase
   */
  async deleteReply(useCasePayload: DeleteReplyPayload) {
    const deleteReply = new DeleteReply(useCasePayload);
    await this._threadRepository.verifyThreadAvailability(deleteReply.threadId);
    await this._commentRepository.verifyCommentExists(deleteReply.commentId);
    await this._replyRepository.deleteReply(deleteReply);
  }
}
export default ReplyUseCase;
