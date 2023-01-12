/**
 * @class ToggleLikeComment
 */
class ToggleLikeComment {
  /**
   * Creates an instance of ToggleLikeComment.
   * @param {{
   *  threadId: string,
   *  commentId: string,
   *  userId: string,
   * }} payload
   * @memberof ToggleLikeComment
   */
  constructor(payload) {
    this._verifyPayload(payload);
    this.commentId = payload.commentId;
    this.userId = payload.userId;
    this.threadId = payload.threadId;
  }

  /**
   * @param {{
   *  threadId: string,
   *  commentId: string,
   *  userId: string,
   * }} payload
   * @memberof ToggleLikeComment
   */
  _verifyPayload(payload) {
    const {threadId, commentId, userId} = payload;
    if (!threadId || !commentId || !userId) {
      throw new Error('TOGGLE_LIKE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (
      typeof commentId !== 'string' ||
      typeof threadId !== 'string' ||
      typeof userId !== 'string'
    ) {
      throw new Error('TOGGLE_LIKE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ToggleLikeComment;
