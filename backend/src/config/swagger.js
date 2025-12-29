const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'MyNote API',
            version: '1.0.0',
            description: 'A comprehensive REST API for managing notes, folders, and tags',
            contact: {
                name: 'API Support',
                email: 'support@mynote.com'
            },
            license: {
                name: 'ISC',
                url: 'https://opensource.org/licenses/ISC'
            }
        },
        servers: [
            {
                url: 'http://localhost:8080/api/v1',
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter JWT token obtained from login endpoint'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            example: 1
                        },
                        username: {
                            type: 'string',
                            example: 'johndoe'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'john@example.com'
                        }
                    }
                },
                Note: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            example: 1
                        },
                        user_id: {
                            type: 'integer',
                            example: 1
                        },
                        folder_id: {
                            type: 'integer',
                            nullable: true,
                            example: 2
                        },
                        title: {
                            type: 'string',
                            example: 'My First Note'
                        },
                        content: {
                            type: 'string',
                            example: 'This is the content of my note'
                        },
                        is_archived: {
                            type: 'boolean',
                            example: false
                        },
                        is_pinned: {
                            type: 'boolean',
                            example: false
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-01-15T10:30:00Z'
                        },
                        updated_at: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-01-15T10:30:00Z'
                        },
                        tags: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/Tag'
                            }
                        }
                    }
                },
                Folder: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            example: 1
                        },
                        user_id: {
                            type: 'integer',
                            example: 1
                        },
                        name: {
                            type: 'string',
                            example: 'Work'
                        },
                        color: {
                            type: 'string',
                            example: '#3498db'
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-01-15T10:30:00Z'
                        }
                    }
                },
                Tag: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            example: 1
                        },
                        user_id: {
                            type: 'integer',
                            example: 1
                        },
                        name: {
                            type: 'string',
                            example: 'Important'
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'error'
                        },
                        message: {
                            type: 'string',
                            example: 'Error message description'
                        }
                    }
                },
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'success'
                        },
                        data: {
                            type: 'object'
                        }
                    }
                }
            }
        },
        tags: [
            {
                name: 'Authentication',
                description: 'User authentication endpoints'
            },
            {
                name: 'Notes',
                description: 'Note management endpoints'
            },
            {
                name: 'Folders',
                description: 'Folder management endpoints'
            },
            {
                name: 'Tags',
                description: 'Tag management endpoints'
            }
        ]
    },
    apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
