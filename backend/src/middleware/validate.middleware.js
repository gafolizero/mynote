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
        const errorMessage = error.errors
        .map((err) => `${err.path.join('.')} : ${err.message}`)
        .join(', ');

        return next(new AppError(`Validation Error: ${errorMessage}`, 400));
    }
};

module.exports = validate;

