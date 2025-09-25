require('dotenv').config();

const serverConfig = {
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 3000,
    logger: process.env.NODE_ENV === 'production' 
        ? { level: process.env.LOG_LEVEL || 'info' }
        : true  // Simple logger for development
};

module.exports = serverConfig;
