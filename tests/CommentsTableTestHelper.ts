/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool';

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123',
    content = 'content',
    owner = 'user-123',
    date = new Date().toISOString(),
    threadId = 'thread-123',
  }: {
    id?: string,
    content? : string,
    owner? : string,
    date? : string | Date,
    threadId? : string,
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5)',
      values: [id, content, owner, threadId, date],
    };

    await pool.query(query);
  },

  async findCommentsById(id: string) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows;
  },
  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

export default CommentsTableTestHelper;
