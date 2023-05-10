import { ReqRefDefaults, ServerRoute } from "@hapi/hapi";
import LikesHandler from "./handler";

const routes = (handler: LikesHandler): ServerRoute<ReqRefDefaults> | ServerRoute<ReqRefDefaults>[] => [
	{
		method: "PUT",
		path: "/threads/{threadId}/comments/{commentId}/likes",
		handler: handler.putLikesHandler,
		options: {
			auth: "forumapi_jwt",
		},
	},
];

export default routes;
