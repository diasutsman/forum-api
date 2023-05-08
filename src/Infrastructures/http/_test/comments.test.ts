const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');
const ThreadsTableTestHelper =
require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationTokenManager =
require('../../../Applications/security/AuthenticationTokenManager');
const CommentsTableTestHelper =
require('../../../../tests/CommentsTableTestHelper');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadsId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({id: 'user-123', username: 'dias'});
      await ThreadsTableTestHelper.addThread({id: 'thread-123'});
      const requestPayload = {
        content: 'content',
      };
      const token = await container
          .getInstance(AuthenticationTokenManager.name)
          .createAccessToken({id: 'user-123', username: 'dias'});
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
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
                  'tidak dapat membuat thread baru karena properti'+
                  ' yang dibutuhkan tidak ada',
              );
        });

    it(
        'should response 400 when request payload not meet data type '+
        'specification',
        async () => {
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
                  'tidak dapat membuat thread baru karena tipe data tidak '+
                  'sesuai',
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

    it('should response 403 when user not authorized', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dias',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-123',
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'content',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          Authorization: `Bearer ${await container
              .getInstance(AuthenticationTokenManager.name)
              .createAccessToken({id: 'user-321', username: 'bernard'})
          }`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message)
          .toEqual('User bukan pemilik komentar');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 and delete comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dias',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-123',
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'content',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          Authorization: `Bearer ${await container
              .getInstance(AuthenticationTokenManager.name)
              .createAccessToken({id: 'user-123', username: 'dias'})
          }`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.message).toBeDefined();
      expect(responseJson.message).not.toEqual('');
    });

    it('should response 404 when comment not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dias',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-123',
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'content',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-321',
        headers: {
          Authorization: `Bearer ${await container
              .getInstance(AuthenticationTokenManager.name)
              .createAccessToken({id: 'user-123', username: 'dias'})
          }`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Komentar tidak ditemukan');
    });

    it('should response 401 when request payload do not have authorization',
        async () => {
          // Arrange
          const server = await createServer(container);

          // Action
          const response = await server.inject({
            method: 'DELETE',
            url: '/threads/thread-123/comments/comment-123',
          });

          // Assert
          const responseJson = JSON.parse(response.payload);
          expect(response.statusCode).toEqual(401);
          expect(responseJson.message).toEqual('Missing authentication');
        });
  });
});
