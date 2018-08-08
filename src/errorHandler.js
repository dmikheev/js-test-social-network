/**
 * Модуль обработки ошибок
 */
const errorHandler = function(err, req, res) {
  res.status(500).json({ error: err });
};

module.exports = errorHandler;
