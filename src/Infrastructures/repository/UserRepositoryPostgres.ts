import RegisterUser from 'src/Domains/users/entities/RegisterUser';
import InvariantError from '../../Commons/exceptions/InvariantError';
import RegisteredUser from '../../Domains/users/entities/RegisteredUser';
import UserRepository from '../../Domains/users/UserRepository';
import { Pool } from 'pg'; 

/**
 * @class UserRepositoryPostgres
 * @extends {UserRepository}
 */
class UserRepositoryPostgres extends UserRepository {
  private _pool: any;
  private _idGenerator: () => string;
  /**
   * Creates an instance of UserRepositoryPostgres.
   * @param {Pool} pool
   * @param {nanoid} idGenerator
   * @memberof UserRepositoryPostgres
   */
  constructor(pool: Pool, idGenerator: () => string) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  /**
   * @param {string} username
   * @memberof UserRepositoryPostgres
   */
  async verifyAvailableUsername(username: string) {
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
   * @return {Promise<RegisteredUser>}
   * @memberof UserRepositoryPostgres
   */
  async addUser(registerUser: RegisterUser): Promise<RegisteredUser> {
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
   * @return {Promise<{
   *  password: string,
   * }>}
   * @memberof UserRepositoryPostgres
   */
  async getPasswordByUsername(username: string): Promise<string> {
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
   * @return {Promise<string>}
   * @memberof UserRepositoryPostgres
   */
  async getIdByUsername(username: string): Promise<string> {
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

export default UserRepositoryPostgres;
