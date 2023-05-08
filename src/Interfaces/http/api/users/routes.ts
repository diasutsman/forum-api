/**
 * @typedef {import('./handler')} UsersHandler
 * @typedef {import('@hapi/hapi').ServerRoute} ServerRoute
 */

/**
 *
 * @param {UsersHandler} handler
 * @return {ServerRoute[]}
 */
const routes = (handler) => ([
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler,
  },
]);

module.exports = routes;
