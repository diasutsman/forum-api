import { Container } from "src/Infrastructures/container";
import ReplyUseCase from "../../../../Applications/use_case/ReplyUseCase";
import autoBind from "auto-bind";
import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
/**
 * @class ThreadCommentsHandler
 */
class RepliesHandler {
  private _container: Container;
	/**
	 * @param {Container} container
	 */
	constructor(container: Container) {
		this._container = container;
		autoBind(this);
	}

	/**
	 * @param {Request} request
	 * @param {ResponseToolkit} h
	 * @return {Promise<ResponseObject>}
	 * @memberof ThreadsHandler
	 */
	async postReplyHandler(request: Request, h: ResponseToolkit): Promise<ResponseObject> {
		const { threadId, commentId } = request.params;
		const { id: credentialId } = request.auth.credentials;

		/** @type {ReplyUseCase} */
		const replyUseCase = this._container.getInstance(ReplyUseCase.name);
		const addedReply = await replyUseCase.addReply({
			...request.payload as object,
			owner: credentialId,
			threadId,
			commentId,
		});

		const response = h.response({
			status: "success",
			data: {
				addedReply,
			},
		});
		response.code(201);
		return response;
	}

	/**
	 * @param {Request} request
	 * @return {Promise<ResponseObject>}
	 * @memberof ThreadsHandler
	 */
	async deleteReplyHandler(request: Request): Promise<ResponseObject| object> {
		const { threadId, commentId, replyId } = request.params;
		const { id: credentialId } = request.auth.credentials;

		/** @type {ReplyUseCase} */
		const replyUseCase: ReplyUseCase = this._container.getInstance(ReplyUseCase.name);
		await replyUseCase.deleteReply({
			threadId,
			commentId,
			replyId,
			owner: credentialId as string,
		});

		return {
			status: "success",
			message: "berhasil menghapus balasan",
		};
	}
}

export default RepliesHandler;
