const CommentRepository =
  require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const DeleteComment =
  require('../../../Domains/comments/entities/DeleteComment');
const CommentUseCase = require('../CommentUseCase');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('CommentUseCase', () => {
  /**
   * Menguji apakah use case mampu
   * mengoskestrasikan langkah demi langkah dengan benar.
   */
  describe('addComment function', () => {
    it('should orchestrating the add comment action correctly', async () => {
      // Arrange
      const useCasePayload = {
        content: 'content',
        threadId: 'thread-123',
        owner: 'user-123',
        date: new Date().toISOString(),
      };
      const expectedAddedComment = new AddedComment({
        id: 'comment-123',
        content: 'content',
        owner: 'user-123',
      });

      /** creating dependency of use case */
      const mockCommentRepository = new CommentRepository();
      const mockThreadRepository = new ThreadRepository();

      /** mocking needed function */
      mockCommentRepository.addComment = jest.fn()
          .mockImplementation(() => Promise.resolve(new AddedComment({
            id: 'comment-123',
            content: 'content',
            owner: 'user-123',
          })));
      mockThreadRepository.verifyThreadAvailability = jest.fn()
          .mockImplementation(() => Promise.resolve());

      /** creating use case instance */
      const commentUseCase = new CommentUseCase({
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
      });

      // Action
      const addedComment = await commentUseCase.addComment(useCasePayload);

      // Assert
      expect(addedComment).toStrictEqual(expectedAddedComment);
      expect(mockCommentRepository.addComment).toBeCalledWith(new AddComment({
        content: useCasePayload.content,
        threadId: useCasePayload.threadId,
        owner: useCasePayload.owner,
        date: useCasePayload.date,
      }));
      expect(mockThreadRepository.verifyThreadAvailability)
          .toBeCalledWith(useCasePayload.threadId);
    });

    it('should orchestrating the add comment action correctly ' +
      'but thread not found',
    async () => {
      // Arrange
      const useCasePayload = {
        content: 'content',
        threadId: 'thread-404',
        owner: 'user-123',
        date: new Date().toISOString(),
      };

      /** creating dependency of use case */
      const mockCommentRepository = new CommentRepository();
      const mockThreadRepository = new ThreadRepository();

      /** mocking needed function */
      mockThreadRepository.verifyThreadAvailability = jest.fn()
          .mockImplementation(() => {
            throw new NotFoundError('thread tidak ditemukan');
          });

      /** creating use case instance */
      const commentUseCase = new CommentUseCase({
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
      });

      // Action & Assert
      await expect(commentUseCase.addComment(useCasePayload))
          .rejects.toThrowError('thread tidak ditemukan');
      expect(mockThreadRepository.verifyThreadAvailability)
          .toBeCalledWith(useCasePayload.threadId);
    });
  });

  describe('deleteComment function', () => {
    it('should orchestrating the delete comment action correctly', async () => {
      // Arrange
      const useCasePayload = {
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
      };

      /** creating dependency of use case */
      const mockCommentRepository = new CommentRepository();
      const mockThreadRepository = new ThreadRepository();

      /** mocking needed function */
      mockCommentRepository.deleteComment = jest.fn()
          .mockImplementation(() => Promise.resolve());
      mockThreadRepository.verifyThreadAvailability = jest.fn()
          .mockImplementation(() => Promise.resolve());

      /** creating use case instance */
      const commentUseCase = new CommentUseCase({
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
      });

      // Action
      await commentUseCase.deleteComment(useCasePayload);

      // Assert
      expect(mockCommentRepository.deleteComment)
          .toBeCalledWith(new DeleteComment({
            threadId: useCasePayload.threadId,
            commentId: useCasePayload.commentId,
            owner: useCasePayload.owner,
          }));
      expect(mockThreadRepository.verifyThreadAvailability)
          .toBeCalledWith(useCasePayload.threadId);
    });

    it('should orchestrating the delete comment action correctly'+
    'but thread not found',
    async () => {
      // Arrange
      const useCasePayload = {
        content: 'content',
        threadId: 'thread-404',
        owner: 'user-123',
        date: new Date().toISOString(),
      };

      /** creating dependency of use case */
      const mockCommentRepository = new CommentRepository();
      const mockThreadRepository = new ThreadRepository();

      /** mocking needed function */
      mockThreadRepository.verifyThreadAvailability = jest.fn()
          .mockImplementation(() => {
            throw new NotFoundError('thread tidak ditemukan');
          });

      /** creating use case instance */
      const commentUseCase = new CommentUseCase({
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
      });

      // Action & Assert
      await expect(commentUseCase.deleteComment(useCasePayload))
          .rejects.toThrowError('thread tidak ditemukan');
      expect(mockThreadRepository.verifyThreadAvailability)
          .toBeCalledWith(useCasePayload.threadId);
    });
  });
});
