import { Server } from '@hapi/hapi';
import UsersHandler from './handler';
import routes from './routes';
import { Container } from 'src/Infrastructures/container';

type Dependencies = {
  container: Container;
}

export default {
  name: 'users',
  register: async (server: Server, {container}: Dependencies) => {
    const usersHandler = new UsersHandler(container);
    server.route(routes(usersHandler));
  },
};
