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
const AuthorizationError =
require('../../../Commons/exceptions/AuthorizationError');
const UsersLikesTableTestHelper =
require('../../../../tests/UsersLikesTableTestHelper');

describe('CommentRepositoryPostgres postgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await UsersLikesTableTestHelper.cleanTable();
  });

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'user_123',
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
      expect(comments[0].is_delete).toEqual(true);
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

    it('should throw AuthorizationError if comment not owned', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      const deleteComment = new DeleteComment({
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-321',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(commentRepositoryPostgres.deleteComment(deleteComment))
          .rejects.toThrowError(AuthorizationError);
    });
  });

  describe('verifyCommentExists function', () => {
    it('should not throw NotFoundError if comment exists', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyCommentExists('comment-123'))
          .resolves.not.toThrowError(NotFoundError);
    });

    it('should throw NotFoundError if comment not exists', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyCommentExists('comment-123'))
          .rejects.toThrowError(NotFoundError);
    });
  });

  describe('getThreadComments function', () => {
    it('should return comments correctly', async () => {
      // Arrange
      const date = new Date();
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'content',
        date: date,
        threadId: 'thread-123',
        owner: 'user-123',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres
          .getThreadComments('thread-123');

      // Assert
      expect(comments).toHaveLength(1);
      comments.forEach((comment) => {
        expect(comment.id).toEqual('comment-123');
        expect(comment.content).toEqual('content');
        expect(comment.date.toISOString()).toEqual(date.toISOString());
        expect(comment.thread_id).toEqual('thread-123');
        expect(comment.owner).toEqual('user-123');
        expect(comment.username).toEqual('user_123');
      });
    });
  });

  describe('toggleLike function', () => {
    it('should like comment when it is not liked', async () => {
      // Arrange
      const date = new Date();
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'content',
        date: date,
        threadId: 'thread-123',
        owner: 'user-123',
      });
      const idGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool, idGenerator,
      );

      // Action
      await commentRepositoryPostgres.toggleLike({
        commentId: 'comment-123',
        userId: 'user-123',
      });

      // Assert
      const commentLikes = await UsersLikesTableTestHelper
          .findUsersLikesByCommentId('comment-123');
      const userLikes = await UsersLikesTableTestHelper
          .findUsersLikesByUserId('user-123');

      expect(commentLikes).toHaveLength(1);
      expect(userLikes).toHaveLength(1);
    });
    it('should dislike comment when it is liked', async () => {
      // Arrange
      const date = new Date();
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'content',
        date: date,
        threadId: 'thread-123',
        owner: 'user-123',
      });
      await UsersLikesTableTestHelper.addUserLikes({
        userId: 'user-123',
        commentId: 'comment-123',
      });
      const idGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool, idGenerator,
      );

      // Action
      await commentRepositoryPostgres.toggleLike({
        commentId: 'comment-123',
        userId: 'user-123',
      });

      // Assert
      const commentLikes = await UsersLikesTableTestHelper
          .findUsersLikesByCommentId('comment-123');
      const userLikes = await UsersLikesTableTestHelper
          .findUsersLikesByUserId('user-123');

      expect(commentLikes).toHaveLength(0);
      expect(userLikes).toHaveLength(0);
    });
  });
});
