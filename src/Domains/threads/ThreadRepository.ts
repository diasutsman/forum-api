import AddThread from './entities/AddThread';
import AddedThread from './entities/AddedThread';

/**
 *
 *
 * @class ThreadRepository
 */
class ThreadRepository {
  /**
   * @param {AddThread} addThread
   * @memberof ThreadRepository
   */
  async addThread(addThread: AddThread): Promise<AddedThread> {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  /**
   * @param {string} id
   * @memberof ThreadRepository
   */
  async getThreadById(id: string): Promise<any> {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  /**
   * @param {string} id
   * @memberof ThreadRepository
   */
  async verifyThreadAvailability(id: string) {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

export default ThreadRepository;
