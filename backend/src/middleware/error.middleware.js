module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (err.code === '23505') {
        err.statusCode = 400;
        err.message = err.detail || 'This record already exists';
    }

    if (err.code === '23503') {
        err.statusCode = 400;
        err.message = 'Invalid reference: The referenced record does not exist';
    }

    if (err.code === '23502') {
        err.statusCode = 400;
        err.message = 'Required field is missing';
    }

    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            ...(err.stack && { stack: err.stack }),
        });
    } else {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.isOperational ? err.message : 'Something went very wrong!',
        });
    }
};

