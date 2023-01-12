/**
 * @typedef {import('../../Infrastructures/database/postgres/pool')} Pool
 * @typedef {import('nanoid')} nanoid
 * @typedef {import('../../Domains/replies/entities/AddReply')} AddReply
 * @typedef {import('../../Domains/replies/entities/AddedReply')} AddedReply
 * @typedef {import('../../Domains/replies/entities/DeleteReply')} DeleteReply
 */
const AuthorizationError =
require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');

/**
 * @class ReplyRepositoryPostgres
 * @extends {ReplyRepository}
 */
class ReplyRepositoryPostgres extends ReplyRepository {
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
   * @param {AddReply} addReply
   * @return {Promise<AddedReply>}
   * @memberof ReplyRepositoryPostgres
   */
  async addReply(addReply) {
    const id = `reply-${this._idGenerator()}`;
    const {content, owner, threadId, commentId} = addReply;
    const query = {
      text: `
        INSERT INTO replies VALUES($1, $2, $3, $4, $5) 
        RETURNING id, content, owner
      `,
      values: [id, content, owner, threadId, commentId],
    };

    const result = await this._pool.query(query);

    return new AddedReply({...result.rows[0]});
  }

  /**
   * @param {DeleteReply} deleteReply
   * @memberof ReplyRepositoryPostgres
   */
  async deleteReply(deleteReply) {
    const {replyId, owner} = deleteReply;
    await this._verifyReply(replyId, owner);
    const query = {
      text: 'UPDATE replies SET is_delete = true WHERE id = $1',
      values: [replyId],
    };

    await this._pool.query(query);
  }

  /**
   * @param {string} replyId
   * @param {string} owner
   * @memberof ReplyRepositoryPostgres
   */
  async _verifyReply(replyId, owner) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [replyId],
    };

    const {rows: [reply]} = await this._pool.query(query);

    if (!reply) {
      throw new NotFoundError('Balasan tidak ditemukan');
    }

    if (reply.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses balasan ini');
    }
  }

  /**
   * @param {string} commentId
   * @return {Promise<Array<{
   *  id: string,
   *  date: string,
   *  content: string,
   *  username: string,
   * }>>}
   * @memberof ReplyRepositoryPostgres
   */
  async getCommentReplies(commentId) {
    const query = {
      text: `SELECT replies.*, users.username
      FROM replies
      LEFT JOIN users ON replies.owner = users.id
      WHERE comment_id = $1
      ORDER BY date ASC
      `,
      values: [commentId],
    };

    const {rows} = await this._pool.query(query);

    return rows;
  }
}
module.exports = ReplyRepositoryPostgres;
