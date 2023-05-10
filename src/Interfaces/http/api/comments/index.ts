import { Server } from "@hapi/hapi";
import CommentsHandler from "./handler";
import routes from "./routes";
import { Container } from "../../../../Infrastructures/container";

export default {
	name: "comments",
	register: async (server: Server, { container }: {container: Container}) => {
		const commentsHandler = new CommentsHandler(container);
		server.route(routes(commentsHandler));
	},
};
