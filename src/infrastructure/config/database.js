const { Pool } = require('pg');
require('dotenv').config();

class DatabaseConfig {
    constructor() {
        this.pool = null;
    }

    async connect() {
        if (this.pool) {
            return this.pool;
        }

        console.log(process.env.DB_PASSWORD);

        const config = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            database: process.env.DB_NAME || 'at',
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || '123456789',
            max: 20, // Maximum number of clients in the pool
            idleTimeoutMillis: 30000, // How long a client is allowed to remain idle
            connectionTimeoutMillis: 2000, // How long to wait before timing out when connecting
        };

        this.pool = new Pool(config);

        // Test the connection
        try {
            const client = await this.pool.connect();
            console.log('✅ Connected to PostgreSQL database');
            client.release();
        } catch (error) {
            console.error('❌ Failed to connect to PostgreSQL database:', error.message);
            throw error;
        }

        // Handle pool errors
        this.pool.on('error', (err) => {
            console.error('❌ Unexpected error on idle client:', err);
        });

        return this.pool;
    }

    async query(text, params) {
        if (!this.pool) {
            throw new Error('Database not connected. Call connect() first.');
        }
        return this.pool.query(text, params);
    }

    async getClient() {
        if (!this.pool) {
            throw new Error('Database not connected. Call connect() first.');
        }
        return this.pool.connect();
    }

    async close() {
        if (this.pool) {
            await this.pool.end();
            this.pool = null;
            console.log('🔌 Database connection closed');
        }
    }
}

module.exports = DatabaseConfig;
