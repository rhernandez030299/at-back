const fastify = require('fastify');
const serverConfig = require('./infrastructure/config/server');
const DIContainer = require('./infrastructure/di/container');
const empleadoRoutes = require('./interfaces/routes/empleadoRoutes');
const accidenteRoutes = require('./interfaces/routes/accidenteRoutes');
const centroTrabajoRoutes = require('./interfaces/routes/centroTrabajoRoutes');
const departamentoRoutes = require('./interfaces/routes/departamentoRoutes');
const ciudadRoutes = require('./interfaces/routes/ciudadRoutes');

async function createServer() {
    // Create Fastify instance
    const app = fastify({
        logger: serverConfig.logger
    });

    // Initialize dependency injection container
    const container = new DIContainer();
    const dependencies = await container.initialize();

    // Register CORS (if needed for frontend integration)
    await app.register(require('@fastify/cors'), {
        origin: true,
        credentials: true
    });

    // Health check endpoint
    app.get('/health', async (request, reply) => {
        return { 
            status: 'ok', 
            timestamp: new Date().toISOString(),
            service: 'empleado-management-api'
        };
    });

    // API info endpoint
    app.get('/api/info', async (request, reply) => {
        return {
            name: 'Empleado Management API',
            version: '1.0.0',
            description: 'API for managing empleado data with Clean Architecture',
            endpoints: {
                empleados: {
                    'POST /api/empleados': 'Create a new empleado',
                    'GET /api/empleados': 'Get all empleados with optional filters',
                    'GET /api/empleados/:id': 'Get empleado by ID',
                    'DELETE /api/empleados/:id': 'Delete empleado by ID'
                },
                centrosTrabajo: {
                    'GET /api/centros-trabajo': 'Get all centros de trabajo with optional filters',
                    'GET /api/centros-trabajo/active': 'Get only active centros de trabajo',
                    'GET /api/centros-trabajo/:id': 'Get centro de trabajo by ID'
                },
                departamentos: {
                    'GET /api/departamentos': 'Get all departamentos with optional filters',
                    'GET /api/departamentos/:id': 'Get departamento by ID'
                },
                ciudades: {
                    'GET /api/ciudades': 'Get all ciudades with optional filters',
                    'GET /api/departamentos/:departamentoId/ciudades': 'Get ciudades by departamento ID'
                }
            },
            availableFilters: {
                centroTrabajoId: 'UUID of centro de trabajo (use /api/centros-trabajo/active to get list)',
                sexo: ['M', 'F'],
                ciudadId: 'UUID of ciudad (use /api/ciudades to get list)',
                minSalario: 'number',
                maxSalario: 'number',
                limit: 'number (1-100)',
                offset: 'number'
            }
        };
    });

    // Register empleado routes
    await app.register(empleadoRoutes, {
        prefix: '/api',
        empleadoController: dependencies.empleadoController
    });

    // Register accidente routes
    await app.register(accidenteRoutes, {
        prefix: '/api',
        accidenteController: dependencies.accidenteController
    });

    // Register centro trabajo routes
    await app.register(centroTrabajoRoutes, {
        prefix: '/api',
        centroTrabajoController: dependencies.centroTrabajoController
    });

    // Register departamento routes
    await app.register(departamentoRoutes, {
        prefix: '/api',
        departamentoController: dependencies.departamentoController
    });

    // Register ciudad routes
    await app.register(ciudadRoutes, {
        prefix: '/api',
        ciudadController: dependencies.ciudadController
    });

    // Global error handler
    app.setErrorHandler((error, request, reply) => {
        const statusCode = error.statusCode || 500;
        
        app.log.error(error);
        
        reply.code(statusCode).send({
            success: false,
            error: error.message || 'Internal Server Error',
            statusCode
        });
    });

    // Graceful shutdown
    const gracefulShutdown = async () => {
        app.log.info('Starting graceful shutdown...');
        
        try {
            await app.close();
            await container.close();
            app.log.info('✅ Server closed successfully');
            process.exit(0);
        } catch (error) {
            app.log.error('❌ Error during shutdown:', error);
            process.exit(1);
        }
    };

    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);

    return app;
}

async function start() {
    try {
        const app = await createServer();
        
        await app.listen({
            port: serverConfig.port,
            host: serverConfig.host
        });

        console.log(`
🚀 Empleado Management API is running!
📍 Server: http://${serverConfig.host}:${serverConfig.port}
🏥 Health: http://${serverConfig.host}:${serverConfig.port}/health
📖 API Info: http://${serverConfig.host}:${serverConfig.port}/api/info
📚 Empleados: http://${serverConfig.host}:${serverConfig.port}/api/empleados

🏗️  Architecture: Clean Architecture with Hexagonal pattern
💾 Database: PostgreSQL
🔧 Framework: Fastify
        `);

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Start the server if this file is run directly
if (require.main === module) {
    start();
}

module.exports = { createServer, start };
