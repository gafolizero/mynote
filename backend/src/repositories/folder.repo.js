const pool = require('../../config/db');

class FolderRepository {
    async create(userId, name, color) {
        const query = `
            INSERT INTO folders (user_id, name, color)
            VALUES ($1, $2, $3)
            RETURNING *
            `;
        const { rows } = await pool.query(query, [userId, name, color || '#808080']);
        return rows[0];
    }

    async findAllByUserId(userId) {
        const query = 'SELECT * FROM folders WHERE user_id = $1 ORDER BY created_at DESC';
        const { rows } = await pool.query(query, [userId]);
        return rows;
    }

    async findById(id, userId) {
        const query = 'SELECT * FROM folders WHERE id = $1 AND user_id = $2';
        const { rows } = await pool.query(query, [id, userId]);
        return rows[0];
    }

    async update(id, userId, { name, color }) {
        const query = `
            UPDATE folders
            SET name = COALESCE($1, name), color = COALESCE($2, color)
            WHERE id = $3 AND user_id = $4
            RETURNING *
            `;
        const { rows } = await pool.query(query, [name, color, id, userId]);
        return rows[0];
    }

    async delete(id, userId) {
        const query = 'DELETE FROM folders WHERE id = $1 AND user_id = $2';
        const { rowCount } = await pool.query(query, [id, userId]);
        return rowCount > 0;
    }
}

module.exports = new FolderRepository();

