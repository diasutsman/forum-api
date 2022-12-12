/**
 * @typedef {import('./../../Domains/threads/entities/AddThread')} AddThread
 */

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
  async addThread(addThread) {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  /**
   * @param {string} id
   * @memberof ThreadRepository
   */
  async getThreadById(id) {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  /**
   * @param {string} id
   * @memberof ThreadRepository
   */
  async verifyThreadAvailability(id) {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = ThreadRepository;
