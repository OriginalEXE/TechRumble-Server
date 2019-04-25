const knex = require ('knex');
const knexConfig = require ('../../knexfile');

module.exports = process.env.NODE_ENV === 'production'
  ? knex (knexConfig.production)
  : knex (knexConfig.development);
