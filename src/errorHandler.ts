import { ErrorRequestHandler } from 'express';
/**
 * Модуль обработки ошибок
 */

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(500).json({ error: err });
};
export default errorHandler;
