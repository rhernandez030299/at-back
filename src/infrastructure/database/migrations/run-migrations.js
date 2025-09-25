const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runMigrations() {
    const client = new Client({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'employee_management',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '123456789',
    });

    try {
        await client.connect();
        console.log('Connected to PostgreSQL database');

        // Create migrations table if it doesn't exist
        await client.query(`
            CREATE TABLE IF NOT EXISTS migrations (
                id SERIAL PRIMARY KEY,
                filename VARCHAR(255) NOT NULL UNIQUE,
                executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Get list of migration files
        const migrationsDir = path.join(__dirname);
        const migrationFiles = fs.readdirSync(migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort();

        console.log('Found migration files:', migrationFiles);

        // Check which migrations have already been executed
        const { rows: executedMigrations } = await client.query(
            'SELECT filename FROM migrations'
        );
        const executedFilenames = executedMigrations.map(row => row.filename);

        // Execute pending migrations
        for (const filename of migrationFiles) {
            if (!executedFilenames.includes(filename)) {
                console.log(`Executing migration: ${filename}`);
                
                const migrationPath = path.join(migrationsDir, filename);
                const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
                
                await client.query('BEGIN');
                try {
                    await client.query(migrationSQL);
                    await client.query(
                        'INSERT INTO migrations (filename) VALUES ($1)',
                        [filename]
                    );
                    await client.query('COMMIT');
                    console.log(`✅ Migration ${filename} executed successfully`);
                } catch (error) {
                    await client.query('ROLLBACK');
                    throw error;
                }
            } else {
                console.log(`⏭️  Migration ${filename} already executed`);
            }
        }

        console.log('All migrations completed successfully');
    } catch (error) {
        console.error('Migration error:', error);
        process.exit(1);
    } finally {
        await client.end();
    }
}

// Run migrations if this file is executed directly
if (require.main === module) {
    runMigrations();
}

module.exports = { runMigrations };
