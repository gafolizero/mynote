const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const AppError = require('./utils/appError');
const logger = require('./utils/logger');
const globalErrorHandler = require('./middleware/error.middleware');
const authRoutes = require('./routes/auth.routes');
const folderRoutes = require('./routes/folder.routes');
const noteRoutes = require('./routes/note.routes');
const tagRoutes =  require('./routes/tag.routes');

const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev', { stream: logger.stream }));
} else {
    app.use(morgan('combined', { stream: logger.stream }));
}

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'MyNote API Documentation',
    customfavIcon: '/favicon.ico'
}));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/folders', folderRoutes);
app.use('/api/v1/notes', noteRoutes);
app.use('/api/v1/tags', tagRoutes);

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'MyNote API is running',
        documentation: '/api-docs',
        version: '1.0.0'
    });
});

app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

