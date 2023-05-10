type Payload = {
  id: string;
  content: string;
  owner: string;
}

/**
 * @class AddedReply
 */
class AddedReply {
  id: string;
  content: string;
  owner: string;
  /**
   * Creates an instance of AddedReply.
   * @param {Payload} payload
   * @memberof AddedReply
   */
  constructor(payload: Payload) {
    this._verifyPayload(payload);
    const {id, content, owner} = payload;
    this.id = id;
    this.content = content;
    this.owner = owner;
  }

  /**
   * @param {Payload} payload
   * @memberof AddedReply
   */
  _verifyPayload({id, content, owner}: Payload) {
    if (!id || !content || !owner) {
      throw new Error('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof content !== 'string' ||
      typeof owner !== 'string'
    ) {
      throw new Error('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}
export default AddedReply;
