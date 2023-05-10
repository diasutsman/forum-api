import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper';
import InvariantError from '../../../Commons/exceptions/InvariantError';
import RegisterUser from '../../../Domains/users/entities/RegisterUser';
import RegisteredUser from '../../../Domains/users/entities/RegisteredUser';
import pool from '../../database/postgres/pool';
import UserRepositoryPostgres from '../UserRepositoryPostgres';

describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyAvailableUsername function', () => {
    it('should throw InvariantError when username not available', async () => {
      // Arrange
      // memasukan user baru dengan username dicoding
      await UsersTableTestHelper.addUser({username: 'dicoding'});
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {} as any);

      // Action & Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('dicoding'))
          .rejects.toThrowError(InvariantError);
    });

    it('should not throw InvariantError when username available', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {} as any);

      // Action & Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('dicoding'))
          .resolves.not.toThrowError(InvariantError);
    });
  });

  describe('addUser function', () => {
    it('should persist register user and return registered user correctly',
        async () => {
          // Arrange
          const registerUser = new RegisterUser({
            username: 'dicoding',
            password: 'secret_password',
            fullname: 'Dicoding Indonesia',
          });
          const fakeIdGenerator = () => '123'; // stub!
          const userRepositoryPostgres = new UserRepositoryPostgres(
              pool, fakeIdGenerator,
          );

          // Action
          await userRepositoryPostgres.addUser(registerUser);

          // Assert
          const users = await UsersTableTestHelper.findUsersById('user-123');
          expect(users).toHaveLength(1);
        });

    it('should return registered user correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(
          pool, fakeIdGenerator,
      );

      // Action
      const registeredUser = await userRepositoryPostgres.addUser(registerUser);

      // Assert
      expect(registeredUser).toStrictEqual(new RegisteredUser({
        id: 'user-123',
        username: 'dicoding',
        fullname: 'Dicoding Indonesia',
      }));
    });
  });

  describe('getPasswordByUsername', () => {
    it('should throw InvariantError when user not found', () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {} as any);

      // Action & Assert
      return expect(userRepositoryPostgres.getPasswordByUsername('dicoding'))
          .rejects
          .toThrowError(InvariantError);
    });

    it('should return username password when user is found', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {} as any);
      await UsersTableTestHelper.addUser({
        username: 'dicoding',
        password: 'secret_password',
      });

      // Action & Assert
      const password = await userRepositoryPostgres.getPasswordByUsername(
          'dicoding',
      );
      expect(password).toBe('secret_password');
    });
  });

  describe('getIdByUsername', () => {
    it('should throw InvariantError when user not found', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {} as any);

      // Action & Assert
      await expect(userRepositoryPostgres.getIdByUsername('dicoding'))
          .rejects
          .toThrowError(InvariantError);
    });

    it('should return user id correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-321', username: 'dicoding',
      });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {} as any);

      // Action
      const userId = await userRepositoryPostgres.getIdByUsername('dicoding');

      // Assert
      expect(userId).toEqual('user-321');
    });
  });
});
