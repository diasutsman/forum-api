import { Container } from "src/Infrastructures/container";
import CommentUseCase from "../../../../Applications/use_case/CommentUseCase";
import autoBind from "auto-bind";
import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";

/**
 * @class ThreadCommentsHandler
 */
class CommentsHandler {
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
	async postCommentHandler(request: Request, h: ResponseToolkit): Promise<ResponseObject> {
		/** @type {CommentUseCase} */
		const commentUseCase = this._container.getInstance(CommentUseCase.name);
		const addedComment = await commentUseCase.addComment({
			...request.payload as object,
			owner: request.auth.credentials.id,
			threadId: request.params.threadId,
		});

		const response = h.response({
			status: "success",
			data: {
				addedComment,
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
	async deleteCommentByIdHandler(request: Request): Promise<ResponseObject | object> {
		const { threadId, commentId } = request.params;
		const { id: credentialId } = request.auth.credentials;

		/** @type {CommentUseCase} */
		const commentUseCase: CommentUseCase = this._container.getInstance(CommentUseCase.name);
		await commentUseCase.deleteComment({
			commentId,
			threadId,
			owner: credentialId as string,
		});

		return {
			status: "success",
			message: "berhasil menghapus komentar",
		};
	}
}

export default CommentsHandler;
