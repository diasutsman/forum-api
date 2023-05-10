import AddReply from 'src/Domains/replies/entities/AddReply';
import AuthorizationError from '../../Commons/exceptions/AuthorizationError';
import NotFoundError from '../../Commons/exceptions/NotFoundError';
import AddedReply from '../../Domains/replies/entities/AddedReply';
import ReplyRepository from '../../Domains/replies/ReplyRepository';
import { Pool } from 'pg'; 
import DeleteReply from 'src/Domains/replies/entities/DeleteReply';

/**
 * @class ReplyRepositoryPostgres
 * @extends {ReplyRepository}
 */
class ReplyRepositoryPostgres extends ReplyRepository {
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
   * @param {AddReply} addReply
   * @return {AddedReply}
   * @memberof ReplyRepositoryPostgres
   */
  async addReply(addReply: AddReply): Promise<AddedReply> {
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
  async deleteReply(deleteReply: DeleteReply) {
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
  async _verifyReply(replyId: string, owner: string) {
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
   * @return {Array<{
   *  id: string,
   *  date: string,
   *  content: string,
   *  username: string,
   * }>}
   * @memberof ReplyRepositoryPostgres
   */
  async getCommentReplies(commentId: string) {
    const query = {
      text: `SELECT replies.*, users.username
      FROM replies
      LEFT JOIN users ON replies.owner = users.id
      WHERE comment_id = $1
      ORDER BY date ASC`,
      values: [commentId],
    };

    const {rows} = await this._pool.query(query);

    return rows;
  }
}
export default ReplyRepositoryPostgres;
