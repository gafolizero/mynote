const jwt = require('jsonwebtoken');
const userRepo = require('../repositories/user.repo');
const AppError = require('../utils/appError');
const logger = require('../utils/logger');

exports.protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            logger.warn('Authentication failed: No token provided', {
                path: req.originalUrl,
                method: req.method,
                ip: req.ip,
            });
            return next(new AppError('You are not logged in!', 401));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const currentUser = await userRepo.findById(decoded.id);

        if (!currentUser) {
            logger.warn('Authentication failed: User not found', {
                userId: decoded.id,
                path: req.originalUrl,
                method: req.method,
                ip: req.ip,
            });
            return next(new AppError('User no longer exists', 401));
        }

        req.user = currentUser;
        logger.debug('Authentication successful', {
            userId: currentUser.id,
            path: req.originalUrl,
            method: req.method,
        });

        next();
    } catch (err) {
        logger.warn('Authentication failed: Invalid or expired token', {
            error: err.message,
            path: req.originalUrl,
            method: req.method,
            ip: req.ip,
        });
        next(new AppError('Invalid or expired token', 401));
    }
};

