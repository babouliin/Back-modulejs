import { resolve } from 'path';
import { config } from 'dotenv';

config({ path: resolve(__dirname, '../.env') });

module.exports = {
  apiConfig: {
    API_PORT: process.env.API_PORT,
  },
  secretConfig: {
    PASSWORD_SECRET_KEY: process.env.PASSWORD_SECRET_KEY,
  }
};
