const authService = require('../services/auth.service');
const AppError = require('../utils/appError');

exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return next(new AppError('Please provide username, email and password', 400));
        }

        const data = await authService.signup(username, email, password);

        res.status(201).json({
            status: 'success',
            data
        });
    } catch (err) {
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

        res.status(200).json({
            status: 'success',
            data
        });
    } catch (err) {
        next(err);
    }
};

