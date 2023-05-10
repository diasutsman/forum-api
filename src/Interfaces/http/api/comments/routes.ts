/**
 * @typedef {import('./handler')} ThreadsHandler
 * @typedef {import('@hapi/hapi').ServerRoute} ServerRoute
 */

import { ReqRefDefaults, ServerRoute } from "@hapi/hapi";
import ThreadsHandler from "./handler";

/**
 *
 * @param {ThreadsHandler} handler
 * @return {ServerRoute[]}
 */
const routes = (handler: ThreadsHandler): ServerRoute<ReqRefDefaults> | ServerRoute<ReqRefDefaults>[] => [
	{
		method: "DELETE",
		path: "/threads/{threadId}/comments/{commentId}",
		handler: handler.deleteCommentByIdHandler,
		options: {
			auth: "forumapi_jwt",
		},
	},
	{
		method: "POST",
		path: "/threads/{threadId}/comments",
		handler: handler.postCommentHandler,
		options: {
			auth: "forumapi_jwt",
		},
	},
];

export default routes;
