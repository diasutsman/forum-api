import AddThread from '../AddThread';

describe('AddThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'title',
    };

    // Action & Assert
    expect(() => new AddThread(payload as any))
        .toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 'title',
      body: 1234,
      owner: 'user-123',
      date: ['2021-08-08T07:00:00.000Z'],
    };

    // Action & Assert
    expect(() => new AddThread(payload as any))
        .toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddThread entities correctly', () => {
    // Arrange
    const payload = {
      title: 'title',
      body: 'body',
      owner: 'user-123',
      date: new Date().toISOString(),
    };

    // Action
    const addThread = new AddThread(payload);

    // Assert
    expect(addThread).toBeInstanceOf(AddThread);
    expect(addThread.title).toEqual(payload.title);
    expect(addThread.body).toEqual(payload.body);
    expect(addThread.owner).toEqual(payload.owner);
    expect(addThread.date).toEqual(payload.date);
  });
});
