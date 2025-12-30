const AppError = require('../appError');

describe('AppError', () => {
    it('should create an error with message and statusCode', () => {
        const error = new AppError('Test error', 400);
        
        expect(error.message).toBe('Test error');
        expect(error.statusCode).toBe(400);
        expect(error.isOperational).toBe(true);
    });

    it('should set status to "fail" for 4xx status codes', () => {
        const error = new AppError('Not found', 404);
        
        expect(error.status).toBe('fail');
    });

    it('should set status to "error" for 5xx status codes', () => {
        const error = new AppError('Server error', 500);
        
        expect(error.status).toBe('error');
    });

    it('should be an instance of Error', () => {
        const error = new AppError('Test', 400);
        
        expect(error).toBeInstanceOf(Error);
    });
});
