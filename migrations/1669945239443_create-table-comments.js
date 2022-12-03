/* eslint-disable camelcase */

exports.up = pgm => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    date: {
      type: 'TEXT',
      notNull: true,
    },
    thread_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  // add thread_id as foreign key to thread id
  pgm.addConstraint('comments',
    'fk_comments.thread_id_threads.id',
    'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE',
  )
};

exports.down = pgm => { 
  pgm.dropTable('comments');
};
