const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CommentsTableTestHelper =
require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper =
require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const DeleteComment =
require('../../../Domains/comments/entities/DeleteComment');

describe('CommentRepositoryPostgres postgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-123',
    });
    await ThreadsTableTestHelper.addThread({
      id: 'thread-123',
      owner: 'user-123',
    });
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment and return added comment correctly',
        async () => {
          // Arrange
          const addComment = new AddComment({
            content: 'content',
            owner: 'user-123',
            threadId: 'thread-123',
          });
          const fakeIdGenerator = () => '123';
          const commentRepositoryPostgres = new CommentRepositoryPostgres(
              pool,
              fakeIdGenerator,
          );

          // Action
          await commentRepositoryPostgres.addComment(addComment);

          // Assert
          const comments = await CommentsTableTestHelper
              .findCommentsById('comment-123');
          expect(comments).toHaveLength(1);
        });

    it('should return added comment correctly', async () => {
      // Arrange
      const addComment = new AddComment({
        content: 'content',
        owner: 'user-123',
        threadId: 'thread-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          fakeIdGenerator,
      );

      // Action
      const addedComment = await commentRepositoryPostgres
          .addComment(addComment);

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        'id': 'comment-123',
        'content': 'content',
        'owner': 'user-123',
      }));
    });
  });

  describe('deleteComment function', () => {
    it('should delete comment if comment found', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      const deleteComment = new DeleteComment({
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteComment(deleteComment);

      // Assert
      const comments = await CommentsTableTestHelper
          .findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
      expect(comments[0].is_delete).toBeTruthy();
    });

    it('should throw NotFoundError if comment not found', async () => {
      // Arrange
      const deleteComment = new DeleteComment({
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(commentRepositoryPostgres.deleteComment(deleteComment))
          .rejects.toThrowError(NotFoundError);
    });
  });
});
