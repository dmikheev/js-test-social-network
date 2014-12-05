module.exports.setup = function(app, handlers, ensureAuth) {
  app.post('api/auth', handlers.auth);

  app.get('api/user/get', handlers.user.getById);

  app.get('api/users/getAll', handlers.users.getAll);
  app.get('api/users/find', handlers.users.find);

  app.get('api/friendships/getAll', handlers.friendships.getAll);
  
  app.post('api/friendship/request', handlers.friendship.request);
  app.post('api/friendship/accept', handlers.friendship.accept);
  app.post('api/friendship/decline', handlers.friendship.decline);
};