import { Server } from "@hapi/hapi";
import RepliesHandler from "./handler";
import routes from "./routes";
import { Container } from "../../../../Infrastructures/container";

export default {
	name: "replies",
	register: async (server: Server, { container }: {container: Container}) => {
		const repliesHandler = new RepliesHandler(container);
		server.route(routes(repliesHandler));
	},
};
