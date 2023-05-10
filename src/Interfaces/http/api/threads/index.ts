import ThreadsHandler from './handler';
import routes from './routes';
import { Server } from '@hapi/hapi';
import { Container } from '../../../../Infrastructures/container'

type Dependencies = {
  container: Container
}

export default {
  name: 'threads',
  register: async (server: Server, {container}: Dependencies) => {
    const usersHandler = new ThreadsHandler(container);
    server.route(routes(usersHandler));
  },
};
