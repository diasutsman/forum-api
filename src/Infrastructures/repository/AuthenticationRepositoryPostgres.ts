/**
 * @typedef {import('../database/postgres/pool')} Pool
 */
const InvariantError = require('../../Commons/exceptions/InvariantError');
const AuthenticationRepository =
require('../../Domains/authentications/AuthenticationRepository');

/**
 * @class AuthenticationRepositoryPostgres
 * @extends {AuthenticationRepository}
 */
class AuthenticationRepositoryPostgres extends AuthenticationRepository {
  /**
   * Creates an instance of AuthenticationRepositoryPostgres.
   * @param {Pool} pool
   * @memberof AuthenticationRepositoryPostgres
   */
  constructor(pool) {
    super();
    this._pool = pool;
  }

  /**
   * @param {string} token
   * @memberof AuthenticationRepositoryPostgres
   */
  async addToken(token) {
    const query = {
      text: 'INSERT INTO authentications VALUES ($1)',
      values: [token],
    };

    await this._pool.query(query);
  }

  /**
   * @param {string} token
   * @memberof AuthenticationRepositoryPostgres
   */
  async checkAvailabilityToken(token) {
    const query = {
      text: 'SELECT * FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new InvariantError('refresh token tidak ditemukan di database');
    }
  }

  /**
   * @param {string} token
   * @memberof AuthenticationRepositoryPostgres
   */
  async deleteToken(token) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };

    await this._pool.query(query);
  }
}

module.exports = AuthenticationRepositoryPostgres;
