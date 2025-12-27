const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userRepo = require('../repositories/user.repo');
const AppError = require('../utils/appError');

class AuthService {
    async signup(username, email, password) {
        const existingUser = await userRepo.findByEmail(email);
        if (existingUser) {
            throw new AppError('Email already in use', 400);
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await userRepo.create(username, email, passwordHash);

        const token = this.generateToken(newUser.id);
        return { user: newUser, token };
    }

    async login(email, password) {
        const user = await userRepo.findByEmail(email);

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            throw new AppError('Invalid email or password', 401);
        }

        const token = this.generateToken(user.id);
        return {
            user: {
                id: user.id, username: user.username,
                email: user.email
            },
            token
        };
    }

    generateToken(id) {
        return jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
    }
}

module.exports = new AuthService();

