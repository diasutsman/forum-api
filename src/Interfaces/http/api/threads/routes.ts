import { ServerRoute, ReqRefDefaults } from '@hapi/hapi';
import Handler from './handler';

/**
 *
 * @param {Handler} handler
 * @return {ServerRoute[]}
 */
const routes = (handler: Handler): ServerRoute<ReqRefDefaults> | ServerRoute<ReqRefDefaults>[] => ([
  {
    method: 'POST',
    path: '/threads',
    handler: handler.postThreadHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: handler.getThreadByIdHandler,
  },
]);

export default routes;
