import { Express, RequestHandler } from 'express';
import path from 'path';
import { CLIENT_PATH } from './constants/constants';
import handlers from './handlers/index';
import * as passportHelper from './libs/passportHelper';

/**
 * В этом модуле описываем все маршруты запросов
 */
export function setup(app: Express) {
  app.post('/api/auth', handlers.auth);

  app.all('/api/*', passportHelper.ensureAuthenticated);

  app.get('/api/user/get/:user_id?', handlers.user.getById);

  app.get('/api/users/find(/:search_query?(/:page?)?)?', handlers.users.find);
  app.get('/api/users/find//:page', handlers.users.find);

  app.get('/api/friendships/getAll', handlers.friendships.getAll);

  app.post('/api/friendship/request/:user_id', handlers.friendship.request);
  app.post('/api/friendship/accept/:friendship_id', handlers.friendship.accept);
  app.post('/api/friendship/decline/:friendship_id', handlers.friendship.decline);
}

export function setupHistoryApiFallback(app: Express) {
  app.get('*', returnIndexForNonApiRoute);
}

const returnIndexForNonApiRoute: RequestHandler = (req, res, next) => {
  if (req.path.indexOf('/api/') === 0) {
    return next();
  }

  try {
    return res.sendFile(path.resolve(CLIENT_PATH, 'index.html'));
  } catch (err) {
    return next(err);
  }
};
