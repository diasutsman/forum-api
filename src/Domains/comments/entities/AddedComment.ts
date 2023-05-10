type Payload = {
  id: string;
  content: string;
  owner: string;
}

/**
 *
 *
 * @class AddedComment
 */
class AddedComment {
  id: string;
  content: string;
  owner: string;
  /**
   * Creates an instance of AddedComment.
   * @param {Payload} payload
   * @memberof AddedComment
   */
  constructor(payload: Payload) {
    this._verifyPayload(payload);
    this.id = payload.id;
    this.content = payload.content;
    this.owner = payload.owner;
  }

  /**
   * @param {Payload} payload
   * @memberof AddedComment
   */
  _verifyPayload(payload: Payload) {
    const {id, content, owner} = payload;
    if (!id || !content || !owner) {
      throw new Error('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (
      typeof id !== 'string' ||
      typeof content !== 'string' ||
      typeof owner !== 'string'
    ) {
      throw new Error('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default AddedComment;
