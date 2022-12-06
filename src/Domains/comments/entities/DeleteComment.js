/**
 * @class DeleteComment
 */
class DeleteComment {
  /**
   * Creates an instance of DeleteComment.
   * @param {{
   *  threadId: string,
   *  commentId: string,
   *  owner: string,
   * }} payload
   * @memberof DeleteComment
   */
  constructor(payload) {
    this._verifyPayload(payload);
    this.threadId = payload.threadId;
    this.commentId = payload.commentId;
    this.owner = payload.owner;
  }

  /**
   * @param {{
   *  threadId: string,
   *  commentId: string,
   *  owner: string,
   * }} payload
   * @memberof DeleteComment
   */
  _verifyPayload(payload) {
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

module.exports = DeleteComment;
