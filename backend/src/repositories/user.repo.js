const pool = require('../../config/db');

class UserRepository {
    async create(username, email, passwordHash) {
        const query = `
            INSERT INTO users (username, email, password_hash)
            VALUES ($1, $2, $3)
            RETURNING id, username, email, created_at
            `;
        const { rows } = await pool.query(query, [username, email, passwordHash]);
        return rows[0];
    }

    async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const { rows } = await pool.query(query, [email]);
        return rows[0];
    }

    async findById(id) {
        const query = 'SELECT id, username, email FROM users WHERE id = $1';
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    }
}

module.exports = new UserRepository();

