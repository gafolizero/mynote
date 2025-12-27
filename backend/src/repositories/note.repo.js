const pool = require('../../config/db');

class NoteRepository {
    async create(userId, data) {
        const { title, content, folder_id, is_pinned } = data;
        const query = `
            INSERT INTO notes (user_id, folder_id, title, content, is_pinned)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
            `;
        const { rows } = await pool.query(query, [userId, folder_id || null, title, content, is_pinned || false]);
        return rows[0];
    }

    async findAll(userId, { folderId, isPinned, isArchived, search, tagId, page, limit }) {
        const limitNum = parseInt(limit) || 10;
        const pageNum = parseInt(page) || 1;
        const offsetNum = (pageNum - 1) * limitNum;

        let query = `
SELECT n.*,
json_agg(t.*) FILTER (WHERE t.id IS NOT NULL) AS tags
FROM notes n
LEFT JOIN note_tags nt ON n.id = nt.note_id
LEFT JOIN tags t ON nt.tag_id = t.id
WHERE n.user_id = $1
`;

        const params = [userId];

        if (folderId) {
            params.push(folderId);
            query += ` AND n.folder_id = $${params.length}`;
        }
        if (typeof isPinned === 'boolean') {
            params.push(isPinned);
            query += ` AND n.is_pinned = $${params.length}`;
        }
        if (typeof isArchived === 'boolean') {
            params.push(isArchived);
            query += ` AND n.is_archived = $${params.length}`;
        }
        if (search) {
            params.push(`%${search}%`);
            query += ` AND (n.title ILIKE $${params.length} OR n.content ILIKE $${params.length})`;
        }
        if (tagId) {
            params.push(tagId);
            query += ` AND EXISTS (
SELECT 1 FROM note_tags nt2
WHERE nt2.note_id = n.id AND nt2.tag_id = $${params.length}
)`;
        }

        query += ` GROUP BY n.id ORDER BY n.is_pinned DESC, n.updated_at DESC`;

        params.push(limitNum);
        query += ` LIMIT $${params.length}`;

        params.push(offsetNum);
        query += ` OFFSET $${params.length}`;

        const { rows } = await pool.query(query, params);
        return rows.map(row => ({ ...row, tags: row.tags || [] }));
    }

    async findById(id, userId) {
        const query = `
            SELECT n.*,
            json_agg(t.*) FILTER (WHERE t.id IS NOT NULL) AS tags
            FROM notes n
            LEFT JOIN note_tags nt ON n.id = nt.note_id
            LEFT JOIN tags t ON nt.tag_id = t.id
            WHERE n.id = $1 AND n.user_id = $2
            GROUP BY n.id
            `;
        const { rows } = await pool.query(query, [id, userId]);
        return rows[0];
    }

    async update(id, userId, data) {
        const fields = [];
        const params = [id, userId];
        let index = 3;

        for (const [key, value] of Object.entries(data)) {
            fields.push(`${key} = $${index++}`);
            params.push(value);
        }

        if (fields.length === 0) return null;

        const query = `
            UPDATE notes
            SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
            WHERE id = $1 AND user_id = $2
            RETURNING *
            `;
        const { rows } = await pool.query(query, params);
        return rows[0];
    }

    async delete(id, userId) {
        const query = 'DELETE FROM notes WHERE id = $1 AND user_id = $2';
        const { rowCount } = await pool.query(query, [id, userId]);
        return rowCount > 0;
    }
}

module.exports = new NoteRepository();

