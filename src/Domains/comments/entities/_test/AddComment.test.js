const AddComment = require('../AddComment');

describe('AddComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'content',
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new AddComment(payload))
        .toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      content: true,
      owner: 1234,
      threadId: ['thread-123'],
    };

    // Action & Assert
    expect(() => new AddComment(payload))
        .toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddComment entities correctly', () => {
    // Arrange
    const payload = {
      content: 'content',
      owner: 'user-123',
      threadId: 'thread-123',
      date: new Date().toISOString(),
    };

    // Action
    const addComment = new AddComment(payload);

    // Assert
    expect(addComment).toBeInstanceOf(AddComment);
    expect(addComment.content).toEqual(payload.content);
    expect(addComment.owner).toEqual(payload.owner);
    expect(addComment.threadId).toEqual(payload.threadId);
    expect(addComment.date).toEqual(payload.date);
  });
});
