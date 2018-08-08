/**
 * В этом модуле описываем все маршруты запросов
 * @param app - объект приложения
 * @param handlers - объект, содержащий обработчики
 * @param ensureAuth - middleware, отвечающий за проверку авторизации
 */
module.exports.setup = function(app, handlers, ensureAuth) {
  app.post('/api/auth', handlers.auth);

  app.all('/api/*', ensureAuth);

  app.get('/api/user/get/:user_id?', handlers.user.getById);

  app.get('/api/users/find(/:search_query?(/:page?)?)?', handlers.users.find);
  app.get('/api/users/find//:page', handlers.users.find);

  app.get('/api/friendships/getAll', handlers.friendships.getAll);

  app.post('/api/friendship/request/:user_id', handlers.friendship.request);
  app.post('/api/friendship/accept/:friendship_id', handlers.friendship.accept);
  app.post('/api/friendship/decline/:friendship_id', handlers.friendship.decline);
};
