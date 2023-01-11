exports.up = (pgm) => {
  pgm.createTable('users_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  /**
   * menambahkan constraint unique pada kolom comment_id dan user_id
   * agar tidak terjadi duplikasi data pada nilai keduanya
   */

  pgm.addConstraint(
      'users_likes',
      'unique_comment_id_and_user_id',
      'UNIQUE(comment_id, user_id)',
  );

  /**
 * Memberikan constraint foreign key pada kolom comment_id dan user id
 * terhadap users.id dan comments.id
 */

  pgm.addConstraint(
      'users_likes',
      'fk_users_likes.comment_id_comments.id',
      'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE',
  );
  pgm.addConstraint(
      'users_likes',
      'fk_users_likes.user_id_users.id',
      'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('users_likes');
};
