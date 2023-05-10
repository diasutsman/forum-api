import AddComment from 'src/Domains/comments/entities/AddComment';
import AuthorizationError from '../../Commons/exceptions/AuthorizationError';
import NotFoundError from '../../Commons/exceptions/NotFoundError';
import CommentRepository from '../../Domains/comments/CommentRepository';
import AddedComment from '../../Domains/comments/entities/AddedComment';
import { Pool } from 'pg'; 
import DeleteComment from 'src/Domains/comments/entities/DeleteComment';

/**
 * @class CommentRepositoryPostgres
 * @extends {CommentRepository}
 */
class CommentRepositoryPostgres extends CommentRepository {
  private _pool: any;
  private _idGenerator: () => string;
  /**
   * @param {Pool} pool
   * @param {nanoid} idGenerator
   */
  constructor(pool: Pool, idGenerator: () => string) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  /**
   * @param {AddComment} addComment
   * @return {AddedComment}
   * @memberof CommentRepositoryPostgres
   */
  async addComment(addComment: AddComment) {
    const {content, owner, threadId} = addComment;

    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: `
        INSERT INTO comments VALUES($1, $2, $3, $4) 
        RETURNING id, content, owner
      `,
      values: [id, content, owner, threadId],
    };

    const result = await this._pool.query(query);

    return new AddedComment({...result.rows[0]});
  }

  /**
   * @param {string} commentId
   * @param {string} owner
   * @memberof CommentRepositoryPostgres
   */
  async _verifyComment(commentId: string, owner: string) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId],
    };

    const {rowCount, rows: [comment]} = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Komentar tidak ditemukan');
    }

    if (comment.owner !== owner) {
      throw new AuthorizationError('User bukan pemilik komentar');
    }
  }

  /**
   * @param {string} commentId
   * @memberof CommentRepositoryPostgres
   */
  async verifyCommentExists(commentId: string) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId],
    };

    const {rowCount} = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Komentar tidak ditemukan');
    }
  }

  /**
   * @param {DeleteComment} deleteComment
   * @memberof CommentRepositoryPostgres
   */
  async deleteComment(deleteComment: DeleteComment) {
    const {commentId, owner} = deleteComment;

    await this._verifyComment(commentId, owner);

    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [commentId],
    };

    await this._pool.query(query);
  }

  /**
   * @param {string} threadId
   * @return {Array<{
   *  id: string,
   *  content: string,
   *  username: string,
   *  date: string,
   * }>}
   * @memberof CommentRepositoryPostgres
   */
  async getThreadComments(threadId: string) {
    const query = {
      text: `SELECT comments.*, users.username
      FROM comments
      LEFT JOIN users ON comments.owner = users.id
      WHERE thread_id = $1
      ORDER BY date ASC`,
      values: [threadId],
    };

    const {rows} = await this._pool.query(query);
    return rows;
  }
}

export default CommentRepositoryPostgres;
