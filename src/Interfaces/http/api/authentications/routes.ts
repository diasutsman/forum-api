import { ServerRoute, ReqRefDefaults } from '@hapi/hapi';
import Handler from './handler'

const routes = (handler: Handler): ServerRoute<ReqRefDefaults> | ServerRoute<ReqRefDefaults>[] => ([
  {
    method: 'POST',
    path: '/authentications',
    handler: handler.postAuthenticationHandler,
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: handler.putAuthenticationHandler,
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: handler.deleteAuthenticationHandler,
  },
]);

export default routes;
