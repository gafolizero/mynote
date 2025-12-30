const AppError = require('../utils/appError');

const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (error) {
        if (error.errors && Array.isArray(error.errors)) {
            const errorMessages = error.errors.map((err) => {
                const path = err.path && err.path.join('.');
                if (path) {
                    if (path.includes('body.')) {
                        const field = path.replace('body.', '');
                        return `${field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, ' ')}: ${err.message}`;
                    }
                    return `${path}: ${err.message}`;
                }
                return err.message;
            });

            const errorMessage = errorMessages.join(', ');
            return next(new AppError(errorMessage, 400));
        } else {
            return next(new AppError('Invalid request data', 400));
        }
    }
};

module.exports = validate;

