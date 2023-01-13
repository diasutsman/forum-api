const routes = (handler) => ([
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    handler: handler.putLikesHandler,
  },
]);

module.exports = routes;
