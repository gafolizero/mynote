const app = require('./src/app');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`, {
        environment: process.env.NODE_ENV || 'development',
        port: PORT,
    });
});

