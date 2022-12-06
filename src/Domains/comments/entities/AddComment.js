/**
 * @class AddComment
 */
class AddComment {
  /**
   * Creates an instance of AddComment.
   * @param {{
   *  content: string,
   *  owner: string,
   *  threadId: string,
   *  date: string?,
   * }} payload
   * @memberof AddComment
   */
  constructor(payload) {
    this._verifyPayload(payload);
    this.content = payload.content;
    this.owner = payload.owner;
    this.threadId = payload.threadId;
    this.date = payload.date || new Date().toISOString();
  }

  /**
   * @param {{
   *  content: string,
   *  owner: string,
   *  threadId: string,
   *  date: string?,
   * }} payload
   * @memberof AddComment
   */
  _verifyPayload(payload) {
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

module.exports = AddComment;
