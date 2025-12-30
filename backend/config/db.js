const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, 'config.env') });

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

const logger = require('../src/utils/logger');

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        logger.error('Database connection failed', {
            error: err.message,
            stack: err.stack,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
        });
    } else {
        logger.info('Database connected successfully', {
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
        });
    }
});

module.exports = pool;

