/**
 * @typedef {import('./handler')} ThreadsHandler
 * @typedef {import('@hapi/hapi').ServerRoute} ServerRoute
 */

/**
 *
 * @param {ThreadsHandler} handler
 * @return {ServerRoute[]}
 */
const routes = (handler) => ([
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
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    handler: handler.putLikesHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
]);

module.exports = routes;
