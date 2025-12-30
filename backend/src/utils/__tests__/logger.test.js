const logger = require('../logger');

describe('Logger', () => {
    it('should have all required log methods', () => {
        expect(typeof logger.error).toBe('function');
        expect(typeof logger.warn).toBe('function');
        expect(typeof logger.info).toBe('function');
        expect(typeof logger.debug).toBe('function');
    });

    it('should have a stream object for Morgan', () => {
        expect(logger.stream).toBeDefined();
        expect(typeof logger.stream.write).toBe('function');
    });

    it('should log messages without throwing errors', () => {
        expect(() => {
            logger.info('Test message');
            logger.error('Test error');
            logger.warn('Test warning');
        }).not.toThrow();
    });

    it('should accept metadata in log calls', () => {
        expect(() => {
            logger.info('Test', { userId: 1, action: 'test' });
        }).not.toThrow();
    });
});
