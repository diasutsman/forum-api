type Payload = {
    content: string;
    owner: string;
    threadId: string;
    date: string | null | undefined;
}

/**
 * @class AddComment
 */
class AddComment {
  content: any;
  owner: any;
  threadId: any;
  date: any;
  /**
   * Creates an instance of AddComment.
   * @param {Payload} payload
   * @memberof AddComment
   */
  constructor(payload: Payload) {
    AddComment._verifyPayload(payload);
    this.content = payload.content;
    this.owner = payload.owner;
    this.threadId = payload.threadId;
    this.date = payload.date || new Date().toISOString();
  }

  /**
   * @param {Payload} payload
   * @memberof AddComment
   */
  private static _verifyPayload(payload: Payload) {
    const {content, owner, threadId} = payload;
    if (!content || !owner || !threadId) {
      throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (
      typeof content !== 'string' ||
      typeof owner !== 'string' ||
      typeof threadId !== 'string'
    ) {
      throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default AddComment;
