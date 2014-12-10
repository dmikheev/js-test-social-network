/**
 * Настройка библиотеки конфигурации nconf
 */

var nconf = require('nconf');

/**
 * Настраиваем nconf на использование (в следующем порядке):
 *  1. Аргументы командной строки
 *  2. Переменные среды
 *  3. Файл 'config/config.json'
 */
nconf.argv()
  .env()
  .file({ file: './config/config.json' });

module.exports = nconf;