const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');
const ThreadsTableTestHelper =
require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper =
require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper =
require('../../../../tests/RepliesTableTestHelper');
const AuthenticationTokenManager =
require('../../../Applications/security/AuthenticationTokenManager');

describe('/threads/{threadsId}/comments/{commentsId}/replies endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  describe('when POST the endpoint', () => {
    it('should response 201 and persisted reply', async () => {
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
        threadId: 'thread-123',
      });

      const requestPayload = {
        content: 'content',
      };

      const accessToken = await container
          .getInstance(AuthenticationTokenManager.name)
          .createAccessToken({id: 'user-123', username: 'dias'});

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(typeof responseJson.data.addedReply).toEqual('object');
      expect(responseJson.data.addedReply.id).toEqual(expect.any(String));
      expect(responseJson.data.addedReply.content)
          .toEqual(requestPayload.content);
      expect(responseJson.data.addedReply.owner).toEqual('user-123');
    });

    it('should response 400 when request payload not contain needed property',
        async () => {
          // Arrange
          await UsersTableTestHelper.addUser({
            id: 'user-123',
            username: 'dias',
          });

          await ThreadsTableTestHelper.addThread({id: 'thread-123'});
          await CommentsTableTestHelper.addComment({
            id: 'comment-123',
            threadId: 'thread-123',
          });

          const requestPayload = {};

          const accessToken = await container
              .getInstance(AuthenticationTokenManager.name)
              .createAccessToken({id: 'user-123', username: 'dias'});

          const server = await createServer(container);

          // Action
          const response = await server.inject({
            method: 'POST',
            url: '/threads/thread-123/comments/comment-123/replies',
            payload: requestPayload,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          // Assert
          const responseJson = JSON.parse(response.payload);
          expect(response.statusCode).toEqual(400);
          expect(responseJson.status).toEqual('fail');
          expect(responseJson.message)
              .toEqual(
                  'tidak dapat menambahkan komentar baru karena properti '+
                  'yang dibutuhkan tidak ada',
              );
        });

    it('should response 404 when thread not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dias',
      });

      await ThreadsTableTestHelper.addThread({id: 'thread-123'});
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
      });

      const requestPayload = {
        content: 'content',
      };

      const accessToken = await container
          .getInstance(AuthenticationTokenManager.name)
          .createAccessToken({id: 'user-123', username: 'dias'});

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-321/comments/comment-123/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 404 when comment not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dias',
      });

      await ThreadsTableTestHelper.addThread({id: 'thread-123'});

      const requestPayload = {
        content: 'content',
      };

      const accessToken = await container
          .getInstance(AuthenticationTokenManager.name)
          .createAccessToken({id: 'user-123', username: 'dias'});

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Komentar tidak ditemukan');
    });

    it('should response 401 when request with no authentication', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({id: 'user-123'});
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
      });

      const requestPayload = {
        content: 'content',
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });
  });

  describe('when DELETE the endpoint with /{replyId}', () => {
    it('should response 200 and delete reply', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dias',
      });

      await ThreadsTableTestHelper.addThread({id: 'thread-123'});
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
      });

      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        commentId: 'comment-123',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const requestPayload = {
        content: 'content',
      };

      const accessToken = await container
          .getInstance(AuthenticationTokenManager.name)
          .createAccessToken({id: 'user-123', username: 'dias'});

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.message).toEqual('berhasil menghapus balasan');
    });

    it('should response 404 when thread not found', async () => {
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
        threadId: 'thread-123',
        owner: 'user-123',
      });

      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        commentId: 'comment-123',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const requestPayload = {
        content: 'content',
      };

      const accessToken = await container
          .getInstance(AuthenticationTokenManager.name)
          .createAccessToken({id: 'user-123', username: 'dias'});

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-312/comments/comment-123/replies/reply-123',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 404 when comment not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dias',
      });

      await ThreadsTableTestHelper.addThread({id: 'thread-123'});
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
      });

      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        commentId: 'comment-123',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const requestPayload = {
        content: 'content',
      };

      const accessToken = await container
          .getInstance(AuthenticationTokenManager.name)
          .createAccessToken({id: 'user-123', username: 'dias'});

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-321/replies/reply-123',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Komentar tidak ditemukan');
    });

    it('should response 404 when reply not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dias',
      });

      await ThreadsTableTestHelper.addThread({id: 'thread-123'});
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
      });

      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        commentId: 'comment-123',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const requestPayload = {
        content: 'content',
      };

      const accessToken = await container
          .getInstance(AuthenticationTokenManager.name)
          .createAccessToken({id: 'user-123', username: 'dias'});

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-321',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Balasan tidak ditemukan');
    });

    it('should response 401 when request not contain access token',
        async () => {
          // Arrange
          await UsersTableTestHelper.addUser({
            id: 'user-123',
            username: 'dias',
          });

          await ThreadsTableTestHelper.addThread({id: 'thread-123'});
          await CommentsTableTestHelper.addComment({
            id: 'comment-123',
            threadId: 'thread-123',
          });

          await RepliesTableTestHelper.addReply({
            id: 'reply-123',
            commentId: 'comment-123',
            owner: 'user-123',
            threadId: 'thread-123',
          });

          const requestPayload = {
            content: 'content',
          };

          const server = await createServer(container);

          // Action
          const response = await server.inject({
            method: 'DELETE',
            url: '/threads/thread-123/comments/comment-123/replies/reply-123',
            payload: requestPayload,
          });

          // Assert
          const responseJson = JSON.parse(response.payload);
          expect(response.statusCode).toEqual(401);
          expect(responseJson.message).toEqual('Missing authentication');
        });

    it('should response 403 when user is not owner', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dias',
      });

      await ThreadsTableTestHelper.addThread({id: 'thread-123'});
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
      });

      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        commentId: 'comment-123',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const requestPayload = {
        content: 'content',
      };

      const accessToken = await container
          .getInstance(AuthenticationTokenManager.name)
          .createAccessToken({id: 'user-321', username: 'dias'});

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message)
          .toEqual('Anda tidak berhak mengakses balasan ini');
    });
  });
});
