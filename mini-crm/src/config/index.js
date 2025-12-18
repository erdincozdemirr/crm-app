const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  app: {
    port: parseInt(process.env.APP_PORT, 10) || 3000,
    env: process.env.NODE_ENV || 'development',
    isProd: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
  },
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME || 'mini_crm',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || null,
    dialect: 'postgres',
    logging: process.env.DB_LOGGING === 'true' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};
