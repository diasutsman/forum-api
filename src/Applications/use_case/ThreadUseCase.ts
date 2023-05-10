import ThreadRepository from 'src/Domains/threads/ThreadRepository';
import AddThread from '../../Domains/threads/entities/AddThread';
import CommentRepository from 'src/Domains/comments/CommentRepository';
import ReplyRepository from 'src/Domains/replies/ReplyRepository';

type Dependencies = {
    threadRepository: ThreadRepository;
    commentRepository: CommentRepository
    replyRepository: ReplyRepository
}

type NewThread = {
    title: string;
    body: string;
    date: string;
    owner: string;
}

/**
 * @class ThreadUseCase
 */
class ThreadUseCase {
  private _threadRepository: ThreadRepository;
  private _commentRepository: CommentRepository;
  private _replyRepository: ReplyRepository;
  /**
   * @param {Dependencies} params
   */
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
  }: Dependencies) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  /**
   * @param {NewThread} useCasePayload
   * @return {Promise<AddedThread>}
   * @memberof ThreadUseCase
   */
  async addThread(useCasePayload: NewThread) {
    const addedThread = await this._threadRepository.addThread(new AddThread({
      ...useCasePayload,
    }));
    return addedThread;
  }

  /**
   * @param {string} id
   * @return {Promise<{
   *  id: string,
   *  title: string,
   *  body: string,
   *  date: string,
   *  username: string,
   *  comments: Array<{}>
   * }>}
   * @memberof ThreadUseCase
   */
  async getThreadById(id: string) {
    const thread = await this._threadRepository.getThreadById(id);
    const comments = await this._commentRepository.getThreadComments(id);
    return {
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.date,
      username: thread.username,
      comments: await Promise.all(comments.map(
          async (comment: any) => {
            const replies = await this._replyRepository
                .getCommentReplies(comment.id);
            return {
              id: comment.id,
              content: comment.is_delete ?
              '**komentar telah dihapus**' :
              comment.content,
              likeCount: +comment.like_count,
              date: comment.date.toISOString(),
              username: comment.username,
              replies: replies.map((reply: any) => ({
                id: reply.id,
                content: reply.is_delete ?
              '**balasan telah dihapus**' :
              reply.content,
                date: reply.date.toISOString(),
                username: reply.username,
              }),
              ),
            };
          }),
      ),
    };
  }
}

export default ThreadUseCase;
