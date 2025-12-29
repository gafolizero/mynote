const pool = require('../config/db');
const logger = require('../src/utils/logger');

const seedData = async () => {
    const client = await pool.connect();
    try {
        logger.info('Clearing all tables');
        await client.query('DELETE FROM note_tags');
        await client.query('DELETE FROM notes');
        await client.query('DELETE FROM tags');
        await client.query('DELETE FROM folders');

        const userId = 1;

        logger.info('Inserting folders');
        const folderRes = await client.query(`
INSERT INTO folders (user_id, name, color) VALUES
($1, 'Engineering', '#2ecc71'),
($1, 'Marketing', '#e67e22'),
($1, 'Personal', '#9b59b6'),
($1, 'Finance', '#f1c40f')
RETURNING id, name
`, [userId]);
        const [engId, markId, persId, finId] = folderRes.rows.map(r => r.id);

        logger.info('Inserting tags');
        const tagRes = await client.query(`
INSERT INTO tags (user_id, name) VALUES
($1, 'Urgent'), ($1, 'Backlog'), ($1, 'React'),
($1, 'NodeJS'), ($1, 'Verified'), ($1, 'Tax')
RETURNING id, name
`, [userId]);
        const tags = {};
        tagRes.rows.forEach(t => tags[t.name] = t.id);

        const notesRes = await client.query(`
INSERT INTO notes (user_id, folder_id, title, content, is_pinned, is_archived) VALUES
($1, $2, 'API Documentation', 'Main API endpoints for Notes app', true, false),
($1, $2, 'React Hooks Guide', 'Best practices for useMemo and useCallback', false, false),
($1, $2, 'Legacy PHP Code', 'Old code to be deleted eventually', false, true),
($1, $3, 'Social Media Strategy', 'Focus on LinkedIn and Twitter', true, false),
($1, $4, 'Q4 Budget', 'Projection for server costs', false, false),
($1, $5, 'Shopping List', 'Milk, Bread, Butter', false, false),
($1, null, 'Unsorted Idea 1', 'Build a mobile version', false, false),
($1, null, 'Unsorted Idea 2', 'Integrate AI summarizing', false, false),
($1, $2, 'Database Optimization', 'Add indexes to note_tags table', true, false),
($1, $2, 'NodeJS Worker Threads', 'Handling heavy CPU tasks', false, false),
($1, $3, 'Brand Guidelines', 'Hex codes and logo variants', false, false),
($1, $4, 'Tax Returns 2025', 'File before April 15th', true, false),
($1, $2, 'Frontend Bug: CSS', 'Fix the alignment on mobile', false, false),
($1, $2, 'Postman Tests', 'Collection for Auth testing', false, false),
($1, $2, 'Security Audit', 'Check for SQL injection vulnerabilities', true, false)
RETURNING id, title
`, [userId, engId, markId, finId, persId]);

        const noteRows = notesRes.rows;

        logger.info('Linking tags to notes');
        const links = [
            [noteRows[0].id, tags['Urgent']], [noteRows[0].id, tags['NodeJS']], // API Doc is Urgent & NodeJS
            [noteRows[1].id, tags['React']], [noteRows[1].id, tags['Verified']], // React Guide is React & Verified
            [noteRows[8].id, tags['NodeJS']], [noteRows[8].id, tags['Urgent']], // DB Opt is Urgent & NodeJS
            [noteRows[9].id, tags['NodeJS']],
            [noteRows[11].id, tags['Tax']], [noteRows[11].id, tags['Urgent']]  // Tax is Urgent & Tax
        ];

        for (const [nId, tId] of links) {
            await client.query('INSERT INTO note_tags (note_id, tag_id) VALUES ($1, $2)', [nId, tId]);
        }

        logger.info('Database seeding completed successfully');
    } catch (err) {
        logger.error('Seed error', {
            error: err.message,
            stack: err.stack,
        });
    } finally {
        client.release();
        await pool.end();
    }
};

seedData();

