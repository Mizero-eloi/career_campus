
import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function initDb() {
    const dbPath = path.join(__dirname, '../../database.sqlite');
    const schemaPath = path.join(__dirname, '../../database/schema_sqlite.sql');

    console.log(`Initializing database at ${dbPath}...`);

    try {
        const db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Split by semicolon to run statements individually, as sqlite.exec might not handle multiple statements well in all drivers, 
        // but db.exec usually handles scripts. Let's try db.exec first.
        await db.exec(schema);

        console.log('Database initialized successfully.');
    } catch (error) {
        console.error('Failed to initialize database:', error);
        process.exit(1);
    }
}

initDb();
