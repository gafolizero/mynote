const authController = require('../auth.controller');
const authService = require('../../services/auth.service');
const AppError = require('../../utils/appError');

jest.mock('../../services/auth.service');
jest.mock('../../utils/logger', () => ({
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
}));

describe('Auth Controller', () => {
    let mockReq, mockRes, mockNext;

    beforeEach(() => {
        mockReq = {
            body: {},
            ip: '127.0.0.1'
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        mockNext = jest.fn();
        jest.clearAllMocks();
    });

    describe('signup', () => {
        it('should return 400 if required fields are missing', async () => {
            mockReq.body = {};

            await authController.signup(mockReq, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.any(AppError)
            );
            expect(mockRes.status).not.toHaveBeenCalled();
        });

        it('should create user and return 201 on success', async () => {
            mockReq.body = {
                username: 'testuser',
                email: 'test@test.com',
                password: 'password123'
            };

            authService.signup.mockResolvedValue({
                user: { id: 1, username: 'testuser', email: 'test@test.com' },
                token: 'mock-token'
            });

            await authController.signup(mockReq, mockRes, mockNext);

            expect(authService.signup).toHaveBeenCalledWith(
                'testuser',
                'test@test.com',
                'password123'
            );
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 'success',
                data: expect.any(Object)
            });
        });
    });

    describe('login', () => {
        it('should return 400 if email or password is missing', async () => {
            mockReq.body = { email: 'test@test.com' };

            await authController.login(mockReq, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.any(AppError)
            );
        });

        it('should login user and return 200 on success', async () => {
            mockReq.body = {
                email: 'test@test.com',
                password: 'password123'
            };

            authService.login.mockResolvedValue({
                user: { id: 1, email: 'test@test.com' },
                token: 'mock-token'
            });

            await authController.login(mockReq, mockRes, mockNext);

            expect(authService.login).toHaveBeenCalledWith(
                'test@test.com',
                'password123'
            );
            expect(mockRes.status).toHaveBeenCalledWith(200);
        });
    });
});
