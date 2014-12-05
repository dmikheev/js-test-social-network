var nconf = require('nconf');

//
// Setup nconf to use (in-order):
//   1. Command-line arguments
//   2. Environment variables
//   3. A file located at 'config/config.json'
//
nconf.argv()
  .env()
  .file({ file: './config/config.json' });

module.exports = nconf;