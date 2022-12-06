/**
 *
 *
 * @class AddedComment
 */
class AddedComment {
  /**
   * Creates an instance of AddedComment.
   * @param {{
   *  id: string,
   *  content: string,
   *  owner: string,
   * }} payload
   * @memberof AddedComment
   */
  constructor(payload) {
    this._verifyPayload(payload);
    this.id = payload.id;
    this.content = payload.content;
    this.owner = payload.owner;
  }

  /**
   * @param {{
   *  id: string,
   *  content: string,
   *  owner: string,
   * }} payload
   * @memberof AddedComment
   */
  _verifyPayload(payload) {
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

module.exports = AddedComment;
