import { Container } from "src/Infrastructures/container";
import CommentUseCase from "../../../../Applications/use_case/CommentUseCase";
import autoBind from "auto-bind";
import { Request, ResponseObject } from "@hapi/hapi";

/**
 * @class LikesHandler
 */
class LikesHandler {
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
   * 
   * @return {Promise<ResponseObject | object>}
	 * @memberof ThreadsHandler
	 */
	async putLikesHandler(request: Request): Promise<ResponseObject | object> {
		const { threadId, commentId } = request.params;
		const { id: userId } = request.auth.credentials;

		/** @type {CommentUseCase} */
		const commentUseCase: CommentUseCase = this._container.getInstance(CommentUseCase.name);
		await commentUseCase.toggleLike({
			threadId,
			commentId,
			userId: userId as string,
		});

		return { status: "success" };
	}
}

export default LikesHandler;
