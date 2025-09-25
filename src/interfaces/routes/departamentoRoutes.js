// Departamento route schemas for validation
const departamentoSchemas = {
    getAllDepartamentos: {
        querystring: {
            type: 'object',
            properties: {
                nombre: { type: 'string' },
                codigo: { type: 'string' },
                limit: { type: 'integer', minimum: 1, maximum: 100 },
                offset: { type: 'integer', minimum: 0 }
            }
        }
    },

    getDepartamento: {
        params: {
            type: 'object',
            required: ['id'],
            properties: {
                id: { type: 'string', format: 'uuid' }
            }
        }
    }
};

async function departamentoRoutes(fastify, options) {
    const { departamentoController } = options;

    // Get all departamentos with optional filters
    fastify.get('/departamentos', {
        schema: departamentoSchemas.getAllDepartamentos,
        handler: departamentoController.getAllDepartamentos.bind(departamentoController)
    });

    // Get departamento by ID
    fastify.get('/departamentos/:id', {
        schema: departamentoSchemas.getDepartamento,
        handler: departamentoController.getDepartamento.bind(departamentoController)
    });
}

module.exports = departamentoRoutes;

