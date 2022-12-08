const ThreadsTableTestHelper =
require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

describe('ThreadRepositoryPostgres postgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread and return added thread correctly',
        async () => {
          // Arrange
          const addThread = new AddThread({
            title: 'title',
            body: 'body',
            owner: 'user-123',
          });
          const fakeIdGenerator = () => '123';
          const threadRepositoryPostgres = new ThreadRepositoryPostgres(
              pool,
              fakeIdGenerator,
          );

          // Action
          await threadRepositoryPostgres.addThread(addThread);

          // Assert
          const threads = await ThreadsTableTestHelper
              .findThreadsById('thread-123');
          expect(threads).toHaveLength(1);
        });

    it('should return added thread correctly', async () => {
      // Arrange
      const addThread = new AddThread({
        title: 'title',
        body: 'body',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
          pool,
          fakeIdGenerator,
      );

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(addThread);

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'title',
        body: 'body',
        owner: 'user-123',
      }));
    });
  });

  describe('getThreadById function', () => {
    it('should throw error when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById('thread-123'))
          .rejects
          .toThrowError(NotFoundError);
    });

    it('should return thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'title',
        body: 'body',
        owner: 'user-123',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepositoryPostgres.getThreadById('thread-123');

      // Assert
      expect(thread.id).toEqual('thread-123');
      expect(thread.title).toEqual('title');
      expect(thread.body).toEqual('body');
      expect(thread.username).toEqual('dicoding');
    });
  });
});
