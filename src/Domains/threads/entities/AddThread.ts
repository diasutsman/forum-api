type Payload = {
  title: string;
  body: string;
  owner: string;
  date?: string;
}

/**
 * @class AddThread
 */
class AddThread {
  title: string;
  body: string;
  owner: string;
  date: string;
  /**
   * Creates an instance of AddThread.
   * @param {Payload} payload
   * @memberof AddThread
   */
  constructor(payload: Payload) {
    this._verifyPayload(payload);
    this.title = payload.title;
    this.body = payload.body;
    this.owner = payload.owner;
    this.date = payload.date || new Date().toISOString();
  }

  /**
   *
   * @param {Payload} payload
   * @memberof AddThread
   */
  _verifyPayload(payload: Payload) {
    const {title, body, owner} = payload;
    if (!title || !body || !owner) {
      throw new Error('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (
      typeof title !== 'string' ||
      typeof body !== 'string' ||
      typeof owner !== 'string'
    ) {
      throw new Error('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default AddThread;
