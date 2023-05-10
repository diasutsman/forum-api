import NotFoundError from '../../../Commons/exceptions/NotFoundError';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper';
import pool from '../../database/postgres/pool';
import CommentRepositoryPostgres from '../CommentRepositoryPostgres';
import AddComment from '../../../Domains/comments/entities/AddComment';
import AddedComment from '../../../Domains/comments/entities/AddedComment';
import DeleteComment from '../../../Domains/comments/entities/DeleteComment';
import AuthorizationError from '../../../Commons/exceptions/AuthorizationError';

describe('CommentRepositoryPostgres postgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
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
          } as any);
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
      } as any);
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
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {} as any);

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
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {} as any as any);

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
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {} as any as any);

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
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {} as any);

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyCommentExists('comment-123'))
          .resolves.not.toThrowError(NotFoundError);
    });

    it('should throw NotFoundError if comment not exists', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {} as any);

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
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {} as any);

      // Action
      const comments = await commentRepositoryPostgres
          .getThreadComments('thread-123');

      // Assert
      expect(comments).toHaveLength(1);
      comments.forEach((comment: any) => {
        expect(comment.id).toEqual('comment-123');
        expect(comment.content).toEqual('content');
        expect(comment.date.toISOString()).toEqual(date.toISOString());
        expect(comment.thread_id).toEqual('thread-123');
        expect(comment.owner).toEqual('user-123');
        expect(comment.username).toEqual('user_123');
      });
    });
  });
});
