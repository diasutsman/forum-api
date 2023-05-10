import routes from './routes';
import AuthenticationsHandler from './handler';
import {Server} from '@hapi/hapi'
import { Container } from '../../../../Infrastructures/container'

type Dependencies = {
  container: Container
}

export default {
  name: 'authentications',
  register: async (server: Server, {container}: Dependencies) => {
    const authenticationsHandler = new AuthenticationsHandler(container);
    server.route(routes(authenticationsHandler));
  },
};
