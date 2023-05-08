/**
 * @typedef {import('../../Infrastructures/database/postgres/pool')} Pool
 * @typedef {import('nanoid')} nanoid
 * @typedef {import('../../Domains/users/entities/RegisterUser')} RegisterUser
 * @typedef {import('../../Domains/users/entities/RegisteredUser')
 * } RegisteredUser
 */
const InvariantError = require('../../Commons/exceptions/InvariantError');
const RegisteredUser = require('../../Domains/users/entities/RegisteredUser');
const UserRepository = require('../../Domains/users/UserRepository');

/**
 * @class UserRepositoryPostgres
 * @extends {UserRepository}
 */
class UserRepositoryPostgres extends UserRepository {
  /**
   * Creates an instance of UserRepositoryPostgres.
   * @param {Pool} pool
   * @param {nanoid} idGenerator
   * @memberof UserRepositoryPostgres
   */
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  /**
   * @param {string} username
   * @memberof UserRepositoryPostgres
   */
  async verifyAvailableUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rowCount) {
      throw new InvariantError('username tidak tersedia');
    }
  }

  /**
   * @param {RegisterUser} registerUser
   * @return {RegisteredUser}
   * @memberof UserRepositoryPostgres
   */
  async addUser(registerUser) {
    const {username, password, fullname} = registerUser;
    const id = `user-${this._idGenerator()}`;

    const query = {
      text: `
        INSERT INTO users VALUES($1, $2, $3, $4) 
        RETURNING id, username, fullname
      `,
      values: [id, username, password, fullname],
    };

    const result = await this._pool.query(query);

    return new RegisteredUser({...result.rows[0]});
  }

  /**
   * @param {string} username
   * @return {{
   *  password: string,
   * }}
   * @memberof UserRepositoryPostgres
   */
  async getPasswordByUsername(username) {
    const query = {
      text: 'SELECT password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('username tidak ditemukan');
    }

    return result.rows[0].password;
  }

  /**
   * @param {string} username
   * @return {string}
   * @memberof UserRepositoryPostgres
   */
  async getIdByUsername(username) {
    const query = {
      text: 'SELECT id FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('user tidak ditemukan');
    }

    const {id} = result.rows[0];

    return id;
  }
}

module.exports = UserRepositoryPostgres;
