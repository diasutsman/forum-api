import { CommentLikePayload } from "src/Commons/types";

/**
 * @class ToggleLikeComment
 */
class ToggleLikeComment {
  commentId: string;
  userId: string;
  threadId: string;
	/**
	 * Creates an instance of ToggleLikeComment.
	 * @param {Payload} payload
	 * @memberof ToggleLikeComment
	 */
	constructor(payload: CommentLikePayload) {
		this._verifyPayload(payload);
		this.commentId = payload.commentId;
		this.userId = payload.userId;
		this.threadId = payload.threadId;
	}

	/**
	 * @param {Payload} payload
	 * @memberof ToggleLikeComment
	 */
	_verifyPayload(payload: CommentLikePayload) {
		const { threadId, commentId, userId } = payload;
		if (!threadId || !commentId || !userId) {
			throw new Error("TOGGLE_LIKE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
		}
		if (
			typeof commentId !== "string" ||
			typeof threadId !== "string" ||
			typeof userId !== "string"
		) {
			throw new Error("TOGGLE_LIKE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
		}
	}
}

export default ToggleLikeComment;
