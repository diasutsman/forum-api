/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool';

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123',
    content = 'content',
    owner = 'user-123',
    date = new Date().toISOString(),
    threadId = 'thread-123',
    commentId = 'comment-123',
  }: {
    id?: string;
    content?: string;
    owner?: string;
    date?: string | Date;
    threadId?: string;
    commentId?: string;
  }) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, content, owner, threadId, commentId, date],
    };

    await pool.query(query);
  },

  async findRepliesById(id: string) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows;
  },
  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

export default RepliesTableTestHelper;
