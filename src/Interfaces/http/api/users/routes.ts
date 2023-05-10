import { ReqRefDefaults, ServerRoute } from "@hapi/hapi";
import Handler from "./handler";

const routes = (handler: Handler): ServerRoute<ReqRefDefaults> | ServerRoute<ReqRefDefaults>[] => ([
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler,
  },
]);

export default routes;
