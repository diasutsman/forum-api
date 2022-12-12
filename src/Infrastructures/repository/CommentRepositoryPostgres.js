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
    const {content, owner, threadId, date} = addComment;

    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: `
        INSERT INTO comments VALUES($1, $2, $3, $4, $5) 
        RETURNING id, content, owner
      `,
      values: [id, content, owner, date, threadId],
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
      text: `SELECT comments.*, users.username
      FROM comments
      LEFT JOIN users ON comments.owner = users.id
      WHERE thread_id = $1`,
      values: [threadId],
    };

    const {rows} = await this._pool.query(query);
    return rows;
  }
}

module.exports = CommentRepositoryPostgres;
