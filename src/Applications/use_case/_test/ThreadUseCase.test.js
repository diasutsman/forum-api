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
          .mockImplementation(() => Promise.resolve(new AddedThread({
            id: 'thread-123',
            title: useCasePayload.title,
            owner: 'user-123',
          })));

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
      const dateStr = new Date().toISOString();

      const expectedThread = {
        id: threadId,
        title: 'title',
        body: 'body',
        date: dateStr,
        username: 'user_123',
        comments: [
          {
            id: 'comment-123',
            content: 'content',
            date: dateStr,
            username: 'user_123',
            replies: [
              {
                id: 'reply-123',
                content: '**balasan telah dihapus**',
                date: dateStr,
                username: 'user_123',
              },
              {
                id: 'reply-124',
                content: 'content',
                date: dateStr,
                username: 'user_123',
              },
            ],
          },
          {
            id: 'comment-124',
            content: '**komentar telah dihapus**',
            date: dateStr,
            username: 'user_123',
            replies: [],
          },
        ],
      };

      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();
      const mockReplyRepository = new ReplyRepository();
      mockThreadRepository.getThreadById = jest.fn()
          .mockImplementation(() => Promise.resolve({
            id: 'thread-123',
            title: 'title',
            body: 'body',
            date: dateStr,
            username: 'user_123',
            owner: 'user-123',
          }));
      mockCommentRepository.getThreadComments = jest.fn()
          .mockImplementation((threadId) => Promise.resolve([
            {
              id: 'comment-123',
              content: 'content',
              owner: 'user-123',
              date: dateStr,
              thread_id: 'thread-123',
              is_delete: false,
              username: 'user_123',
            },
            {
              id: 'comment-124',
              content: 'content',
              owner: 'user-123',
              date: dateStr,
              thread_id: 'thread-123',
              is_delete: true,
              username: 'user_123',
            },
          ]));
      mockReplyRepository.getCommentReplies = jest.fn()
          .mockImplementation((commentId) => Promise.resolve(
            commentId === 'comment-123' ? [
              {
                id: 'reply-123',
                content: 'content',
                owner: 'user-123',
                date: dateStr,
                thread_id: threadId,
                comment_id: 'comment-123',
                is_delete: true,
                username: 'user_123',
              },
              {
                id: 'reply-124',
                content: 'content',
                owner: 'user-123',
                date: dateStr,
                thread_id: threadId,
                comment_id: 'comment-123',
                is_delete: false,
                username: 'user_123',
              },
            ] : [],
          ));

      /** creating use case instance */
      const threadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
        replyRepository: mockReplyRepository,
      });

      // Action
      const thread = await threadUseCase.getThreadById(threadId);
      console.log(JSON.stringify(thread, null, 2));
      // Assert
      expect(thread).toStrictEqual(expectedThread);
      expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
      expect(mockCommentRepository.getThreadComments)
          .toBeCalledWith(threadId);
      expect(mockReplyRepository.getCommentReplies)
          .toBeCalledWith('comment-123');
    });
  });
});
