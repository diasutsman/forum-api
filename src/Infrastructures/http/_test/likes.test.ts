import pool from '../../database/postgres/pool';
import container from '../../container';
import createServer from '../createServer';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper';
import AuthenticationTokenManager from '../../../Applications/security/AuthenticationTokenManager';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper';
import UsersLikesTableTestHelper from '../../../../tests/UsersLikesTableTestHelper';

describe('/threads/{threadId}/comments/{commentId}/likes endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({id: 'user-123', username: 'dias'});
    await ThreadsTableTestHelper.addThread({id: 'thread-123'});
    await CommentsTableTestHelper.addComment({
      id: 'comment-123',
      threadId: 'thread-123',
    });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 200 and like the comment', async () => {
      // Arrange
      const token = await container
          .getInstance(AuthenticationTokenManager.name)
          .createAccessToken({id: 'user-123', username: 'dias'});
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 200 and dislike the liked comment', async () => {
      // Arrange
      await UsersLikesTableTestHelper.addUserLikes({
        userId: 'user-123',
        commentId: 'comment-123',
      });
      const token = await container
          .getInstance(AuthenticationTokenManager.name)
          .createAccessToken({id: 'user-123', username: 'dias'});
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 401 when request payload do not have authorization',
        async () => {
          // Arrange
          const server = await createServer(container);

          // Action
          const response = await server.inject({
            method: 'PUT',
            url: '/threads/thread-123/comments/comment-123/likes',
          });

          // Assert
          const responseJson = JSON.parse(response.payload);
          expect(response.statusCode).toEqual(401);
          expect(responseJson.message).toEqual('Missing authentication');
        });

    it('should response 404 when comment not found', async () => {
      // Arrange
      const server = await createServer(container);
      const token = await container
          .getInstance(AuthenticationTokenManager.name)
          .createAccessToken({id: 'user-123', username: 'dias'});

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/thread-123/comments/comment-xxx/likes`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Komentar tidak ditemukan');
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      const server = await createServer(container);
      const token = await container
          .getInstance(AuthenticationTokenManager.name)
          .createAccessToken({id: 'user-123', username: 'dias'});

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/thread-xxx/comments/comment-123/likes`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });
  });
});
