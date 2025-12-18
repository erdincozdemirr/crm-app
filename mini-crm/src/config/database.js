const config = require('./index');

const dbConfig = config.db;

module.exports = {
    development: dbConfig,
    test: dbConfig,
    production: dbConfig
};
