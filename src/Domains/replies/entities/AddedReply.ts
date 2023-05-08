/**
 * @class AddedReply
 */
class AddedReply {
  /**
   * Creates an instance of AddedReply.
   * @param {{
   *  id: string,
   *  content: string,
   *  owner: string,
   * }} payload
   * @memberof AddedReply
   */
  constructor(payload) {
    this._verifyPayload(payload);
    const {id, content, owner} = payload;
    this.id = id;
    this.content = content;
    this.owner = owner;
  }

  /**
   * @param {{
   * id: string,
   * content: string,
   * owner: string,
   * }} payload
   * @memberof AddedReply
   */
  _verifyPayload({id, content, owner}) {
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
module.exports = AddedReply;
