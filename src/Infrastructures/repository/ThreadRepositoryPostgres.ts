import ThreadRepository from '../../Domains/threads/ThreadRepository';
import AddedThread from '../../Domains/threads/entities/AddedThread';
import NotFoundError from '../../Commons/exceptions/NotFoundError';
import { Pool } from 'pg';
import AddThread from 'src/Domains/threads/entities/AddThread';
/**
 * @class ThreadRepositoryPostgres
 * @extends {ThreadRepository}
 */
/**
 * @class ThreadRepositoryPostgres
 * @extends {ThreadRepository}
 */
class ThreadRepositoryPostgres extends ThreadRepository {
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
   * @param {AddThread} addThread
   * @return {AddedThread}
   * @memberof ThreadRepositoryPostgres
   */
  async addThread(addThread: AddThread) {
    const id = `thread-${this._idGenerator()}`;
    const {title, body, owner, date} = addThread;
    const query = {
      text: `
        INSERT INTO threads VALUES($1, $2, $3, $4, $5) 
        RETURNING id, title, body, owner
      `,
      values: [id, title, body, owner, date],
    };
    const result = await this._pool.query(query);

    return new AddedThread({...result.rows[0]});
  }

  /**
   * @param {string} id
   * @return {{
   *  id: string,
   *  title: string,
   *  body: string,
   *  date: string,
   *  username: string,
   * }}
   * @memberof ThreadRepositoryPostgres
   */
  async getThreadById(id: string) {
    const query = {
      text: `SELECT threads.*, users.username
      FROM threads 
      LEFT JOIN users ON threads.owner = users.id
      WHERE threads.id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    return result.rows[0];
  }

  /**
   * @param {string} id
   */
  async verifyThreadAvailability(id: string) {
    await this.getThreadById(id);
  }
}

export default ThreadRepositoryPostgres;
