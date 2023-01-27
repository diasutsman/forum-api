const LikesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'likes',
  register: async (server, {container}) => {
    const usersHandler = new LikesHandler(container);
    server.route(routes(usersHandler));
  },
};
