const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');
const ThreadsTableTestHelper =
require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationTokenManager =
require('../../../Applications/security/AuthenticationTokenManager');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted threads', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({id: 'user-123', username: 'dias'});
      const requestPayload = {
        title: 'title',
        body: 'body',
      };
      const token = await container
          .getInstance(AuthenticationTokenManager.name)
          .createAccessToken({id: 'user-123', username: 'dias'});
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property',
        async () => {
          // Arrange
          await UsersTableTestHelper.addUser({
            id: 'user-123',
            username: 'dias',
          });
          const requestPayload = {
            title: 'title',
          };
          const server = await createServer(container);

          // Action
          const response = await server.inject({
            method: 'POST',
            url: '/threads',
            payload: requestPayload,
            headers: {
              Authorization: `Bearer ${await container
                  .getInstance(AuthenticationTokenManager.name)
                  .createAccessToken({id: 'user-123', username: 'dias'})
              }`,
            },
          });

          // Assert
          const responseJson = JSON.parse(response.payload);
          expect(response.statusCode).toEqual(400);
          expect(responseJson.status).toEqual('fail');
          expect(responseJson.message)
              .toEqual(
                  'tidak dapat membuat thread baru karena properti yang '+
                  'dibutuhkan tidak ada',
              );
        });

    it('should response 400 when request payload not meet '+
    'data type specification', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dias',
      });
      const requestPayload = {
        title: 'title',
        body: ['body'],
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${await container
              .getInstance(AuthenticationTokenManager.name)
              .createAccessToken({id: 'user-123', username: 'dias'})
          }`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message)
          .toEqual(
              'tidak dapat membuat thread baru karena tipe data tidak sesuai',
          );
    });

    it('should response 401 when request payload do not have authorization',
        async () => {
          // Arrange
          const server = await createServer(container);

          // Action
          const response = await server.inject({
            method: 'POST',
            url: '/threads',
          });

          // Assert
          const responseJson = JSON.parse(response.payload);
          expect(response.statusCode).toEqual(401);
          expect(responseJson.message).toEqual('Missing authentication');
        });
  });

  describe('when GET /threads{id}', () => {
    it('should response 200 and thread', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'user_123',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'title',
        body: 'body',
        owner: 'user-123',
      });
      const threadId = 'thread-123';

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.id).toEqual(threadId);
      expect(responseJson.data.thread.title).toEqual('title');
      expect(responseJson.data.thread.body).toEqual('body');
      expect(responseJson.data.thread.username).toEqual('user_123');
      expect(typeof responseJson.data.thread.date).toEqual('string');
      expect(responseJson.data.thread.comments).toBeInstanceOf(Array);
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      const threadId = 'thread-123';
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });
  });
});
