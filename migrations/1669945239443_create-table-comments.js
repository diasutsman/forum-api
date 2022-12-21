

exports.up = (pgm) => {
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
    thread_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    date: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    is_delete: {
      type: 'BOOLEAN',
      default: false,
    },
  });

  // add thread_id as foreign key to thread id
  pgm.addConstraint('comments',
      'fk_comments.thread_id_threads.id',
      'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE',
  );

  // add owner as foreign key to user id
  pgm.addConstraint('comments',
      'fk_comments.owner_users.id',
      'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('comments');
};
