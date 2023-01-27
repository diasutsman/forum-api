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
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: handler.deleteCommentByIdHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: handler.postCommentHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
]);

module.exports = routes;
