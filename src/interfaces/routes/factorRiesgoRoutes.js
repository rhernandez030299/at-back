// FactorRiesgo route schemas for validation
const factorRiesgoSchemas = {
    getAllFactoresRiesgo: {
        response: {
            200: {
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    data: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: { type: 'string', format: 'uuid' },
                                nombre: { type: 'string' },
                                descripcion: { type: 'string' },
                                nivelPeligrosidad: { type: 'string' },
                                requiereEpp: { type: 'boolean' },
                                requiereCapacitacion: { type: 'boolean' },
                                activo: { type: 'boolean' },
                                createdAt: { type: 'string', format: 'date-time' },
                                updatedAt: { type: 'string', format: 'date-time' }
                            }
                        }
                    }
                }
            }
        }
    },

    getActiveFactoresRiesgo: {
        response: {
            200: {
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    data: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: { type: 'string', format: 'uuid' },
                                nombre: { type: 'string' },
                                descripcion: { type: 'string' },
                                nivelPeligrosidad: { type: 'string' },
                                requiereEpp: { type: 'boolean' },
                                requiereCapacitacion: { type: 'boolean' },
                                activo: { type: 'boolean' },
                                createdAt: { type: 'string', format: 'date-time' },
                                updatedAt: { type: 'string', format: 'date-time' }
                            }
                        }
                    }
                }
            }
        }
    }
};

async function factorRiesgoRoutes(fastify, options) {
    const { factorRiesgoController } = options;

    // Get all factores de riesgo
    fastify.get('/factores-riesgo', {
        schema: factorRiesgoSchemas.getAllFactoresRiesgo
    }, async (request, reply) => {
        return factorRiesgoController.getAllFactoresRiesgo(request, reply);
    });

    // Get active factores de riesgo only
    fastify.get('/factores-riesgo/active', {
        schema: factorRiesgoSchemas.getActiveFactoresRiesgo
    }, async (request, reply) => {
        return factorRiesgoController.getActiveFactoresRiesgo(request, reply);
    });
}

module.exports = factorRiesgoRoutes;
