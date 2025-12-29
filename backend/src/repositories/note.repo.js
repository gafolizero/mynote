const pool = require('../../config/db');

class NoteRepository {
    async create(userId, data) {
        const { title, content, folder_id, is_pinned, tagIds } = data;

        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const noteQuery = `
                INSERT INTO notes (user_id, folder_id, title, content, is_pinned)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *
                `;
            const { rows } = await client.query(noteQuery, [
                userId,
                folder_id || null,
                title,
                content,
                is_pinned || false
            ]);
            const newNote = rows[0];

            if (tagIds && tagIds.length > 0) {
                const junctionQueries = tagIds.map(tagId => {
                    return client.query(
                        'INSERT INTO note_tags (note_id, tag_id) VALUES ($1, $2)',
                        [newNote.id, tagId]
                    );
                });
                await Promise.all(junctionQueries);
            }

            await client.query('COMMIT');

            return { ...newNote, tags: tagIds || [] };

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async findAll(userId, { folder_id, isPinned, isArchived, search, tagId, page, limit, sortBy, sortOrder }) {
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

        const archiveStatus = (isArchived === 'true' || isArchived === true);
        params.push(archiveStatus);
        query += ` AND n.is_archived = $${params.length}`;

        if (folder_id === 'null' || folder_id === 'unorganized') {
            query += ` AND n.folder_id IS NULL`;
        } else if (folder_id && folder_id !== 'undefined' && folder_id !== '') {
            params.push(folder_id);
            query += ` AND n.folder_id = $${params.length}`;
        }

        if (isPinned === true || isPinned === 'true') {
            params.push(true);
            query += ` AND n.is_pinned = $${params.length}`;
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

        query += ` GROUP BY n.id`;

        let orderBy = 'n.is_pinned DESC';

        const validSortFields = ['created_at', 'updated_at', 'title'];
        const validSortOrders = ['ASC', 'DESC'];

        const sortField = validSortFields.includes(sortBy) ? sortBy : 'updated_at';
        const sortDir = validSortOrders.includes(sortOrder?.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

        if (sortField === 'title') {
            orderBy += `, n.title ${sortDir}`;
        } else {
            orderBy += `, n.${sortField} ${sortDir}`;
        }

        query += ` ORDER BY ${orderBy}`;

        params.push(limitNum);
        query += ` LIMIT $${params.length}`;

        params.push(offsetNum);
        query += ` OFFSET $${params.length}`;

        const { rows } = await pool.query(query, params);

        return rows.map(row => ({
            ...row,
            tags: row.tags || []
        }));
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
        const { tagIds, ...noteData } = data;
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const noteId = parseInt(id);
            const ownerId = parseInt(userId);

            let updatedNote = null;
            const fields = [];
            const params = [noteId, ownerId];
            let index = 3;

            const allowedColumns = ['title', 'content', 'folder_id', 'is_pinned', 'is_archived'];
            for (const [key, value] of Object.entries(noteData)) {
                if (allowedColumns.includes(key)) {
                    fields.push(`${key} = $${index++}`);
                    params.push(value);
                }
            }

            if (fields.length > 0) {
                const updateQuery = `
                    UPDATE notes
                    SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
                    WHERE id = $1 AND user_id = $2
                    RETURNING *
                    `;
                const { rows } = await client.query(updateQuery, params);
                updatedNote = rows[0];
            } else {
                const { rows } = await client.query(
                    'SELECT * FROM notes WHERE id = $1 AND user_id = $2',
                    [noteId, ownerId]
                );
                updatedNote = rows[0];
            }

            if (!updatedNote) {
                await client.query('ROLLBACK');
                return null;
            }

            if (tagIds !== undefined && Array.isArray(tagIds)) {
                await client.query('DELETE FROM note_tags WHERE note_id = $1', [noteId]);
                if (tagIds.length > 0) {
                    for (const tId of tagIds) {
                        await client.query(
                            'INSERT INTO note_tags (note_id, tag_id) VALUES ($1, $2)',
                            [noteId, tId]
                        );
                    }
                }
            }

            await client.query('COMMIT');
            return updatedNote;

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async delete(id, userId) {
        const query = 'DELETE FROM notes WHERE id = $1 AND user_id = $2';
        const { rowCount } = await pool.query(query, [id, userId]);
        return rowCount > 0;
    }
}

module.exports = new NoteRepository();

