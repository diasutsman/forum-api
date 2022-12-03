/* eslint-disable camelcase */

/**
 * @param {import('node-pg-migrate').} pgm
 */
exports.up = pgm => {
  pgm.addColumn('comments', {
    is_delete: {
      type: 'BOOLEAN',
    }
  })

  pgm.sql('ALTER TABLE comments ALTER COLUMN is_delete set default false')
};

exports.down = pgm => {
  pgm.dropColumn('comments', 'is_delete')
};
