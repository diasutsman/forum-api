const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CommentsTableTestHelper =
require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper =
require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const RepliesTableTestHelper =
require('../../../../tests/RepliesTableTestHelper');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const DeleteReply = require('../../../Domains/replies/entities/DeleteReply');
const AuthorizationError =
require('../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepositoryPostgres postgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
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
    await CommentsTableTestHelper.addComment({
      id: 'comment-123',
    });
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist add reply and return added reply correctly',
        async () => {
          // Arrange
          const addReply = new AddReply({
            content: 'content',
            owner: 'user-123',
            threadId: 'thread-123',
            commentId: 'comment-123',
          });
          const fakeIdGenerator = () => '123';
          const replyRepositoryPostgres = new ReplyRepositoryPostgres(
              pool,
              fakeIdGenerator,
          );

          // Action
          await replyRepositoryPostgres.addReply(addReply);

          // Assert
          const comments = await RepliesTableTestHelper
              .findRepliesById('reply-123');
          expect(comments).toHaveLength(1);
        });

    it('should return added comment correctly', async () => {
      // Arrange
      const addReply = new AddReply({
        content: 'content',
        owner: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new ReplyRepositoryPostgres(
          pool,
          fakeIdGenerator,
      );

      // Action
      const addedReply = await commentRepositoryPostgres.addReply(addReply);

      // Assert
      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: 'content',
        owner: 'user-123',
      }));
    });
  });

  describe('deleteComment function', () => {
    it('should delete comment if comment found', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
      });
      const deleteReply = new DeleteReply({
        threadId: 'thread-123',
        commentId: 'comment-123',
        replyId: 'reply-123',
        owner: 'user-123',
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      await replyRepositoryPostgres.deleteReply(deleteReply);

      // Assert
      const comments = await RepliesTableTestHelper
          .findRepliesById('reply-123');
      expect(comments).toHaveLength(1);
      expect(comments[0].is_delete).toEqual(true);
    });

    it('should throw NotFoundError if comment not found', async () => {
      // Arrange
      const deleteComment = new DeleteReply({
        threadId: 'thread-123',
        commentId: 'comment-123',
        replyId: 'reply-123',
        owner: 'user-123',
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(replyRepositoryPostgres.deleteReply(deleteComment))
          .rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError if comment not owned by user',
        async () => {
          // Arrange
          await RepliesTableTestHelper.addReply({
            id: 'reply-123',
            owner: 'user-123',
          });
          const deleteComment = new DeleteReply({
            threadId: 'thread-123',
            commentId: 'comment-123',
            replyId: 'reply-123',
            owner: 'user-456',
          });
          const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

          // Action and Assert
          await expect(replyRepositoryPostgres.deleteReply(deleteComment))
              .rejects.toThrowError(AuthorizationError);
        },
    );
  });

  describe('getCommentReplies function', () => {
    it('should return replies correctly', async () => {
      // Arrange
      const dateStr = new Date().toISOString();
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        content: 'reply',
        owner: 'user-123',
        date: dateStr,
        commentId: 'comment-123',
        threadId: 'thread-123',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const replies = await replyRepositoryPostgres.getCommentReplies(
          'comment-123',
      );

      // Assert

      expect(replies).toHaveLength(1);
      replies.forEach((reply) => {
        expect(reply.id).toEqual('reply-123');
        expect(reply.content).toEqual('reply');
        expect(reply.owner).toBe('user-123');
        expect(reply.date).toEqual(dateStr);
        expect(reply.comment_id).toEqual('comment-123');
        expect(reply.thread_id).toEqual('thread-123');
        expect(reply.is_delete).toEqual(false);
      });
    });
  });
});
