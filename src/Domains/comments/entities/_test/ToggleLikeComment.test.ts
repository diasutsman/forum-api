import ToggleLikeComment from '../ToggleLikeComment';

describe('ToggleLikeComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      userId: 'user-123',
    };

    // Action & Assert
    expect(() => new ToggleLikeComment(payload as any))
        .toThrowError('TOGGLE_LIKE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: true,
      commentId: 123,
      userId: ['user-123'],
    };

    // Action & Assert
    expect(() => new ToggleLikeComment(payload as any))
        .toThrowError('TOGGLE_LIKE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create ToggleLikeComment entities correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    // Action
    const toggleLikeComment = new ToggleLikeComment(payload);

    // Assert
    expect(toggleLikeComment).toBeInstanceOf(ToggleLikeComment);
    expect(toggleLikeComment.threadId).toEqual(payload.threadId);
    expect(toggleLikeComment.commentId).toEqual(payload.commentId);
    expect(toggleLikeComment.userId).toEqual(payload.userId);
  });
});
