type Payload = {
  threadId: string;
  commentId: string;
  content: string;
  owner: string;
  date?: string;
}
/**
 * @class AddReply
 */
class AddReply {
  threadId: string;
  commentId: string;
  content: string;
  owner: string;
  date: {};
  /**
   * @param {Payload} payload
   */
  constructor(payload: Payload) {
    AddReply._verifyPayload(payload);
    const {threadId, commentId, content, owner, date} = payload;

    this.threadId = threadId;
    this.commentId = commentId;
    this.content = content;
    this.owner = owner;
    this.date = date || new Date().toISOString();
  }

  /**
   * @param {Payload} payload
   * @memberof AddReply
   */
  private static _verifyPayload({threadId,
    commentId,
    content,
    owner,
  }: Payload) {
    if (!threadId || !commentId || !content || !owner) {
      throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof threadId !== 'string' ||
      typeof commentId !== 'string' ||
      typeof content !== 'string' ||
      typeof owner !== 'string'
    ) {
      throw new Error('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default AddReply;
