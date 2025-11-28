
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function checkDb() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            port: parseInt(process.env.DB_PORT || '3306'),
        });

        console.log('Connected to MySQL server');

        const [rows] = await connection.execute(`SHOW DATABASES LIKE '${process.env.DB_NAME || 'career_compass'}'`);
        if ((rows as any[]).length === 0) {
            console.error(`Database ${process.env.DB_NAME || 'career_compass'} does not exist`);
            process.exit(1);
        }
        console.log(`Database ${process.env.DB_NAME || 'career_compass'} exists`);

        await connection.changeUser({ database: process.env.DB_NAME || 'career_compass' });

        const [tables] = await connection.execute('SHOW TABLES');
        console.log('Tables:', tables);

        await connection.end();
    } catch (error) {
        console.error('Database check failed:', error);
        process.exit(1);
    }
}

checkDb();
