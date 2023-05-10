import { Pool } from 'pg';

import InvariantError from '../../Commons/exceptions/InvariantError';
import AuthenticationRepository from '../../Domains/authentications/AuthenticationRepository';

/**
 * @class AuthenticationRepositoryPostgres
 * @extends {AuthenticationRepository}
 */
class AuthenticationRepositoryPostgres extends AuthenticationRepository {
  private _pool: any;
  /**
   * Creates an instance of AuthenticationRepositoryPostgres.
   * @param {Pool} pool
   * @memberof AuthenticationRepositoryPostgres
   */
  constructor(pool: Pool) {
    super();
    this._pool = pool;
  }

  /**
   * @param {string} token
   * @memberof AuthenticationRepositoryPostgres
   */
  async addToken(token: string) {
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
  async checkAvailabilityToken(token: string) {
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
  async deleteToken(token: string) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };

    await this._pool.query(query);
  }
}

export default AuthenticationRepositoryPostgres;
