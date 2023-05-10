type Payload = {
  id: string;
  title: string;
  owner: string;
  body: string;
}

/**
 * @class AddedThread
 */
class AddedThread {
  id: string;
  title: string;
  owner: string;
  body: string;
  /**
   * Creates an instance of AddedThread.
   * @param {Payload} payload
   * @memberof AddedThread
   */
  constructor(payload: Payload) {
    this._verifyPayload(payload);
    this.id = payload.id;
    this.title = payload.title;
    this.owner = payload.owner;
    this.body = payload.body;
  }

  /**
   * @param {Payload} payload
   * @memberof AddedThread
   */
  _verifyPayload(payload: Payload) {
    const {id, title, owner} = payload;
    if (!id || !title || !owner) {
      throw new Error('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (
      typeof id !== 'string' ||
      typeof title !== 'string' ||
      typeof owner !== 'string'
    ) {
      throw new Error('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default AddedThread;
