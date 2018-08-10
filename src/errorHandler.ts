import { ErrorRequestHandler } from 'express';
/**
 * Модуль обработки ошибок
 */

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(err.status || 500).json({ error: err });
};
export default errorHandler;
