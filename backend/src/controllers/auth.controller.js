const authService = require('../services/auth.service');
const AppError = require('../utils/appError');
const logger = require('../utils/logger');

exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return next(new AppError('Please provide username, email and password', 400));
        }

        const data = await authService.signup(username, email, password);

        logger.info('User signed up successfully', {
            userId: data.user.id,
            username: data.user.username,
            email: data.user.email,
            ip: req.ip,
        });

        res.status(201).json({
            status: 'success',
            data
        });
    } catch (err) {
        logger.error('Signup failed', {
            error: err.message,
            email: req.body.email,
            username: req.body.username,
            ip: req.ip,
        });
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new AppError('Please provide email and password', 400));
        }

        const data = await authService.login(email, password);

        logger.info('User logged in successfully', {
            userId: data.user.id,
            email: data.user.email,
            ip: req.ip,
        });

        res.status(200).json({
            status: 'success',
            data
        });
    } catch (err) {
        logger.warn('Login failed', {
            error: err.message,
            email: req.body.email,
            ip: req.ip,
        });
        next(err);
    }
};

