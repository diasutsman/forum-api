/**
 * @class ToggleLikeComment
 */
class ToggleLikeComment {
  /**
   * Creates an instance of ToggleLikeComment.
   * @param {{
   *  threadId: string,
   *  commentId: string,
   *  liker: string,
   * }} payload
   * @memberof ToggleLikeComment
   */
  constructor(payload) {
    this._verifyPayload(payload);
    this.commentId = payload.commentId;
    this.liker = payload.liker;
    this.threadId = payload.threadId;
  }

  /**
   * @param {{
   *  threadId: string,
   *  commentId: string,
   *  liker: string,
   * }} payload
   * @memberof ToggleLikeComment
   */
  _verifyPayload(payload) {
    const {threadId, commentId, liker} = payload;
    if (!threadId || !commentId || !liker) {
      throw new Error('TOGGLE_LIKE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (
      typeof commentId !== 'string' ||
      typeof threadId !== 'string' ||
      typeof liker !== 'string'
    ) {
      throw new Error('TOGGLE_LIKE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ToggleLikeComment;
