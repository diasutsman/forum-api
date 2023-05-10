/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool';

const ThreadsTableTestHelper = {
  async addThread({
    id = 'thread-123',
    title = 'title',
    body = 'body',
    date = new Date().toISOString(),
    owner = 'user-123',
  }: {
    id?: string;
    title?: string;
    body?: string;
    date?: string | Date;
    owner?: string;
  }) {
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5)',
      values: [id, title, body, owner, date],
    };

    await pool.query(query);
  },

  async findThreadsById(id: string) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows;
  },
  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
};

export default ThreadsTableTestHelper;
