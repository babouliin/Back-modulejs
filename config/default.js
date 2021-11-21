const { join } = require('path');
require('dotenv').config({ path: join(__dirname, `/../.env.${process.env.NODE_ENV}`) });

module.exports = {
  apiConfig: {
    apiPort: process.env.API_PORT,
  },
  secretConfig: {
    passwordSecret: process.env.PASSWORD_SECRET,
    jwtSecret: process.env.JWT_SECRET,
    loginTokenVersion: 1,
  },
  dbConfig: {
    databaseUrl: process.env.DATABASE_URL,
  },
};
