const logger = require('./src/utils/logger');

console.log('Logger Test');

logger.error('Test ERROR message', { test: true, level: 'error' });
logger.warn('Test WARN message', { test: true, level: 'warn' });
logger.info('Test INFO message', { test: true, level: 'info' });
logger.debug('Test DEBUG message', { test: true, level: 'debug' });
