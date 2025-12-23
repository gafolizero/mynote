const jwt = require('jsonwebtoken');
const userRepo = require('../repositories/user.repo');
const AppError = require('../utils/appError');

exports.protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(new AppError('You are not logged in!', 401));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const currentUser = await userRepo.findById(decoded.id);

        if (!currentUser) {
            return next(new AppError('User no longer exists', 401));
        }

        req.user = currentUser;

        next();
    } catch (err) {
        next(new AppError('Invalid or expired token', 401));
    }
};

