// Ciudad route schemas for validation
const ciudadSchemas = {
    getAllCiudades: {
        querystring: {
            type: 'object',
            properties: {
                nombre: { type: 'string' },
                codigo: { type: 'string' },
                departamentoId: { type: 'string', format: 'uuid' },
                limit: { type: 'integer', minimum: 1, maximum: 100 },
                offset: { type: 'integer', minimum: 0 }
            }
        }
    },

    getCiudadesByDepartamento: {
        params: {
            type: 'object',
            required: ['departamentoId'],
            properties: {
                departamentoId: { type: 'string', format: 'uuid' }
            }
        },
        querystring: {
            type: 'object',
            properties: {
                nombre: { type: 'string' },
                codigo: { type: 'string' },
                limit: { type: 'integer', minimum: 1, maximum: 100 },
                offset: { type: 'integer', minimum: 0 }
            }
        }
    }
};

async function ciudadRoutes(fastify, options) {
    const { ciudadController } = options;

    // Get all ciudades with optional filters
    fastify.get('/ciudades', {
        schema: ciudadSchemas.getAllCiudades,
        handler: ciudadController.getAllCiudades.bind(ciudadController)
    });

    // Get ciudades by departamento ID
    fastify.get('/departamentos/:departamentoId/ciudades', {
        schema: ciudadSchemas.getCiudadesByDepartamento,
        handler: ciudadController.getCiudadesByDepartamento.bind(ciudadController)
    });
}

module.exports = ciudadRoutes;
