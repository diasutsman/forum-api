const ReplyUseCase = require('../ReplyUseCase');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository =
    require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const DeleteReply = require('../../../Domains/replies/entities/DeleteReply');

describe('ReplyUseCase', () => {
  /**
   * Menguji apakah use case mampu
   * mengoskestrasikan langkah demi langkah dengan benar.
   */
  describe('addReply function', () => {
    it('should orchestrating the add reply action correctly', async () => {
      // Arrange
      const useCasePayload = {
        threadId: 'thread-123',
        commentId: 'comment-123',
        content: 'content',
        owner: 'user-123',
        date: new Date().toISOString(),
      };
      const expectedAddedReply = new AddedReply({
        id: 'comment-123',
        content: 'content',
        owner: 'user-123',
      });

      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();
      const mockReplyRepository = new ReplyRepository();

      /** mocking needed function */
      mockReplyRepository.addReply = jest.fn()
          .mockImplementation(() => Promise.resolve(new AddedReply({
            id: 'comment-123',
            content: 'content',
            owner: 'user-123',
          })));
      mockCommentRepository.verifyCommentExists = jest.fn()
          .mockImplementation(() => Promise.resolve());
      mockThreadRepository.verifyThreadAvailability = jest.fn()
          .mockImplementation(() => Promise.resolve());

      /** creating use case instance */
      const replyUseCase = new ReplyUseCase({
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
        replyRepository: mockReplyRepository,
      });

      // Action
      const addedReply = await replyUseCase.addReply(useCasePayload);

      // Assert
      expect(addedReply).toStrictEqual(expectedAddedReply);
      expect(mockReplyRepository.addReply).toBeCalledWith(new AddReply({
        threadId: useCasePayload.threadId,
        commentId: useCasePayload.commentId,
        content: useCasePayload.content,
        owner: useCasePayload.owner,
        date: useCasePayload.date,
      }));
      expect(mockThreadRepository.verifyThreadAvailability)
          .toBeCalledWith(useCasePayload.threadId);
      expect(mockCommentRepository.verifyCommentExists)
          .toBeCalledWith(useCasePayload.commentId);
    });
  });

  describe('deleteReply', () => {
    it('should orchestrating the delete reply action correctly', async () => {
      // Arrange
      const useCasePayload = {
        threadId: 'thread-123',
        commentId: 'comment-123',
        replyId: 'reply-123',
        owner: 'user-123',
      };

      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();
      const mockReplyRepository = new ReplyRepository();

      /** mocking needed function */
      mockReplyRepository.deleteReply = jest.fn()
          .mockImplementation(() => Promise.resolve());
      mockCommentRepository.verifyCommentExists = jest.fn()
          .mockImplementation(() => Promise.resolve());
      mockThreadRepository.verifyThreadAvailability = jest.fn()
          .mockImplementation(() => Promise.resolve());

      /** creating use case instance */
      const replyUseCase = new ReplyUseCase({
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
        replyRepository: mockReplyRepository,
      });

      // Action
      await replyUseCase.deleteReply(useCasePayload);

      // Assert
      expect(mockReplyRepository.deleteReply).toBeCalledWith(new DeleteReply({
        threadId: useCasePayload.threadId,
        commentId: useCasePayload.commentId,
        replyId: useCasePayload.replyId,
        owner: useCasePayload.owner,
      }));
      expect(mockThreadRepository.verifyThreadAvailability)
          .toBeCalledWith(useCasePayload.threadId);
      expect(mockCommentRepository.verifyCommentExists)
          .toBeCalledWith(useCasePayload.commentId);
    });
  });
});
