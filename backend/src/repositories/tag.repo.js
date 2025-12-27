const pool = require('../../config/db');

class TagRepository {
    async create(userId, name) {
        const query = 'INSERT INTO tags (user_id, name) VALUES ($1, $2) RETURNING *';
        const { rows } = await pool.query(query, [userId, name]);
        return rows[0];
    }

    async findAllByUserId(userId) {
        const query = 'SELECT * FROM tags WHERE user_id = $1 ORDER BY name ASC';
        const { rows } = await pool.query(query, [userId]);
        return rows;
    }

    async linkTagsToNote(noteId, tagIds) {
        const values = tagIds.map((_, i) => `($1, $${i + 2})`).join(', ');
        const query = `INSERT INTO note_tags (note_id, tag_id) VALUES ${values} ON CONFLICT DO NOTHING`;
        await pool.query(query, [noteId, ...tagIds]);
    }

    async unlinkTagsFromNote(noteId, tagIds) {
        const query = 'DELETE FROM note_tags WHERE note_id = $1 AND tag_id = ANY($2)';
        await pool.query(query, [noteId, tagIds]);
    }

    async findTagsByNoteId(noteId) {
        const query = `
SELECT t.* FROM tags t
JOIN note_tags nt ON t.id = nt.tag_id
WHERE nt.note_id = $1
`;
        const { rows } = await pool.query(query, [noteId]);
        return rows;
    }
}

module.exports = new TagRepository();

