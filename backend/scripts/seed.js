const pool = require('../config/db');
const logger = require('../src/utils/logger');
const bcrypt = require('bcrypt');

const seedData = async () => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        logger.info('Clearing all tables');
        await client.query('DELETE FROM note_tags');
        await client.query('DELETE FROM notes');
        await client.query('DELETE FROM tags');
        await client.query('DELETE FROM folders');
        await client.query('DELETE FROM users');

        logger.info('Inserting user');
        const user = {
            id: 1,
            username: 'Jimi Shrestha',
            email: 'jimi@gmail.com',
            password: 'jimi1234'
        };
        const passwordHash = await bcrypt.hash(user.password, 10);

        await client.query(`
            INSERT INTO users (id, username, email, password_hash)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (id) DO UPDATE SET
                username = EXCLUDED.username,
                email = EXCLUDED.email,
                password_hash = EXCLUDED.password_hash
        `, [user.id, user.username, user.email, passwordHash]);

        logger.info('Inserting folders');
        const folderRes = await client.query(`
            INSERT INTO folders (user_id, name, color) VALUES
            ($1, 'Engineering', '#2ecc71'),
            ($1, 'Marketing', '#e67e22'),
            ($1, 'Personal', '#9b59b6'),
            ($1, 'Finance', '#f1c40f')
            RETURNING id, name
        `, [user.id]);
        const [engId, markId, persId, finId] = folderRes.rows.map(r => r.id);

        logger.info('Inserting tags');
        const tagRes = await client.query(`
            INSERT INTO tags (user_id, name) VALUES
            ($1, 'Urgent'), ($1, 'Backlog'), ($1, 'React'),
            ($1, 'NodeJS'), ($1, 'Verified'), ($1, 'Tax')
            RETURNING id, name
        `, [user.id]);
        const tags = {};
        tagRes.rows.forEach(t => tags[t.name] = t.id);

        logger.info('Inserting notes');
        const notesRes = await client.query(`
            INSERT INTO notes (user_id, folder_id, title, content, is_pinned, is_archived) VALUES
            ($1, $2, 'API Documentation', 'Main API endpoints', true, false),
            ($1, $2, 'React Hooks Guide', 'useMemo and useCallback', false, false),
            ($1, $3, 'Social Media Strategy', 'LinkedIn and Twitter', true, false),
            ($1, $4, 'Tax Returns 2025', 'File before April 15th', true, false)
            RETURNING id, title
        `, [user.id, engId, markId, finId]);

        logger.info('Linking tags to notes');
        const noteRows = notesRes.rows;
        const links = [
            [noteRows[0].id, tags['Urgent']],
            [noteRows[0].id, tags['NodeJS']],
            [noteRows[3].id, tags['Tax']]
        ];

        for (const [nId, tId] of links) {
            await client.query('INSERT INTO note_tags (note_id, tag_id) VALUES ($1, $2)', [nId, tId]);
        }

        await client.query("SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))");
        await client.query("SELECT setval('folders_id_seq', (SELECT MAX(id) FROM folders))");
        await client.query("SELECT setval('tags_id_seq', (SELECT MAX(id) FROM tags))");
        await client.query("SELECT setval('notes_id_seq', (SELECT MAX(id) FROM notes))");

        await client.query('COMMIT');
        logger.info('Database seeding completed successfully');

    } catch (err) {
        await client.query('ROLLBACK');
        logger.error('Seed error - Transaction rolled back', {
            error: err.message,
            stack: err.stack,
        });
    } finally {
        client.release();
        await pool.end();
    }
};

seedData();

