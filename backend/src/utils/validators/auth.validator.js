const { z } = require('zod');

const signupSchema = z.object({
    body: z.object({
        username: z.string().min(3, 'Username must be at least 3 characters').max(50),
        email: z.string().email('Invalid email format'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
    }),
});

const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email format'),
        password: z.string().min(1, 'Password is required'),
    }),
});

module.exports = { signupSchema, loginSchema };
