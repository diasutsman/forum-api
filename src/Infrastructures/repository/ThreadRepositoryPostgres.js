const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
class ThreadRepositoryPostgres extends ThreadRepository {
  /**
   * @param {import('../../Infrastructures/database/postgres/pool')} pool 
   * @param {import('nanoid')} idGenerator 
   */
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(addThread) {
    const id = `thread-${this._idGenerator()}`;
    const { title, body, owner, date } = addThread;
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, body, owner',
      values: [id, title, body, date, owner],
    };
    const result = await this._pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async getThreadById(id) {
    const query = {
      text: `SELECT threads.id, title, body, threads.date, users.username
      FROM threads 
      LEFT JOIN users ON threads.owner = users.id
      WHERE threads.id = $1`,
      values: [id],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan')
    }

    return result.rows[0]
  }
}

module.exports = ThreadRepositoryPostgres;
