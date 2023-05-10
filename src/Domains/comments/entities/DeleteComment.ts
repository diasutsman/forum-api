type Payload = {
  threadId: string;
  commentId: string;
  owner: string;
}

/**
 * @class DeleteComment
 */
class DeleteComment {
  threadId: string;
  commentId: string;
  owner: string;
  /**
   * Creates an instance of DeleteComment.
   * @param {Payload} payload
   * @memberof DeleteComment
   */
  constructor(payload: Payload) {
    DeleteComment._verifyPayload(payload);
    this.threadId = payload.threadId;
    this.commentId = payload.commentId;
    this.owner = payload.owner;
  }

  /**
   * @param {Payload} payload
   * @memberof DeleteComment
   */
  private static _verifyPayload(payload: Payload) {
    const {threadId, commentId, owner} = payload;
    if (!threadId || !commentId || !owner) {
      throw new Error('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (
      typeof commentId !== 'string' ||
      typeof threadId !== 'string' ||
      typeof owner !== 'string'
    ) {
      throw new Error('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default DeleteComment;
