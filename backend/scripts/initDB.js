const pool = require('../config/db');

const initDb = async () => {
    const client = await pool.connect();
    try {
        console.log('drop existing tables');
        await client.query(`
            DROP TABLE IF EXISTS note_tags;
            DROP TABLE IF EXISTS tags;
            DROP TABLE IF EXISTS notes;
            DROP TABLE IF EXISTS folders;
            DROP TABLE IF EXISTS users;
        `);

        console.log('create new tables');

        const schema = `
            CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE folders (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            name VARCHAR(100) NOT NULL,
            color VARCHAR(7) DEFAULT '#808080',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE notes (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            folder_id INTEGER REFERENCES folders(id) ON DELETE SET NULL,
            title VARCHAR(255) NOT NULL,
            content TEXT,
            is_archived BOOLEAN DEFAULT false,
            is_pinned BOOLEAN DEFAULT false,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE tags (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            name VARCHAR(50) NOT NULL,
            UNIQUE(user_id, name)
            );

            CREATE TABLE note_tags (
            note_id INTEGER REFERENCES notes(id) ON DELETE CASCADE,
            tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
            PRIMARY KEY (note_id, tag_id)
            );
            `;

        await client.query(schema);
        console.log('database schema initialized');

    } catch (err) {
        console.error('error initializing schema', err.stack);
    } finally {
        client.release();
        await pool.end();
    }
};

initDb();

