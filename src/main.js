const fastify = require('fastify');
const serverConfig = require('./infrastructure/config/server');
const DIContainer = require('./infrastructure/di/container');
const employeeRoutes = require('./interfaces/routes/employeeRoutes');
const accidentRoutes = require('./interfaces/routes/accidentRoutes');
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
            service: 'employee-management-api'
        };
    });

    // API info endpoint
    app.get('/api/info', async (request, reply) => {
        return {
            name: 'Employee Management API',
            version: '1.0.0',
            description: 'API for managing employee data with Clean Architecture',
            endpoints: {
                employees: {
                    'POST /api/employees': 'Create a new employee',
                    'GET /api/employees': 'Get all employees with optional filters',
                    'GET /api/employees/:id': 'Get employee by ID',
                    'DELETE /api/employees/:id': 'Delete employee by ID'
                },
                accidents: {
                    'POST /api/accidents': 'Create a new accident',
                    'GET /api/accidents': 'Get all accidents with optional filters',
                    'GET /api/accidents/:id': 'Get accident by ID',
                    'PUT /api/accidents/:id': 'Update accident by ID',
                    'DELETE /api/accidents/:id': 'Delete accident by ID',
                    'GET /api/employees/:employeeId/accidents': 'Get accidents by employee'
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
                municipioId: 'UUID of municipio (use /api/ciudades to get list)',
                minSalario: 'number',
                maxSalario: 'number',
                limit: 'number (1-100)',
                offset: 'number'
            }
        };
    });

    // Register employee routes
    await app.register(employeeRoutes, {
        prefix: '/api',
        employeeController: dependencies.employeeController
    });

    // Register accident routes
    await app.register(accidentRoutes, {
        prefix: '/api',
        accidentController: dependencies.accidentController
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
🚀 Employee Management API is running!
📍 Server: http://${serverConfig.host}:${serverConfig.port}
🏥 Health: http://${serverConfig.host}:${serverConfig.port}/health
📖 API Info: http://${serverConfig.host}:${serverConfig.port}/api/info
📚 Employees: http://${serverConfig.host}:${serverConfig.port}/api/employees

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
