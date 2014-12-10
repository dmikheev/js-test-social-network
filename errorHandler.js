/**
 * Модуль обработки ошибок
 */
var errorHandler = function(err, req, res, next) {
  res.status(500).json({ error: err });
}

module.exports = errorHandler;