import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

let dbInstance: Database | null = null;

async function getDb() {
  if (!dbInstance) {
    dbInstance = await open({
      filename: path.join(__dirname, '../../database.sqlite'),
      driver: sqlite3.Database
    });
  }
  return dbInstance;
}

// Wrapper to mimic mysql2 pool.execute
const pool = {
  execute: async (sql: string, params?: any[]) => {
    const db = await getDb();
    const isSelect = sql.trim().toLowerCase().startsWith('select');

    try {
      if (isSelect) {
        const rows = await db.all(sql, params);
        return [rows, []]; // Return rows and empty fields
      } else {
        const result = await db.run(sql, params);
        // Map SQLite result to MySQL-like result
        return [{
          insertId: result.lastID,
          affectedRows: result.changes,
        }, []];
      }
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }
};

export default pool;

