const CommentRepository =
require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadUseCase = require('../ThreadUseCase');

describe('ThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu
   * mengoskestrasikan langkah demi langkah dengan benar.
   */
  describe('addThread function', () => {
    it('should orchestrating the add thread action correctly', async () => {
      // Arrange
      const useCasePayload = {
        title: 'title',
        body: 'body',
        owner: 'user-123',
        date: new Date().toISOString(),
      };
      const expectedAddedThread = new AddedThread({
        id: 'thread-123',
        title: useCasePayload.title,
        owner: 'user-123',
      });

      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository();

      /** mocking needed function */
      mockThreadRepository.addThread = jest.fn()
          .mockImplementation(() => Promise.resolve(expectedAddedThread));

      /** creating use case instance */
      const threadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository,
      });

      // Action
      const addedThread = await threadUseCase.addThread(useCasePayload);

      // Assert
      expect(addedThread).toStrictEqual(expectedAddedThread);
      expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
        owner: useCasePayload.owner,
        date: useCasePayload.date,
      }));
    });
  });

  describe('getThreadById function', () => {
    it('should orchestrating the get detail thread correctly', async () => {
      // Arrange
      const threadId = 'thread-123';
      const expectedAddedThread = new AddedThread({
        id: threadId,
        title: 'title',
        body: 'body',
        date: new Date().toISOString(),
        owner: 'user-123',
      });
      const expectedReplies = [
        {
          id: 'reply-123',
          content: 'content',
          owner: 'user-123',
        },
      ];
      const expectedComments = [
        {
          id: 'comment-123',
          content: 'content',
          date: new Date().toISOString(),
          owner: 'user-123',
          replies: expectedReplies,
        },
      ];

      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();
      const mockReplyRepository = new ReplyRepository();
      mockThreadRepository.getThreadById = jest.fn()
          .mockImplementation(() => Promise.resolve(expectedAddedThread));
      mockCommentRepository.getThreadComments = jest.fn()
          .mockImplementation(() => Promise.resolve(expectedComments));
      mockCommentRepository.getThreadComments = jest.fn()
          .mockImplementation(() => Promise.resolve(expectedComments));
      mockReplyRepository.getCommentReplies = jest.fn()
          .mockImplementation(() => Promise.resolve(expectedReplies));

      /** creating use case instance */
      const threadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
        replyRepository: mockReplyRepository,
      });

      // Action
      const addedThread = await threadUseCase.getThreadById(threadId);

      // Assert
      expect(addedThread).toStrictEqual(expectedAddedThread);
      expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
      expect(mockCommentRepository.getThreadComments)
          .toBeCalledWith(threadId);
      expect(mockReplyRepository.getCommentReplies)
          .toBeCalledWith(expectedComments[0].id);
    });
  });
});
