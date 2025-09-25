// Centro de Trabajo route schemas for validation
const centroTrabajoSchemas = {
    getCentroTrabajo: {
        params: {
            type: 'object',
            required: ['id'],
            properties: {
                id: { type: 'string', format: 'uuid' }
            }
        }
    },

    getAllCentrosTrabajo: {
        querystring: {
            type: 'object',
            properties: {
                activo: { type: 'boolean' },
                codigo: { type: 'string' },
                nombre: { type: 'string' },
                limit: { type: 'integer', minimum: 1, maximum: 100 },
                offset: { type: 'integer', minimum: 0 }
            }
        }
    }
};

async function centroTrabajoRoutes(fastify, options) {
    const { centroTrabajoController } = options;

    // Get all centros de trabajo
    fastify.get('/centros-trabajo', {
        schema: centroTrabajoSchemas.getAllCentrosTrabajo
    }, async (request, reply) => {
        return centroTrabajoController.getAllCentrosTrabajo(request, reply);
    });

    // Get active centros de trabajo (shortcut endpoint)
    fastify.get('/centros-trabajo/active', async (request, reply) => {
        return centroTrabajoController.getActiveCentrosTrabajo(request, reply);
    });

    // Get centro de trabajo by ID
    fastify.get('/centros-trabajo/:id', {
        schema: centroTrabajoSchemas.getCentroTrabajo
    }, async (request, reply) => {
        return centroTrabajoController.getCentroTrabajo(request, reply);
    });
}

module.exports = centroTrabajoRoutes;
