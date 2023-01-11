/**
 * @typedef {import('../database/postgres/pool')} Pool
 * @typedef {import('nanoid')} nanoid
 * @typedef {import('../../Domains/comments/entities/AddComment')} AddComment
 * @typedef {import('../../Domains/comments/entities/AddedComment')
 * } AddedComment
 * @typedef {import('../../Domains/comments/entities/DeleteComment')
 * } DeleteComment
 */
const AuthorizationError =
    require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');

/**
 * @class CommentRepositoryPostgres
 * @extends {CommentRepository}
 */
class CommentRepositoryPostgres extends CommentRepository {
  /**
   * @param {Pool} pool
   * @param {nanoid} idGenerator
   */
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  /**
   * @param {AddComment} addComment
   * @return {AddedComment}
   * @memberof CommentRepositoryPostgres
   */
  async addComment(addComment) {
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
  async _verifyComment(commentId, owner) {
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
  async verifyCommentExists(commentId) {
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
  async deleteComment(deleteComment) {
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
  async getThreadComments(threadId) {
    const query = {
      text: `
        SELECT comments.*, users.username,
        COUNT(users_likes.user_id) AS like_count
        FROM comments
        LEFT JOIN users ON comments.owner = users.id
        LEFT JOIN users_likes ON comments.id = users_likes.comment_id
        WHERE thread_id = $1
        GROUP BY comments.id, users.id
        ORDER BY comments.date ASC
      `,
      values: [threadId],
    };

    const {rows} = await this._pool.query(query);
    return rows;
  }

  /**
   * @param {{
   *  commentId : string,
   *  userId : string,
   * }} payload
   * @memberof CommentRepositoryPostgres
   */
  async toggleLike(payload) {
    const {commentId, liker} = payload;

    const query = {
      text: `
        SELECT * FROM users_likes WHERE comment_id = $1 AND user_id = $2
      `,
      values: [commentId, liker],
    };

    const {rowCount: isLiked} = await this._pool.query(query);

    if (isLiked) {
      const query = {
        text: `DELETE FROM users_likes WHERE comment_id = $1 AND user_id = $2`,
        values: [commentId, liker],
      };

      await this._pool.query(query);
    } else {
      const id = `likes-${this._idGenerator()}`;
      const query = {
        text: `INSERT INTO users_likes VALUES($1, $2, $3)`,
        values: [id, liker, commentId],
      };

      await this._pool.query(query);
    }
  }
}

module.exports = CommentRepositoryPostgres;
