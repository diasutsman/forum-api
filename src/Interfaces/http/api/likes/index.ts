import { Server } from "@hapi/hapi";

import LikesHandler from "./handler";
import routes from "./routes";
import { Container } from "../../../../Infrastructures/container";

export default {
	name: "likes",
	register: async (server: Server, { container }: {container: Container}) => {
		const usersHandler = new LikesHandler(container);
		server.route(routes(usersHandler));
	},
};
