const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
  /**
   * @param {import('../../Infrastructures/database/postgres/pool')} pool 
   * @param {import('nanoid') | Object} idGenerator 
   */
  constructor(pool, idGenerator) {
    super()
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(addReply) {
    const id = `reply-${this._idGenerator()}`;
    const { content, owner, date, threadId, commentId } = addReply;
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, owner, date, threadId, commentId],
    };

    const result = await this._pool.query(query);

    return new AddedReply({ ...result.rows[0] });
  }

  async deleteReply(deleteReply) {
    const { replyId, owner } = deleteReply;
    await this._verifyReply(replyId, owner);
    const query = {
      text: 'UPDATE replies SET is_delete = true WHERE id = $1',
      values: [replyId],
    }

    await this._pool.query(query);
  }

  async _verifyReply(replyId, owner) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [replyId],
    }

    const { rows: [reply] } = await this._pool.query(query);

    if (!reply) {
      throw new NotFoundError('Balasan tidak ditemukan');
    }

    if (reply.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses balasan ini');
    }
  }

  async getCommentReplies(commentId) {
    const query = {
      text: `SELECT replies.id, replies.date, users.username,
      CASE 
        WHEN is_delete THEN '**balasan telah dihapus**'
        ELSE replies.content 
      END
      AS content
      FROM replies
      LEFT JOIN users ON replies.owner = users.id
      WHERE comment_id = $1
      ORDER BY date ASC
      `,
      values: [commentId],
    }

    const { rows } = await this._pool.query(query);

    return rows
  }
}
module.exports = ReplyRepositoryPostgres;
